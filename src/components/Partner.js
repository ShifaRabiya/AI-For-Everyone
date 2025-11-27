import React, { useState } from "react";
import {
  FaLightbulb,
  FaCoins,
  FaBroadcastTower,
  FaCubes,
  FaUsers,
} from "react-icons/fa";
import "./Partner.css";
import PartnerModal from "./Modal";
const partnerData = [
  {
    title: "Knowledge Partners",
    icon: <FaLightbulb />,
    desc: "Help shape meaningful, future-ready AI learning experiences.",
    bullets: ["Tech companies", "Educators & instructors", "Field mentors"],
  },
  {
    title: "Financial Partners",
    icon: <FaCoins />,
    desc: "Fuel the movement through strategic funding and resource support.",
    bullets: ["Program funding", "Scholarship support", "Resource sponsorship"],
  },
  {
    title: "Media & Outreach Partners",
    icon: <FaBroadcastTower />,
    desc: "Amplify awareness and storytelling for AI literacy in Kerala.",
    bullets: ["News outlets", "Creator community", "Documentaries & podcasts"],
  },
  {
    title: "Resource Partners",
    icon: <FaCubes />,
    desc: "Provide the tools and kits learners need to build with AI.",
    bullets: ["Hardware providers", "Learning kits", "Tech labs & infra"],
  },
  {
    title: "Community Partners",
    icon: <FaUsers />,
    desc: "Connect the movement to real people through local networks.",
    bullets: [
      "Schools & libraries",
      "NGO networks",
      "Kudumbashree units",
      "Local circles",
    ],
  },
];

const PartnerWithUs = () => {
  const [openCard, setOpenCard] = useState(null); // mobile toggle cards
  const [showModal, setShowModal] = useState(false); // modal state

  const toggleCard = (index) => {
    if (window.matchMedia("(hover: hover)").matches) return; // ignore desktop
    setOpenCard(openCard === index ? null : index);
  };

  const openPartnerModal = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const closePartnerModal = () => {
    setShowModal(false);
  };

  return (
    <section className="partner-metal-section" id="partner With Us">
      <div className="partner-metal-header">
        <h2>Partner With Us</h2>
        <p className="partner-metal-sub">
          Join us in making AI learning accessible to every community in Kerala.
        </p>
      </div>

      <div className="partner-metal-grid">
        {partnerData.map((p, index) => (
          <div
            key={index}
            className={`metal-card partner-hover ${
              openCard === index ? "expanded" : ""
            }`}
            onClick={() => toggleCard(index)}
          >
            <div className="metal-shine"></div>
            <div className="metal-noise"></div>

            <div className="big-icon">{p.icon}</div>
            <h3 className="metal-title">{p.title}</h3>
            <p className="metal-desc">{p.desc}</p>

            <ul className={`metal-bullets ${openCard === index ? "show" : ""}`}>
              {p.bullets.map((b, i) => (
                <li key={i}>{b}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="partner-metal-foot">
        <a
          href="#"
          className="partner-metal-btn"
          onClick={openPartnerModal}
        >
          Become a Partner
        </a>
      </div>

      {<PartnerModal isOpen={showModal} onClose={closePartnerModal} />}
    </section>
  );
};

export default PartnerWithUs;
