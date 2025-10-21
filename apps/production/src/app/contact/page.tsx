import { Container, ContactForm } from '@perrine/ui';

export const metadata = {
  title: 'Contact - Production',
  description: 'Contactez-nous pour discuter de votre projet de production',
};

export default function ContactPage() {
  return (
    <section className="py-20">
      <Container>
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">Contactez-nous</h1>
          <p className="text-xl text-gray-600 mb-12 text-center">
            Vous avez un projet en production ? Parlons-en !
          </p>

          <ContactForm />

          <div className="mt-12 text-center text-gray-600">
            <p>Vous pouvez également nous joindre directement :</p>
            <p className="mt-2">
              <a href="mailto:contact@production-studio.com" className="hover:text-production-600 transition-colors">
                contact@production-studio.com
              </a>
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}

