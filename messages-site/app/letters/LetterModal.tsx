"use client";

import { useEffect } from "react";

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
  useEffect(() => {
    if (!open) return;

    document.body.style.overflow = "hidden";

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  if (!open || !letter) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-6 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-lg border border-pink-300/20 bg-[#f7eadf] text-zinc-900 shadow-[0_30px_80px_rgba(0,0,0,0.7)]"
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute right-5 top-5 flex h-10 w-10 items-center justify-center rounded-full bg-pink-800 text-white transition hover:scale-110"
        >
          ✕
        </button>

        {/* Header */}
        <div className="border-b border-[#d7b8aa] bg-gradient-to-r from-[#f6ebe2] to-[#ead7ca] px-10 py-8">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-700">
            Messages to Dom
          </p>

          <h2 className="mt-3 font-serif text-4xl">
            Dear Dom,
          </h2>
        </div>

        {/* Letter */}
        <div className="px-10 py-10">
          <div className="font-serif whitespace-pre-wrap text-lg leading-9">
            {letter.letter}
          </div>

          {letter.imagePreviewUrl && (
            <div className="mt-10">
              <img
                src={letter.imagePreviewUrl}
                alt={`Submitted by ${letter.name}`}
                className="mx-auto max-h-[500px] rounded border border-pink-300/40 shadow-lg"
              />
            </div>
          )}

          <div className="mt-12 border-t border-[#d7b8aa] pt-8 text-right">
            <p className="font-serif text-2xl">
              ♡ {letter.name}
            </p>

            {letter.country && (
              <p className="mt-2 text-zinc-600">
                {letter.country}
              </p>
            )}

            <p className="mt-4 text-sm text-zinc-500">
              {new Date(letter.created_at).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Bottom decoration */}
        <div className="flex items-center justify-center gap-5 border-t border-[#d7b8aa] py-5 text-pink-700">
          <span>✦</span>
          <span>♡</span>
          <span>✦</span>
        </div>
      </div>
    </div>
  );
}