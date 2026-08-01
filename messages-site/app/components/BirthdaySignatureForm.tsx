"use client";

import { useState } from "react";
import { supabase } from "../lib/supabase";

export default function BirthdaySignatureForm() {
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");

  const [font, setFont] = useState("cursive");
  const [color, setColor] = useState("hot-pink");

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function submitSignature(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const { error } = await supabase
      .from("birthday_signatures")
      .insert({
        name,
        country,
        font,
        color,
        card_year: 2026,
      });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    setSuccess(true);

    setName("");
    setCountry("");
    setFont("cursive");
    setColor("hot-pink");
  }

  if (success) {
    return (
      <div className="rounded-xl bg-pink-100 p-8 text-center text-black">
        <h3 className="mb-4 text-2xl font-bold">
          🖤 Thank you!
        </h3>

        <p>
          Your signature has been added to Dom's birthday card.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submitSignature}
      className="space-y-5"
    >
      <input
        className="w-full rounded-lg border p-3"
        placeholder="Your first name or nickname"
        maxLength={40}
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="w-full rounded-lg border p-3"
        placeholder="Country (optional)"
        value={country}
        onChange={(e) => setCountry(e.target.value)}
      />

      <select
        className="w-full rounded-lg border p-3"
        value={font}
        onChange={(e) => setFont(e.target.value)}
      >
        <option value="cursive">Elegant Script</option>
        <option value="playful">Playful</option>
        <option value="classic">Classic</option>
        <option value="bold">Bold</option>
        <option value="elegant">Fancy</option>
      </select>

      <select
        className="w-full rounded-lg border p-3"
        value={color}
        onChange={(e) => setColor(e.target.value)}
      >
        <option value="hot-pink">Hot Pink</option>
        <option value="light-pink">Light Pink</option>
        <option value="white">White</option>
        <option value="silver">Silver</option>
        <option value="red">Red</option>
        <option value="purple">Purple</option>
      </select>

      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-xl bg-pink-500 px-6 py-4 font-semibold text-white hover:bg-pink-600"
      >
        {loading ? "Signing..." : "Sign the Birthday Card"}
      </button>
    </form>
  );
}