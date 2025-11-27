import React, { useEffect, useRef, useState } from 'react';
import { FaGraduationCap, FaRobot, FaExclamationTriangle } from 'react-icons/fa';
import './Challenge.css';

const challenges = [
  { number: 75, title: 'Students graduating without AI readiness', icon: <FaGraduationCap /> },
  { number: 60, title: 'Workforce disruption due to automation', icon: <FaRobot /> },
  { number: 50, title: 'Misinformation, deepfakes, risk for elders', icon: <FaExclamationTriangle /> },
];

const ChallengeSection = () => {
  const cardsRef = useRef([]);
  const titleRef = useRef(null);
  const [counters, setCounters] = useState(challenges.map(() => 0));
  const [cardsVisible, setCardsVisible] = useState(challenges.map(() => false));
  const [titleVisible, setTitleVisible] = useState(false);

  // Scroll animations & counters
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const idx = cardsRef.current.indexOf(entry.target);
          if (idx !== -1) {
            if (entry.isIntersecting) {
              setCardsVisible((prev) => {
                const updated = [...prev];
                updated[idx] = true;
                return updated;
              });
              if (counters[idx] === 0) animateCounter(idx);
            } else {
              // Reset on scroll out for re-animation
              setCardsVisible((prev) => {
                const updated = [...prev];
                updated[idx] = false;
                return updated;
              });
              setCounters((prev) => {
                const updated = [...prev];
                updated[idx] = 0;
                return updated;
              });
            }
          }
        });
      },
      { threshold: 0.5 }
    );

    cardsRef.current.forEach((card) => card && observer.observe(card));

    const titleObserver = new IntersectionObserver(
      ([entry]) => setTitleVisible(entry.isIntersecting),
      { threshold: 0.5 }
    );
    if (titleRef.current) titleObserver.observe(titleRef.current);

    return () => {
      cardsRef.current.forEach((card) => card && observer.unobserve(card));
      if (titleRef.current) titleObserver.unobserve(titleRef.current);
    };
  }, [counters]);

  const animateCounter = (index) => {
    const target = challenges[index].number;
    let count = 0;
    const interval = setInterval(() => {
      count += Math.ceil(target / 50);
      if (count >= target) {
        count = target;
        clearInterval(interval);
      }
      setCounters((prev) => {
        const newCounters = [...prev];
        newCounters[index] = count;
        return newCounters;
      });
    }, 20);
  };

  return (
    <section className="challenge-section" id='challenges'>
      <h2 ref={titleRef} className={`section-title ${titleVisible ? 'visible' : ''}`}>
        Our Challenges
      </h2>

      <div className="challenge-grid">
        {challenges.map((item, idx) => (
          <div
            key={idx}
            className={`challenge-card ${cardsVisible[idx] ? 'visible' : ''}`}
            ref={(el) => (cardsRef.current[idx] = el)}
          >
            <div className="challenge-inner">
              <div className="challenge-icon">{item.icon}</div>
              <div className="challenge-number">{counters[idx]}%</div>
              <div className="challenge-title">{item.title}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ChallengeSection;
