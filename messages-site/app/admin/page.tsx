"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../lib/supabase";

type LetterRecord = {
  id: number;
  name: string;
  country: string | null;
  email: string | null;
  letter: string;
  image_url: string | null;
  show_in_gallery: boolean;
  featured: boolean;
  created_at: string;
  status: string;
};

type LetterWithPreview = LetterRecord & {
  imagePreviewUrl: string | null;
};

type PendingAction = "approve" | "reject" | "delete";

type MapHeartRecord = {
  id: number;
  latitude: number;
  longitude: number;
  country: string | null;
  region: string | null;
  created_at: string;
  status: string;
};

type HeartAction = "approve" | "reject" | "delete";

type StoryRecord = {
  id: number;
  name: string;
  country: string | null;
  email: string | null;
  title: string;
  story: string;
  category: string;
  image_url: string | null;
  created_at: string;
  status: string;
};

type StoryWithPreview = StoryRecord & {
  imagePreviewUrl: string | null;
};

type StoryAction = "approve" | "reject" | "delete";

const STORY_CATEGORIES: Record<
  string,
  {
    emoji: string;
    title: string;
  }
> = {
  "how-i-found-yungblud": {
    emoji: "🖤",
    title: "How I Found YUNGBLUD",
  },
  "a-song-that-changed-me": {
    emoji: "🎵",
    title: "A Song That Changed Me",
  },
  "concert-memories": {
    emoji: "🌎",
    title: "Concert Memories",
  },
  "my-mental-health-journey": {
    emoji: "❤️",
    title: "My Mental Health Journey",
  },
  "the-community": {
    emoji: "👥",
    title: "The Community",
  },
};

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function getStoryCategory(category: string) {
  return (
    STORY_CATEGORIES[category] ?? {
      emoji: "📖",
      title: category,
    }
  );
}

