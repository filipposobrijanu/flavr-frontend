"use client";

import Link from "next/link";
import flavr_logo from "../../assets/flavr_logo.png";
import Image from "next/image";
import { useLocale } from "@/context/LocaleContext";

interface FooterProps {
  logo: React.ReactNode;
  brandName: string;
  socialLinks: Array<{
    icon: React.ReactNode;
    href: string;
    label: string;
  }>;
  mainLinks: Array<{
    href: string;
    label: string;
  }>;
  legalLinks: Array<{
    href: string;
    label: string;
  }>;
  copyrightLicense?: string;
}
interface NavLink {
  href: string;
  key: string; // Using 'key' to look up translation
}
export default function Footer({
  brandName,
  socialLinks,
  mainLinks,
  legalLinks,
  copyrightLicense,
}: FooterProps) {
  const { t } = useLocale();
  return (
    // 🛠️ ΔΙΟΡΘΩΣΗ: w-full και bg-white για να είναι όλο κάτασπρο και να πιάνει όλη την οθόνη
    <footer className="w-full border-t-4 border-black bg-white text-black pt-8 pb-6 mt-auto">
      <div className="max-w-6xl mx-auto px-6">
        {/* TOP SECTION: Logo & Socials */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
          <Link
            href="/"
            className="flex items-center gap-x-2 text-2xl font-black tracking-tight"
            aria-label={brandName}
          >
            <Image src={flavr_logo} alt="Flavr Logo" width={36} height={36} />
            <span className="font-ranchers-class">{brandName}</span>
          </Link>

          <ul className="flex list-none space-x-3 p-0">
            {socialLinks.map((link: any, i: number) => (
              <li key={i}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="h-10 w-10 rounded-full border-2 border-black bg-gray-50 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  {link.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* BOTTOM SECTION: Links & Copyright */}
        <div className="pt-8 flex flex-col lg:grid lg:grid-cols-10 gap-6">
          {/* Main Links */}
          <nav className="lg:col-[4/11] order-1">
            <ul className="list-none flex flex-wrap justify-center lg:justify-end gap-x-6 gap-y-2 p-0">
              {mainLinks.map((link: any, i: number) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm font-bold underline-offset-4 hover:opacity-80"
                  >
                    {t(`footer.${link.label}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* Legal Links */}
          <div className="lg:col-[4/11] order-2">
            <ul className="list-none flex flex-wrap justify-center lg:justify-end gap-x-6 gap-y-2 p-0">
              {legalLinks.map((link: any, i: number) => (
                <li key={i}>
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 underline-offset-4 hover:opacity-80"
                  >
                    {t(`footer.${link.label}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Copyright Section - Moves to bottom on mobile, stays left on desktop */}
          <div className="text-center lg:text-left text-sm font-medium text-gray-600 lg:row-[1/3] lg:col-[1/4] order-3 mt-4 lg:mt-0">
            {copyrightLicense && (
              <div className="text-xs text-gray-500 mt-1">
                {t("footer.copyright")}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
