"use client";

import { useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

type StatsData = {
  hearts: number;
  letters: number;
  stories: number;
  countries: number;
};

export default function Stats() {
  const [stats, setStats] = useState<StatsData>({
    hearts: 0,
    letters: 0,
    stories: 0,
    countries: 0,
  });

  useEffect(() => {
    async function loadStats() {
      const { data, error } = await supabase
        .from("letters")
        .select("country")
        .eq("status", "approved");

      if (error) {
        console.error("Error loading stats:", error);
        return;
      }

      const letters = data.length;

      const uniqueCountries = new Set(
        data
          .map((letter) => letter.country?.trim())
          .filter((country): country is string => Boolean(country))
      );

      setStats({
        hearts: letters,
        letters: letters,
        stories: 0,
        countries: uniqueCountries.size,
      });
    }

    loadStats();
  }, []);

  const statItems = [
    { icon: "♡", number: stats.hearts, label: "Hearts Shared" },
    { icon: "💌", number: stats.letters, label: "Letters Shared" },
    { icon: "✦", number: stats.stories, label: "Stories Shared" },
    { icon: "◎", number: stats.countries, label: "Countries Represented" },
  ];

  return (
    <section className="border-y border-pink-500/20 bg-white/[0.02]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-pink-500/20 px-6 md:grid-cols-4 md:divide-y-0">
        {statItems.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-center gap-4 px-4 py-7 text-center"
          >
            <span className="text-3xl text-pink-400">{stat.icon}</span>

            <div>
              <p className="font-serif text-3xl text-pink-400">
                {stat.number.toLocaleString()}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}