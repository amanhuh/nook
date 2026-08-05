function PlainGreyBookCard({ aspect = "aspect-[2/3]" }: { aspect?: string }) {
  return (
    <div
      className={`w-full ${aspect} rounded-2xl bg-muted border border-border shadow-sm shrink-0`}
    />
  );
}

const column1Cards = [
  { aspect: "aspect-[2/3]" },
  { aspect: "aspect-[3/4.2]" },
  { aspect: "aspect-[2.2/3.2]" },
  { aspect: "aspect-[2/3]" },
  { aspect: "aspect-[3/4.2]" },
  { aspect: "aspect-[2.2/3.2]" },
];

const column2Cards = [
  { aspect: "aspect-[2.2/3.2]" },
  { aspect: "aspect-[2/3]" },
  { aspect: "aspect-[3/4.2]" },
  { aspect: "aspect-[2.2/3.2]" },
  { aspect: "aspect-[2/3]" },
  { aspect: "aspect-[3/4.2]" },
];

const column3Cards = [
  { aspect: "aspect-[3/4.2]" },
  { aspect: "aspect-[2.2/3.2]" },
  { aspect: "aspect-[2/3]" },
  { aspect: "aspect-[3/4.2]" },
  { aspect: "aspect-[2.2/3.2]" },
  { aspect: "aspect-[2/3]" },
];

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-background text-foreground font-sans overflow-hidden">
      <div className="hidden lg:flex relative overflow-hidden lg:w-[45%] h-screen shrink-0 border-r border-border">
        <div className="absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-white via-white/80 to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-white via-white/80 to-transparent z-10 pointer-events-none" />

        <div className="w-full h-[200%] absolute top-0 inset-x-0 grid grid-cols-3 gap-6 sm:gap-8 p-6 opacity-70">
          <div className="flex flex-col gap-6 sm:gap-8 animate-move-down pt-0">
            {[...column1Cards, ...column1Cards].map((card, i) => (
              <PlainGreyBookCard key={`c1-${i}`} aspect={card.aspect} />
            ))}
          </div>

          <div className="flex flex-col gap-6 sm:gap-8 animate-move-down pt-32 sm:pt-40">
            {[...column2Cards, ...column2Cards].map((card, i) => (
              <PlainGreyBookCard key={`c2-${i}`} aspect={card.aspect} />
            ))}
          </div>

          <div className="flex flex-col gap-6 sm:gap-8 animate-move-down pt-14 sm:pt-18">
            {[...column3Cards, ...column3Cards].map((card, i) => (
              <PlainGreyBookCard key={`c3-${i}`} aspect={card.aspect} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 lg:w-[55%] h-screen flex items-center justify-center p-8 sm:p-12 lg:p-16 overflow-y-auto bg-background">
        <div className="w-full max-w-sm">{children}</div>
      </div>
    </div>
  );
}
