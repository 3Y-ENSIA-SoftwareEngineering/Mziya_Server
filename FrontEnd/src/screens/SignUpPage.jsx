import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import doorRepair from "../Components/images/door-repair.png";
import { useNavigate } from "react-router-dom"; // Import useNavigate to handle page navigation

export function SignUp() {
  const navigate = useNavigate(); // Initialize useNavigate for page redirection
  const [formData, setFormData] = useState({
    Fname: "",
    Lname: "",
    Gender: "",
    BirthDate: null,
    Id: "",
    email: "",
    PhoneNum: "",
    password: "",
    confirmPassword: "",
  }); 
  // Manage form data using state
  const [errors, setErrors] = useState({}); // Manage form validation errors
  const [isLoading, setIsLoading] = useState(false); // Manage loading state during API request
  const [apiResponse, setApiResponse] = useState(""); // Store API response message

  // Function to validate the form data ()
  const validateForm = () => {
    const newErrors = {};

    if (!formData.Fname.trim()) {
        newErrors.Fname = "First name is required";
    }

    if (!formData.Lname.trim()) {
        newErrors.Lname = "Last name is required";
    }

    if (!formData.email.trim()) {
        newErrors.email = "Valid email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format.";
    }

    if (!formData.PhoneNum.trim()) {
        newErrors.PhoneNum = "Phone number is required";
    } else if (!/^(05|06|07)\d{8}$/.test(formData.PhoneNum)) {
        newErrors.PhoneNum = "Phone number must start with 05, 06, or 07 and have exactly 10 digits";
    }

    if (!formData.password.trim()) {
        newErrors.password = "Password is required";
    } else {
        if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters long";
        }
        if (!/[0-9]/.test(formData.password)) {
            newErrors.password = "Password must contain a number";
        }
        if (!/[a-z]/.test(formData.password)) {
            newErrors.password = "Password must contain a lowercase letter";
        }
        if (!/[A-Z]/.test(formData.password)) {
            newErrors.password = "Password must contain an uppercase letter";
        }
        if (!/[!@#$%^&*(),.?"':;{}|<>-_]/.test(formData.password)) {
            newErrors.password = "Password must contain a special character";
        }
    }
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match"; // Check if passwords match

    if(formData.confirmPassword.length==0)
      newErrors.confirmPassword ="password confirmation is required"; // Check if password confirmation is empty
    if (!formData.Gender) {
        newErrors.Gender = "Gender is required";
    } else if (!['male', 'female', 'other'].includes(formData.Gender.toLowerCase())) {
        newErrors.Gender = "Gender must be male, female, or other";
    }

    if (!formData.Id.trim()) {
        newErrors.Id = "National ID is required";
    } else if (formData.Id.length < 9 || formData.Id.length > 18) {
        newErrors.Id = "National ID must be between 9 and 18 characters";
    }

    if (!formData.BirthDate) {
        newErrors.BirthDate = "Valid date of birth is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
};
  // Function to send the form data to the backend
  const PostDataToBackend = async () => {
    try {
      setIsLoading(true); // Set loading state to true when the request starts
      setApiResponse(""); // Clear any previous messages
      
      const formattedData = {
        first_name: formData.Fname,
        last_name: formData.Lname,
        date_of_birth: formData.BirthDate instanceof Date 
          ? formData.BirthDate.toISOString().split('T')[0] 
          : "", 
        phone: formData.PhoneNum,
        email: formData.email,
        password: formData.password,
        gender: formData.Gender.toLowerCase(),
        national_id: formData.Id,
      };

      // Send POST request to backend
      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      // Parse the response from the backend
      const data = await response.json();

      if (response.ok) {
        console.log("Registration successful", data); // Log success message
        
        setApiResponse("Redirecting to email verification..."); // Display redirect message
        
        await new Promise(resolve => setTimeout(resolve, 1500)); // Wait for 1.5 seconds before redirecting
        
        // Navigate to the next page (email verification or default)
        navigate(data.redirect || './check_email');
      } else {
        console.error("Registration error:", data); // Log error message
        console.log('apiResponse:', apiResponse);
        setApiResponse(data.message || "error encountered"); // Set error message
      }
    } catch (error) {
      console.error("Network or parsing error:", error); // Log network or parsing errors
      setApiResponse("Failed to connect to the server. Please try again."); // Show error message
    } finally {
      setIsLoading(false); // Ensure loading state is set to false after the request
    }
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    console.log("Form data:", formData); // Log form data for debugging
    if (validateForm()) {
      console.log("Form validation passed. Proceeding with API request...");
      PostDataToBackend(); // If form is valid, send data to backend
    } else {
      console.log("Form validation failed. Errors:", errors); // Log validation errors if any
    }
  };

  // Handle changes in form fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value }); // Update form data state with the new value
  };
  //start of html part 
  return (
    <div>
      <div
        className="container-fluid vh-100 d-flex align-items-center justify-content-center"
        style={{ backgroundColor: "white" }}
      >
        <div className="row w-75 mx-auto d-flex justify-content-center align-items-center">
          {/* Left Side */}
          <div
            className="col-md-6 p-5 bg-white rounded shadow"
            style={{ height: "655px ", overflow: "auto" }}
          >
            <h2 className="text-center mb-4">Welcome to Mzya.dari</h2>
            <p className="text-center">Please fill this to create an account</p>
            <form onSubmit={handleSubmit} data-testid="sign-up-form">
            {/* Row 1: First Name & Last Name */}
              <div className="mb-3 row">
                {/* First Name Input */}
                <div className="col-md-6">
                  <input
                    data-testid="first-name"
                    type="text"
                    name="Fname"
                    value={formData.Fname}
                    onChange={handleChange}
                    placeholder="First Name"
                    className={`form-control ${errors.Fname ? "is-invalid" : ""}`}
                  />
                  {errors.Fname && <div className="invalid-feedback" data-testid="error-first-name" >{errors.Fname}</div>}
                </div>

                {/* Last Name Input */}
                <div className="col-md-6">
                  <input
                    data-testid="last-name"
                    type="text"
                    name="Lname"
                    value={formData.Lname}
                    onChange={handleChange}
                    placeholder="Last Name"
                    className={`form-control ${errors.Lname ? "is-invalid" : ""}`}
                  />
                  {errors.Lname && <div className="invalid-feedback" data-testid="error-last-name">{errors.Lname}</div>}
                </div>
              </div>

            {/* Gender */}
              <div className="mb-3">
                  <div className="d-flex justify-content-start align-items-center gap-4">
                    <h6 className="mb-0">Gender</h6>
                    <Form.Check
                      type="radio"
                      label="Female"
                      name="Gender"
                      data-testid="female-radio"
                      id="female-radio"
                      value="Female"
                      onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
                      required
                    />
                    <Form.Check
                      type="radio"
                      label="Male"
                      name="Gender"
                      value="Male"
                      id="male-radio" 
                      data-testid="male-radio"
                      onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
                      required
                    />
                  </div>
                  {errors.Gender && <div className="invalid-feedback">{errors.Gender}</div>}
              </div>

            {/* BirthDate */}
              <div className="mb-3">
                <div
                  data-testid="birthdate-picker"
                  className={`form-control d-flex align-items-center ${errors.BirthDate ? "is-invalid" : ""}`}
                  style={{ width: '100%', minWidth: '300px' }}
                >
                  <DatePicker
                    
                    selected={formData.BirthDate}
                    onChange={(date) => setFormData({ ...formData, BirthDate: date })}
                    placeholderText="Select your birthdate y/m/d"
                    dateFormat="yyyy/MM/dd"
                    maxDate={new Date("2006-12-31")}
                    showYearDropdown
                    scrollableYearDropdown
                    yearDropdownItemNumber={100}
                    className="flex-grow-1 border-0 "
                  />
                </div>
                {errors.BirthDate && <div className="invalid-feedback">{errors.BirthDate}</div>}
              </div>

            {/* ID */}
              <div className="mb-3">
                <input
                data-testid="idd"
                  type="text"
                  name="Id"
                  value={formData.Id}
                  onChange={handleChange}
                  placeholder="Id"
                  className={`form-control ${errors.Id ? "is-invalid" : ""}`}
                />
                {errors.Id && <div className="invalid-feedback" data-testid="error-idd">{errors.Id}</div>}
              </div>

            {/* Email */}
              <div className="mb-3">
              <input
                data-testid="email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`form-control ${errors.email || apiResponse ? "is-invalid" : ""}`} // Apply red border if error exists
              />
              
              {/* Display the specific field error if validation error */}
              {errors.email && (
                <div className="invalid-feedback" data-testid="error-email">
                  {errors.email}
                </div>
              )}

              
              </div>

            {/* Phone */}
              <div className="mb-3">
                <input
                  data-testid="phone"
                  type="text"
                  name="PhoneNum"
                  value={formData.PhoneNum}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={`form-control ${errors.PhoneNum ? "is-invalid" : ""}`}
                />
                {errors.PhoneNum && <div className="invalid-feedback" data-testid="error-phone">{errors.PhoneNum}</div>}
              </div>

            {/* Password */}
              <div className="mb-3">
                <input
                  data-testid="password"
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={`form-control ${errors.password || apiResponse ? "is-invalid" : ""}`}
                />
                {/* show errors handeling from the frontEnd  */}
                {errors.password && <div className="invalid-feedback" data-testid="error-password">{errors.password}</div>}

              
              </div>

            {/* Confirm Password */}
              <div className="mb-3">
                <input
                  data-testid="confirm-password"
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                />
                {errors.confirmPassword && <div className="invalid-feedback" data-testid="error-confirm">{errors.confirmPassword}</div>}
              </div>

            {/* Submit Button */}
              <div className="mb-3">
                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isLoading}
                  data-testid="submit-button"
                >
                  {isLoading ? "Loading..." : "Sign Up"}
                </button>
              </div>
            {/* Display backend error if apiResponse exists */}
              {apiResponse && (
                <div className="alert alert-danger mt-3" data-testid="error-api-response">
                  {apiResponse} {/* Show backend error message */}
                </div>
              )}

            {/* Already have an account link */}
              <div className="text-center">
                <span>Already have an account?</span>
                <Link to="/login">Log In</Link>
              </div>
            </form>

          </div>

          {/* Right Side */}
          <div
            className="col-md-6 d-none d-md-flex justify-content-center"
            style={{ height: "700px" }}
          >
            <img
              src={doorRepair}
              alt="door-repair"
              style={{ maxWidth: "100%", maxHeight: "100%" }}
            />
          </div>

        </div>
      </div>
    </div>
  );
}