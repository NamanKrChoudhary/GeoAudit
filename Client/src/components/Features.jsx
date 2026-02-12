import React, { useEffect, useRef, useState } from "react";
import TiltCard from "./TiltCard";
import { Satellite, ShieldAlert, History, FileText } from "lucide-react";
import "./Features.css";

const Features = () => {
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

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      className={`features-section ${isVisible ? "is-visible" : ""}`}
      id="features"
      ref={sectionRef}
    >
      <div className="features-container">
        {/* Header */}
        <div className="features-header fade-in-pop delay-0">
          <h2>Capabilities</h2>
          <p>
            Advanced geospatial analysis tools designed for precision and scale.
          </p>
        </div>

        <div className="bento-grid">
          {/* Card 1: Wrapper handles Grid + Animation */}
          <div className="card-large fade-in-pop delay-1">
            {/* TiltCard handles 3D Effect */}
            <TiltCard className="h-full">
              <div className="card-inner">
                <div className="icon-box">
                  <Satellite size={32} style={{ "z-index": 1000 }} />
                </div>
                <h3>Satellite Surveillance</h3>
                <p>
                  Real-time high-resolution imagery ingestion from Sentinel-2
                  and Landsat for continuous monitoring of designated zones.
                </p>
              </div>
            </TiltCard>
          </div>

          {/* Card 2 */}
          <div className="card-tall fade-in-pop delay-2">
            <TiltCard className="h-full">
              <div className="card-inner">
                <div className="icon-box">
                  <History size={32} />
                </div>
                <h3>Temporal Analysis</h3>
                <p>
                  Compare historical data against current scans to identify
                  unauthorized structural changes over time.
                </p>
                <div className="mini-graph"></div>
              </div>
            </TiltCard>
          </div>

          {/* Card 3 */}
          <div className="card-standard fade-in-pop delay-3">
            <TiltCard className="h-full">
              <div className="card-inner">
                <div className="icon-box">
                  <ShieldAlert size={32} />
                </div>
                <h3>Encroachment Alerts</h3>
                <p>Automated flagging of illegal land use with 98% accuracy.</p>
              </div>
            </TiltCard>
          </div>

          {/* Card 4 */}
          <div className="card-standard-2 fade-in-pop delay-4">
            <TiltCard className="h-full">
              <div className="card-inner">
                <div className="icon-box">
                  <FileText size={32} />
                </div>
                <h3>Legal Reporting</h3>
                <p>Generate court-ready PDF audits with geo-tagged evidence.</p>
              </div>
            </TiltCard>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;
