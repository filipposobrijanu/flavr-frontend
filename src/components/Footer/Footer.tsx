import Link from "next/link";
import flavr_logo from "../../assets/flavr_logo.png";
import Image from "next/image";

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
  copyright: {
    text: string;
    license?: string;
  };
}

export default function Footer({
  logo,
  brandName,
  socialLinks,
  mainLinks,
  legalLinks,
  copyright,
}: FooterProps) {
  return (
    // 🛠️ ΔΙΟΡΘΩΣΗ: w-full και bg-white για να είναι όλο κάτασπρο και να πιάνει όλη την οθόνη
    <footer className="w-full border-t-4 border-black bg-white text-black pt-8 pb-6 mt-auto">
      {/* Εσωτερικό container για να κρατάει το περιεχόμενο κεντραρισμένο στα 6xl */}
      <div className="max-w-6xl mx-auto px-6">
        <div className="md:flex md:items-start md:justify-between">
          <Link
            href="/"
            className="flex items-center gap-x-2 text-2xl font-black tracking-tight"
            aria-label={brandName}
          >
            <Image src={flavr_logo} alt="Flavr Logo" width={36} height={36} />
            <span>{brandName}</span>
          </Link>

          <ul className="flex list-none mt-6 md:mt-0 space-x-3 p-0MAIN">
            {socialLinks.map((link, i) => (
              <li key={i}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="h-10 w-10 rounded-full border-2 border-black bg-gray-50 flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  {link.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Εσωτερική διαχωριστική γραμμή */}
        <div className=" pt-4 md:pt-6 lg:grid lg:grid-cols-10">
          <nav className="lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-2 lg:justify-end p-0">
              {mainLinks.map((link, i) => (
                <li key={i} className="my-1 mx-2 shrink-0">
                  <Link
                    href={link.href}
                    className="text-sm font-bold underline-offset-4 hover:opacity-80"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-4 lg:mt-0 lg:col-[4/11]">
            <ul className="list-none flex flex-wrap -my-1 -mx-3 lg:justify-end p-0">
              {legalLinks.map((link, i) => (
                <li key={i} className="my-1 mx-3 shrink-0">
                  <Link
                    href={link.href}
                    className="text-sm text-gray-600 underline-offset-4 hover:opacity-80"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 text-sm font-medium text-gray-600 whitespace-nowrap lg:mt-0 lg:row-[1/3] lg:col-[1/4]">
            <div>{copyright.text}</div>
            {copyright.license && (
              <div className="text-xs text-gray-500 mt-1">
                {copyright.license}
              </div>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
}
