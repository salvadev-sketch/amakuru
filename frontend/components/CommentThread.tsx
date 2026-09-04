// Drop this into the public article page: <CommentThread articleId={article._id} />
"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useAuthUser } from "@/lib/hooks/useAuthUser";
import { apiUrl } from "@/lib/api";
import CommentItem, { CommentNode } from "./CommentItem";

type SortMode = "top" | "newest";

function buildTree(flat: (Omit<CommentNode, "replies"> & { parentComment?: string | null })[]): CommentNode[] {
  const byId = new Map<string, CommentNode>();
  flat.forEach((c) => byId.set(c._id, { ...c, replies: [] }));

  const roots: CommentNode[] = [];
  flat.forEach((c) => {
    const node = byId.get(c._id)!;
    if (c.parentComment && byId.has(c.parentComment)) {
      byId.get(c.parentComment)!.replies.push(node);
    } else {
      roots.push(node);
    }
  });
  return roots;
}

function countAll(nodes: CommentNode[]): number {
  return nodes.reduce((sum, n) => sum + 1 + countAll(n.replies), 0);
}

function sortTree(nodes: CommentNode[], mode: SortMode): CommentNode[] {
  const sorted = [...nodes].sort((a, b) => {
    if (mode === "top") {
      if (b.likes !== a.likes) return b.likes - a.likes;
    }
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
  return sorted.map((n) => ({ ...n, replies: sortTree(n.replies, mode === "top" ? "newest" : mode) }));
  // Replies always sort oldest-first-by-newest-toggle isn't quite right either —
  // keep replies chronological (newest mode) regardless of the top-level sort,
  // since "Top" ranking mainly matters for which thread you see first.
}

function Avatar({ name, avatarUrl, size = 32 }: { name?: string; avatarUrl?: string; size?: number }) {
  if (avatarUrl) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={avatarUrl}
        alt={name || ""}
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

export default function CommentThread({ articleId }: { articleId: string }) {
  const { profile: user, authedFetch } = useAuthUser();
  const [comments, setComments] = useState<CommentNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [sortMode, setSortMode] = useState<SortMode>("top");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(apiUrl(`/api/articles/${articleId}/comments`));
      const data = await res.json();
      setComments(buildTree(data.comments ?? data));
    } finally {
      setLoading(false);
    }
  }, [articleId]);

  useEffect(() => {
    load();
  }, [load]);

  const totalCount = useMemo(() => countAll(comments), [comments]);
  const sorted = useMemo(() => sortTree(comments, sortMode), [comments, sortMode]);

  async function submit() {
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      await authedFetch(`/api/articles/${articleId}/comments`, {
        method: "POST",
        body: JSON.stringify({ content: newComment.trim() }),
      });
      setNewComment("");
      await load();
    } finally {
      setPosting(false);
    }
  }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg font-semibold text-ink">
          {totalCount > 0 ? `${totalCount} Comment${totalCount === 1 ? "" : "s"}` : "Comments"}
        </h2>

        {totalCount > 0 && (
          <div className="flex items-center gap-1 font-mono text-xs">
            {(["top", "newest"] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setSortMode(mode)}
                className={`rounded-full px-3 py-1 font-semibold capitalize transition-colors ${
                  sortMode === mode ? "bg-teal text-white" : "text-muted hover:text-ink"
                }`}
              >
                {mode}
              </button>
            ))}
          </div>
        )}
      </div>

      {user ? (
        <div className="mt-4 flex items-start gap-2">
          <Avatar name={user.name} avatarUrl={user.avatarUrl} />
          <div className="flex flex-1 gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              placeholder="Join the discussion…"
              className="flex-1 rounded border border-line bg-white px-3 py-2 text-sm text-ink outline-none focus:border-teal"
            />
            <button
              onClick={submit}
              disabled={posting || !newComment.trim()}
              className="rounded bg-teal px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark disabled:opacity-40"
            >
              Post
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-4 text-sm text-muted">Sign in to join the discussion.</p>
      )}

      <div className="mt-5 divide-y divide-line">
        {loading && <p className="py-4 text-sm text-muted">Loading comments…</p>}
        {!loading && comments.length === 0 && (
          <p className="py-4 text-sm text-muted">No comments yet — be the first to say something.</p>
        )}
        {sorted.map((c) => (
          <CommentItem key={c._id} comment={c} articleId={articleId} onChanged={load} />
        ))}
      </div>
    </section>
  );
}
