import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import MealPlan from '../components/MealPlan';
import { useAuth } from '../context/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';

export default function Plan() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    // const [user, setUser] = useState({})
    const [mealPlans, setMealPlans] = useState([])
    const [loading, setLoading] = useState(true);

    // const fetchMealPlans = async () => {
    //     const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getMealPlans`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(res => res.json())

    //     if (res.status) {
    //         setMealPlans(res?.data)
    //     } else {
    //         setMealPlans([])
    //     }
    // }
    const fetchMealPlans = async () => {
        setLoading(true); // Set loading to true when starting the fetch

        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getMealPlans`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());

            if (res.status) {
                setMealPlans(res?.data);
            } else {
                setMealPlans([]);
            }
        } catch (error) {
            console.error('Error fetching meal plans:', error);
            setLoading(false);
        } finally {
            setLoading(false); 
        }
    };

    const handleDeleteMealPlan = async (id) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/deleteMealPlan/${id}`, {
            method: 'DELETE'
        }).then(res => res.json())

        if (res.status) {
            toast.success(res.message)
            fetchMealPlans()
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchMealPlans()
            //   setUser(userdata)
        } else {
            navigate('/login')
        }
    }, [user,isAuthenticated])
    return (
        <div>
            <ToastContainer />
            {loading && (
        <div className="loader-overlay">
          <TailSpin height={80} width={80} color="#4fa94d" ariaLabel="tail-spin-loading" radius={1} visible={true} />
        </div>
      )}
            <div className='mt-1 main-content'>
                <div className='bg-white py-3 px-4'>
                    <Row className='align-items-center'>
                        <Col lg={4}>
                            <div>
                                <h5 className='text-dark mb-0 fw-600 fs-5 left-border'>Add Plan</h5>
                                <p className='text-custom-grey fw-600 fs-17 ps-2 mb-0'>{mealPlans.length} Plans</p>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div className='text-end'>
                                <Link to="/add-plan" className='px-3 py-3 rounded text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 text-decoration-none'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M15.5 6.14545V9.85455H9.73864V16H6.26136V9.85455H0.5V6.14545H6.26136V0H9.73864V6.14545H15.5Z" fill="white" />
                                </svg>Add Plan</Link>
                            </div>
                        </Col>
                    </Row>

                </div>
                <div className='p-xl-5 p-3'>
                    <div className='shadow bg-white p-xl-5 p-3 rounded'>
                        <div className='plan-list'>
                            {mealPlans && mealPlans.length > 0
                                ?
                                mealPlans.map((mealPlan, i) => (
                                    <MealPlan data={mealPlan} handleDelete={handleDeleteMealPlan} />
                                ))
                                :
                                <>No meal plans found</>
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
