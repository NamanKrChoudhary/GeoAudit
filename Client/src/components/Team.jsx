import React, { useEffect, useRef, useState } from "react";
import TiltCard from "./TiltCard";
import "./Team.css";

const Team = () => {
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

  const teamMembers = [
    {
      name: "Mohd. Arshad",
      role: "ML Engineer",
      image:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Naman Kr Choudhary",
      role: "Back-end Developer",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Bibhas Nath",
      role: "Front-end Developer",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Shivang Barnwal",
      role: "Full-Stack Developer",
      image:
        "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section
      className={`team-section ${isVisible ? "is-visible" : ""}`}
      id="team"
      ref={sectionRef}
    >
      <div className="team-container">
        <div className="team-header fade-in-pop delay-0">
          <h2 className="team-title">The Core</h2>
          <p className="team-subtitle">
            Architects of the geospatial intelligence engine.
          </p>
        </div>

        <div className="team-grid">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className={`team-item fade-in-pop delay-${index + 1}`}
            >
              <TiltCard className="team-card-wrapper">
                <div className="team-card-inner">
                  <div className="team-image-box">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="team-img"
                    />
                    <div className="team-overlay"></div>
                  </div>

                  <div className="team-info">
                    <h3 className="member-name">{member.name}</h3>
                    <div className="member-role-box">
                      <span className="lime-line"></span>
                      <p className="member-role">{member.role}</p>
                    </div>
                  </div>
                </div>
              </TiltCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
