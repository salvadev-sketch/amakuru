/**
 * Public base URL of the deployed frontend, used for absolute URLs in
 * sitemap.xml, robots.txt, and Open Graph/Twitter Card meta tags.
 *
 * Set NEXT_PUBLIC_SITE_URL in your environment (e.g. https://amakuru.news).
 * Like other NEXT_PUBLIC_* vars, changing it requires a full redeploy, not
 * just a save — it's baked in at build time.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || "https://amakuru.news").replace(/\/$/, "");
