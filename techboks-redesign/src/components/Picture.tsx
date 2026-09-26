import { imageSources } from "@/lib/images";

/**
 * <img> til billeder i public/images: WebP, srcset og faste mål.
 *
 * `sizes` fortæller browseren, hvor bredt billedet vises, så den kan nøjes
 * med 800 px-varianten i gitre og kort. `priority` bruges kun på billedet
 * over folden (sidens LCP) — alt andet hentes først, når det nærmer sig.
 */
export function Picture({
  src,
  alt,
  sizes,
  priority = false,
  className,
}: {
  src: string;
  alt: string;
  sizes: string;
  priority?: boolean;
  className?: string;
}) {
  const image = imageSources(src);
  return (
    <img
      src={image.src}
      srcSet={image.srcSet}
      sizes={image.srcSet ? sizes : undefined}
      width={image.width}
      height={image.height}
      alt={alt}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : undefined}
      decoding="async"
      className={className}
    />
  );
}
