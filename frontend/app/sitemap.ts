import type { MetadataRoute } from "next";
import { apiUrl } from "@/lib/api";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600; // regenerate at most once an hour

const STATIC_ROUTES = ["", "/about", "/ethics", "/careers", "/contact", "/category"];
const CATEGORY_SLUGS = ["politics", "business", "culture", "sport"];

async function fetchAllPublishedArticles(): Promise<{ slug: string; updatedAt: string }[]> {
  const articles: { slug: string; updatedAt: string }[] = [];
  const limit = 100;
  let page = 1;

  // The backend caps limit at 50 (see GET /api/articles), so page through
  // it fully rather than assuming a single request covers everything.
  while (true) {
    let data: any;
    try {
      const res = await fetch(apiUrl(`/api/articles?limit=${limit}&page=${page}`), {
        next: { revalidate: 3600 },
      });
      if (!res.ok) break;
      data = await res.json();
    } catch {
      break; // backend unreachable at build time — ship a partial sitemap rather than fail the build
    }

    for (const a of data.articles ?? []) {
      if (a.slug) articles.push({ slug: a.slug, updatedAt: a.updatedAt || a.publishedAt || a.createdAt });
    }

    const totalPages = data.pagination?.totalPages ?? 1;
    if (page >= totalPages || (data.articles?.length ?? 0) === 0) break;
    page += 1;
  }

  return articles;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [articles] = await Promise.all([fetchAllPublishedArticles()]);

  const staticEntries: MetadataRoute.Sitemap = STATIC_ROUTES.map((route) => ({
    url: `${SITE_URL}${route}`,
    changeFrequency: route === "" ? "hourly" : "monthly",
    priority: route === "" ? 1 : 0.5,
  }));

  const categoryEntries: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${SITE_URL}/category/${slug}`,
    changeFrequency: "hourly",
    priority: 0.7,
  }));

  const articleEntries: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${SITE_URL}/articles/${a.slug}`,
    lastModified: a.updatedAt ? new Date(a.updatedAt) : undefined,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...categoryEntries, ...articleEntries];
}
