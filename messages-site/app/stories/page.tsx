import Link from "next/link";

export default function StoriesPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-pink-500">
            Stories
          </h1>

          <h2 className="mb-8 text-2xl italic text-gray-300">
            Every Fan Has a Story
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-8 text-gray-300">
            Behind every letter is a person. Behind every person is a story.
          </p>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            Whether it was a song that arrived at exactly the right time,
            a concert that became an unforgettable memory, or a community
            that made you feel like you finally belonged, those moments
            deserve to be remembered.
          </p>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            This page is dedicated to the stories that remind us why music
            matters and how one person can inspire people all over the world.
          </p>
        </div>

        {/* Story Categories */}

        <div className="mt-16 grid gap-8">

          <StoryCard
            emoji="💖"
            title="Finding Hope"
            text="Share how Dom's music, words, or message helped you through a difficult time. Whether his music helped you find strength, reminded you that you weren't alone, or gave you hope when you needed it most, we'd love to hear your story."
          />

          <StoryCard
            emoji="🎵"
            title="Concert Memories"
            text="Tell us about your favorite show, your first concert, meeting new friends, or that unforgettable moment you'll never forget. Whether it was your first time hearing your favorite song live, a special interaction, or simply the energy of the crowd, your memories deserve to be shared."
          />

          <StoryCard
            emoji="🌎"
            title="The Community"
            text="Have you met amazing people because of the YUNGBLUD family? Tell us how those friendships changed your life, brought you comfort, or created unforgettable memories. Sometimes the people we meet become just as important as the music itself."
          />

          <StoryCard
            emoji="🎨"
            title="Creativity"
            text="Artwork, tattoos, writing, photography, clothing, makeup, music, or any creative project inspired by Dom belongs here. We'd love to showcase the incredible creativity this community shares with the world."
          />

          <StoryCard
            emoji="✨"
            title="Life Moments"
            text="Maybe one lyric changed your perspective. Maybe one concert gave you confidence. Maybe one act of kindness reminded you that you're never alone. Whatever your moment was, we'd love to hear your story."
          />

        </div>

        {/* Community Promise */}

        <section className="mt-20 rounded-3xl border border-pink-500 bg-zinc-900 p-10 shadow-lg">
          <h2 className="mb-6 text-3xl font-bold text-pink-400">
            A Place for Honest Stories
          </h2>

          <p className="leading-8 text-gray-300">
            Every person's journey is unique.
          </p>

          <p className="mt-4 leading-8 text-gray-300">
            We ask everyone to share their stories with kindness,
            empathy, and respect for one another.
          </p>

          <p className="mt-4 leading-8 text-gray-300">
            All stories will be reviewed before they are published
            to help keep this a welcoming, supportive, and positive
            space for everyone.
          </p>
        </section>

        {/* Coming Soon */}

        <section className="mt-20 rounded-3xl border-2 border-pink-500 bg-gradient-to-b from-zinc-900 to-black p-12 text-center shadow-xl">

          <h2
            className="mb-8 text-5xl text-pink-500"
            style={{ fontFamily: '"UnifrakturCook", cursive' }}
          >
            Coming Soon
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-8 text-gray-300">
            We're putting the finishing touches on our Stories section.
          </p>

          <div className="mx-auto mt-10 max-w-2xl text-left">

            <ul className="space-y-4 text-lg text-gray-200">

              <li>🖤 Share your personal story</li>

              <li>📸 Upload photos alongside your story</li>

              <li>🎵 Share your favorite concert memories</li>

              <li>🎨 Showcase artwork and creative projects</li>

              <li>🌎 Celebrate friendships made through the YUNGBLUD community</li>

              <li>💖 Inspire others by sharing your journey</li>

            </ul>

          </div>

          <p className="mt-10 text-lg text-gray-300">
            Until then, we'd love for you to leave Dom a letter.
          </p>

          <Link
            href="/send-letter"
            className="mt-8 inline-block rounded-full bg-pink-600 px-8 py-4 text-lg font-semibold transition hover:bg-pink-500"
          >
            💌 Share a Letter
          </Link>
        </section>

      </section>
    </main>
  );
}

function StoryCard({
  emoji,
  title,
  text,
}: {
  emoji: string;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-3xl border border-zinc-700 bg-zinc-900 p-8 shadow-lg transition hover:border-pink-500">
      <h2 className="mb-4 text-3xl font-bold text-pink-400">
        {emoji} {title}
      </h2>

      <p className="leading-8 text-gray-300">
        {text}
      </p>
    </div>
  );
}