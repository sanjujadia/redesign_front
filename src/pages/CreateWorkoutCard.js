import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Button, Col, Form, Modal, Row, Dropdown } from 'react-bootstrap';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'
import { toast, ToastContainer } from 'react-toastify';
import Ratings from '../components/Ratings';
import { TimePicker } from 'antd';
import moment from 'moment';
import { dataUriToBuffer } from 'data-uri-to-buffer';

export default function CreateWorkoutCard() {
    const initialWorkoutCardData = {
        workoutType: '',
        workoutTime: '',
    }
    const initialElementData = {
        exerciseName: '',
        exerciseTime: '',
        exerciseReps: '',
        equipmentRequired: [],
        video: '',
        mobVideo: ''
    }
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [searchParams, setSearchParams] = useSearchParams()
    const date = searchParams.get('date')
    let parsed = dataUriToBuffer(`data:,${searchParams.get('for')}`);
    const workoutFor = new TextDecoder().decode(parsed.buffer)
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
    const [showWorkoutcardModal, setShowWorkoutcardModal] = useState(false)
    const [showUploadVideoModal, setShowUploadVideoModal] = useState(false)
    const [repeatCount, setRepeatCount] = useState(1); // State variable to track the number of repeats
    const [workoutData, setWorkoutData] = useState(null)
    const [workoutId, setWorkoutId] = useState()
    const [elementData, setElementData] = useState([initialElementData]);
    const [videoFiles, setVideoFiles] = useState([null]);
    const [mobVideoFiles, setMobVideoFiles] = useState([null])
    const [selectedElementIndex, setSelectedElementIndex] = useState(null)
    const [workoutCard, setWorkoutCard] = useState(initialWorkoutCardData)
    const [selectedCardImageFile, setSelectedCardImageFile] = useState(null)
    const [selectedCardImage, setSelectedCardImage] = useState(null)
    const [selectedOption, setSelectedOption] = useState("Metabolic Conditioning");
    const inputref = useRef()
    const fileVideoRef = useRef([])
    const fileMobVideoRef = useRef([])

    const fetchWorkoutData = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getWorkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date })
        }).then(res => res.json())
        console.log(res?.data)
        if (res.status) {
            const updatedWorkoutCard = { ...workoutCard, workoutType: res?.data[0]?.workout_card.workoutType, workoutTime: res?.data[0]?.workout_card.workoutTime }
            setWorkoutCard(updatedWorkoutCard)
            setWorkoutId(res?.data[0]?._id)
            setSelectedCardImage(res?.data[0]?.workout_card.workoutImage)
            setElementData(res?.data[0]?.workout_elements)
        } else {
            setWorkoutCard(initialWorkoutCardData)
            setSelectedCardImage(null)
            setElementData([initialElementData])
        }
    }
    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        // Perform any additional actions when an option is selected
    };
    const handleRepeatClick = () => {
        setRepeatCount(repeatCount + 1);
        setElementData([...elementData, { exerciseName: '', exerciseTime: '', exerciseReps: '', equipmentRequired: [], video: '', mobVideo: '' }]);
        setVideoFiles([...videoFiles, null]);
        setMobVideoFiles([...mobVideoFiles, null]);
    };

    // const handleEquipmentInput = (index, e) => {
    //     const { name, value } = e.target
    //     // const newValue = value.split(',').map(item => item.trim())
    //     const newValue = value.replace(/\s+/g, ' ').split(',').map(item => item.trim())
    //     const updatedElementData = [...elementData];
    //     updatedElementData[index] = { ...updatedElementData[index], equipmentRequired: newValue };
    //     setElementData(updatedElementData)
    //   }

    const handleModalShow = (index) => {
        setSelectedElementIndex(index); // Set the selected index for the modal
        setShowUploadVideoModal(true);
    };

    const handleModalClose = () => {
        setShowUploadVideoModal(false);
        setSelectedElementIndex(null); // Reset the selected index when closing the modal
    };

    const handleInputChange = (index, event) => {
        const { name, value } = event.target;
        // Create a copy of the elementData array and update the data for the specified index
        const updatedElementData = [...elementData];
        updatedElementData[index] = { ...updatedElementData[index], [name]: value };
        setElementData(updatedElementData);
    };

    const handleVideoSave = async (index) => {
        const formdata = new FormData()
        formdata.append('elementVideo', elementData[index].video)
        formdata.append('elementMobVideo', elementData[index].mobVideo)
        formdata.append('videoFile', videoFiles[index])
        formdata.append('mobVideoFile', mobVideoFiles[index])
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/uploadVideo`, {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
        if (res.status) {
            setShowUploadVideoModal(false);
            const updatedElementData = [...elementData];
            updatedElementData[index] = { ...updatedElementData[index], video: res?.data?.video, mobVideo: res?.data?.mobVideo };
            setElementData(updatedElementData);
            toast.success('Video uploaded successfully')
        }
    }

    const handleFileChange = (index, event) => {
        const file = event.target.files[0];
        const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB as an example, you can adjust this limit
        if (file.size > maxSizeInBytes) {
            // Display a message to the user that the file is too large
            alert('The selected file is too large. Please choose a smaller file.');
        } else {
            const updatedVideoFiles = [...videoFiles];
            updatedVideoFiles[index] = file;
            setVideoFiles(updatedVideoFiles);
        }
    };
    const handleMobFileChange = (index, event) => {
        const file = event.target.files[0];
        const maxSizeInBytes = 10 * 1024 * 1024; // 10 MB as an example, you can adjust this limit
        if (file.size > maxSizeInBytes) {
            alert('The selected file is too large. Please choose a smaller file.');
        } else {
            const updatedVideoFiles = [...mobVideoFiles];
            updatedVideoFiles[index] = file;
            setMobVideoFiles(updatedVideoFiles);
        }
    };

    const handleWorkoutCard = (e) => {
        const { name, value } = e.target
        const updatedWorkoutData = { ...workoutCard, [name]: value }
        setWorkoutCard(updatedWorkoutData)
    }

    const handleCardImage = (e) => {
        const file = e.target.files[0]
        if (file) {
            setSelectedCardImageFile(file)
            setSelectedCardImage(URL.createObjectURL(file))
        }
    }

    const handleImageChange = () => {
        if (inputref.current) {
            inputref.current.click()
        }
    }

    const createUpdateWorkoutCard = async () => {
        let id
        if (!workoutCard.workoutType) {
            alert('Please select a workout type')
            return
        }
        if (!workoutCard.workoutTime) {
            alert('Please select a workout time')
            return
        }
        if (!workoutId) {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/createWorkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date, workoutFor, userId: user._id })
            }).then(res => res.json())
            if (res.status) {
                setWorkoutId(res?.data?._id)
                id = res?.data?._id
            } else {
                toast.error(res.message)
                return
            }

            const formdata = new FormData()
            formdata.append('id', id)
            formdata.append('workoutType', workoutCard.workoutType)
            formdata.append('workoutTime', workoutCard.workoutTime)
            formdata.append('cardImageFile', selectedCardImageFile)
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/addWorkoutCard`, {
                method: 'POST',
                body: formdata
            }).then(res => res.json())

            if (response.status) {
                const updatedWorkoutCardData = { ...workoutCard, workoutType: response?.data?.workoutType, workoutTime: response?.data?.workoutTime }
                setWorkoutCard(updatedWorkoutCardData)
                setSelectedCardImage(response?.data?.workoutImage)
                setShowWorkoutcardModal(false)
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        } else {
            const formdata = new FormData()
            formdata.append('id', workoutId)
            formdata.append('workoutType', workoutCard.workoutType)
            formdata.append('workoutTime', workoutCard.workoutTime)
            formdata.append('cardImageFile', selectedCardImageFile)
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/addWorkoutCard`, {
                method: 'POST',
                body: formdata
            }).then(res => res.json())

            if (response.status) {
                const updatedWorkoutCardData = { ...workoutCard, workoutType: response?.data?.workoutType, workoutTime: response?.data?.workoutTime }
                setWorkoutCard(updatedWorkoutCardData)
                setSelectedCardImage(response?.data?.workoutImage)
                setShowWorkoutcardModal(false)
                toast.success(response.message)
            } else {
                toast.error(response.message)
            }
        }
    }

    const createUpdateWorkoutElements = async () => {
        let id
        if (!workoutId) {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/createWorkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ date, workoutFor, userId: user._id })
            }).then(res => res.json())
            if (res.status) {
                setWorkoutId(res?.data?._id)
                id = res?.data?._id
                // navigate(`/workout-calendar`);
            } else {
                toast.error(res.message)
                return
            }
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/addAndUpdateWorkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id, workoutData: elementData })
            }).then(res => res.json())
            setElementData(response?.data?.workout_elements)
            toast.success('Workout created successfully')
        } else {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/addAndUpdateWorkout`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: workoutId, workoutData: elementData })
            }).then(res => res.json())
            setElementData(response?.data?.workout_elements)
            toast.success('Workout updated successfully')
        }
    }


    useEffect(() => {
        fetchWorkoutData()
        setShowWorkoutcardModal(true)
    }, [])

    console.log('videoFiles', videoFiles)
    console.log('mobVideoFiles', mobVideoFiles)
    console.log('elementData', elementData)

    const repeatedElements = elementData.map((data, index) => (
        <div key={index} className='cs_width d-flex gap-3 align-items-center mb-3'>
            <Form.Group as={Row} className="" controlId={`formPlaintextEmail-${index}`}>
                <Col className='cs_width' sm="4">
                    <Form.Control
                        className='shadow-none border border-2 fw-600 text-black py-3 bg-light'
                        type="text"
                        placeholder="Pushups"
                        name="exerciseName"
                        value={data.exerciseName || ''}
                        onChange={(e) => handleInputChange(index, e)}
                    />
                </Col>
                <Col sm="4">
                    <Form.Control
                        className='shadow-none border border-2 fw-600 text-black py-3 bg-light'
                        type="text"
                        placeholder="2 Min"
                        name="exerciseTime"
                        value={data.exerciseTime || ''}
                        onChange={(e) => handleInputChange(index, e)}
                    />
                </Col>
                <Col sm="4">
                    <Form.Control
                        className='shadow-none border border-2 fw-600 text-black py-3 bg-light'
                        type="text"
                        placeholder="10 Reps"
                        name="exerciseReps"
                        value={data.exerciseReps || ''}
                        onChange={(e) => handleInputChange(index, e)}
                    />
                </Col>
                <Col className='workout-equipment' sm="4">
                    <Form.Control
                        className='shadow-none border border-2 fw-600 text-black py-3 bg-light'
                        type="text"
                        placeholder="equipment required"
                        name="equipmentRequired"
                        value={data.equipmentRequired || ''}
                        onChange={(e) => handleInputChange(index, e)}
                    />
                </Col>
            </Form.Group>
            {/* <input
                type="file"
                onChange={(e) => handleFileChange(index, e)}
                accept="video/*"
                style={{ display: 'none' }}
                ref={(fileInput) => (fileInputRefs.current[index] = fileInput)}
            /> */}
            <Button
                className='rounded-0 border-0 text-green px-0 py-0 bg-none fw-600 fs-15 upload-vdo'
                onClick={() => {
                    handleModalShow(index)
                }}
            >
                Upload Video
            </Button>
        </div>
    ))

    useEffect(() => {
        if (isAuthenticated) {

        } else {
            navigate('/')
        }
    }, [user])
    return (
        <div>
            <ToastContainer />
            <div className='mt-1 main-content'>
                <div className='bg-white py-3 px-4'>
                    <Row>
                        <Col lg={12} className="d-flex">

                            <Link to={`/add-workout?date=${date}`} className='text-dark mb-0 fw-600 fs-5 text-decoration-none'><svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                <path d="M18.8641 6.73026H4.25331L8.85671 2.12686C9.35722 1.62634 9.35722 0.825985 8.85671 0.375384C8.3562 -0.125128 7.55584 -0.125128 7.10524 0.375384L0.350429 7.0806C0.100173 7.33051 0 7.68094 0 7.98109C0 8.28124 0.100173 8.63168 0.350429 8.88158L7.05529 15.5864C7.55581 16.087 8.35616 16.087 8.80677 15.5864C9.30728 15.0859 9.30728 14.2856 8.80677 13.835L4.20336 9.23157H18.8142C19.4647 9.23157 19.9649 8.68114 19.9649 7.98064C19.9649 7.28049 19.5143 6.73008 18.8641 6.73008V6.73026Z" fill="black" />
                            </svg><span className='date-circle'>{moment(date).format("DD")}</span>{moment(date).format("dddd, MMMM YYYY")}</Link>
                            {/* <Button variant='primary' className='rounded-0 px-5 text-white ms-5 fs-5'>Metabolic Conditioning</Button> */}
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
                            {/* <Dropdown className='rounded-0 px-5 text-white ms-5 fs-5'>
                                <Dropdown.Toggle variant="primary">
                                    {selectedOption || "Select Option"}
                                </Dropdown.Toggle>
                                <Dropdown.Menu>
                                    <Dropdown.Item onClick={() => handleOptionSelect("Anterior")}>
                                        Anterior
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleOptionSelect("Posterior")}>
                                        Posterior
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleOptionSelect("Upper Body")}>
                                        Upper Body
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleOptionSelect("Lower Body")}>
                                        Lower Body
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleOptionSelect("Metabolic Conditioning")}>
                                        Metabolic Conditioning
                                    </Dropdown.Item>
                                    <Dropdown.Item onClick={() => handleOptionSelect("Athletic Conditioning")}>
                                        Athletic Conditioning
                                    </Dropdown.Item>
                                </Dropdown.Menu>
                            </Dropdown> */}
                            <Button className='rounded-0 border-0 text-green ms-2 bg-none fw-600 fs-15' onClick={() => setShowWorkoutcardModal(true)}>Create Workout Card</Button>

                        </Col>
                    </Row>

                </div>
                <div className='p-xl-5 p-3'>
                    <div className='bg-white rounded-32 p-xl-5 p-3 h-75vh'>
                        <Row>
                            <Col xxl={12} lg={12} className=''>
                                <div>
                                    <p className='text-dark fw-600 fs-6'>Body Weight Only</p>
                                    <div className=''>
                                        {repeatedElements}
                                        {/* <div className='d-flex gap-3 align-items-center mb-3'>
                                                    <Form.Group as={Row} className="" controlId="formPlaintextEmail">
                                                        <Col sm="4">
                                                            <Form.Control className='shadow-none border border-2 fw-600 text-black py-3 bg-light' type="text" placeholder="Pushups" />
                                                        </Col>
                                                        <Col sm="4">
                                                            <Form.Control className='shadow-none border border-2 fw-600 text-black py-3 bg-light' type="text" placeholder="2 Min" />
                                                        </Col>
                                                        <Col sm="4">
                                                            <Form.Control className='shadow-none border border-2 fw-600 text-black py-3 bg-light' type="text" placeholder="10 Reps" />
                                                        </Col>
                                                    </Form.Group>
                                                    <Button className='rounded-0 border-0 text-green px-0 py-0 bg-none fw-600 fs-15 upload-vdo' onClick={() => setShowUploadVideoModal(true)}>Upload Video</Button>
                                                </div>
                                                <div className='d-flex gap-3 align-items-center mb-3'>
                                                    <Form.Group as={Row} className="" controlId="formPlaintextEmail">
                                                        <Col sm="4">
                                                            <Form.Control className='shadow-none border border-2 fw-600 text-black py-3 bg-light' type="text" placeholder="Pushups" />
                                                        </Col>
                                                        <Col sm="4">
                                                            <Form.Control className='shadow-none border border-2 fw-600 text-black py-3 bg-light' type="text" placeholder="2 Min" />
                                                        </Col>
                                                        <Col sm="4">
                                                            <Form.Control className='shadow-none border border-2 fw-600 text-black py-3 bg-light' type="text" placeholder="10 Reps" />
                                                        </Col>
                                                    </Form.Group>
                                                    <Button className='rounded-0 border-0 text-green px-0 py-0 bg-none fw-600 fs-15 upload-vdo' onClick={() => setShowUploadVideoModal(true)}>Upload Video</Button>
                                                </div> */}
                                    </div>
                                    <div className='d-flex gap-3 mt-4'>
                                        <Button className='workout-btn text-green custom-border bg-white d-block w-100 py-3 fs-6 fw-600' onClick={handleRepeatClick}>Add more elements</Button>
                                        <Button className='workout-btn text-white custom-border bg-green d-block w-100 py-3 fs-6 fw-600' onClick={createUpdateWorkoutElements}>Save workout</Button>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showFeedbackModal} size="sm" onHide={() => setShowFeedbackModal(false)}>
                {/* <Modal.Header className='text-center border-0' closeButton>
                    <Modal.Title>Delete Recipe</Modal.Title>
                </Modal.Header> */}
                <Modal.Body>
                    <div>
                        <div className=''>
                            <h4 className='text-dark mb-0 fw-600 fs-4'>How would you rate today workout? </h4>
                            <div className='text-center star-rating'>
                                <Ratings />
                            </div>
                            <Form.Control as="textarea" rows={3} placeholder='Comments' />
                        </div>

                        <Button className='bg-green text-white w-100 d-block py-2 custom-shadow border-0 mt-3 mb-2'>Share Feedback</Button>
                        <Button className='bg-none text-dark w-100 d-block py-0 border-0' onClick={() => setShowFeedbackModal(false)}>No Thanks</Button>

                    </div>
                </Modal.Body>
            </Modal>

            <Modal
                aria-labelledby='contained-modal-title-vcenter'
                centered
                show={showUploadVideoModal}
                size='sm'
                onHide={handleModalClose}
            >

                <Modal.Body>
                    <div>
                        <div className=''>
                            <div class="wrapper-2 mt-0 bg-white border rounded text-center mb-2">
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        // Prevent event propagation
                                        e.stopPropagation();
                                        handleFileChange(selectedElementIndex, e);
                                    }}
                                    accept="video/*"
                                    style={{ display: 'none' }}
                                    // ref={fileInputRefs.current[selectedElementIndex]}
                                    ref={fileInput => fileVideoRef.current[selectedElementIndex] = fileInput}
                                />
                                {/* <input type="file" id="file" /> */}

                                {videoFiles[selectedElementIndex] == null ? <label for="file" className='text-muted mt-0 fw-600 p-4 pt-0'
                                    onClick={() => {
                                        const fileInput = fileVideoRef.current[selectedElementIndex];
                                        if (fileInput) {
                                            fileInput.click();
                                        }
                                    }}
                                ><svg className='mx-auto mb-2 d-block' xmlns="http://www.w3.org/2000/svg" width="51" height="51" viewBox="0 0 51 51" fill="none">
                                        <path d="M14.5623 34.8744C0.499813 36.4369 2.06231 19.2494 14.5623 20.8119C9.87481 3.62437 36.4373 3.62437 34.8748 16.1244C50.4998 11.4369 50.4998 36.4369 36.4373 34.8744M17.6873 28.6244L25.4998 22.3744M25.4998 22.3744L33.3123 28.6244M25.4998 22.3744V45.8119" stroke="#85C52E" stroke-width="1.40845" stroke-linecap="round" strokeLinejoin="round" />
                                    </svg>Upload Video</label>
                                    :
                                    <label for="file"
                                        onClick={() => {
                                            const fileInput = fileVideoRef.current[selectedElementIndex];
                                            if (fileInput) {
                                                fileInput.click();
                                            }
                                        }}>Video selected</label>}

                            </div>
                            <div class="wrapper-2 mt-0 bg-white border rounded text-center mb-2">
                                <input
                                    type="file"
                                    onChange={(e) => {
                                        // Prevent event propagation
                                        e.stopPropagation();
                                        handleMobFileChange(selectedElementIndex, e);
                                    }}
                                    accept="video/*"
                                    style={{ display: 'none' }}
                                    // ref={fileInputRefs.current[selectedElementIndex]}
                                    ref={fileInput => fileMobVideoRef.current[selectedElementIndex] = fileInput}
                                />
                                {/* <input type="file" id="file" /> */}
                                {mobVideoFiles[selectedElementIndex] == null ? <label for="file" className='text-muted mt-0 fw-600 p-4 pt-0'
                                    onClick={() => {
                                        const fileInput = fileMobVideoRef.current[selectedElementIndex];
                                        if (fileInput) {
                                            fileInput.click();
                                        }
                                    }}
                                ><svg className='mx-auto mb-2 d-block' xmlns="http://www.w3.org/2000/svg" width="51" height="51" viewBox="0 0 51 51" fill="none">
                                        <path d="M14.5623 34.8744C0.499813 36.4369 2.06231 19.2494 14.5623 20.8119C9.87481 3.62437 36.4373 3.62437 34.8748 16.1244C50.4998 11.4369 50.4998 36.4369 36.4373 34.8744M17.6873 28.6244L25.4998 22.3744M25.4998 22.3744L33.3123 28.6244M25.4998 22.3744V45.8119" stroke="#85C52E" stroke-width="1.40845" stroke-linecap="round" strokeLinejoin="round" />
                                    </svg>Upload Mobile Video</label>
                                    :
                                    <label for="file"
                                        onClick={() => {
                                            const fileInput = fileMobVideoRef.current[selectedElementIndex];
                                            if (fileInput) {
                                                fileInput.click();
                                            }
                                        }}>Video selected</label>}
                            </div>
                        </div>

                        <Button className='bg-green text-white w-100 d-block py-2 custom-shadow border-0 mt-3 mb-2' onClick={() => handleVideoSave(selectedElementIndex)}>Save</Button>
                        <Button className='bg-none text-dark w-100 d-block py-0 border-0' onClick={() => setShowUploadVideoModal(false)}>No Thanks</Button>

                    </div>
                </Modal.Body>
            </Modal>

            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showWorkoutcardModal} size="sm" onHide={() => setShowWorkoutcardModal(false)}>
                <Modal.Body>
                    <div>
                        <div className=''>
                            <div className=''>
                                <div class="wrapper-2 mt-0 bg-white border rounded text-center mb-2">
                                    <input type="file" ref={inputref} id="file" accept="image/*" onChange={handleCardImage} />
                                    {!selectedCardImage ?
                                        <label for="file" className='text-muted mt-0 fw-600 p-3 pt-0'><svg className='mx-auto mb-2 d-block' xmlns="http://www.w3.org/2000/svg" width="71" height="71" viewBox="0 0 71 71" fill="none">
                                            <path d="M53.25 8.875H17.75C15.3962 8.875 13.1388 9.81004 11.4744 11.4744C9.81004 13.1388 8.875 15.3962 8.875 17.75V53.25C8.875 55.6038 9.81004 57.8612 11.4744 59.5256C13.1388 61.19 15.3962 62.125 17.75 62.125H53.25C55.6038 62.125 57.8612 61.19 59.5256 59.5256C61.19 57.8612 62.125 55.6038 62.125 53.25V17.75C62.125 15.3962 61.19 13.1388 59.5256 11.4744C57.8612 9.81004 55.6038 8.875 53.25 8.875ZM23.6667 20.7083C24.5443 20.7083 25.4023 20.9686 26.132 21.4562C26.8618 21.9438 27.4305 22.6368 27.7664 23.4477C28.1022 24.2585 28.1901 25.1508 28.0189 26.0115C27.8477 26.8723 27.425 27.663 26.8045 28.2836C26.1839 28.9042 25.3932 29.3268 24.5324 29.4981C23.6716 29.6693 22.7794 29.5814 21.9685 29.2455C21.1577 28.9097 20.4646 28.3409 19.977 27.6112C19.4894 26.8814 19.2292 26.0235 19.2292 25.1458C19.2292 23.9689 19.6967 22.8402 20.5289 22.008C21.3611 21.1759 22.4898 20.7083 23.6667 20.7083ZM56.2083 52.7471C56.2737 53.5981 55.999 54.4403 55.4445 55.0891C54.8899 55.7379 54.1008 56.1404 53.25 56.2083H17.75L40.1446 36.0325C40.5206 35.6895 41.0112 35.4993 41.5202 35.4993C42.0292 35.4993 42.5198 35.6895 42.8958 36.0325L56.2083 49.2858V52.7471Z" fill="#85C52E" />
                                        </svg>Upload Image</label>
                                        :
                                        <img src={selectedCardImage} width={'100%'} height={'100%'} onClick={handleImageChange} />
                                    }
                                </div>
                                <Form.Select aria-label="Default select example" className='shadow-none border-0 outline-0 text-center py-2 text-green bg-lightgreen' name="workoutType" // Set the name attribute
                                    value={workoutCard?.workoutType} onChange={handleWorkoutCard}>
                                    <option>Select Workout Type</option>
                                    <option value="Anterior">Anterior</option>
                                    <option value="Posterior">Posterior</option>
                                    <option value="Upper Body">Upper Body</option>
                                    <option value="Lower Body">Lower Body</option>
                                    <option value="Metabolic Conditioning">Metabolic Conditioning</option>
                                    <option value="Athletic Conditioning">Athletic Conditioning</option>
                                    
                                </Form.Select>
                                <Form.Group as={Row} className="my-3" controlId="formPlaintextEmail">
                                    <Form.Label column sm="8" className='fs-6 fw-600 text-black'>
                                        Enter Workout Time:
                                    </Form.Label>
                                    <Col sm="4">
                                        <TimePicker
                                            className='custom-timepicker1'
                                            format="mm:ss"
                                            value={workoutCard?.workoutTime ? moment(workoutCard?.workoutTime, 'mm:ss') : moment('00:00', 'mm:ss')}
                                            onSelect={(value) => {
                                                // Convert the selected value to a moment object
                                                const selectedTime = moment(value);

                                                // Ensure that the selectedTime object has at least '00' seconds
                                                if (selectedTime.seconds() === 0) {
                                                    // Set seconds to "00"
                                                    selectedTime.seconds(0);
                                                }

                                                // Format the selected time as "mm:ss"
                                                const timeString = selectedTime.format("mm:ss");

                                                // Update the workoutTime in your state
                                                setWorkoutCard(prev => ({ ...prev, workoutTime: timeString }));
                                            }}

                                        />
                                    </Col>
                                </Form.Group>
                            </div>
                        </div>
                        <Button className='bg-green text-white w-100 d-block py-2 custom-shadow border-0 mt-2 mb-2' onClick={createUpdateWorkoutCard}>Save Workout Card</Button>
                        <Button className='bg-none text-dark w-100 d-block py-0 border-0' onClick={() => {
                            setShowWorkoutcardModal(false);
                            // setWorkoutCard(initialWorkoutCardData); 
                            // setSelectedCardImage(null); 
                            // setSelectedCardImageFile(null) 
                        }}>No Thanks</Button>

                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
