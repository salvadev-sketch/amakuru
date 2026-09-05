"use client";

import SiteChrome from "@/components/site/SiteChrome";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { ethicsContent } from "@/lib/i18n/pageContent";

export default function EthicsPage() {
  const { settings } = useSiteSettings();
  const { language } = useLanguage();
  const c = ethicsContent[language];
  const email = settings?.contactEmail || "hello@amakuru.news";

  return (
    <SiteChrome>
      <div className="mx-auto max-w-[760px] px-4 py-9 sm:px-8">
        <div className="mb-7 border-b-[3px] border-ink pb-4">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">{c.label}</span>
          <h1 className="font-display text-[34px] font-semibold text-ink">{c.heading}</h1>
        </div>

        <p className="mb-6 text-[15px] leading-relaxed text-charcoal">{c.intro}</p>

        <div className="space-y-6">
          {c.principles.map((p) => (
            <div key={p.title} className="border-l-2 border-teal pl-4">
              <h2 className="mb-1 font-display text-lg font-semibold text-ink">{p.title}</h2>
              <p className="text-[15px] leading-relaxed text-charcoal">{p.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted">
          {c.contactPrefix}{" "}
          <a href={`mailto:${email}`} className="text-teal underline underline-offset-2 hover:text-brand-dark">
            {email}
          </a>
          .
        </p>
      </div>
    </SiteChrome>
  );
}
