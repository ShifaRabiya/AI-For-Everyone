import { useState, useRef, useEffect } from 'react';
import './Programs.css';

const programCards = [
  {
    audience: 'KuttyMakers (Ages 10–17)',
    goal: 'Curiosity & foundational AI concepts',
    why: 'Kids are already using AI → need guided learning',
    how: ['Pattern recognition games', 'Teachable Machine', 'Scratch']
  },
  {
    audience: 'Young Makers (College + Early Professionals)',
    goal: 'Problem-solving, fairness, build AI applications',
    why: 'Students must become innovators',
    how: ['Study jams', 'Hackathons', 'Making Kerala-specific datasets']
  },
  {
    audience: 'Friends of the Movement (Educators, Parents, Elders)',
    goal: 'Understand AI impact + misinformation',
    why: 'Crucial for societal adoption & community awareness',
    how: ['Learning circles', 'Discussions', 'Demos', 'Cross-professional sessions']
  }
];

const ProgramsSection = () => {
  const [flippedIndex, setFlippedIndex] = useState(null);
  const titleRef = useRef(null);
  const cardRefs = useRef([]);

  const handleFlip = (idx) => setFlippedIndex(prev => (prev === idx ? null : idx));

  // Title animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          titleRef.current.classList.add('show');
        }
      },
      { threshold: 0.3 }
    );

    if (titleRef.current) observer.observe(titleRef.current);
    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
    };
  }, []);

  // Cards scroll animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
            observer.unobserve(entry.target); // stop observing once animated
          }
        });
      },
      { threshold: 0.2 }
    );

    cardRefs.current.forEach(card => {
      if (card) observer.observe(card.querySelector('.flip-card-inner'));
    });

    return () => {
      cardRefs.current.forEach(card => {
        if (card) observer.unobserve(card.querySelector('.flip-card-inner'));
      });
    };
  }, []);

  return (
    <section className="programs-section" id="programs">
      <h2 ref={titleRef} className="section-title">Who We Serve</h2>

      <div className="programs-grid">
        {programCards.map((card, idx) => (
          <div
            key={idx}
            ref={el => cardRefs.current[idx] = el}
            className="flip-card"
            onClick={() => handleFlip(idx)}
          >
            <div
              className={`flip-card-inner ${flippedIndex === idx ? 'flipped' : ''} animate-in`}
            >
              <div className="flip-card-front">
                <h3 className="audience">{card.audience}</h3>
                <p className="goal"><strong>Goal:</strong> {card.goal}</p>
              </div>
              <div className="flip-card-back">
                <p className="why"><strong>Why:</strong> {card.why}</p>
                <ul className="how">
                  {card.how.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default ProgramsSection;
