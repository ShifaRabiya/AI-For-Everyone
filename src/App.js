import React from "react";
import Hero from "./components/Hero";
import About from "./components/About";
import WhyKerala from "./components/Why";
import ChallengeSection from "./components/Challenge";
import OurApproach from "./components/Approach";
import ProgramsSection from "./components/Programs";
import PartnerWithUs from "./components/Partner";
import HowYouCanHelp from "./components/Help";
import Footer from "./components/Footer";

function App() {
  return (
    <>
      <Hero />
      <About />
      <WhyKerala />
      <ChallengeSection />
      <OurApproach />
      <ProgramsSection />
      <PartnerWithUs />
      <HowYouCanHelp />
      <Footer />
    </>
  );
}

export default App;
