import Link from "next/link";

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-6 py-16">

        {/* Hero */}
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-pink-500">
            About
          </h1>

          <h2 className="mb-8 text-2xl italic text-gray-300">
            Messages to Dom
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-8 text-gray-300">
            Music has a way of bringing people together. Sometimes it gives us
            hope, sometimes it helps us heal, and sometimes it simply reminds us
            that we're never alone.
          </p>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            <strong>Messages to Dom</strong> was created as a place where fans
            from around the world can come together to share kindness,
            appreciation, memories, artwork, and encouragement for Dom and for
            one another.
          </p>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            Every letter tells a story. Every photo captures a memory. Every act
            of kindness helps make this community stronger.
          </p>
        </div>

        {/* Our Mission */}

        <section className="mt-20 rounded-3xl border border-pink-500 bg-zinc-900 p-10 shadow-lg">

          <h2 className="mb-6 text-3xl font-bold text-pink-400">
            🖤 Our Mission
          </h2>

          <p className="leading-8 text-gray-300">
            Our mission is simple:
          </p>

          <p className="mt-6 text-xl font-semibold text-pink-300 italic">
            To create a safe, welcoming place where fans can celebrate the music,
            the memories, and the community that have changed so many lives.
          </p>

          <p className="mt-6 leading-8 text-gray-300">
            Whether you're sharing a heartfelt letter, a favorite concert photo,
            artwork you've created, or simply a few words of encouragement,
            your contribution helps build something meaningful.
          </p>

        </section>

        {/* Community Values */}

        <section className="mt-20 rounded-3xl border border-zinc-700 bg-zinc-900 p-10 shadow-lg">

          <h2 className="mb-6 text-3xl font-bold text-pink-400">
            🌹 Community Values
          </h2>

          <div className="space-y-5 text-gray-300 leading-8">

            <p>❤️ Kindness always comes first.</p>

            <p>🎵 Respect everyone's story and experiences.</p>

            <p>🤝 Celebrate the friendships this community creates.</p>

            <p>🎨 Encourage creativity and self-expression.</p>

            <p>🌎 Welcome fans from every corner of the world.</p>

          </div>

        </section>

        {/* Moderation */}

        <section className="mt-20 rounded-3xl border border-zinc-700 bg-zinc-900 p-10 shadow-lg">

          <h2 className="mb-6 text-3xl font-bold text-pink-400">
            🛡️ Moderation
          </h2>

          <p className="leading-8 text-gray-300">
            Every submission is reviewed before it appears on the website.
          </p>

          <p className="mt-4 leading-8 text-gray-300">
            This helps ensure that Messages to Dom remains a positive,
            respectful, and supportive environment for everyone who visits.
          </p>

          <p className="mt-4 leading-8 text-gray-300">
            We reserve the right to decline submissions that are offensive,
            inappropriate, hateful, or unrelated to the purpose of this site.
          </p>

        </section>

        {/* Fan Project */}

        <section className="mt-20 rounded-3xl border-2 border-pink-500 bg-gradient-to-b from-zinc-900 to-black p-12 text-center shadow-xl">

          <h2 className="mb-6 text-4xl font-bold text-pink-500">
            Fan Project
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-8 text-gray-300">
            Messages to Dom is an independent fan-created website built out of
            appreciation for YUNGBLUD and the incredible community surrounding
            his music.
          </p>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            This website is not affiliated with, endorsed by, or officially
            connected to Dom, his management, or his record label.
          </p>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            It exists simply as a place for fans to celebrate, connect, and
            share kindness.
          </p>

          <Link
            href="/send-letter"
            className="mt-10 inline-block rounded-full bg-pink-600 px-8 py-4 text-lg font-semibold transition hover:bg-pink-500"
          >
            💌 Leave a Letter
          </Link>

        </section>

      </section>
    </main>
  );
}