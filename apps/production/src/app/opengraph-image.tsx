import { ImageResponse } from 'next/og';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

// Carte de partage par défaut (WhatsApp, LinkedIn, iMessage…).
// Les pages projet définissent la leur à partir de la photo de l'événement.
export const runtime = 'nodejs';
export const alt = 'PV Studio — Designer graphique événementiel';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function OpengraphImage() {
  const logo = await readFile(
    path.join(process.cwd(), 'public/images/logo/og-logotype.png'),
  );
  const logoSrc = `data:image/png;base64,${logo.toString('base64')}`;

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#fdf8f9',
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={logoSrc} alt="" width={560} />

        <div
          style={{
            display: 'flex',
            width: 300,
            height: 2,
            marginTop: 56,
            marginBottom: 40,
            background: 'linear-gradient(90deg, #f9b3cb 0%, #f578c2 100%)',
          }}
        />

        <div
          style={{
            display: 'flex',
            fontSize: 26,
            letterSpacing: 12,
            textTransform: 'uppercase',
            color: '#f578c2',
          }}
        >
          Designer graphique événementiel
        </div>
      </div>
    ),
    { ...size },
  );
}
