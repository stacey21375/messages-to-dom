export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="flex min-h-[80vh] flex-col items-center justify-center px-6 text-center">
        <h1 className="text-6xl font-bold tracking-wide">
          Messages <span className="text-pink-500">to Dom</span>
        </h1>

        <p className="mt-6 max-w-2xl text-xl text-gray-300">
          Every Letter Carries a Heart.
        </p>

        <p className="mt-4 max-w-3xl text-gray-400">
          A fan-created space where people from around the world can share
          encouragement, appreciation, artwork, and stories celebrating the
          positive impact Dom has had on their lives.
        </p>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button className="rounded-full bg-pink-600 px-8 py-4 font-semibold transition hover:bg-pink-500">
            💌 Send a Letter
          </button>

          <button className="rounded-full border border-pink-500 px-8 py-4 transition hover:bg-pink-500 hover:text-black">
            📖 Read Letters
          </button>
        </div>
      </section>
    </main>
  );
}
