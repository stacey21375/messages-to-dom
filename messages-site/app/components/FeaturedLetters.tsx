"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

type FeaturedLetterRecord = {
  id: number;
  name: string;
  country: string | null;
  letter: string;
  image_url: string | null;
  created_at: string;
};

type FeaturedLetter = FeaturedLetterRecord & {
  imagePreviewUrl: string | null;
};

export default function FeaturedLetters() {
  const [letters, setLetters] = useState<FeaturedLetter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadFeaturedLetters() {
      setIsLoading(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("letters")
        .select("id, name, country, letter, image_url, created_at")
        .eq("status", "approved")
        .eq("featured", true)
        .order("created_at", { ascending: false })
        .limit(3);

      if (error) {
        console.log("Could not load featured letters:", error);
        setLoadError("Featured letters could not be loaded.");
        setIsLoading(false);
        return;
      }

      const lettersWithImages = await Promise.all(
        ((data ?? []) as FeaturedLetterRecord[]).map(async (item) => {
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
              `Could not load image for featured letter ${item.id}:`,
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

    loadFeaturedLetters();
  }, []);

  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 text-center">
        <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
          Written with love
        </p>

        <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
          Featured Letters
        </h2>

        <div className="mx-auto mt-4 h-px w-32 bg-pink-500/70" />
      </div>

      {isLoading && (
        <div className="border border-pink-400/30 bg-white/[0.03] p-10 text-center">
          <div className="text-5xl">💌</div>
          <p className="mt-4 text-pink-200">Opening featured letters...</p>
        </div>
      )}

      {loadError && (
        <div className="border border-red-400/40 bg-red-950/30 p-6 text-center text-red-200">
          {loadError}
        </div>
      )}

      {!isLoading && !loadError && letters.length === 0 && (
        <div className="border border-pink-400/30 bg-white/[0.03] p-10 text-center">
          <div className="text-5xl">💌</div>

          <h3 className="mt-4 font-serif text-2xl text-pink-200">
            Featured letters are coming soon.
          </h3>

          <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-400">
            Special messages chosen from the community will appear here after
            they have been approved and featured.
          </p>
        </div>
      )}

      {!isLoading && !loadError && letters.length > 0 && (
        <div className="grid gap-7 md:grid-cols-3">
          {letters.map((letter) => (
            <article
              key={letter.id}
              className="group relative overflow-hidden border border-white/20 bg-gradient-to-b from-zinc-900 to-black p-6 transition duration-300 hover:-translate-y-2 hover:border-pink-400/70 hover:shadow-[0_0_30px_rgba(236,72,153,0.22)]"
            >
              <div className="absolute left-1/2 top-0 h-px w-3/4 -translate-x-1/2 bg-gradient-to-r from-transparent via-pink-400 to-transparent" />

              {letter.imagePreviewUrl ? (
                <div className="mb-5 overflow-hidden border border-pink-300/25 bg-black/70">
                  <img
                    src={letter.imagePreviewUrl}
                    alt={`Artwork or photo submitted by ${letter.name}`}
                    className="h-52 w-full object-contain"
                  />
                </div>
              ) : (
                <div className="mb-5 text-center text-4xl text-pink-400">
                  💌
                </div>
              )}

              <div className="border border-pink-200/20 bg-pink-50/95 px-5 py-6 text-center text-zinc-900 shadow-inner">
                <p className="font-serif text-lg italic">
                  From: {letter.name}
                </p>

                {letter.country && (
                  <p className="mt-1 text-xs uppercase tracking-[0.15em] text-pink-700">
                    {letter.country}
                  </p>
                )}

                <p className="mt-5 line-clamp-6 whitespace-pre-wrap font-serif leading-7">
                  “{letter.letter}”
                </p>
              </div>

              <div className="mx-auto -mt-4 flex h-10 w-10 items-center justify-center rounded-full border border-pink-300 bg-pink-800 text-lg shadow-[0_0_18px_rgba(236,72,153,0.55)]">
                ♡
              </div>

              <Link
                href="/letters"
                className="mt-6 block w-full text-center text-xs uppercase tracking-[0.2em] text-gray-300 transition group-hover:text-pink-400"
              >
                Open Letter →
              </Link>
            </article>
          ))}
        </div>
      )}

      <div className="mt-10 text-center">
        <Link
          href="/letters"
          className="text-sm uppercase tracking-[0.22em] text-pink-400 transition hover:text-pink-300"
        >
          View all letters →
        </Link>
      </div>
    </section>
  );
}