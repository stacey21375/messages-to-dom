import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Welcome from "./components/Welcome";
import Stats from "./components/Stats";
import WorldHeartMap from "./components/WorldHeartMap";
import FeaturedLetters from "./components/FeaturedLetters";
import FeaturedStories from "./components/FeaturedStories";
import GalleryPreview from "./components/GalleryPreview";
import Stories from "./components/Stories";
import Footer from "./components/Footer";
import PageDecorations from "./components/PageDecorations";
import BirthdayCardPreview from "./components/BirthdayCardPreview";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <PageDecorations />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Welcome />
        <Stats />

        <BirthdayCardPreview />

        <WorldHeartMap />

        <FeaturedLetters />

        <FeaturedStories />

        <GalleryPreview />

        <Footer />
      </div>
    </main>
  );
}