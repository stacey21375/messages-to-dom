import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function SendLetterPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-4xl px-6 py-16 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
          Write from the heart
        </p>

        <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
          Send a Letter to Dom
        </h1>

        <div className="mx-auto mt-5 h-px w-32 bg-pink-500/70" />

        <p className="mx-auto mt-7 max-w-2xl leading-8 text-gray-400">
          Share a kind message, a memory, or a few words of encouragement.
          Every submission will be reviewed before it is published.
        </p>
      </section>

      <Footer />
    </main>
  );
}