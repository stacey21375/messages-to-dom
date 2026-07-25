"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";

type StoryRecord = {
  id: number;
  name: string;
  country: string | null;
  title: string;
  story: string;
  category: string;
  image_url: string | null;
  created_at: string;
  status: string;
};

type StoryWithImage = StoryRecord & {
  imagePreviewUrl: string | null;
};

const TWO_DAYS_IN_MILLISECONDS = 2 * 24 * 60 * 60 * 1000;
const NUMBER_OF_FEATURED_STORIES = 3;

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

function getStoryCategory(category: string) {
  return (
    STORY_CATEGORIES[category] ?? {
      emoji: "📖",
      title: category,
    }
  );
}

function selectRotatingStories(
  stories: StoryWithImage[],
  rotationPeriod: number,
) {
  if (stories.length <= NUMBER_OF_FEATURED_STORIES) {
    return stories;
  }

  const startingIndex =
    rotationPeriod % stories.length;

  return Array.from(
    { length: NUMBER_OF_FEATURED_STORIES },
    (_, index) =>
      stories[(startingIndex + index) % stories.length],
  );
}

function createStoryPreview(story: string) {
  const trimmedStory = story.trim();

  if (trimmedStory.length <= 190) {
    return trimmedStory;
  }

  return `${trimmedStory.slice(0, 190).trimEnd()}…`;
}

