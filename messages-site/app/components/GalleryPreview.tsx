import Link from "next/link";

const galleryItems = [
  {
    title: "Concert Lights",
    image: "/gallery/concert-lights.jpg",
  },
  {
    title: "Pink Heart",
    image: "/gallery/pink-heart.jpg",
  },
  {
    title: "Fan Art",
    image: "/gallery/fan-art.jpg",
  },
  {
    title: "Black Rose",
    image: "/gallery/black-rose.jpg",
  },
  {
    title: "Crowd Moment",
    image: "/gallery/crowd.jpg",
  },
  {
    title: "Portrait",
    image: "/gallery/portrait.jpg",
  },
];

export default function GalleryPreview() {
  return (
    <section className="border-y border-pink-500/20 bg-white/[0.02]">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="mb-10 text-center">
          <p className="text-sm uppercase tracking-[0.3em] text-pink-400">
            Shared by the community
          </p>

          <h2 className="mt-3 font-serif text-3xl sm:text-4xl">
            Gallery Preview
          </h2>

          <div className="mx-auto mt-4 h-px w-32 bg-pink-500/70" />
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
          {galleryItems.map((item) => (
            <article
              key={item.title}
              className="group overflow-hidden border border-white/20 bg-zinc-950"
            >
              <div className="aspect-square bg-gradient-to-br from-pink-950 via-black to-zinc-900">
                <img
                  src={item.image}
                  alt={item.title}
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/gallery"
            className="text-sm uppercase tracking-[0.22em] text-pink-400 transition hover:text-pink-300"
          >
            View full gallery →
          </Link>
        </div>
      </div>
    </section>
  );
}