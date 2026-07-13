import Link from "next/link";

export default function Welcome() {
  return (
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
          className="group flex min-h-32 items-center justify-between border border-pink-400 bg-gradient-to-r from-pink-950/80 to-pink-500/25 px-7 py-6"
        >
          <div>
            <h2 className="font-serif text-xl uppercase">
              Send a Letter to Dom
            </h2>
            <p className="mt-2 text-sm text-pink-100/70">
              Share your message
            </p>
          </div>

          <span className="text-3xl">→</span>
        </Link>

        <Link
          href="/letters"
          className="group flex min-h-32 items-center justify-between border border-white/25 bg-white/[0.03] px-7 py-6"
        >
          <div>
            <h2 className="font-serif text-xl uppercase">
              Read Letters from Fans
            </h2>
            <p className="mt-2 text-sm text-gray-400">
              Open the letters
            </p>
          </div>

          <span className="text-3xl">→</span>
        </Link>
      </div>
    </section>
  );
}