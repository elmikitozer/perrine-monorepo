import { Container, Button } from '@perrine/ui';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';

async function getHomeData() {
  const query = `{
    "page": *[_type == "page" && slug.current == "home"][0],
    "featuredProjects": *[_type == "project" && featured == true] | order(_createdAt desc) [0...3],
    "services": *[_type == "service"] | order(order asc)
  }`;

  try {
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching data:', error);
    return { page: null, featuredProjects: [], services: [] };
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-32">
        <Container>
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {data.page?.hero?.headline || 'Direction Artistique & Design'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              {data.page?.hero?.subtitle ||
                'Création de visuels impactants et identités de marque mémorables'}
            </p>
            <Link href="/contact">
              <Button size="lg">Discutons de votre projet</Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      {data.services && data.services.length > 0 && (
        <section className="py-20 bg-gray-50">
          <Container>
            <h2 className="text-4xl font-bold mb-12">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.services.map((service: any) => (
                <div key={service._id} className="bg-white p-8 rounded-lg shadow-sm">
                  {service.icon && <div className="text-4xl mb-4">{service.icon}</div>}
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600">{service.description}</p>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Featured Projects Section */}
      {data.featuredProjects && data.featuredProjects.length > 0 && (
        <section className="py-20">
          <Container>
            <h2 className="text-4xl font-bold mb-12">Projets récents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.featuredProjects.map((project: any) => (
                <div key={project._id} className="group cursor-pointer">
                  <div className="aspect-square bg-gray-200 mb-4 rounded-lg overflow-hidden">
                    {/* Image will be added with Sanity image component */}
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  {project.client && <p className="text-gray-600">{project.client}</p>}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-black text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à donner vie à votre projet ?
            </h2>
            <p className="text-xl mb-8 text-gray-300">
              Travaillons ensemble pour créer quelque chose d'exceptionnel
            </p>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-black">
                Contactez-moi
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

