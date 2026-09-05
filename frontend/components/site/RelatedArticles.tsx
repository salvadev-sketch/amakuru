"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";
import type { ArticleSummary } from "@/lib/types";
import ArticleCard from "@/components/site/ArticleCard";

export default function RelatedArticles({ articleId }: { articleId: string }) {
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(apiUrl(`/api/articles/${articleId}/related?limit=4`));
        const data = await res.json();
        if (!cancelled) setArticles(data.articles ?? []);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [articleId]);

  if (loading || articles.length === 0) return null;

  return (
    <section className="mt-10 border-t border-line pt-8">
      <h2 className="mb-5 font-display text-lg font-semibold text-ink">Read next</h2>
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
        {articles.map((a) => (
          <ArticleCard key={a._id} article={a} />
        ))}
      </div>
    </section>
  );
}
