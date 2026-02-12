import React, { useEffect, useRef, useState } from "react";
import "./Product.css";

const Product = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`product-section ${isVisible ? "is-visible" : ""}`}
      ref={sectionRef}
      id="product"
    >
      <div className="product-container fade-in-pop">
        <h1 className="product-title">Experience the Future of Auditing.</h1>
        <p className="product-desc">
          High-fidelity geospatial intelligence meets neural-link processing.
          Step into the next generation of land management.
        </p>

        <button className="rev-button">
          Get Started
          <span className="line line-top"></span>
          <span className="line line-right"></span>
          <span className="line line-bottom"></span>
          <span className="line line-left"></span>
        </button>
      </div>
    </section>
  );
};

export default Product;
