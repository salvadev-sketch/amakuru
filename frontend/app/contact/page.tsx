"use client";

import { Mail, Twitter, Facebook, Instagram } from "lucide-react";
import SiteChrome from "@/components/site/SiteChrome";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";
import { useLanguage } from "@/lib/i18n/LanguageContext";
import { contactContent } from "@/lib/i18n/pageContent";

export default function ContactPage() {
  const { settings } = useSiteSettings();
  const { language } = useLanguage();
  const c = contactContent[language];
  const email = settings?.contactEmail || "hello@amakuru.news";
  const social = settings?.socialLinks || {};
  const hasSocial = social.twitter || social.facebook || social.instagram;

  return (
    <SiteChrome>
      <div className="mx-auto max-w-[760px] px-4 py-9 sm:px-8">
        <div className="mb-7 border-b-[3px] border-ink pb-4">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">{c.label}</span>
          <h1 className="font-display text-[34px] font-semibold text-ink">{c.heading}</h1>
        </div>

        <div className="space-y-6 text-[15px] leading-relaxed text-charcoal">
          <p>{c.intro}</p>

          <a
            href={`mailto:${email}`}
            className="flex items-center gap-3 rounded border border-line bg-papyrus px-4 py-3 font-mono text-sm text-ink transition-colors hover:border-teal"
          >
            <Mail size={18} strokeWidth={2} className="text-teal" />
            {email}
          </a>

          {hasSocial && (
            <div>
              <h2 className="mb-2 font-mono text-[11px] uppercase tracking-wide text-ink">{c.followUs}</h2>
              <div className="flex items-center gap-2">
                {social.twitter && (
                  <a
                    href={social.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="X (Twitter)"
                    className="flex h-9 w-9 items-center justify-center rounded-sm bg-black text-white transition-colors hover:bg-neutral-800"
                  >
                    <Twitter size={16} strokeWidth={2} />
                  </a>
                )}
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#1877F2] text-white transition-colors hover:bg-[#1465CC]"
                  >
                    <Facebook size={16} strokeWidth={2} />
                  </a>
                )}
                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="flex h-9 w-9 items-center justify-center rounded-sm bg-[#E1306C] text-white transition-colors hover:bg-[#C22A5F]"
                  >
                    <Instagram size={16} strokeWidth={2} />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </SiteChrome>
  );
}
