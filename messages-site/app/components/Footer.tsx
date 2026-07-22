import Link from "next/link";

type SocialLink = {
  name: string;
  href: string;
  icon: React.ReactNode;
};

const iconClassName = "h-6 w-6 fill-current";

const socialLinks: SocialLink[] = [
  {
    name: "Instagram",
    href: "https://www.instagram.com/yungblud/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className={iconClassName}
        aria-hidden="true"
      >
        <path d="M7.75 2h8.5A5.76 5.76 0 0 1 22 7.75v8.5A5.76 5.76 0 0 1 16.25 22h-8.5A5.76 5.76 0 0 1 2 16.25v-8.5A5.76 5.76 0 0 1 7.75 2Zm0 2A3.76 3.76 0 0 0 4 7.75v8.5A3.76 3.76 0 0 0 7.75 20h8.5A3.76 3.76 0 0 0 20 16.25v-8.5A3.76 3.76 0 0 0 16.25 4h-8.5Zm8.75 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z" />
      </svg>
    ),
  },
  {
    name: "TikTok",
    href: "https://www.tiktok.com/@yungblud",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className={iconClassName}
        aria-hidden="true"
      >
        <path d="M14.5 2h3.02c.18 1.3.75 2.37 1.72 3.2.78.67 1.7 1.08 2.76 1.23v3.04a8.3 8.3 0 0 1-4.5-1.5v7.1a6.93 6.93 0 1 1-6.93-6.93c.38 0 .75.03 1.1.09v3.1a3.9 3.9 0 1 0 2.83 3.74V2Z" />
      </svg>
    ),
  },
  {
    name: "YouTube",
    href: "https://www.youtube.com/Yungblud",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className={iconClassName}
        aria-hidden="true"
      >
        <path d="M23.5 6.2a3.02 3.02 0 0 0-2.13-2.14C19.5 3.55 12 3.55 12 3.55s-7.5 0-9.37.5A3.02 3.02 0 0 0 .5 6.2C0 8.08 0 12 0 12s0 3.92.5 5.8a3.02 3.02 0 0 0 2.13 2.14c1.87.51 9.37.51 9.37.51s7.5 0 9.37-.5a3.02 3.02 0 0 0 2.13-2.15C24 15.92 24 12 24 12s0-3.92-.5-5.8ZM9.6 15.6V8.4L15.83 12 9.6 15.6Z" />
      </svg>
    ),
  },
  {
    name: "Facebook",
    href: "https://www.facebook.com/yungblud/",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className={iconClassName}
        aria-hidden="true"
      >
        <path d="M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.03 1.8-4.7 4.54-4.7 1.31 0 2.69.24 2.69.24v2.97h-1.52c-1.5 0-1.97.94-1.97 1.9v2.25h3.35l-.54 3.49h-2.81V24C19.61 23.1 24 18.1 24 12.07Z" />
      </svg>
    ),
  },
  {
    name: "X",
    href: "https://x.com/yungblud",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className={iconClassName}
        aria-hidden="true"
      >
        <path d="M18.9 2H22l-6.77 7.74L23.2 22h-6.24l-4.89-6.39L6.48 22H3.36l7.24-8.28L2.96 2h6.4l4.42 5.84L18.9 2Zm-1.1 17.84h1.73L8.42 4.05H6.57L17.8 19.84Z" />
      </svg>
    ),
  },
  {
    name: "Snapchat",
    href: "https://www.snapchat.com/@yungblud",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className={iconClassName}
        aria-hidden="true"
      >
        <path d="M12.02 2c3.18 0 5.33 2.42 5.33 5.86 0 .79-.05 1.45-.12 2.02.31.17.73.32 1.25.32.31 0 .63-.05.94-.15.18-.06.37-.1.54-.1.45 0 .8.29.8.69 0 .39-.27.67-.78.87-.42.17-.89.31-1.36.42-.16.04-.27.17-.29.32-.04.32.34.83 1.13 1.28.47.27.97.48 1.47.69.72.29 1.08.51 1.08.94 0 .56-.75.82-1.9 1.03-.31.06-.52.29-.58.59-.07.34-.18.82-.38 1.15-.24.4-.61.55-1.13.55-.32 0-.69-.06-1.1-.14-.69-.14-1.45-.3-2.25-.17-.66.11-1.06.5-1.5.94-.52.51-1.12 1.1-2.19 1.1-1.08 0-1.68-.59-2.2-1.1-.44-.44-.84-.83-1.5-.94-.8-.13-1.56.03-2.25.17-.41.08-.78.14-1.1.14-.52 0-.89-.15-1.13-.55-.2-.33-.31-.81-.38-1.15-.06-.3-.27-.53-.58-.59C.75 15.98 0 15.72 0 15.16c0-.43.36-.65 1.08-.94.5-.21 1-.42 1.47-.69.79-.45 1.17-.96 1.13-1.28-.02-.15-.13-.28-.29-.32-.47-.11-.94-.25-1.36-.42-.51-.2-.78-.48-.78-.87 0-.4.35-.69.8-.69.17 0 .36.04.54.1.31.1.63.15.94.15.52 0 .94-.15 1.25-.32-.07-.57-.12-1.23-.12-2.02C6.66 4.42 8.82 2 12.02 2Z" />
      </svg>
    ),
  },
];

