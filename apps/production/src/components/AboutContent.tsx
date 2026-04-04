import { PortableText } from '@portabletext/react';
import type { AboutPage } from '@/types/sanity';

interface AboutContentProps {
  about: AboutPage | null;
}

const portableTextComponents = {
  block: {
    normal: ({ children }: { children?: React.ReactNode }) => (
      <p className="text-gray-700 leading-relaxed mb-6 font-light">{children}</p>
    ),
  },
};

export default function AboutContent({ about }: AboutContentProps) {
  return (
    <div>
      {/* Bio section */}
      <section className="mb-20">
        <h1 className="text-3xl font-light tracking-wider-custom uppercase mb-12 text-gray-900">
          À propos
        </h1>

        {about?.bio ? (
          <div className="prose-custom">
            <PortableText value={about.bio} components={portableTextComponents} />
          </div>
        ) : (
          <div className="space-y-6">
            <p className="text-gray-700 leading-relaxed font-light">
              Direction artistique spécialisée dans l'univers de la mode et du luxe. Une vision
              esthétique rigoureuse au service des grandes maisons et des marques émergentes.
            </p>
            <p className="text-gray-700 leading-relaxed font-light">
              Diplômée de l'École Nationale Supérieure des Arts Décoratifs, elle développe une
              pratique exigeante mêlant photographie, mise en scène et conception graphique.
            </p>
          </div>
        )}
      </section>

      {/* Contact section */}
      <section>
        <h2 className="text-lg font-light tracking-wider-custom uppercase mb-10 text-gray-900">
          Contact
        </h2>

        <div className="flex flex-col gap-6">
          {/* Email */}
          {about?.email && (
            <a
              href={`mailto:${about.email}`}
              className="text-gray-900 font-light tracking-wide hover:opacity-60 transition-opacity duration-300 w-fit"
            >
              {about.email}
            </a>
          )}

          {/* Social links */}
          <div className="flex items-center gap-8 mt-2">
            {about?.instagram && (
              <a
                href={about.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-wider-custom uppercase text-gray-500 hover:text-gray-900 transition-colors duration-300"
              >
                Instagram
              </a>
            )}
            {about?.linkedin && (
              <a
                href={about.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs tracking-wider-custom uppercase text-gray-500 hover:text-gray-900 transition-colors duration-300"
              >
                LinkedIn
              </a>
            )}
          </div>

          {/* Placeholder if no contact data */}
          {!about?.email && !about?.instagram && !about?.linkedin && (
            <p className="text-xs tracking-wider-custom uppercase text-gray-400">
              Configurez vos coordonnées dans le Sanity Studio
            </p>
          )}
        </div>
      </section>
    </div>
  );
}
