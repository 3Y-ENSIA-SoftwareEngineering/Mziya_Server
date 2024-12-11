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

export class PostingPage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      location: "",
      date: null,
      time: "",
      duration: "",
      price: "",
      validated: false,
      selectedCategories: [],
      jobDetails: "",
      difficulty: "",
      gender: "",
      minAge: "",
      age: "",
      otherRequirements: "",
      durationType: "",
      endTime: "",
      startDate: "",
      endDate: "",
      startTime: "",
    };
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    const {
      gender,
      age,
      minAge,
      price,
      duration,
      selectedCategories,
      date,
      time,
    } = this.state;

    let isValid = true;
    if (
      !gender ||
      !age ||
      (age === "Required" && (!minAge || minAge < 18)) ||
      selectedCategories.length === 0
    ) {
      isValid = false;
    }

    if (!price.match(/^\d+(\.\d{1,2})?$/) || duration <= 0 || !date || !time) {
      isValid = false;
    }

    if (form.checkValidity() === false || !isValid) {
      this.setState({ validated: true });
      return;
    }

    // Submit form logic
    console.log("Form submitted successfully:", this.state);
  };

  toggleCategory = (category) => {
    this.setState((prevState) => {
      const { selectedCategories } = prevState;
      if (selectedCategories.includes(category)) {
        return {
          selectedCategories: selectedCategories.filter(
            (cat) => cat !== category
          ),
        };
      } else {
        return { selectedCategories: [...selectedCategories, category] };
      }
    });
  };

  render() {
    const {
      location,
      date,
      time,
      duration,
      price,
      jobDetails,
      validated,
      selectedCategories,
      difficulty,
      gender,
      minAge,
      age,
      otherRequirements,
      durationType,
      endTime,
      startDate,
      endDate,
      startTime,
    } = this.state;

    const categories = [
      "Child Care",
      "Babysitting",
      "Plumbing",
      "Gardening",
      "Painting",
    ];

    return (
      <Container fluid className="mt-4 p-4">
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
                        name="durationType"
                        value="Open"
                        onChange={(e) =>
                          this.setState({
                            durationType: e.target.value,
                            endTime: "",
                            endDate: "",
                          })
                        }
                        checked={durationType === "Open"}
                        required
                      />
                      <Form.Check
                        type="radio"
                        label="Closed"
                        name="durationType"
                        value="Closed"
                        onChange={(e) =>
                          this.setState({ durationType: e.target.value })
                        }
                        checked={durationType === "Closed"}
                        required
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>

              {/* Date and Time Inputs */}
              {durationType && (
                <Row className="mb-3">
                  {/* Starting Date */}
                  <Col md={6} className="mb-3">
                    <Form.Group>
                      <DatePicker
                        selected={startDate}
                        onChange={(date) => this.setState({ startDate: date })}
                        dateFormat="MM/dd/yyyy"
                        className="form-control"
                        placeholderText="Select a starting  date"
                        required
                      />
                      {validated && !startDate && (
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
              {durationType === "Closed" && (
                <Row className="mb-3">
                  {/* Ending Date */}
                  <Col md={6}>
                    <Form.Group>
                      <DatePicker
                        selected={endDate}
                        onChange={(date) => this.setState({ endDate: date })}
                        dateFormat="MM/dd/yyyy"
                        className="form-control"
                        placeholderText="Select an ending date"
                        required
                      />
                      {validated && !endDate && (
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
                <div className="d-flex flex-wrap gap-2 mt-3">
                  {categories.map((category, index) => (
                    <div
                      key={index}
                      className={`badge px-3 py-2 ${
                        selectedCategories.includes(category)
                          ? "bg-info text-white"
                          : "bg-light text-dark"
                      }`}
                      style={{
                        backgroundColor: selectedCategories.includes(category)
                          ? "#17a2b8"
                          : "#d3d3d3",
                        borderRadius: "30px",
                        cursor: "pointer",
                      }}
                      onClick={() => this.toggleCategory(category)}
                    >
                      {category}
                    </div>
                  ))}
                </div>
                {validated && selectedCategories.length === 0 && (
                  <div className="invalid-feedback d-block">
                    Please select at least one category.
                  </div>
                )}
              </div>

              <Form.Group className="mb-3">
                <Form.Label>Budget</Form.Label>
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Enter your budget"
                    value={price}
                    onChange={(e) => this.setState({ price: e.target.value })}
                    pattern="^\d+(\.\d{1,2})?$"
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
                  value={difficulty}
                  onChange={(e) =>
                    this.setState({ difficulty: e.target.value })
                  }
                  required
                >
                  <option value="" disabled>
                    Select difficulty
                  </option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </Form.Select>
                {validated && !difficulty && (
                  <div className="invalid-feedback d-block mt-2">
                    Please select the difficulty level .
                  </div>
                )}
                {/* Other Details */}
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
                    value="jobDetails"
                    onChange={(e) =>
                      this.setState({ jobDetails: e.target.value })
                    }
                  />
                </Form.Group>
              </Form.Group>
            </Form>
          </Col>
          {/* Right hand side aka worker's side  */}

          {/* Worker Information */}
          <Col
            md={6}
            className="d-flex justify-content-center align-items-center"
          >
            <Form.Group className="mb-3">
              <h3 className="mb-4">Worker Information</h3>

              {/* Age Selection */}
              <div className="mb-3, d-flex align-items-center gap-3">
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
                    name="age"
                    value="Required"
                    onChange={(e) => this.setState({ age: e.target.value })}
                    checked={age === "Required"}
                    required
                  />
                  <Form.Check
                    type="radio"
                    label="Doesn't matter"
                    name="age"
                    value="Doesn't matter"
                    onChange={(e) => this.setState({ age: e.target.value })}
                    checked={age === "Doesn't matter"}
                    required
                  />
                </div>
                {age === "Required" && (
                  <div className="mt-2">
                    <Form.Control
                      type="number"
                      placeholder="Enter minimum age"
                      value={minAge}
                      onChange={(e) =>
                        this.setState({ minAge: e.target.value })
                      }
                      min="18"
                    />
                  </div>
                )}
              </div>
              {validated && !age && (
                <div className="invalid-feedback d-block mt-2">
                  Please select the age.
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
                    name="gender"
                    value="Female"
                    onChange={(e) => this.setState({ gender: e.target.value })}
                    checked={gender === "Female"}
                    required
                  />
                  <Form.Check
                    type="radio"
                    label="Male"
                    name="gender"
                    value="Male"
                    onChange={(e) => this.setState({ gender: e.target.value })}
                    checked={gender === "Male"}
                    required
                  />
                  <Form.Check
                    type="radio"
                    label="Doesn't matter"
                    name="gender"
                    value="Doesn't matter"
                    onChange={(e) => this.setState({ gender: e.target.value })}
                    checked={gender === "Doesn't matter"}
                    required
                  />
                </div>
              </div>
              {validated && !gender && (
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
                  value={otherRequirements}
                  onChange={(e) =>
                    this.setState({ otherRequirements: e.target.value })
                  }
                />
              </Form.Group>
              {/* Submit Button */}
              <div className=" mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  onClick={this.handleSubmit}
                >
                  Submit
                </Button>
              </div>
            </Form.Group>
          </Col>
        </Row>
      </Container>
    );
  }
}
