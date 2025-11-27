import React from "react";
import "./Modal.css"

function PartnerModal(props) {
  if (!props.isOpen) return null;

  const handleSubmit = function(e) {
    e.preventDefault();
    alert("Form submitted! We'll get back to you soon.");
    props.onClose();
  };

  const stopPropagation = function(e) {
    e.stopPropagation();
  };

  return React.createElement(
    "div",
    { className: "modal-overlay", onClick: props.onClose },
    React.createElement(
      "div",
      { className: "modal-content", onClick: stopPropagation },
      React.createElement(
        "button",
        { className: "modal-close-btn", onClick: props.onClose },
        "✕"
      ),
      React.createElement("h3", null, "Partner With Us"),
      React.createElement(
        "p",
        null,
        "Fill out the form below and we'll get back to you!"
      ),
      React.createElement(
        "form",
        { className: "partner-form", onSubmit: handleSubmit },
        React.createElement("input", { type: "text", placeholder: "Your Name", required: true }),
        React.createElement("input", { type: "email", placeholder: "Email Address", required: true }),
        React.createElement("textarea", { placeholder: "Message", rows: 4 }),
        React.createElement(
          "button",
          { type: "submit", className: "partner-metal-btn" },
          "Submit"
        )
      )
    )
  );
}

export default PartnerModal;
