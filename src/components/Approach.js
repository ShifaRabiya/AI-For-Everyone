import { useEffect, useRef } from 'react';
import SpotlightCard from './Spotlight';
import { FaBrain, FaHandPaper, FaHeart } from 'react-icons/fa';
import './Approach.css';

const pillars = [
  { title: 'Head', description: 'Understand how AI works', label: 'Knowledge', icon: <FaBrain size={50} color="#b57cff" /> },
  { title: 'Hand', description: 'Build tools & projects', label: 'Practice', icon: <FaHandPaper size={50} color="#b57cff" /> },
  { title: 'Heart', description: 'Share knowledge & mentor others', label: 'Community', icon: <FaHeart size={50} color="#b57cff" /> }
];

const OurApproach = () => {
  const titleRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) titleRef.current.classList.add('show');
          else titleRef.current.classList.remove('show');
        });
      },
      { threshold: 0.3 }
    );
    if (titleRef.current) observer.observe(titleRef.current);

    const cardObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) entry.target.classList.add('show');
          else entry.target.classList.remove('show'); // animate every scroll
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach(card => {
      if (card) cardObserver.observe(card);
    });

    return () => {
      if (titleRef.current) observer.unobserve(titleRef.current);
      cardsRef.current.forEach(card => {
        if (card) cardObserver.unobserve(card);
      });
    };
  }, []);

  return (
    <section className="our-approach-section" id="approach">
      <h2 ref={titleRef} className="section-title">
        True learning engages the head, hand, and heart.
      </h2>

      <div className="cards-grid">
        {pillars.map((pillar, index) => (
          <SpotlightCard
            key={index}
            className="spotlight-card"
            spotlightColor="rgba(255,255,255,0.25)"
            ref={(el) => (cardsRef.current[index] = el)} // attach ref here
          >
            <div className="pillar-card-content">
              <div style={{ marginBottom: '1rem' }}>{pillar.icon}</div>
              <div className="pillar-label">{pillar.label}</div>
              <h3 className="pillar-title">{pillar.title}</h3>
              <p className="pillar-description">{pillar.description}</p>
            </div>
          </SpotlightCard>
        ))}
      </div>
    </section>
  );
};

export default OurApproach;
