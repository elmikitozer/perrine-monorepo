import Link from 'next/link';
import { FooterCocktail } from '@/components';

const content = {
  fr: {
    title: 'Informations légales',
    nav: {
      mentions: 'Mentions légales',
      privacy: 'Politique de confidentialité',
      cgu: 'CGU',
    },
    mentions: {
      title: 'Mentions légales',
      sections: [
        {
          heading: 'Éditeur du site',
          body: `Le site www.dixhuitzerocinq.com est édité par :

DIX HUIT ZERO CINQ SASU
101 rue Damrémont, 75018 Paris, France
SIRET : 102 330 537 00014
Directrice de publication : Perrine Vael-Roquère
Email : hello@dixhuitzerocinq.com
Téléphone : +33 6 58 76 86 07`,
        },
        {
          heading: 'Hébergeur',
          body: `Vercel Inc.
340 Pine Street, Suite 701
San Francisco, CA 94104, États-Unis
https://vercel.com`,
        },
        {
          heading: 'Propriété intellectuelle',
          body: `L'ensemble des contenus présents sur ce site (textes, images, logos, visuels) sont la propriété exclusive de DIX HUIT ZERO CINQ SASU ou de leurs auteurs respectifs. Toute reproduction, même partielle, est interdite sans autorisation préalable écrite.`,
        },
        {
          heading: 'Responsabilité',
          body: `DIX HUIT ZERO CINQ SASU ne saurait être tenu responsable des dommages directs ou indirects résultant de l'accès au site ou de l'utilisation de ses contenus.`,
        },
        {
          heading: 'Loi applicable',
          body: `Le présent site et les présentes mentions légales sont soumis au droit français. En cas de litige, les tribunaux français seront seuls compétents.`,
        },
      ],
    },
    privacy: {
      title: 'Politique de confidentialité',
      sections: [
        {
          heading: 'Responsable du traitement',
          body: `DIX HUIT ZERO CINQ SASU — 101 rue Damrémont, 75018 Paris — hello@dixhuitzerocinq.com`,
        },
        {
          heading: 'Données collectées',
          body: `Ce site ne collecte aucune donnée personnelle identifiable sans votre consentement explicite.

Un cookie technique nommé age_verified est déposé sur votre navigateur lors de la vérification de votre âge. Ce cookie ne contient aucune donnée personnelle et sert uniquement à mémoriser que vous avez confirmé être majeur, afin de ne pas vous présenter la page de vérification à chaque visite.`,
        },
        {
          heading: 'Durée de conservation',
          body: `— Cookie age_verified (avec "Se souvenir de moi") : 365 jours
— Cookie age_verified (sans "Se souvenir de moi") : 24 heures

Ces cookies sont automatiquement supprimés à leur expiration.`,
        },
        {
          heading: 'Mesure d\'audience',
          body: `Ce site utilise Vercel Analytics pour mesurer l'audience de manière anonymisée (pages vues, pays de visite, type d'appareil, source du trafic). Cet outil ne dépose aucun cookie de traçage et ne collecte aucune donnée personnelle. Aucune bannière de consentement n'est requise pour son utilisation.`,
        },
        {
          heading: 'Vos droits',
          body: `Conformément au Règlement Général sur la Protection des Données (RGPD), vous disposez d'un droit d'accès, de rectification et de suppression des données vous concernant. Pour exercer ces droits, contactez-nous à : hello@dixhuitzerocinq.com`,
        },
        {
          heading: 'Cookies',
          body: `Pour supprimer ou désactiver les cookies, rendez-vous dans les paramètres de votre navigateur. La désactivation du cookie age_verified entraînera l'affichage de la page de vérification d'âge à chaque visite.`,
        },
      ],
    },
    cgu: {
      title: "Conditions générales d'utilisation",
      sections: [
        {
          heading: 'Objet',
          body: `Les présentes Conditions Générales d'Utilisation (CGU) régissent l'accès et l'utilisation du site www.dixhuitzerocinq.com, édité par DIX HUIT ZERO CINQ SASU.`,
        },
        {
          heading: 'Accès au site — restriction d\'âge',
          body: `Ce site fait la promotion d'une boisson alcoolisée. L'accès est strictement réservé aux personnes majeures, c'est-à-dire âgées de 18 ans ou plus. En accédant au site, vous certifiez sur l'honneur être majeur selon la législation en vigueur dans votre pays de résidence.

La vente et la promotion de boissons alcoolisées à des mineurs sont interdites par la loi française (article L. 3342-1 du Code de la santé publique).`,
        },
        {
          heading: 'Utilisation du site',
          body: `Le site est mis à disposition à titre d'information. L'utilisateur s'engage à ne pas utiliser le site à des fins illicites ou contraires aux bonnes mœurs, et à ne pas tenter de nuire à son bon fonctionnement.`,
        },
        {
          heading: 'Responsabilité',
          body: `DIX HUIT ZERO CINQ SASU s'efforce de maintenir les informations du site à jour mais ne garantit pas leur exactitude complète. L'éditeur décline toute responsabilité quant aux conséquences de l'utilisation des informations publiées.`,
        },
        {
          heading: 'Consommation responsable',
          body: `L'abus d'alcool est dangereux pour la santé. DIX HUIT ZERO CINQ encourage une consommation modérée et responsable. Ne jamais conduire après avoir consommé de l'alcool.`,
        },
        {
          heading: 'Modification des CGU',
          body: `DIX HUIT ZERO CINQ SASU se réserve le droit de modifier les présentes CGU à tout moment. Les modifications prennent effet dès leur publication sur le site.`,
        },
        {
          heading: 'Contact',
          body: `Pour toute question : hello@dixhuitzerocinq.com`,
        },
      ],
    },
  },
  en: {
    title: 'Legal Information',
    nav: {
      mentions: 'Legal Notice',
      privacy: 'Privacy Policy',
      cgu: 'Terms of Use',
    },
    mentions: {
      title: 'Legal Notice',
      sections: [
        {
          heading: 'Publisher',
          body: `The website www.dixhuitzerocinq.com is published by:

DIX HUIT ZERO CINQ SASU
101 rue Damrémont, 75018 Paris, France
SIRET: 102 330 537 00014
Publication Director: Perrine Vael-Roquère
Email: hello@dixhuitzerocinq.com
Phone: +33 6 58 76 86 07`,
        },
        {
          heading: 'Hosting Provider',
          body: `Vercel Inc.
340 Pine Street, Suite 701
San Francisco, CA 94104, United States
https://vercel.com`,
        },
        {
          heading: 'Intellectual Property',
          body: `All content on this site (texts, images, logos, visuals) is the exclusive property of DIX HUIT ZERO CINQ SASU or their respective authors. Any reproduction, even partial, is prohibited without prior written authorization.`,
        },
        {
          heading: 'Liability',
          body: `DIX HUIT ZERO CINQ SASU cannot be held liable for any direct or indirect damage resulting from access to the site or use of its content.`,
        },
        {
          heading: 'Applicable Law',
          body: `This site and these legal notices are governed by French law. In the event of a dispute, French courts shall have sole jurisdiction.`,
        },
      ],
    },
    privacy: {
      title: 'Privacy Policy',
      sections: [
        {
          heading: 'Data Controller',
          body: `DIX HUIT ZERO CINQ SASU — 101 rue Damrémont, 75018 Paris — hello@dixhuitzerocinq.com`,
        },
        {
          heading: 'Data Collected',
          body: `This site does not collect any personally identifiable data without your explicit consent.

A technical cookie named age_verified is stored in your browser upon age verification. This cookie contains no personal data and is used solely to remember that you have confirmed being of legal age, so that the verification page is not shown on every visit.`,
        },
        {
          heading: 'Retention Period',
          body: `— age_verified cookie (with "Remember me"): 365 days
— age_verified cookie (without "Remember me"): 24 hours

These cookies are automatically deleted upon expiry.`,
        },
        {
          heading: 'Analytics',
          body: `This site uses Vercel Analytics to measure audience in an anonymized manner (page views, country of visit, device type, traffic source). This tool does not set any tracking cookies and does not collect any personal data. No consent banner is required for its use.`,
        },
        {
          heading: 'Your Rights',
          body: `In accordance with the General Data Protection Regulation (GDPR), you have the right to access, rectify and delete data concerning you. To exercise these rights, contact us at: hello@dixhuitzerocinq.com`,
        },
        {
          heading: 'Cookies',
          body: `To delete or disable cookies, go to your browser settings. Disabling the age_verified cookie will cause the age verification page to appear on every visit.`,
        },
      ],
    },
    cgu: {
      title: 'Terms of Use',
      sections: [
        {
          heading: 'Purpose',
          body: `These Terms of Use govern access to and use of the website www.dixhuitzerocinq.com, published by DIX HUIT ZERO CINQ SASU.`,
        },
        {
          heading: 'Site Access — Age Restriction',
          body: `This site promotes an alcoholic beverage. Access is strictly reserved for adults aged 18 or over. By accessing the site, you certify that you are of legal age under the laws of your country of residence.

The sale and promotion of alcoholic beverages to minors is prohibited by French law.`,
        },
        {
          heading: 'Use of the Site',
          body: `The site is made available for informational purposes. Users agree not to use the site for illegal or improper purposes, and not to attempt to interfere with its proper functioning.`,
        },
        {
          heading: 'Liability',
          body: `DIX HUIT ZERO CINQ SASU strives to keep site information up to date but does not guarantee its complete accuracy. The publisher accepts no liability for the consequences of using published information.`,
        },
        {
          heading: 'Responsible Consumption',
          body: `Alcohol abuse is dangerous to your health. DIX HUIT ZERO CINQ encourages moderate and responsible consumption. Never drink and drive.`,
        },
        {
          heading: 'Amendments',
          body: `DIX HUIT ZERO CINQ SASU reserves the right to amend these Terms of Use at any time. Amendments take effect upon publication on the site.`,
        },
        {
          heading: 'Contact',
          body: `For any questions: hello@dixhuitzerocinq.com`,
        },
      ],
    },
  },
};

