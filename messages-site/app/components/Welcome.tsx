import Link from "next/link";

export default function Welcome() {
  return (
    <section className="relative overflow-hidden border-y border-pink-500/20 bg-black px-6 py-20">
      {/* Background glow and decoration */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        <div className="absolute -left-32 top-1/2 h-80 w-80 -translate-y-1/2 rounded-full bg-pink-600/10 blur-3xl" />
        <div className="absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-fuchsia-700/10 blur-3xl" />

        <span className="absolute left-[5%] top-[16%] text-6xl text-pink-400/10">
          ♡
        </span>

        <span className="absolute bottom-[14%] right-[7%] text-7xl text-pink-400/10">
          ♡
        </span>

        <span className="absolute left-[18%] top-[10%] animate-pulse text-xl text-pink-200/25">
          ✦
        </span>

        <span className="absolute bottom-[16%] right-[24%] animate-pulse text-2xl text-pink-300/20">
          ✧
        </span>
      </div>

      <div className="relative mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.08fr_0.92fr] lg:items-center">
        {/* Welcome message */}
        <div className="relative text-center lg:text-left">
          <div className="mb-6 flex items-center justify-center gap-4 lg:justify-start">
            <div className="h-px w-14 bg-gradient-to-r from-transparent to-pink-500" />

            <span className="text-xl text-pink-400">♡</span>

            <div className="h-px w-14 bg-gradient-to-l from-transparent to-pink-500" />
          </div>

          <p className="text-sm uppercase tracking-[0.32em] text-pink-400">
            Every letter carries a heart
          </p>

          <h1 className="mt-4 font-serif text-4xl leading-tight text-white sm:text-5xl lg:text-6xl">
            Welcome to
            <span className="block text-pink-300">
              Messages to Dom
            </span>
          </h1>

          <div className="mx-auto mt-6 flex w-fit items-center gap-3 lg:mx-0">
            <span className="text-xs text-pink-400/70">✦</span>
            <div className="h-px w-28 bg-gradient-to-r from-pink-500 to-pink-300/20" />
            <span className="text-xs text-pink-400/70">✦</span>
          </div>

          <p className="mt-8 max-w-2xl text-lg leading-8 text-gray-300">
            A fan-created space where people from around the world can share
            messages of encouragement, stories, artwork, photos, and treasured
            memories celebrating the positive impact Dom has had on their
            lives.
          </p>

          <p className="mt-5 max-w-2xl leading-8 text-gray-400">
            Every submission is reviewed before publication so this remains a
            welcoming community built on kindness, respect, and appreciation.
          </p>

          <div className="mt-7 inline-flex items-center gap-3 font-serif italic text-pink-300">
            <span className="text-xl">♡</span>
            <span>Thank you for being part of it.</span>
            <span className="text-xl">♡</span>
          </div>
        </div>

        {/* Vintage envelope actions */}
        <div className="relative">
          <div
            aria-hidden="true"
            className="absolute -inset-5 border border-pink-500/10"
          />

          <div
            aria-hidden="true"
            className="absolute -left-3 -top-3 h-8 w-8 border-l border-t border-pink-400/50"
          />

          <div
            aria-hidden="true"
            className="absolute -right-3 -top-3 h-8 w-8 border-r border-t border-pink-400/50"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-3 -left-3 h-8 w-8 border-b border-l border-pink-400/50"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-3 -right-3 h-8 w-8 border-b border-r border-pink-400/50"
          />

          <div className="relative space-y-6 bg-gradient-to-b from-zinc-950/95 to-black/95 p-5 sm:p-7">
            <Link
              href="/send-letter"
              className="group relative block overflow-hidden border border-pink-400/70 bg-gradient-to-br from-pink-950 via-black to-pink-950 px-7 py-8 shadow-[0_0_30px_rgba(236,72,153,0.18)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_0_42px_rgba(236,72,153,0.38)]"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.2),transparent_42%)]"
              />

              <div className="relative flex items-center gap-6">
                <div className="relative flex h-20 w-24 shrink-0 items-center justify-center border border-pink-300/50 bg-[#ead9cf] shadow-inner">
                  <span className="text-5xl">✉️</span>

                  <span className="absolute -bottom-4 left-1/2 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full border border-pink-200 bg-pink-800 text-xl text-white shadow-[0_0_20px_rgba(236,72,153,0.65)] transition group-hover:scale-110">
                    ♡
                  </span>
                </div>

                <div className="relative min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.25em] text-pink-300/70">
                    Seal it with love
                  </p>

                  <h2 className="mt-2 break-words font-serif text-2xl uppercase text-white">
  Send a Letter
</h2>

                  <p className="mt-2 text-sm leading-6 text-pink-100/65">
                    Share your message, memory, artwork, or encouragement.
                  </p>
                </div>

                <span className="relative text-3xl text-pink-300 transition group-hover:translate-x-2">
                  →
                </span>
              </div>
            </Link>

            <Link
              href="/letters"
              className="group relative block overflow-hidden border border-white/20 bg-white/[0.025] px-7 py-8 transition duration-300 hover:-translate-y-1 hover:border-pink-400/60 hover:bg-pink-950/20"
            >
              <div
                aria-hidden="true"
                className="absolute left-0 top-0 h-full w-px bg-gradient-to-b from-transparent via-pink-400 to-transparent"
              />

              <div className="relative flex items-center gap-6">
                <div className="flex h-20 w-24 shrink-0 items-center justify-center border border-white/15 bg-black/60 text-5xl text-pink-400 shadow-inner">
                  ♡
                </div>

                <div className="min-w-0 flex-1">
                  <p className="text-xs uppercase tracking-[0.25em] text-gray-500">
                    Open the fan book
                  </p>

                  <h2 className="mt-2 break-words font-serif text-2xl uppercase text-white">
                    Read the Letters
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-gray-400">
                    Discover approved messages shared by fans around the world.
                  </p>
                </div>

                <span className="text-3xl text-gray-400 transition group-hover:translate-x-2 group-hover:text-pink-300">
                  →
                </span>
              </div>
            </Link>

            <div className="flex items-center justify-center gap-4 pt-1 text-pink-400/60">
              <span>✦</span>
              <div className="h-px w-16 bg-pink-400/30" />
              <span className="font-serif text-sm uppercase tracking-[0.25em]">
                Sealed with kindness
              </span>
              <div className="h-px w-16 bg-pink-400/30" />
              <span>✦</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}