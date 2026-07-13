import Link from "next/link";

export default function FeaturedLetters() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
          Written with love
        </p>

        <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
          Featured Letters
        </h2>

        <div className="mx-auto mt-4 h-px w-32 bg-pink-500/70" />
      </div>

      <div className="grid gap-7 md:grid-cols-3">
        {[
          {
            name: "Sarah",
            location: "Ohio, USA",
            message:
              "Your kindness and strength inspire me every single day. Thank you for helping people feel less alone.",
          },
          {
            name: "Jamie",
            location: "Ontario, Canada",
            message:
              "Thank you for bringing people together and reminding us that it is okay to be different.",
          },
          {
            name: "Lily",
            location: "London, UK",
            message:
              "Your music has helped me through difficult days and given me memories I will always treasure.",
          },
        ].map((letter) => (
          <article
            key={letter.name}
            className="group relative overflow-hidden border border-white/20 bg-gradient-to-b from-zinc-900 to-black p-6 transition duration-300 hover:-translate-y-2 hover:border-pink-400/70 hover:shadow-[0_0_30px_rgba(236,72,153,0.22)]"
          >
            <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-pink-400 to-transparent" />

            <div className="mb-5 text-center text-4xl text-pink-400">
              💌
            </div>

            <div className="border border-pink-200/20 bg-pink-50/95 px-5 py-6 text-center text-zinc-900 shadow-inner">
              <p className="font-serif text-lg italic">
                From: {letter.name}
              </p>

              <p className="mt-1 text-xs uppercase tracking-[0.15em] text-pink-700">
                {letter.location}
              </p>

              <p className="mt-5 font-serif leading-7">
                “{letter.message}”
              </p>
            </div>

            <div className="mx-auto -mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-pink-300 bg-pink-800 text-lg shadow-[0_0_18px_rgba(236,72,153,0.55)]">
              ♡
            </div>

            <button className="mt-6 w-full text-xs uppercase tracking-[0.2em] text-gray-300 transition group-hover:text-pink-400">
              Open Letter →
            </button>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/letters"
          className="text-sm uppercase tracking-[0.22em] text-pink-400 transition hover:text-pink-300"
        >
          View all letters →
        </Link>
      </div>
    </section>
  );
}