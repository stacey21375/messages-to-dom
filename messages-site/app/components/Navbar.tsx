import Link from "next/link";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Send a Letter", href: "/send-letter" },
  { label: "Read Letters", href: "/letters" },
  { label: "Stories", href: "/stories" },
  { label: "Gallery", href: "/gallery" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-pink-500/20 bg-black/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-400/60 text-xl shadow-[0_0_18px_rgba(236,72,153,0.35)]">
            💌
          </div>

          <div>
            <p className="font-serif text-sm tracking-[0.2em] text-white">
              MESSAGES
            </p>
            <p className="font-serif text-sm tracking-[0.2em] text-pink-400">
              TO DOM
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-7 lg:flex">
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-xs uppercase tracking-[0.14em] text-gray-300 transition hover:text-pink-400"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <Link
          href="/send-letter"
          aria-label="Send a letter"
          className="flex h-11 w-11 items-center justify-center rounded-full border border-pink-400 text-xl text-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.45)] transition hover:bg-pink-500 hover:text-white"
        >
          ♡
        </Link>
      </div>
    </header>
  );
}

