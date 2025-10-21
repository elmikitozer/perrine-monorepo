import { Container, ContactForm } from '@perrine/ui';

export const metadata = {
  title: 'Contact - Perrine DA',
  description: 'Contactez-moi pour discuter de votre projet',
};

export default function ContactPage() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Contactez-moi</h1>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Vous avez un projet en tête ? Discutons-en !
          </p>

          <ContactForm />

          <div className="mt-12 text-center text-gray-600">
            <p>Vous pouvez également me joindre directement :</p>
            <p className="mt-2">
              <a href="mailto:contact@perrine-da.com" className="hover:text-black transition-colors">
                contact@perrine-da.com
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

