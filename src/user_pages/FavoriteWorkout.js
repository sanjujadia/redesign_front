import React, { useState, useEffect } from "react";
import UserSidebar from "../User_components/UserSidebar";
import TopBar from "../components/TopBar";
import { Button, Col, Row } from "react-bootstrap";
import FavoriteRecipeCard from "../User_components/FavoriteRecipeCard";
import FavoriteWorkoutCard from "../User_components/FavoriteWorkoutCard";
import { useAuth } from "../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';

export default function FavoriteWorkout() {
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const [favouriteWorkouts, setFavouriteWorkouts] = useState([])
  const [dataFound, setDataFound] = useState(true);

  // const fetchFavouriteWorkouts = async () => {
  //   setLoading(true);
  //   const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getFavouriteWorkout/${user?._id}`, {
  //     method: 'GET',
  //     headers: {
  //       'Content-Type': 'application/json'
  //     }
  //   }).then(res => res.json())
  //   if (res.status) {
  //     setFavouriteWorkouts(res.data.favourite_workouts)
  //     setLoading(false);
  //   } else {
  //     setFavouriteWorkouts([])
  //   }
  // }
  const fetchFavouriteWorkouts = async () => {
    setLoading(true);

    try {
      const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getFavouriteWorkout/${user?._id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();

        if (data.status) {
            setFavouriteWorkouts(data.data.favourite_workouts);
            setDataFound(true);
        } 
    } catch (error) {
        console.error('Error fetching favourite workouts:', error);
        setDataFound(false);
    } finally {
        setLoading(false);
    }
};


  const handleRemoveWorkout = async (id) => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/removeFavouriteWorkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: user?._id, workoutId: id })
    }).then(res => res.json())
    if (res.status) {
      fetchFavouriteWorkouts()
      toast.success(res.message)
    } else {
      toast.error(res.message)
    }
  }

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    } else {
      fetchFavouriteWorkouts()
    }
  }, [user])

  return (
    <div>
     {loading && (
        <div className="loader-overlay">
          <TailSpin height={80} width={80} color="#4fa94d" ariaLabel="tail-spin-loading" radius={1} visible={true} />
        </div>
      )}
      <div className="mt-1 main-content">
        <div className="bg-white py-3 px-4">
          <Row>
            <Col lg={4}>
              <div>
                <h5 className="text-dark mb-0 fw-600 fs-5 left-border">
                  Favorite Workouts
                </h5>
                <p className="text-custom-grey fw-600 fs-17 ps-2 mb-0">
                  {favouriteWorkouts?.length} Workout
                </p>
              </div>
            </Col>
            <Col lg={8}>
              <div className="text-end">
                <Button className="text-custom-grey mb-0 fw-600 fs-17 bg-none border border-gray px-3">
                  <svg
                    className="me-2"
                    xmlns="http://www.w3.org/2000/svg"
                    width="17"
                    height="18"
                    viewBox="0 0 17 18"
                    fill="none"
                  >
                    <path
                      d="M0.918945 0H16.7566V2.56205H0.918945V0Z"
                      fill="#959595"
                    />
                    <path
                      d="M9.30334 10.7136H6.74145V13.9742L10.9338 17.2348L10.9336 10.2476L15.3355 3.74951H2.33936L6.50838 9.78179H9.30322C9.55942 9.78179 9.76899 10.038 9.76899 10.2942C9.76899 10.5504 9.55941 10.7133 9.30322 10.7133L9.30334 10.7136Z"
                      fill="#959595"
                    />
                  </svg>
                  Filter
                </Button>
              </div>
            </Col>
          </Row>
        </div>
        <div className="p-xl-5 p-3">
          <Row>
            <Col lg={12}>
              <div className="recipe-grid mt-0">
                {dataFound && dataFound.length == 0
                  ?
                  favouriteWorkouts.map((item) => (
                    <FavoriteWorkoutCard data={item} handleRemoveWorkout={handleRemoveWorkout} />
                  ))
                  :
                  <><p>No Favorite Workouts found.</p></>
                }
                {/* <FavoriteWorkoutCard />
                    <FavoriteWorkoutCard />
                    <FavoriteWorkoutCard /> */}
              </div>
            </Col>
          </Row>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
}
