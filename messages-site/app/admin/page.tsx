"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

type PendingLetter = {
  id: number;
  name: string;
  country: string | null;
  email: string | null;
  letter: string;
  image_url: string | null;
  created_at: string;
  status: string;
};

type LetterWithPreview = PendingLetter & {
  imagePreviewUrl: string | null;
};

type ActionType = "approve" | "reject" | "delete";

export default function AdminPage() {
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [isLoadingLetters, setIsLoadingLetters] = useState(true);
  const [pendingLetters, setPendingLetters] = useState<LetterWithPreview[]>([]);
  const [lettersError, setLettersError] = useState("");
  const [actionMessage, setActionMessage] = useState("");
  const [activeLetterId, setActiveLetterId] = useState<number | null>(null);

  const loadPendingLetters = useCallback(async () => {
    setIsLoadingLetters(true);
    setLettersError("");

    const { data, error } = await supabase
      .from("letters")
      .select(
        "id, name, country, email, letter, image_url, created_at, status",
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Could not load pending letters:", error);
      setLettersError("Pending letters could not be loaded.");
      setIsLoadingLetters(false);
      return;
    }

    const lettersWithPreviews = await Promise.all(
      (data ?? []).map(async (item: PendingLetter) => {
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
            `Could not create image preview for letter ${item.id}:`,
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

    setPendingLetters(lettersWithPreviews);
    setIsLoadingLetters(false);
  }, []);

  useEffect(() => {
    async function loadAdminDashboard() {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        router.replace("/admin/login");
        return;
      }

      await loadPendingLetters();
      setIsCheckingAuth(false);
    }

    loadAdminDashboard();
  }, [loadPendingLetters, router]);

  async function handleLetterAction(
    letterId: number,
    action: ActionType,
  ) {
    setActiveLetterId(letterId);
    setActionMessage("");
    setLettersError("");

    if (action === "delete") {
      const letterToDelete = pendingLetters.find(
        (item) => item.id === letterId,
      );

      const confirmed = window.confirm(
        "Delete this letter permanently? This cannot be undone.",
      );

      if (!confirmed) {
        setActiveLetterId(null);
        return;
      }

      if (letterToDelete?.image_url) {
        const { error: imageDeleteError } = await supabase.storage
          .from("letter-uploads")
          .remove([letterToDelete.image_url]);

        if (imageDeleteError) {
          console.log(
            "Could not delete the uploaded image:",
            imageDeleteError,
          );
        }
      }

      const { error } = await supabase
        .from("letters")
        .delete()
        .eq("id", letterId);

      if (error) {
        console.log("Could not delete letter:", error);
        setLettersError("The letter could not be deleted.");
        setActiveLetterId(null);
        return;
      }

      setPendingLetters((currentLetters) =>
        currentLetters.filter((item) => item.id !== letterId),
      );

      setActionMessage("The letter was deleted.");
      setActiveLetterId(null);
      return;
    }

    const newStatus = action === "approve" ? "approved" : "rejected";

    const { error } = await supabase
      .from("letters")
      .update({ status: newStatus })
      .eq("id", letterId);

    if (error) {
      console.log(`Could not ${action} letter:`, error);
      setLettersError(`The letter could not be ${newStatus}.`);
      setActiveLetterId(null);
      return;
    }

    setPendingLetters((currentLetters) =>
      currentLetters.filter((item) => item.id !== letterId),
    );

    setActionMessage(
      action === "approve"
        ? "The letter was approved and is now public."
        : "The letter was rejected.",
    );

    setActiveLetterId(null);
  }

  async function handleSignOut() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
    router.refresh();
  }

  if (isCheckingAuth) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="text-5xl">🔐</div>

          <p className="mt-4 font-serif text-xl text-pink-200">
            Checking private access...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
            Private Dashboard
          </p>

          <h1 className="mt-3 font-serif text-4xl sm:text-5xl">
            Letter Moderation
          </h1>

          <div className="mx-auto mt-5 h-px w-32 bg-pink-500/70" />

          <p className="mx-auto mt-7 max-w-2xl leading-8 text-gray-400">
            Review submitted letters and their uploaded artwork before they
            appear publicly.
          </p>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-6 border border-white/20 px-5 py-2 text-xs uppercase tracking-[0.18em] text-gray-300 transition hover:border-pink-400 hover:text-pink-300"
          >
            Sign Out
          </button>
        </div>

        {actionMessage && (
          <div className="mt-10 border border-green-400/40 bg-green-950/30 p-5 text-center text-green-200">
            {actionMessage}
          </div>
        )}

        {isLoadingLetters && (
          <div className="mt-14 border border-pink-400/30 bg-white/[0.03] p-10 text-center">
            <div className="text-5xl">📬</div>
            <p className="mt-4 text-pink-200">
              Loading pending letters...
            </p>
          </div>
        )}

        {lettersError && (
          <div className="mt-10 border border-red-400/40 bg-red-950/30 p-6 text-center text-red-200">
            {lettersError}
          </div>
        )}

        {!isLoadingLetters &&
          !lettersError &&
          pendingLetters.length === 0 && (
            <div className="mt-14 border border-pink-400/30 bg-white/[0.03] p-10 text-center">
              <div className="text-5xl">📭</div>

              <h2 className="mt-4 font-serif text-2xl text-pink-200">
                No pending letters
              </h2>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-400">
                New submissions will appear here for review.
              </p>
            </div>
          )}

        {!isLoadingLetters && pendingLetters.length > 0 && (
          <div className="mt-14 space-y-7">
            {pendingLetters.map((item) => {
              const isProcessing = activeLetterId === item.id;

              return (
                <article
                  key={item.id}
                  className="border border-pink-300/30 bg-gradient-to-b from-zinc-950 to-black p-6 shadow-[0_0_24px_rgba(236,72,153,0.12)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <h2 className="font-serif text-2xl text-pink-200">
                        {item.name}
                      </h2>

                      <p className="mt-1 text-sm text-gray-400">
                        {item.country || "Country not provided"}
                      </p>

                      {item.email && (
                        <p className="mt-1 text-sm text-gray-500">
                          {item.email}
                        </p>
                      )}

                      <p className="mt-2 text-xs text-gray-600">
                        Submitted{" "}
                        {new Date(item.created_at).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          },
                        )}
                      </p>
                    </div>

                    <span className="border border-yellow-400/30 bg-yellow-950/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-yellow-200">
                      Pending
                    </span>
                  </div>

                  {item.image_url && (
                    <div className="mt-6 border border-pink-300/30 bg-black/60 p-4">
                      <p className="mb-4 text-xs uppercase tracking-[0.18em] text-pink-300">
                        Uploaded artwork or photo
                      </p>

                      {item.imagePreviewUrl ? (
                        <img
                          src={item.imagePreviewUrl}
                          alt={`Upload submitted by ${item.name}`}
                          className="mx-auto max-h-[550px] w-auto max-w-full object-contain"
                        />
                      ) : (
                        <p className="py-8 text-center text-sm text-gray-500">
                          The image preview could not be loaded.
                        </p>
                      )}
                    </div>
                  )}

                  <div className="mt-6 bg-[#f5e8df] p-6 text-zinc-900">
                    <p className="whitespace-pre-wrap font-serif leading-8">
                      {item.letter}
                    </p>
                  </div>

                  <div className="mt-6 grid gap-3 sm:grid-cols-3">
                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleLetterAction(item.id, "approve")
                      }
                      className="border border-green-400/50 bg-green-950/40 px-5 py-3 font-semibold text-green-200 transition hover:bg-green-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? "Working..." : "✓ Approve"}
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleLetterAction(item.id, "reject")
                      }
                      className="border border-yellow-400/50 bg-yellow-950/40 px-5 py-3 font-semibold text-yellow-200 transition hover:bg-yellow-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? "Working..." : "✕ Reject"}
                    </button>

                    <button
                      type="button"
                      disabled={isProcessing}
                      onClick={() =>
                        handleLetterAction(item.id, "delete")
                      }
                      className="border border-red-400/50 bg-red-950/40 px-5 py-3 font-semibold text-red-200 transition hover:bg-red-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isProcessing ? "Working..." : "🗑 Delete"}
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <Footer />
    </main>
  );
}