export default function LegalPage({ params: { locale } }: { params: { locale: string } }) {
  const lang = locale === 'en' ? 'en' : 'fr';
  const t = content[lang];

  return (
    <>
      <div className="min-h-screen pt-28 pb-24 px-4 md:px-8 max-w-4xl mx-auto">

        {/* Back */}
        <Link
          href={`/${locale}`}
          className="inline-flex items-center gap-2 text-rouge/50 hover:text-rouge text-sm mb-10 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {lang === 'fr' ? 'Retour' : 'Back'}
        </Link>

        <h1 className="font-logo text-4xl md:text-5xl text-rouge font-bold mb-12">{t.title}</h1>

        {/* Anchor nav */}
        <nav className="flex flex-wrap gap-3 mb-16 border-b border-rouge/10 pb-8">
          {(['mentions', 'privacy', 'cgu'] as const).map((key) => (
            <a
              key={key}
              href={`#${key}`}
              className="text-sm text-rouge/60 hover:text-rouge border border-rouge/20 hover:border-rouge/50 rounded-full px-4 py-2 transition-all"
            >
              {t.nav[key]}
            </a>
          ))}
        </nav>

        {/* Sections */}
        {(['mentions', 'privacy', 'cgu'] as const).map((sectionKey) => {
          const section = t[sectionKey];
          return (
            <section key={sectionKey} id={sectionKey} className="mb-20 scroll-mt-28">
              <h2 className="font-logo text-2xl md:text-3xl text-rouge font-bold mb-8 pb-4 border-b border-rouge/10">
                {section.title}
              </h2>
              <div className="space-y-8">
                {section.sections.map((item, i) => (
                  <div key={i}>
                    <h3 className="font-sans font-bold text-rouge/80 text-sm uppercase tracking-wider mb-3">
                      {item.heading}
                    </h3>
                    <p className="text-rouge/60 text-sm leading-relaxed whitespace-pre-line">
                      {item.body}
                    </p>
                  </div>
                ))}
              </div>
            </section>
          );
        })}

        <p className="text-rouge/30 text-xs text-center pt-8 border-t border-rouge/10">
          {lang === 'fr'
            ? `Dernière mise à jour : avril 2026 — DIX HUIT ZERO CINQ SASU`
            : `Last updated: April 2026 — DIX HUIT ZERO CINQ SASU`}
        </p>
      </div>

      <FooterCocktail />
    </>
  );
}
