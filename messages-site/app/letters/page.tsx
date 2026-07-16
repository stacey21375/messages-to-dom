"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

type Letter = {
  id: number;
  name: string;
  country: string | null;
  letter: string;
  created_at: string;
};

export default function LettersPage() {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadLetters() {
      const { data, error } = await supabase
        .from("letters")
        .select("id, name, country, letter, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Could not load letters:", error);
        setLoadError("The letters could not be loaded. Please try again later.");
        setIsLoading(false);
        return;
      }

      setLetters(data ?? []);
      setIsLoading(false);
    }

    loadLetters();
  }, []);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
            Open the letters
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
            Letters from Fans
          </h1>

          <div className="mx-auto mt-5 h-px w-32 bg-pink-500/70" />

          <p className="mx-auto mt-7 max-w-2xl leading-8 text-gray-400">
            Approved messages of kindness, gratitude, encouragement, and
            appreciation from fans around the world.
          </p>
        </div>

        {isLoading && (
          <div className="mt-14 border border-pink-400/30 bg-white/[0.03] p-10 text-center">
            <div className="text-5xl">💌</div>
            <p className="mt-4 text-pink-200">Opening the fan book...</p>
          </div>
        )}

        {loadError && (
          <div className="mt-14 border border-red-400/40 bg-red-950/30 p-6 text-center text-red-200">
            {loadError}
          </div>
        )}

        {!isLoading && !loadError && letters.length === 0 && (
          <div className="mt-14 border border-pink-400/30 bg-white/[0.03] p-10 text-center">
            <div className="text-5xl">💌</div>

            <h2 className="mt-4 font-serif text-2xl text-pink-200">
              The fan book is waiting for its first approved letter.
            </h2>

            <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-400">
              Approved messages will appear here after they have been reviewed.
            </p>
          </div>
        )}

        {!isLoading && letters.length > 0 && (
          <div className="mt-14 grid gap-7 md:grid-cols-2 lg:grid-cols-3">
            {letters.map((item) => (
              <article
                key={item.id}
                className="border border-pink-300/30 bg-gradient-to-b from-zinc-950 to-black p-6 shadow-[0_0_24px_rgba(236,72,153,0.12)]"
              >
                <div className="text-center text-4xl">💌</div>

                <div className="mt-5 bg-[#f5e8df] p-6 text-zinc-900">
                  <p className="whitespace-pre-wrap font-serif leading-7">
                    {item.letter}
                  </p>

                  <div className="mt-8 border-t border-pink-900/20 pt-4 text-right">
                    <p className="font-serif text-lg">♡ {item.name}</p>

                    {item.country && (
                      <p className="mt-1 text-sm text-zinc-600">
                        {item.country}
                      </p>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}