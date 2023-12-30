import React, { useState, useEffect, useRef} from 'react';
//mport UserSidebar from '../User_components/UserSidebar';
//import TopBar from '../components/TopBar';
import { Button, Form, Modal } from 'react-bootstrap';
import {
    Calendar,
    momentLocalizer,
  } from 'react-big-calendar'
import moment from 'moment';
//import PropTypes from 'prop-types'
import Ratings from '../components/Ratings';
//import WorkoutCalendarUser from '../components/WorkoutCalendarUser';
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom'
import ReactPlayer from 'react-player'
//import { dateCalendarClasses } from '@mui/x-date-pickers';
import { ToastContainer, toast } from 'react-toastify';
//import * as dates from '../User_components/Dates'
//import DemoLink from '../User_components/DemoLink.component';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'moment/locale/en-gb'; // Import the locale for moment
const localizer = momentLocalizer(moment);
export default function UserWorkoutCalendar({
  }) {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [workouts, setWorkouts] = useState([])
    const [workout, setWorkout] = useState(null)
    const [time, setTime] = useState()
    const [showModalworkout, setShowModalworkout] = useState(false)
    const [showModalvideo, setShowModalvideo] = useState(false)
    const [showFeedbackModal, setShowFeedbackModal] = useState(false)
    const [isFullScreen, setIsFullScreen] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false)
    const [isFavourite, setIsFavourite] = useState(false)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState()
    // const [month, setMonth] = useState(Number(moment().add(1,'M').month()))
    const playerRef = useRef(null);
    // const localizer = momentLocalizer(moment)
    // console.log('month',month)
    const fetchWorkouts = async (id,month) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getWorkouts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({id, month:month ? month : moment().month()})
        }).then(res => res.json())
            console.log(res);
            //const now = new Date()
        if (res.status) {
            // setWorkouts(res?.data)
          const data = res?.data
         const modifiedWorkouts = data.map((item) => ({
            id: item._id,
            title: item.workout_for[0],
            start: new Date(item.workout_date),
            end: new Date(item.workout_date),
          }));
            setWorkouts(modifiedWorkouts)
        }
    }

    const fetchWorkout = async (date) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getWorkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user._id, date })
        }).then(res => res.json())

        if (res.status) {
            console.log(res.data)
            setWorkout(res.data)
        } else {
            toast.error(res.message)
        }
    }

    const handleFavouriteWorkout = async () => {

        console.log('llllllllllls')
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/addFavouriteWorkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user?._id, workoutId: workout._id })
        }).then(res => res.json())

        if (res.status) {
            setIsFavourite(true)
            toast.success(res.message)
        } else {
            toast.error(res.message)
        }
    }

    const handleFeedback = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/updateWorkoutFeedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ workoutId: workout._id, rating, comment })
        }).then(res => res.json())

        if (res.status) {
            setShowFeedbackModal(false)
            fetchWorkouts(res.data.userId)
            toast.success('Workout completed')
        } else {
            toast.error(res.message)
        }
    }

    const handleWorkout = async (data, date) => {
        await fetchWorkout(date)
        setShowModalworkout(data)
    }

    // const handleSelectedMonth = async (month) => {
    //     await fetchWorkouts(user?._id,month.add(1,'M').month())
    // }

    const handleRating = (data) => {
        console.log(data)
        setRating(data)
    }

    const handleTogglePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    const handleToggleFullScreen = () => {
        const player = playerRef.current.getInternalPlayer();
        if (player) {
            if (!document.fullscreenElement) {
                player.requestFullscreen();
            } else {
                document.exitFullscreen();
            }
            setIsFullScreen(!isFullScreen);
        }
    };

    useEffect(() => {
        const timer = setInterval(() => {
            if (time === 0) {
                clearInterval(timer);
            } else {
                setTime(time - 1);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [time]);

    useEffect(() => {
        const fetchData = async () => {
            if (!isAuthenticated) {
                navigate('/');
            } else {
                await fetchWorkouts(user?._id, moment().add(1, 'M').month());
            }
        };
        
        fetchData(); // Invoke the function directly
        
        // Include isAuthenticated and navigate in the dependency array
    }, [isAuthenticated, navigate, user]);
    
    

    const handleEventClick = (event) => {
        // Access the event ID here
        //const eventId = event.id;
        const eventDate = event.start;
        handleWorkout(true , eventDate)
        // You can use the ID to perform additional actions or show it in a modal, etc.
      };
const [currentView, setCurrentView] = useState('month'); // 'month', 'week', or 'day'

const handleViewChange = (newView) => {
    setCurrentView(newView);
    setCurrentDate(moment());
  };

  const [currentDate, setCurrentDate] = useState(moment());

  useEffect(() => {
    // Set the initial date to the start of the current month when the component mounts
    setCurrentDate(moment().startOf('month').toDate());
  }, []); // Empty dependency array to run the effect only once

  const handlePrevMonth = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'months').toDate());
  };

  const handleNextMonth = () => {
    setCurrentDate(moment(currentDate).add(1, 'months').toDate());
  };

  const handlePrevDay = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'days').toDate());
  };

  const handleNextDay = () => {
    setCurrentDate(moment(currentDate).add(1, 'days').toDate());
  };

  const CustomToolbar = (toolbar) => {
    const { label } = toolbar;

    return (
      <div className="rbc-toolbar-label d-flex align-items-center mb-3">         
            {currentView === "day" ?   
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" class="bi bi-chevron-left" viewBox="0 0 16 16" onClick={handlePrevDay}>
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>              
            :           
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#000" class="bi bi-chevron-left" viewBox="0 0 16 16" onClick={handlePrevMonth}>
            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0z"/>
            </svg>               
            }   
            <h3 className='mb-0 mx-3'>{label}</h3>
            {currentView === "day" ?   
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16" onClick={handleNextDay}>
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>             
                           
                :              
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-chevron-right" viewBox="0 0 16 16" onClick={handleNextMonth}>
            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708z"/>
          </svg>         
                            
            } 
      </div>
    );
  };

    return (
        <div className='p-4'>
            <div className='filter-days'>
                <button onClick={() => handleViewChange('month')}>Month</button>
                <button onClick={() => handleViewChange('day')}>Day</button>
                    
        </div>
            <div className=' p-xl-2 p-3 main-content'>
                {/* <WorkoutCalendarUser callBack={handleWorkout} callbackMonth={handleSelectedMonth} events={workouts} /> */}
                <Calendar
                    localizer={localizer}
                    events={workouts}
                    startAccessor="start"
                    endAccessor="end"
                    views={['month', 'week', 'day']}
                    view={currentView}
                    date={currentDate} // Pass moment object directly
                    onSelectSlot={(slotInfo) => console.log('Selected slot:', slotInfo)}
                    onSelectEvent={handleEventClick}
                    components={{
                        toolbar: CustomToolbar,
                    }}                    Authorization
                />
                {/* <Button onClick={() => setShowModalworkout(true)} className='bg-green text-white px-5 d-block py-2 custom-shadow border-0 fs-5 mt-3'>Add/Edit Workout</Button> */}
            </div>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showModalworkout} size="md" onHide={() => setShowModalworkout(false)}>
                <Modal.Header className='border-0' closeButton>

                </Modal.Header>
                <Modal.Body>
                    <div className='text-center'>
                        <h5>What equipment do you have available today?</h5>
                        <p className='text-custom-grey'>Tip: Gather your equipment before clicking start!</p>
                        <div className='mt-3 d-flex flex-wrap gap-3 justify-content-center'>
                            <span className="d-inline bg-green text-white rounded custom-shadow px-3 py-2 ">Body Weight</span>
                            <span className="d-inline bg-green text-white rounded custom-shadow px-3 py-2 ">Dumbbells</span>
                            <span className="d-inline bg-green text-white rounded custom-shadow px-3 py-2 ">Kettlebell</span>
                            <span className="d-inline bg-green text-white rounded custom-shadow px-3 py-2 ">Medicine Ball</span>
                            <span className="d-inline bg-green text-white rounded custom-shadow px-3 py-2 ">Reistance Bands</span>
                        </div>
                        <Button onClick={() => { setShowModalvideo(true); setTime(60); setShowModalworkout(false) }} className='bg-white text-green w-100 d-block py-2 custom-shadow custom-border Raleway mt-3 mb-2'>Start Workout</Button>
                        <span className='text-custom-grey'>*Required</span>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showModalvideo} size="lg" onHide={() => { setShowModalvideo(false); setShowFeedbackModal(true) }}>
                <Modal.Header className='border-0' closeButton>

                    <Button className='border text-custom-grey bg-white fw-600' onClick={handleToggleFullScreen}>View full mode</Button>
                </Modal.Header>
                <Modal.Body>
                    <div className=''>
                        <div className='exercise-modal-video'>
                            <ReactPlayer
                                ref={playerRef}
                                // url={'https://cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/video.mp4'}
                                url={workout?.workout_elements[0]?.video}
                                controls
                                height="100%"
                                width="100%"
                                id="video"
                                preload="metadata"
                                style={{ borderRadius: '10px' }}
                                poster="//cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/poster.jpg"
                                playing={isPlaying}
                                onPlay={() => setIsPlaying(true)}
                                onPause={() => setIsPlaying(false)}
                                config={{
                                    file: {
                                        attributes: {
                                            controlsList: 'nodownload'
                                        }
                                    }
                                }}
                            />
                            {/* <video className='object-fit-cover' controls height="100%" width="100%" id="video" preload="metadata" style={{ borderRadius: '10px' }} poster="//cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/poster.jpg">
                                <source src="//cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/video.mp4" type="video/mp4" />
                            </video> */}
                            {!isPlaying && (<Button className='video-play-btn' onClick={handleTogglePlayPause}><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                                <g id="Icon Frame">
                                    <path id="Union" fillRule="evenodd" clipRule="evenodd" d="M28.4375 21.2891C31.3542 19.6052 31.3542 15.3953 28.4375 13.7114L15.3125 6.13368C12.3958 4.44975 8.75 6.55466 8.75 9.92254V25.078C8.75 28.4459 12.3958 30.5508 15.3125 28.8668L28.4375 21.2891Z" fill="#85C52E" />
                                </g>
                            </svg></Button>)}
                        </div>
                        <div className='mt-3 workout-status-grid'>
                            <div className='orange px-3 py-2 d-flex gap-2 align-items-center'>
                                <span className='text-white fs-3 fw-500'>
                                    {`${Math.floor(time / 60)
                                        .toString()
                                        .padStart(2, '0')}:${(time % 60).toString().padStart(2, '0')}`}
                                </span>
                                <div>
                                    <span className='text-white fs-5 fw-500 d-block lh-1'>Seconds</span>
                                    <span className='text-white fs-5 fw-500 d-block lh-1'>Remaining</span>
                                </div>
                            </div>
                            <div className='bg-green px-3 py-2 d-flex gap-2 align-items-center'>
                                <span className='text-white fs-3 fw-500'>8</span>
                                <div>
                                    <span className='text-white fs-5 fw-500 d-block lh-1'>Target</span>
                                    <span className='text-white fs-5 fw-500 d-block lh-1'>Reps</span>
                                </div>
                            </div>
                            <div className='bg-primary px-3 py-2 d-flex gap-2 align-items-center'>
                                <div>
                                    <span className='text-white fs-5 fw-500 d-block lh-1'>Next up:</span>
                                    <span className='text-white fs-5 fw-500 d-block lh-1'>Title of Next Step</span>
                                </div>
                            </div>
                            <div className='bg-grey px-3 py-2 text-center d-flex justify-content-center align-items-center ' onClick={handleTogglePlayPause}>
                                <span className='text-dark fs-5 fw-500 d-inline fw-600'>{isPlaying ? 'Pause' : 'Play'}</span>
                            </div>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showFeedbackModal} size="md" onHide={() => setShowFeedbackModal(false)}>
                <Modal.Header className=' border-0 pb-0'>
                    <div className='d-flex gap-3'>
                        <h4 className='text-dark mb-0 fw-600 fs-5'>How would you rate today workout? </h4>
                        <Button className='bg-white custom-border text-green text-nowrap' onClick={handleFavouriteWorkout}>{isFavourite ? 'Added to Favourite' : 'Add to Favorite'}</Button>
                    </div>
                </Modal.Header>
                <Modal.Body >
                    <div>
                        <div className=''>
                            <div className='text-center star-rating'>
                                <Ratings callBack={handleRating} />
                            </div>
                            <Form.Control as="textarea" rows={4} placeholder='Comments' value={comment} onChange={(e) => setComment(e.target.value)} />
                        </div>
                        <Button className='bg-green text-white w-100 d-block py-2 custom-shadow border-0 mt-3 mb-2' onClick={handleFeedback}>Share Feedback</Button>
                        <Button className='bg-none text-dark w-100 d-block py-0 border-0' onClick={() => setShowFeedbackModal(false)}>No Thanks</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div>
    )
}
