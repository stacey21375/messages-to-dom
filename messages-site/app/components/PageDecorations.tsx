export default function PageDecorations() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
    >
      {/* Soft pink glows */}
      <div className="absolute -left-32 top-40 h-80 w-80 rounded-full bg-pink-600/10 blur-3xl" />
      <div className="absolute -right-32 top-[45%] h-96 w-96 rounded-full bg-pink-500/10 blur-3xl" />
      <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-fuchsia-700/10 blur-3xl" />

      {/* Floating hearts */}
      <span className="absolute left-[6%] top-[18%] text-5xl text-pink-400/15">
        ♡
      </span>

      <span className="absolute right-[8%] top-[30%] text-7xl text-pink-500/10">
        ♡
      </span>

      <span className="absolute bottom-[20%] left-[12%] text-6xl text-pink-400/10">
        ♡
      </span>

      <span className="absolute bottom-[8%] right-[16%] text-4xl text-pink-300/15">
        ♡
      </span>

      {/* Sparkles */}
      <span className="absolute left-[18%] top-[10%] animate-pulse text-xl text-pink-200/30">
        ✦
      </span>

      <span className="absolute right-[20%] top-[16%] animate-pulse text-2xl text-pink-300/20">
        ✧
      </span>

      <span className="absolute left-[42%] top-[38%] animate-pulse text-lg text-pink-200/20">
        ✦
      </span>

      <span className="absolute bottom-[28%] right-[38%] animate-pulse text-2xl text-pink-300/20">
        ✧
      </span>

      {/* Candle accents */}
      <div className="absolute bottom-8 left-5 opacity-30 sm:left-10">
        <div className="text-4xl drop-shadow-[0_0_15px_rgba(244,114,182,0.55)]">
          🕯️
        </div>
      </div>

      <div className="absolute bottom-8 right-5 opacity-30 sm:right-10">
        <div className="text-4xl drop-shadow-[0_0_15px_rgba(244,114,182,0.55)]">
          🕯️
        </div>
      </div>
    </div>
  );
}