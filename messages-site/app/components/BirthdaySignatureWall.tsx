"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type Signature = {
  id: number;
  name: string;
  country: string | null;
  color: string;
  font: string;
  include_heart: boolean;
  created_at: string;
};

const colorStyles: Record<string, string> = {
  "hot-pink": "#ec4899",
  "light-pink": "#f472b6",
  white: "#ffffff",
  silver: "#9ca3af",
  red: "#dc2626",
  purple: "#9333ea",
};

const fontStyles: Record<string, string> = {
  cursive: "cursive",
  elegant: "'Dancing Script', cursive",
  playful: "'Comic Sans MS', 'Bradley Hand', cursive",
  bold: "Arial, Helvetica, sans-serif",
  classic: "Georgia, 'Times New Roman', serif",
};

function createNumberFromText(value: string) {
  let hash = 0;

  for (let index = 0; index < value.length; index += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(index);
    hash |= 0;
  }

  return Math.abs(hash);
}

function getSignatureStyle(signature: Signature) {
  const seed = createNumberFromText(
    `${signature.id}-${signature.name}`,
  );

  const rotationOptions = [-8, -6, -4, -2, 1, 3, 5, 7];
  const fontSizeOptions = [22, 24, 26, 28, 30];
  const horizontalOptions = [
    "justify-self-start",
    "justify-self-center",
    "justify-self-end",
  ];
  const verticalOptions = [
    "self-start",
    "self-center",
    "self-end",
  ];

  return {
    rotation:
      rotationOptions[seed % rotationOptions.length],
    fontSize:
      fontSizeOptions[
        Math.floor(seed / 3) % fontSizeOptions.length
      ],
    horizontal:
      horizontalOptions[
        Math.floor(seed / 7) % horizontalOptions.length
      ],
    vertical:
      verticalOptions[
        Math.floor(seed / 11) % verticalOptions.length
      ],
  };
}

function shuffleSignatures(signatures: Signature[]) {
  return [...signatures].sort((first, second) => {
    const firstValue = createNumberFromText(
      `${first.id}-${first.name}-birthday`,
    );

    const secondValue = createNumberFromText(
      `${second.id}-${second.name}-birthday`,
    );

    return firstValue - secondValue;
  });
}

export default function BirthdaySignatureWall() {
  const [signatures, setSignatures] = useState<Signature[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    async function loadSignatures() {
      setIsLoading(true);
      setLoadError("");

      const { data, error } = await supabase
        .from("birthday_signatures")
        .select(
          "id, name, country, color, font, include_heart, created_at",
        )
        .eq("card_year", 2026)
        .order("created_at", { ascending: true });

      if (error) {
        console.error(
          "Could not load birthday signatures:",
          error,
        );

        setLoadError(
          "The birthday signatures could not be loaded.",
        );

        setIsLoading(false);
        return;
      }

      setSignatures((data ?? []) as Signature[]);
      setIsLoading(false);
    }

    loadSignatures();
  }, []);

  const arrangedSignatures = useMemo(
    () => shuffleSignatures(signatures),
    [signatures],
  );

  if (isLoading) {
    return (
      <div className="flex min-h-[500px] items-center justify-center rounded-2xl border border-pink-300/30 bg-pink-50 px-6 text-center">
        <div>
          <div className="text-5xl">🖤</div>

          <p className="mt-4 font-serif text-xl text-pink-700">
            Opening the birthday card...
          </p>
        </div>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-red-300 bg-red-50 px-6 text-center text-red-700">
        {loadError}
      </div>
    );
  }

  if (signatures.length === 0) {
    return (
      <div className="flex min-h-[500px] items-center justify-center rounded-2xl border-2 border-dashed border-pink-300 bg-pink-50 px-6 text-center">
        <div>
          <div className="text-5xl">✍️</div>

          <p className="mt-4 font-serif text-2xl text-pink-700">
            Be the first to sign Dom&apos;s birthday card.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden rounded-2xl border border-pink-300/40 bg-pink-50 px-4 py-8 shadow-inner sm:px-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-5 top-6 text-6xl text-pink-300/20">
          ♡
        </div>

        <div className="absolute right-6 top-10 text-4xl text-pink-300/20">
          ✦
        </div>

        <div className="absolute bottom-8 right-8 text-7xl text-pink-300/20">
          ♡
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-x-3 gap-y-5 sm:grid-cols-3 sm:gap-x-5 md:grid-cols-4">
        {arrangedSignatures.map((signature) => {
          const style = getSignatureStyle(signature);

          const selectedColor =
            colorStyles[signature.color] ??
            colorStyles["hot-pink"];

          const selectedFont =
            fontStyles[signature.font] ??
            fontStyles.cursive;

          return (
            <div
              key={signature.id}
              className={`flex min-h-24 max-w-full flex-col items-center justify-center px-2 py-3 text-center ${style.horizontal} ${style.vertical}`}
              style={{
                transform: `rotate(${style.rotation}deg)`,
              }}
            >
              <p
                className="max-w-full break-words leading-tight"
                style={{
                  color: selectedColor,
                  fontFamily: selectedFont,
                  fontSize: `${style.fontSize}px`,
                  textShadow:
                    signature.color === "white"
                      ? "0 1px 3px rgba(0, 0, 0, 0.55)"
                      : "0 1px 1px rgba(255, 255, 255, 0.45)",
                }}
              >
                {signature.name}
                {signature.include_heart && (
                  <span className="ml-1">🖤</span>
                )}
              </p>

              {signature.country && (
                <p className="mt-1 max-w-full truncate text-[10px] uppercase tracking-[0.12em] text-zinc-500">
                  {signature.country}
                </p>
              )}
            </div>
          );
        })}
      </div>

      <p className="relative mt-8 text-center text-xs uppercase tracking-[0.2em] text-pink-700/60">
        {signatures.length.toLocaleString()}{" "}
        {signatures.length === 1
          ? "Black Heart has signed"
          : "Black Hearts have signed"}
      </p>
    </div>
  );
}