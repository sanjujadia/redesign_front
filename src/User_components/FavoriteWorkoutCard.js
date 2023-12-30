import React from 'react';
import WorkoutFrame from '../assets/images/workout-frame.png';
import { Button } from 'react-bootstrap';
import moment from 'moment';
export default function FavoriteWorkoutCard({data,handleRemoveWorkout}) {
  return (
    <div>
        <div className='p-3 rounded bg-white shadow-sm'>
            <img src={data?.workout_card?.workoutImage} className='w-100 h-100 object-fit-cover' />
            <span className='d-block bg-green w-100 py-2 text-white text-center custom-shadow fs-6 fw-normal mt-2 Raleway'>{data?.workout_card?.workoutType}</span>
            <p className='d-block text-muted fs-6 fw-600 mt-2 mb-0 ps-2 Inter'>Enter Workout Time: <span className='text-black'>{moment(data?.workout_card?.workoutTime,'mm:ss').format('mm')} min</span></p>
            <Button className='py-2 text-green bg-white w-100 text-center rounded mt-2 fs-6 fw-600 Raleway' style={{ border: '1px solid #85C52E' }}>Start Workout</Button>
            <Button className='p-0 text-danger bg-white d-block m-auto text-center mt-2 fs-6 fw-600 border-0 Raleway' onClick={() => handleRemoveWorkout(data?._id)}>Remove</Button>
        </div>
    </div>
  )
}
