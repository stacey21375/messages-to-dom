import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Welcome from "./components/Welcome";
import Stats from "./components/Stats";
import FeaturedLetters from "./components/FeaturedLetters";
import GalleryPreview from "./components/GalleryPreview";
import Stories from "./components/Stories";
import Footer from "./components/Footer";
import PageDecorations from "./components/PageDecorations";

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-black text-white">
      <PageDecorations />

      <div className="relative z-10">
        <Navbar />
        <Hero />
        <Welcome />
        <Stats />
        <FeaturedLetters />
        <GalleryPreview />
        <Stories />
        <Footer />
      </div>
    </main>
  );
}
