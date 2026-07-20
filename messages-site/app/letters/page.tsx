"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";
import EnvelopeCard from "./EnvelopeCard";
import LetterModal from "./LetterModal";

type ApprovedLetter = {
  id: number;
  name: string;
  country: string | null;
  letter: string;
  image_url: string | null;
  created_at: string;
};

type LetterWithImage = ApprovedLetter & {
  imagePreviewUrl: string | null;
};

const LETTERS_PER_PAGE = 18;

export default function LettersPage() {
  const [letters, setLetters] = useState<LetterWithImage[]>([]);
  const [selectedLetter, setSelectedLetter] =
    useState<LetterWithImage | null>(null);
  const [visibleCount, setVisibleCount] = useState(LETTERS_PER_PAGE);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadLetters() {
      setIsLoading(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("letters")
        .select("id, name, country, letter, image_url, created_at")
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) {
        console.log("Could not load approved letters:", error);
        setLoadError(
          "The letters could not be loaded. Please try again later.",
        );
        setIsLoading(false);
        return;
      }

      const lettersWithImages = await Promise.all(
        (data ?? []).map(async (item: ApprovedLetter) => {
          if (!item.image_url) {
            return {
              ...item,
              imagePreviewUrl: null,
            };
          }

          const { data: signedUrlData, error: signedUrlError } =
            await supabase.storage
              .from("letter-uploads")
              .createSignedUrl(item.image_url, 60 * 60);

          if (signedUrlError) {
            console.log(
              `Could not load image for approved letter ${item.id}:`,
              signedUrlError,
            );

            return {
              ...item,
              imagePreviewUrl: null,
            };
          }

          return {
            ...item,
            imagePreviewUrl: signedUrlData.signedUrl,
          };
        }),
      );

      setLetters(lettersWithImages);
      setIsLoading(false);
    }

    loadLetters();
  }, []);

  const visibleLetters = letters.slice(0, visibleCount);
  const hasMoreLetters = visibleCount < letters.length;

  function openLetter(letter: LetterWithImage) {
    setSelectedLetter(letter);
  }

  function closeLetter() {
    setSelectedLetter(null);
  }

  function loadMoreLetters() {
    setVisibleCount((currentCount) => currentCount + LETTERS_PER_PAGE);
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-pink-500/20">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0"
        >
          <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-pink-600/10 blur-3xl" />
          <div className="absolute -right-40 top-40 h-96 w-96 rounded-full bg-fuchsia-700/10 blur-3xl" />

          <span className="absolute left-[8%] top-24 text-6xl text-pink-400/10">
            ♡
          </span>

          <span className="absolute right-[9%] top-36 text-7xl text-pink-400/10">
            ♡
          </span>
        </div>

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20">
          <div className="text-center">
            <div className="flex items-center justify-center gap-4">
              <div className="h-px w-14 bg-gradient-to-r from-transparent to-pink-500" />
              <span className="text-xl text-pink-400">♡</span>
              <div className="h-px w-14 bg-gradient-to-l from-transparent to-pink-500" />
            </div>

            <p className="mt-6 text-xs uppercase tracking-[0.3em] text-pink-400 sm:text-sm">
              Open the fan mail
            </p>

            <h1 className="mt-4 font-serif text-4xl text-white sm:text-5xl lg:text-6xl">
              Letters Waiting for Dom
            </h1>

            <p className="mx-auto mt-7 max-w-2xl leading-8 text-gray-400">
              Each envelope holds a message of kindness, gratitude,
              encouragement, artwork, or a treasured memory shared by a fan.
            </p>

            {!isLoading && !loadError && letters.length > 0 && (
              <div className="mx-auto mt-8 inline-flex items-center gap-3 border border-pink-400/20 bg-pink-950/20 px-5 py-3">
                <span className="text-pink-400">✉</span>

                <span className="font-serif text-pink-100">
                  {letters.length} approved{" "}
                  {letters.length === 1 ? "letter" : "letters"}
                </span>

                <span className="text-pink-400">♡</span>
              </div>
            )}
          </div>

          {isLoading && (
            <div className="mx-auto mt-16 max-w-xl border border-pink-400/30 bg-white/[0.03] p-10 text-center">
              <div className="animate-pulse text-5xl">💌</div>

              <p className="mt-5 font-serif text-xl text-pink-200">
                Gathering the envelopes...
              </p>
            </div>
          )}

          {loadError && (
            <div className="mx-auto mt-16 max-w-2xl border border-red-400/40 bg-red-950/30 p-6 text-center text-red-200">
              {loadError}
            </div>
          )}

          {!isLoading && !loadError && letters.length === 0 && (
            <div className="mx-auto mt-16 max-w-2xl border border-pink-400/30 bg-white/[0.03] p-10 text-center">
              <div className="text-5xl">💌</div>

              <h2 className="mt-5 font-serif text-2xl text-pink-200">
                The mail collection is waiting for its first approved letter.
              </h2>

              <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-400">
                Approved messages will appear here after they have been
                reviewed.
              </p>
            </div>
          )}

          {!isLoading && !loadError && letters.length > 0 && (
            <>
              <div className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
                {visibleLetters.map((item) => (
                 <EnvelopeCard
  key={item.id}
  id={item.id}
  name={item.name}
  country={item.country}
  createdAt={item.created_at}
  hasImage={Boolean(item.imagePreviewUrl)}
  onOpen={() => openLetter(item)}
/>
                ))}
              </div>

              {hasMoreLetters && (
                <div className="mt-16 text-center">
                  <button
                    type="button"
                    onClick={loadMoreLetters}
                    className="group inline-flex items-center gap-4 border border-pink-400/50 bg-gradient-to-r from-pink-950/70 via-black to-pink-950/70 px-8 py-4 font-serif text-lg text-pink-100 shadow-[0_0_24px_rgba(236,72,153,0.15)] transition duration-300 hover:-translate-y-1 hover:border-pink-300 hover:shadow-[0_0_34px_rgba(236,72,153,0.35)]"
                  >
                    <span className="transition group-hover:-rotate-6">✉</span>
                    Load More Envelopes
                    <span className="text-pink-400">♡</span>
                  </button>

                  <p className="mt-4 text-sm text-gray-500">
                    Showing {Math.min(visibleCount, letters.length)} of{" "}
                    {letters.length} letters
                  </p>
                </div>
              )}

              {!hasMoreLetters && letters.length > LETTERS_PER_PAGE && (
                <div className="mt-16 flex items-center justify-center gap-4 text-pink-400/60">
                  <div className="h-px w-16 bg-pink-400/30" />
                  <span>All letters opened for browsing</span>
                  <div className="h-px w-16 bg-pink-400/30" />
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />

      <LetterModal
        open={selectedLetter !== null}
        onClose={closeLetter}
        letter={selectedLetter}
      />
    </main>
  );
}