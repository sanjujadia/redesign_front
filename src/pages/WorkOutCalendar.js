import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import WorkoutCalendarAdmin from '../components/WorkoutCalendarAdmin';
import { useAuth } from '../context/AuthProvider';
// import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';

export default function WorkOutCalendar() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [workouts, setWorkouts] = useState([])
    const [date, setDate] = useState(moment().month())
    // const localizer = momentLocalizer(moment)

    const fetchWorkout = async (id, date) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getWorkouts`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({month:date})
        }).then(res => res.json())

        if (res.status) {
            console.log(res.data)
            setWorkouts(res.data)
        } else {
            console.log(res.message)
        }
    }

    const handleSelectedMonth = async (month) => {
        await fetchWorkout(user?._id,month.add(1,'M').month())
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchWorkout()
        } else {
            navigate('/login')
        }
    }, [user])
    return (
        <div className='p-4'>
            <div className=' p-xl-2 p-3 main-content'>
                <WorkoutCalendarAdmin callbackMonth={handleSelectedMonth} events={workouts} />
            </div>
        </div>
    )
}
