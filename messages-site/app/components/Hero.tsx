import Image from "next/image";

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden border-b border-pink-500/20">
      <div className="relative mx-auto aspect-[16/10] w-full max-w-7xl sm:aspect-[16/8]">
        <Image
          src="/messages-to-dom-banner.png"
          alt="Messages to Dom banner decorated with hearts"
          fill
          priority
          className="object-contain object-center sm:object-cover"
          sizes="100vw"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/85" />
      </div>
    </section>
  );
}