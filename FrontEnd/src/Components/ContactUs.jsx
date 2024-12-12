import React, { useState } from "react";
import { Navbar } from "./NavBar";

function Modal({ message, type, onClose }) {
  return (
    <div
      className="position-fixed top-0 start-0 w-100 h-100 bg-black bg-opacity-50 d-flex justify-content-center align-items-center"
      style={{ zIndex: 1000 }}
    >
      <div
        className={`bg-white rounded-3 p-4 text-center shadow ${
          type === "success" ? "border border-primary" : "border border-danger"
        }`}
        style={{
          maxWidth: "400px",
          width: "90%",
          animation: "fadeIn 0.3s ease",
        }}
      >
        <p className="mb-3 text-dark">{message}</p>
        <button
          onClick={onClose}
          className="btn text-white"
          style={{
            backgroundColor: "rgba(21, 178, 245, 1)",
            ":hover": { backgroundColor: "rgba(20, 34, 87, 1)" },
          }}
        >
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
    <div>
      <Navbar />
      <div
        className="container-fluid vh-100 d-flex align-items-center"
        style={{ backgroundColor: "#ffffff" }}
      >
        <div className="row w-100 align-items-center">
          <div className="col-md-6 ps-5">
            <h2
              className="mb-2"
              style={{
                color: "rgba(21, 178, 245, 1)",
                fontSize: "2rem",
                marginRight: "11vw",
              }}
            >
              Contact Us
            </h2>
            <p
              className="text-dark"
              style={{
                lineHeight: 1.8,
                marginLeft: "11vw",
                fontWeight: "bold",
                color: "rgba(36, 32, 128, 1)",
              }}
            >
              Mziya Team is here to answer your inquiries,
              <br />
              fill out the form and let us
              <br /> know your thoughts!
            </p>
          </div>
          <div className="col-md-6 d-flex justify-content-center">
            <form onSubmit={handleSubmit} className="w-75">
              <div className="row mb-3">
                <div className="col-6">
                  <input
                    type="text"
                    name="name"
                    placeholder="Name"
                    className="form-control rounded-pill"
                    style={{
                      borderColor: "rgba(21, 178, 245, 1)",
                      boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="col-6">
                  <input
                    type="text"
                    name="surname"
                    placeholder="Surname"
                    className="form-control rounded-pill"
                    style={{
                      borderColor: "rgba(21, 178, 245, 1)",
                      boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.1)",
                    }}
                    value={formData.surname}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div className="mb-3">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="form-control rounded-pill"
                  style={{
                    borderColor: "rgba(21, 178, 245, 1)",
                    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.1)",
                  }}
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-4">
                <textarea
                  name="message"
                  placeholder="Your message"
                  className="form-control rounded-3"
                  style={{
                    height: "20vh",
                    borderColor: "rgba(21, 178, 245, 1)",
                    boxShadow: "0px 6px 8px rgba(0, 0, 0, 0.1)",
                    resize: "none",
                    marginTop: "2vh", // Adjust the top margin as needed
                    borderRadius: "12px", // Adjust the border-radius to your preference
                  }}
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button
                type="submit"
                className="btn w-100 text-white rounded-pill"
                disabled={isSubmitting}
                style={{
                  backgroundColor: "rgba(20, 34, 87, 1)",
                  padding: "12px",
                  transition: "all 0.3s ease",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                }}
              >
                {isSubmitting ? "Sending..." : "Submit"}
              </button>
            </form>
          </div>
        </div>
        {modalInfo.show && (
          <Modal
            message={modalInfo.message}
            type={modalInfo.type}
            onClose={() => setModalInfo({ show: false, message: "", type: "" })}
          />
        )}
      </div>
    </div>
  );
}
