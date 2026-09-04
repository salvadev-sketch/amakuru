"use client";

import SiteChrome from "@/components/site/SiteChrome";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";

export default function CareersPage() {
  const { settings } = useSiteSettings();

  return (
    <SiteChrome>
      <div className="mx-auto max-w-[760px] px-4 py-9 sm:px-8">
        <div className="mb-7 border-b-[3px] border-ink pb-4">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Careers</span>
          <h1 className="font-display text-[34px] font-semibold text-ink">Work with us</h1>
        </div>

        <div className="space-y-5 text-[15px] leading-relaxed text-charcoal">
          <p>
            We're a small, independent newsroom, and we grow the team when a story or a season calls
            for it rather than on a fixed schedule. There are no open roles listed right now.
          </p>
          <p>
            That said, we're always glad to hear from reporters, editors, and contributors who care
            about accurate, independent coverage of the Great Lakes region — especially if you write
            in Kirundi, French, or English and know a beat we don't currently cover well.
          </p>
          <p>
            Send a short note about yourself, links to a few pieces you're proud of, and what you'd
            want to cover for us to{" "}
            <a
              href={`mailto:${settings?.contactEmail || "hello@amakuru.news"}`}
              className="text-teal underline underline-offset-2 hover:text-brand-dark"
            >
              {settings?.contactEmail || "hello@amakuru.news"}
            </a>
            . We read everything, even when we can't reply right away.
          </p>
        </div>
      </div>
    </SiteChrome>
  );
}
