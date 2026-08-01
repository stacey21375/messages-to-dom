import Link from "next/link";

export default function BirthdayCardPreview() {
  return (
    <section className="relative overflow-hidden border-y border-pink-500/20 bg-gradient-to-b from-black via-pink-950/15 to-black px-6 py-16">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-24 top-10 h-72 w-72 rounded-full bg-pink-600/10 blur-3xl" />

        <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />

        <div className="absolute left-10 top-8 text-7xl text-pink-500/10">
          ♡
        </div>

        <div className="absolute right-14 top-16 text-5xl text-pink-300/10">
          ✦
        </div>

        <div className="absolute bottom-8 left-1/3 text-6xl text-pink-500/10">
          🎂
        </div>
      </div>

      <div className="relative mx-auto max-w-5xl">
        <Link
          href="/birthday"
          className="group block overflow-hidden rounded-[2rem] border border-pink-300/40 bg-gradient-to-br from-zinc-950 via-pink-950/30 to-black p-5 shadow-[0_0_45px_rgba(236,72,153,0.16)] transition duration-500 hover:-translate-y-1 hover:border-pink-300/70 hover:shadow-[0_0_65px_rgba(236,72,153,0.28)] sm:p-8"
        >
          <div className="relative overflow-hidden rounded-[1.5rem] border border-pink-400/20 bg-black/50 px-6 py-12 text-center sm:px-10 sm:py-16">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-7 top-6 text-7xl text-pink-500/10">
                ♡
              </div>

              <div className="absolute right-8 top-8 text-5xl text-pink-300/10">
                ✦
              </div>

              <div className="absolute bottom-4 right-14 text-8xl text-pink-500/10">
                ♡
              </div>
            </div>

            <div className="relative">
              <div className="text-7xl transition duration-500 group-hover:scale-110">
                🎂
              </div>

              <p className="mt-6 text-sm uppercase tracking-[0.32em] text-pink-400">
                A birthday surprise from the Black Hearts
              </p>

              <h2 className="mt-4 font-serif text-4xl text-pink-100 sm:text-6xl">
                Sign Dom&apos;s Birthday Card
              </h2>

              <div className="mx-auto mt-5 h-px w-36 bg-pink-500/70" />

              <p className="mx-auto mt-7 max-w-2xl text-lg leading-8 text-gray-400">
                Add your name to one giant digital birthday card signed by
                fans from around the world.
              </p>

              <p className="mt-4 text-sm uppercase tracking-[0.2em] text-gray-500">
                Celebrating August 5
              </p>

              <span className="mt-9 inline-flex items-center gap-3 rounded-full border border-pink-300/60 bg-pink-600 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-white shadow-[0_0_25px_rgba(236,72,153,0.35)] transition group-hover:bg-pink-500 group-hover:text-black">
                Open and Sign the Card
                <span aria-hidden="true">→</span>
              </span>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}