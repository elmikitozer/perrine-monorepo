import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import { Section, FooterCocktail } from '@/components';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';
import ContactFormClient from './ContactFormClient';

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

export default async function ContactPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const data = await getContactData();
  const t = await getTranslations({ locale, namespace: 'contact' });

  const contactPage = data.contactPage;

  return (
    <>
      <div className="min-h-screen bg-noir">
        {/* Header spacing */}
        <div className="h-20" />

        <Section className="py-12 md:py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left: Image */}
            <div className="relative h-[500px] lg:h-[700px] rounded-lg overflow-hidden">
              {contactPage?.image ? (
                <Image
                  src={urlForImage(contactPage.image).url()}
                  alt="Contact"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="h-full bg-gradient-to-br from-orange/20 to-rouge/20 flex items-center justify-center">
                  <span className="text-8xl">📧</span>
                </div>
              )}
            </div>

            {/* Right: Content & Form */}
            <div className="space-y-8">
              <div>
                <h1 className="text-5xl md:text-6xl font-bold mb-6 text-safran">
                  {contactPage?.title?.[locale] || t('title')}
                </h1>

                <div className="text-lg text-blanc/80 space-y-4">
                  {contactPage?.description?.[locale] ? (
                    <div className="prose prose-invert max-w-none">
                      {/* Render Sanity Portable Text here */}
                      <p>
                        Nous serions ravis d&apos;échanger avec vous sur nos créations
                        et votre projet.
                      </p>
                    </div>
                  ) : (
                    <p>
                      Nous serions ravis d&apos;échanger avec vous sur nos créations
                      et votre projet.
                    </p>
                  )}
                </div>
              </div>

              {/* Contact Info */}
              {(contactPage?.email || contactPage?.phone || contactPage?.address) && (
                <div className="bg-blanc/5 backdrop-blur-sm border border-blanc/10 rounded-lg p-6 space-y-4">
                  <h3 className="text-xl font-bold text-blanc">{t('info')}</h3>

                  {contactPage?.email && (
                    <div className="flex items-center gap-3 text-blanc/80">
                      <span>📧</span>
                      <a
                        href={`mailto:${contactPage.email}`}
                        className="hover:text-safran transition-colors"
                      >
                        {contactPage.email}
                      </a>
                    </div>
                  )}

                  {contactPage?.phone && (
                    <div className="flex items-center gap-3 text-blanc/80">
                      <span>📞</span>
                      <a
                        href={`tel:${contactPage.phone}`}
                        className="hover:text-safran transition-colors"
                      >
                        {contactPage.phone}
                      </a>
                    </div>
                  )}

                  {contactPage?.address && (
                    <div className="flex items-start gap-3 text-blanc/80">
                      <span>📍</span>
                      <p>{contactPage.address}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Contact Form */}
              <ContactFormClient locale={locale} />
            </div>
          </div>
        </Section>
      </div>

      <FooterCocktail socials={data.settings?.socials} />
    </>
  );
}

