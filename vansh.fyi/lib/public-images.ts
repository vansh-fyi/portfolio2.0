import manifest from './public-images.generated.json';

type ImageSource = { width: number; height: number; variants: { w: number; src: string }[] };
const images: Record<string, ImageSource> = manifest;

/** Content-hashed, pre-generated variants also work in static/Vite previews. */
export function publicImage(src: string, targetWidth = 1024) {
  const image = images[src];
  if (!image) return { src };
  const variant = image.variants.find((v) => v.w >= targetWidth) ?? image.variants[image.variants.length - 1];
  return {
    src: variant.src,
    srcSet: image.variants.map((v) => `${v.src} ${v.w}w`).join(', '),
    width: image.width,
    height: image.height,
  };
}
