"use client";

import SiteChrome from "@/components/site/SiteChrome";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";

export default function AboutPage() {
  const { settings } = useSiteSettings();

  return (
    <SiteChrome>
      <div className="mx-auto max-w-[760px] px-4 py-9 sm:px-8">
        <div className="mb-7 border-b-[3px] border-ink pb-4">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">About</span>
          <h1 className="font-display text-[34px] font-semibold text-ink">
            About {settings?.siteName || "Amakuru"}
          </h1>
        </div>

        <div className="space-y-5 text-[15px] leading-relaxed text-charcoal">
          <p>
            {settings?.tagline ||
              "Amakuru is an independent newsroom covering the Great Lakes region, reported in English, French, and Kirundi."}
          </p>
          <p>
            We cover politics, business, culture, and sport with a focus on stories that matter to
            readers across the region — not just the headlines that travel best internationally. Our
            newsroom is small, deliberately so: every story that runs has been read, checked, and
            signed off by a real editor before it's published.
          </p>
          <p>
            We're funded by advertising and, where relevant, reader support — never by political
            parties, governments, or corporate sponsors with a stake in how a story is told. See our{" "}
            <a href="/ethics" className="text-teal underline underline-offset-2 hover:text-brand-dark">
              editorial standards
            </a>{" "}
            for more on how we separate reporting from advertising and handle corrections.
          </p>
          <p>
            Have a story tip, a correction to flag, or feedback on our coverage? We'd rather hear it
            than not —{" "}
            <a
              href={`mailto:${settings?.contactEmail || "hello@amakuru.news"}`}
              className="text-teal underline underline-offset-2 hover:text-brand-dark"
            >
              get in touch
            </a>
            .
          </p>
        </div>
      </div>
    </SiteChrome>
  );
}
