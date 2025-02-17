import React, { useState, useEffect } from "react";
import "./../CSSFiles/Login.css";
import { Link, useNavigate, useLocation } from "react-router-dom";
import doorRepair from "./../Components/images/door-repair.png";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState(null);
  const [verificationMessage, setVerificationMessage] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Parse query parameters
    const queryParams = new URLSearchParams(location.search);
    const verified = queryParams.get("verified");
    const reason = queryParams.get("reason");

    if (verified === "true") {
      setVerificationMessage(
        "Your email has been successfully verified. Please log in."
      );
    } else if (reason === "expired") {
      setVerificationMessage(
        "Your verification link has expired. Please request a new one."
      );
    } else if (reason === "error") {
      setVerificationMessage(
        "There was an error verifying your email. Please try again."
      );
    }
  }, [location.search]);

  const validate = () => {
    let tempErrors = {};
    if (!formData.email) {
      tempErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Email is invalid.";
    }
    if (!formData.password) {
      tempErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters.";
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);
    setServerError(null);

    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Login failed. Please check your credentials.");
      }

      const data = await response.json();
      console.log("Login successful:", data);
      console.log("data: ", data);
      console.log("token: ", data.token);

      // // Save the token to sessionStorage or handle it as needed
      // localStorage.setItem("authToken", data.token);
      // Save the token to sessionStorage
      sessionStorage.setItem("authToken", data.token);

      // Navigate to the dashboard or another page
      navigate("/dashboard");
    } catch (error) {
      setServerError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="login-page">
        <img
          src={doorRepair}
          alt="Illustration"
          className="login-image"
          style={{ width: "25vw", height: "90vh", marginRight: "15vw" }}
        />
        <div className="login-container">
          <h2>Hi Again!</h2>

          {/* Display verification message */}
          {verificationMessage && (
            <p className="success">{verificationMessage}</p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
              />
              {errors.password && <p className="error">{errors.password}</p>}
            </div>
            {serverError && <p className="error">{serverError}</p>}
            <div className="actions">
              
            </div>
            <button type="submit" className="login-button" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Next"}
            </button>
            <div className="signup">
              <p>
                I don't have an account.{" "}
                <Link className="nav-link text-blue" to="/signup">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { Login };
