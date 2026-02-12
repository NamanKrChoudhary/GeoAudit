import React from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import Product from "./components/Product"; //
import Steps from "./components/Steps";
import Team from "./components/Team";
import Footer from "./components/Footer";

function App() {
  return (
    <div className="App">
      <Navbar />
      <Hero />
      <Features />
      <Steps />
      <Product />
      <Team />
      <Footer />
    </div>
  );
}

export default App;
