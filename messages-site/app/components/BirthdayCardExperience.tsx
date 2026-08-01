"use client";

import { useState } from "react";
import BirthdaySignatureForm from "./BirthdaySignatureForm";
import BirthdaySignatureWall from "./BirthdaySignatureWall";

export default function BirthdayCardExperience() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSigningForm, setShowSigningForm] = useState(false);

  return (
    <section className="relative overflow-hidden px-5 py-16 sm:px-6 sm:py-20">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-pink-600/10 blur-3xl" />

        <div className="absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-3xl" />

        <div className="absolute left-10 top-12 text-6xl text-pink-500/10">
          ♡
        </div>

        <div className="absolute right-14 top-28 text-5xl text-pink-400/10">
          ✦
        </div>

        <div className="absolute bottom-16 left-1/4 text-7xl text-pink-500/10">
          ♡
        </div>
      </div>

      <div className="relative mx-auto max-w-7xl">
        <header className="text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-pink-400">
            August 5, 2026
          </p>

          <h1 className="mt-4 font-serif text-5xl text-white sm:text-6xl">
            Dom&apos;s Birthday Card
          </h1>

          <div className="mx-auto mt-6 h-px w-36 bg-pink-500/70" />

          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-400">
            Join Black Hearts from around the world in signing one giant
            birthday card for Dom.
          </p>
        </header>

        {!isOpen ? (
          <div className="mx-auto mt-14 max-w-4xl">
            <button
              type="button"
              onClick={() => setIsOpen(true)}
              className="group relative block w-full overflow-hidden rounded-[2rem] border border-pink-300/40 bg-gradient-to-br from-black via-pink-950/40 to-black p-5 text-left shadow-[0_0_55px_rgba(236,72,153,0.18)] transition duration-500 hover:-translate-y-1 hover:border-pink-300/70 hover:shadow-[0_0_75px_rgba(236,72,153,0.3)] sm:p-9"
            >
              <div className="pointer-events-none absolute inset-0">
                <div className="absolute left-8 top-8 text-7xl text-pink-500/10">
                  ♡
                </div>

                <div className="absolute right-8 top-10 text-5xl text-pink-300/10">
                  ✦
                </div>

                <div className="absolute bottom-6 right-16 text-8xl text-pink-500/10">
                  ♡
                </div>
              </div>

              <div className="relative flex min-h-[430px] flex-col items-center justify-center rounded-[1.5rem] border border-pink-400/20 bg-black/50 px-6 py-12 text-center sm:min-h-[500px]">
                <div className="text-7xl transition duration-500 group-hover:scale-110">
                  🎂
                </div>

                <p className="mt-7 text-sm uppercase tracking-[0.3em] text-pink-400">
                  A card from the Black Hearts
                </p>

                <h2 className="mt-4 font-serif text-4xl text-pink-100 sm:text-6xl">
                  Happy Birthday, Dom
                </h2>

                <p className="mx-auto mt-6 max-w-xl leading-8 text-gray-400">
                  Open the card, read the community message, and add your
                  signature.
                </p>

                <span className="mt-9 inline-flex items-center gap-3 rounded-full border border-pink-300/50 bg-pink-500/10 px-8 py-4 text-sm font-bold uppercase tracking-[0.18em] text-pink-200 transition group-hover:bg-pink-500 group-hover:text-black">
                  Open the Card
                  <span aria-hidden="true">→</span>
                </span>
              </div>
            </button>
          </div>
        ) : (
          <div className="mt-14">
            <div className="relative mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] border border-pink-300/40 bg-[#efe3dc] shadow-[0_0_70px_rgba(236,72,153,0.25)] lg:grid-cols-2">
              <div className="relative min-h-[650px] border-b border-pink-900/15 bg-gradient-to-br from-[#f7ece5] via-[#eadbd2] to-[#d8c3b8] p-8 text-zinc-900 lg:border-b-0 lg:border-r sm:p-12">
                <div className="pointer-events-none absolute inset-0 opacity-40">
                  <div className="absolute left-8 top-8 text-8xl text-pink-900/10">
                    ♡
                  </div>

                  <div className="absolute bottom-12 right-10 text-7xl text-pink-900/10">
                    ✦
                  </div>
                </div>

                <div className="relative flex h-full flex-col">
                  <p className="text-sm uppercase tracking-[0.25em] text-pink-800">
                    Our message to you
                  </p>

                  <h2 className="mt-5 font-serif text-4xl text-zinc-950 sm:text-5xl">
                    Happy Birthday, Dom
                  </h2>

                  <div className="mt-6 h-px w-32 bg-pink-700/60" />

                  <div className="mt-8 space-y-6 font-serif text-lg leading-9 text-zinc-800">
                    <p>Happy Birthday, Dom.</p>

                    <p>
                      Thank you for your music, your kindness, your honesty,
                      and for creating a place where so many people finally
                      feel understood.
                    </p>

                    <p>
                      Every signature on this card represents a life you have
                      touched and a person who is grateful that you are here.
                    </p>

                    <p>
                      We hope this little corner of the internet reminds you
                      that no matter where you are in the world, you are never
                      alone.
                    </p>

                    <p>We hope your birthday is full of love, joy, and cake.</p>
                  </div>

                  <div className="mt-auto pt-10 text-right">
                    <p className="font-serif text-2xl italic text-pink-800">
                      With love,
                    </p>

                    <p className="mt-2 font-serif text-3xl text-zinc-950">
                      Your Black Hearts 🖤
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative min-h-[650px] bg-gradient-to-br from-[#f8eee8] via-[#efdfd6] to-[#dbc7bc] p-5 text-zinc-900 sm:p-8">
                <div className="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-pink-800">
                      Signed around the world
                    </p>

                    <h2 className="mt-2 font-serif text-3xl">
                      Birthday Signatures
                    </h2>
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowSigningForm(true)}
                    className="rounded-full bg-pink-600 px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white shadow-[0_0_22px_rgba(236,72,153,0.3)] transition hover:-translate-y-1 hover:bg-pink-500"
                  >
                    Sign the Card
                  </button>
                </div>

                <div className="mt-7">
                  <BirthdaySignatureWall />
                </div>
              </div>
            </div>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-sm uppercase tracking-[0.2em] text-gray-500 transition hover:text-pink-300"
              >
                Close the Card
              </button>
            </div>
          </div>
        )}
      </div>

      {showSigningForm && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="birthday-signing-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowSigningForm(false);
            }
          }}
        >
          <div className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[2rem] border border-pink-400/50 bg-gradient-to-b from-zinc-950 to-black p-6 shadow-[0_0_60px_rgba(236,72,153,0.35)] sm:p-9">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-pink-400">
                  Add your name
                </p>

                <h2
                  id="birthday-signing-title"
                  className="mt-3 font-serif text-4xl text-pink-100"
                >
                  Sign Dom&apos;s Card
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setShowSigningForm(false)}
                aria-label="Close signing form"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/20 text-xl text-white transition hover:border-pink-400 hover:text-pink-300"
              >
                ×
              </button>
            </div>

            <p className="mt-5 leading-7 text-gray-400">
              Choose how your signature will appear inside the birthday card.
            </p>

            <div className="mt-8">
              <BirthdaySignatureForm />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}