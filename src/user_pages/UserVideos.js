import React, { useState, useEffect } from 'react';
//import UserSidebar from '../User_components/UserSidebar';
//import TopBar from '../components/TopBar';
import { Col, Row } from 'react-bootstrap';
import UserVideoCard from '../User_components/UserVideoCard';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function UserVideos() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [videos, setVideos] = useState()

    const fetchHowToVideos = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getHowToVideos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())

        if (res.status) {
            console.log('data', res.data)
            setVideos(res.data)
        } else {
            setVideos([])
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchHowToVideos();
        } else {
            navigate('/');
        }
    }, [isAuthenticated, navigate]);
    
    return (
        <div>
            <div className='mt-1 main-content'>
                <div className='bg-white py-3 px-4'>
                    <Row className='align-items-center'>
                        <Col lg={4}>
                            <div>
                                <h5 className='text-dark mb-0 fw-600 fs-5 left-border'>How to Videos</h5>
                                <p className='text-custom-grey fw-600 fs-17 ps-2 mb-0'>{videos && videos !== 'undefined' && videos?.length > 1 ? videos?.length + ' Videos' : videos?.length + ' Video'}</p>
                            </div>
                        </Col>
                        {/* <Col lg={8}>
                            <div className='text-end'>
                                <Button className='text-custom-grey mb-0 fw-600 fs-17 bg-none border border-gray px-3'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                                    <path d="M0.918945 0H16.7566V2.56205H0.918945V0Z" fill="#959595" />
                                    <path d="M9.30334 10.7136H6.74145V13.9742L10.9338 17.2348L10.9336 10.2476L15.3355 3.74951H2.33936L6.50838 9.78179H9.30322C9.55942 9.78179 9.76899 10.038 9.76899 10.2942C9.76899 10.5504 9.55941 10.7133 9.30322 10.7133L9.30334 10.7136Z" fill="#959595" />
                                </svg>Filter</Button>
                            </div>
                        </Col> */}
                    </Row>

                </div>
                <div className='p-xl-5 p-3'>
                    <Row>
                        <Col lg={12}>
                            <div className='recipe-grid mt-0'>
                                {videos && videos.length > 0
                                    ?
                                    videos.map(data => (
                                        <UserVideoCard data={data} />
                                    ))
                                    :
                                    <></>
                                }
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
