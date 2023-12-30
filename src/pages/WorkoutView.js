import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import moment from 'moment'
import ReactPlayer from 'react-player'

export default function WorkoutView() {
    const { user, isAuthenticated } = useAuth()
    const [searchParams, setSearchParams] = useSearchParams()
    const date = searchParams.get('date')
    const [workoutData, setWorkoutData] = useState(null)
    const [isPlaying, setIsPlaying] = useState(false)

    console.log('workoutData', workoutData)

    const fetchWorkout = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getWorkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ date })
        }).then(res => res.json())

        if (res.status) {
            console.log(res.data)
            setWorkoutData(res.data[0])
        } else {
            console.log(res.message)
        }
    }

    const handlePlayPause = () => {
        setIsPlaying(!isPlaying);
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchWorkout()
        }
    }, [user])

    return (
        <div>
            <div className='mt-1 main-content'>
                <div className='bg-white py-3 px-4'>
                    <Row>
                        <Col lg={12}>
                            <div>
                                <Link to="/workout-calendar" className='text-dark mb-0 fw-600 fs-5 text-decoration-none'><svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M18.8641 6.73026H4.25331L8.85671 2.12686C9.35722 1.62634 9.35722 0.825985 8.85671 0.375384C8.3562 -0.125128 7.55584 -0.125128 7.10524 0.375384L0.350429 7.0806C0.100173 7.33051 0 7.68094 0 7.98109C0 8.28124 0.100173 8.63168 0.350429 8.88158L7.05529 15.5864C7.55581 16.087 8.35616 16.087 8.80677 15.5864C9.30728 15.0859 9.30728 14.2856 8.80677 13.835L4.20336 9.23157H18.8142C19.4647 9.23157 19.9649 8.68114 19.9649 7.98064C19.9649 7.28049 19.5143 6.73008 18.8641 6.73008V6.73026Z" fill="black" />
                                </svg>Body Weight Only</Link>
                            </div>
                        </Col>
                    </Row>

                </div>
                <div className='p-xl-5 p-3'>
                    <div className='bg-white rounded-32 p-xl-5 p-3'>
                        <Row>
                            <Col xxl={7} lg={12} className='mb-3'>
                                <div className='workout-video'>

                                    <ReactPlayer
                                        url={workoutData && workoutData.workout_elements[0] ? workoutData?.workout_elements[0]?.video : ""}
                                        height="100%"
                                        width="100%"
                                        controls
                                        playing={isPlaying}
                                        onPlay={() => setIsPlaying(true)}
                                        onPause={() => setIsPlaying(false)}
                                    />
                                    {/* <iframe src={VideoDemo} title="" autoplay="false" height="440" width="100%" style={{ borderRadius: '10px' }}></iframe> */}
                                    {/* <video controls height="100%" width="100%" id="video" preload="metadata" style={{ borderRadius: '10px' }} poster="//cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/poster.jpg">
                                                <source src="//cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/video.mp4" type="video/mp4" />
                                            </video> */}
                                    {!isPlaying && (<Button className='video-play-btn' onClick={handlePlayPause}><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 35 35" fill="none">
                                        <g id="Icon Frame">
                                            <path id="Union" fillRule="evenodd" clipRule="evenodd" d="M28.4375 21.2891C31.3542 19.6052 31.3542 15.3953 28.4375 13.7114L15.3125 6.13368C12.3958 4.44975 8.75 6.55466 8.75 9.92254V25.078C8.75 28.4459 12.3958 30.5508 15.3125 28.8668L28.4375 21.2891Z" fill="#85C52E" />
                                        </g>
                                    </svg></Button>)}
                                </div>
                            </Col>
                            <Col xxl={5} lg={12}>
                                <div>
                                    <Form.Control className='mb-3 bg-light fs-6 fw-600 p-3 border-grey border shadow-none ' type="type" placeholder="Element Title" value={workoutData && workoutData.workout_elements[0]?.exerciseName ? workoutData?.workout_elements[0]?.exerciseName : ""} />
                                    <Form.Control className='mb-3 bg-light fs-6 fw-600 p-3 border-grey border shadow-none ' type="type" placeholder="Time Countdown" value={workoutData && workoutData.workout_elements[0]?.exerciseTime ? workoutData?.workout_elements[0]?.exerciseTime : ""} />
                                    <Form.Control className='mb-3 bg-light fs-6 fw-600 p-3 border-grey border shadow-none ' type="type" placeholder="Target Reps Count" value={workoutData && workoutData.workout_elements[0]?.exerciseReps ? workoutData?.workout_elements[0]?.exerciseReps : ""} />
                                    <Form.Control className=' bg-light fs-6 fw-600 p-3 border-grey border shadow-none ' type="type" placeholder="Element Title Coming Up Next" />
                                </div>
                            </Col>
                            <Col lg={12}>
                                <div>
                                    <Form.Control className='bg-light fs-6 fw-600 p-3 border-grey border shadow-none mt-3' as="textarea" rows={6} placeholder='Entire Workout' />
                                </div>
                            </Col>
                        </Row>
                    </div>
                </div>
            </div>
        </div>
    )
}
