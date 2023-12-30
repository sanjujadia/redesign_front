import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import MealPlan from '../components/MealPlan';
import UserSidebar from '../User_components/UserSidebar';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';

export default function UserPlans() {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [mealPlans, setMealPlans] = useState([])

    const fetchMealPlans = async (id) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getMealPlans/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())

        if (res.status) {
            setMealPlans(res?.data)
        } else {
            setMealPlans([])
        }
    }

    const handleDelete = async (id) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/delateMealPlan/${id}`, {
            method: 'DELETE',
        }).then(res => res.json())

        if (res.status) {
            toast.success(res.message)
            fetchMealPlans()
        } else {
            toast.error(res.message)
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        } else {
            fetchMealPlans(user?._id)
        }
    }, [user])

    return (
        <div>
            <ToastContainer />
            <div className='mt-1 main-content'>
                <div className='bg-white py-3 px-4'>
                    <Row className='align-items-center'>
                        <Col lg={4}>
                            <div>
                                <h5 className='text-dark mb-0 fw-600 fs-5 left-border'>User Meal Plans</h5>
                                <p className='text-custom-grey fw-600 fs-17 ps-2 mb-0'>{mealPlans.length} Plans</p>
                            </div>
                        </Col>
                        {/* <Col lg={8}>
                            <div className='text-end'>
                                <Link to="/add-plan" className='px-3 py-3 rounded text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 text-decoration-none'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M15.5 6.14545V9.85455H9.73864V16H6.26136V9.85455H0.5V6.14545H6.26136V0H9.73864V6.14545H15.5Z" fill="white" />
                                </svg>Add Plan</Link>
                            </div>
                        </Col> */}
                    </Row>

                </div>
                <div className='p-xl-5 p-3'>
                    <div className='shadow bg-white p-xl-5 p-3 rounded'>
                        <div className='plan-list'>
                            {mealPlans.map((mealPlan, i) => (
                                <MealPlan data={mealPlan} handleDelete={handleDelete} />
                            ))}

                            {/* <MealPlan />
                                    <MealPlan />
                                    <MealPlan />
                                    <MealPlan />
                                    <MealPlan />
                                    <MealPlan />
                                    <MealPlan />
                                    <MealPlan />
                                    <MealPlan />
                                    <MealPlan />
                                    <MealPlan />
                                    <MealPlan />
                                    <MealPlan /> */}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