export default function FeaturedStories() {
  const [stories, setStories] = useState<StoryWithImage[]>([]);
  const [selectedStory, setSelectedStory] =
    useState<StoryWithImage | null>(null);
  const [rotationPeriod, setRotationPeriod] = useState(() =>
    Math.floor(Date.now() / TWO_DAYS_IN_MILLISECONDS),
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadApprovedStories() {
      setIsLoading(true);
      setErrorMessage("");

      const { data, error } = await supabase
        .from("stories")
        .select(
          "id, name, country, title, story, category, image_url, created_at, status",
        )
        .eq("status", "approved")
        .order("created_at", { ascending: false });

      if (error) {
        console.log(
          "Could not load featured stories:",
          error,
        );
        setErrorMessage(
          "Featured stories could not be loaded right now.",
        );
        setIsLoading(false);
        return;
      }

      const approvedStories =
        (data ?? []) as StoryRecord[];

      const storiesWithImages = await Promise.all(
        approvedStories.map(
          async (story): Promise<StoryWithImage> => {
            if (!story.image_url) {
              return {
                ...story,
                imagePreviewUrl: null,
              };
            }

            const { data: signedImage, error: imageError } =
              await supabase.storage
                .from("story-uploads")
                .createSignedUrl(
                  story.image_url,
                  60 * 60 * 24,
                );

            if (imageError) {
              console.log(
                `Could not load image for story ${story.id}:`,
                imageError,
              );

              return {
                ...story,
                imagePreviewUrl: null,
              };
            }

            return {
              ...story,
              imagePreviewUrl:
                signedImage.signedUrl,
            };
          },
        ),
      );

      setStories(storiesWithImages);
      setIsLoading(false);
    }

    loadApprovedStories();
  }, []);

  useEffect(() => {
    function updateRotationPeriod() {
      setRotationPeriod(
        Math.floor(
          Date.now() / TWO_DAYS_IN_MILLISECONDS,
        ),
      );
    }

    const intervalId = window.setInterval(
      updateRotationPeriod,
      60 * 60 * 1000,
    );

    return () => window.clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (!selectedStory) {
      return;
    }

    function handleEscapeKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setSelectedStory(null);
      }
    }

    const originalOverflow =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleEscapeKey);

    return () => {
      document.body.style.overflow =
        originalOverflow;
      window.removeEventListener(
        "keydown",
        handleEscapeKey,
      );
    };
  }, [selectedStory]);

  const featuredStories = useMemo(
    () =>
      selectRotatingStories(
        stories,
        rotationPeriod,
      ),
    [stories, rotationPeriod],
  );

  if (!isLoading && stories.length === 0 && !errorMessage) {
    return null;
  }

  return (
    <>
      <section className="relative overflow-hidden border-y border-pink-500/15 bg-gradient-to-b from-black via-zinc-950 to-black px-6 py-20">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-pink-600/10 blur-3xl" />
          <div className="absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />
          <div className="absolute left-1/2 top-10 -translate-x-1/2 text-[10rem] text-pink-500/[0.025]">
            ♡
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl">
          <header className="text-center">
            <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
              Voices from the community
            </p>

            <h2 className="mt-4 font-serif text-4xl text-white sm:text-5xl">
              Featured Stories
            </h2>

            <div className="mx-auto mt-5 h-px w-32 bg-pink-500/70" />

            <p className="mx-auto mt-6 max-w-2xl leading-8 text-gray-400">
              Personal memories, meaningful songs, and
              moments of connection shared by members of
              the YUNGBLUD family.
            </p>

            <p className="mt-3 text-xs uppercase tracking-[0.2em] text-gray-600">
              New stories featured every two days
            </p>
          </header>

          {isLoading ? (
            <div className="mt-12 rounded-[2rem] border border-pink-400/20 bg-white/[0.03] px-6 py-14 text-center">
              <div className="text-5xl">📖</div>

              <p className="mt-4 text-pink-200">
                Loading featured stories...
              </p>
            </div>
          ) : errorMessage ? (
            <div className="mt-12 rounded-[2rem] border border-red-400/30 bg-red-950/20 px-6 py-10 text-center text-red-200">
              {errorMessage}
            </div>
          ) : (
            <div className="mt-12 grid gap-7 lg:grid-cols-3">
              {featuredStories.map((story) => {
                const category =
                  getStoryCategory(story.category);

                return (
                  <article
                    key={story.id}
                    className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-pink-300/25 bg-gradient-to-b from-zinc-900 to-black shadow-[0_0_25px_rgba(236,72,153,0.1)] transition duration-300 hover:-translate-y-1 hover:border-pink-400/60 hover:shadow-[0_0_38px_rgba(236,72,153,0.2)]"
                  >
                    {story.imagePreviewUrl ? (
                      <div className="relative aspect-[4/3] overflow-hidden border-b border-pink-400/20 bg-black">
                        <img
                          src={story.imagePreviewUrl}
                          alt={`Story shared by ${story.name}`}
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                      </div>
                    ) : (
                      <div className="flex aspect-[4/3] items-center justify-center border-b border-pink-400/20 bg-gradient-to-br from-pink-950/40 via-zinc-950 to-black">
                        <div className="text-center">
                          <div className="text-6xl">
                            {category.emoji}
                          </div>

                          <div className="mt-3 text-5xl text-pink-500/30">
                            ♡
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex flex-1 flex-col p-7">
                      <div className="inline-flex w-fit items-center gap-2 rounded-full border border-pink-400/25 bg-pink-950/30 px-3 py-1.5 text-xs text-pink-200">
                        <span>{category.emoji}</span>
                        <span>{category.title}</span>
                      </div>

                      <h3 className="mt-5 font-serif text-2xl leading-snug text-pink-100">
                        {story.title}
                      </h3>

                      <p className="mt-3 text-sm text-gray-400">
                        Shared by{" "}
                        <span className="text-white">
                          {story.name}
                        </span>
                        {story.country
                          ? ` · ${story.country}`
                          : ""}
                      </p>

                      <p className="mt-5 flex-1 leading-7 text-gray-400">
                        {createStoryPreview(story.story)}
                      </p>

                      <button
                        type="button"
                        onClick={() =>
                          setSelectedStory(story)
                        }
                        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-pink-400/50 bg-pink-500/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-pink-200 transition hover:bg-pink-500 hover:text-black"
                      >
                        Read Full Story
                        <span aria-hidden="true">→</span>
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {!isLoading &&
            !errorMessage &&
            stories.length > 0 && (
              <div className="mt-12 text-center">
                <Link
                  href="/stories"
                  className="inline-flex items-center gap-2 border-b border-pink-400 pb-1 text-sm font-semibold uppercase tracking-[0.18em] text-pink-300 transition hover:text-white"
                >
                  Explore All Stories
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            )}
        </div>
      </section>

      {selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </>
  );
}

function StoryModal({
  story,
  onClose,
}: {
  story: StoryWithImage;
  onClose: () => void;
}) {
  const category = getStoryCategory(story.category);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`featured-story-${story.id}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <article className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-[2rem] border border-pink-400/40 bg-zinc-950 shadow-[0_0_60px_rgba(236,72,153,0.3)]">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close story"
          className="sticky right-4 top-4 z-20 ml-auto mr-4 mt-4 flex h-11 w-11 items-center justify-center rounded-full border border-white/20 bg-black/80 text-xl text-white transition hover:border-pink-400 hover:text-pink-300"
        >
          ×
        </button>

        {story.imagePreviewUrl && (
          <div className="-mt-15 border-b border-pink-400/20 bg-black p-4 pt-16 sm:p-7 sm:pt-16">
            <img
              src={story.imagePreviewUrl}
              alt={`Story shared by ${story.name}`}
              className="mx-auto max-h-[500px] w-auto max-w-full rounded-2xl object-contain"
            />
          </div>
        )}

        <div className="p-6 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-950/30 px-4 py-2 text-sm text-pink-200">
            <span>{category.emoji}</span>
            <span>{category.title}</span>
          </div>

          <h2
            id={`featured-story-${story.id}`}
            className="mt-6 font-serif text-4xl leading-tight text-pink-100 sm:text-5xl"
          >
            {story.title}
          </h2>

          <p className="mt-4 font-serif text-xl text-white">
            ♡ {story.name}
          </p>

          {story.country && (
            <p className="mt-1 text-gray-400">
              {story.country}
            </p>
          )}

          <div className="mt-8 rounded-2xl bg-[#f5e8df] p-6 text-zinc-900 shadow-inner sm:p-10">
            <p className="whitespace-pre-wrap font-serif text-lg leading-9">
              {story.story}
            </p>
          </div>

          <div className="mt-8 text-center">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-pink-400/50 px-7 py-3 text-sm font-semibold uppercase tracking-[0.16em] text-pink-200 transition hover:bg-pink-500 hover:text-black"
            >
              Close Story
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}