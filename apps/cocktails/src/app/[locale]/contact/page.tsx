import { getTranslations } from "next-intl/server";
import Image from "next/image";
import { Section, FooterCocktail } from "@/components";
import { client } from "@/sanity/lib/client";
import { urlForImage } from "@/sanity/lib/image";
import ContactFormClient from "./ContactFormClient";
import MapLink from "../../../components/MapLink";

async function getContactData() {
  const query = `{
    "contactPage": *[_type == "contactPage"][0],
    "settings": *[_type == "settings"][0]
  }`;

  try {
    return await client.fetch(query);
  } catch (error) {
    console.error("Error fetching data:", error);
    return { contactPage: null, settings: null };
  }
}

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const data = await getContactData();
  const t = await getTranslations({ locale, namespace: "contact" });
  const tHero = await getTranslations({ locale, namespace: "hero" });

  const contactPage = data.contactPage;

  return (
    <>
      <div className="min-h-screen bg-blanc">
        <div className="h-20" />

        <Section className="py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Logo + Tagline */}
            <div className="flex flex-col items-center justify-center space-y-8">
              <div className="relative w-64 h-64 md:w-80 md:h-80">
                {contactPage?.image ? (
                  <Image
                    src={urlForImage(contactPage.image).url()}
                    alt="Dix Huit Zéro Cinq"
                    fill
                    className="object-contain"
                  />
                ) : (
                  <Image
                    src="/1805_Badge_clean.png"
                    alt="Dix Huit Zéro Cinq"
                    fill
                    className="object-contain"
                  />
                )}
              </div>

              <p className="text-xl whitespace-pre-line md:text-2xl text-noir/70 italic text-center max-w-sm">
                {tHero("tagline")}
              </p>
            </div>

            {/* Right: Content & Form */}
            <div className="space-y-8">
              <div>
                <h1 className="font-display text-5xl md:text-6xl font-bold mb-4 text-rouge">
                  {contactPage?.title?.[locale] || t("title")}
                </h1>
                <p className="text-lg text-noir/70">{t("description")}</p>
              </div>

              {/* Contact Info */}
              <div className="bg-safran/10 border border-safran/30 rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-noir">{t("info")}</h3>

                <div className="flex items-center gap-3 text-noir/70">
                  <svg
                    className="w-5 h-5 text-safran"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>

                  <a
                    href="mailto:hello@dixhuitzerocinq.com"
                    className="hover:text-safran transition-colors"
                  >
                    hello@dixhuitzerocinq.com
                  </a>
                </div>

                <div className="flex items-center gap-3 text-noir/70">
                  <svg
                    className="w-5 h-5 text-safran"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>

                  <MapLink
                    address="101 rue Damrémont, 75018 Paris"
                    className="hover:text-safran transition-colors"
                  />
                </div>

                {contactPage?.phone && (
                  <div className="flex items-center gap-3 text-noir/70">
                    <svg
                      className="w-5 h-5 text-safran"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>

                    <a
                      href={`tel:${contactPage.phone}`}
                      className="hover:text-safran transition-colors"
                    >
                      {contactPage.phone}
                    </a>
                  </div>
                )}
              </div>

              <ContactFormClient locale={locale} />
            </div>
          </div>
        </Section>
      </div>

      <FooterCocktail socials={data.settings?.socials} />
    </>
  );
}
