import React, { useState, useRef, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { Button, Col, Form, Modal, Pagination, Row, Table } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import UserSidebar from '../User_components/UserSidebar';
import axios from 'axios';
import ReactPlayer from 'react-player'
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom';

export default function ExerciseDatabase() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [showDatabaseModal, setShowDatabaseModal] = useState(false)
    const [FilterStatus, setFilterStatus] = useState(false)
    const [exercises, setExercises] = useState([])
    const [selectedFilterColumn, setSelectedFilterColumn] = useState('exerciseName')
    const [totalPages, setTotalPages] = useState()
    const [totalRecords, setTotalRecords] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(5)
    const [selectedExercise, setSelectedExercise] = useState(null)
    const [search, setSearch] = useState()
    // const [videoSource, setVideoSource] = useState('');
    // const [youtubeUrl, setYoutubeUrl] = useState('');
    const [inputDisabled, setInputDisabled] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleVideoProgress = (state) => {
        // Check the video's progress to determine if it's playing
        setIsPlaying(state.played > 0);
    };
    // const [name, setName] = useState('');
    // const [level, setLevel] = useState('');
    // const [equipment, setEquipment] = useState('');
    // const [type, setType] = useState('');
    // const [primaryMuscle, setPrimaryMuscle] = useState('');
    // const [secondaryMuscle, setSecondaryMuscle] = useState('');
    // const [date, setDate] = useState('');
    // const token = JSON.parse(localStorage.getItem('userdata'));
    // const [workoutData, setWorkoutData] = useState([]);
    // const [filterText, setFilterText] = useState('');
    // console.log("TOKEN", token?.token)

    const fetchExercises = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getExercises?page=${currentPage}&&perPage=${perPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())

        if (res.status) {
            setExercises(res?.data?.data)
            setTotalPages(res?.data?.totalPages)
            setTotalRecords(res?.data?.totalRecords)
        }
    }

    const handleDropdownButton = () => {
        setFilterStatus(!FilterStatus)
    }

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCheckboxChange = (event) => {
        const { value } = event.target;
        setSelectedFilterColumn(value)
        // if (selectedFilterColumns.includes(value)) {
        //     // If the label is already in selectedColumns, remove it
        //     setSelectedFilterColumns(selectedFilterColumns.filter((column) => column !== value));
        // } else {
        //     // If the label is not in selectedColumns, add it
        //     setSelectedFilterColumns([...selectedFilterColumns, value]);
        // }
    };

    const handleInputChange = (e) => {
        setSearch(e.target.value);
        // filterTableData();
    };


    // Hanlde Video Drag & Drop and Youtube URL
    // const onDrop = (acceptedFiles) => {
    //     // Handle local video upload
    //     const file = acceptedFiles[0];
    //     const videoURL = URL.createObjectURL(file);
    //     setVideoSource(videoURL);
    //     setInputDisabled(true);
    // };

    // const onYoutubeUrlChange = (e) => {
    // setYoutubeUrl(e.target.value);
    // };

    // // Loading youtubr video
    // const loadYoutubeVideo = () => {
    // // Handle YouTube video load
    // // Extract video ID from YouTube URL
    // const videoId = extractVideoId(youtubeUrl);
    // if (videoId) {
    //     setVideoSource(`https://www.youtube.com/embed/${videoId}`);
    //     setInputDisabled(true);
    // } else {
    //     console.error('Invalid YouTube URL');
    // }
    // };


    // const extractVideoId = (url) => {
    //     const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:[^\/\n\s]+\/\S+\/|(?:v|e(?:mbed)?)\/|\S*?[?&]v=)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    //     return match ? match[1] : null;
    // };

    // const { getRootProps, getInputProps } = useDropzone({
    //     onDrop,
    //     accept: 'video/*', // Accept only video files
    // });

    // const removeVideo = () => {
    //     setVideoSource('');
    //     setYoutubeUrl('');
    //     setInputDisabled(false);
    // };

    // Add Exercise API
    // const handleAddExercise = (e) => {
    //     e.preventDefault();
    //     const formData = new FormData();
    //     formData.append('exercise_name', name);
    //     formData.append('exercise_lebel', level);
    //     formData.append('exercise_equipment', equipment);
    //     formData.append('exercise_type', type);
    //     formData.append('primary_muscles_work', primaryMuscle);
    //     formData.append('secondary_muscles_work', secondaryMuscle);
    //     formData.append('exercise_video', videoSource != '' ? videoSource :  youtubeUrl);
    //     formData.append('date', date);

    //     axios.post(`${process.env.REACT_APP_BASE_URL}/workout/addWorkout`, formData,  {
    //         headers: {
    //             Authorization: `Bearer ${token?.token}`,
    //             // "ngrok-skip-browser-warning": "69420",
    //           },
    //     })
    //     .then(function (response) {
    //         console.log("Exersice Added", response);
    //         setShowDatabaseModal(false)
    //         axios.get(`${process.env.REACT_APP_BASE_URL}/workout/getmyworkout`, {
    //             headers: {
    //                 Authorization: `Bearer ${token?.token}`,
    //                 // "ngrok-skip-browser-warning": "69420",
    //               },
    //         })
    //         .then(function (response) {
    //             console.log("Exersice List", response);
    //             setWorkoutData(response.data.data)
    //         })
    //         .catch(function (error) {
    //             console.log(error);
    //         });
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    // }

    // Get single data of workout item API
    // const hanldleSingleWorkoutData = (e, id) => {
    //     e.preventDefault();
    //     axios.post(`${process.env.REACT_APP_BASE_URL}/workout/getoneworkout`, {
    //         id: id
    //     }, {
    //         headers: {
    //             Authorization: `Bearer ${token?.token}`,
    //             "ngrok-skip-browser-warning": "69420",
    //           },
    //     })
    //     .then(function (response) {
    //         console.log("Get Data", response);
    //         setShowDatabaseModal(true)
    //         setName(response.data.detail.exercise_name)
    //         setEquipment(response.data.detail.exercise_equipment)
    //         setType(response.data.detail.exercise_type)
    //         setLevel(response.data.detail.exercise_lebel)
    //         setPrimaryMuscle(response.data.detail.primary_muscles_work)
    //         setSecondaryMuscle(response.data.detail.secondary_muscles_work)
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    // }

    // const handleHideModal = () => {
    //     setShowDatabaseModal(false)
    //     setName('')
    //     setEquipment('')
    //     setType('')
    //     setLevel('')
    //     setPrimaryMuscle('')
    //     setSecondaryMuscle('')
    // }

    // Assuming workoutData is your original data array
    // const filteredWorkoutData = filterText
    //     ? workoutData.filter(data =>
    //         data.exercise_name.toLowerCase().includes(filterText.toLowerCase())
    //       )
    //     : workoutData;

    // const handleFilterChange = (e) => {
    //     setFilterText(e.target.value);
    // };

    useEffect(() => {
        fetchExercises()
    }, [currentPage])


    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        } else {
            fetchExercises()
        }
    }, [])

    // console.log("videoSource", videoSource);
    // console.log("youtubeUrl" ,youtubeUrl)
    // console.log("FilterStatus", FilterStatus)

    return (
        <div>
            <div className='mt-1 main-content p-4'>
                <div className='bg-white p-4 rounded-32'>
                    <Row className='align-items-center'>
                        <Col lg={7}>
                            <div className='d-flex justify-content-between gap-4'>
                                <Form.Control className='bg-light' type="search" value={search} placeholder='Search' onChange={handleInputChange} />
                                <div className='position-relative'>
                                    <Button className='text-custom-grey mb-0 fw-600 fs-17 bg-none border border-gray px-3 d-flex align-items-center' onClick={() => handleDropdownButton()}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                                        <path d="M0.918945 0H16.7566V2.56205H0.918945V0Z" fill="#959595" />
                                        <path d="M9.30334 10.7136H6.74145V13.9742L10.9338 17.2348L10.9336 10.2476L15.3355 3.74951H2.33936L6.50838 9.78179H9.30322C9.55942 9.78179 9.76899 10.038 9.76899 10.2942C9.76899 10.5504 9.55941 10.7133 9.30322 10.7133L9.30334 10.7136Z" fill="#959595" />
                                    </svg>Filter</Button>
                                    {
                                        FilterStatus ?
                                            <div className='custom-dropdown active bg-white rounded shadow'>
                                                <Form.Group className="mb-2" controlId="formBasicCheckbox">
                                                    <Form.Check type="checkbox" label="Exercise Name" value="exerciseName" checked={selectedFilterColumn === "exerciseName" ? true : false} onChange={(e) => { handleCheckboxChange(e); handleDropdownButton() }} />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="formBasicCheckbox1">
                                                    <Form.Check type="checkbox" label="Muscles Worked" value="musclesWorked" checked={selectedFilterColumn === "musclesWorked" ? true : false} onChange={(e) => { handleCheckboxChange(e); handleDropdownButton() }} />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="formBasicCheckbox2">
                                                    <Form.Check type="checkbox" label="Difficulty Level" value="difficultyLevel" checked={selectedFilterColumn === "difficultyLevel" ? true : false} onChange={(e) => { handleCheckboxChange(e); handleDropdownButton() }} />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="formBasicCheckbox3">
                                                    <Form.Check type="checkbox" label="Exercise Type" value="exerciseType" checked={selectedFilterColumn === "exerciseType" ? true : false} onChange={(e) => { handleCheckboxChange(e); handleDropdownButton() }} />
                                                </Form.Group>
                                            </div> :
                                            <div className='custom-dropdown bg-white rounded shadow'>
                                                <Form.Group className="mb-2" controlId="formBasicCheckbox">
                                                    <Form.Check type="checkbox" label="Exercise Name" />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="formBasicCheckbox1">
                                                    <Form.Check type="checkbox" label="Muscles Worked" />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="formBasicCheckbox2">
                                                    <Form.Check type="checkbox" label="Difficulty Level" />
                                                </Form.Group>
                                                <Form.Group className="mb-2" controlId="formBasicCheckbox3">
                                                    <Form.Check type="checkbox" label="Exercise Type" />
                                                </Form.Group>
                                            </div>
                                    }
                                </div>
                            </div>
                        </Col>
                        <Col lg={5}>
                            <div className='text-end'>
                                <Button className='rounded py-2 text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 px-3 text-decoration-none'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M15.5 6.14545V9.85455H9.73864V16H6.26136V9.85455H0.5V6.14545H6.26136V0H9.73864V6.14545H15.5Z" fill="white" />
                                </svg>Add an exercise</Button>
                            </div>
                        </Col>
                        <Col lg={12} className='mt-3'>
                            <div className='exercise-table'>
                                <Table responsive="sm">
                                    <thead>
                                        <tr>
                                            <th>Exercise Name</th>
                                            <th>Muscles Worked</th>
                                            <th>Difficulty Level</th>
                                            <th>Exercise Type(s)</th>
                                            <th></th>

                                        </tr>
                                    </thead>
                                    <tbody>
                                        {exercises && exercises.length > 0 ? exercises.filter(items => selectedFilterColumn && search ? items[selectedFilterColumn].toLowerCase().includes(search.toLowerCase()) : items).map((exercise, i) => (
                                            <tr key={i}>
                                                <td>{exercise?.exerciseName}</td>
                                                <td>{exercise?.musclesWorked}</td>
                                                <td>{exercise?.difficultyLevel}</td>
                                                <td>{exercise?.exerciseType}</td>
                                                <td>
                                                    <Button className='bg-none border-0 text-green fs-15 py-0' onClick={() => { setSelectedExercise(exercise); setShowDatabaseModal(true) }}>
                                                        {/* <svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.0034 20.4508L18.7897 9.08829C19.2673 8.47556 19.437 7.76715 19.2779 7.04584C19.1399 6.39011 18.7367 5.76662 18.1318 5.29364L16.6568 4.12192C15.3728 3.10069 13.7811 3.20819 12.8685 4.37991L11.8816 5.6602C11.7543 5.82037 11.7861 6.05687 11.9453 6.18586C11.9453 6.18586 14.439 8.18531 14.492 8.22831C14.6618 8.38956 14.7892 8.60455 14.821 8.86255C14.8741 9.36778 14.5239 9.84077 14.0039 9.90527C13.7598 9.93752 13.5264 9.86227 13.3566 9.72252L10.7355 7.63708C10.6082 7.5414 10.4172 7.56183 10.3111 7.69083L4.08209 15.7531C3.67885 16.2584 3.5409 16.9141 3.67885 17.5483L4.47472 20.999C4.51717 21.1817 4.67634 21.3107 4.86735 21.3107L8.36917 21.2677C9.00586 21.257 9.60011 20.9667 10.0034 20.4508ZM14.9066 19.3761H20.6167C21.1738 19.3761 21.627 19.8351 21.627 20.3995C21.627 20.9649 21.1738 21.4229 20.6167 21.4229H14.9066C14.3495 21.4229 13.8964 20.9649 13.8964 20.3995C13.8964 19.8351 14.3495 19.3761 14.9066 19.3761Z" fill="#82C526" />
                                                                </svg> */}
                                                        View
                                                    </Button>
                                                </td>
                                            </tr>
                                        ))
                                            :
                                            <>No exercises found</>
                                        }
                                    </tbody>
                                </Table>
                                <div className='p-3 pagination-container'>
                                    <Row>
                                        <Col lg={6}>
                                            <p className='text-muted fs-6'>{`Showing 1 - ${exercises.length} out of ${totalRecords}`}</p>
                                        </Col>
                                        <Col lg={6} className='text-end'>
                                            <Pagination className='justify-content-end'>
                                                <Pagination.Prev
                                                    onClick={() => handlePageClick(currentPage - 1)}
                                                    disabled={currentPage === 1}
                                                />
                                                {Array.from({ length: totalPages }).map((_, index) => (
                                                    <Pagination.Item
                                                        key={index}
                                                        active={index + 1 === currentPage}
                                                        onClick={() => handlePageClick(index + 1)}
                                                    >
                                                        {index + 1}
                                                    </Pagination.Item>
                                                ))}
                                                <Pagination.Next
                                                    onClick={() => handlePageClick(currentPage + 1)}
                                                    disabled={currentPage === totalPages}
                                                />
                                            </Pagination>
                                        </Col>
                                    </Row>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showDatabaseModal} size="xl" onHide={() => { setShowDatabaseModal(false); setIsPlaying(false) }}>
                <Modal.Header className='text-center border-0 custom-modal-header-2' closeButton>
                    <span></span>
                    <Modal.Title className='text-dark'>Exercise</Modal.Title>
                </Modal.Header>
                <Modal.Body className='px-5 pb-5 pt-0'>
                    <div>
                        <Row>
                            <Col lg={7}>
                                <div className='exercise-modal-video position-relative h-100'>
                                    {!isPlaying && (<Button className='video-play-btn' onClick={handlePlayPause}><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                                        <g id="Icon Frame">
                                            <path id="Union" fillRule="evenodd" clipRule="evenodd" d="M28.4375 21.2891C31.3542 19.6052 31.3542 15.3953 28.4375 13.7114L15.3125 6.13368C12.3958 4.44975 8.75 6.55466 8.75 9.92254V25.078C8.75 28.4459 12.3958 30.5508 15.3125 28.8668L28.4375 21.2891Z" fill="#85C52E" />
                                        </g>
                                    </svg></Button>)}

                                    <ReactPlayer
                                        url={selectedExercise?.webVideo}
                                        width="100%"
                                        height="100%"
                                        controls
                                        playing={isPlaying}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                    />


                                    {/* <ReactPlayer 
                            url={selectedExercise?.webVideo} 
                            height="100%" 
                            width="100%" 
                            id="video" 
                            preload="metadata" 
                            playIcon={<Button className='video-play-btn'><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                                <g id="Icon Frame">
                                    <path id="Union" fillRule="evenodd" clipRule="evenodd" d="M28.4375 21.2891C31.3542 19.6052 31.3542 15.3953 28.4375 13.7114L15.3125 6.13368C12.3958 4.44975 8.75 6.55466 8.75 9.92254V25.078C8.75 28.4459 12.3958 30.5508 15.3125 28.8668L28.4375 21.2891Z" fill="#85C52E" />
                                </g>
                            </svg></Button>}
                            light={<img width='100%' height='100%' src="" alt='' />} 
                            controls/> */}
                                    {/* {videoSource ? (
                                    <>
                                    {youtubeUrl ? (
                                        <iframe
                                        title='video-player'
                                        className='object-fit-cover'
                                        height='100%'
                                        width='100%'
                                        src={videoSource}
                                        allowFullScreen
                                        />
                                    ) : (
                                        <video
                                        title='video-player'
                                        className='object-fit-cover'
                                        height='100%'
                                        width='100%'
                                        src={videoSource}
                                        ref={videoRef}
                                        controls
                                        />
                                    )}
                                    <button onClick={removeVideo} className='video-back'>
                                        <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44.952 44.952" style={{transform: 'rotate(-180deg)', height: 15, width: 15}}><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g> <path d="M44.952,22.108c0-1.25-0.478-2.424-1.362-3.308L30.627,5.831c-0.977-0.977-2.561-0.977-3.536,0 c-0.978,0.977-0.976,2.568,0,3.546l10.574,10.57H2.484C1.102,19.948,0,21.081,0,22.464c0,0.003,0,0.025,0,0.028 c0,1.382,1.102,2.523,2.484,2.523h35.182L27.094,35.579c-0.978,0.978-0.978,2.564,0,3.541c0.977,0.979,2.561,0.978,3.538-0.001 l12.958-12.97c0.885-0.882,1.362-2.059,1.362-3.309C44.952,22.717,44.952,22.231,44.952,22.108z"></path> </g> </g></svg>
                                    </button>
                                    </>
                                ) : (
                                    <div className='video-box d-flex flex-column justify-content-center align-items-center h-100' style={{ cursor: 'pointer', textAlign: 'center', padding: '20px', border: '2px solid #ccc', borderRadius: '10px' }}>
                                        <p className='mb-1'>Enter YouTube URL:</p>
                                        <input type='text' value={youtubeUrl} onChange={onYoutubeUrlChange} disabled={inputDisabled} />
                                        <button onClick={loadYoutubeVideo} className='rounded py-2 mt-3 text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 px-3 you btn btn-primary'>Load Video</button>
                                        <p className='my-2'>or</p>
                                        <div {...getRootProps()} style={{ cursor: 'pointer', textAlign: 'center', padding: '20px', border: '2px dashed #ccc', borderRadius: '10px' }}>
                                            <input {...getInputProps()} />
                                            <p className='m-0'>Drag & drop a video file here</p>
                                        </div>
                                    </div>
                                )}
                                {videoSource && !youtubeUrl && (
                                    <button onClick={handlePlayPause} className='video-play-btn'>
                                        {isPlaying ? (
                                            <svg height="35px" id="Layer_1" version="1.1" className="play-icon" style={{fill: '#85c52e' }} viewBox="0 0 512 512" width="35px"  xmlns="http://www.w3.org/2000/svg" ><g><path d="M224,435.8V76.1c0-6.7-5.4-12.1-12.2-12.1h-71.6c-6.8,0-12.2,5.4-12.2,12.1v359.7c0,6.7,5.4,12.2,12.2,12.2h71.6   C218.6,448,224,442.6,224,435.8z"/><path d="M371.8,64h-71.6c-6.7,0-12.2,5.4-12.2,12.1v359.7c0,6.7,5.4,12.2,12.2,12.2h71.6c6.7,0,12.2-5.4,12.2-12.2V76.1   C384,69.4,378.6,64,371.8,64z"/></g></svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" className="play-icon" viewBox="0 0 35 35" fill="none">
                                                <g id="Icon Frame">
                                                    <path id="Union" fillRule="evenodd" clipRule="evenodd" d="M28.4375 21.2891C31.3542 19.6052 31.3542 15.3953 28.4375 13.7114L15.3125 6.13368C12.3958 4.44975 8.75 6.55466 8.75 9.92254V25.078C8.75 28.4459 12.3958 30.5508 15.3125 28.8668L28.4375 21.2891Z" fill="#85C52E" />
                                                </g>
                                            </svg>
                                        )}
                                        
                                    </button>
                                )} */}
                                </div>
                            </Col>
                            <Col lg={5}>
                                <div className=''>
                                    <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                        <Form.Control className='shadow-none border fw-600 text-black py-2 bg-grey' type="text" placeholder="Exercise Name" value={selectedExercise?.exerciseName} />
                                    </Form.Group>
                                    <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                        <Form.Control className='shadow-none border fw-600 text-black py-2 bg-grey' type="text" placeholder="Exercise Level" value={selectedExercise?.difficultyLevel} />
                                    </Form.Group>
                                    <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                        <Form.Control className='shadow-none border fw-600 text-black py-2 bg-grey' type="text" placeholder="Equipment" />
                                    </Form.Group>
                                    <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                        <Form.Control className='shadow-none border fw-600 text-black py-2 bg-grey' type="text" placeholder="Exercise Type(s)" value={selectedExercise?.exerciseType} />
                                    </Form.Group>
                                    <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                        <Form.Control className='shadow-none border fw-600 text-black py-2 bg-grey' type="text" placeholder="Primary Muscles Worked" value={selectedExercise?.musclesWorked} />
                                    </Form.Group>
                                    <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                        <Form.Control className='shadow-none border fw-600 text-black py-2 bg-grey' type="text" placeholder="Secondary Muscles Worked" />
                                    </Form.Group>
                                    {/* <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                        <Form.Control className='shadow-none border fw-600 text-black py-2 bg-grey' type="date" value={date} onChange={(e) => setDate(e.target.value)} />
                                    </Form.Group> */}
                                    {/* <button className='rounded py-2 mt-3 text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 px-3 you btn btn-primary' >{name != '' ? "Update Exercise" : 'Add exercise'}</button> */}
                                </div></Col>
                        </Row>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
