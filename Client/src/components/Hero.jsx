import React, { useEffect, useState, useRef } from "react";
import "./Hero.css";

const Hero = () => {
  // --- Typewriter State ---
  const [text, setText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    if (isFinished) return;

    const phrases = ["GeoAudit", "Audit? Got it.", "GeoAudit"];

    const handleTyping = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];

      setText(
        isDeleting
          ? fullText.substring(0, text.length - 1)
          : fullText.substring(0, text.length + 1),
      );

      setTypingSpeed(isDeleting ? 50 : 100);

      if (!isDeleting && text === fullText) {
        if (loopNum === phrases.length - 1) {
          setIsFinished(true);
          return;
        }
        setTimeout(() => setIsDeleting(true), 2000);
      } else if (isDeleting && text === "") {
        setIsDeleting(false);
        setLoopNum(loopNum + 1);
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [text, isDeleting, loopNum, typingSpeed, isFinished]);

  // --- Diagonal Streaks Canvas (UPDATED FOR THEME SUPPORT) ---
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener("resize", setCanvasSize);
    setCanvasSize();

    // 1. Helper to check current theme from the HTML tag
    const getTheme = () =>
      document.documentElement.getAttribute("data-theme") || "light";

    // 2. Dynamic Palette Function
    const getColors = () => {
      const isDark = getTheme() === "dark";
      return isDark
        ? [
            // Dark Mode: Neon Lime & Bright Cornflower Blue
            { r: 209, g: 255, b: 66 },
            { r: 100, g: 149, b: 237 },
          ]
        : [
            // Light Mode: Slate Blue & Neon Lime
            { r: 62, g: 90, b: 112 },
            { r: 209, g: 255, b: 66 },
          ];
    };

    // 3. Initialize streaks with 'colorIndex' (0 or 1) instead of fixed colors
    const streaks = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      length: Math.random() * 200 + 100,
      speed: Math.random() * 1.5 + 0.8,
      colorIndex: Math.floor(Math.random() * 2), // Randomly assign Type 0 or Type 1
      width: Math.random() * 2 + 1,
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 4. Fetch the correct palette for THIS frame
      const currentColors = getColors();

      streaks.forEach((streak) => {
        ctx.beginPath();
        const tailX = streak.x - streak.length;
        const tailY = streak.y - streak.length;

        const gradient = ctx.createLinearGradient(
          tailX,
          tailY,
          streak.x,
          streak.y,
        );

        // 5. Use the color based on the streak's assigned index (0 or 1)
        const { r, g, b } = currentColors[streak.colorIndex];

        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 1)`);
        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, 0)`);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = streak.width;
        ctx.lineCap = "round";

        ctx.moveTo(tailX, tailY);
        ctx.lineTo(streak.x, streak.y);
        ctx.stroke();

        // Movement Logic
        streak.x += streak.speed;
        streak.y += streak.speed;

        // Reset if off screen
        if (
          streak.x - streak.length > canvas.width ||
          streak.y - streak.length > canvas.height
        ) {
          if (Math.random() > 0.5) {
            streak.x = -streak.length;
            streak.y = Math.random() * canvas.height;
          } else {
            streak.x = Math.random() * canvas.width;
            streak.y = -streak.length;
          }
        }
      });

      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", setCanvasSize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <section className="hero-container" id="hero">
      <canvas ref={canvasRef} className="hero-canvas" />

      <div className="hero-content">
        <div className="title-wrapper">
          <h1
            className={`hero-title animate-item delay-1 ${isFinished ? "rainbow-hover" : ""}`}
            data-text={text}
          >
            {text}
            {!isFinished && <span className="cursor">|</span>}
          </h1>
          {/* Brush Stroke Underline */}
          {isFinished && (
            <div className="brush-underline animate-item delay-2"></div>
          )}
        </div>

        <p className="hero-subtitle animate-item delay-2">
          Real-time satellite surveillance for unauthorized development and
          encroachment detection.
        </p>

        <div className="hero-actions animate-item delay-3">
          <a href="#product" className="btn-primary">
            Launch Audit
          </a>
          <a href="#features" className="btn-secondary">
            Learn More
          </a>
        </div>
      </div>
    </section>
  );
};

export default Hero;
