// app/layout.tsx
import "./globals.css";
import Link from "next/link";
import { cookies } from "next/headers";
import { copy, normalizeLang, LANG_COOKIE } from "@/lib/i18n";
import LangToggle from "./ui/LangToggle";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = normalizeLang(cookies().get(LANG_COOKIE)?.value);
  const t = copy[lang];

  return (
    <html lang={lang}>
      <body>
        <header className="flex items-center justify-between px-6 py-5">
          <div className="text-lg font-semibold">{t.appName}</div>
          <div className="flex gap-2">
            <LangToggle lang={lang} />
            <Link className="btn" href="/upload">
              {t.navUpload}
            </Link>
          </div>
        </header>

        <main className="min-h-screen px-6 py-6">{children}</main>
      </body>
    </html>
  );
}