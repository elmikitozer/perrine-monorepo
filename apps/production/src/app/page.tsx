import { Container, Button } from '@perrine/ui';
import Link from 'next/link';
import { client } from '@/sanity/lib/client';

async function getHomeData() {
  const query = `{
    "page": *[_type == "page" && slug.current == "home"][0],
    "featuredProjects": *[_type == "projectProduction" && featured == true] | order(_createdAt desc) [0...3],
    "services": *[_type == "service"] | order(order asc),
    "testimonials": *[_type == "testimonial"] | order(_createdAt desc) [0...3]
  }`;

  try {
    return await client.fetch(query);
  } catch (error) {
    console.error('Error fetching data:', error);
    return { page: null, featuredProjects: [], services: [], testimonials: [] };
  }
}

export default async function Home() {
  const data = await getHomeData();

  return (
    <>
      {/* Hero Section */}
      <section className="py-20 md:py-32 bg-gradient-to-br from-production-50 to-white">
        <Container>
          <div className="max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              {data.page?.hero?.headline || 'Production Audiovisuelle'}
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 mb-8">
              {data.page?.hero?.subtitle ||
                'Donnez vie à vos projets avec notre expertise en production vidéo et photo'}
            </p>
            <Link href="/contact">
              <Button size="lg" className="bg-production-600 hover:bg-production-700">
                Discutons de votre projet
              </Button>
            </Link>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      {data.services && data.services.length > 0 && (
        <section className="py-20">
          <Container>
            <h2 className="text-4xl font-bold mb-12">Services</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.services.map((service: any) => (
                <div
                  key={service._id}
                  className="bg-white p-8 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  {service.icon && <div className="text-4xl mb-4">{service.icon}</div>}
                  <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  {service.features && service.features.length > 0 && (
                    <ul className="space-y-2 text-sm text-gray-600">
                      {service.features.slice(0, 3).map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start">
                          <span className="mr-2">✓</span>
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Featured Projects Section */}
      {data.featuredProjects && data.featuredProjects.length > 0 && (
        <section className="py-20 bg-gray-50">
          <Container>
            <h2 className="text-4xl font-bold mb-12">Projets récents</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {data.featuredProjects.map((project: any) => (
                <div key={project._id} className="group cursor-pointer">
                  <div className="aspect-video bg-gray-200 mb-4 rounded-lg overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-production-200 to-production-400 group-hover:scale-105 transition-transform duration-300" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{project.title}</h3>
                  {project.client && <p className="text-gray-600">{project.client}</p>}
                  {project.category && (
                    <span className="inline-block mt-2 text-sm text-production-600 capitalize">
                      {project.category}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Testimonials Section */}
      {data.testimonials && data.testimonials.length > 0 && (
        <section className="py-20">
          <Container>
            <h2 className="text-4xl font-bold mb-12 text-center">Ce qu'ils disent de nous</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {data.testimonials.map((testimonial: any) => (
                <div
                  key={testimonial._id}
                  className="bg-white p-6 rounded-lg border border-gray-200"
                >
                  <p className="text-gray-700 mb-4 italic">&ldquo;{testimonial.content}&rdquo;</p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-production-200 to-production-400" />
                    <div>
                      <p className="font-bold">{testimonial.author}</p>
                      {testimonial.role && <p className="text-sm text-gray-600">{testimonial.role}</p>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-production-600 text-white">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Prêt à démarrer votre projet ?
            </h2>
            <p className="text-xl mb-8 text-production-100">
              Contactez-nous pour discuter de vos besoins en production audiovisuelle
            </p>
            <Link href="/contact">
              <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-production-600">
                Contactez-nous
              </Button>
            </Link>
          </div>
        </Container>
      </section>
    </>
  );
}

