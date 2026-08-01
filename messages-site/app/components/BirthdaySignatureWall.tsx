"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type Signature = {
  id: number;
  name: string;
  color: string;
  font: string;
};

const colors: Record<string, string> = {
  "hot-pink": "#ff1493",
  "light-pink": "#ff7ecb",
  white: "#ffffff",
  silver: "#c0c0c0",
  red: "#ff4444",
  purple: "#bb66ff",
};

const fonts: Record<string, string> = {
  cursive: "cursive",
  elegant: "'Dancing Script', cursive",
  playful: "'Pacifico', cursive",
  bold: "sans-serif",
  classic: "serif",
};

export default function BirthdaySignatureWall() {
  const [signatures, setSignatures] = useState<Signature[]>([]);

  useEffect(() => {
    async function loadSignatures() {
      const { data } = await supabase
        .from("birthday_signatures")
        .select("*")
        .eq("card_year", 2026);

      if (data) {
        setSignatures(data);
      }
    }

    loadSignatures();
  }, []);

  return (
    <div className="relative h-[600px] overflow-hidden rounded-xl bg-pink-50">
      {signatures.map((signature) => {
        const top = Math.random() * 540;
        const left = Math.random() * 85;
        const rotate = Math.random() * 30 - 15;

        return (
          <div
            key={signature.id}
            style={{
              position: "absolute",
              top,
              left: `${left}%`,
              transform: `rotate(${rotate}deg)`,
              color: colors[signature.color],
              fontFamily: fonts[signature.font],
              fontSize: `${22 + Math.random() * 12}px`,
              whiteSpace: "nowrap",
            }}
          >
            {signature.name} 🖤
          </div>
        );
      })}
    </div>
  );
}