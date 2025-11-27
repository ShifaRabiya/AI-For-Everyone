import React, { useState, useEffect } from "react";

const About = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger animation after component mounts
    const timer = setTimeout(() => setVisible(true), 100); // slight delay
    return () => clearTimeout(timer);
  }, []);

  const sectionStyle = {
    padding: "4rem 2rem",
    background: "linear-gradient(135deg, #0f0f14, #1a1a22)",
    color: "#f2f2ff",
    textAlign: "center",
  };

  const contentStyle = {
    maxWidth: "900px",
    margin: "0 auto",
    opacity: visible ? 1 : 0,
    transform: visible ? "translateY(0)" : "translateY(30px)",
    transition: "opacity 0.8s ease-out, transform 0.8s ease-out",
  };

  const titleStyle = {
    fontSize: "2.5rem",
    marginBottom: "1.5rem",
    color: "#b57cff",
  };

  const descStyle = {
    fontSize: "1.1rem",
    lineHeight: "1.8",
    opacity: 0.85,
  };

  return (
    <section style={sectionStyle} id="about">
      <div style={contentStyle}>
        <h2 style={titleStyle}>What is this campaign?</h2>
        <p style={descStyle}>
          The <strong>“AI for Everyone” initiative</strong>, enabled by TinkerHub, is a statewide program aiming to democratize AI knowledge across Kerala. 
          Building on Kerala’s digital literacy legacy, it aims to make communities active creators in the AI era, addressing student skill gaps, workforce changes, and misinformation, 
          while positioning Kerala as a global model for responsible AI.
        </p>
      </div>
    </section>
  );
};

export default About;
