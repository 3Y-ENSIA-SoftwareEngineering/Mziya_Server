import React, { useState } from "react";
import "./../CSSFiles/ContactUs.css";

function Modal({ message, type, onClose }) {
  return (
    <div className="modal-overlay">
      <div className={`modal ${type}`}>
        <p>{message}</p>
        <button onClick={onClose} className="modal-close-button">
          Close
        </button>
      </div>
    </div>
  );
}

export function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    surname: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalInfo, setModalInfo] = useState({
    show: false,
    message: "",
    type: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      surname: "",
      email: "",
      message: "",
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    fetch("http://localhost:5000/send-message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((response) => response.json())
      .then(() => {
        setModalInfo({
          show: true,
          message: "Message sent successfully!",
          type: "success",
        });
        resetForm();
      })
      .catch(() => {
        setModalInfo({
          show: true,
          message: "Failed to send message. Please try again.",
          type: "error",
        });
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  return (
    <div className="contact-us-wrapper">
      <div className="contact-us-info">
        <h2>Contact Us</h2>
        <p>
          Mziya Team is here to answer your inquiries, fill out the form and let
          us know your thoughts!
        </p>
      </div>
      <div className="contact-us-form">
        <form onSubmit={handleSubmit}>
          <div className="input-row">
            <input
              type="text"
              name="name"
              placeholder="Name"
              className="form-input half-input"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="surname"
              placeholder="Surname"
              className="form-input half-input"
              value={formData.surname}
              onChange={handleChange}
              required
            />
          </div>
          <input
            type="email"
            name="email"
            placeholder="Email"
            className="form-input full-input"
            value={formData.email}
            onChange={handleChange}
            required
          />
          <textarea
            name="message"
            placeholder="Your message"
            className="form-textarea"
            value={formData.message}
            onChange={handleChange}
            required
          ></textarea>
          <button
            type="submit"
            className="submit-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Sending..." : "Submit"}
          </button>
        </form>
      </div>
      {modalInfo.show && (
        <Modal
          message={modalInfo.message}
          type={modalInfo.type}
          onClose={() => setModalInfo({ show: false, message: "", type: "" })}
        />
      )}
    </div>
  );
}
