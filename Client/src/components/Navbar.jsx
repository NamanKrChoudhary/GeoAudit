import React, { useState, useEffect } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import GlassSurface from "./GlassSurface";
import "./Navbar.css";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [theme, setTheme] = useState("light");
  const [scrolled, setScrolled] = useState(false);

  const toggleTheme = (e) => {
    const newTheme = theme === "light" ? "dark" : "light";
    if (!document.startViewTransition) {
      setTheme(newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
      return;
    }

    const x = e.nativeEvent.clientX;
    const y = e.nativeEvent.clientY;
    const endRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y),
    );

    const transition = document.startViewTransition(() => {
      setTheme(newTheme);
      document.documentElement.setAttribute("data-theme", newTheme);
    });

    transition.ready.then(() => {
      const clipPath = [
        `circle(0px at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ];

      document.documentElement.animate(
        {
          clipPath: theme === "light" ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 700,
          easing: "ease-in-out",
          pseudoElement:
            theme === "light"
              ? "::view-transition-new(root)"
              : "::view-transition-old(root)",
        },
      );
    });
  };

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { title: "Home", href: "#hero" },
    { title: "Capabilities", href: "#features" },
    { title: "The Process", href: "#steps" },
    { title: "Launch GeoAudit", href: "#product" },
    { title: "The Team", href: "#team" },
  ];

  return (
    <header className={`navbar-wrapper ${scrolled ? "scrolled" : ""}`}>
      <GlassSurface
        width="100%"
        height="100%"
        borderRadius={40}
        borderWidth={0.8}
        opacity={0.35}
        blur={20}
        className="navbar-glass"
      >
        <div className="navbar-content">
          <div className="nav-left">
            <button
              className={`icon-btn menu-trigger ${isMenuOpen ? "active" : ""}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X size={24} strokeWidth={1.5} />
              ) : (
                <Menu size={24} strokeWidth={1.5} />
              )}
            </button>
          </div>

          <div className="nav-center">
            <span className="logo-text">GeoAudit</span>
          </div>

          <div className="nav-right">
            <button className="icon-btn" onClick={(e) => toggleTheme(e)}>
              {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
            </button>
          </div>
        </div>
      </GlassSurface>

      {/* --- SIDE-ALIGNED HEAVY-FROST DROPDOWN --- */}
      <div className={`nav-dropdown-wrapper ${isMenuOpen ? "open" : ""}`}>
        <div className="menu-bubbles-container">
          {navLinks.map((link, index) => (
            <div
              key={index}
              className="nav-bubble-row"
              style={{
                transitionDelay: isMenuOpen ? `${index * 0.05}s` : "0s",
              }}
            >
              <GlassSurface
                borderRadius={40}
                className="bubble-link" // Ensure this class removes internal padding
                blur={35}
                opacity={0.25}
                borderWidth={1.2}
              >
                {/* KEY CHANGE: The <a> tag now wraps the entire inner content 
                   and we use CSS to make it fill the GlassSurface.
                */}
                <a
                  href={link.href}
                  className="full-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.title}
                </a>
              </GlassSurface>
            </div>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
