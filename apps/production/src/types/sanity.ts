export interface SanityImageDimensions {
  width: number;
  height: number;
  aspectRatio: number;
}

export interface SanityImageMetadata {
  dimensions?: SanityImageDimensions;
  lqip?: string;
}

export interface SanityImageAsset {
  _id: string;
  url: string;
  metadata?: SanityImageMetadata;
}

export interface SanityImage {
  _type: 'image';
  asset?: SanityImageAsset;
  hotspot?: { x: number; y: number; width: number; height: number };
  metadata?: SanityImageMetadata;
}

export interface Project {
  _id: string;
  title: string;
  slug?: { current: string };
  image?: SanityImage;
  order: number;
  client?: string;
  year?: number;
  isVisible?: boolean;
}

export interface PortableTextBlock {
  _type: 'block';
  _key: string;
  children: Array<{ _type: string; _key: string; text: string; marks?: string[] }>;
  markDefs?: unknown[];
  style?: string;
}

export interface AboutPage {
  bio?: PortableTextBlock[];
  email?: string;
  instagram?: string;
  linkedin?: string;
}