export default function AdminPage() {
  const router = useRouter();

  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  const [isLoadingLetters, setIsLoadingLetters] = useState(true);
  const [pendingLetters, setPendingLetters] = useState<
    LetterWithPreview[]
  >([]);
  const [gallerySelections, setGallerySelections] = useState<
    Record<number, boolean>
  >({});
  const [lettersError, setLettersError] = useState("");
  const [activeLetterId, setActiveLetterId] = useState<
    number | null
  >(null);

  const [pendingHearts, setPendingHearts] = useState<
    MapHeartRecord[]
  >([]);
  const [approvedHearts, setApprovedHearts] = useState<
    MapHeartRecord[]
  >([]);
  const [isLoadingHearts, setIsLoadingHearts] = useState(true);
  const [heartsError, setHeartsError] = useState("");
  const [activeHeartId, setActiveHeartId] = useState<
    number | null
  >(null);

  const [pendingStories, setPendingStories] = useState<
    StoryWithPreview[]
  >([]);
  const [isLoadingStories, setIsLoadingStories] = useState(true);
  const [storiesError, setStoriesError] = useState("");
  const [activeStoryId, setActiveStoryId] = useState<
    number | null
  >(null);

  const [actionMessage, setActionMessage] = useState("");

  const addLetterImagePreviews = useCallback(
    async (
      letters: LetterRecord[],
    ): Promise<LetterWithPreview[]> => {
      return Promise.all(
        letters.map(async (item) => {
          if (!item.image_url) {
            return {
              ...item,
              imagePreviewUrl: null,
            };
          }

          const { data, error } = await supabase.storage
            .from("letter-uploads")
            .createSignedUrl(item.image_url, 60 * 60);

          if (error) {
            console.log(
              `Could not create image preview for letter ${item.id}:`,
              error,
            );

            return {
              ...item,
              imagePreviewUrl: null,
            };
          }

          return {
            ...item,
            imagePreviewUrl: data.signedUrl,
          };
        }),
      );
    },
    [],
  );

  const addStoryImagePreviews = useCallback(
    async (
      stories: StoryRecord[],
    ): Promise<StoryWithPreview[]> => {
      return Promise.all(
        stories.map(async (item) => {
          if (!item.image_url) {
            return {
              ...item,
              imagePreviewUrl: null,
            };
          }

          const { data, error } = await supabase.storage
            .from("story-uploads")
            .createSignedUrl(item.image_url, 60 * 60);

          if (error) {
            console.log(
              `Could not create image preview for story ${item.id}:`,
              error,
            );

            return {
              ...item,
              imagePreviewUrl: null,
            };
          }

          return {
            ...item,
            imagePreviewUrl: data.signedUrl,
          };
        }),
      );
    },
    [],
  );

  const loadLetters = useCallback(async () => {
    setIsLoadingLetters(true);
    setLettersError("");

    const { data, error } = await supabase
      .from("letters")
      .select(
        "id, name, country, email, letter, image_url, show_in_gallery, featured, created_at, status",
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Could not load letters:", error);
      setLettersError("The letters could not be loaded.");
      setIsLoadingLetters(false);
      return;
    }

    const lettersWithPreviews = await addLetterImagePreviews(
      (data ?? []) as LetterRecord[],
    );

    const initialGallerySelections: Record<number, boolean> = {};

    lettersWithPreviews.forEach((item) => {
      initialGallerySelections[item.id] =
        Boolean(item.image_url) && item.show_in_gallery;
    });

    setGallerySelections(initialGallerySelections);
    setPendingLetters(lettersWithPreviews);
    setIsLoadingLetters(false);
  }, [addLetterImagePreviews]);

  const loadMapHearts = useCallback(async () => {
    setIsLoadingHearts(true);
    setHeartsError("");

    const { data, error } = await supabase
      .from("map_hearts")
      .select(
        "id, latitude, longitude, country, region, created_at, status",
      )
      .in("status", ["pending", "approved"])
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Could not load map hearts:", error);
      setHeartsError("The map hearts could not be loaded.");
      setIsLoadingHearts(false);
      return;
    }

    const hearts = (data ?? []) as MapHeartRecord[];

    setPendingHearts(
      hearts.filter((item) => item.status === "pending"),
    );

    setApprovedHearts(
      hearts.filter((item) => item.status === "approved"),
    );

    setIsLoadingHearts(false);
  }, []);

  const loadStories = useCallback(async () => {
    setIsLoadingStories(true);
    setStoriesError("");

    const { data, error } = await supabase
      .from("stories")
      .select(
        "id, name, country, email, title, story, category, image_url, created_at, status",
      )
      .eq("status", "pending")
      .order("created_at", { ascending: false });

    if (error) {
      console.log("Could not load stories:", error);
      setStoriesError("The stories could not be loaded.");
      setIsLoadingStories(false);
      return;
    }

    const storiesWithPreviews = await addStoryImagePreviews(
      (data ?? []) as StoryRecord[],
    );

    setPendingStories(storiesWithPreviews);
    setIsLoadingStories(false);
  }, [addStoryImagePreviews]);

  useEffect(() => {
    async function loadAdminDashboard() {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error || !user) {
        router.replace("/admin/login");
        return;
      }

      await Promise.all([
        loadLetters(),
        loadMapHearts(),
        loadStories(),
      ]);

      setIsCheckingAuth(false);
    }

    loadAdminDashboard();
  }, [loadLetters, loadMapHearts, loadStories, router]);

  function removePendingLetter(letterId: number) {
    setPendingLetters((current) =>
      current.filter((item) => item.id !== letterId),
    );

    setGallerySelections((current) => {
      const updated = { ...current };
      delete updated[letterId];
      return updated;
    });
  }

  function removePendingStory(storyId: number) {
    setPendingStories((current) =>
      current.filter((item) => item.id !== storyId),
    );
  }

  async function handlePendingAction(
    letterId: number,
    action: PendingAction,
  ) {
    setActiveLetterId(letterId);
    setActionMessage("");
    setLettersError("");

    const selectedLetter = pendingLetters.find(
      (item) => item.id === letterId,
    );

    if (!selectedLetter) {
      setLettersError("The selected letter could not be found.");
      setActiveLetterId(null);
      return;
    }

    if (action === "delete") {
      const confirmed = window.confirm(
        "Delete this letter permanently? This cannot be undone.",
      );

      if (!confirmed) {
        setActiveLetterId(null);
        return;
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

      removePendingLetter(letterId);
      setActionMessage("The letter was deleted.");
      setActiveLetterId(null);
      return;
    }

    if (action === "reject") {
      const { error } = await supabase
        .from("letters")
        .update({
          status: "rejected",
          show_in_gallery: false,
          featured: false,
        })
        .eq("id", letterId);

      if (error) {
        console.log("Could not reject letter:", error);
        setLettersError("The letter could not be rejected.");
        setActiveLetterId(null);
        return;
      }

      removePendingLetter(letterId);
      setActionMessage("The letter was rejected.");
      setActiveLetterId(null);
      return;
    }

    const featureInGallery =
      Boolean(selectedLetter.image_url) &&
      Boolean(gallerySelections[letterId]);

    const { error } = await supabase
      .from("letters")
      .update({
        status: "approved",
        show_in_gallery: featureInGallery,
        featured: false,
      })
      .eq("id", letterId);

    if (error) {
      console.log("Could not approve letter:", error);
      setLettersError("The letter could not be approved.");
      setActiveLetterId(null);
      return;
    }

    removePendingLetter(letterId);

    setActionMessage(
      featureInGallery
        ? "The letter was approved, and its image was added to the gallery."
        : "The letter was approved and is now public.",
    );

    setActiveLetterId(null);
  }

  async function handlePendingHeartAction(
    heart: MapHeartRecord,
    action: HeartAction,
  ) {
    if (action === "delete") {
      const confirmed = window.confirm(
        "Delete this map heart permanently? This cannot be undone.",
      );

      if (!confirmed) {
        return;
      }
    }

    setActiveHeartId(heart.id);
    setActionMessage("");
    setHeartsError("");

    if (action === "delete") {
      const { error } = await supabase
        .from("map_hearts")
        .delete()
        .eq("id", heart.id);

      if (error) {
        console.log("Could not delete map heart:", error);
        setHeartsError("The map heart could not be deleted.");
        setActiveHeartId(null);
        return;
      }

      setPendingHearts((current) =>
        current.filter((item) => item.id !== heart.id),
      );

      setActionMessage("The map heart was deleted.");
      setActiveHeartId(null);
      return;
    }

    const nextStatus =
      action === "approve" ? "approved" : "rejected";

    const { error } = await supabase
      .from("map_hearts")
      .update({ status: nextStatus })
      .eq("id", heart.id)
      .eq("status", "pending");

    if (error) {
      console.log("Could not update map heart:", error);
      setHeartsError("The map heart could not be updated.");
      setActiveHeartId(null);
      return;
    }

    setPendingHearts((current) =>
      current.filter((item) => item.id !== heart.id),
    );

    if (action === "approve") {
      setApprovedHearts((current) => [
        {
          ...heart,
          status: "approved",
        },
        ...current,
      ]);

      setActionMessage(
        "The map heart was approved and is now public.",
      );
    } else {
      setActionMessage("The map heart was rejected.");
    }

    setActiveHeartId(null);
  }

  async function deleteApprovedHeart(heart: MapHeartRecord) {
    const confirmed = window.confirm(
      "Delete this approved map heart permanently? It will disappear from the globe.",
    );

    if (!confirmed) {
      return;
    }

    setActiveHeartId(heart.id);
    setActionMessage("");
    setHeartsError("");

    const { error } = await supabase
      .from("map_hearts")
      .delete()
      .eq("id", heart.id);

    if (error) {
      console.log("Could not delete approved map heart:", error);
      setHeartsError(
        "The approved map heart could not be deleted.",
      );
      setActiveHeartId(null);
      return;
    }

    setApprovedHearts((current) =>
      current.filter((item) => item.id !== heart.id),
    );

    setActionMessage("The approved map heart was deleted.");
    setActiveHeartId(null);
  }

  async function handleStoryAction(
    storyId: number,
    action: StoryAction,
  ) {
    setActiveStoryId(storyId);
    setActionMessage("");
    setStoriesError("");

    const selectedStory = pendingStories.find(
      (item) => item.id === storyId,
    );

    if (!selectedStory) {
      setStoriesError("The selected story could not be found.");
      setActiveStoryId(null);
      return;
    }

    if (action === "delete") {
      const confirmed = window.confirm(
        "Delete this story permanently? This cannot be undone.",
      );

      if (!confirmed) {
        setActiveStoryId(null);
        return;
      }

      const { error } = await supabase
        .from("stories")
        .delete()
        .eq("id", storyId);

      if (error) {
        console.log("Could not delete story:", error);
        setStoriesError("The story could not be deleted.");
        setActiveStoryId(null);
        return;
      }

      removePendingStory(storyId);
      setActionMessage("The story was deleted.");
      setActiveStoryId(null);
      return;
    }

    const nextStatus =
      action === "approve" ? "approved" : "rejected";

    const { error } = await supabase
      .from("stories")
      .update({
        status: nextStatus,
      })
      .eq("id", storyId)
      .eq("status", "pending");

    if (error) {
      console.log("Could not update story:", error);

      setStoriesError(
        action === "approve"
          ? "The story could not be approved."
          : "The story could not be rejected.",
      );

      setActiveStoryId(null);
      return;
    }

    removePendingStory(storyId);

    setActionMessage(
      action === "approve"
        ? "The story was approved and is now ready to appear publicly."
        : "The story was rejected.",
    );

    setActiveStoryId(null);
  }

  async function handleSignOut() {
    await supabase.auth.signOut({
      scope: "local",
    });

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
            Content Moderation
          </h1>

          <div className="mx-auto mt-5 h-px w-32 bg-pink-500/70" />

          <p className="mx-auto mt-7 max-w-2xl leading-8 text-gray-400">
            Review stories, letters, and anonymous map hearts
            before they appear publicly.
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

        {heartsError && (
          <div className="mt-10 border border-red-400/40 bg-red-950/30 p-6 text-center text-red-200">
            {heartsError}
          </div>
        )}

        {storiesError && (
          <div className="mt-10 border border-red-400/40 bg-red-950/30 p-6 text-center text-red-200">
            {storiesError}
          </div>
        )}

        {lettersError && (
          <div className="mt-10 border border-red-400/40 bg-red-950/30 p-6 text-center text-red-200">
            {lettersError}
          </div>
        )}

        <section className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-pink-400/25 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-pink-400">
                Around the World
              </p>

              <h2 className="mt-2 font-serif text-3xl text-white">
                Map Heart Moderation
              </h2>
            </div>

            <div className="flex flex-wrap gap-3">
              <span className="rounded-full border border-yellow-400/30 bg-yellow-950/30 px-4 py-2 text-sm text-yellow-200">
                {pendingHearts.length} pending
              </span>

              <span className="rounded-full border border-green-400/30 bg-green-950/30 px-4 py-2 text-sm text-green-200">
                {approvedHearts.length} approved
              </span>
            </div>
          </div>

          {isLoadingHearts ? (
            <div className="mt-8 border border-pink-400/30 bg-white/[0.03] p-10 text-center">
              <div className="text-5xl">🌍</div>

              <p className="mt-4 text-pink-200">
                Loading map hearts...
              </p>
            </div>
          ) : (
            <>
              <div className="mt-8">
                <h3 className="font-serif text-2xl text-pink-200">
                  Pending Hearts
                </h3>

                {pendingHearts.length === 0 ? (
                  <div className="mt-5 border border-pink-400/30 bg-white/[0.03] p-8 text-center">
                    <div className="text-4xl">🖤</div>

                    <p className="mt-3 text-gray-400">
                      No anonymous map hearts are waiting for
                      approval.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 grid gap-5 md:grid-cols-2">
                    {pendingHearts.map((heart) => {
                      const isProcessing =
                        activeHeartId === heart.id;

                      const location = [
                        heart.region,
                        heart.country,
                      ]
                        .filter(Boolean)
                        .join(", ");

                      return (
                        <article
                          key={heart.id}
                          className="border border-yellow-400/30 bg-gradient-to-b from-zinc-950 to-black p-6"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-serif text-2xl text-pink-200">
                                🖤{" "}
                                {location ||
                                  "Approximate location"}
                              </p>

                              <p className="mt-2 text-xs text-gray-500">
                                Submitted{" "}
                                {formatDate(heart.created_at)}
                              </p>
                            </div>

                            <span className="border border-yellow-400/30 bg-yellow-950/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-yellow-200">
                              Pending
                            </span>
                          </div>

                          <p className="mt-4 text-sm text-gray-500">
                            Approximate coordinates:{" "}
                            {heart.latitude.toFixed(0)}°,{" "}
                            {heart.longitude.toFixed(0)}°
                          </p>

                          <div className="mt-6 grid gap-3 sm:grid-cols-3">
                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                handlePendingHeartAction(
                                  heart,
                                  "approve",
                                )
                              }
                              className="border border-green-400/50 bg-green-950/40 px-4 py-3 font-semibold text-green-200 transition hover:bg-green-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isProcessing
                                ? "Working..."
                                : "✓ Approve"}
                            </button>

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                handlePendingHeartAction(
                                  heart,
                                  "reject",
                                )
                              }
                              className="border border-yellow-400/50 bg-yellow-950/40 px-4 py-3 font-semibold text-yellow-200 transition hover:bg-yellow-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isProcessing
                                ? "Working..."
                                : "✕ Reject"}
                            </button>

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                handlePendingHeartAction(
                                  heart,
                                  "delete",
                                )
                              }
                              className="border border-red-400/50 bg-red-950/40 px-4 py-3 font-semibold text-red-200 transition hover:bg-red-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {isProcessing
                                ? "Working..."
                                : "🗑 Delete"}
                            </button>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>


            </>
          )}
        </section>

        <section className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-pink-400/25 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-pink-400">
                Community Experiences
              </p>

              <h2 className="mt-2 font-serif text-3xl text-white">
                Story Moderation
              </h2>
            </div>

            <span className="rounded-full border border-yellow-400/30 bg-yellow-950/30 px-4 py-2 text-sm text-yellow-200">
              {pendingStories.length} pending
            </span>
          </div>

          {isLoadingStories ? (
            <div className="mt-8 border border-pink-400/30 bg-white/[0.03] p-10 text-center">
              <div className="text-5xl">📖</div>

              <p className="mt-4 text-pink-200">
                Loading stories...
              </p>
            </div>
          ) : pendingStories.length === 0 ? (
            <div className="mt-8 border border-pink-400/30 bg-white/[0.03] p-10 text-center">
              <div className="text-5xl">📚</div>

              <h3 className="mt-4 font-serif text-2xl text-pink-200">
                No pending stories
              </h3>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-400">
                New story submissions will appear here for
                review.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-8">
              {pendingStories.map((item) => {
                const isProcessing =
                  activeStoryId === item.id;

                const category = getStoryCategory(
                  item.category,
                );

                return (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-[2rem] border border-pink-300/30 bg-gradient-to-b from-zinc-950 to-black shadow-[0_0_28px_rgba(236,72,153,0.12)]"
                  >
                    <div className="p-6 sm:p-8">
                      <div className="flex flex-wrap items-start justify-between gap-5">
                        <div>
                          <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-950/30 px-4 py-2 text-sm text-pink-200">
                            <span>{category.emoji}</span>
                            <span>{category.title}</span>
                          </div>

                          <h3 className="mt-5 font-serif text-3xl text-pink-100">
                            {item.title}
                          </h3>

                          <p className="mt-3 font-serif text-xl text-white">
                            ♡ {item.name}
                          </p>

                          <p className="mt-1 text-sm text-gray-400">
                            {item.country ||
                              "Country not provided"}
                          </p>

                          {item.email && (
                            <p className="mt-1 text-sm text-gray-500">
                              {item.email}
                            </p>
                          )}

                          <p className="mt-3 text-xs text-gray-600">
                            Submitted{" "}
                            {formatDate(item.created_at)}
                          </p>
                        </div>

                        <span className="border border-yellow-400/30 bg-yellow-950/30 px-3 py-1 text-xs uppercase tracking-[0.18em] text-yellow-200">
                          Pending
                        </span>
                      </div>

                      {item.image_url && (
                        <div className="mt-7 rounded-2xl border border-pink-300/30 bg-black/60 p-4">
                          <p className="mb-4 text-xs uppercase tracking-[0.18em] text-pink-300">
                            Uploaded story photo
                          </p>

                          {item.imagePreviewUrl ? (
                            <img
                              src={item.imagePreviewUrl}
                              alt={`Story upload submitted by ${item.name}`}
                              className="mx-auto max-h-[600px] w-auto max-w-full rounded-xl object-contain"
                            />
                          ) : (
                            <p className="py-8 text-center text-sm text-gray-500">
                              The image preview could not be
                              loaded.
                            </p>
                          )}
                        </div>
                      )}

                      <div className="mt-7 rounded-2xl bg-[#f5e8df] p-6 text-zinc-900 sm:p-8">
                        <p className="whitespace-pre-wrap font-serif text-lg leading-8">
                          {item.story}
                        </p>
                      </div>

                      <div className="mt-7 grid gap-3 sm:grid-cols-3">
                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() =>
                            handleStoryAction(
                              item.id,
                              "approve",
                            )
                          }
                          className="border border-green-400/50 bg-green-950/40 px-5 py-3 font-semibold text-green-200 transition hover:bg-green-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isProcessing
                            ? "Working..."
                            : "✓ Approve"}
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() =>
                            handleStoryAction(
                              item.id,
                              "reject",
                            )
                          }
                          className="border border-yellow-400/50 bg-yellow-950/40 px-5 py-3 font-semibold text-yellow-200 transition hover:bg-yellow-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isProcessing
                            ? "Working..."
                            : "✕ Reject"}
                        </button>

                        <button
                          type="button"
                          disabled={isProcessing}
                          onClick={() =>
                            handleStoryAction(
                              item.id,
                              "delete",
                            )
                          }
                          className="border border-red-400/50 bg-red-950/40 px-5 py-3 font-semibold text-red-200 transition hover:bg-red-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isProcessing
                            ? "Working..."
                            : "🗑 Delete"}
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-20">
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-pink-400/25 pb-5">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-pink-400">
                Awaiting Review
              </p>

              <h2 className="mt-2 font-serif text-3xl text-white">
                Pending Letters
              </h2>
            </div>

            <span className="rounded-full border border-yellow-400/30 bg-yellow-950/30 px-4 py-2 text-sm text-yellow-200">
              {pendingLetters.length} pending
            </span>
          </div>

          {isLoadingLetters ? (
            <div className="mt-8 border border-pink-400/30 bg-white/[0.03] p-10 text-center">
              <div className="text-5xl">📬</div>

              <p className="mt-4 text-pink-200">
                Loading letters...
              </p>
            </div>
          ) : pendingLetters.length === 0 ? (
            <div className="mt-8 border border-pink-400/30 bg-white/[0.03] p-10 text-center">
              <div className="text-5xl">📭</div>

              <h3 className="mt-4 font-serif text-2xl text-pink-200">
                No pending letters
              </h3>

              <p className="mx-auto mt-3 max-w-xl leading-7 text-gray-400">
                New submissions will appear here for review.
              </p>
            </div>
          ) : (
            <div className="mt-8 space-y-7">
              {pendingLetters.map((item) => {
                const isProcessing =
                  activeLetterId === item.id;

                return (
                  <article
                    key={item.id}
                    className="border border-pink-300/30 bg-gradient-to-b from-zinc-950 to-black p-6 shadow-[0_0_24px_rgba(236,72,153,0.12)]"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <h3 className="font-serif text-2xl text-pink-200">
                          {item.name}
                        </h3>

                        <p className="mt-1 text-sm text-gray-400">
                          {item.country ||
                            "Country not provided"}
                        </p>

                        {item.email && (
                          <p className="mt-1 text-sm text-gray-500">
                            {item.email}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-gray-600">
                          Submitted{" "}
                          {formatDate(item.created_at)}
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
                            The image preview could not be
                            loaded.
                          </p>
                        )}

                        <label className="mt-5 flex cursor-pointer items-start gap-3 border border-pink-400/30 bg-pink-950/20 p-4">
                          <input
                            type="checkbox"
                            checked={Boolean(
                              gallerySelections[item.id],
                            )}
                            disabled={isProcessing}
                            onChange={(event) =>
                              setGallerySelections(
                                (current) => ({
                                  ...current,
                                  [item.id]:
                                    event.target.checked,
                                }),
                              )
                            }
                            className="mt-1 h-4 w-4 accent-pink-500"
                          />

                          <span>
                            <span className="block font-semibold text-pink-200">
                              Feature this image in the gallery
                            </span>

                            <span className="mt-1 block text-sm leading-6 text-gray-400">
                              The image will still appear with
                              its approved letter whether or not
                              this box is checked.
                            </span>
                          </span>
                        </label>
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
                          handlePendingAction(
                            item.id,
                            "approve",
                          )
                        }
                        className="border border-green-400/50 bg-green-950/40 px-5 py-3 font-semibold text-green-200 transition hover:bg-green-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing
                          ? "Working..."
                          : "✓ Approve"}
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          handlePendingAction(
                            item.id,
                            "reject",
                          )
                        }
                        className="border border-yellow-400/50 bg-yellow-950/40 px-5 py-3 font-semibold text-yellow-200 transition hover:bg-yellow-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing
                          ? "Working..."
                          : "✕ Reject"}
                      </button>

                      <button
                        type="button"
                        disabled={isProcessing}
                        onClick={() =>
                          handlePendingAction(
                            item.id,
                            "delete",
                          )
                        }
                        className="border border-red-400/50 bg-red-950/40 px-5 py-3 font-semibold text-red-200 transition hover:bg-red-900/60 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {isProcessing
                          ? "Working..."
                          : "🗑 Delete"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </section>

      <Footer />
    </main>
  );
}
