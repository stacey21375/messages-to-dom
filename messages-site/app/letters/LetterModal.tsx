"use client";

import { useEffect, useRef, useState } from "react";

type LetterModalProps = {
  open: boolean;
  onClose: () => void;
  letter: {
    name: string;
    country: string | null;
    letter: string;
    imagePreviewUrl: string | null;
    created_at: string;
  } | null;
};

export default function LetterModal({
  open,
  onClose,
  letter,
}: LetterModalProps) {
  const [isVisible, setIsVisible] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!open) {
      setIsVisible(false);
      return;
    }

    document.body.style.overflow = "hidden";

    const animationTimer = window.setTimeout(() => {
      setIsVisible(true);
    }, 20);

    if (!audioRef.current) {
      audioRef.current = new Audio("/sounds/letter-open.wav");
      audioRef.current.volume = 0.35;
    }

    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {
      // Some browsers may block sound until the user interacts.
    });

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.clearTimeout(animationTimer);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || !letter) return null;

  const formattedDate = new Date(letter.created_at).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-md transition-opacity duration-300 sm:p-6 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`Letter from ${letter.name}`}
    >
      <div className="relative flex min-h-full w-full items-center justify-center py-8">
        <div
          onClick={(event) => event.stopPropagation()}
          className={`relative w-full max-w-3xl transform transition-all duration-500 ease-out ${
            isVisible
              ? "translate-y-0 scale-100 opacity-100"
              : "translate-y-10 scale-95 opacity-0"
          }`}
        >
          <div
            aria-hidden="true"
            className="absolute inset-x-8 bottom-[-24px] h-16 rounded-full bg-pink-500/20 blur-3xl"
          />

          <div className="relative overflow-hidden border border-[#b58a67] bg-[#ead7bd] shadow-[0_30px_90px_rgba(0,0,0,0.8)]">
            <div
              aria-hidden="true"
              className="absolute inset-0 opacity-35 [background-image:radial-gradient(circle_at_18%_20%,rgba(255,255,255,0.8),transparent_24%),radial-gradient(circle_at_82%_70%,rgba(105,70,45,0.24),transparent_30%),repeating-linear-gradient(12deg,rgba(90,55,35,0.08)_0,rgba(90,55,35,0.08)_1px,transparent_1px,transparent_7px)]"
            />

            <div
              aria-hidden="true"
              className="absolute inset-3 border border-[#7d5b43]/15"
            />

            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 z-20 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/85 text-lg text-white shadow-lg transition hover:scale-110 hover:bg-pink-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400 sm:right-6 sm:top-6"
              aria-label="Close letter"
            >
              ✕
            </button>

            <div className="relative z-10 px-6 pb-8 pt-10 text-zinc-900 sm:px-12 sm:pb-12 sm:pt-12">
              <div className="flex items-center justify-center gap-4 text-pink-700/70">
                <div className="h-px w-16 bg-gradient-to-r from-transparent to-pink-700/50" />
                <span>♡</span>
                <div className="h-px w-16 bg-gradient-to-l from-transparent to-pink-700/50" />
              </div>

              <p className="mt-6 text-center text-xs uppercase tracking-[0.28em] text-pink-800/70">
                Messages to Dom
              </p>

              <h2 className="mt-6 font-serif text-4xl italic text-[#3f2b23] sm:text-5xl">
                Dear Dom,
              </h2>

              <div className="mt-8 whitespace-pre-wrap font-serif text-lg leading-9 text-[#3f2f28] sm:text-xl">
                {letter.letter}
              </div>

              {letter.imagePreviewUrl && (
                <div className="mt-10 border border-[#9a7153]/30 bg-[#f7eadb]/70 p-3 shadow-inner">
                  <button
                    type="button"
                    onClick={() =>
                      window.open(
                        letter.imagePreviewUrl ?? "",
                        "_blank",
                        "noopener,noreferrer",
                      )
                    }
                    className="block w-full cursor-zoom-in"
                    aria-label={`Open image submitted by ${letter.name}`}
                  >
                    <img
                      src={letter.imagePreviewUrl}
                      alt={`Artwork or photo submitted by ${letter.name}`}
                      className="mx-auto max-h-[520px] w-full object-contain"
                    />
                  </button>
                </div>
              )}

              <div className="mt-12 border-t border-[#8e684f]/30 pt-8 text-right">
                <p className="font-serif text-2xl italic text-[#4b3028]">
                  With love,
                </p>

                <p className="mt-2 font-serif text-3xl text-pink-800">
                  {letter.name} ♡
                </p>

                {letter.country && (
                  <p className="mt-3 text-sm uppercase tracking-[0.18em] text-[#79584b]">
                    {letter.country}
                  </p>
                )}

                <p className="mt-2 text-sm text-[#7b6258]">
                  {formattedDate}
                </p>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="mx-auto mt-10 flex items-center gap-3 border border-pink-800/35 bg-pink-950/5 px-5 py-3 font-serif text-sm uppercase tracking-[0.2em] text-pink-900 transition hover:bg-pink-900 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-500"
              >
                <span>✉</span>
                Return letter to envelope
              </button>
            </div>

            <div
              aria-hidden="true"
              className="relative z-10 flex items-center justify-center gap-5 border-t border-[#8e684f]/25 py-5 text-pink-800/70"
            >
              <span>✦</span>
              <span>♡</span>
              <span>✦</span>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute -bottom-6 left-1/2 z-20 flex h-20 w-20 -translate-x-1/2 items-center justify-center rounded-[45%_55%_48%_52%] border border-pink-200/70 bg-gradient-to-br from-rose-500 via-rose-800 to-rose-950 text-3xl text-white shadow-[inset_0_2px_5px_rgba(255,255,255,0.35),inset_0_-5px_9px_rgba(0,0,0,0.5),0_0_28px_rgba(236,72,153,0.7)]"
          >
            ♡
          </div>
        </div>
      </div>
    </div>
  );
}