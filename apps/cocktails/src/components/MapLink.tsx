"use client";

type Props = {
  address: string;
  className?: string;
};

export default function AddressMapLink({ address, className }: Props) {
  const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

  const encoded = encodeURIComponent(address);

  const mapUrl = isIOS
    ? `https://maps.apple.com/?q=${encoded}`
    : `https://www.google.com/maps/search/?api=1&query=${encoded}`;

  return (
    <a
      href={mapUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={className}
    >
      {address}
    </a>
  );
}
