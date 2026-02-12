import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Steps from "../components/Steps";
import Product from "../components/Product";
import Team from "../components/Team";
import Footer from "../components/Footer";

/**
 * Home Component
 * This acts as the main landing page assembly.
 * All sections are stacked here so they appear on the "/" route.
 */
const Home = () => {
  return (
    <main className="home-page-container">
      <Hero />
      <Features />
      <Steps />
      <Product />
      <Team />
      <Footer />
    </main>
  );
};

export default Home;
