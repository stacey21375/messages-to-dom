import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import BirthdayCardExperience from "../components/BirthdayCardExperience";

export default function BirthdayPage() {
  return (
    <main className="min-h-screen bg-black text-white">
      <Navbar />

      <BirthdayCardExperience />

      <Footer />
    </main>
  );
}