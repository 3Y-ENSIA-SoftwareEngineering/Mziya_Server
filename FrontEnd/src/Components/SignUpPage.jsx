import React, { useState } from "react";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Link } from "react-router-dom";
import doorRepair from "./images/door-repair.png";

export function SignUp() {
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
  //! to store the response message from the backend
  // const [apiRespnse , SetApiRespnse]=useState("");
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
  //! Function to send the form data to the backend using fetch Api
  // const PostDataToBackend = async()=>{
  //   try{
  //     //sends the http request to the url (end point where the data is send to )
  //     const response = await fetch("http://localhost:5000 .....",{
  //       method: "POST",
  //       headers:{
  //         "Content-Type":"application/json", //Tell the backend that we are sending a json file
  //       },
  //       body: JSON.stringify(formData),// convert data to string
  //     });
  //     //convert(parse) the response to a javascript object
  //     const data= await response.json();
  //     // Response handeling
  //     if(response.ok){
  //       SetApiRespnse("sign up successful");
  //     }
  //     else{
  //       SetApiRespnse(data.message || "error occurred");
  //     }

  //   }
  //   //end of try !
  //   catch(error){
  //     // unexpected errors
  //     SetApiRespnse("Failed to connedt to the server");
  //   }
  //   //end of catch
  // };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert("Form submitted successfully!");
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
            {/* 1 Row */}
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
                {errors.Fname && (
                  <div className="invalid-feedback">{errors.Fname}</div>
                )}
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
                {errors.Lname && (
                  <div className="invalid-feedback">{errors.Lname}</div>
                )}
              </div>
            </div>
            {/* Gender */}
            <Row className="mb-3">
              <Col md={12}>
                <Form.Group>
                  <div className="d-flex justify-content-start align-items-center gap-4 mt-2">
                    <h6 className="mb-0">Gender</h6>
                    <Form.Check
                      type="radio"
                      label="Female"
                      name="Gender"
                      value="Female"
                      onChange={(e) =>
                        setFormData({ ...formData, Gender: e.target.value })
                      }
                      required
                    />

                    <Form.Check
                      type="radio"
                      label="Male"
                      name="Gender"
                      value="Male"
                      onChange={(e) =>
                        setFormData({ ...formData, Gender: e.target.value })
                      }
                      required
                    />
                  </div>
                </Form.Group>
              </Col>
              {errors.Gender && (
                <div className="invalid-feedback">{errors.Gender}</div>
              )}
            </Row>
            {/* BirthDate */}
            <div className="mb-3">
              <div
                className={`form-control d-flex align-items-center ${
                  errors.BirthDate ? "is-invalid" : ""
                }`}
              >
                <DatePicker
                  selected={formData.BirthDate}
                  onChange={(date) =>
                    setFormData({ ...formData, BirthDate: date })
                  }
                  placeholderText="Select your birth date"
                  dateFormat="yyyy/MM/dd"
                  maxDate={new Date("2006-12-31")}
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  className="flex-grow-1 border-0"
                />
              </div>
              {errors.BirthDate && (
                <div className="invalid-feedback">{errors.BirthDate}</div>
              )}
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
            {/* Email Input */}
            <div className="mb-3">
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
              />
              {errors.email && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>
            {/* Phone number  */}
            <div className="mb-3">
              <input
                type="text"
                name="PhoneNum"
                value={formData.PhoneNum}
                onChange={handleChange}
                placeholder="Phone number"
                className={`form-control ${
                  errors.PhoneNum ? "is-invalid" : ""
                }`}
              />
              {errors.PhoneNum && (
                <div className="invalid-feedback">{errors.PhoneNum}</div>
              )}
            </div>
            {/* Password Input */}
            <div className="mb-3">
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
              />
              {errors.password && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>
            {/* Confirm Password Input */}
            <div className="mb-3">
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className={`form-control ${
                  errors.confirmPassword ? "is-invalid" : ""
                }`}
              />
              {errors.confirmPassword && (
                <div className="invalid-feedback">{errors.confirmPassword}</div>
              )}
            </div>
            {/* Submit Button */}
            <div className="text-center">
              <button type="submit" className="btn btn-primary w-100">
                Sign up
              </button>
            </div>

            {/* {apiResponse && <p className="text-center mt-3">{apiResponse}</p>} */}
          </form>

          <p className="text-center mt-3">
            <h6>you already have an account?</h6>
            <Link className="nav-link text-dark" to="/login">
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
  );
}
