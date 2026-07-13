import Link from "next/link";

const stories = [
  {
    title: "How Dom’s Music Helped Me",
    excerpt:
      "A fan shares how the music became a source of comfort, confidence, and connection.",
  },
  {
    title: "More Than an Artist",
    excerpt:
      "A story about kindness, individuality, and the sense of belonging found through the community.",
  },
  {
    title: "A Community Built on Love",
    excerpt:
      "Fans from different places describe how the music helped them find friendship and support.",
  },
];

export default function Stories() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
          From the community
        </p>

        <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
          Latest Stories
        </h2>

        <div className="mx-auto mt-4 h-px w-32 bg-pink-500/70" />
      </div>

      <div className="grid gap-7 md:grid-cols-3">
        {stories.map((story) => (
          <article
            key={story.title}
            className="border border-white/20 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-pink-400/70"
          >
            <p className="text-sm text-pink-400">♡ Fan Story</p>

            <h3 className="mt-3 font-serif text-2xl">
              {story.title}
            </h3>

            <p className="mt-4 leading-7 text-gray-400">
              {story.excerpt}
            </p>

            <Link
              href="/stories"
              className="mt-6 inline-block text-sm uppercase tracking-[0.18em] text-pink-400 hover:text-pink-300"
            >
              Read more →
            </Link>
          </article>
        ))}
      </div>

      <div className="mt-10 text-center">
        <Link
          href="/stories"
          className="text-sm uppercase tracking-[0.22em] text-pink-400 hover:text-pink-300"
        >
          View all stories →
        </Link>
      </div>
    </section>
  );
}