const supportLinks = [
  {
    name: "Official Website",
    href: "https://www.yungbludofficial.com/",
    icon: "🌐",
  },
  {
    name: "Official Merchandise",
    href: "https://yungbludstore.com/",
    icon: "🛍",
  },
  {
    name: "Tour Dates",
    href: "https://www.yungbludofficial.com/tour/",
    icon: "🎟",
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden border-t border-pink-500/20 bg-black text-white">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-0 h-52 w-[40rem] -translate-x-1/2 rounded-full bg-pink-600/10 blur-[100px]"
      />

      <div className="relative mx-auto max-w-6xl px-5 py-14 sm:px-8 sm:py-16">
        <section className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-pink-400">
            Support the music
          </p>

          <h2 className="mt-4 font-serif text-3xl text-white sm:text-4xl">
            Love what Dom creates?
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-zinc-300 sm:text-base">
            Follow him on social media, pick up some official merchandise,
            and catch him on tour. Supporting the official channels helps keep
            the music alive. 🖤
          </p>
        </section>

        <div className="my-12 h-px bg-gradient-to-r from-transparent via-pink-500/40 to-transparent" />

        <section className="text-center">
          <h3 className="font-serif text-xl uppercase tracking-[0.2em] text-pink-300">
            🖤 Follow Dom
          </h3>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Follow YUNGBLUD on ${social.name}`}
                title={social.name}
                className="group flex h-14 w-14 items-center justify-center rounded-full border border-zinc-700 bg-zinc-950 text-zinc-300 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-pink-400 hover:bg-pink-950/40 hover:text-pink-300 hover:shadow-[0_0_24px_rgba(236,72,153,0.45)] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
              >
                <span className="transition duration-300 group-hover:scale-110">
                  {social.icon}
                </span>

                <span className="sr-only">{social.name}</span>
              </a>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap justify-center gap-x-5 gap-y-2 text-xs text-zinc-500">
            {socialLinks.map((social) => (
              <span key={`${social.name}-label`}>{social.name}</span>
            ))}
          </div>
        </section>

        <div className="my-12 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

        <section className="text-center">
          <h3 className="font-serif text-xl uppercase tracking-[0.2em] text-pink-300">
            <div className="my-12 h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />

<section className="text-center">
  <h3 className="font-serif text-xl uppercase tracking-[0.2em] text-pink-300">
    Join the Community
  </h3>

  <div className="mx-auto mt-7 max-w-sm">
    <a
      href="https://ybhq.com/login"
      target="_blank"
      rel="noopener noreferrer"
      className="group flex min-h-20 items-center justify-center gap-3 rounded-sm border border-zinc-800 bg-zinc-950/80 px-5 py-4 font-serif text-base text-zinc-200 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-pink-400 hover:bg-pink-950/30 hover:text-pink-200 hover:shadow-[0_0_25px_rgba(236,72,153,0.28)]"
    >
      <span className="text-xl">🖤</span>
      <span>YBHQ Community</span>
    </a>
  </div>

  <p className="mt-4 text-sm text-zinc-400">
    Connect with other fans through the official YBHQ community.
  </p>
</section>
            Support Dom
          </h3>

          <div className="mx-auto mt-7 grid max-w-3xl gap-4 sm:grid-cols-3">
            {supportLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex min-h-20 items-center justify-center gap-3 rounded-sm border border-zinc-800 bg-zinc-950/80 px-5 py-4 font-serif text-base text-zinc-200 shadow-lg transition duration-300 hover:-translate-y-1 hover:border-pink-400 hover:bg-pink-950/30 hover:text-pink-200 hover:shadow-[0_0_25px_rgba(236,72,153,0.28)] focus:outline-none focus-visible:ring-2 focus-visible:ring-pink-400"
              >
                <span
                  aria-hidden="true"
                  className="text-xl transition duration-300 group-hover:scale-110"
                >
                  {link.icon}
                </span>

                <span>{link.name}</span>
              </a>
            ))}
          </div>
        </section>

        <div className="my-12 h-px bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        <section className="mx-auto max-w-3xl text-center">
          <p className="font-serif text-lg text-zinc-200">
            Made with <span className="text-pink-400">🖤</span> by fans, for
            Dom.
          </p>

          <p className="mx-auto mt-5 max-w-2xl text-xs leading-6 text-zinc-500 sm:text-sm">
            Messages to Dom is an independent fan project created by fans. It
            is not affiliated with, endorsed by, or connected to YUNGBLUD, his
            management, or his record label.
          </p>

          <p className="mt-6 text-xs uppercase tracking-[0.18em] text-zinc-600">
            © {currentYear} Messages to Dom
          </p>

          <nav
            aria-label="Footer navigation"
            className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-zinc-500"
          >
            <Link
              href="/"
              className="transition hover:text-pink-300 focus:outline-none focus-visible:text-pink-300"
            >
              Home
            </Link>

            <Link
              href="/letters"
              className="transition hover:text-pink-300 focus:outline-none focus-visible:text-pink-300"
            >
              Letters
            </Link>

            <Link
              href="/submit"
              className="transition hover:text-pink-300 focus:outline-none focus-visible:text-pink-300"
            >
              Write a Letter
            </Link>
          </nav>
        </section>
      </div>
    </footer>
  );
}