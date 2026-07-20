type EnvelopeCardProps = {
  id: number;
  name: string;
  country: string | null;
  createdAt: string;
  hasImage: boolean;
  onOpen: () => void;
};

const envelopeStyles = [
  {
    paper: "from-[#ead8c3] via-[#d9bea0] to-[#c9a985]",
    border: "border-[#b69168]",
    seal: "from-rose-500 via-rose-800 to-rose-950",
    accent: "text-[#6f493c]",
    label: "WITH LOVE",
  },
  {
    paper: "from-[#f0e0cc] via-[#dfc7aa] to-[#c8a886]",
    border: "border-[#b89470]",
    seal: "from-pink-400 via-pink-700 to-pink-950",
    accent: "text-[#76514a]",
    label: "MESSAGES TO DOM",
  },
  {
    paper: "from-[#e5d0b4] via-[#d2b28f] to-[#bd9770]",
    border: "border-[#a87e55]",
    seal: "from-red-500 via-red-800 to-red-950",
    accent: "text-[#694335]",
    label: "SEALED WITH LOVE",
  },
  {
    paper: "from-[#efe0d2] via-[#dfc7b7] to-[#c9a99a]",
    border: "border-[#b78e80]",
    seal: "from-fuchsia-500 via-fuchsia-800 to-fuchsia-950",
    accent: "text-[#74505b]",
    label: "FOR DOM",
  },
];

export default function EnvelopeCard({
  id,
  name,
  country,
  createdAt,
  hasImage,
  onOpen,
}: EnvelopeCardProps) {
  const style = envelopeStyles[id % envelopeStyles.length];

  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group block w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      aria-label={`Open letter from ${name}`}
    >
      <div className="relative mx-auto aspect-[4/3] w-full max-w-[360px]">
        <div
          aria-hidden="true"
          className="absolute inset-x-8 bottom-0 h-8 rounded-full bg-pink-500/20 blur-2xl transition duration-300 group-hover:bg-pink-500/35"
        />

        <div
          className={`absolute inset-x-0 bottom-3 top-5 overflow-hidden border ${style.border} bg-gradient-to-br ${style.paper} shadow-[0_18px_40px_rgba(0,0,0,0.5)] transition duration-300 group-hover:-translate-y-1`}
        >
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.8),transparent_22%),radial-gradient(circle_at_75%_65%,rgba(90,50,30,0.2),transparent_30%),repeating-linear-gradient(12deg,rgba(90,50,30,0.06)_0,rgba(90,50,30,0.06)_1px,transparent_1px,transparent_6px)]"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-[48%] -left-[12%] h-[105%] w-[72%] rotate-[32deg] border-r border-black/15 bg-black/[0.025]"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-[48%] -right-[12%] h-[105%] w-[72%] -rotate-[32deg] border-l border-black/15 bg-black/[0.025]"
          />

          <div
            aria-hidden="true"
            className="absolute bottom-[-58%] left-1/2 h-[108%] w-[80%] -translate-x-1/2 rotate-45 border-l border-t border-black/15 bg-white/10"
          />

          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-[54%] origin-top transition duration-500 ease-out group-hover:-translate-y-1"
            style={{
              clipPath: "polygon(0 0, 100% 0, 50% 100%)",
            }}
          >
            <div className="absolute inset-0 border-b border-black/20 bg-white/10" />
          </div>

          <div className={`absolute right-4 top-4 rotate-3 border ${style.border} bg-white/15 px-2 py-1 text-[9px] uppercase tracking-[0.16em] ${style.accent}`}>
            {style.label}
          </div>

          <div className={`absolute left-4 top-4 ${style.accent}`}>
            {id % 3 === 0 && (
              <div className="text-3xl">♡</div>
            )}

            {id % 3 === 1 && (
              <div className="text-2xl">🪽♡🪽</div>
            )}

            {id % 3 === 2 && (
              <div className="rounded-full border border-current px-2 py-1 text-[9px] uppercase tracking-[0.15em]">
                Thank you
              </div>
            )}
          </div>

          {hasImage && (
            <div className="absolute bottom-4 left-4 flex h-8 w-8 items-center justify-center rounded-full border border-black/15 bg-white/30 text-sm shadow">
              📷
            </div>
          )}

          <div className="absolute inset-x-5 bottom-5 z-10 text-center">
            <p className={`font-serif text-lg ${style.accent}`}>
              For Dom
            </p>

            <p className={`mt-1 truncate text-xs uppercase tracking-[0.2em] ${style.accent}`}>
              From {name}
            </p>
          </div>
        </div>

        <div
          className={`absolute left-1/2 top-[47%] z-30 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[45%_55%_48%_52%] border border-pink-200/70 bg-gradient-to-br ${style.seal} text-2xl text-white shadow-[inset_0_2px_5px_rgba(255,255,255,0.35),inset_0_-4px_8px_rgba(0,0,0,0.45),0_0_22px_rgba(236,72,153,0.65)] transition duration-300 group-hover:scale-110 group-hover:shadow-[inset_0_2px_5px_rgba(255,255,255,0.4),inset_0_-4px_8px_rgba(0,0,0,0.5),0_0_32px_rgba(236,72,153,0.95)]`}
        >
          <span className="drop-shadow-[0_1px_1px_rgba(0,0,0,0.7)]">♡</span>
        </div>
      </div>

      <div className="mx-auto mt-3 max-w-[360px] text-center">
        <p className="truncate font-serif text-lg text-pink-100">
          {name}
        </p>

        <div className="mt-1 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-gray-500">
          {country && <span>{country}</span>}
          {country && <span aria-hidden="true">♡</span>}
          <span>{formattedDate}</span>
        </div>

        <p className="mt-2 text-xs uppercase tracking-[0.2em] text-pink-400/70 transition group-hover:text-pink-300">
          Click to open
        </p>
      </div>
    </button>
  );
}