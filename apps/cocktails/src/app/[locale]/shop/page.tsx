import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Section, FooterCocktail } from '@/components';
import { client } from '@/sanity/lib/client';

async function getSettings() {
  const query = `*[_type == "settings"][0]`;

  try {
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching data:', error);
    return null;
  }
}

export default async function ShopPage({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const settings = await getSettings();
  const t = await getTranslations({ locale, namespace: 'shop' });

  return (
    <>
      <div className="min-h-screen bg-noir">
        {/* Header spacing */}
        <div className="h-20" />

        <Section className="py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            {/* Icon */}
            <div className="text-8xl mb-8">🛍️</div>

            {/* Title */}
            <h1 className="text-5xl md:text-7xl font-bold text-safran mb-6">
              {t('comingSoon')}
            </h1>

            {/* Description */}
            <p className="text-xl md:text-2xl text-blanc/80 max-w-2xl mx-auto">
              {t('description')}
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="bg-blanc/5 backdrop-blur-sm border border-blanc/10 rounded-lg p-8 hover:border-safran/50 transition-colors">
                <div className="text-4xl mb-4">🍸</div>
                <h3 className="text-xl font-bold text-blanc mb-2">
                  Cocktails Premium
                </h3>
                <p className="text-blanc/70">
                  {locale === 'fr'
                    ? 'Notre collection exclusive de cocktails artisanaux'
                    : 'Our exclusive collection of artisanal cocktails'}
                </p>
              </div>

              <div className="bg-blanc/5 backdrop-blur-sm border border-blanc/10 rounded-lg p-8 hover:border-safran/50 transition-colors">
                <div className="text-4xl mb-4">📦</div>
                <h3 className="text-xl font-bold text-blanc mb-2">
                  {locale === 'fr' ? 'Livraison Express' : 'Express Delivery'}
                </h3>
                <p className="text-blanc/70">
                  {locale === 'fr'
                    ? 'Recevez vos commandes rapidement et en toute sécurité'
                    : 'Receive your orders quickly and securely'}
                </p>
              </div>

              <div className="bg-blanc/5 backdrop-blur-sm border border-blanc/10 rounded-lg p-8 hover:border-safran/50 transition-colors">
                <div className="text-4xl mb-4">🎁</div>
                <h3 className="text-xl font-bold text-blanc mb-2">
                  {locale === 'fr' ? 'Éditions Limitées' : 'Limited Editions'}
                </h3>
                <p className="text-blanc/70">
                  {locale === 'fr'
                    ? 'Découvrez nos créations exclusives et uniques'
                    : 'Discover our exclusive and unique creations'}
                </p>
              </div>
            </div>

            {/* Newsletter Signup Placeholder */}
            <div className="mt-16 bg-gradient-to-r from-orange/20 to-rouge/20 border border-orange/30 rounded-lg p-8">
              <h3 className="text-2xl font-bold text-blanc mb-4">
                {locale === 'fr'
                  ? 'Restez informé du lancement'
                  : 'Stay informed about the launch'}
              </h3>
              <p className="text-blanc/80 mb-6">
                {locale === 'fr'
                  ? 'Inscrivez-vous à notre newsletter pour être le premier à découvrir notre boutique'
                  : 'Sign up for our newsletter to be the first to discover our shop'}
              </p>
              <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder={locale === 'fr' ? 'Votre email' : 'Your email'}
                  className="flex-1 px-4 py-3 bg-blanc/5 border border-blanc/10 rounded-lg text-blanc placeholder-blanc/40 focus:outline-none focus:border-safran transition-colors"
                />
                <button className="bg-orange hover:bg-rouge text-blanc px-8 py-3 rounded-lg font-bold transition-colors whitespace-nowrap">
                  {locale === 'fr' ? "S'inscrire" : 'Subscribe'}
                </button>
              </div>
            </div>

            {/* Back to Home */}
            <div className="mt-12">
              <Link
                href={`/${locale}`}
                className="inline-block text-safran hover:text-orange transition-colors font-medium"
              >
                ← {locale === 'fr' ? "Retour à l'accueil" : 'Back to home'}
              </Link>
            </div>
          </div>
        </Section>
      </div>

      <FooterCocktail socials={settings?.socials} />
    </>
  );
}



