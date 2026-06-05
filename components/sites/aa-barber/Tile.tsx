import Image from "next/image";
import { assetPath } from "@/lib/assetPath";
import { cn } from "@/lib/cn";
import styles from "./aa.module.css";

interface TileProps {
  src: string;
  alt: string;
  /** Show industrial corner ticks. */
  corners?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

/**
 * Square-ish image tile with a subtle desaturation that pops to full colour on
 * hover. A'A's photos are low-res so these are kept small (grid tiles / strips).
 */
export function Tile({
  src,
  alt,
  corners = false,
  className,
  sizes = "(max-width: 768px) 50vw, 25vw",
  priority = false,
}: TileProps) {
  return (
    <figure className={cn(styles.tile, styles.tileFrame, className)}>
      <Image
        src={assetPath(src)}
        alt={alt}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
      {corners && (
        <>
          <span className={cn(styles.corner, styles.cornerTL)} />
          <span className={cn(styles.corner, styles.cornerTR)} />
          <span className={cn(styles.corner, styles.cornerBL)} />
          <span className={cn(styles.corner, styles.cornerBR)} />
        </>
      )}
    </figure>
  );
}
