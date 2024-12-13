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
      availability_type: "open", // Default
      start_date: null,
      end_date: null,
      startTime: "",
      endTime: "",
      age_matters: null,
      age_min: "",
      age_max: "",
      required_gender: "any",
      additional_details: "",

      // Validation states
      validated: false,
      submissionError: null,
      submissionSuccess: false,
      isSubmitting: false,
    };
  }

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
    if (!location) {
      validationErrors.location = "Location is required";
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
      home_owner_id: "27ced2e6-a603-42a4-bc98-ec5947e965e5",
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
      age_max : null,
      required_gender: this.state.required_gender,
      additional_details: this.state.additional_details,
    };
    console.log(jobData);

    try {
      // Use proxy setup in package.json for development
      const response = await fetch("/api/jobs/addjob", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(jobData),
      });

      if (!response.ok) {
        // Handle non-200 responses
        const errorData = await response.json();
        throw new Error(errorData.message || "Job creation failed");
      }

      const responseData = await response.json();

      // Success handling
      this.setState({
        submissionSuccess: true,
        isSubmitting: false,
        // Optionally reset form or show success message
      });

      // Optional: Reset form or show success message
      console.log("Job created successfully:", responseData);
    } catch (error) {
      // Error handling
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
    return (
      <Container fluid className="mt-4 p-4">
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

        <Row>
          <Col md={6}>
            <h3 className="mb-4">Job Information</h3>
            <Form noValidate validated={validated} onSubmit={this.handleSubmit}>
              <Form.Group className="mb-3">
                <InputGroup hasValidation>
                  <InputGroup.Text>📍</InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Enter location"
                    value={location}
                    onChange={(e) =>
                      this.setState({ location: e.target.value })
                    }
                    required
                  />
                  <Form.Control.Feedback type="invalid">
                    Please choose a location.
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>

              {/* Duration (Radio Buttons) Row */}
              <Row className="mb-3">
                {/* Duration Radio (Open/Closed) */}
                <Col md={12}>
                  <Form.Group>
                    <Form.Label>Duration:</Form.Label>
                    <div className="d-flex gap-4 mt-2">
                      <Form.Check
                        type="radio"
                        label="Open"
                        name="availability_type"
                        value="Open"
                        onChange={(e) =>
                          this.setState({
                            availability_type: e.target.value,
                            endTime: "",
                            endDate: "",
                          })
                        }
                        checked={availability_type === "open"}
                        required
                      />
                      <Form.Check
                        type="radio"
                        label="Closed"
                        name="availability_type"
                        value="closed"
                        onChange={(e) =>
                          this.setState({ availability_type: e.target.value })
                        }
                        checked={availability_type === "closed"}
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {/* Date and Time Inputs */}
              {availability_type && (
                <Row className="mb-3">
                  {/* Starting Date */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <DatePicker
                        selected={start_date}
                        onChange={(date) => this.setState({ start_date: date })}
                        dateFormat="MM/dd/yyyy"
                        className="form-control"
                        placeholderText="Select a starting  date"
                        required
                      />
                      {validated && !start_date && (
                        <div className="invalid-feedback d-block">
                          Please select a starting date.
                        </div>
                      )}
                    </Form.Group>
                  </Col>

                  {/* Starting Time */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <Form.Control
                        type="time"
                        value={startTime}
                        onChange={(e) =>
                          this.setState({ startTime: e.target.value })
                        }
                        required
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
                  <Col md={6}>
                    <Form.Group>
                      <DatePicker
                        selected={end_date}
                        onChange={(date) => this.setState({ end_date: date })}
                        dateFormat="MM/dd/yyyy"
                        className="form-control"
                        placeholderText="Select an ending date"
                        required
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
                        type="time"
                        value={endTime}
                        onChange={(e) =>
                          this.setState({ endTime: e.target.value })
                        }
                        required
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

              <div className="mb-3">
                <h5 style={{ textAlign: "left" }}>Select Category</h5>
                <Form.Group>
                  <Form.Select
                    value={job_category}
                    onChange={(e) =>
                      this.setState({ job_category: e.target.value })
                    }
                    required
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
                    type="number"
                    placeholder="Enter your budget"
                    value={budget}
                    onChange={(e) => this.setState({ budget: e.target.value })}
                    min="0"
                    step="0.01"
                    required
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
                  value={job_type}
                  onChange={(e) => this.setState({ job_type: e.target.value })}
                  required
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
                  type="text"
                  placeholder="Enter any additional specifications or details"
                  value={description}
                  onChange={(e) =>
                    this.setState({ description: e.target.value })
                  }
                />
              </Form.Group>
            </Form>
          </Col>

          {/* Worker Information Column */}
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Form.Group className="mb-3">
              {/* Existing worker information form groups */}

              <h3 className="mb-4">Worker Information</h3>
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
                    type="radio"
                    label="Required"
                    name="age_matters"
                    value="true" // This is just a value; the state is boolean
                    onChange={(e) => this.setState({ age_matters: true })} // Set as boolean true
                    checked={age_matters === true} // Check if age_matters is true
                    required
                  />
                  <Form.Check
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
                  type="text"
                  placeholder="Enter any additional requirements or specifications"
                  value={additional_details}
                  onChange={(e) =>
                    this.setState({ additional_details: e.target.value })
                  }
                />
              </Form.Group>

              {/* Submit Button with Loading State */}
              <div className="mt-4">
                <Button
                  type="submit"
                  variant="primary"
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

              {/* Display Specific Validation Errors */}
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
              )}
            </Form.Group>
          </Col>
        </Row>
      </Container>
    );
  }
}
