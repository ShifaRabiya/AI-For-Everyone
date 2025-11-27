import { useState, useEffect } from 'react';
import './Help.css';

const helpData = [
  {
    title: "Host Learning Programs",
    content: "Organize AI workshops, hackathons, and study jams in your school, college, or community.",
  },
  {
    title: "Mentor or Volunteer",
    content: "Guide students, assist in activities, or provide mentorship for AI projects.",
  },
  {
    title: "Sponsor Kits",
    content: "Provide hardware, AI kits, or learning materials for programs.",
  },
  {
    title: "Add Livelihood Challenges",
    content: "Contribute real-world challenges to the repository for learners to work on.",
  },
  {
    title: "Invite Your Community",
    content: "Encourage participation by inviting your local network to engage with AI learning.",
  },
];

const HowYouCanHelp = () => {
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile view
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const toggleAccordion = index => {
    if (isMobile) {
      setActiveIndex(prev => (prev === index ? null : index));
    }
  };

  return (
    <section className="help-section">
      <h2 className="help-title">How You Can Help</h2>
      <div className="help-accordion">
        {helpData.map((item, idx) => (
          <div 
            key={idx} 
            className={`help-item ${activeIndex === idx ? 'active' : ''}`}
          >
            <div 
              className="help-header"
              onClick={() => toggleAccordion(idx)}
            >
              <div className="help-icon">✔️</div>
              <div className="help-text">{item.title}</div>
              {isMobile && <div className="help-toggle">{activeIndex === idx ? "−" : "+"}</div>}
            </div>
            <div className="help-content">
              <p>{item.content}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowYouCanHelp;
