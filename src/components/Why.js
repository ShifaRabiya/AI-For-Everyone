import React, { useEffect, useRef, useState } from "react";
import SpotlightCard from "./Spotlight";
import "./Why.css";

export default function WhyKerala() {
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  const [titleVisible, setTitleVisible] = useState(false);
  const [cardsVisible, setCardsVisible] = useState([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = cardsRef.current.findIndex((c) => c === entry.target);

          if (entry.isIntersecting) {
            if (entry.target === titleRef.current) setTitleVisible(true);
            if (idx !== -1) {
              setCardsVisible((prev) => {
                const updated = [...prev];
                updated[idx] = true;
                return updated;
              });
            }
          } else {
            // Reset visibility when scrolled out
            if (entry.target === titleRef.current) setTitleVisible(false);
            if (idx !== -1) {
              setCardsVisible((prev) => {
                const updated = [...prev];
                updated[idx] = false;
                return updated;
              });
            }
          }
        });
      },
      { threshold: 0.3 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      cardsRef.current.forEach((card) => {
        if (card) observer.unobserve(card);
      });
    };
  }, []);

  return (
    <section className="whykerala-section">
      <h2
        ref={titleRef}
        className={`whykerala-title ${titleVisible ? "visible" : ""}`}
      >
        Why Kerala Needs AI Literacy
      </h2>

      <div className="whykerala-grid">
        {[
          {
            h3: "Equitable AI Education",
            p: "Kerala has the opportunity to create a world-class model where every citizen — not just tech workers — gains AI literacy.",
          },
          {
            h3: "Creators, Not Just Consumers",
            p: "AI shouldn’t be something we just use — it's something we build. Students and communities can become AI makers, not passive users.",
          },
          {
            h3: "AI as a Public Good",
            p: "AI tools must work for all: multilingual, open, accessible, and rooted in Kerala’s culture and real-world needs.",
          },
        ].map((item, idx) => (
          <SpotlightCard
            key={idx}
            className={`whykerala-card ${cardsVisible[idx] ? "visible" : ""}`}
          >
            <div ref={(el) => (cardsRef.current[idx] = el)}>
              <h3>{item.h3}</h3>
              <p>{item.p}</p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
}
