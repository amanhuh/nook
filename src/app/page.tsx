"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const BOOKS = [
  { title: "Signal", color: "#D9E7D4", text: "#243326", h: 150, w: 28 },
  { title: "Luster", color: "#F7B6C6", text: "#3A1F28", h: 210, w: 34 },
  { title: "Field Notes", color: "#3F6F53", text: "#F8F1E7", h: 120, w: 26 },
  { title: "Index", color: "#E5E1DA", text: "#1F1A17", h: 180, w: 22 },
  { title: "Printable", color: "#F1652F", text: "#FFF4EA", h: 245, w: 40 },
  { title: "Still Life", color: "#292522", text: "#F8F1E7", h: 205, w: 28 },
  { title: "Kitchen Table", color: "#F4A7B9", text: "#3F2531", h: 235, w: 34 },
  { title: "Monograph", color: "#E9DDD0", text: "#2D2420", h: 170, w: 24 },
  { title: "Architecture", color: "#C8677A", text: "#FFF7EF", h: 225, w: 30, tilt: "rotate-[-5deg] origin-bottom-left", gapBefore: 15 },
  { title: "The Reading Life", color: "#31425B", text: "#FAF7EF", h: 270, w: 56, tilt: "rotate-[3deg] origin-bottom-right", gapAfter: 13 }, 
  { title: "Blue Hour", color: "#2D69B3", text: "#EEF6FF", h: 250, w: 34 },
  { title: "Soft Power", color: "#8FB4C9", text: "#173041", h: 185, w: 26 },
  { title: "S M L XL", color: "#F2F0EB", text: "#1F1A17", h: 265, w: 48 },
  { title: "Night Walks", color: "#1F2430", text: "#F8F1E7", h: 220, w: 30 },
  { title: "The Garden", color: "#E9C24A", text: "#2D2310", h: 200, w: 28 },
  { title: "Volume Two", color: "#7B3B2A", text: "#FFF4EA", h: 240, w: 38 },
  { title: "Fragments", color: "#F47C38", text: "#FFF8F0", h: 215, w: 30 },
  { title: "Atlas", color: "#D6DBE4", text: "#1D2633", h: 255, w: 36 },
  { title: "Commonplace", color: "#F6D8AA", text: "#352515", h: 175, w: 24 },
  { title: "Kindred", color: "#A64D3D", text: "#FFF2EA", h: 230, w: 34, tilt: "rotate-[4deg] origin-bottom-right", gapAfter: 11 },
  { title: "Essays", color: "#F7C6D4", text: "#33222A", h: 160, w: 24 },
  { title: "Shelf Talk", color: "#2F6B5F", text: "#F7F2E8", h: 205, w: 28 },
  { title: "Paperbacks", color: "#E8E2D7", text: "#1F1A17", h: 190, w: 32 },
  { title: "After Hours", color: "#171717", text: "#F8F1E7", h: 245, w: 30 },
  { title: "Summer Reads", color: "#F3A63A", text: "#2F210C", h: 210, w: 34 },
  { title: "Tiny Joys", color: "#B7D7A8", text: "#25331E", h: 145, w: 26 },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#FFFCF7] text-stone-900 font-sans selection:bg-amber-200/70">
      <header className="relative z-20 flex w-full items-center justify-between px-5 py-5 sm:px-8 md:px-10">
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/nook-logo.svg"
            alt="Nook logo"
            width={32}
            height={32}
            priority
            className="h-8 w-8 object-contain transition-transform group-hover:-rotate-3"
          />
          <span className="font-display text-2xl font-bold tracking-tight text-stone-950">
            Nook
          </span>
        </Link>

        <nav className="flex items-center gap-5 text-sm font-medium text-stone-500">
          <Link href="/sign-in" className="hover:text-stone-950 transition-colors">
            Sign in
          </Link>
          <Link
            href="/sign-up"
            className="hidden sm:inline-flex rounded-full bg-stone-950 px-5 py-2.5 text-white shadow-sm shadow-stone-950/10 transition-all hover:-translate-y-0.5 hover:bg-stone-800 active:translate-y-0"
          >
            Get started
          </Link>
        </nav>
      </header>

      <main className="relative z-10 mx-auto flex w-full max-w-5xl flex-1 flex-col items-center justify-center px-6 pb-10 pt-8 text-center sm:pb-6">
        <h1 className="max-w-3xl font-display text-5xl font-bold leading-[0.92] tracking-[-0.055em] text-stone-950 sm:text-7xl md:text-[5.75rem]">
          Your reading life,
          <br />
          tucked in one nook.
        </h1>

        <p className="mt-6 max-w-md text-base leading-7 text-stone-500">
          A quiet home for the books you love.
        </p>

        <div className="mt-8">
          <Link
            href="/sign-up"
            className="group inline-flex h-12 items-center justify-center rounded-full bg-stone-950 px-6 text-sm font-semibold text-white shadow-sm shadow-stone-950/10 transition-all hover:-translate-y-0.5 hover:bg-stone-800 active:translate-y-0"
          >
            Open Your Nook
            <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </div>
      </main>

      <section className="relative z-0 mt-auto w-full" aria-hidden="true">
        <div className="absolute inset-x-0 bottom-0 h-24 bg-linear-to-t from-black/4 to-transparent" />
        <div className="flex w-full items-end justify-center overflow-hidden px-0">
          <div className="flex min-w-max items-end justify-center">
            {BOOKS.map((book, index) => (
              <div
                key={`${book.title}-${index}`}
                style={{
                  paddingLeft: `${book.gapBefore ?? 0}px`,
                  paddingRight: `${book.gapAfter ?? 0}px`,
                }}
                className="flex shrink-0 items-end"
              >
                <div
                  style={{
                    backgroundColor: book.color,
                    color: book.text,
                    height: `${book.h}px`,
                    width: `${book.w}px`,
                  }}
                  className={`relative flex flex-col items-center justify-between overflow-hidden border-r border-black/10 px-1.5 py-3 shadow-[inset_1px_0_rgba(255,255,255,0.28),inset_-6px_0_rgba(0,0,0,0.07)] ${book.tilt ?? ""}`}
                >
                  <div className="absolute inset-y-0 left-0 w-px bg-white/35" />
                  <span className="max-h-full truncate [writing-mode:vertical-lr] rotate-180 text-[10px] font-bold uppercase tracking-[0.16em] opacity-90">
                    {book.title}
                  </span>
                  <span className="h-6 w-px rounded-full bg-current opacity-25" />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-px w-full bg-stone-300" />
        <div className="h-3 w-full bg-[#EDE5D8]" />
      </section>
    </div>
  );
}
