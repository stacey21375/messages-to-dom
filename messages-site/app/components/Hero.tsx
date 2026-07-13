import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative border-b border-pink-500/20">
      <div className="relative mx-auto min-h-[420px] max-w-7xl overflow-hidden sm:min-h-[520px]">
        <Image
          src="/messages-to-dom-banner.png"
          alt="Messages to Dom banner decorated with hearts"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/85" />
      </div>
    </section>
  );
}