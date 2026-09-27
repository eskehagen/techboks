import { IMAGE_SIZES } from "@/data/imageSizes";

export interface ImageSources {
  src: string;
  srcSet?: string | undefined;
  width?: number | undefined;
  height?: number | undefined;
}

/**
 * WebP-udgaven af et billede i public/images, med 320 og 800 px-varianter i
 * srcset og de rigtige mål. Varianterne laves af `npm run images`.
 *
 * Et billede, der endnu ikke er optimeret, vises som originalen — så et nyt
 * produktbillede aldrig forsvinder, fordi scriptet ikke er kørt.
 */
export function imageSources(src: string): ImageSources {
  const size = IMAGE_SIZES[src];
  if (!size) return { src };
  const variant = (suffix: string) => src.replace(/\.(jpe?g|png)$/i, `${suffix}.webp`);
  const webp = variant("");
  const candidates = [
    ...(size.w > 320 ? [`${variant("-320")} 320w`] : []),
    ...(size.w > 800 ? [`${variant("-800")} 800w`] : []),
  ];
  return {
    src: webp,
    srcSet: candidates.length ? [...candidates, `${webp} ${size.w}w`].join(", ") : undefined,
    width: size.w,
    height: size.h,
  };
}
