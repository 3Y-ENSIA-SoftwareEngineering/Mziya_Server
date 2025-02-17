import React, { Component } from "react";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Button from "react-bootstrap/Button";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FaMoneyBillWave } from "react-icons/fa"; // Money icon
import { Alert, Spinner } from "react-bootstrap";
import { Navbar } from "./../Components/NavBar";
import { Navigate } from "react-router-dom";
import jwtDecode  from "jwt-decode";

export class PostingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      description: "",
      location: "",
      job_type: "small_task", // Added this
      job_category: "", // Changed from selectedCategories
      budget: "",
      status: "pending",
      availability_type: "",
      start_date: null,
      end_date: null,
      startTime: "",
      endTime: "",
      age_matters: null,
      age_min: "",
      age_max: "",
      required_gender: "",
      additional_details: "",
      //control when to navigate :
      shouldNavigate: false,
      // Validation states
      validationErrors: {},
      validated: false,
      submissionError: null,
      submissionSuccess: false,
      isSubmitting: false,
    };
  }

  // handleNavigation = () => {
  //   this.setState({ shouldNavigate: true });
  // };

  validateForm = () => {
    const {
      description,
      location,
      job_type,
      job_category,
      budget,
      availability_type,
      start_date,
      end_date,
      startTime, // Add this
      endTime,
      age_matters,
      age_min,
      age_max,
      required_gender,
    } = this.state;

    let isValid = true;
    const validationErrors = {};

    // Description validation
    if (!description || description.length < 10 || description.length > 500) {
      validationErrors.description =
        "Description must be between 10 and 500 characters";
      isValid = false;
    }
    // Location validation
    if (!location || location.trim() === "") {
      validationErrors.location = "Location is required";
      isValid = false;
    } else if (/^[0-9\s]*$/.test(location)) {
      validationErrors.location = "Location must not contain numbers only";
      isValid = false;
    }
    // Job type validation
    const validJobTypes = [
      "small_task",
      "large_task",
      "part_time",
      "full_time",
    ];
    if (!validJobTypes.includes(job_type)) {
      validationErrors.job_type = "Invalid job type";
      isValid = false;
    }

    // Job category validation
    if (!job_category) {
      validationErrors.job_category = "Job category is required";
      isValid = false;
    }

    // Budget validation
    if (!budget || isNaN(budget) || parseFloat(budget) <= 0) {
      validationErrors.budget = "Budget must be a positive number";
      isValid = false;
    }

    // Date validation
    if (start_date && end_date && start_date > end_date) {
      validationErrors.date = "End date must be later than start date";
      isValid = false;
    }

    // Age validation
    if (age_matters === true) {
      if (!age_min || isNaN(age_min) || parseInt(age_min) < 18) {
        validationErrors.age = "Minimum age must be at least 18";
        isValid = false;
      }
    }

    return { isValid, validationErrors };
  };

  handleSubmit = async (event) => {
    event.preventDefault();

    // Reset previous submission states
    this.setState({
      submissionError: null,
      submissionSuccess: false,
      isSubmitting: true,
    });

    // get the token from session storage
    const token = sessionStorage.getItem("authToken");
    console.log("authToken: ", token);

    // if there is not token, handle the error
    if (!token) {
      this.setState({
        submissionError: "You must be logged in to submit this form",
        isSubmitting: false,
      });
      return;
    }

    // decode the token to get the user_id (home_owner_id)
    let decodedToken;
    try {
      decodedToken = jwtDecode(token);
    } catch (err) {
      this.setState({
        submissionError: "Invalid token",
        isSubmitting: false,
      });
      return;
    }

    // extract the home_owner_id from the decoded token
    const home_owner_id = decodedToken.user_id;

    // Validate form
    const { isValid, validationErrors } = this.validateForm();

    if (!isValid) {
      this.setState({
        validated: true,
        validationErrors,
        isSubmitting: false,
      });
      return;
    }

    // Prepare data for submission
    const jobData = {
      home_owner_id: home_owner_id,
      description: this.state.description,
      location: this.state.location,
      job_type: this.state.job_type,
      job_category: this.state.job_category,
      budget: parseFloat(this.state.budget),
      status: this.state.status,
      availability_type: this.state.availability_type,
      start_date: this.state.start_date
        ? this.state.start_date.toISOString().split("T")[0]
        : null,
      end_date: this.state.end_date
        ? this.state.end_date.toISOString().split("T")[0]
        : null,
      age_matters: this.state.age_matters,
      age_min: this.state.age_matters ? parseInt(this.state.age_min) : null,
      // age_max: this.state.age_matters ? parseInt(this.state.age_max) : null,
      age_max: null,
      required_gender: this.state.required_gender,
      additional_details: this.state.additional_details,
    };
    console.log(jobData);

    try {
      console.log("Attempting to send job data:", jobData); // Debugging: Log the job data being sent
      // Use proxy setup in package.json for development
      // const token = sessionStorage.getItem("authToken");
      const response = await fetch("http://localhost:3000/api/jobs/addjob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        console.error("Error response received:", errorData); // Debugging: Log the error response
        throw new Error(errorData.message || "Job creation failed");
      }

      const responseData = await response.json();
      console.log("Job created successfully:", responseData); // Debugging: Log the successful response
      // Success handling
      this.setState({
        submissionSuccess: true,
        isSubmitting: false,
        // Optionally reset form or show success message
      });
    } catch (error) {
      console.error("Error during job creation:", error); // Debugging: Log the error
      this.setState({
        submissionError: error.message,
        isSubmitting: false,
        validated: true,
      });
    }
  };

  toggleCategory = (category) => {
    this.setState((prevState) => {
      const { job_category } = prevState;
      if (job_category.includes(category)) {
        return {
          job_category: job_category.filter((cat) => cat !== category),
        };
      } else {
        return { job_category: [...job_category, category] };
      }
    });
  };

  render() {
    const {
      description,
      location,
      job_type,
      job_category,
      budget,
      availability_type,
      start_date,
      end_date,
      startTime,
      endTime,
      age_matters,
      age_min,
      age_max,
      required_gender,
      additional_details,
      validated,
      submissionError,
      submissionSuccess,
      isSubmitting,
      validationErrors,
    } = this.state;

    const categories = [
      "Babysitting",
      "Child Care",
      "Plumbing",
      "Gardening",
      "Painting",
      "Electrical",
      "Cleaning",
      "Private Tutor",
    ];
    if (this.state.shouldNavigate) {
      return <Navigate to="/login" replace />;
    }
    //start of the html part

    return (
      <Container fluid className="mt-0 p-0">
        <Navbar />
        {/* Submission Error Alert */}
        {submissionError && (
          <Alert variant="danger" className="mb-4">
            {submissionError}
          </Alert>
        )}

        {/* Submission Success Alert */}
        {submissionSuccess && (
          <Alert variant="success" className="mb-4">
            Job created successfully!
          </Alert>
        )}

        <Row className="p-4">
          <Col md={6}>
            <h3 className="mb-4" style={{ color: "#52afef" }}>
              Job Information
            </h3>
            <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
              <Form
                noValidate
                validated={validated}
                onSubmit={this.handleSubmit}
              >
                <Form.Group className="mb-3">
                  <InputGroup hasValidation>
                    <InputGroup.Text>📍</InputGroup.Text>
                    <Form.Control
                      data-testid="locationID"
                      type="text"
                      placeholder="Enter location"
                      value={location}
                      onChange={(e) =>
                        this.setState({ location: e.target.value })
                      }
                      required
                      style={{
                        borderColor: "#D9D9D9", // Border color
                        color: "black", // Text color
                        backgroundColor: "white", // Background color
                      }}
                      isInvalid={validationErrors.location}
                    />
                    <Form.Control.Feedback type="invalid">
                      {validationErrors.location}
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Form>

              {/* Duration (Radio Buttons) Row */}
              <Row className="mb-3">
                {/* Duration Radio (Open/Closed) */}
                <Form
                  noValidate
                  validated={validated}
                  onSubmit={this.handleSubmit}
                >
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label>Duration:</Form.Label>
                      <div
                        className="d-flex gap-4 mt-2"
                        data-testid="durationRadio"
                      >
                        <Form.Check
                          data-testid="openRadio"
                          type="radio"
                          label="open"
                          name="availability_type"
                          value="open"
                          onChange={(e) =>
                            this.setState({
                              availability_type: e.target.value,
                              endTime: "",
                              endDate: "", // Reset endTime and endDate when switching to "Open"
                            })
                          }
                          checked={availability_type === "open"} // Ensure the state matches "Open"
                          required
                        />
                        <Form.Check
                          data-testid="closedRadio"
                          type="radio"
                          label="Closed"
                          name="availability_type"
                          value="closed"
                          onChange={(e) =>
                            this.setState({
                              availability_type: e.target.value,
                            })
                          }
                          checked={availability_type === "closed"} // Ensure the state matches "closed"
                          required
                        />
                      </div>
                    </Form.Group>
                  </Col>
                </Form>
              </Row>

              {/* Date and Time Inputs */}
              {availability_type && (
                <Row className="mb-3">
                  {/* Starting Date */}
                  <Col md={6} className="mb-3" data-testid="startDate">
                    <Form.Group>
                      <DatePicker
                        selected={start_date}
                        onChange={(date) => this.setState({ start_date: date })}
                        dateFormat="MM/dd/yyyy"
                        className="form-control"
                        placeholderText="Select a starting date"
                        required
                        style={{
                          backgroundColor: "#D9D9D9", // Change to your desired color
                          borderColor: "#007bff", // Optional: Change the border color
                          color: "black", // Optional: Text color for better readability
                        }}
                      />
                      {validated && !start_date && (
                        <div
                          className="invalid-feedback d-block"
                          data-testid="select-starting-date"
                        >
                          Please select a starting date.
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Starting Time */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Control
                        data-testid="startTime"
                        type="time"
                        value={startTime}
                        onChange={(e) =>
                          this.setState({ startTime: e.target.value })
                        }
                        required
                        // style={{
                        //   borderColor: '#D9D9D9', // Border color
                        //   color: '#000',       // Text color
                        //   backgroundColor: '#D9D9D9', // Background color (optional)
                        // }}
                      />
                      {validated && !startTime && (
                        <div className="invalid-feedback d-block">
                          Please choose a starting time.
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              )}

              {/* Ending Date and Ending Time for Closed */}
              {availability_type === "closed" && (
                <Row className="mb-3">
                  {/* Ending Date */}
                  <Col md={6} data-testid="EndDate">
                    <Form.Group>
                      <DatePicker
                        selected={end_date}
                        onChange={(date) => this.setState({ end_date: date })}
                        dateFormat="MM/dd/yyyy"
                        className="form-control"
                        placeholderText="Select an ending date"
                        required
                        // style={{
                        //   borderColor: '#D9D9D9', // Border color
                        //   color: '#000',       // Text color
                        //   backgroundColor: '#D9D9D9', // Background color (optional)
                        // }}
                      />
                      {validated && !end_date && (
                        <div className="invalid-feedback d-block">
                          Please select an ending date.
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Ending Time */}
                  <Col md={6}>
                    <Form.Group>
                      <Form.Control
                        data-testid="EndTime"
                        type="time"
                        value={endTime}
                        onChange={(e) =>
                          this.setState({ endTime: e.target.value })
                        }
                        required
                        // style={{
                        //   borderColor: '#D9D9D9', // Border color
                        //   color: '#000',       // Text color
                        //   backgroundColor: '#D9D9D9', // Background color (optional)
                        // }}
                      />
                      {validated && !endTime && (
                        <div className="invalid-feedback d-block">
                          Please choose an ending time.
                        </div>
                      )}
                    </Form.Group>
                  </Col>
                </Row>
              )}
              {/**Category selection  */}
              <div className="mb-3">
                <h5 style={{ textAlign: "left" }}>Select Category</h5>
                <Form.Group>
                  <Form.Select
                    data-testid="categorySelect"
                    value={job_category}
                    onChange={(e) =>
                      this.setState({ job_category: e.target.value })
                    }
                    required
                    style={{
                      borderColor: "#D9D9D9", // Border color
                      color: "black", // Text color
                      backgroundColor: "#ffff", // Background color (optional)
                    }}
                  >
                    <option value="">Select a Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category}>
                        {category}
                      </option>
                    ))}
                  </Form.Select>
                  {validated && !job_category && (
                    <div className="invalid-feedback d-block">
                      Please select a category.
                    </div>
                  )}
                </Form.Group>
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Budget</Form.Label>
                <InputGroup>
                  <Form.Control
                    data-testid="Budget"
                    type="number"
                    placeholder="Enter your budget"
                    value={budget}
                    onChange={(e) => this.setState({ budget: e.target.value })}
                    min="0"
                    step="0.01"
                    required
                    style={{
                      borderColor: "#D9D9D9", // Border color
                      color: "black", // Text color
                      backgroundColor: "#00000", // Background color (optional)
                    }}
                  />
                  <InputGroup.Text>
                    <FaMoneyBillWave />
                  </InputGroup.Text>
                </InputGroup>
                <Form.Control.Feedback type="invalid">
                  Enter a valid price (e.g., 100 or 100.50).
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label>Difficulty</Form.Label>
                <Form.Select
                  data-testid="Difficulty"
                  value={job_type}
                  onChange={(e) => this.setState({ job_type: e.target.value })}
                  required
                  style={{
                    borderColor: "#D9D9D9", // Border color
                    color: "black", // Text color
                    backgroundColor: "#00000", // Background color (optional)
                  }}
                >
                  <option value="" disabled>
                    Select difficulty
                  </option>
                  <option value="small_task">small_task</option>
                  <option value="large_task">large_task</option>
                  <option value="part_time">part_time</option>
                  <option value="full_time">full_time</option>
                </Form.Select>
                {validated && !job_type && (
                  <div className="invalid-feedback d-block mt-2">
                    Please select the difficulty level .
                  </div>
                )}
              </Form.Group>
              {/* Modify Job Details input */}
              <Form.Group className="mt-2">
                <Form.Label
                  style={{
                    fontWeight: "bold",
                    textAlign: "left",
                    display: "block",
                  }}
                >
                  Other Details:
                </Form.Label>
                <Form.Control
                  data-testid="otherDetails"
                  type="text"
                  placeholder="Enter any additional specifications or details"
                  value={description}
                  onChange={(e) =>
                    this.setState({ description: e.target.value })
                  }
                  style={{
                    borderColor: "#D9D9D9", // Border color
                    color: "black", // Text color
                    backgroundColor: "#ffff", // Background color (optional)
                  }}
                />
              </Form.Group>
            </Form>
          </Col>

          {/* Worker Information Column */}
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Form.Group className="mb-0">
              {/* Existing worker information form groups */}

              <h3 className="mb-4" style={{ color: "#52afef" }}>
                Worker Information
              </h3>
              {/* Age Selection */}
              <div className="mb-3 d-flex align-items-center gap-3">
                <Form.Label
                  style={{ fontWeight: "bold" }}
                  className="me-3 mt-1"
                >
                  Age:
                </Form.Label>
                <div className="d-flex gap-4">
                  <Form.Check
                    data-testid="ageRequiredRadio"
                    type="radio"
                    label="Required"
                    name="age_matters"
                    value="true" // This is just a value; the state is boolean
                    onChange={(e) => this.setState({ age_matters: true })} // Set as boolean true
                    checked={age_matters === true} // Check if age_matters is true
                    required
                  />
                  <Form.Check
                    data-testid="ageDoesntMatterRadio"
                    type="radio"
                    label="Doesn't matter"
                    name="age_matters"
                    value="false" // This is just a value; the state is boolean
                    onChange={(e) => this.setState({ age_matters: false })} // Set as boolean false
                    checked={age_matters === false} // Check if age_matters is false
                    required
                  />
                </div>

                {/* Show minimum age field if "Required" is selected */}
                {age_matters === true && (
                  <div className="mt-2">
                    <Form.Control
                      data-testid="ageMinInput"
                      type="number"
                      placeholder="Enter minimum age"
                      value={age_min}
                      onChange={(e) =>
                        this.setState({ age_min: e.target.value })
                      }
                      min={18}
                    />
                  </div>
                )}
              </div>

              {/* Validation Feedback */}
              {validated && age_matters === null && (
                <div className="invalid-feedback d-block mt-2">
                  Please select the age preference.
                </div>
              )}

              {/* Gender Selection */}
              <div className="mb-3 , d-flex align-items-center gap-3">
                <Form.Label className="mt-3" style={{ fontWeight: "bold" }}>
                  Gender:
                </Form.Label>
                <div className="d-flex gap-4 mt-2">
                  <Form.Check
                    data-testid="female-radio"
                    type="radio"
                    label="Female"
                    name="required_gender"
                    value="female"
                    onChange={(e) =>
                      this.setState({ required_gender: e.target.value })
                    }
                    checked={required_gender === "female"}
                    required
                  />
                  <Form.Check
                    data-testid="male-radio"
                    type="radio"
                    label="Male"
                    name="required_gender"
                    value="male"
                    onChange={(e) =>
                      this.setState({ required_gender: e.target.value })
                    }
                    checked={required_gender === "male"}
                    required
                  />
                  <Form.Check
                    data-testid="genderDM"
                    type="radio"
                    label="Doesn't matter"
                    name="required_gender"
                    value="any"
                    onChange={(e) =>
                      this.setState({ required_gender: e.target.value })
                    }
                    checked={required_gender === "any"}
                    required
                  />
                </div>
              </div>
              {validated && !required_gender && (
                <div className="invalid-feedback d-block mt-2">
                  Please select a gender.
                </div>
              )}
              {/* Other Requirements Section */}
              <Form.Group className="mt-0">
                <Form.Label
                  style={{
                    fontWeight: "bold",
                    textAlign: "left",
                    display: "block",
                  }}
                >
                  Other Requirements:
                </Form.Label>
                <Form.Control
                  data-testid="req"
                  type="text"
                  placeholder="Enter any additional requirements or specifications"
                  value={additional_details}
                  onChange={(e) =>
                    this.setState({ additional_details: e.target.value })
                  }
                  style={{
                    borderColor: "#D9D9D9", // Border color
                    color: "black", // Text color
                    backgroundColor: "#fffff", // Background color (optional)
                  }}
                />
              </Form.Group>

              {/* Submit Button with Loading State */}
              <div className="mt-4" style={{ textAlign: "center" }}>
                <Button
                  data-testid="submitButton"
                  type="submit"
                  style={{
                    backgroundColor: "#172254", // Custom green color
                    color: "white",
                    border: "none",
                  }}
                  onClick={this.handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Spinner
                        as="span"
                        animation="border"
                        size="sm"
                        role="status"
                        aria-hidden="true"
                        className="me-2"
                      />
                      Submitting...
                    </>
                  ) : (
                    "Submit"
                  )}
                </Button>
              </div>

              {/* Display Specific Validation Errors
              {validated && Object.keys(validationErrors || {}).length > 0 && (
                <div className="mt-3">
                  {Object.entries(validationErrors || {}).map(
                    ([field, error]) => (
                      <div key={field} className="text-danger small">
                        {error}
                      </div>
                    )
                  )}
                </div>
              )} */}
            </Form.Group>
          </Col>
        </Row>
      </Container>
    );
  }
}
