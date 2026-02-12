import React, { useEffect, useRef, useState } from "react";
import "./Steps.css";

const Steps = () => {
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
      { threshold: 0.1 },
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  const stepData = [
    {
      id: "01",
      title: "Data Ingestion",
      desc: "Integrate multi-spectral imagery directly from global orbital constellations. Our pipeline handles geometric correction and atmospheric normalization automatically.",
      specs: [
        "Sentinel-2 & Landsat 8/9 Support",
        "Cloud Masking Algorithms",
        "Automated Coordinate Projection",
      ],
      image:
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "02",
      title: "Neural Auditing",
      desc: "Our proprietary change-detection engine compares temporal snapshots to identify unauthorized structural footprings and vegetation clearing.",
      specs: [
        "98.4% Accuracy Rating",
        "Sub-pixel Change Detection",
        "Temporal Baseline Comparison",
      ],
      image:
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    },
    {
      id: "03",
      title: "Intelligence Output",
      desc: "Export comprehensive geospatial audits formatted for legal proceedings. Every detected encroachment is timestamped and geo-verified.",
      specs: [
        "Court-ready PDF Exports",
        "GeoJSON & CSV Data Access",
        "Immutable Audit Logging",
      ],
      image:
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=800",
    },
  ];

  return (
    <section
      className={`steps-section ${isVisible ? "is-visible" : ""}`}
      id="steps"
      ref={sectionRef}
    >
      <svg
        className="steps-svg-path"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
      >
        <path
          className="path-solid-lime"
          d="M 50 0 C 110 20, 110 40, 50 50 C -10 60, -10 80, 50 100"
          fill="none"
        />
      </svg>

      <div className="steps-container">
        <div className="steps-header fade-in-pop delay-0">
          <h2 className="steps-main-title">Intelligence Workflow</h2>
          <p className="steps-subtitle">
            Systematic geospatial auditing from orbit to evidence.
          </p>
        </div>

        {stepData.map((step, index) => (
          <div
            key={step.id}
            className={`step-card step-${step.id} ${index % 2 !== 0 ? "reverse" : ""} fade-in-pop delay-${index + 1}`}
          >
            <div className="step-content">
              <span className="step-number">{step.id}</span>
              <h3 className="step-title">{step.title}</h3>
              <p className="step-desc">{step.desc}</p>
              <ul className="step-specs">
                {step.specs.map((spec, i) => (
                  <li key={i}>
                    <span className="lime-dot"></span> {spec}
                  </li>
                ))}
              </ul>
            </div>
            <div className="step-visual">
              <div className="step-image-container mini">
                <img src={step.image} alt={step.title} className="step-img" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Steps;
