'use client';

import { Children, useEffect, useMemo, useState, type ReactNode } from 'react';

interface MasonryGridProps {
  /** Largeur / hauteur de chaque enfant, dans le même ordre que `children`. */
  ratios: number[];
  children: ReactNode;
  gap?: number;
}

const DEFAULT_RATIO = 3 / 4;

function columnCountFor(width: number) {
  if (width >= 1280) return 4;
  if (width >= 768) return 3;
  return 2;
}

export default function MasonryGrid({ ratios, children, gap = 10 }: MasonryGridProps) {
  const items = Children.toArray(children);
  const [columnCount, setColumnCount] = useState(3);

  useEffect(() => {
    const sync = () => setColumnCount(columnCountFor(window.innerWidth));
    sync();
    window.addEventListener('resize', sync, { passive: true });
    return () => window.removeEventListener('resize', sync);
  }, []);

  const columns = useMemo(() => {
    const buckets: { node: ReactNode; ratio: number; index: number }[][] = Array.from(
      { length: columnCount },
      () => [],
    );
    // Les colonnes ont toutes la même largeur : une hauteur relative de 1/ratio
    // suffit à équilibrer sans mesurer le conteneur.
    const heights = new Array<number>(columnCount).fill(0);

    items.forEach((node, index) => {
      const ratio = ratios[index] > 0 ? ratios[index] : DEFAULT_RATIO;
      let shortest = 0;
      for (let i = 1; i < columnCount; i += 1) {
        if (heights[i] < heights[shortest]) shortest = i;
      }
      buckets[shortest].push({ node, ratio, index });
      heights[shortest] += 1 / ratio;
    });

    return buckets;
  }, [items, ratios, columnCount]);

  return (
    <div className="flex items-start" style={{ gap }}>
      {columns.map((column, columnIndex) => (
        <div
          key={columnIndex}
          className="flex min-w-0 flex-1 flex-col"
          style={{ rowGap: gap }}
        >
          {column.map(({ node, ratio, index }) => (
            <div key={index} className="relative w-full" style={{ aspectRatio: String(ratio) }}>
              {node}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
