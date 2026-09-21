import Image from "next/image";
import type { CSSProperties } from "react";
import type { MediaAsset } from "@/types/content";
import { withBasePath } from "@/lib/basePath";
import { cn } from "@/lib/cn";

interface PlateProps {
  media: MediaAsset;
  /** Responsive width hint. Always pass a real one. */
  sizes: string;
  /** Only images above the fold should set this. */
  priority?: boolean;
  /** `contain` for the technical figure — a diagram cropped at the edges stops
   *  being a diagram. Everything photographic is `cover`. */
  fit?: "cover" | "contain";
  className?: string;
}

/**
 * An image inside a hairline frame.
 *
 * Replaces the editorial engine's `EditorialImage`, and what it dropped is the
 * point: no crop drift on scroll, no hover zoom, no reveal delay. A catalogue
 * photograph is a record of a part. Animating it would be the same mistake as
 * putting a serif display face on a datasheet.
 *
 * It is also a server component now, because nothing here needs the client —
 * the editorial version was `"use client"` only to run an intersection
 * observer for the crop animation that no longer exists.
 *
 * `withBasePath` is not optional: Next does not prefix the base path onto the
 * `src` of a `next/image` when `images.unoptimized` is set, so on a GitHub
 * Pages project site every image would 404 without it — and would look
 * perfect in `next dev`.
 */
export function Plate({ media, sizes, priority = false, fit = "cover", className }: PlateProps) {
  return (
    <div
      className={cn("img-frame", className)}
      style={{ aspectRatio: media.ratio.replace("/", " / ") } as CSSProperties}
    >
      <div className="img-fill">
        <Image
          src={withBasePath(media.src)}
          alt={media.alt}
          fill
          sizes={sizes}
          priority={priority}
          loading={priority ? undefined : "lazy"}
          className={fit === "contain" ? "img-contain" : "img-zoom"}
        />
      </div>
    </div>
  );
}
