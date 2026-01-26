import { useTranslations } from 'next-intl';
import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Hero, Section, FooterCocktail } from '@/components';
import { client } from '@/sanity/lib/client';
import { urlForImage } from '@/sanity/lib/image';

async function getHomeData(locale: string) {
  const query = `{
    "homepage": *[_type == "homepage"][0],
    "settings": *[_type == "settings"][0],
    "featuredCocktails": *[_type == "cocktail" && featured == true] | order(_createdAt desc) [0...3]
  }`;

  try {
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching data:', error);
    return { homepage: null, settings: null, featuredCocktails: [] };
  }
}

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  const data = await getHomeData(locale);
  const t = await getTranslations({ locale, namespace: 'hero' });
  const tCocktail = await getTranslations({ locale, namespace: 'cocktail' });
  const tSpirit = await getTranslations({ locale, namespace: 'spirit' });
  const tStory = await getTranslations({ locale, namespace: 'story' });

  const heroData = data.homepage?.hero;
  const cocktailSection = data.homepage?.cocktailSection;
  const spiritSection = data.homepage?.spiritSection;

  return (
    <>
      {/* Hero Section */}
      <Hero
        title={heroData?.title?.[locale] || 'Dix Huit Zéro Cinq'}
        subtitle={heroData?.subtitle?.[locale] || t('tagline')}
        backgroundImage={heroData?.backgroundImage}
        backgroundVideo={heroData?.backgroundVideo}
        cta={
          <Link
            href="#cocktail"
            className="inline-block bg-safran/90 backdrop-blur-sm hover:bg-orange text-noir px-10 py-5 rounded-full font-black text-lg transition-all shadow-2xl shadow-safran/20 border border-safran/30"
          >
            {t('cta')}
          </Link>
        }
      />

      {/* Cocktail Section */}
      <Section id="cocktail" className="bg-gradient-to-b from-blanc to-blanc/95">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Image */}
          <div className="relative h-[600px] lg:h-[700px]">
            <Image
              src="/bottle.webp"
              alt="Dix Huit Zéro Cinq Bottle"
              fill
              className="object-contain"
            />
          </div>

          {/* Content */}
          <div className="space-y-6 text-center lg:text-left">
            <h2 className="font-display text-5xl md:text-6xl font-black text-safran">
              {cocktailSection?.title?.[locale] || tCocktail('title')}
            </h2>
            <div className="text-lg md:text-xl text-noir/80 space-y-4">
              {cocktailSection?.story?.[locale] ? (
                <div className="prose prose-invert max-w-none">
                  {/* Render Sanity Portable Text here */}
                  <p>{tCocktail('description')}</p>
                </div>
              ) : (
                <>
                  <p>{tCocktail('description')}</p>
                  <p className="text-base text-noir/60 italic whitespace-pre-line">{tCocktail('recipe')}</p>
                  <p className="font-semibold text-noir">{tCocktail('serving')}</p>
                </>
              )}
            </div>
            <Link
              href="/contact"
              className="inline-block bg-safran hover:bg-orange text-noir px-8 py-4 rounded-full font-bold transition-colors"
            >
              {cocktailSection?.ctaText?.[locale] || tCocktail('discover')}
            </Link>
          </div>
        </div>
      </Section>

      {/* Spirit Section - Brand Story */}
      <Section className="bg-gradient-to-b from-blanc/95 to-blanc">
        <div className="max-w-5xl mx-auto text-center space-y-8">
          <h2 className="font-display text-5xl md:text-7xl font-black" style={{ color: '#ed4c00' }}>
            {spiritSection?.title?.[locale] || tSpirit('title')}
          </h2>
          <p className="text-2xl md:text-3xl text-safran font-semibold italic">
            {tSpirit('subtitle')}
          </p>

          <div className="text-lg md:text-xl text-noir/80 space-y-6 max-w-3xl mx-auto text-left">
            {spiritSection?.content?.[locale] ? (
              <div className="prose prose-invert prose-lg max-w-none">
                {/* Render Sanity Portable Text here */}
                <p>{tStory('intro')}</p>
              </div>
            ) : (
              <>
                <p>{tStory('intro')}</p>
                <p>{tStory('babou')}</p>
                <p>{tStory('birth')}</p>
                <p className="text-noir font-medium">{tStory('creation')}</p>
                <p>{tStory('tradition')}</p>
                <p>{tStory('mission')}</p>
                <p className="text-2xl font-bold text-safran text-center pt-4">
                  {tStory('closing')}
                </p>
              </>
            )}
          </div>

          {/* Images Grid */}
          {spiritSection?.images && spiritSection.images.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-12">
              {spiritSection.images.slice(0, 3).map((image: any, index: number) => (
                <div key={index} className="relative h-64 overflow-hidden rounded-lg">
                  <Image
                    src={urlForImage(image).url()}
                    alt={`Spirit ${index + 1}`}
                    fill
                    className="object-cover hover:scale-110 transition-transform duration-500"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </Section>

      {/* Featured Cocktails */}
      {data.featuredCocktails && data.featuredCocktails.length > 0 && (
        <Section className="bg-blanc/90">
          <h2 className="font-display text-4xl md:text-5xl font-black text-center mb-12 text-safran">
            Nos Créations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {data.featuredCocktails.map((cocktail: any) => (
              <div
                key={cocktail._id}
                className="group relative overflow-hidden rounded-lg bg-noir/5 backdrop-blur-sm border border-noir/10 hover:border-orange/50 transition-all"
              >
                {cocktail.mainImage && (
                  <div className="relative h-80">
                    <Image
                      src={urlForImage(cocktail.mainImage).url()}
                      alt={cocktail.name?.[locale] || cocktail.name?.fr}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  </div>
                )}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-noir mb-2">
                    {cocktail.name?.[locale] || cocktail.name?.fr}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {/* Footer */}
      <FooterCocktail socials={data.settings?.socials} />
    </>
  );
}
