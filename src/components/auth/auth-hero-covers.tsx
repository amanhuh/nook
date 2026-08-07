"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { SAMPLE_BOOK_COVERS } from "@/lib/config/covers";

export function AuthHeroCovers() {
  const col1Base = SAMPLE_BOOK_COVERS.slice(0, 8);
  const col2Base = SAMPLE_BOOK_COVERS.slice(8, 16);
  const col3Base = SAMPLE_BOOK_COVERS.slice(16, 24);

  const col1Covers = [...col1Base, ...col1Base];
  const col2Covers = [...col2Base, ...col2Base];
  const col3Covers = [...col3Base, ...col3Base];

  return (
    <div className="hidden lg:flex relative overflow-hidden lg:w-[45%] h-screen shrink-0">
      <div className="absolute inset-x-0 top-0 h-24 bg-linear-to-b from-background via-background/50 to-transparent z-10 pointer-events-none" />
      <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-background via-background/50 to-transparent z-10 pointer-events-none" />

      <div className="w-full h-full absolute inset-0 grid grid-cols-3 gap-5 px-6 opacity-80">
        <div className="h-full overflow-hidden relative">
          <motion.div
            animate={{ y: ["0%", "-50%"] }}
            transition={{ duration: 55, repeat: Infinity, ease: "linear" }}
            className="flex flex-col gap-5 pt-0"
          >
            {col1Covers.map((cover, i) => (
              <div
                key={`col1-${cover.id}-${i}`}
                className="w-full aspect-2/3 rounded-2xl overflow-hidden border border-border/80 shadow-xs relative bg-muted shrink-0"
              >
                <Image
                  src={cover.url}
                  alt={cover.title}
                  fill
                  unoptimized
                  sizes="200px"
                  className="object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="h-full overflow-hidden relative">
          <motion.div
            animate={{ y: ["-25%", "-75%"] }}
            transition={{ duration: 65, repeat: Infinity, ease: "linear" }}
            className="flex flex-col gap-5"
          >
            {col2Covers.map((cover, i) => (
              <div
                key={`col2-${cover.id}-${i}`}
                className="w-full aspect-2/3 rounded-2xl overflow-hidden border border-border/80 shadow-xs relative bg-muted shrink-0"
              >
                <Image
                  src={cover.url}
                  alt={cover.title}
                  fill
                  unoptimized
                  sizes="200px"
                  className="object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>

        <div className="h-full overflow-hidden relative">
          <motion.div
            animate={{ y: ["-12.5%", "-62.5%"] }}
            transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
            className="flex flex-col gap-5"
          >
            {col3Covers.map((cover, i) => (
              <div
                key={`col3-${cover.id}-${i}`}
                className="w-full aspect-2/3 rounded-2xl overflow-hidden border border-border/80 shadow-xs relative bg-muted shrink-0"
              >
                <Image
                  src={cover.url}
                  alt={cover.title}
                  fill
                  unoptimized
                  sizes="200px"
                  className="object-cover"
                />
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
