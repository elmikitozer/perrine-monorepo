import { Container, Button } from '@perrine/ui';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';

async function getHomeData() {
  const query = `{
    "page": *[_type == "page" && slug.current == "home"][0],
    "featuredRecipes": *[_type == "recipe" && featured == true] | order(_createdAt desc) [0...6],
    "categories": *[_type == "category"] | order(name asc)
  }`;

  try {
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching data:', error);
    return { page: null, featuredRecipes: [], categories: [] };
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-cocktail-50 to-white">
        <Container>
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {data.page?.hero?.headline || '🍸 Recettes de Cocktails'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              {data.page?.hero?.subtitle ||
                'Des recettes traditionnelles transmises de génération en génération'}
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-cocktail-600 hover:bg-cocktail-700">
                Partagez vos recettes
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Categories Section */}
      {data.categories && data.categories.length > 0 && (
        <section className="py-20">
          <Container>
            <h2 className="text-4xl font-bold mb-12 text-center">Catégories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {data.categories.map((category: any) => (
                <div
                  key={category._id}
                  className="p-6 bg-white border border-gray-200 rounded-lg hover:shadow-lg transition-shadow cursor-pointer text-center"
                >
                  <h3 className="font-bold text-lg">{category.name}</h3>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Featured Recipes Section */}
      {data.featuredRecipes && data.featuredRecipes.length > 0 && (
        <section className="py-20 bg-gray-50">
          <Container>
            <h2 className="text-4xl font-bold mb-12">Recettes populaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.featuredRecipes.map((recipe: any) => (
                <div
                  key={recipe._id}
                  className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-gradient-to-br from-cocktail-100 to-cocktail-200" />
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2">{recipe.name}</h3>
                    {recipe.description && (
                      <p className="text-gray-600 mb-4 line-clamp-2">{recipe.description}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {recipe.prepTime && <span>⏱ {recipe.prepTime} min</span>}
                      {recipe.difficulty && (
                        <span className="capitalize">{recipe.difficulty === 'easy' ? 'Facile' : recipe.difficulty === 'medium' ? 'Moyen' : 'Difficile'}</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* About Section */}
      <section className="py-20 bg-cocktail-600 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Une passion familiale
            </h2>
            <p className="text-xl mb-8 text-cocktail-100">
              Découvrez nos recettes de cocktails, soigneusement élaborées et perfectionnées au fil des années.
              Chaque recette raconte une histoire.
            </p>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-cocktail-600">
                En savoir plus
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

