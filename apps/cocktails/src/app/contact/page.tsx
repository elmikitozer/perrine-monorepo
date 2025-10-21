import { Container, ContactForm } from '@perrine/ui';

export const metadata = {
  title: 'Contact - Cocktails',
  description: 'Contactez-nous pour partager vos recettes ou poser vos questions',
};

export default function ContactPage() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Contactez-nous</h1>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Vous avez une recette à partager ou une question ? N'hésitez pas !
          </p>

          <ContactForm />

          <div className="mt-12 text-center text-gray-600">
            <p>Vous pouvez également nous écrire à :</p>
            <p className="mt-2">
              <a href="mailto:contact@cocktails-recettes.com" className="hover:text-cocktail-600 transition-colors">
                contact@cocktails-recettes.com
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

