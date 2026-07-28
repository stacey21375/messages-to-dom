"use client";

import Link from "next/link";
import {
  FormEvent,
  Suspense,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useSearchParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { supabase } from "../../lib/supabase";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

type StoryCategory = {
  slug: string;
  emoji: string;
  title: string;
  description: string;
  prompt: string;
};

const STORY_CATEGORIES: StoryCategory[] = [
  {
    slug: "how-i-found-yungblud",
    emoji: "🖤",
    title: "How I Found YUNGBLUD",
    description:
      "Everyone has a beginning. Share how you first discovered Dom and what drew you in.",
    prompt:
      "How did you first discover YUNGBLUD? Tell us where you were, what you heard, and what made you want to keep listening...",
  },
  {
    slug: "a-song-that-changed-me",
    emoji: "🎵",
    title: "A Song That Changed Me",
    description:
      "Tell us about the song or lyrics that inspired you, comforted you, or changed your perspective.",
    prompt:
      "Which song meant the most to you? Share what was happening in your life and why the music connected with you...",
  },
  {
    slug: "concert-memories",
    emoji: "🌎",
    title: "Concert Memories",
    description:
      "Tell us about your favorite show, travel adventure, unforgettable performance, or special moment with the YUNGBLUD family.",
    prompt:
      "Take us back to the moment. Where was the show, who were you with, and what made the experience unforgettable?",
  },
  {
    slug: "my-mental-health-journey",
    emoji: "❤️",
    title: "My Mental Health Journey",
    description:
      "If you're comfortable sharing, tell us how music, hope, or the community helped you through difficult times.",
    prompt:
      "Share only what feels comfortable. Tell us how music, hope, or the community supported you during a difficult chapter...",
  },
  {
    slug: "the-community",
    emoji: "👥",
    title: "The Community",
    description:
      "Celebrate the friendships, kindness, and connections you've made because of the YUNGBLUD family.",
    prompt:
      "Tell us about the people you met, the kindness you experienced, or the friendships that grew through this community...",
  },
];

function getCategory(categorySlug: string | null) {
  return (
    STORY_CATEGORIES.find(
      (category) => category.slug === categorySlug,
    ) ?? null
  );
}

export default function SubmitStoryPage() {
  return (
    <Suspense fallback={<SubmitStoryLoading />}>
      <SubmitStoryForm />
    </Suspense>
  );
}

function SubmitStoryLoading() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <section className="flex min-h-[65vh] items-center justify-center px-6 py-16">
        <div className="text-center">
          <div className="text-5xl">🖤</div>

          <p className="mt-5 font-serif text-xl text-pink-200">
            Preparing your story page...
          </p>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function SubmitStoryForm() {
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedCategory = useMemo(
    () => getCategory(searchParams.get("category")),
    [searchParams],
  );

  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [country, setCountry] = useState("");
  const [email, setEmail] = useState("");
  const [storyTitle, setStoryTitle] = useState("");
  const [story, setStory] = useState("");
  const [selectedImage, setSelectedImage] =
    useState<File | null>(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const today = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    if (!selectedImage) {
      setImagePreviewUrl("");
      return;
    }

    const previewUrl = URL.createObjectURL(selectedImage);
    setImagePreviewUrl(previewUrl);

    return () => {
      URL.revokeObjectURL(previewUrl);
    };
  }, [selectedImage]);

  function clearForm() {
    setName("");
    setCountry("");
    setEmail("");
    setStoryTitle("");
    setStory("");
    setSelectedImage(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!selectedCategory) {
      setSubmitError(
        "Please return to the Stories page and choose a story category.",
      );
      return;
    }

    const trimmedName = name.trim();
    const trimmedTitle = storyTitle.trim();
    const trimmedStory = story.trim();

    if (!trimmedName || !trimmedTitle || !trimmedStory) {
      setSubmitError(
        "Please complete your name, story title, and story.",
      );
      return;
    }

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
        selectedImage.name
          .split(".")
          .pop()
          ?.toLowerCase() || "jpg";

      const safeBaseName = selectedImage.name
        .replace(/\.[^/.]+$/, "")
        .replace(/[^a-zA-Z0-9-_]/g, "-")
        .slice(0, 60);

      imagePath = `${crypto.randomUUID()}-${safeBaseName}.${extension}`;

      const { error: uploadError } = await supabase.storage
        .from("story-uploads")
        .upload(imagePath, selectedImage, {
          cacheControl: "3600",
          contentType: selectedImage.type,
          upsert: false,
        });

      if (uploadError) {
        console.log(
          "Supabase story image upload error:",
          uploadError,
        );

        setSubmitError(
          "Your image could not be uploaded. Please try again.",
        );
        setIsSubmitting(false);
        return;
      }
    }

    const { error: storyError } = await supabase
      .from("stories")
      .insert({
        name: trimmedName,
        country: country.trim() || null,
        email: email.trim() || null,
        title: trimmedTitle,
        story: trimmedStory,
        category: selectedCategory.slug,
        image_url: imagePath,
        status: "pending",
      });

    if (storyError) {
     console.log(
  "Supabase story submission error:",
  storyError,
);

      setSubmitError(
        "Your story could not be submitted. Please try again.",
      );
      setIsSubmitting(false);
      return;
    }

    setSubmitted(true);
    clearForm();
    setIsSubmitting(false);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  if (!selectedCategory) {
    return (
      <main className="min-h-screen bg-black text-white">
        <Navbar />

        <section className="relative overflow-hidden px-6 py-20">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute left-10 top-16 text-6xl text-pink-500/15">
              ♡
            </div>

            <div className="absolute right-12 top-32 text-5xl text-pink-400/15">
              ♡
            </div>
          </div>

          <div className="relative mx-auto max-w-2xl rounded-[2rem] border border-pink-400/40 bg-gradient-to-b from-zinc-950 to-black p-8 text-center shadow-[0_0_35px_rgba(236,72,153,0.18)] sm:p-12">
            <div className="text-6xl">🖤</div>

            <h1 className="mt-6 font-serif text-4xl text-pink-200">
              Choose Your Story
            </h1>

            <p className="mx-auto mt-5 max-w-xl leading-8 text-gray-400">
              Please choose one of the five story categories before
              beginning your submission.
            </p>

            <Link
              href="/stories"
              className="mt-8 inline-flex rounded-full bg-pink-600 px-8 py-4 font-semibold text-white shadow-[0_0_25px_rgba(236,72,153,0.35)] transition hover:-translate-y-1 hover:bg-pink-500"
            >
              Return to Stories
            </Link>
          </div>
        </section>

        <Footer />
      </main>
    );
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

          <div className="absolute -right-32 top-1/3 h-80 w-80 rounded-full bg-pink-600/10 blur-3xl" />

          <div className="absolute -left-32 bottom-20 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-4xl">
          <div className="mb-10 text-center">
            <Link
              href="/stories"
              className="inline-flex items-center gap-2 text-sm uppercase tracking-[0.2em] text-pink-400 transition hover:text-pink-300"
            >
              <span aria-hidden="true">←</span>
              Choose a different category
            </Link>

            <p className="mt-8 text-sm uppercase tracking-[0.3em] text-pink-400">
              Share your experience
            </p>

            <div className="mt-4 text-6xl">
              {selectedCategory.emoji}
            </div>

            <h1 className="mt-4 font-serif text-4xl sm:text-5xl">
              {selectedCategory.title}
            </h1>

            <div className="mx-auto mt-5 h-px w-32 bg-pink-500/70" />

            <p className="mx-auto mt-7 max-w-2xl leading-8 text-gray-400">
              {selectedCategory.description}
            </p>
          </div>

          <div className="relative rounded-[2rem] border border-pink-400/50 bg-gradient-to-b from-zinc-950 to-black p-6 shadow-[0_0_35px_rgba(236,72,153,0.18)] sm:p-10">
            <div className="absolute -top-6 left-1/2 flex h-14 w-14 -translate-x-1/2 items-center justify-center rounded-full border border-pink-200 bg-pink-600 text-2xl shadow-[0_0_24px_rgba(236,72,153,0.65)]">
              {selectedCategory.emoji}
            </div>

            <div className="mb-9 mt-3 text-center">
              <p className="font-serif text-xl text-pink-300">
                Your story matters
              </p>

              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-gray-500">
                Complete the form below. Your story will be reviewed
                before it appears publicly.
              </p>
            </div>

            {submitError && (
              <div
                role="alert"
                className="mb-8 border border-red-400/50 bg-red-950/40 p-5 text-center text-red-200"
              >
                {submitError}
              </div>
            )}

            {submitted && (
              <div
                aria-live="polite"
                className="mb-8 rounded-3xl border border-pink-400/50 bg-gradient-to-b from-pink-950/70 to-black p-7 text-center shadow-[0_0_25px_rgba(236,72,153,0.25)]"
              >
                <div className="text-5xl">
                  {selectedCategory.emoji}
                </div>

                <p className="mt-4 font-serif text-2xl text-pink-200">
                  Your story has been submitted.
                </p>

                <p className="mx-auto mt-3 max-w-xl leading-7 text-pink-100/70">
                  Thank you for trusting the community with your
                  experience. Your submission will be reviewed before
                  it is published.
                </p>

                <p className="mt-5 font-serif italic text-pink-400">
                  — Messages to Dom ♡
                </p>

                <div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row">
                  <Link
                    href="/stories"
                    className="rounded-full border border-pink-300/50 px-6 py-3 text-sm uppercase tracking-[0.15em] text-pink-200 transition hover:bg-pink-950/60"
                  >
                    Return to Stories
                  </Link>

                  <button
                    type="button"
                    onClick={() => setSubmitted(false)}
                    className="rounded-full bg-pink-600 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition hover:bg-pink-500"
                  >
                    Share Another Story
                  </button>
                </div>
              </div>
            )}

            <form
              className="space-y-6"
              onSubmit={handleSubmit}
            >
              <div className="grid gap-6 md:grid-cols-2">
                <div>
                  <label
                    htmlFor="story-name"
                    className="mb-2 block text-sm uppercase tracking-[0.18em] text-pink-300"
                  >
                    Name or Nickname
                  </label>

                  <input
                    id="story-name"
                    name="name"
                    type="text"
                    required
                    maxLength={100}
                    autoComplete="name"
                    value={name}
                    onChange={(event) =>
                      setName(event.target.value)
                    }
                    placeholder="How should your story be signed?"
                    className="w-full border border-white/20 bg-black/70 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-pink-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                  />
                </div>

                <div>
                  <label
                    htmlFor="story-country"
                    className="mb-2 block text-sm uppercase tracking-[0.18em] text-pink-300"
                  >
                    Country
                  </label>

                  <input
                    id="story-country"
                    name="country"
                    type="text"
                    maxLength={100}
                    autoComplete="country-name"
                    value={country}
                    onChange={(event) =>
                      setCountry(event.target.value)
                    }
                    placeholder="Optional"
                    className="w-full border border-white/20 bg-black/70 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-pink-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="story-email"
                  className="mb-2 block text-sm uppercase tracking-[0.18em] text-pink-300"
                >
                  Email Address
                </label>

                <input
                  id="story-email"
                  name="email"
                  type="email"
                  maxLength={254}
                  autoComplete="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  placeholder="Optional and never displayed publicly"
                  className="w-full border border-white/20 bg-black/70 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-pink-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                />
              </div>

              <div>
                <label
                  htmlFor="story-title"
                  className="mb-2 block text-sm uppercase tracking-[0.18em] text-pink-300"
                >
                  Story Title
                </label>

                <input
                  id="story-title"
                  name="title"
                  type="text"
                  required
                  maxLength={150}
                  value={storyTitle}
                  onChange={(event) =>
                    setStoryTitle(event.target.value)
                  }
                  placeholder="Give your story a title"
                  className="w-full border border-white/20 bg-black/70 px-4 py-3 text-white outline-none transition placeholder:text-gray-600 focus:border-pink-400 focus:shadow-[0_0_15px_rgba(236,72,153,0.2)]"
                />

                <div className="mt-2 text-right text-xs text-gray-500">
                  {storyTitle.length} / 150 characters
                </div>
              </div>

              <div>
                <label
                  htmlFor="story"
                  className="mb-2 block text-sm uppercase tracking-[0.18em] text-pink-300"
                >
                  Your Story
                </label>

                <textarea
                  id="story"
                  name="story"
                  rows={12}
                  maxLength={5000}
                  required
                  value={story}
                  onChange={(event) =>
                    setStory(event.target.value)
                  }
                  placeholder={selectedCategory.prompt}
                  className="w-full resize-y rounded-2xl border border-pink-200/20 bg-[#efe3dc] px-5 py-5 font-serif text-lg leading-8 text-zinc-900 outline-none transition placeholder:text-zinc-500 focus:border-pink-400 focus:shadow-[0_0_20px_rgba(236,72,153,0.25)]"
                />

                <div className="mt-2 flex justify-between gap-4 text-xs text-gray-500">
                  <span>
                    Share only what feels comfortable to you.
                  </span>

                  <span>{story.length} / 5000 characters</span>
                </div>
              </div>

              <div>
                <label
                  htmlFor="story-photo"
                  className="mb-2 block text-sm uppercase tracking-[0.18em] text-pink-300"
                >
                  Add a Photo
                </label>

                <input
                  ref={fileInputRef}
                  id="story-photo"
                  name="photo"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  onChange={(event) =>
                    setSelectedImage(
                      event.target.files?.[0] ?? null,
                    )
                  }
                  className="w-full rounded-2xl border border-dashed border-pink-400/40 bg-black/50 px-4 py-5 text-sm text-gray-400 file:mr-4 file:rounded-full file:border-0 file:bg-pink-700 file:px-5 file:py-2 file:text-white file:transition hover:file:bg-pink-600"
                />

                <p className="mt-2 text-xs leading-6 text-gray-500">
                  Optional. JPG, PNG, WebP, or GIF. Maximum size:
                  5 MB. Only upload an image you created or have
                  permission to share.
                </p>

                {selectedImage && (
                  <div className="mt-4 rounded-2xl border border-pink-400/30 bg-pink-950/20 p-4">
                    <p className="text-sm text-pink-300">
                      Selected: {selectedImage.name}
                    </p>

                    {imagePreviewUrl && (
                      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10">
                        <img
                          src={imagePreviewUrl}
                          alt="Selected story upload preview"
                          className="max-h-80 w-full object-contain bg-black"
                        />
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImage(null);

                        if (fileInputRef.current) {
                          fileInputRef.current.value = "";
                        }
                      }}
                      className="mt-4 text-sm text-pink-300 underline decoration-pink-500/50 underline-offset-4 transition hover:text-pink-200"
                    >
                      Remove photo
                    </button>
                  </div>
                )}
              </div>

              <label className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
                <input
                  type="checkbox"
                  name="agreement"
                  required
                  className="mt-1 h-4 w-4 accent-pink-500"
                />

                <span className="text-sm leading-6 text-gray-400">
                  I confirm that this story is respectful, that I
                  am comfortable sharing it publicly, and that I
                  have permission to share any image I upload.
                </span>
              </label>

              <div className="rounded-2xl border border-pink-400/20 bg-pink-950/10 p-4">
                <p className="text-sm leading-6 text-gray-400">
                  Please avoid including private details such as
                  addresses, phone numbers, school names, medical
                  records, or other information that could identify
                  you or someone else.
                </p>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="group flex w-full items-center justify-center gap-3 rounded-full border border-pink-200 bg-gradient-to-r from-pink-700 via-pink-500 to-fuchsia-600 px-6 py-4 font-serif text-lg font-bold uppercase tracking-[0.16em] text-white shadow-[0_0_28px_rgba(236,72,153,0.35)] transition hover:-translate-y-1 hover:shadow-[0_0_42px_rgba(236,72,153,0.58)] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                <span>
                  {isSubmitting
                    ? "Sharing Your Story..."
                    : "Share My Story"}
                </span>

                <span className="text-2xl transition group-hover:translate-x-1">
                  {selectedCategory.emoji}
                </span>
              </button>
            </form>

            <section className="mt-12 rounded-[2rem] border border-pink-300/30 bg-[#f5e8df] p-7 text-zinc-900 shadow-inner sm:p-9">
              <div className="mb-6 text-center">
                <div className="text-5xl">
                  {selectedCategory.emoji}
                </div>

                <p className="mt-4 text-sm italic text-zinc-600">
                  {today}
                </p>
              </div>

              <p className="text-center text-xs font-bold uppercase tracking-[0.2em] text-pink-700">
                {selectedCategory.title}
              </p>

              <h2 className="mt-4 text-center font-serif text-3xl">
                {storyTitle || "Your Story Title"}
              </h2>

              <div className="mx-auto my-6 h-px w-32 bg-pink-500/70" />

              {imagePreviewUrl && (
                <div className="mx-auto mb-7 overflow-hidden rounded-2xl border border-pink-900/15">
                  <img
                    src={imagePreviewUrl}
                    alt="Story preview"
                    className="max-h-[460px] w-full object-contain bg-zinc-950"
                  />
                </div>
              )}

              <div className="whitespace-pre-wrap font-serif text-lg leading-8">
                {story ||
                  "Your story will appear here as you write..."}
              </div>

              <div className="mt-10 text-right">
                <p className="font-serif text-xl">
                  ♡ {name || "Your Name"}
                </p>

                <p className="text-sm text-zinc-600">
                  {country || "Your Country"}
                </p>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}