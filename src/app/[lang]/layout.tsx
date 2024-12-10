import "../globals.css";
import { SearchFilterProvider } from "../../context/SearchFilterContext";
import { PokemonProvider } from "../../context/PokemonContext";
import { ReactQueryProvider } from "../../context/ReactQueryProvider";
import { LocaleProvider } from "@/context/LocaleContext";
import favicon from "../../../public/favicon.ico";

export const metadata = {
  title: "Pokémon App",
  description: "Pokedex hecha con Next.js para Binpar",
  icons: {
    icon: "/favicon.ico",
  },
};

export default async function RootLayout({ 
  children, 
  params 
}: { 
  children: React.ReactNode; 
  params: { lang: string };
}) {

  const resolvedParams = await Promise.resolve(params);
  const locale = resolvedParams?.lang ?? "es"; 
  return (
    <html lang={locale}>
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href={favicon.src} type="image/x-icon" />
      </head>
      <body className="text-dark min-h-screen">
        <LocaleProvider locale={locale}>
          <ReactQueryProvider>
            <PokemonProvider>
              <SearchFilterProvider>
                <main>{children}</main>
              </SearchFilterProvider>
            </PokemonProvider>
          </ReactQueryProvider>
        </LocaleProvider>
      </body>
    </html>
  );
}