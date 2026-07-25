"use client";

import { useEffect, useMemo, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

type StoryCategory = {
  slug: string;
  emoji: string;
  title: string;
  description: string;
};

const STORY_CATEGORIES: StoryCategory[] = [
  {
    slug: "how-i-found-yungblud",
    emoji: "🖤",
    title: "How I Found YUNGBLUD",
    description:
      "The first song, video, interview, or moment that brought YUNGBLUD into your life.",
  },
  {
    slug: "a-song-that-changed-me",
    emoji: "🎵",
    title: "A Song That Changed Me",
    description:
      "Stories about the songs that helped, inspired, comforted, or changed you.",
  },
  {
    slug: "concert-memories",
    emoji: "🌎",
    title: "Concert Memories",
    description:
      "Favorite shows, unforgettable moments, and memories made in the crowd.",
  },
  {
    slug: "my-mental-health-journey",
    emoji: "❤️",
    title: "My Mental Health Journey",
    description:
      "Personal stories about finding strength, support, hope, and connection.",
  },
  {
    slug: "the-community",
    emoji: "👥",
    title: "The Community",
    description:
      "Friendships, chosen family, and the moments that made this community feel like home.",
  },
];

function getCategory(categorySlug: string): StoryCategory {
  return (
    STORY_CATEGORIES.find((category) => category.slug === categorySlug) ?? {
      slug: categorySlug,
      emoji: "📖",
      title: categorySlug,
      description: "A story shared by a member of the community.",
    }
  );
}

function createStoryPreview(story: string, maximumLength = 240) {
  const cleanedStory = story.trim();
  return cleanedStory.length <= maximumLength
    ? cleanedStory
    : `${cleanedStory.slice(0, maximumLength).trimEnd()}…`;
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function StoriesPage() {
  const [stories, setStories] = useState<StoryWithImage[]>([]);
  const [selectedStory, setSelectedStory] =
    useState<StoryWithImage | null>(null);
  const [activeCategory, setActiveCategory] = useState("all");
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
        console.log("Could not load approved stories:", error);
        setErrorMessage(
          "The community stories could not be loaded right now.",
        );
        setIsLoading(false);
        return;
      }

      const approvedStories = (data ?? []) as StoryRecord[];

      const storiesWithImages = await Promise.all(
        approvedStories.map(
          async (story): Promise<StoryWithImage> => {
            if (!story.image_url) {
              return { ...story, imagePreviewUrl: null };
            }

            const { data: signedImage, error: imageError } =
              await supabase.storage
                .from("story-uploads")
                .createSignedUrl(story.image_url, 60 * 60 * 24);

            if (imageError) {
              console.log(
                `Could not create image URL for story ${story.id}:`,
                imageError,
              );
              return { ...story, imagePreviewUrl: null };
            }

            return {
              ...story,
              imagePreviewUrl: signedImage.signedUrl,
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
    if (!selectedStory) return;

    function closeWithEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setSelectedStory(null);
    }

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeWithEscape);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", closeWithEscape);
    };
  }, [selectedStory]);

  const visibleStories = useMemo(() => {
    if (activeCategory === "all") return stories;
    return stories.filter(
      (story) => story.category === activeCategory,
    );
  }, [activeCategory, stories]);

  const groupedStories = useMemo(() => {
    return STORY_CATEGORIES.map((category) => ({
      category,
      stories: stories.filter(
        (story) => story.category === category.slug,
      ),
    })).filter((group) => group.stories.length > 0);
  }, [stories]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="relative overflow-hidden border-b border-pink-500/20 px-6 py-20 sm:py-24">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-28 top-10 h-80 w-80 rounded-full bg-pink-600/10 blur-3xl" />
          <div className="absolute -right-28 bottom-0 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-3xl" />
          <div className="absolute left-1/2 top-2 -translate-x-1/2 text-[12rem] text-pink-500/[0.025]">
            ♡
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl text-center">
          <p className="text-sm uppercase tracking-[0.32em] text-pink-400">
            Our stories
          </p>
          <h1 className="mt-4 font-serif text-5xl leading-tight text-white sm:text-6xl">
            Stories from the YUNGBLUD Family
          </h1>
          <div className="mx-auto mt-6 h-px w-36 bg-pink-500/70" />
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-gray-400">
            Read personal memories, meaningful moments, and stories of
            connection shared by people from around the world.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <a
              href="/stories/submit"
              className="rounded-full bg-pink-500 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black transition hover:bg-pink-400"
            >
              Share Your Story
            </a>
            <a
              href="#community-stories"
              className="rounded-full border border-pink-400/50 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-pink-200 transition hover:bg-pink-500/10 hover:text-white"
            >
              Read the Stories
            </a>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-zinc-950/70 px-6 py-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={`rounded-full border px-5 py-2.5 text-sm transition ${
                activeCategory === "all"
                  ? "border-pink-400 bg-pink-500 text-black"
                  : "border-white/15 bg-black/40 text-gray-300 hover:border-pink-400/60 hover:text-pink-200"
              }`}
            >
              ✨ All Stories
            </button>

            {STORY_CATEGORIES.map((category) => (
              <button
                key={category.slug}
                type="button"
                onClick={() => setActiveCategory(category.slug)}
                className={`rounded-full border px-5 py-2.5 text-sm transition ${
                  activeCategory === category.slug
                    ? "border-pink-400 bg-pink-500 text-black"
                    : "border-white/15 bg-black/40 text-gray-300 hover:border-pink-400/60 hover:text-pink-200"
                }`}
              >
                {category.emoji} {category.title}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section id="community-stories" className="relative px-6 py-20">
        <div className="mx-auto max-w-6xl">
          {isLoading ? (
            <StatusPanel emoji="📖" text="Loading community stories..." />
          ) : errorMessage ? (
            <div className="rounded-[2rem] border border-red-400/30 bg-red-950/20 px-6 py-12 text-center text-red-200">
              {errorMessage}
            </div>
          ) : stories.length === 0 ? (
            <div className="rounded-[2rem] border border-pink-400/25 bg-white/[0.03] px-6 py-16 text-center">
              <div className="text-6xl">📚</div>
              <h2 className="mt-5 font-serif text-3xl text-pink-200">
                The story library is waiting for its first chapter
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-8 text-gray-400">
                Approved community stories will appear here after they
                have been reviewed.
              </p>
              <a
                href="/stories/submit"
                className="mt-8 inline-flex rounded-full border border-pink-400/50 px-7 py-3 text-sm font-bold uppercase tracking-[0.16em] text-pink-200 transition hover:bg-pink-500 hover:text-black"
              >
                Share the First Story
              </a>
            </div>
          ) : activeCategory !== "all" ? (
            <div>
              <CategoryHeader
                category={getCategory(activeCategory)}
                storyCount={visibleStories.length}
              />
              {visibleStories.length === 0 ? (
                <StatusPanel
                  emoji={getCategory(activeCategory).emoji}
                  text="No approved stories have been added to this category yet."
                />
              ) : (
                <StoryGrid
                  stories={visibleStories}
                  onSelectStory={setSelectedStory}
                />
              )}
            </div>
          ) : (
            <div className="space-y-20">
              {groupedStories.map(({ category, stories: categoryStories }) => (
                <section key={category.slug}>
                  <CategoryHeader
                    category={category}
                    storyCount={categoryStories.length}
                  />
                  <StoryGrid
                    stories={categoryStories}
                    onSelectStory={setSelectedStory}
                  />
                </section>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="border-y border-pink-500/15 bg-gradient-to-b from-zinc-950 to-black px-6 py-16">
        <div className="mx-auto max-w-4xl text-center">
          <div className="text-5xl">🖤</div>
          <h2 className="mt-5 font-serif text-4xl text-white">
            Your story matters too
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-8 text-gray-400">
            Every story has the power to help someone feel less alone.
            Share a memory, a song, a concert moment, or what this
            community has meant to you.
          </p>
          <a
            href="/stories/submit"
            className="mt-8 inline-flex rounded-full bg-pink-500 px-8 py-3 text-sm font-bold uppercase tracking-[0.16em] text-black transition hover:bg-pink-400"
          >
            Share Your Story
          </a>
        </div>
      </section>

      <Footer />

      {selectedStory && (
        <StoryModal
          story={selectedStory}
          onClose={() => setSelectedStory(null)}
        />
      )}
    </main>
  );
}

function StatusPanel({ emoji, text }: { emoji: string; text: string }) {
  return (
    <div className="mt-10 rounded-[2rem] border border-pink-400/25 bg-white/[0.03] px-6 py-14 text-center">
      <div className="text-6xl">{emoji}</div>
      <p className="mt-5 font-serif text-2xl text-pink-200">{text}</p>
    </div>
  );
}

function CategoryHeader({
  category,
  storyCount,
}: {
  category: StoryCategory;
  storyCount: number;
}) {
  return (
    <header className="border-b border-pink-400/20 pb-6">
      <div className="flex flex-wrap items-end justify-between gap-5">
        <div>
          <p className="text-sm uppercase tracking-[0.22em] text-pink-400">
            {category.emoji} Community Stories
          </p>
          <h2 className="mt-3 font-serif text-3xl text-white sm:text-4xl">
            {category.title}
          </h2>
          <p className="mt-4 max-w-3xl leading-7 text-gray-400">
            {category.description}
          </p>
        </div>
        <span className="rounded-full border border-pink-400/30 bg-pink-950/30 px-4 py-2 text-sm text-pink-200">
          {storyCount} {storyCount === 1 ? "story" : "stories"}
        </span>
      </div>
    </header>
  );
}

function StoryGrid({
  stories,
  onSelectStory,
}: {
  stories: StoryWithImage[];
  onSelectStory: (story: StoryWithImage) => void;
}) {
  return (
    <div className="mt-9 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
      {stories.map((story) => {
        const category = getCategory(story.category);

        return (
          <article
            key={story.id}
            className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-pink-300/25 bg-gradient-to-b from-zinc-900 to-black shadow-[0_0_25px_rgba(236,72,153,0.1)] transition duration-300 hover:-translate-y-1 hover:border-pink-400/60 hover:shadow-[0_0_38px_rgba(236,72,153,0.18)]"
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
                  <div className="text-6xl">{category.emoji}</div>
                  <div className="mt-3 text-5xl text-pink-500/30">♡</div>
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
                Shared by <span className="text-white">{story.name}</span>
                {story.country ? ` · ${story.country}` : ""}
              </p>
              <p className="mt-2 text-xs text-gray-600">
                {formatDate(story.created_at)}
              </p>
              <p className="mt-5 flex-1 leading-7 text-gray-400">
                {createStoryPreview(story.story)}
              </p>
              <button
                type="button"
                onClick={() => onSelectStory(story)}
                className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full border border-pink-400/50 bg-pink-500/10 px-5 py-3 text-sm font-semibold uppercase tracking-[0.14em] text-pink-200 transition hover:bg-pink-500 hover:text-black"
              >
                Read Full Story <span aria-hidden="true">→</span>
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function StoryModal({
  story,
  onClose,
}: {
  story: StoryWithImage;
  onClose: () => void;
}) {
  const category = getCategory(story.category);

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby={`story-title-${story.id}`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
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
              className="mx-auto max-h-[520px] w-auto max-w-full rounded-2xl object-contain"
            />
          </div>
        )}

        <div className="p-6 sm:p-10">
          <div className="inline-flex items-center gap-2 rounded-full border border-pink-400/30 bg-pink-950/30 px-4 py-2 text-sm text-pink-200">
            <span>{category.emoji}</span>
            <span>{category.title}</span>
          </div>
          <h2
            id={`story-title-${story.id}`}
            className="mt-6 font-serif text-4xl leading-tight text-pink-100 sm:text-5xl"
          >
            {story.title}
          </h2>
          <p className="mt-4 font-serif text-xl text-white">
            ♡ {story.name}
          </p>
          <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-400">
            {story.country && <span>{story.country}</span>}
            <span>{formatDate(story.created_at)}</span>
          </div>
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