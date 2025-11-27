import React, { useState, useEffect, useRef } from "react";
import "./Nav.css";

function NavBar() {
  const [active, setActive] = useState("home");
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu when clicking outside the slide menu
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  const handleNavClick = (section) => {
    setActive(section);
    setOpen(false);

    const element = document.getElementById(section);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return React.createElement(
    "nav",
    { className: "navbar" },

    React.createElement(
      "div",
      { className: "nav-container" },

      /* Hamburger button (mobile) */
      React.createElement(
        "button",
        {
          className: "nav-hamburger",
          onClick: () => setOpen(true),
        },
        "☰"
      ),

      /* Desktop Navigation */
      React.createElement(
        "ul",
        { className: "nav-links desktop" },
        ["home", "about", "challenges", "approach", "programs", "partner With Us"].map((item) =>
          React.createElement(
            "li",
            {
              key: item,
              className: active === item ? "active" : "",
              onClick: () => handleNavClick(item),
            },
            item.charAt(0).toUpperCase() + item.slice(1)
          )
        )
      ),

      /* Background overlay */
      open
        ? React.createElement("div", { className: "nav-overlay" })
        : null,

      /* Mobile Slide Menu */
      React.createElement(
        "div",
        {
          className: `nav-menu ${open ? "open" : ""}`,
          ref: menuRef,
        },

        /* Close button */
        React.createElement(
          "button",
          {
            className: "close-btn",
            onClick: () => setOpen(false),
          },
          "×"
        ),

        /* Mobile items */
        React.createElement(
          "ul",
          null,
          ["home",  "about", "challenges", "approach", "programs", "partner With Us"].map((item) =>
            React.createElement(
              "li",
              {
                key: item,
                className: active === item ? "active" : "",
                onClick: () => handleNavClick(item),
              },
              item.charAt(0).toUpperCase() + item.slice(1)
            )
          )
        )
      )
    )
  );
}

export default NavBar;
