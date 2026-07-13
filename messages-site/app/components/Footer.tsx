import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-pink-500/20 bg-black">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <h3 className="font-serif text-2xl text-pink-400">
              Messages to Dom
            </h3>

            <p className="mt-4 text-gray-400">
              A place where fans from around the world can share letters,
              stories, photos, and memories celebrating Dom and the community
              he has inspired.
            </p>
          </div>

          <div>
            <h4 className="mb-4 text-sm uppercase tracking-[0.2em] text-pink-400">
              Quick Links
            </h4>

            <ul className="space-y-2 text-gray-400">
              <li><Link href="/">Home</Link></li>
              <li><Link href="/send-letter">Send a Letter</Link></li>
              <li><Link href="/letters">Read Letters</Link></li>
              <li><Link href="/gallery">Gallery</Link></li>
              <li><Link href="/stories">Stories</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 text-sm uppercase tracking-[0.2em] text-pink-400">
              Thank You
            </h4>

            <p className="text-gray-400">
              Built with kindness, respect, and appreciation by fans, for fans.
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-gray-500">
          © {new Date().getFullYear()} Messages to Dom. This is a fan-created
          website and is not affiliated with Dom.
        </div>
      </div>
    </footer>
  );
}