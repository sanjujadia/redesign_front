import React, { useState, useEffect } from "react";
//import Sidebar from "../components/Sidebar";
//import TopBar from "../components/TopBar";
import { Button, Col, Form, Row, Dropdown, Modal } from "react-bootstrap";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
//import { useAuth } from "../context/AuthProvider";
import moment from "moment";

export default function AddWorkout() {
  const navigate = useNavigate();
  //const { user, isAuthenticated } = useAuth();
  const [selectedOption, setSelectedOption] = useState(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [checkboxesState, setCheckboxesState] = useState({
    Bodyweightonly: false,
    BodyweightDumbbells: false,
    BodyweightKettlebell: false,
    BodyweightResistanceBands: false,
    BodyweightFlatBench: false,
    BodyweightDumbbellsKettlebell: false,
    BodyweightDumbbellsResistanceBands: false,
    BodyweightDumbbellsFlatBench: false,
    BodyweightKettlebellFlatBench: false,
    BodyweightResistanceBandsFlatBench: false,
    BodyweightDumbbellsKettlebellResistanceBands: false,
    BodyweightDumbbellsKettlebellFlatBench: false,
    BodyweightKettlebellResistanceBandsFlatBench: false,
    BodyweightDumbbellsKettlebellResistanceBandsFlatBench: false,
    customCheckboxLabel: false,

  });
  const date = searchParams.get("date");
  console.log("searchParams", date);
  const [showModal, setShowModal] = useState(false);
  const [customCheckboxLabel, setCustomCheckboxLabel] = useState("");


  const labels = {
    Bodyweightonly: 'Bodyweightonly',
    BodyweightDumbbells: 'Bodyweight,Dumbbells',
    BodyweightKettlebell: 'Bodyweight,Kettlebell',
    BodyweightResistanceBands: 'Bodyweight,ResistanceBands',
    BodyweightFlatBench: 'Bodyweight,FlatBench',
    BodyweightDumbbellsKettlebell: 'Bodyweight,Dumbbells,Kettlebell',
    BodyweightDumbbellsResistanceBands: 'Bodyweight,Dumbbells,ResistanceBands',
    BodyweightDumbbellsFlatBench: 'Bodyweight,DumbbellsFlatBench',
    BodyweightKettlebellFlatBench: 'Bodyweight,KettlebellFlatBench',
    BodyweightResistanceBandsFlatBench: 'Bodyweight,ResistanceBands,FlatBench',
    BodyweightDumbbellsKettlebellResistanceBands: 'Bodyweight,Dumbbells,Kettlebell,ResistanceBands',
    BodyweightDumbbellsKettlebellFlatBench: 'Bodyweight,Dumbbells,Kettlebell,FlatBench',
    BodyweightKettlebellResistanceBandsFlatBench: 'Bodyweight,Kettlebell,ResistanceBands,FlatBench',
    BodyweightDumbbellsKettlebellResistanceBandsFlatBench: 'Bodyweight,Dumbbells,Kettlebell,ResistanceBandsFlatBench',
    // workout: `${selectedWorkouts}`,
  };
  const handleCheckboxClick = (label) => {
    // Handle the checkbox click as needed
    // navigate(`/create-workout-card?date=${date}&for=${encodeURIComponent([label])}`);

    // Toggle the selection status of the workout
    setSelectedWorkouts((prevSelected) =>
      prevSelected.includes(label)
        ? prevSelected.filter((selected) => selected !== label)
        : [...prevSelected, label]
    );
  };

  const handleCustomCheckboxClick = () => {
    // Handle custom checkbox click
    handleCheckboxClick(customCheckboxLabel);
    setShowModal(false);
    setCustomCheckboxLabel("");
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleCheckboxChange = (key) => {
    setCheckboxesState((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));

    const label = labels[key];
    if (checkboxesState[key]) {
      navigate(`/create-workout-card?date=${date}&for=${encodeURIComponent([label])}`);
    }
  };
  return (
    <div>
      <div className="mt-1 main-content">
        <div className="bg-white py-3 px-4">
          <Row>
            <Col lg={12} className="d-flex">

              <Link
                to="/workout-calendar"
                className="text-dark mb-0 fw-600 fs-5 text-decoration-none"
              >
                <svg
                  className="me-3"
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                >
                  path d="M18.8641 6.73026H4.25331L8.85671 2.12686C9.35722
                  1.62634 9.35722 0.825985 8.85671 0.375384C8.3562 -0.125128
                  7.55584 -0.125128 7.10524 0.375384L0.350429 7.0806C0.100173
                  7.33051 0 7.68094 0 7.98109C0 8.28124 0.100173 8.63168
                  0.350429 8.88158L7.05529 15.5864C7.55581 16.087 8.35616
                  16.087 8.80677 15.5864C9.30728 15.0859 9.30728 14.2856
                  8.80677 13.835L4.20336 9.23157H18.8142C19.4647 9.23157
                  19.9649 8.68114 19.9649 7.98064C19.9649 7.28049 19.5143
                  6.73008 18.8641 6.73008V6.73026Z" fill="black"
                </svg>
                <span className="date-circle">
                  {moment(date).format("DD")}
                </span>
                {moment(date).format("dddd, MMMM YYYY")}
              </Link>
              {/* <Button variant='primary' className='rounded-0 px-5 text-white ms-5'>Metabolic Conditioning</Button> */}
              {/* <Dropdown className="rounded-0 px-5 text-white ms-2">
                  <Dropdown.Toggle variant="primary">
                    {selectedOption || "Select Option"}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleOptionSelect("Anterior")}
                    >
                      Anterior
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleOptionSelect("Posterior")}
                    >
                      Posterior
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleOptionSelect("Upper Body")}
                    >
                      Upper Body
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleOptionSelect("Lower Body")}
                    >
                      Lower Body
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        handleOptionSelect("Metabolic Conditioning")
                      }
                    >
                      Metabolic Conditioning
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() =>
                        handleOptionSelect("Athletic Conditioning")
                      }
                    >
                      Athletic Conditioning
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown> */}
              <Button variant="primary" className='rounded-0  text-white ms-2' onClick={() => setShowModal(true)}>
                Add Custom workout
              </Button>
            </Col>
          </Row>
        </div>

        {/* Custom Checkbox Modal */}
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Add Custom Workout</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group controlId="formCustomCheckboxLabel">
                <Form.Label>workout</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter workout"
                  value={customCheckboxLabel}
                  onChange={(e) => setCustomCheckboxLabel(e.target.value)}
                />
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" onClick={handleCustomCheckboxClick}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="p-xl-5 p-3">
          <div className="bg-white rounded-32 p-xl-5 p-3 h-75vh">
            <p className="text-dark fw-600 fs-6">
              Which workout would you like to create?
            </p>
            <div className="add-workout-checkbox">
              <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check
                  type="checkbox"
                  label="Bodyweight only"
                  data-label="Bodyweight only"
                  checked={checkboxesState.Bodyweightonly}
                  onChange={() => handleCheckboxChange('Bodyweightonly')}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox1">
                <Form.Check type="checkbox" label="Bodyweight, Dumbbells"
                  data-label="Bodyweight, Dumbbells"
                  checked={checkboxesState.BodyweightDumbbells}
                  onChange={() => handleCheckboxChange('BodyweightDumbbells')}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox2">
                <Form.Check type="checkbox" label="Bodyweight, Kettlebell"
                  data-label="Bodyweight, Kettlebell"
                  checked={checkboxesState.BodyweightKettlebell}
                  onChange={() => handleCheckboxChange('BodyweightKettlebell')}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox3">
                <Form.Check
                  type="checkbox"
                  label="Bodyweight, Resistance Bands"
                  data-label="Bodyweight, Resistance Bands"
                  checked={checkboxesState.BodyweightResistanceBands}
                  onChange={() => handleCheckboxChange('BodyweightResistanceBands')}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox4">
                <Form.Check type="checkbox" label="Bodyweight, Flat Bench"
                  data-label="Bodyweight, Flat Bench"
                  checked={checkboxesState.BodyweightFlatBench}
                  onChange={() => handleCheckboxChange('BodyweightFlatBench')}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox5">
                <Form.Check
                  type="checkbox"
                  label="Bodyweight, Dumbbells, Kettlebell"
                  data-label="Bodyweight, Dumbbells, Kettlebell"
                  checked={checkboxesState.BodyweightDumbbellsKettlebell}
                  onChange={() => handleCheckboxChange('BodyweightDumbbellsKettlebell')}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox6">
                <Form.Check
                  type="checkbox"
                  label="Bodyweight, Dumbbells, Resistance Bands"
                  data-label="Bodyweight, Dumbbells, Resistance Bands"
                  checked={checkboxesState.BodyweightDumbbellsResistanceBands}
                  onChange={() => handleCheckboxChange('BodyweightDumbbellsResistanceBands')}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox7">
                <Form.Check
                  type="checkbox"
                  label="Bodyweight, Dumbbells, Flat Bench"
                  data-label="Bodyweight, Dumbbells, Flat Bench"
                  checked={checkboxesState.BodyweightDumbbellsFlatBench}
                  onChange={() => handleCheckboxChange('BodyweightDumbbellsFlatBench')}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox8">
                <Form.Check
                  type="checkbox"
                  label="Bodyweight, Kettlebell, Flat Bench"
                  data-label="Bodyweight, Kettlebell, Flat Bench"
                  checked={checkboxesState.BodyweightKettlebellFlatBench}
                  onChange={() => handleCheckboxChange('BodyweightKettlebellFlatBench')}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox9">
                <Form.Check
                  type="checkbox"
                  label="Bodyweight, Resistance Bands, Flat Bench"
                  data-label="Bodyweight,Resistance Bands, Flat Bench"
                  checked={checkboxesState.BodyweightResistanceBandsFlatBench}
                  onChange={() => handleCheckboxChange('BodyweightResistanceBandsFlatBench')}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox10">
                <Form.Check
                  type="checkbox"
                  label="Bodyweight, Dumbbells, Kettlebell, Resistance Bands"
                  data-label="Bodyweight, Dumbbells, Kettlebell, Resistance Bands"
                  checked={checkboxesState.BodyweightDumbbellsKettlebellResistanceBands}
                  onChange={() => handleCheckboxChange('BodyweightDumbbellsKettlebellResistanceBands')}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox11">
                <Form.Check
                  type="checkbox"
                  label="Bodyweight, Dumbbells, Kettlebell, Flat Bench"
                  data-label="Bodyweight, Dumbbells, Kettlebell, Flat Bench"
                  checked={checkboxesState.BodyweightDumbbellsKettlebellFlatBench}
                  onChange={() => handleCheckboxChange('BodyweightDumbbellsKettlebellFlatBench')}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox12">
                <Form.Check
                  type="checkbox"
                  label="Bodyweight, Kettlebell, Resistance Bands, Flat Bench"
                  data-label="Bodyweight, Kettlebell, Resistance Bands, Flat Bench"
                  checked={checkboxesState.BodyweightKettlebellResistanceBandsFlatBench}
                  onChange={() => handleCheckboxChange('BodyweightKettlebellResistanceBandsFlatBench')}
                />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicCheckbox13">
                <Form.Check
                  type="checkbox"
                  label="Bodyweight, Dumbbells, Kettlebell, Resistance Bands, Flat Bench"
                  data-label="Bodyweight, Dumbbells, Kettlebell, Resistance Bands, Flat Bench"
                  checked={checkboxesState.BodyweightDumbbellsKettlebellResistanceBandsFlatBench}
                  onChange={() => handleCheckboxChange('BodyweightDumbbellsKettlebellResistanceBandsFlatBench')}
                />
              </Form.Group>
              {selectedWorkouts.map((workout, index) => (
                <Form.Group key={index} className="mb-3" controlId="formBasicCheckbox14">
                  <Form.Check
                    type="checkbox"
                    label={workout}
                    data-label={workout}
                    checked={checkboxesState[workout]}
                    onChange={() => {
                      setCheckboxesState((prev) => {
                        const updatedState = {
                          ...prev,
                          [workout]: !prev[workout],
                        };

                        if (updatedState[workout]) {
                          navigate(`/create-workout-card?date=${date}&for=${encodeURIComponent([workout])}`);
                        }

                        return updatedState;
                      });
                    }}
                  />
                </Form.Group>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
