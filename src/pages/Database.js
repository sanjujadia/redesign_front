import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Button, Col, Form, Modal, Pagination, Row, Table } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { toast, ToastContainer } from 'react-toastify'
import axios from 'axios'

export default function Database() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [showDatabaseModal, setShowDatabaseModal] = useState(false)
    const [exercises, setExercises] = useState([])
    const [totalPages, setTotalPages] = useState()
    const [totalRecords, setTotalRecords] = useState()
    const [currentPage, setCurrentPage] = useState(1)
    const [perPage, setPerPage] = useState(5)
    const [webVideo, setWebVideo] = useState()
    const [mobileVideo, setMobileVideo] = useState()
    const [exerciseName, setExerciseName] = useState()
    const [primaryMusclesWorked, setPrimaryMusclesWorked] = useState()
    const [secondaryMusclesWorked, setSecondaryMusclesWorked] = useState()
    const [equipment, setEquipment] = useState()
    const [difficultyLevel, setDifficultyLevel] = useState()
    const [exerciseType, setExerciseType] = useState()
    const [selectedExercise, setSelectedExercise] = useState()
    const [selectedFilterColumn, setSelectedFilterColumn] = useState('exerciseName')
    const [search, setSearch] = useState()
    const [FilterStatus, setFilterStatus] = useState()


    const handleDropdownButton = () => {
        setFilterStatus(!FilterStatus)
    }

    const handlePageClick = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const fetchExercises = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getExercises?page=${currentPage}&&perPage=${perPage}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(res => res.json())

        if (res.status) {
            console.log(res?.data?.data)
            setExercises(res?.data?.data)
            setTotalPages(res?.data?.totalPages)
            setTotalRecords(res?.data?.totalRecords)
        }
    }

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

    const handleEditExercise = (exercise) => {
        setSelectedExercise(exercise)
        setExerciseName(exercise.exerciseName)
        setWebVideo(exercise.webVideo)
        setMobileVideo(exercise.mobileVideo)
        setPrimaryMusclesWorked(exercise.primaryMusclesWorked)
        setSecondaryMusclesWorked(exercise.secondaryMusclesWorked)
        setEquipment(exercise.equipment)
        setDifficultyLevel(exercise.difficultyLevel)
        setExerciseType(exercise.exerciseType)
        setShowDatabaseModal(true)
    }

    const handleAddExercise = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/createExercise`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ exerciseName, webVideo, mobileVideo, primaryMusclesWorked, secondaryMusclesWorked, equipment, difficultyLevel, exerciseType })
        }).then(res => res.json())

        if (res.status) {
            fetchExercises()
            // setExercises(current => [...current, res?.data])
            setShowDatabaseModal(false)
        }
    }

    const handleExerciseUpdate = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/updateExercise`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: selectedExercise?._id, exerciseName, webVideo, mobileVideo, primaryMusclesWorked, secondaryMusclesWorked, equipment, difficultyLevel, exerciseType })
        }).then(res => res.json())

        if (res.status) {
            setSelectedExercise(null)
            setExerciseName('')
            setWebVideo('')
            setMobileVideo('')
            setPrimaryMusclesWorked('')
            setSecondaryMusclesWorked('')
            setEquipment('')
            setDifficultyLevel('')
            setExerciseType('')
            setShowDatabaseModal(false)
            fetchExercises()
            toast.success(res.message)
        }
    }

    const handleExerciseDelete = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/deleteExercise`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: selectedExercise?._id })
        }).then(res => res.json())

        if (res.status) {
            setSelectedExercise(null)
            setExerciseName('')
            setWebVideo('')
            setMobileVideo('')
            setPrimaryMusclesWorked('')
            setSecondaryMusclesWorked('')
            setEquipment('')
            setDifficultyLevel('')
            setExerciseType('')
            setShowDatabaseModal(false)
            fetchExercises()
            toast.success(res.message)
        }
    }

    const handleNewExercise = () => {
        setExerciseName('')
        setWebVideo('')
        setMobileVideo('')
        setPrimaryMusclesWorked('')
        setSecondaryMusclesWorked('')
        setEquipment('')
        setDifficultyLevel('')
        setExerciseType('')
        setShowDatabaseModal(true)
    }


    // // Hanlde Video Drag & Drop and Youtube URL
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

    // // Play/Pause buttons
    // const handlePlayPause = () => {
    //     if (videoRef.current) {
    //         if (videoRef.current.paused) {
    //           videoRef.current.play();
    //           setIsPlaying(true);
    //         } else {
    //           videoRef.current.pause();
    //           setIsPlaying(false);
    //         }
    //       }
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

    // // Add Exercise API
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
    //             "ngrok-skip-browser-warning": "69420",
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

    // // Get single data of workout item API
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

    // // Assuming workoutData is your original data array
    // const filteredWorkoutData = filterText
    //     ? workoutData.filter(data =>
    //         data.exercise_name.toLowerCase().includes(filterText.toLowerCase())
    //       )
    //     : workoutData;

    // const handleFilterChange = (e) => {
    //     setFilterText(e.target.value);
    // };

    //  // GET workout list
    //  useEffect(() => {
    //     axios.get(`${process.env.REACT_APP_BASE_URL}/workout/getmyworkout`, {
    //         headers: {
    //             Authorization: `Bearer ${token?.token}`,
    //             // "ngrok-skip-browser-warning": "69420",
    //           },
    //     })
    //     .then(function (response) {
    //         console.log("Exersice List", response);
    //         setWorkoutData(response.data.data)
    //     })
    //     .catch(function (error) {
    //         console.log(error);
    //     });
    // }, [])

    // console.log("videoSource", videoSource);
    // console.log("youtubeUrl" ,youtubeUrl)
    // console.log("FilterStatus", FilterStatus)
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

    return (
        <div>
            <ToastContainer />
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
                                                    <Form.Check type="checkbox" label="Muscles Worked" value="primaryMusclesWorked" checked={selectedFilterColumn === "primaryMusclesWorked" ? true : false} onChange={(e) => { handleCheckboxChange(e); handleDropdownButton() }} />
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
                                            </div>}
                                </div>
                            </div>
                        </Col>
                        <Col lg={5}>
                            <div className='text-end'>
                                <Button className='rounded py-2 text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 px-3 text-decoration-none' onClick={handleNewExercise}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
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
                                        {exercises && exercises.length > 0 ? exercises
                                            .filter(items => 
                                            selectedFilterColumn && search ? 
                                            items[selectedFilterColumn]?.toLowerCase()?.includes(search.toLowerCase()) : 
                                            items)
                                        .map((exercise, i) => (
                                        <tr key={i}>
                                            <td>{exercise?.exerciseName}</td>
                                            <td>{exercise?.primaryMusclesWorked}</td>
                                            <td>{exercise?.difficultyLevel}</td>
                                            <td>{exercise?.exerciseType}</td>
                                            <td>
                                                <Button className='bg-none border-0 text-green fs-15 py-0' onClick={() => handleEditExercise(exercise)}>
                                                    <svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0034 20.4508L18.7897 9.08829C19.2673 8.47556 19.437 7.76715 19.2779 7.04584C19.1399 6.39011 18.7367 5.76662 18.1318 5.29364L16.6568 4.12192C15.3728 3.10069 13.7811 3.20819 12.8685 4.37991L11.8816 5.6602C11.7543 5.82037 11.7861 6.05687 11.9453 6.18586C11.9453 6.18586 14.439 8.18531 14.492 8.22831C14.6618 8.38956 14.7892 8.60455 14.821 8.86255C14.8741 9.36778 14.5239 9.84077 14.0039 9.90527C13.7598 9.93752 13.5264 9.86227 13.3566 9.72252L10.7355 7.63708C10.6082 7.5414 10.4172 7.56183 10.3111 7.69083L4.08209 15.7531C3.67885 16.2584 3.5409 16.9141 3.67885 17.5483L4.47472 20.999C4.51717 21.1817 4.67634 21.3107 4.86735 21.3107L8.36917 21.2677C9.00586 21.257 9.60011 20.9667 10.0034 20.4508ZM14.9066 19.3761H20.6167C21.1738 19.3761 21.627 19.8351 21.627 20.3995C21.627 20.9649 21.1738 21.4229 20.6167 21.4229H14.9066C14.3495 21.4229 13.8964 20.9649 13.8964 20.3995C13.8964 19.8351 14.3495 19.3761 14.9066 19.3761Z" fill="#82C526" />
                                                    </svg>
                                                    Edit
                                                </Button>
                                            </td>
                                        </tr>
                                        ))
                                        :
                                        <>No exercises found</>
                                        }


                                        {/* <tr>
                                                    <td>Exercise Name</td>
                                                    <td>Back of thigh</td>
                                                    <td>Beginner Bodyweight</td>
                                                    <td>Upper body,Lover body</td>
                                                    <td><Button className='bg-none border-0 text-green fs-15 py-0'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0034 20.4508L18.7897 9.08829C19.2673 8.47556 19.437 7.76715 19.2779 7.04584C19.1399 6.39011 18.7367 5.76662 18.1318 5.29364L16.6568 4.12192C15.3728 3.10069 13.7811 3.20819 12.8685 4.37991L11.8816 5.6602C11.7543 5.82037 11.7861 6.05687 11.9453 6.18586C11.9453 6.18586 14.439 8.18531 14.492 8.22831C14.6618 8.38956 14.7892 8.60455 14.821 8.86255C14.8741 9.36778 14.5239 9.84077 14.0039 9.90527C13.7598 9.93752 13.5264 9.86227 13.3566 9.72252L10.7355 7.63708C10.6082 7.5414 10.4172 7.56183 10.3111 7.69083L4.08209 15.7531C3.67885 16.2584 3.5409 16.9141 3.67885 17.5483L4.47472 20.999C4.51717 21.1817 4.67634 21.3107 4.86735 21.3107L8.36917 21.2677C9.00586 21.257 9.60011 20.9667 10.0034 20.4508ZM14.9066 19.3761H20.6167C21.1738 19.3761 21.627 19.8351 21.627 20.3995C21.627 20.9649 21.1738 21.4229 20.6167 21.4229H14.9066C14.3495 21.4229 13.8964 20.9649 13.8964 20.3995C13.8964 19.8351 14.3495 19.3761 14.9066 19.3761Z" fill="#82C526" />
                                                    </svg>Edit</Button></td>
                                                </tr>
                                                <tr>
                                                    <td>Exercise Name</td>
                                                    <td>Back of thigh</td>
                                                    <td>Beginner Bodyweight</td>
                                                    <td>Upper body,Lover body</td>
                                                    <td><Button className='bg-none border-0 text-green fs-15 py-0'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0034 20.4508L18.7897 9.08829C19.2673 8.47556 19.437 7.76715 19.2779 7.04584C19.1399 6.39011 18.7367 5.76662 18.1318 5.29364L16.6568 4.12192C15.3728 3.10069 13.7811 3.20819 12.8685 4.37991L11.8816 5.6602C11.7543 5.82037 11.7861 6.05687 11.9453 6.18586C11.9453 6.18586 14.439 8.18531 14.492 8.22831C14.6618 8.38956 14.7892 8.60455 14.821 8.86255C14.8741 9.36778 14.5239 9.84077 14.0039 9.90527C13.7598 9.93752 13.5264 9.86227 13.3566 9.72252L10.7355 7.63708C10.6082 7.5414 10.4172 7.56183 10.3111 7.69083L4.08209 15.7531C3.67885 16.2584 3.5409 16.9141 3.67885 17.5483L4.47472 20.999C4.51717 21.1817 4.67634 21.3107 4.86735 21.3107L8.36917 21.2677C9.00586 21.257 9.60011 20.9667 10.0034 20.4508ZM14.9066 19.3761H20.6167C21.1738 19.3761 21.627 19.8351 21.627 20.3995C21.627 20.9649 21.1738 21.4229 20.6167 21.4229H14.9066C14.3495 21.4229 13.8964 20.9649 13.8964 20.3995C13.8964 19.8351 14.3495 19.3761 14.9066 19.3761Z" fill="#82C526" />
                                                    </svg>Edit</Button></td>
                                                </tr>
                                                <tr>
                                                    <td>Exercise Name</td>
                                                    <td>Back of thigh</td>
                                                    <td>Beginner Bodyweight</td>
                                                    <td>Upper body,Lover body</td>
                                                    <td><Button className='bg-none border-0 text-green fs-15 py-0'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0034 20.4508L18.7897 9.08829C19.2673 8.47556 19.437 7.76715 19.2779 7.04584C19.1399 6.39011 18.7367 5.76662 18.1318 5.29364L16.6568 4.12192C15.3728 3.10069 13.7811 3.20819 12.8685 4.37991L11.8816 5.6602C11.7543 5.82037 11.7861 6.05687 11.9453 6.18586C11.9453 6.18586 14.439 8.18531 14.492 8.22831C14.6618 8.38956 14.7892 8.60455 14.821 8.86255C14.8741 9.36778 14.5239 9.84077 14.0039 9.90527C13.7598 9.93752 13.5264 9.86227 13.3566 9.72252L10.7355 7.63708C10.6082 7.5414 10.4172 7.56183 10.3111 7.69083L4.08209 15.7531C3.67885 16.2584 3.5409 16.9141 3.67885 17.5483L4.47472 20.999C4.51717 21.1817 4.67634 21.3107 4.86735 21.3107L8.36917 21.2677C9.00586 21.257 9.60011 20.9667 10.0034 20.4508ZM14.9066 19.3761H20.6167C21.1738 19.3761 21.627 19.8351 21.627 20.3995C21.627 20.9649 21.1738 21.4229 20.6167 21.4229H14.9066C14.3495 21.4229 13.8964 20.9649 13.8964 20.3995C13.8964 19.8351 14.3495 19.3761 14.9066 19.3761Z" fill="#82C526" />
                                                    </svg>Edit</Button></td>
                                                </tr>
                                                <tr>
                                                    <td>Exercise Name</td>
                                                    <td>Back of thigh</td>
                                                    <td>Beginner Bodyweight</td>
                                                    <td>Upper body,Lover body</td>
                                                    <td><Button className='bg-none border-0 text-green fs-15 py-0'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0034 20.4508L18.7897 9.08829C19.2673 8.47556 19.437 7.76715 19.2779 7.04584C19.1399 6.39011 18.7367 5.76662 18.1318 5.29364L16.6568 4.12192C15.3728 3.10069 13.7811 3.20819 12.8685 4.37991L11.8816 5.6602C11.7543 5.82037 11.7861 6.05687 11.9453 6.18586C11.9453 6.18586 14.439 8.18531 14.492 8.22831C14.6618 8.38956 14.7892 8.60455 14.821 8.86255C14.8741 9.36778 14.5239 9.84077 14.0039 9.90527C13.7598 9.93752 13.5264 9.86227 13.3566 9.72252L10.7355 7.63708C10.6082 7.5414 10.4172 7.56183 10.3111 7.69083L4.08209 15.7531C3.67885 16.2584 3.5409 16.9141 3.67885 17.5483L4.47472 20.999C4.51717 21.1817 4.67634 21.3107 4.86735 21.3107L8.36917 21.2677C9.00586 21.257 9.60011 20.9667 10.0034 20.4508ZM14.9066 19.3761H20.6167C21.1738 19.3761 21.627 19.8351 21.627 20.3995C21.627 20.9649 21.1738 21.4229 20.6167 21.4229H14.9066C14.3495 21.4229 13.8964 20.9649 13.8964 20.3995C13.8964 19.8351 14.3495 19.3761 14.9066 19.3761Z" fill="#82C526" />
                                                    </svg>Edit</Button></td>
                                                </tr>
                                                <tr>
                                                    <td>Exercise Name</td>
                                                    <td>Back of thigh</td>
                                                    <td>Beginner Bodyweight</td>
                                                    <td>Upper body,Lover body</td>
                                                    <td><Button className='bg-none border-0 text-green fs-15 py-0'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0034 20.4508L18.7897 9.08829C19.2673 8.47556 19.437 7.76715 19.2779 7.04584C19.1399 6.39011 18.7367 5.76662 18.1318 5.29364L16.6568 4.12192C15.3728 3.10069 13.7811 3.20819 12.8685 4.37991L11.8816 5.6602C11.7543 5.82037 11.7861 6.05687 11.9453 6.18586C11.9453 6.18586 14.439 8.18531 14.492 8.22831C14.6618 8.38956 14.7892 8.60455 14.821 8.86255C14.8741 9.36778 14.5239 9.84077 14.0039 9.90527C13.7598 9.93752 13.5264 9.86227 13.3566 9.72252L10.7355 7.63708C10.6082 7.5414 10.4172 7.56183 10.3111 7.69083L4.08209 15.7531C3.67885 16.2584 3.5409 16.9141 3.67885 17.5483L4.47472 20.999C4.51717 21.1817 4.67634 21.3107 4.86735 21.3107L8.36917 21.2677C9.00586 21.257 9.60011 20.9667 10.0034 20.4508ZM14.9066 19.3761H20.6167C21.1738 19.3761 21.627 19.8351 21.627 20.3995C21.627 20.9649 21.1738 21.4229 20.6167 21.4229H14.9066C14.3495 21.4229 13.8964 20.9649 13.8964 20.3995C13.8964 19.8351 14.3495 19.3761 14.9066 19.3761Z" fill="#82C526" />
                                                    </svg>Edit</Button></td>
                                                </tr>
                                                <tr>
                                                    <td>Exercise Name</td>
                                                    <td>Back of thigh</td>
                                                    <td>Beginner Bodyweight</td>
                                                    <td>Upper body,Lover body</td>
                                                    <td><Button className='bg-none border-0 text-green fs-15 py-0'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0034 20.4508L18.7897 9.08829C19.2673 8.47556 19.437 7.76715 19.2779 7.04584C19.1399 6.39011 18.7367 5.76662 18.1318 5.29364L16.6568 4.12192C15.3728 3.10069 13.7811 3.20819 12.8685 4.37991L11.8816 5.6602C11.7543 5.82037 11.7861 6.05687 11.9453 6.18586C11.9453 6.18586 14.439 8.18531 14.492 8.22831C14.6618 8.38956 14.7892 8.60455 14.821 8.86255C14.8741 9.36778 14.5239 9.84077 14.0039 9.90527C13.7598 9.93752 13.5264 9.86227 13.3566 9.72252L10.7355 7.63708C10.6082 7.5414 10.4172 7.56183 10.3111 7.69083L4.08209 15.7531C3.67885 16.2584 3.5409 16.9141 3.67885 17.5483L4.47472 20.999C4.51717 21.1817 4.67634 21.3107 4.86735 21.3107L8.36917 21.2677C9.00586 21.257 9.60011 20.9667 10.0034 20.4508ZM14.9066 19.3761H20.6167C21.1738 19.3761 21.627 19.8351 21.627 20.3995C21.627 20.9649 21.1738 21.4229 20.6167 21.4229H14.9066C14.3495 21.4229 13.8964 20.9649 13.8964 20.3995C13.8964 19.8351 14.3495 19.3761 14.9066 19.3761Z" fill="#82C526" />
                                                    </svg>Edit</Button></td>
                                                </tr>
                                                <tr>
                                                    <td>Exercise Name</td>
                                                    <td>Back of thigh</td>
                                                    <td>Beginner Bodyweight</td>
                                                    <td>Upper body,Lover body</td>
                                                    <td><Button className='bg-none border-0 text-green fs-15 py-0'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0034 20.4508L18.7897 9.08829C19.2673 8.47556 19.437 7.76715 19.2779 7.04584C19.1399 6.39011 18.7367 5.76662 18.1318 5.29364L16.6568 4.12192C15.3728 3.10069 13.7811 3.20819 12.8685 4.37991L11.8816 5.6602C11.7543 5.82037 11.7861 6.05687 11.9453 6.18586C11.9453 6.18586 14.439 8.18531 14.492 8.22831C14.6618 8.38956 14.7892 8.60455 14.821 8.86255C14.8741 9.36778 14.5239 9.84077 14.0039 9.90527C13.7598 9.93752 13.5264 9.86227 13.3566 9.72252L10.7355 7.63708C10.6082 7.5414 10.4172 7.56183 10.3111 7.69083L4.08209 15.7531C3.67885 16.2584 3.5409 16.9141 3.67885 17.5483L4.47472 20.999C4.51717 21.1817 4.67634 21.3107 4.86735 21.3107L8.36917 21.2677C9.00586 21.257 9.60011 20.9667 10.0034 20.4508ZM14.9066 19.3761H20.6167C21.1738 19.3761 21.627 19.8351 21.627 20.3995C21.627 20.9649 21.1738 21.4229 20.6167 21.4229H14.9066C14.3495 21.4229 13.8964 20.9649 13.8964 20.3995C13.8964 19.8351 14.3495 19.3761 14.9066 19.3761Z" fill="#82C526" />
                                                    </svg>Edit</Button></td>
                                                </tr>
                                                <tr>
                                                    <td>Exercise Name</td>
                                                    <td>Back of thigh</td>
                                                    <td>Beginner Bodyweight</td>
                                                    <td>Upper body,Lover body</td>
                                                    <td><Button className='bg-none border-0 text-green fs-15 py-0'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0034 20.4508L18.7897 9.08829C19.2673 8.47556 19.437 7.76715 19.2779 7.04584C19.1399 6.39011 18.7367 5.76662 18.1318 5.29364L16.6568 4.12192C15.3728 3.10069 13.7811 3.20819 12.8685 4.37991L11.8816 5.6602C11.7543 5.82037 11.7861 6.05687 11.9453 6.18586C11.9453 6.18586 14.439 8.18531 14.492 8.22831C14.6618 8.38956 14.7892 8.60455 14.821 8.86255C14.8741 9.36778 14.5239 9.84077 14.0039 9.90527C13.7598 9.93752 13.5264 9.86227 13.3566 9.72252L10.7355 7.63708C10.6082 7.5414 10.4172 7.56183 10.3111 7.69083L4.08209 15.7531C3.67885 16.2584 3.5409 16.9141 3.67885 17.5483L4.47472 20.999C4.51717 21.1817 4.67634 21.3107 4.86735 21.3107L8.36917 21.2677C9.00586 21.257 9.60011 20.9667 10.0034 20.4508ZM14.9066 19.3761H20.6167C21.1738 19.3761 21.627 19.8351 21.627 20.3995C21.627 20.9649 21.1738 21.4229 20.6167 21.4229H14.9066C14.3495 21.4229 13.8964 20.9649 13.8964 20.3995C13.8964 19.8351 14.3495 19.3761 14.9066 19.3761Z" fill="#82C526" />
                                                    </svg>Edit</Button></td>
                                                </tr>
                                                <tr>
                                                    <td>Exercise Name</td>
                                                    <td>Back of thigh</td>
                                                    <td>Beginner Bodyweight</td>
                                                    <td>Upper body,Lover body</td>
                                                    <td><Button className='bg-none border-0 text-green fs-15 py-0'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0034 20.4508L18.7897 9.08829C19.2673 8.47556 19.437 7.76715 19.2779 7.04584C19.1399 6.39011 18.7367 5.76662 18.1318 5.29364L16.6568 4.12192C15.3728 3.10069 13.7811 3.20819 12.8685 4.37991L11.8816 5.6602C11.7543 5.82037 11.7861 6.05687 11.9453 6.18586C11.9453 6.18586 14.439 8.18531 14.492 8.22831C14.6618 8.38956 14.7892 8.60455 14.821 8.86255C14.8741 9.36778 14.5239 9.84077 14.0039 9.90527C13.7598 9.93752 13.5264 9.86227 13.3566 9.72252L10.7355 7.63708C10.6082 7.5414 10.4172 7.56183 10.3111 7.69083L4.08209 15.7531C3.67885 16.2584 3.5409 16.9141 3.67885 17.5483L4.47472 20.999C4.51717 21.1817 4.67634 21.3107 4.86735 21.3107L8.36917 21.2677C9.00586 21.257 9.60011 20.9667 10.0034 20.4508ZM14.9066 19.3761H20.6167C21.1738 19.3761 21.627 19.8351 21.627 20.3995C21.627 20.9649 21.1738 21.4229 20.6167 21.4229H14.9066C14.3495 21.4229 13.8964 20.9649 13.8964 20.3995C13.8964 19.8351 14.3495 19.3761 14.9066 19.3761Z" fill="#82C526" />
                                                    </svg>Edit</Button></td>
                                                </tr>
                                                <tr>
                                                    <td>Exercise Name</td>
                                                    <td>Back of thigh</td>
                                                    <td>Beginner Bodyweight</td>
                                                    <td>Upper body,Lover body</td>
                                                    <td><Button className='bg-none border-0 text-green fs-15 py-0'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0034 20.4508L18.7897 9.08829C19.2673 8.47556 19.437 7.76715 19.2779 7.04584C19.1399 6.39011 18.7367 5.76662 18.1318 5.29364L16.6568 4.12192C15.3728 3.10069 13.7811 3.20819 12.8685 4.37991L11.8816 5.6602C11.7543 5.82037 11.7861 6.05687 11.9453 6.18586C11.9453 6.18586 14.439 8.18531 14.492 8.22831C14.6618 8.38956 14.7892 8.60455 14.821 8.86255C14.8741 9.36778 14.5239 9.84077 14.0039 9.90527C13.7598 9.93752 13.5264 9.86227 13.3566 9.72252L10.7355 7.63708C10.6082 7.5414 10.4172 7.56183 10.3111 7.69083L4.08209 15.7531C3.67885 16.2584 3.5409 16.9141 3.67885 17.5483L4.47472 20.999C4.51717 21.1817 4.67634 21.3107 4.86735 21.3107L8.36917 21.2677C9.00586 21.257 9.60011 20.9667 10.0034 20.4508ZM14.9066 19.3761H20.6167C21.1738 19.3761 21.627 19.8351 21.627 20.3995C21.627 20.9649 21.1738 21.4229 20.6167 21.4229H14.9066C14.3495 21.4229 13.8964 20.9649 13.8964 20.3995C13.8964 19.8351 14.3495 19.3761 14.9066 19.3761Z" fill="#82C526" />
                                                    </svg>Edit</Button></td>
                                                </tr>
                                                <tr>
                                                    <td>Exercise Name</td>
                                                    <td>Back of thigh</td>
                                                    <td>Beginner Bodyweight</td>
                                                    <td>Upper body,Lover body</td>
                                                    <td><Button className='bg-none border-0 text-green fs-15 py-0'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 25 25" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M10.0034 20.4508L18.7897 9.08829C19.2673 8.47556 19.437 7.76715 19.2779 7.04584C19.1399 6.39011 18.7367 5.76662 18.1318 5.29364L16.6568 4.12192C15.3728 3.10069 13.7811 3.20819 12.8685 4.37991L11.8816 5.6602C11.7543 5.82037 11.7861 6.05687 11.9453 6.18586C11.9453 6.18586 14.439 8.18531 14.492 8.22831C14.6618 8.38956 14.7892 8.60455 14.821 8.86255C14.8741 9.36778 14.5239 9.84077 14.0039 9.90527C13.7598 9.93752 13.5264 9.86227 13.3566 9.72252L10.7355 7.63708C10.6082 7.5414 10.4172 7.56183 10.3111 7.69083L4.08209 15.7531C3.67885 16.2584 3.5409 16.9141 3.67885 17.5483L4.47472 20.999C4.51717 21.1817 4.67634 21.3107 4.86735 21.3107L8.36917 21.2677C9.00586 21.257 9.60011 20.9667 10.0034 20.4508ZM14.9066 19.3761H20.6167C21.1738 19.3761 21.627 19.8351 21.627 20.3995C21.627 20.9649 21.1738 21.4229 20.6167 21.4229H14.9066C14.3495 21.4229 13.8964 20.9649 13.8964 20.3995C13.8964 19.8351 14.3495 19.3761 14.9066 19.3761Z" fill="#82C526" />
                                                    </svg>Edit</Button></td>
                                                </tr> */}
                                    </tbody>
                                </Table>
                                <div className='p-3 pagination-container'>
                                    <Row>
                                        <Col lg={6}>
                                            <p className='text-muted fs-6'>{`Showing 1 - ${exercises.length} out of ${totalRecords}`}</p>
                                        </Col>
                                        <Col lg={6} className='text-end'>
                                            <Pagination className='justify-content-end'>
                                                {/* <Pagination.First /> */}
                                                {/* <Pagination.Prev />
                                                        <Pagination.Item active>{1}</Pagination.Item>
                                                        <Pagination.Item>{2}</Pagination.Item>
                                                        <Pagination.Item>{3}</Pagination.Item>
                                                        <Pagination.Item>{4}</Pagination.Item>
                                                        <Pagination.Next /> */}
                                                {/* <Pagination.Last /> */}
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
                centered show={showDatabaseModal} size="md" onHide={() => setShowDatabaseModal(false)}>
                <Modal.Header className='text-center border-0 bg-green custom-modal-header' closeButton>
                    <span></span>
                    <Modal.Title className='text-white'>Add an Exercise</Modal.Title>
                </Modal.Header>
                <Modal.Body className='px-5 py-3'>
                    <div>
                        <div className=''>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Web Video</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" placeholder="" value={webVideo} onChange={(e) => setWebVideo(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Mobile Video</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" placeholder="" value={mobileVideo} onChange={(e) => setMobileVideo(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Exercise Name</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" placeholder="" value={exerciseName} onChange={(e) => setExerciseName(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Primary Muscles Worked</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" placeholder="" value={primaryMusclesWorked} onChange={(e) => setPrimaryMusclesWorked(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Secondary Muscles Worked</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" placeholder="" value={secondaryMusclesWorked} onChange={(e) => setSecondaryMusclesWorked(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Difficulty Level</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" placeholder="" value={difficultyLevel} onChange={(e) => setDifficultyLevel(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Exercise Type(s)</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" placeholder="" value={exerciseType} onChange={(e) => setExerciseType(e.target.value)} />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Equipment</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" placeholder="" value={equipment} onChange={(e) => setEquipment(e.target.value)} />
                            </Form.Group>

                        </div>
                        {/* <Button className='bg-green text-white w-100 d-block py-3 custom-shadow border-0 mt-3 mb-3'>Add Ingredient</Button> */}
                    </div>
                </Modal.Body>
                <div className='px-5 mb-5'>
                    <Row>
                        <Col lg={6}>
                            <Button className='bg-green w-100 text-white col-6 py-3 custom-border' onClick={selectedExercise ? handleExerciseUpdate : handleAddExercise}>
                                Save
                            </Button>
                        </Col>
                        <Col lg={6}>
                            <Button className='bg-none w-100 text-green col-6 py-3 custom-border' disabled={!selectedExercise} onClick={handleExerciseDelete}>
                                Delete
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Modal>
        </div>
    )
}
