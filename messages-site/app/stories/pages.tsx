import Link from "next/link";

const storyCategories = [
  {
    slug: "how-i-found-yungblud",
    emoji: "🖤",
    title: "How I Found YUNGBLUD",
    description:
      "Everyone has a beginning. Share how you first discovered Dom and what drew you in.",
  },
  {
    slug: "a-song-that-changed-me",
    emoji: "🎵",
    title: "A Song That Changed Me",
    description:
      "Tell us about the song or lyrics that inspired you, comforted you, or changed your perspective.",
  },
  {
    slug: "concert-memories",
    emoji: "🌎",
    title: "Concert Memories",
    description:
      "Tell us about your favorite show, travel adventure, unforgettable performance, or special moment with the YUNGBLUD family.",
  },
  {
    slug: "my-mental-health-journey",
    emoji: "❤️",
    title: "My Mental Health Journey",
    description:
      "If you're comfortable sharing, tell us how music, hope, or the community helped you through difficult times.",
  },
  {
    slug: "the-community",
    emoji: "👥",
    title: "The Community",
    description:
      "Celebrate the friendships, kindness, and connections you've made because of the YUNGBLUD family.",
  },
];

export default function StoriesPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-black text-white">
      <section className="relative">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 top-10 h-72 w-72 rounded-full bg-pink-600/10 blur-3xl" />

          <div className="absolute -right-28 top-72 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-3xl" />

          <div className="absolute left-1/2 top-20 -translate-x-1/2 text-8xl text-pink-500/[0.04]">
            ♡
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-6 py-16 sm:py-20">
          <header className="text-center">
            <p className="text-sm uppercase tracking-[0.32em] text-pink-400">
              Every story matters
            </p>

            <h1 className="mt-4 font-serif text-5xl text-pink-500 sm:text-6xl">
              Stories
            </h1>

            <h2 className="mt-4 text-xl italic text-gray-300 sm:text-2xl">
              Every Fan Has a Story
            </h2>

            <div className="mx-auto mt-6 h-px w-36 bg-pink-500/70" />

            <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-300">
              Behind every letter is a person. Behind every person is a
              story.
            </p>

            <p className="mx-auto mt-5 max-w-3xl leading-8 text-gray-400">
              Whether it was a song that arrived at exactly the right
              time, a concert that became an unforgettable memory, or a
              community that made you feel like you finally belonged,
              those moments deserve to be remembered.
            </p>

            <p className="mx-auto mt-5 max-w-3xl leading-8 text-gray-400">
              Choose the kind of story you would like to share.
            </p>
          </header>

          <section className="mt-14" aria-labelledby="story-categories-title">
            <h2 id="story-categories-title" className="sr-only">
              Choose a story category
            </h2>

            <div className="grid gap-6 md:grid-cols-2">
              {storyCategories.slice(0, 4).map((category) => (
                <StoryCategoryButton
                  key={category.slug}
                  slug={category.slug}
                  emoji={category.emoji}
                  title={category.title}
                  description={category.description}
                />
              ))}
            </div>

            <div className="mx-auto mt-6 max-w-[calc(50%-0.75rem)] max-md:max-w-none">
              <StoryCategoryButton
                slug={storyCategories[4].slug}
                emoji={storyCategories[4].emoji}
                title={storyCategories[4].title}
                description={storyCategories[4].description}
              />
            </div>
          </section>

          <section className="mt-20 rounded-[2rem] border border-pink-500/40 bg-gradient-to-b from-zinc-900/90 to-black p-8 shadow-[0_0_35px_rgba(236,72,153,0.12)] sm:p-10">
            <div className="mx-auto max-w-3xl text-center">
              <div className="text-4xl">🖤</div>

              <h2 className="mt-4 font-serif text-3xl text-pink-300">
                A Place for Honest Stories
              </h2>

              <p className="mt-6 leading-8 text-gray-300">
                Every person&apos;s journey is unique. Share only what
                feels comfortable to you.
              </p>

              <p className="mt-4 leading-8 text-gray-400">
                We ask everyone to share with kindness, empathy, and
                respect. Every story will be reviewed before it is
                published to help keep this a welcoming and supportive
                space.
              </p>

              <p className="mt-4 text-sm leading-7 text-gray-500">
                You will be able to include one optional photo with your
                submission.
              </p>
            </div>
          </section>

          <section className="mt-20 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
              Community stories
            </p>

            <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
              Shared Stories
            </h2>

            <div className="mx-auto mt-4 h-px w-32 bg-pink-500/70" />

            <div className="mt-10 rounded-[2rem] border border-white/10 bg-white/[0.03] px-6 py-12">
              <div className="text-4xl">✨</div>

              <p className="mt-4 text-lg text-pink-200">
                Approved community stories will appear here.
              </p>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-500">
                They will be organized into the five categories above so
                visitors can easily explore the stories that mean the
                most to them.
              </p>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

function StoryCategoryButton({
  slug,
  emoji,
  title,
  description,
}: {
  slug: string;
  emoji: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={`/stories/submit?category=${slug}`}
      className="group relative flex min-h-72 w-full flex-col items-center justify-center overflow-hidden rounded-[2rem] border border-pink-200/50 bg-gradient-to-br from-pink-500 via-pink-600 to-fuchsia-700 px-7 py-9 text-center text-black shadow-[0_0_28px_rgba(236,72,153,0.26)] transition duration-300 hover:-translate-y-1 hover:border-white/80 hover:shadow-[0_0_45px_rgba(236,72,153,0.55)] focus:outline-none focus-visible:ring-4 focus-visible:ring-pink-200/70 active:scale-[0.98]"
    >
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-black/10 opacity-60" />

      <div className="pointer-events-none absolute -right-8 -top-8 text-9xl text-white/10 transition duration-500 group-hover:rotate-12 group-hover:scale-110">
        {emoji}
      </div>

      <div className="relative">
        <div className="text-5xl transition duration-300 group-hover:scale-110">
          {emoji}
        </div>

        <h3 className="mt-5 font-serif text-2xl font-bold sm:text-3xl">
          {title}
        </h3>

        <p className="mx-auto mt-4 max-w-md text-base font-medium leading-7 text-black/80">
          {description}
        </p>

        <span className="mt-7 inline-flex items-center gap-2 rounded-full border border-black/25 bg-black/10 px-5 py-2 text-sm font-bold uppercase tracking-[0.16em] transition duration-300 group-hover:bg-black group-hover:text-pink-300">
          Share Your Story
          <span aria-hidden="true">→</span>
        </span>
      </div>
    </Link>
  );
}