import { useState } from 'react';
import './Footer.css';
import { FaInstagram, FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa';
import Logo from '../assets/logo.png';
import PartnerModal from './Modal';

const Footer = () => {
  const [showModal, setShowModal] = useState(false);

  const openPartnerModal = (e) => {
    e.preventDefault();
    setShowModal(true);
  };

  const closePartnerModal = () => {
    setShowModal(false);
  };

  return (
    <footer className="footer">
      <div className="footer-glow"></div>

      <div className="footer-top">
        <a href="https://tinkerhub.org" target="_blank" rel="noreferrer">
          <img src={Logo} alt="TinkerHub Logo" className="footer-logo" />
        </a>
        <p className="footer-desc">
          TinkerHub is India’s largest student-led community for learning, innovation, and technology. 
          We empower young learners to explore, create, and contribute to impactful projects.
        </p>
      </div>

      <div className="footer-middle">
        <div className="footer-socials">
          <a href="https://instagram.com/tinkerhub" target="_blank" rel="noreferrer">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com/company/tinkerhub" target="_blank" rel="noreferrer">
            <FaLinkedin />
          </a>
          <a href="https://twitter.com/tinkerhub" target="_blank" rel="noreferrer">
            <FaTwitter />
          </a>
          <a href="https://github.com/TinkerHub" target="_blank" rel="noreferrer">
            <FaGithub />
          </a>
        </div>

        <p className="footer-contact">
          Contact: <a href="mailto:hello@tinkerhub.org">hello@tinkerhub.org</a>
        </p>

        {/* Partner button now opens modal */}
        <a
          href="#"
          className="footer-partner-link"
          onClick={openPartnerModal}
        >
          Become a Partner
        </a>
      </div>

      <div className="footer-bottom">
        &copy; {new Date().getFullYear()} TinkerHub. All rights reserved.
      </div>

      {/* Modal */}
      {<PartnerModal isOpen={showModal} onClose={closePartnerModal} />}
    </footer>
  );
};

export default Footer;
