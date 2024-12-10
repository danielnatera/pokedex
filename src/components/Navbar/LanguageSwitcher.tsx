import Link from "next/link";
import { usePathname, useParams } from "next/navigation";

export const LanguageSwitcher: React.FC = () => {
  const { lang } = useParams();
  const pathname = usePathname();

  return (
    <div className="flex justify-center gap-4 mt-4">
      <Link
        href={pathname.replace(`/${lang}`, "/es")}
        className={`px-4 py-2 text-white text-xs rounded-full ${
          lang === "es" ? "bg-water" : "bg-medium"
        }`}
      >
        🇪🇸 Español
      </Link>
      <Link
        href={pathname.replace(`/${lang}`, "/en")}
        className={`px-4 py-2 text-white text-xs rounded-full ${
          lang === "en" ? "bg-water" : "bg-medium"
        }`}
      >
        🇬🇧 English
      </Link>
    </div>
  );
};