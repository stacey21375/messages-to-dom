const stats = [
  { icon: "♡", number: "1,248", label: "Hearts Shared" },
  { icon: "💌", number: "632", label: "Letters Shared" },
  { icon: "✦", number: "387", label: "Stories Shared" },
  { icon: "◎", number: "52", label: "Countries Represented" },
];

export default function Stats() {
  return (
    <section className="border-y border-pink-500/20 bg-white/[0.02]">
      <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-y divide-pink-500/20 px-6 md:grid-cols-4 md:divide-y-0">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="flex items-center justify-center gap-4 px-4 py-7 text-center"
          >
            <span className="text-3xl text-pink-400">{stat.icon}</span>

            <div>
              <p className="font-serif text-3xl text-pink-400">
                {stat.number}
              </p>

              <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-gray-400">
                {stat.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}