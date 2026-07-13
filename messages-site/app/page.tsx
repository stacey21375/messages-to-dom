import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Welcome from "./components/Welcome";
import Stats from "./components/Stats";
import FeaturedLetters from "./components/FeaturedLetters";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />
      <Hero />

<Welcome />
<Stats />

<FeaturedLetters />

    </main>
  );
}
