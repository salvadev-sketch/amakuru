"use client";

import SiteChrome from "@/components/site/SiteChrome";
import { useSiteSettings } from "@/lib/hooks/useSiteSettings";

const PRINCIPLES = [
  {
    title: "Accuracy first",
    body: "We verify facts with at least two independent sources before publishing wherever possible, and we correct errors quickly and visibly rather than quietly editing them away.",
  },
  {
    title: "Independence",
    body: "Our newsroom operates separately from advertisers, sponsors, and any political affiliation. No advertiser sees or approves a story before it runs.",
  },
  {
    title: "Sourcing",
    body: "We name sources whenever we can. Anonymous sources are used only when a story can't otherwise be told safely or truthfully, and editors always know who they are.",
  },
  {
    title: "Corrections",
    body: "When we get something wrong, we say so. Corrected articles carry a visible note explaining what changed and when.",
  },
  {
    title: "Advertising vs. editorial",
    body: "Sponsored or promotional content is always clearly labeled as such and never written or edited by the newsroom team.",
  },
];

export default function EthicsPage() {
  const { settings } = useSiteSettings();

  return (
    <SiteChrome>
      <div className="mx-auto max-w-[760px] px-4 py-9 sm:px-8">
        <div className="mb-7 border-b-[3px] border-ink pb-4">
          <span className="font-mono text-xs uppercase tracking-wide text-muted">Newsroom ethics</span>
          <h1 className="font-display text-[34px] font-semibold text-ink">Editorial Standards</h1>
        </div>

        <p className="mb-6 text-[15px] leading-relaxed text-charcoal">
          These are the standards our newsroom holds itself to. If you believe a story of ours falls
          short of them, we want to hear about it.
        </p>

        <div className="space-y-6">
          {PRINCIPLES.map((p) => (
            <div key={p.title} className="border-l-2 border-teal pl-4">
              <h2 className="mb-1 font-display text-lg font-semibold text-ink">{p.title}</h2>
              <p className="text-[15px] leading-relaxed text-charcoal">{p.body}</p>
            </div>
          ))}
        </div>

        <p className="mt-8 text-sm text-muted">
          Questions about a specific story, or want to flag something for correction? Reach us at{" "}
          <a
            href={`mailto:${settings?.contactEmail || "hello@amakuru.news"}`}
            className="text-teal underline underline-offset-2 hover:text-brand-dark"
          >
            {settings?.contactEmail || "hello@amakuru.news"}
          </a>
          .
        </p>
      </div>
    </SiteChrome>
  );
}
