import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<{ default: ImageMetadata }>(
  '../assets/images/*.{jpg,jpeg,png,webp}',
  { eager: true },
);

export function getImage(filename: string): ImageMetadata {
  const entry = Object.entries(modules).find(([path]) =>
    path.endsWith(`/${filename}`),
  );
  if (!entry) {
    throw new Error(`Image not found: ${filename}`);
  }
  return entry[1].default;
}

export function getImages(filenames: string[]): ImageMetadata[] {
  return filenames.map(getImage);
}