"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search as SearchIcon } from "lucide-react";
import { apiUrl } from "@/lib/api";
import type { ArticleSummary } from "@/lib/types";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import SiteChrome from "@/components/site/SiteChrome";
import ArticleCard from "@/components/site/ArticleCard";

type Pagination = { page: number; limit: number; total: number; totalPages: number };

function SearchResults() {
  const { t } = useLanguage();
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));

  const [inputValue, setInputValue] = useState(query);
  const [articles, setArticles] = useState<ArticleSummary[]>([]);
  const [pagination, setPagination] = useState<Pagination | null>(null);
  const [loading, setLoading] = useState(!!query);

  useEffect(() => {
    setInputValue(query);
    if (!query) {
      setArticles([]);
      setPagination(null);
      return;
    }
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const res = await fetch(
          apiUrl(`/api/articles?search=${encodeURIComponent(query)}&page=${page}&limit=12`)
        );
        const data = await res.json();
        if (cancelled) return;
        setArticles(data.articles || []);
        setPagination(data.pagination || null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [query, page]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = inputValue.trim();
    if (!q) return;
    router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  function goToPage(p: number) {
    router.push(`/search?q=${encodeURIComponent(query)}&page=${p}`);
  }

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-9 sm:px-8">
      <div className="mb-7 border-b-[3px] border-ink pb-4">
        <span className="font-mono text-xs uppercase tracking-wide text-muted">
          {query ? `${t("searchResultsFor")} "${query}"` : t("searchButton")}
        </span>
        <h1 className="font-display text-[34px] font-semibold text-ink">
          {pagination ? `${pagination.total} result${pagination.total === 1 ? "" : "s"}` : t("searchButton")}
        </h1>
      </div>

      <form onSubmit={submit} className="mb-8 flex max-w-md items-center gap-2">
        <div className="flex flex-1 items-center gap-2 rounded border border-line bg-white px-3 py-2 focus-within:border-teal">
          <SearchIcon size={16} className="shrink-0 text-muted" />
          <input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={t("searchPlaceholder")}
            className="w-full bg-transparent text-sm text-ink outline-none"
          />
        </div>
        <button
          type="submit"
          className="rounded bg-teal px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-dark"
        >
          {t("searchButton")}
        </button>
      </form>

      {loading && <p className="py-16 text-center font-mono text-sm text-muted">{t("searchLoading")}</p>}

      {!loading && query && articles.length === 0 && (
        <p className="py-16 text-center font-mono text-sm text-muted">{t("searchNoResults")}</p>
      )}

      {!loading && articles.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {articles.map((a) => (
              <ArticleCard key={a._id} article={a} />
            ))}
          </div>

          {pagination && pagination.totalPages > 1 && (
            <div className="mt-10 flex items-center justify-center gap-2 font-mono text-sm">
              {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  onClick={() => goToPage(p)}
                  className={`h-8 w-8 rounded ${
                    p === pagination.page ? "bg-teal text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default function SearchPage() {
  return (
    <SiteChrome>
      <Suspense fallback={<div className="py-16 text-center font-mono text-sm text-muted">Loading…</div>}>
        <SearchResults />
      </Suspense>
    </SiteChrome>
  );
}
