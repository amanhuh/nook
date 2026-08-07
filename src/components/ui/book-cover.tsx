import Image from "next/image";
import { BookOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { getCoverByIndex } from "@/lib/config/covers";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface BookCoverProps {
  src?: string;
  alt?: string;
  title?: string;
  index?: number;
  className?: string;
  children?: React.ReactNode;
  priority?: boolean;
  loading?: "eager" | "lazy";
}

export function BookCover({
  src,
  alt = "Book cover",
  title,
  index,
  className,
  children,
  priority,
  loading = "eager",
}: BookCoverProps) {
  const imageUrl = src ?? (index !== undefined ? getCoverByIndex(index).url : undefined);
  const isEager = priority || loading === "eager";

  const coverElement = (
    <div
      className={cn(
        "aspect-2/3 rounded rounded-r-xl overflow-hidden shrink-0 relative shadow-xs flex items-center justify-center border",
        imageUrl
          ? "border-foreground/10"
          : "bg-muted/80 border-border/80 text-muted-foreground",
        className
      )}
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={alt || title || "Book cover"}
          fill
          unoptimized
          priority={isEager}
          loading={isEager ? "eager" : "lazy"}
          sizes="(max-width: 768px) 100px, 200px"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
      ) : (
        <BookOpen className="w-8 h-8 text-muted-foreground/70" />
      )}
      {children}
    </div>
  );

  if (title) {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger render={coverElement} />
          <TooltipContent side="top" className="max-w-xs text-xs font-semibold bg-foreground text-background p-2 rounded-xl shadow-lg">
            {title}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return coverElement;
}
