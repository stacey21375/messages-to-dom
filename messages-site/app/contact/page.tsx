import Link from "next/link";

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <section className="mx-auto max-w-5xl px-6 py-16">

        {/* Hero */}
        <div className="text-center">
          <h1 className="mb-4 text-5xl font-bold text-pink-500">
            Contact
          </h1>

          <h2 className="mb-8 text-2xl italic text-gray-300">
            We'd Love to Hear From You
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-8 text-gray-300">
            Whether you have a question, need help, want to report something,
            or simply have an idea to make Messages to Dom even better, we'd
            love to hear from you.
          </p>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            We do our best to respond as quickly as possible.
          </p>
        </div>

        {/* General Questions */}

        <section className="mt-20 rounded-3xl border border-pink-500 bg-zinc-900 p-10 shadow-lg">

          <h2 className="mb-6 text-3xl font-bold text-pink-400">
            💌 General Questions
          </h2>

          <p className="leading-8 text-gray-300">
            Have a question about the website, submitting letters, sharing
            stories, or uploading photos?
          </p>

          <p className="mt-4 leading-8 text-gray-300">
            Feel free to reach out anytime.
          </p>

        </section>

        {/* Report an Issue */}

        <section className="mt-12 rounded-3xl border border-zinc-700 bg-zinc-900 p-10 shadow-lg">

          <h2 className="mb-6 text-3xl font-bold text-pink-400">
            🛡️ Report a Problem
          </h2>

          <p className="leading-8 text-gray-300">
            If you notice inappropriate content, experience technical issues,
            or believe something on the site needs our attention, please let us
            know.
          </p>

          <p className="mt-4 leading-8 text-gray-300">
            Your feedback helps keep Messages to Dom welcoming, respectful,
            and enjoyable for everyone.
          </p>

        </section>

        {/* Suggestions */}

        <section className="mt-12 rounded-3xl border border-zinc-700 bg-zinc-900 p-10 shadow-lg">

          <h2 className="mb-6 text-3xl font-bold text-pink-400">
            🌹 Suggestions
          </h2>

          <p className="leading-8 text-gray-300">
            Have an idea for a new feature or something you'd love to see added
            to the website?
          </p>

          <p className="mt-4 leading-8 text-gray-300">
            We welcome your ideas and are always looking for ways to make this
            community even better.
          </p>

        </section>

        {/* Email */}

        <section className="mt-20 rounded-3xl border-2 border-pink-500 bg-gradient-to-b from-zinc-900 to-black p-12 text-center shadow-xl">

          <h2 className="mb-6 text-4xl font-bold text-pink-500">
            📧 Email Us
          </h2>

          <p className="mx-auto max-w-3xl text-lg leading-8 text-gray-300">
            You can contact us directly at:
          </p>

          <a
            href="mailto:messagestodom@gmail.com"
            className="mt-8 inline-block text-2xl font-bold text-pink-400 transition hover:text-pink-300 hover:underline"
          >
            messagestodom@gmail.com
          </a>

          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-gray-300">
            We appreciate your patience while we respond to emails. Every
            message is read, and we'll do our best to get back to you as soon
            as we can.
          </p>

        </section>

        {/* CTA */}

        <section className="mt-20 text-center">

          <h2 className="text-3xl font-bold text-pink-400">
            Ready to Leave a Message?
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-gray-300">
            If you came here to send Dom a message, we'd love for you to be part
            of the growing collection of letters from fans around the world.
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