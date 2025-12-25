import Hero from "../components/layout/Hero";
import Fitur from "../components/sections/Fitur";
import Footer from "../components/layout/Footer";

export default function Page() {
  return (
    <main className="min-h-screen bg-[#060b13]">
      <Hero />
      <Fitur variant="gaming"/>
      <Footer />  
    </main>
  );
}
