import type { Metadata } from "next";
import "./globals.css";
import { AuthUserProvider } from "@/lib/hooks/useAuthUser";
import LanguageProvider from "@/lib/i18n/LanguageProvider";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Amakuru — Great Lakes region, in three voices",
    template: "%s · Amakuru",
  },
  description:
    "Independent news for the Great Lakes region, reported in English, French, and Kirundi.",
  openGraph: {
    type: "website",
    siteName: "Amakuru",
    title: "Amakuru — Great Lakes region, in three voices",
    description:
      "Independent news for the Great Lakes region, reported in English, French, and Kirundi.",
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "Amakuru — Great Lakes region, in three voices",
    description:
      "Independent news for the Great Lakes region, reported in English, French, and Kirundi.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <LanguageProvider>
          <AuthUserProvider>{children}</AuthUserProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
