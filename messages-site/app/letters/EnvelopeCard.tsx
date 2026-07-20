type EnvelopeCardProps = {
  name: string;
  country: string | null;
  createdAt: string;
  hasImage: boolean;
  onOpen: () => void;
};

export default function EnvelopeCard({
  name,
  country,
  createdAt,
  hasImage,
  onOpen,
}: EnvelopeCardProps) {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <button
      type="button"
      onClick={onOpen}
      className="group relative w-full text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 focus-visible:ring-offset-4 focus-visible:ring-offset-black"
      aria-label={`Open letter from ${name}`}
    >
      <div className="relative mx-auto aspect-[4/3] w-full max-w-[360px] transition duration-300 group-hover:-translate-y-2 group-focus-visible:-translate-y-2">
        {/* Envelope shadow */}
        <div
          aria-hidden="true"
          className="absolute inset-x-8 bottom-0 h-8 rounded-full bg-pink-500/20 blur-xl transition duration-300 group-hover:bg-pink-500/35"
        />

        {/* Envelope body */}
        <div className="absolute inset-x-0 bottom-3 top-7 overflow-hidden border border-[#d7c0b2] bg-gradient-to-br from-[#f8eee7] via-[#ead8cc] to-[#d9bfb1] shadow-[0_18px_40px_rgba(0,0,0,0.45)]">
          {/* Paper texture */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-30 [background-image:radial-gradient(circle_at_20%_25%,rgba(255,255,255,0.8)_0,transparent_24%),radial-gradient(circle_at_80%_70%,rgba(139,92,76,0.16)_0,transparent_28%)]"
          />

          {/* Bottom envelope folds */}
          <div
            aria-hidden="true"
            className="absolute -bottom-[47%] -left-[12%] h-[105%] w-[72%] rotate-[32deg] border-r border-[#c8ab9b]/70 bg-[#ead8cc]"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-[47%] -right-[12%] h-[105%] w-[72%] -rotate-[32deg] border-l border-[#c8ab9b]/70 bg-[#e3cdbf]"
          />

          {/* Center fold */}
          <div
            aria-hidden="true"
            className="absolute bottom-[-56%] left-1/2 h-[105%] w-[78%] -translate-x-1/2 rotate-45 border-l border-t border-[#c8ab9b]/60 bg-[#f0dfd4]"
          />

          {/* Envelope information */}
          <div className="absolute inset-x-5 bottom-5 z-10 text-center">
            <p className="truncate font-serif text-lg text-[#4a302d]">
              For Dom
            </p>

            <p className="mt-1 truncate text-xs uppercase tracking-[0.2em] text-[#795752]">
              From {name}
            </p>
          </div>
        </div>

        {/* Envelope flap */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 top-7 z-20 h-[54%] origin-top overflow-hidden transition duration-500 ease-out group-hover:-translate-y-1"
          style={{
            clipPath: "polygon(0 0, 100% 0, 50% 100%)",
          }}
        >
          <div className="absolute inset-0 border border-[#d7c0b2] bg-gradient-to-b from-[#f8eee7] to-[#dbc2b4]" />

          <div className="absolute left-1/2 top-[36%] h-px w-[65%] -translate-x-1/2 bg-[#c8ab9b]/60" />
        </div>

        {/* Wax seal */}
        <div className="absolute left-1/2 top-[48%] z-30 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-pink-200/80 bg-gradient-to-br from-pink-500 via-pink-700 to-pink-950 text-2xl text-white shadow-[0_0_20px_rgba(236,72,153,0.6)] transition duration-300 group-hover:scale-110 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.9)]">
          ♡
        </div>

        {/* Decorative stamp */}
        <div className="absolute right-4 top-11 z-30 rotate-6 border border-[#9b6d7e]/50 px-2 py-1 text-[9px] uppercase tracking-[0.18em] text-[#79515f]">
          Messages
          <br />
          to Dom
        </div>

        {/* Image indicator */}
        {hasImage && (
          <div className="absolute left-4 top-11 z-30 flex h-8 w-8 items-center justify-center rounded-full border border-[#9b6d7e]/40 bg-[#f8eee7]/90 text-sm text-[#79515f] shadow">
            📷
          </div>
        )}
      </div>

      {/* Label beneath envelope */}
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