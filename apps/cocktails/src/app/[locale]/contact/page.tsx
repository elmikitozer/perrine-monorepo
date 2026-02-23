import { getTranslations } from 'next-intl/server';
import { Section, FooterCocktail } from '@/components';
import { client } from '@/sanity/lib/client';
import ContactFormClient from './ContactFormClient';
import MapLink from '../../../components/MapLink';
import {
  MailIcon,
  InstagramIcon,
  TikTokIcon,
  PhoneIcon,
  LinkedInIcon,
  FacebookIcon,
} from '@/components/icons/ContactIcons';

async function getContactData() {
  const query = `{
    "contactPage": *[_type == "contactPage"][0],
    "settings": *[_type == "settings"][0]
  }`;

  try {
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching data:', error);
    return { contactPage: null, settings: null };
  }
}

export default async function ContactPage({ params: { locale } }: { params: { locale: string } }) {
  const data = await getContactData();
  const t = await getTranslations({ locale, namespace: 'contact' });
  const contactPage = data.contactPage;

  return (
    <>
      <div className="min-h-screen bg-transparent">
        <div className="h-20" />
        <div className="text-center">
          <h1 className="font-logo text-5xl md:text-6xl font-bold mb-8 mt-4 text-rouge">
            {contactPage?.title?.[locale] || t('title')}
          </h1>
          <p className="font-handwritten max-w-2xl mx-auto px-6 md:px-0 text-rouge/85 text-base md:text-lg leading-relaxed whitespace-pre-line">
            {t('intro')}
          </p>
        </div>

        <Section className="!pt-4 md:!pt-6 py-4 md:py-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Practical Info Grid */}
            <div className="flex flex-col items-center justify-center space-y-10 w-full">
              {/* <h2 className="font-logo text-rouge-alcool text-2xl md:text-3xl tracking-wide text-center">
              {t('infoHeading')}
            </h2> */}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10 w-full max-w-3xl px-4 md:px-0">
                {/* Email */}
                <a
                  href="mailto:hello@dixhuitzerocinq.com"
                  className="flex flex-col items-center text-center gap-2 text-rouge text-xs sm:text-sm lg:text-base hover:text-rouge-alcool transition-colors"
                >
                  <span className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20">
                    <MailIcon />
                  </span>
                  <span className="break-all leading-tight">hello@dixhuitzerocinq.com</span>
                </a>

                {/* Instagram */}
                <a
                  href="https://instagram.com/dixhuitzerocinq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-center gap-2 text-rouge text-xs sm:text-sm lg:text-base hover:text-rouge-alcool transition-colors"
                >
                  <span className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20">
                    <InstagramIcon />
                  </span>
                  <span>@dixhuitzerocinq</span>
                </a>

                {/* TikTok */}
                <a
                  href="https://www.tiktok.com/@dixhuitzerocinq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-center gap-2 text-rouge text-xs sm:text-sm lg:text-base hover:text-rouge-alcool transition-colors"
                >
                  <span className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20">
                    <TikTokIcon />
                  </span>
                  <span>@dixhuitzerocinq<br></br></span>
                </a>

                {/* Phone */}
                <div className="flex flex-col items-center text-center gap-2">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20 text-rouge">
                    <PhoneIcon />
                  </div>
                  <div className="flex flex-col items-center text-center text-xs sm:text-sm lg:text-base">
                    <a
                      href="tel:+33658768607"
                      className="text-rouge hover:text-rouge-alcool transition-colors whitespace-nowrap"
                    >
                      +33 6 58 76 86 07
                    </a>
                    <a
                      href="tel:+32475371887"
                      className="text-rouge hover:text-rouge-alcool transition-colors whitespace-nowrap"
                    >
                      +32 475 37 18 87
                    </a>
                  </div>
                </div>

                {/* LinkedIn */}
                <a
                  href="https://www.linkedin.com/company/dixhuitzerocinq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-center gap-2 text-rouge text-xs sm:text-sm lg:text-base hover:text-rouge-alcool transition-colors"
                >
                  <span className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20">
                    <LinkedInIcon />
                  </span>
                  <span>dixhuitzerocinq.com</span>
                </a>

                {/* Facebook */}
                <a
                  href="https://www.facebook.com/dixhuitzerocinq"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center text-center gap-2 text-rouge text-xs sm:text-sm lg:text-base hover:text-rouge-alcool transition-colors"
                >
                  <span className="w-12 h-12 sm:w-14 sm:h-14 lg:w-20 lg:h-20">
                    <FacebookIcon />
                  </span>
                  <span>@dixhuitzerocinq</span>
                </a>
              </div>
            </div>

            {/* Right: Content & Form */}
            <div className="space-y-8 px-6">
              <ContactFormClient locale={locale} />
            </div>
          </div>
        </Section>
      </div>

      <FooterCocktail socials={data.settings?.socials} />
    </>
  );
}
