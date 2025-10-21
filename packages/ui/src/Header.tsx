import React from 'react';
import Link from 'next/link';

interface HeaderProps {
  siteName: string;
  links?: { href: string; label: string }[];
}

export const Header: React.FC<HeaderProps> = ({ siteName, links = [] }) => {
  const defaultLinks = [
    { href: '/', label: 'Accueil' },
    { href: '/contact', label: 'Contact' },
  ];

  const navLinks = links.length > 0 ? links : defaultLinks;

  return (
    <header className="border-b border-gray-200">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
        <div className="flex items-center justify-between h-16 md:h-20">
          <Link href="/" className="text-xl md:text-2xl font-bold hover:opacity-80 transition-opacity">
            {siteName}
          </Link>

          <ul className="flex items-center gap-6 md:gap-8">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm md:text-base hover:text-gray-600 transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
};

