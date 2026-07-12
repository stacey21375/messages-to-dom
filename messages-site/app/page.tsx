import Image from "next/image";
import Link from "next/link";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Send a Letter", href: "/send-letter" },
  { label: "Read Letters", href: "/letters" },
  { label: "Stories", href: "/stories" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-50 border-b border-pink-500/20 bg-black/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <Link href="/" className="group flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-400/60 text-xl shadow-[0_0_18px_rgba(236,72,153,0.35)]">
              💌
            </div>

            <div>
              <p className="font-serif text-sm tracking-[0.2em] text-white">
                MESSAGES
              </p>
              <p className="font-serif text-sm tracking-[0.2em] text-pink-400">
                TO DOM
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-xs uppercase tracking-[0.14em] text-gray-300 transition hover:text-pink-400"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <Link
            href="/send-letter"
            aria-label="Send a letter"
            className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-400 text-xl text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.45)] transition hover:bg-pink-500 hover:text-white"
          >
            ♡
          </Link>
        </div>
      </header>

      <section className="relative border-b border-pink-500/20">
        <div className="relative mx-auto min-h-[420px] max-w-7xl overflow-hidden sm:min-h-[520px]">
          <Image
            src="/messages-to-dom-banner.png"
            alt="Messages to Dom banner decorated with hearts"
            fill
            priority
            className="object-cover object-center"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/85" />
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-6 py-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
        <div className="text-center lg:text-left">
          <p className="mb-3 text-sm uppercase tracking-[0.3em] text-pink-400">
            Every letter carries a heart
          </p>

          <h1 className="font-serif text-4xl leading-tight sm:text-5xl">
            Welcome to Messages to Dom
          </h1>

          <div className="mx-auto mt-5 h-px w-28 bg-pink-500/70 lg:mx-0" />

          <p className="mt-7 leading-8 text-gray-300">
            This is a fan-created space where people from around the world can
            share messages of encouragement, stories, photos, and memories
            celebrating the positive impact Dom has had on their lives.
          </p>

          <p className="mt-4 leading-8 text-gray-400">
            Every letter will be reviewed before publication so this remains a
            welcoming community built on kindness and respect.
          </p>

          <p className="mt-5 font-serif italic text-pink-400">
            Thank you for being part of it. ♡
          </p>
        </div>

        <div className="space-y-5">
          <Link
            href="/send-letter"
            className="group flex min-h-32 items-center justify-between border border-pink-400 bg-gradient-to-r from-pink-950/80 to-pink-500/25 px-7 py-6 shadow-[0_0_25px_rgba(236,72,153,0.3)] transition hover:-translate-y-1 hover:shadow-[0_0_35px_rgba(236,72,153,0.5)]"
          >
            <div className="flex items-center gap-5">
              <span className="text-4xl">💌</span>

              <div>
                <h2 className="font-serif text-xl uppercase tracking-wide">
                  Send a Letter to Dom
                </h2>
                <p className="mt-2 text-sm text-pink-100/70">
                  Share your message
                </p>
              </div>
            </div>

            <span className="text-3xl text-pink-300 transition group-hover:translate-x-2">
              →
            </span>
          </Link>

          <Link
            href="/letters"
            className="group flex min-h-32 items-center justify-between border border-white/25 bg-white/[0.03] px-7 py-6 transition hover:-translate-y-1 hover:border-pink-400/70 hover:bg-pink-500/10"
          >
            <div className="flex items-center gap-5">
              <span className="text-4xl text-pink-400">♡</span>

              <div>
                <h2 className="font-serif text-xl uppercase tracking-wide">
                  Read Letters from Fans
                </h2>
                <p className="mt-2 text-sm text-gray-400">
                  Open the letters
                </p>
              </div>
            </div>

            <span className="text-3xl text-pink-300 transition group-hover:translate-x-2">
              →
            </span>
          </Link>
        </div>
      </section>
            {/* Community statistics */}
      <section className="border-y border-pink-500/20 bg-white/[0.02]">
        <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-pink-500/20 px-6 md:grid-cols-4 md:divide-y-0">
          {[
            { icon: "♡", number: "1,248", label: "Hearts Shared" },
            { icon: "💌", number: "632", label: "Letters Shared" },
            { icon: "✦", number: "387", label: "Stories Shared" },
            { icon: "◎", number: "52", label: "Countries Represented" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center justify-center gap-4 px-4 py-7 text-center"
            >
              <span className="text-3xl text-pink-400">{stat.icon}</span>

              <div>
                <p className="font-serif text-3xl text-pink-400">
                  {stat.number}
                </p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                  {stat.label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured letters */}
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
    </main>
  );
}
