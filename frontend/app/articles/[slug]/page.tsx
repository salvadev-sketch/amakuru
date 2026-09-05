import type { Metadata } from "next";
import { apiUrl } from "@/lib/api";
import type { ArticleDetail } from "@/lib/types";
import ArticleView from "./ArticleView";

async function fetchArticle(slug: string): Promise<ArticleDetail | null> {
  try {
    const res = await fetch(apiUrl(`/api/articles/${slug}`), { next: { revalidate: 300 } });
    if (!res.ok) return null;
    const data = await res.json();
    return data.article ?? null;
  } catch {
    return null; // backend unreachable — page will still render and show its own not-found state
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const article = await fetchArticle(slug);

  if (!article) {
    return { title: "Article not found" };
  }

  const title = article.seoTitle || article.title;
  const description = article.seoDescription || article.dek;
  const image = article.coverImage?.secureUrl;

  return {
    title,
    description,
    alternates: { canonical: `/articles/${article.slug}` },
    openGraph: {
      type: "article",
      title,
      description,
      url: `/articles/${article.slug}`,
      publishedTime: article.publishedAt,
      authors: article.author?.name ? [article.author.name] : undefined,
      images: image ? [{ url: image }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <ArticleView slug={slug} />;
}
