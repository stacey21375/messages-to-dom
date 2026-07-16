"use client";

import { FormEvent, useRef, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

export default function SendLetterPage() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [letter, setLetter] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsSubmitting(true);
    setSubmitError("");
    setSubmitted(false);

    let imagePath: string | null = null;

    if (selectedImage) {
      if (!ALLOWED_IMAGE_TYPES.includes(selectedImage.type)) {
        setSubmitError(
          "Please upload a JPG, PNG, WebP, or GIF image.",
        );
        setIsSubmitting(false);
        return;
      }

      if (selectedImage.size > MAX_IMAGE_SIZE) {
        setSubmitError("The image must be 5 MB or smaller.");
        setIsSubmitting(false);
        return;
      }

      const extension =
        selectedImage.name.split(".").pop()?.toLowerCase() || "jpg";

      const safeBaseName = selectedImage.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .slice(0, 60);

      imagePath = `${crypto.randomUUID()}-${safeBaseName}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("letter-uploads")
        .upload(imagePath, selectedImage, {
          cacheControl: "3600",
          contentType: selectedImage.type,
          upsert: false,
        });

      if (uploadError) {
        console.log("Supabase image upload error:", uploadError);
        setSubmitError(
          "Your image could not be uploaded. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }
    }

    const { error: letterError } = await supabase
      .from("letters")
      .insert({
        name: name.trim(),
        country: country.trim() || null,
        email: email.trim() || null,
        letter: letter.trim(),
        image_url: imagePath,
        status: "pending",
      });

    if (letterError) {
      console.log("Supabase letter insert error:", letterError);
      setSubmitError(
        "Your letter could not be sent. Please try again.",
      );
      setIsSubmitting(false);
      return;
    }

    setSubmitted(true);
    setName("");
    setCountry("");
    setEmail("");
    setLetter("");
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }

    setIsSubmitting(false);
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative overflow-hidden px-6 py-16">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-10 top-16 text-5xl text-pink-500/20">
            ♡
          </div>

          <div className="absolute right-12 top-28 text-4xl text-pink-400/20">
            ♡
          </div>

          <div className="absolute bottom-20 left-1/4 text-6xl text-pink-500/10">
            ♡
          </div>
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
              Write from the heart
            </p>

            <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
              Send a Letter to Dom
            </h1>

            <div className="mx-auto mt-5 h-px w-32 bg-pink-500/70" />

            <p className="mx-auto mt-7 max-w-2xl leading-8 text-gray-400">
              Share a kind message, memory, or note of encouragement. Every
              letter will be reviewed before it is published.
            </p>
          </div>

          <div className="relative border border-pink-400/50 bg-gradient-to-b from-zinc-950 to-black p-6 shadow-[0_0_35px_rgba(236,72,153,0.18)] sm:p-10">
            <div className="absolute -top-5 left-1/2 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full border border-pink-300 bg-pink-800 text-xl shadow-[0_0_20px_rgba(236,72,153,0.6)]">
              ♡
            </div>

            <div className="mb-8 text-center">
              <div className="text-5xl">💌</div>

              <p className="mt-3 font-serif text-xl text-pink-300">
                Every letter carries a heart
              </p>
            </div>

            {submitError && (
              <div className="mb-8 border border-red-400/50 bg-red-950/40 p-5 text-center text-red-200">
                {submitError}
              </div>
            )}

            {submitted && (
              <div className="mb-8 border border-pink-400/50 bg-gradient-to-b from-pink-950/70 to-black p-6 text-center shadow-[0_0_25px_rgba(236,72,153,0.25)]">
                <div className="text-4xl">💌</div>

                <p className="mt-3 font-serif text-2xl text-pink-200">
                  Your letter has been sealed with love.
                </p>

                <p className="mx-auto mt-3 max-w-xl leading-7 text-pink-100/70">
                  Thank you for taking the time to share your message. Every
                  submission will be reviewed before it is published, and your
                  kindness helps make this community special.
                </p>

                <p className="mt-4 font-serif italic text-pink-400">
                  — Messages to Dom ♡
                </p>
              </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm uppercase tracking-[0.18em] text-pink-300"
                  >
                    Name or Nickname
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder="How should your letter be signed?"
                    className="w-full border border-white/20 bg-black/70 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-pink-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="country"
                    className="mb-2 block text-sm uppercase tracking-[0.18em] text-pink-300"
                  >
                    Country
                  </label>

                  <input
                    id="country"
                    name="country"
                    type="text"
                    value={country}
                    onChange={(event) => setCountry(event.target.value)}
                    placeholder="Optional"
                    className="w-full border border-white/20 bg-black/70 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-pink-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm uppercase tracking-[0.18em] text-pink-300"
                >
                  Email Address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Optional and never displayed publicly"
                  className="w-full border border-white/20 bg-black/70 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-pink-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                />
              </div>

              <div>
                <label
                  htmlFor="letter"
                  className="mb-2 block text-sm uppercase tracking-[0.18em] text-pink-300"
                >
                  Your Letter
                </label>

                <textarea
                  id="letter"
                  name="letter"
                  rows={10}
                  maxLength={3000}
                  required
                  value={letter}
                  onChange={(event) => setLetter(event.target.value)}
                  placeholder="Dear Dom..."
                  className="w-full resize-y border border-pink-200/20 bg-[#efe3dc] px-5 py-5 font-serif text-lg leading-8 text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-pink-400 focus:shadow-[0_0_20px_rgba(236,72,153,0.25)]"
                />

                <div className="mt-2 flex justify-between gap-4 text-xs text-gray-500">
                  <span>Your story is taking shape.</span>
                  <span>{letter.length} / 3000 characters</span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="artwork"
                  className="mb-2 block text-sm uppercase tracking-[0.18em] text-pink-300"
                >
                  Add Artwork or a Photo
                </label>

                <input
                  ref={fileInputRef}
                  id="artwork"
                  name="artwork"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) =>
                    setSelectedImage(event.target.files?.[0] ?? null)
                  }
                  className="w-full border border-dashed border-pink-400/40 bg-black/50 px-4 py-5 text-sm text-gray-400 file:mr-4 file:border-0 file:bg-pink-700 file:px-4 file:py-2 file:text-white"
                />

                <p className="mt-2 text-xs text-gray-500">
                  JPG, PNG, WebP, or GIF. Maximum size: 5 MB. Only upload an
                  image you created or have permission to share.
                </p>

                {selectedImage && (
                  <p className="mt-3 text-sm text-pink-300">
                    Selected: {selectedImage.name}
                  </p>
                )}
              </div>

              <label className="flex items-start gap-3 border border-white/10 bg-white/[0.03] p-4">
                <input
                  type="checkbox"
                  name="agreement"
                  required
                  className="mt-1 h-4 w-4 accent-pink-500"
                />

                <span className="text-sm leading-6 text-gray-400">
                  I confirm that this message is respectful and that I have
                  permission to share any image I upload.
                </span>
              </label>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-3 border border-pink-300 bg-gradient-to-r from-pink-900 via-pink-700 to-pink-500 px-6 py-4 font-serif text-lg uppercase tracking-[0.18em] text-white shadow-[0_0_28px_rgba(236,72,153,0.35)] transition hover:-translate-y-1 hover:shadow-[0_0_38px_rgba(236,72,153,0.55)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>
                  {isSubmitting
                    ? "Sealing Your Letter..."
                    : "Seal and Send Letter"}
                </span>

                <span className="text-2xl transition group-hover:translate-x-1">
                  💌
                </span>
              </button>
            </form>

            <div className="mt-12 border border-pink-300/30 bg-[#f5e8df] p-8 text-zinc-900 shadow-inner">
              <div className="mb-6 text-center">
                <div className="text-5xl">💌</div>

                <p className="mt-4 text-sm italic text-zinc-600">
                  {today}
                </p>
              </div>

              <h2 className="text-center font-serif text-3xl">
                Letter Preview
              </h2>

              <div className="mx-auto my-6 h-px w-32 bg-pink-500/70" />

              <div className="whitespace-pre-wrap font-serif text-lg leading-8">
                {letter || "Your letter will appear here as you write..."}
              </div>

              <div className="mt-10 text-right">
                <p className="font-serif text-xl">
                  ♡ {name || "Your Name"}
                </p>

                <p className="text-sm text-zinc-600">
                  {country || "Your Country"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}