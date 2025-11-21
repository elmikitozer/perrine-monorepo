import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt = "Dix Huit Zéro Cinq - L'art du cocktail d'exception";
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'radial-gradient(circle at center, #E85D04 0%, #A4161A 50%, #FFBA08 100%)',
          fontFamily: 'system-ui',
        }}
      >
        {/* Logo */}
        <div
          style={{
            fontSize: 280,
            fontWeight: 900,
            color: '#FFBA08',
            textAlign: 'center',
            lineHeight: 0.85,
            textTransform: 'uppercase',
            letterSpacing: '-0.05em',
            display: 'flex',
            flexDirection: 'column',
            textShadow: '4px 4px 8px rgba(0,0,0,0.3)',
          }}
        >
          <span>DIX HUIT</span>
          <span>ZÉRO CINQ</span>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 36,
            color: 'rgba(245, 245, 245, 0.9)',
            marginTop: 40,
            textAlign: 'center',
            fontWeight: 300,
            letterSpacing: '0.05em',
          }}
        >
          L&apos;art du cocktail d&apos;exception
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

