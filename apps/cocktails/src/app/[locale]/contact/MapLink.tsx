'use client';

type Props = {
  className?: string;
};

export default function MapLink({ className }: Props) {
  const isApple = /iPhone|iPad|iPod/.test(navigator.userAgent);

  const mapUrl = isApple
    ? 'https://maps.apple.com/?q=101+rue+Damr%C3%A9mont+75018+Paris'
    : 'https://maps.app.goo.gl/oZ5HxjqMGrNUXXGf9';

  return (
    <a href={mapUrl} target="_blank" rel="noopener noreferrer" className={className}>
      101 rue Damrémont, 75018 Paris
    </a>
  );
}
