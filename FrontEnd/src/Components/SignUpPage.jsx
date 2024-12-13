import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import doorRepair from "./images/door-repair.png";
import { Navbar } from "./NavBar.jsx";
import { useNavigate } from "react-router-dom"; // Import useNavigate

export function SignUp() {
  const navigate = useNavigate();
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
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState("");

  const validateForm = () => {
    const newErrors = {};
    if (!formData.Fname.trim()) newErrors.Fname = "First Name is required";
    if (!formData.Lname.trim()) newErrors.Lname = "Last Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (
      !/^[a-zA-Z0-9._%+-]+@(gmail\.com|yahoo\.com|outlook\.com|hotmail\.com|icloud\.com|protonmail\.com|([a-zA-Z0-9._%+-]+\.)?edu\.dz|([a-zA-Z0-9._%+-]+\.)?gov\.dz|([a-zA-Z0-9._%+-]+\.)?djaweb\.dz|([a-zA-Z0-9._%+-]+\.)?algeriepost\.dz)$/.test(
        formData.email
      )
    ) {
      newErrors.email = "Invalid email format.";
    }
    if (!formData.password.trim()) newErrors.password = "Password is required";
    else if (formData.password.length < 6)
      newErrors.password = "Password must be at least 6 characters";
    if (formData.confirmPassword !== formData.password)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.Gender) newErrors.Gender = "Gender is required";
    if (!formData.BirthDate) newErrors.BirthDate = "Birth date is required";
    if (!formData.Id.trim()) {
      newErrors.Id = "Id is required";
    } else if (!/^\d{18}$/.test(formData.Id)) {
      newErrors.Id = "Id must be a number with 18 digits";
    }
    if (!formData.PhoneNum.trim()) {
      newErrors.PhoneNum = "Phone number is required";
    } else if (!/^(06|07|05)\d{8}$/.test(formData.PhoneNum)) {
      newErrors.PhoneNum =
        "Only algerian phone numbers are accepted , please enter a valid algerian number ";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const PostDataToBackend = async () => {
    try {
      // Set loading to true when starting the request
      setIsLoading(true);
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

      const response = await fetch("http://localhost:3000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formattedData),
      });

      // Parse the response JSON
      const data = await response.json();

      // Check if the response was successful
      if (response.ok) {
        // Successful registration
        console.log("Registration successful", data);
        
        // Set a redirecting message
        setApiResponse("Redirecting to email verification...");
        
        // Small delay to show the redirecting message
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Navigate to the redirect URL or default check_email page
        navigate(data.redirect || './check_email');
      } else {
        // Handle error responses
        console.error("Registration error:", data);
        
        // Set the error message from the backend
        setApiResponse(data.message || "An error occurred during registration");
      }
      
    } catch (error) {
      console.error("Network or parsing error:", error);
      setApiResponse("Failed to connect to the server. Please try again.");
    } finally {
      // Ensure loading is set to false
      setIsLoading(false);
    }
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log("Form validation passed. Proceeding with API request...");
      PostDataToBackend();
    } else {
      console.log("Form validation failed. Errors:", errors);
    }
  };
  
  //! handle submit : if the form is validated then send the data to the backend using the defined function "PostToBackEnd"
  // const handleSubmit = (e)=>{
  //   e.preventDefault();
  //   if (validateForm()){
  //     PostDataToBackend();
  //   }
  // }
  //! used w/out or w/ the backend
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <Navbar />
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
            <form onSubmit={handleSubmit}>
  {/* Row 1: First Name & Last Name */}
  <div className="mb-3 row">
    {/* First Name Input */}
    <div className="col-md-6">
      <input
        type="text"
        name="Fname"
        value={formData.Fname}
        onChange={handleChange}
        placeholder="First Name"
        className={`form-control ${errors.Fname ? "is-invalid" : ""}`}
      />
      {errors.Fname && <div className="invalid-feedback">{errors.Fname}</div>}
    </div>

    {/* Last Name Input */}
    <div className="col-md-6">
      <input
        type="text"
        name="Lname"
        value={formData.Lname}
        onChange={handleChange}
        placeholder="Last Name"
        className={`form-control ${errors.Lname ? "is-invalid" : ""}`}
      />
      {errors.Lname && <div className="invalid-feedback">{errors.Lname}</div>}
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
        value="Female"
        onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
        required
      />
      <Form.Check
        type="radio"
        label="Male"
        name="Gender"
        value="Male"
        onChange={(e) => setFormData({ ...formData, Gender: e.target.value })}
        required
      />
    </div>
    {errors.Gender && <div className="invalid-feedback">{errors.Gender}</div>}
  </div>

  {/* BirthDate */}
  <div className="mb-3">
    <div
      className={`form-control d-flex align-items-center ${errors.BirthDate ? "is-invalid" : ""}`}
    >
      <DatePicker
        selected={formData.BirthDate}
        onChange={(date) => setFormData({ ...formData, BirthDate: date })}
        placeholderText="Select your birth date"
        dateFormat="yyyy/MM/dd"
        maxDate={new Date("2006-12-31")}
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={100}
        className="flex-grow-1 border-0"
      />
    </div>
    {errors.BirthDate && <div className="invalid-feedback">{errors.BirthDate}</div>}
  </div>

  {/* ID */}
  <div className="mb-3">
    <input
      type="text"
      name="Id"
      value={formData.Id}
      onChange={handleChange}
      placeholder="Id"
      className={`form-control ${errors.Id ? "is-invalid" : ""}`}
    />
    {errors.Id && <div className="invalid-feedback">{errors.Id}</div>}
  </div>

  {/* Email */}
  <div className="mb-3">
    <input
      type="email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      placeholder="Email"
      className={`form-control ${errors.email ? "is-invalid" : ""}`}
    />
    {errors.email && <div className="invalid-feedback">{errors.email}</div>}
  </div>

  {/* Phone Number */}
  <div className="mb-3">
    <input
      type="text"
      name="PhoneNum"
      value={formData.PhoneNum}
      onChange={handleChange}
      placeholder="Phone number"
      className={`form-control ${errors.PhoneNum ? "is-invalid" : ""}`}
    />
    {errors.PhoneNum && <div className="invalid-feedback">{errors.PhoneNum}</div>}
  </div>

  {/* Password */}
  <div className="mb-3">
    <input
      type="password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      placeholder="Password"
      className={`form-control ${errors.password ? "is-invalid" : ""}`}
    />
    {errors.password && <div className="invalid-feedback">{errors.password}</div>}
  </div>

  {/* Confirm Password */}
  <div className="mb-3">
    <input
      type="password"
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      placeholder="Confirm Password"
      className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
    />
    {errors.confirmPassword && (
      <div className="invalid-feedback">{errors.confirmPassword}</div>
    )}
  </div>

  {/* Submit Button */}
  <div className="text-center">
    <button
      type="submit"
      className="btn btn-primary w-100"
      disabled={isLoading}
    >
      {isLoading ? "Submitting..." : "Sign up"}
    </button>
  </div>

  {/* API Response/Error Message */}
  {apiResponse && (
    <div
      className={`alert ${
        apiResponse.toLowerCase().includes("redirecting")
          ? "alert-info"
          : apiResponse.toLowerCase().includes("successfully")
          ? "alert-success"
          : "alert-danger"
      } text-center mt-3`}
    >
      {apiResponse}
    </div>
  )}
</form>

            <p className="text-center mt-3">
              <h6>you already have an account?</h6>
              <Link className="nav-link text-blue" to="/login">
                Log in
              </Link>
            </p>
          </div>
               {/* Right Side */}
               <div
            className="col-md-6 d-flex align-items-center justify-content-center bg-yellow"
            style={{ height: "600px", padding: "20px" }}
          >
            <img
              src={doorRepair}
              alt="Sign Up"
              className="img-fluid"
              style={{ width: "80%", height: "100%" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
