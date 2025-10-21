import React from 'react';

interface FooterProps {
  siteName: string;
  year?: number;
}

export const Footer: React.FC<FooterProps> = ({ siteName, year = new Date().getFullYear() }) => {
  return (
    <footer className="border-t border-gray-200 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-8">
        <div className="text-center text-sm text-gray-600">
          <p>© {year} {siteName}. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  );
};

