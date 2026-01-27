import { getTranslations } from "next-intl/server";
import { Section, FooterCocktail } from "@/components";
import { client } from "@/sanity/lib/client";
import ContactFormClient from "./ContactFormClient";
import MapLink from "../../../components/MapLink";
import {
  MailIcon,
  InstagramIcon,
  TikTokIcon,
  PhoneIcon,
  GlobeIcon,
  FacebookIcon,
  LocationIcon
} from "@/components/icons/ContactIcons";

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
  const contactPage = data.contactPage;

  return (
    <>
      <div className="min-h-screen bg-transparent">
        <div className="h-20" />

        <Section className="py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Practical Info Grid */}
            <div className="flex flex-col items-center justify-center space-y-10 w-full">
              <p className="font-handwritten max-w-2xl text-center text-rouge/85 text-base md:text-lg leading-relaxed">
                Dix Huit Zéro Cinq s’adresse à celles et ceux qui cherchent des produits porteurs de sens,
                de souvenirs et d’émotion. Un cocktail qui se vit plus qu’il ne s’explique. Un prétexte pour
                se retrouver, ralentir et profiter de l’instant.
              </p>
              <h2 className="font-logo text-rouge-alcool text-2xl md:text-3xl tracking-wide text-center">
                Informations pratiques
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full max-w-3xl">
                {/* Email */}
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 text-rouge">
                    <MailIcon />
                  </div>
                  <a
                    href="mailto:hello@dixhuitzerocinq.com"
                    className="text-rouge text-base md:text-lg hover:text-rouge-alcool transition-colors"
                  >
                    hello@dixhuitzerocinq.com
                  </a>
                </div>

                {/* Instagram */}
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 text-rouge">
                    <InstagramIcon />
                  </div>
                  <a
                    href="https://instagram.com/dixhuitzerocinq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rouge text-base md:text-lg hover:text-rouge-alcool transition-colors"
                  >
                    @dixhuitzerocinq
                  </a>
                </div>

                {/* TikTok */}
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 text-rouge">
                    <TikTokIcon />
                  </div>
                  <a
                    href="https://www.tiktok.com/@dixhuitzerocinq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rouge text-base md:text-lg hover:text-rouge-alcool transition-colors"
                  >
                    @dixhuitzerocinq
                  </a>
                </div>

                {/* Phone */}
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 text-rouge">
                    <PhoneIcon />
                  </div>
                  <a
                    href="tel:+33658768607"
                    className="text-rouge text-base md:text-lg hover:text-rouge-alcool transition-colors"
                  >
                    +33 6 58 76 86 07
                  </a>
                  <a
                    href="tel:+32475371887"
                    className="text-rouge text-base md:text-lg hover:text-rouge-alcool transition-colors"
                  >
                    +32 475 37 18 87
                  </a>
                </div>

                {/* Website */}
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 text-rouge">
                    <GlobeIcon />
                  </div>
                  <a
                    href="https://dixhuitzerocinq.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rouge text-base md:text-lg hover:text-rouge-alcool transition-colors hover:underline"
                  >
                    www.dixhuitzerocinq.com
                  </a>
                </div>

                {/* Facebook */}
                <div className="flex flex-col items-center text-center gap-4">
                  <div className="w-20 h-20 md:w-24 md:h-24 text-rouge">
                    <FacebookIcon />
                  </div>
                  <a
                    href="https://www.facebook.com/dixhuitzerocinq"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-rouge text-base md:text-lg hover:text-rouge-alcool transition-colors"
                  >
                    @dixhuitzerocinq
                  </a>
                </div>
              </div>
            </div>

            {/* Right: Content & Form */}
            <div className="space-y-8">
              <div>
                <h1 className="font-logo text-5xl md:text-6xl font-bold mb-4 text-rouge">
                  {contactPage?.title?.[locale] || t("title")}
                </h1>
                {/* <p className="text-lg text-rouge/80">{t("description")}</p> */}
              </div>

              {/* Contact Info */}
              <div className="bg-rouge-alcool/40 border border-safran/30 rounded-2xl p-6 space-y-4">
                <h3 className="text-xl font-bold text-jaune">{t("info")}</h3>

                <div className="flex items-center gap-3 text-jaune">
                  <MailIcon className="w-5 h-5 text-jaune" />

                  <a
                    href="mailto:hello@dixhuitzerocinq.com"
                    className="hover:text-safran transition-colors"
                  >
                    hello@dixhuitzerocinq.com
                  </a>
                </div>

                <div className="flex items-center gap-3 text-jaune">
                  <LocationIcon className="w-5 h-5 text-jaune" />

                  <MapLink
                    address="101 rue Damrémont, 75018 Paris"
                    className="hover:text-safran transition-colors"
                  />
                </div>

                {contactPage?.phone && (
                  <div className="flex items-center gap-3 text-rouge/70">
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
