"use client";

import { useState } from "react";
import { ThumbsUp, ChevronDown, ChevronUp } from "lucide-react";
import { useAuthUser } from "@/lib/hooks/useAuthUser";

export type CommentNode = {
  _id: string;
  content: string;
  status: "approved" | "hidden" | "deleted";
  createdAt: string;
  likes: number;
  hasLiked: boolean;
  author: { _id: string; name: string; avatarUrl?: string };
  replies: CommentNode[];
};

type Props = {
  comment: CommentNode;
  articleId: string;
  depth?: number;
  onChanged: () => void;
};

const STATUS_STYLES: Record<CommentNode["status"], string> = {
  approved: "",
  hidden: "border-l-2 border-amber-deep pl-3 opacity-60",
  deleted: "border-l-2 border-line pl-3 opacity-40",
};

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  const units: [number, string][] = [
    [31536000, "y"],
    [2592000, "mo"],
    [86400, "d"],
    [3600, "h"],
    [60, "m"],
  ];
  for (const [secs, label] of units) {
    const val = Math.floor(seconds / secs);
    if (val >= 1) return `${val}${label} ago`;
  }
  return "just now";
}

function Avatar({ name, avatarUrl, size = 36 }: { name: string; avatarUrl?: string; size?: number }) {
  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={avatarUrl}
        alt={name}
        style={{ width: size, height: size }}
        className="shrink-0 rounded-full object-cover"
      />
    );
  }
  const initial = name?.[0]?.toUpperCase() || "?";
  return (
    <div
      style={{ width: size, height: size }}
      className="flex shrink-0 items-center justify-center rounded-full bg-teal font-mono text-xs font-semibold text-white"
    >
      {initial}
    </div>
  );
}

export default function CommentItem({ comment, articleId, depth = 0, onChanged }: Props) {
  const { profile, authedFetch, isSignedIn } = useAuthUser();
  const [replying, setReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [busy, setBusy] = useState(false);
  const [repliesOpen, setRepliesOpen] = useState(false);

  // Optimistic like state, seeded from the server-provided flags.
  const [liked, setLiked] = useState(comment.hasLiked);
  const [likeCount, setLikeCount] = useState(comment.likes);

  const canModerate = profile?.role === "Admin" || profile?.role === "Editor" || profile?.role === "Moderator";
  const isOwnComment = profile?.id === comment.author._id;

  async function toggleLike() {
    if (!isSignedIn) return;
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((c) => c + (nextLiked ? 1 : -1));
    try {
      const res = await authedFetch(`/api/comments/${comment._id}/like`, { method: "POST" });
      if (!res.ok) throw new Error("like failed");
      const data = await res.json();
      setLiked(data.hasLiked);
      setLikeCount(data.likes);
    } catch {
      setLiked(!nextLiked); // revert on failure
      setLikeCount((c) => c + (nextLiked ? -1 : 1));
    }
  }

  async function submitReply() {
    if (!replyText.trim()) return;
    setBusy(true);
    try {
      await authedFetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: replyText.trim(), parentComment: comment._id }),
      });
      setReplyText("");
      setReplying(false);
      setRepliesOpen(true);
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function updateStatus(status: CommentNode["status"]) {
    setBusy(true);
    try {
      await authedFetch(`/api/comments/${comment._id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    if (!confirm("Delete this comment? Replies will remain but this text will be removed.")) return;
    setBusy(true);
    try {
      await authedFetch(`/api/comments/${comment._id}`, { method: "DELETE" });
      onChanged();
    } finally {
      setBusy(false);
    }
  }

  if (comment.status === "deleted" && !canModerate) return null;

  const replyCount = comment.replies.length;

  return (
    <div className={`py-3 ${STATUS_STYLES[comment.status]}`} style={{ marginLeft: depth * 32 }}>
      <div className="flex gap-3">
        <Avatar name={comment.author.name} avatarUrl={comment.author.avatarUrl} size={depth === 0 ? 36 : 30} />

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted">
            <span className="font-semibold text-ink">{comment.author.name}</span>
            <time>{timeAgo(comment.createdAt)}</time>
            {comment.status !== "approved" && (
              <span className="rounded-full bg-papyrus px-2 py-0.5 text-[10px] text-charcoal">{comment.status}</span>
            )}
          </div>

          <p className="mt-1 whitespace-pre-wrap text-[15px] leading-snug text-charcoal">{comment.content}</p>

          <div className="mt-1.5 flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={toggleLike}
              disabled={!isSignedIn}
              className={`flex items-center gap-1.5 transition-colors ${
                liked ? "text-teal" : "text-muted hover:text-ink"
              } disabled:cursor-not-allowed disabled:opacity-50`}
              aria-label={liked ? "Unlike" : "Like"}
              title={isSignedIn ? undefined : "Sign in to like"}
            >
              <ThumbsUp size={14} strokeWidth={2} fill={liked ? "currentColor" : "none"} />
              {likeCount > 0 && <span className="font-mono">{likeCount}</span>}
            </button>

            <button onClick={() => setReplying((v) => !v)} className="font-semibold text-muted hover:text-ink">
              Reply
            </button>

            {(isOwnComment || canModerate) && (
              <button onClick={remove} disabled={busy} className="text-red-600 hover:text-red-800">
                Delete
              </button>
            )}
            {canModerate && comment.status !== "approved" && (
              <button onClick={() => updateStatus("approved")} disabled={busy} className="text-teal hover:opacity-80">
                Approve
              </button>
            )}
            {canModerate && comment.status !== "hidden" && (
              <button onClick={() => updateStatus("hidden")} disabled={busy} className="text-muted hover:text-ink">
                Hide
              </button>
            )}
          </div>

          {replying && (
            <div className="mt-2 flex items-start gap-2">
              <Avatar name={profile?.name || "You"} avatarUrl={profile?.avatarUrl} size={28} />
              <div className="flex flex-1 gap-2">
                <input
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder={`Reply to ${comment.author.name}…`}
                  autoFocus
                  className="flex-1 rounded border border-line bg-white px-3 py-1.5 text-sm text-ink outline-none focus:border-teal"
                />
                <button
                  onClick={submitReply}
                  disabled={busy || !replyText.trim()}
                  className="rounded bg-teal px-3 py-1.5 text-sm font-semibold text-white disabled:opacity-40"
                >
                  Reply
                </button>
              </div>
            </div>
          )}

          {replyCount > 0 && (
            <button
              onClick={() => setRepliesOpen((v) => !v)}
              className="mt-2 flex items-center gap-1 font-mono text-xs font-semibold text-teal hover:opacity-80"
            >
              {repliesOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              {repliesOpen ? "Hide" : "View"} {replyCount} {replyCount === 1 ? "reply" : "replies"}
            </button>
          )}

          {repliesOpen &&
            comment.replies.map((reply) => (
              <CommentItem key={reply._id} comment={reply} articleId={articleId} depth={depth + 1} onChanged={onChanged} />
            ))}
        </div>
      </div>
    </div>
  );
}
