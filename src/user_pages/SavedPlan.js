import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import UserMealPlan from '../components/UserMealPlan';
import UserSidebar from '../User_components/UserSidebar';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';

export default function SavedPlan() {
    const [loading, setLoading] = useState(true);
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [mealPlans, setMealPlans] = useState([])
    const [dataFound, setDataFound] = useState(true);
    // const fetchMealPlans = async (id) => {
    //     const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getAllMealPlans`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(res => res.json())

    //     if (res.status) {
    //         setMealPlans(res?.data)
    //         setDataFound(true);
    //     } else {
    //         setMealPlans([])
    //     }
    // }

    const fetchMealPlans = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getAllMealPlans`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!res.ok) {
                console.error('Failed to fetch meal plans:', res.statusText);
                setDataFound(false);
                setLoading(false);
                return;
            }

            const data = await res.json();

            if (data.status) {
                setMealPlans(data.data);
                setDataFound(true);
                fetchMealPlans();
            } else {
                // Handle API response indicating an issue
                console.error('Failed to fetch meal plans:', data.message);
                setDataFound(false);
            }
        } catch (error) {
            // Handle network-related errors
            console.error('Error fetching meal plans:', error);
            setLoading(false);
            setDataFound(false);
        }
        setLoading(false);
    };

    const handleDelete = async (id) => {
        try {
            setLoading(true); // Set loading to true before the fetch request
    
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/deleteSavedMealPlan/${id}`, {
                method: 'DELETE',
            }).then(res => res.json())
    
            if (res.status) {
                toast.success(res.message)
                fetchMealPlans()
            } else {
                toast.error(res.message)
                setLoading(false);
            }
        } catch (error) {
            console.error('Error deleting meal plan:', error);
            toast.error('Error deleting meal plan');
        } finally {
            setLoading(false); // Set loading to false after the fetch request, whether it succeeds or fails
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
            {loading && (
        <div className="loader-overlay">
          <TailSpin height={80} width={80} color="#4fa94d" ariaLabel="tail-spin-loading" radius={1} visible={true} />
        </div>
      )}
            <div className='main-content'>
                <div className='bg-white py-3 px-4'>
                    <Row className='align-items-center'>
                        <Col lg={4}>
                            <div>
                                <h5 className='text-dark mb-0 fw-600 fs-5 left-border'>Saved Meal Plans</h5>
                                <p className='text-custom-grey fw-600 fs-17 ps-2 mb-0'>{mealPlans.length} Plans</p>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div className='text-end'>
                                <Link to="/add-userplan" className='px-3 py-3 rounded text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 text-decoration-none'>
                                <svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M15.5 6.14545V9.85455H9.73864V16H6.26136V9.85455H0.5V6.14545H6.26136V0H9.73864V6.14545H15.5Z" fill="white" />
                                </svg>Add Plan</Link>
                            </div>
                        </Col>
                    </Row>

                </div>
             
                <div className='pt-3 p-3'>
                    <div className='shadow bg-white rounded '>
                        <div className='plan-list ' >
                        { dataFound ? (
                                mealPlans.map((mealPlan, i) => (
                                    <UserMealPlan key={i} data={mealPlan} handleDelete={handleDelete} />
                                ))
                            ) : (
                                <p>No Saved Meal Plans data found</p>
                            )}
                        </div>
                    </div>
                </div>
             
            </div>
        </div>
    )
}
