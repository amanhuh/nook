import Image from "next/image";
import { cn } from "@/lib/utils";
import { getCoverByIndex } from "@/lib/config/covers";

interface BookCoverProps {
  src?: string;
  alt?: string;
  index?: number;
  className?: string;
  children?: React.ReactNode;
}

export function BookCover({
  src,
  alt = "Book cover",
  index,
  className,
  children,
}: BookCoverProps) {
  const imageUrl = src ?? (index !== undefined ? getCoverByIndex(index).url : undefined);

  return (
    <div
      className={cn(
        "aspect-2/3 rounded rounded-r-xl overflow-hidden shrink-0 relative border border-foreground/10 shadow-xs",
        !imageUrl && "bg-foreground/8",
        className
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt}
          fill
          unoptimized
          sizes="(max-width: 768px) 100px, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : null}
      {children}
    </div>
  );
}
