import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Hero, Section, FooterCocktail, CocktailSection } from '@/components';
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
  const tSpirit = await getTranslations({ locale, namespace: 'spirit' });
  const tStory = await getTranslations({ locale, namespace: 'story' });

  const heroData = data.homepage?.hero;
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
            className="inline-block bg-rouge backdrop-blur-sm hover:bg-rouge-alcool text-jaune px-10 py-5 rounded-full font-black text-lg transition-all shadow-2xl shadow-rouge/30 border border-rouge/50"
          >
            {t('cta')}
          </Link>
        }
      />

      {/* Cocktail Section */}
      <CocktailSection />

      {/* Spirit Section - Brand Story */}
      <Section className="bg-transparent" fullWidth>
        <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-screen-lg lg:max-w-[1400px] xl:max-w-[1600px] 2xl:max-w-[1800px]">
          <div className="max-w-6xl xl:max-w-7xl mx-auto text-center space-y-8">
          <h2 className="font-logo text-5xl md:text-7xl font-black text-rouge">
            {spiritSection?.title?.[locale] || tSpirit('title')}
          </h2>
          <p className="font-handwritten no-text-stroke text-3xl md:text-4xl text-rouge-alcool">
            {tSpirit('subtitle')}
          </p>

          <div className="font-sans text-lg md:text-xl text-rouge/90 space-y-6 max-w-4xl lg:max-w-6xl xl:max-w-7xl mx-auto text-justify">
            {spiritSection?.content?.[locale] ? (
              <div className="prose prose-lg max-w-none">
                {/* Render Sanity Portable Text here */}
                <p>{tStory('intro')}</p>
              </div>
            ) : (
              <>
                <p>{tStory('intro')}</p>
                <p>{tStory('babou')}</p>
                <p>{tStory('birth')}</p>
                <p className="text-rouge font-medium">{tStory('creation')}</p>
                <p>{tStory('tradition')}</p>
                <p>{tStory('mission')}</p>
              </>
            )}
          </div>

          <p className="font-handwritten no-text-stroke text-3xl md:text-4xl text-rouge-alcool pt-6">
            Pour que chaque instant compte
          </p>

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
        </div>
      </Section>

      {/* Featured Cocktails */}
      {data.featuredCocktails && data.featuredCocktails.length > 0 && (
        <Section className="bg-transparent" fullWidth>
          <div className="mx-auto px-4 md:px-6 lg:px-8 max-w-screen-md lg:max-w-[1200px] xl:max-w-[1400px] 2xl:max-w-[1600px]">
            <h2 className="font-logo text-4xl md:text-5xl font-black text-center mb-12 text-rouge">
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
                    <h3 className="text-2xl font-bold text-rouge mb-2">
                      {cocktail.name?.[locale] || cocktail.name?.fr}
                    </h3>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* Footer */}
      <FooterCocktail socials={data.settings?.socials} />
    </>
  );
}
