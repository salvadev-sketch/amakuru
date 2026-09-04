"use client";

import { useEffect, useState } from "react";
import { apiUrl } from "@/lib/api";

export type SiteSettings = {
  siteName: string;
  tagline?: string;
  logoUrl?: string;
  contactEmail?: string;
  socialLinks: {
    twitter?: string;
    facebook?: string;
    instagram?: string;
  };
};

/**
 * Fetches the public GET /api/settings singleton (siteName, tagline,
 * contactEmail, socialLinks). Used by the footer's social row and the
 * About/Contact pages so those stay driven by whatever's set in
 * /admin/settings instead of being hardcoded.
 */
export function useSiteSettings(): { settings: SiteSettings | null; loading: boolean } {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(apiUrl("/api/settings"));
        const data = await res.json();
        if (!cancelled) setSettings(data.settings ?? null);
      } catch {
        // Settings are non-critical for rendering — pages fall back to
        // sensible defaults if this fails, so just leave settings null.
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return { settings, loading };
}
