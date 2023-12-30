import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Button, Col, Row, Tab, Tabs } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Men from '../assets/images/young-man.png';
import moment from 'moment'

export default function UserDeatils() {
    const params = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [mealPlans, setMealPlans] = useState([])

    const fetchUserData = async (id) => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getUser/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        if (response?.status) {
            setUser(response?.data)
        }
    }

    const fetchUserMealPlan = async (id) => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/mealplans/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
        if (response?.status) {
            setMealPlans(response?.data)
        }
    }

    useEffect(() => {
        fetchUserData(params.id)
        fetchUserMealPlan(params.id)
    }, [])

    console.log('user', user)
    console.log('mealplans', mealPlans)
    return (
        <div>
            <div className='mt-1 main-content'>
                <div className='bg-white py-3 px-5'>
                    <Link to="/user" className='text-dark mb-0 fw-600 fs-5 text-decoration-none'><svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                        <path d="M18.8641 6.73026H4.25331L8.85671 2.12686C9.35722 1.62634 9.35722 0.825985 8.85671 0.375384C8.3562 -0.125128 7.55584 -0.125128 7.10524 0.375384L0.350429 7.0806C0.100173 7.33051 0 7.68094 0 7.98109C0 8.28124 0.100173 8.63168 0.350429 8.88158L7.05529 15.5864C7.55581 16.087 8.35616 16.087 8.80677 15.5864C9.30728 15.0859 9.30728 14.2856 8.80677 13.835L4.20336 9.23157H18.8142C19.4647 9.23157 19.9649 8.68114 19.9649 7.98064C19.9649 7.28049 19.5143 6.73008 18.8641 6.73008V6.73026Z" fill="black" />
                    </svg>User Personal Informations</Link>
                </div>
                <div className='p-xl-5 p-3'>
                    <Row>
                        <Col xxl={5} lg={12} className='mb-3'>
                            <div className='px-5 py-3 bg-white rounded h-70vh h-xl-auto'>
                                {/* <Button className='bg-none border-0 pb-0 d-block ms-auto'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                        </svg></Button> */}
                                <div className='text-center'>
                                    <div className='profile-img-2'><img className='img-fluid w-100 h-100' src={user?.image} /></div>
                                    <h4 className='text-dark fw-bold mb-0 fs-3 mt-3'>{user?.lastname == null ? user?.firstname : user?.firstname + " " + user?.lastname}</h4>
                                    <p className='text-custom-grey fs-6 fw-600 mb-0'>{user?.email?.substring(0, user?.email.indexOf("@"))}</p>
                                    <span className='green-line'></span>
                                </div>
                                <div className='profile-info'>
                                    <p className='text-custom-grey fs-5 fw-600 mb-0'>Email:</p>
                                    <p className='text-black fs-5 fw-600 mb-0'>{user?.email}</p>
                                    <p className='text-custom-grey fs-5 fw-600 mb-0'>Phone:</p>
                                    <p className='text-black fs-5 fw-600 mb-0'>{user?.phonenumber}</p>
                                    <p className='text-custom-grey fs-5 fw-600 mb-0'>Gender:</p>
                                    <p className='text-black fs-5 fw-600 mb-0'>{user?.gender}</p>
                                    <p className='text-custom-grey fs-5 fw-600 mb-0'>Date of Birth:</p>
                                    <p className='text-black fs-5 fw-600 mb-0'>{user?.dob?.substring(0, user?.dob.indexOf("T"))}</p>
                                    <p className='text-custom-grey fs-5 fw-600 mb-0'>Location:</p>
                                    <p className='text-black fs-5 fw-600 mb-0'>{user?.address}</p>
                                </div>
                            </div>
                        </Col>
                        <Col xxl={7} lg={12}>
                            <div className='px-2 py-3 bg-white rounded h-70vh h-xl-auto'>
                                <div className='profile-tab'>
                                    <Tabs
                                        defaultActiveKey="Plan"
                                        id="justify-tab-example"
                                        className="mb-3"
                                    >
                                        <Tab eventkey="Plan" title="Plan">
                                            <div>
                                                {mealPlans && mealPlans.length > 0
                                                    ?
                                                    mealPlans.map((mealPlan, i) => (
                                                        <>
                                                            <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                                <div className=''>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 79 79" fill="none">
                                                                        <g filter="url(#filter0_d_57_267)">
                                                                            <rect x="11" y="8" width="57" height="57" rx="12" fill="url(#paint0_linear_57_267)" />
                                                                        </g>
                                                                        <path d="M50.95 31.6501H28.85C28.34 31.6501 28 31.3101 28 30.8001V26.8901C28 25.7851 28.935 24.8501 30.04 24.8501H49.845C50.865 24.8501 51.8 25.7851 51.8 26.8901V30.8001C51.8 31.3101 51.46 31.6501 50.95 31.6501ZM29.7 29.9501H50.1V26.8901C50.1 26.7201 49.93 26.5501 49.76 26.5501H30.04C29.87 26.5501 29.7 26.7201 29.7 26.8901V29.9501Z" fill="white" />
                                                                        <path d="M33.78 27.4H33.27C32.675 27.4 32.25 26.975 32.25 26.38V25.02C32.25 24.425 32.675 24 33.27 24H33.78C34.375 24 34.8 24.425 34.8 25.02V26.38C34.8 26.975 34.375 27.4 33.78 27.4Z" fill="white" />
                                                                        <path d="M46.02 27.4H46.53C47.125 27.4 47.55 26.975 47.55 26.38V25.02C47.55 24.425 47.125 24 46.53 24H46.02C45.425 24 45 24.425 45 25.02V26.38C45 26.975 45.425 27.4 46.02 27.4Z" fill="white" />
                                                                        <path d="M50.95 29.9502H28.85C28.34 29.9502 28 30.2902 28 30.8002V46.9502C28 47.4602 28.34 47.8002 28.85 47.8002H50.95C51.46 47.8002 51.8 47.4602 51.8 46.9502V30.8002C51.8 30.2902 51.46 29.9502 50.95 29.9502ZM43.045 39.3002L39.9 42.7002L36.755 39.3002C35.905 38.3652 35.905 36.8352 36.755 35.9002L37.01 35.6452C37.775 34.8802 38.965 34.8802 39.73 35.6452L39.9 35.9002L40.155 35.6452C40.92 34.8802 42.11 34.8802 42.875 35.6452L43.13 35.9002C43.98 36.8352 43.98 38.3652 43.045 39.3002Z" fill="white" />
                                                                        <defs>
                                                                            <filter id="filter0_d_57_267" x="0" y="0" width="79" height="79" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                                                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                                                <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                                <feOffset dy="3" />
                                                                                <feGaussianBlur stdDeviation="5.5" />
                                                                                <feComposite in2="hardAlpha" operator="out" />
                                                                                <feColorMatrix type="matrix" values="0 0 0 0 0.563686 0 0 0 0 0.783333 0 0 0 0 0.267639 0 0 0 0.3 0" />
                                                                                <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_57_267" />
                                                                                <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_57_267" result="shape" />
                                                                            </filter>
                                                                            <linearGradient id="paint0_linear_57_267" x1="20.2694" y1="8.00002" x2="71.352" y2="11.452" gradientUnits="userSpaceOnUse">
                                                                                <stop stopColor="#8DC63F" />
                                                                                <stop offset="1" stopColor="#7FC520" />
                                                                            </linearGradient>
                                                                        </defs>
                                                                    </svg>
                                                                </div>
                                                                <div className='ms-3'>
                                                                    <h4 className='text-dark mb-1 fw-600 fs-17'>{mealPlan?.title}</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>Last edit was {moment(new Date(mealPlan?.updatedAt)).fromNow()}</p>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                        </>
                                                    ))
                                                    :
                                                    <></>
                                                }

                                                {/* <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                            <div className=''>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 79 79" fill="none">
                                                                    <g filter="url(#filter0_d_57_267)">
                                                                        <rect x="11" y="8" width="57" height="57" rx="12" fill="url(#paint0_linear_57_267)" />
                                                                    </g>
                                                                    <path d="M50.95 31.6501H28.85C28.34 31.6501 28 31.3101 28 30.8001V26.8901C28 25.7851 28.935 24.8501 30.04 24.8501H49.845C50.865 24.8501 51.8 25.7851 51.8 26.8901V30.8001C51.8 31.3101 51.46 31.6501 50.95 31.6501ZM29.7 29.9501H50.1V26.8901C50.1 26.7201 49.93 26.5501 49.76 26.5501H30.04C29.87 26.5501 29.7 26.7201 29.7 26.8901V29.9501Z" fill="white" />
                                                                    <path d="M33.78 27.4H33.27C32.675 27.4 32.25 26.975 32.25 26.38V25.02C32.25 24.425 32.675 24 33.27 24H33.78C34.375 24 34.8 24.425 34.8 25.02V26.38C34.8 26.975 34.375 27.4 33.78 27.4Z" fill="white" />
                                                                    <path d="M46.02 27.4H46.53C47.125 27.4 47.55 26.975 47.55 26.38V25.02C47.55 24.425 47.125 24 46.53 24H46.02C45.425 24 45 24.425 45 25.02V26.38C45 26.975 45.425 27.4 46.02 27.4Z" fill="white" />
                                                                    <path d="M50.95 29.9502H28.85C28.34 29.9502 28 30.2902 28 30.8002V46.9502C28 47.4602 28.34 47.8002 28.85 47.8002H50.95C51.46 47.8002 51.8 47.4602 51.8 46.9502V30.8002C51.8 30.2902 51.46 29.9502 50.95 29.9502ZM43.045 39.3002L39.9 42.7002L36.755 39.3002C35.905 38.3652 35.905 36.8352 36.755 35.9002L37.01 35.6452C37.775 34.8802 38.965 34.8802 39.73 35.6452L39.9 35.9002L40.155 35.6452C40.92 34.8802 42.11 34.8802 42.875 35.6452L43.13 35.9002C43.98 36.8352 43.98 38.3652 43.045 39.3002Z" fill="white" />
                                                                    <defs>
                                                                        <filter id="filter0_d_57_267" x="0" y="0" width="79" height="79" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                            <feOffset dy="3" />
                                                                            <feGaussianBlur stdDeviation="5.5" />
                                                                            <feComposite in2="hardAlpha" operator="out" />
                                                                            <feColorMatrix type="matrix" values="0 0 0 0 0.563686 0 0 0 0 0.783333 0 0 0 0 0.267639 0 0 0 0.3 0" />
                                                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_57_267" />
                                                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_57_267" result="shape" />
                                                                        </filter>
                                                                        <linearGradient id="paint0_linear_57_267" x1="20.2694" y1="8.00002" x2="71.352" y2="11.452" gradientUnits="userSpaceOnUse">
                                                                            <stop stopColor="#8DC63F" />
                                                                            <stop offset="1" stopColor="#7FC520" />
                                                                        </linearGradient>
                                                                    </defs>
                                                                </svg>
                                                            </div>
                                                            <div className='ms-3'>
                                                                <h4 className='text-dark mb-1 fw-600 fs-17'>Low carb meal plan</h4>
                                                                <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>Last edit was 4 days ago</p>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                            <div className=''>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 79 79" fill="none">
                                                                    <g filter="url(#filter0_d_57_267)">
                                                                        <rect x="11" y="8" width="57" height="57" rx="12" fill="url(#paint0_linear_57_267)" />
                                                                    </g>
                                                                    <path d="M50.95 31.6501H28.85C28.34 31.6501 28 31.3101 28 30.8001V26.8901C28 25.7851 28.935 24.8501 30.04 24.8501H49.845C50.865 24.8501 51.8 25.7851 51.8 26.8901V30.8001C51.8 31.3101 51.46 31.6501 50.95 31.6501ZM29.7 29.9501H50.1V26.8901C50.1 26.7201 49.93 26.5501 49.76 26.5501H30.04C29.87 26.5501 29.7 26.7201 29.7 26.8901V29.9501Z" fill="white" />
                                                                    <path d="M33.78 27.4H33.27C32.675 27.4 32.25 26.975 32.25 26.38V25.02C32.25 24.425 32.675 24 33.27 24H33.78C34.375 24 34.8 24.425 34.8 25.02V26.38C34.8 26.975 34.375 27.4 33.78 27.4Z" fill="white" />
                                                                    <path d="M46.02 27.4H46.53C47.125 27.4 47.55 26.975 47.55 26.38V25.02C47.55 24.425 47.125 24 46.53 24H46.02C45.425 24 45 24.425 45 25.02V26.38C45 26.975 45.425 27.4 46.02 27.4Z" fill="white" />
                                                                    <path d="M50.95 29.9502H28.85C28.34 29.9502 28 30.2902 28 30.8002V46.9502C28 47.4602 28.34 47.8002 28.85 47.8002H50.95C51.46 47.8002 51.8 47.4602 51.8 46.9502V30.8002C51.8 30.2902 51.46 29.9502 50.95 29.9502ZM43.045 39.3002L39.9 42.7002L36.755 39.3002C35.905 38.3652 35.905 36.8352 36.755 35.9002L37.01 35.6452C37.775 34.8802 38.965 34.8802 39.73 35.6452L39.9 35.9002L40.155 35.6452C40.92 34.8802 42.11 34.8802 42.875 35.6452L43.13 35.9002C43.98 36.8352 43.98 38.3652 43.045 39.3002Z" fill="white" />
                                                                    <defs>
                                                                        <filter id="filter0_d_57_267" x="0" y="0" width="79" height="79" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                            <feOffset dy="3" />
                                                                            <feGaussianBlur stdDeviation="5.5" />
                                                                            <feComposite in2="hardAlpha" operator="out" />
                                                                            <feColorMatrix type="matrix" values="0 0 0 0 0.563686 0 0 0 0 0.783333 0 0 0 0 0.267639 0 0 0 0.3 0" />
                                                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_57_267" />
                                                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_57_267" result="shape" />
                                                                        </filter>
                                                                        <linearGradient id="paint0_linear_57_267" x1="20.2694" y1="8.00002" x2="71.352" y2="11.452" gradientUnits="userSpaceOnUse">
                                                                            <stop stopColor="#8DC63F" />
                                                                            <stop offset="1" stopColor="#7FC520" />
                                                                        </linearGradient>
                                                                    </defs>
                                                                </svg>
                                                            </div>
                                                            <div className='ms-3'>
                                                                <h4 className='text-dark mb-1 fw-600 fs-17'>Low carb meal plan</h4>
                                                                <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>Last edit was 4 days ago</p>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                        <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                            <div className=''>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="61" height="61" viewBox="0 0 79 79" fill="none">
                                                                    <g filter="url(#filter0_d_57_267)">
                                                                        <rect x="11" y="8" width="57" height="57" rx="12" fill="url(#paint0_linear_57_267)" />
                                                                    </g>
                                                                    <path d="M50.95 31.6501H28.85C28.34 31.6501 28 31.3101 28 30.8001V26.8901C28 25.7851 28.935 24.8501 30.04 24.8501H49.845C50.865 24.8501 51.8 25.7851 51.8 26.8901V30.8001C51.8 31.3101 51.46 31.6501 50.95 31.6501ZM29.7 29.9501H50.1V26.8901C50.1 26.7201 49.93 26.5501 49.76 26.5501H30.04C29.87 26.5501 29.7 26.7201 29.7 26.8901V29.9501Z" fill="white" />
                                                                    <path d="M33.78 27.4H33.27C32.675 27.4 32.25 26.975 32.25 26.38V25.02C32.25 24.425 32.675 24 33.27 24H33.78C34.375 24 34.8 24.425 34.8 25.02V26.38C34.8 26.975 34.375 27.4 33.78 27.4Z" fill="white" />
                                                                    <path d="M46.02 27.4H46.53C47.125 27.4 47.55 26.975 47.55 26.38V25.02C47.55 24.425 47.125 24 46.53 24H46.02C45.425 24 45 24.425 45 25.02V26.38C45 26.975 45.425 27.4 46.02 27.4Z" fill="white" />
                                                                    <path d="M50.95 29.9502H28.85C28.34 29.9502 28 30.2902 28 30.8002V46.9502C28 47.4602 28.34 47.8002 28.85 47.8002H50.95C51.46 47.8002 51.8 47.4602 51.8 46.9502V30.8002C51.8 30.2902 51.46 29.9502 50.95 29.9502ZM43.045 39.3002L39.9 42.7002L36.755 39.3002C35.905 38.3652 35.905 36.8352 36.755 35.9002L37.01 35.6452C37.775 34.8802 38.965 34.8802 39.73 35.6452L39.9 35.9002L40.155 35.6452C40.92 34.8802 42.11 34.8802 42.875 35.6452L43.13 35.9002C43.98 36.8352 43.98 38.3652 43.045 39.3002Z" fill="white" />
                                                                    <defs>
                                                                        <filter id="filter0_d_57_267" x="0" y="0" width="79" height="79" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                            <feOffset dy="3" />
                                                                            <feGaussianBlur stdDeviation="5.5" />
                                                                            <feComposite in2="hardAlpha" operator="out" />
                                                                            <feColorMatrix type="matrix" values="0 0 0 0 0.563686 0 0 0 0 0.783333 0 0 0 0 0.267639 0 0 0 0.3 0" />
                                                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_57_267" />
                                                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_57_267" result="shape" />
                                                                        </filter>
                                                                        <linearGradient id="paint0_linear_57_267" x1="20.2694" y1="8.00002" x2="71.352" y2="11.452" gradientUnits="userSpaceOnUse">
                                                                            <stop stopColor="#8DC63F" />
                                                                            <stop offset="1" stopColor="#7FC520" />
                                                                        </linearGradient>
                                                                    </defs>
                                                                </svg>
                                                            </div>
                                                            <div className='ms-3'>
                                                                <h4 className='text-dark mb-1 fw-600 fs-17'>Low carb meal plan</h4>
                                                                <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>Last edit was 4 days ago</p>
                                                            </div>
                                                        </div>
                                                        <hr /> */}
                                            </div>
                                        </Tab>
                                        <Tab eventkey="Membership" title="Membership">
                                            <div className='px-4'>
                                                <h5 className='fs-6 fw-600 mt-4 mb-3'>Active Subscriptions</h5>
                                                <Row>
                                                    <Col lg={8}>
                                                        <div className='p-3 membership-box'>
                                                            <div className='d-flex justify-content-between'>
                                                                <h6 className='fs-6 fw-600 text-custom-grey mb-0'>Membership Type</h6>
                                                                <h2 className='fw-600 mb-0'>${user?.activeSubscriptionPlan?.subscriptionId?.price} <span className='fs-6 fw-600 text-custom-grey'>{'/' + user?.activeSubscriptionPlan?.subscriptionId?.validityType}</span></h2>
                                                            </div>
                                                            <div>
                                                                <span className='d-inline bg-green px-3 py-1 rounded text-white fs-6 fw-600 me-2'>{user?.activeSubscriptionPlan?.subscriptionId?.title}</span> <span className=' rounded text-black fs-6 fw-600 '>Plan</span>
                                                            </div>
                                                            <span className='custom-hr'></span>
                                                            <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>{user?.activeSubscriptionPlan?.status == 'active' && new Date(user?.activeSubscriptionPlan?.startDate).setHours(0, 0, 0, 0) > new Date().setHours(0, 0, 0, 0) ? `Upcoming from ${user?.activeSubscriptionPlan?.startDate.substring(0, user?.activeSubscriptionPlan?.startDate.indexOf("T"))}` : `${Math.max(0, 30 - moment().diff(moment(user?.activeSubscriptionPlan?.startDate), 'days'))} of 30 days remaining`}</p>
                                                        </div>
                                                    </Col>
                                                    <Col lg={4}>
                                                        <div className='px-3 py-5 text-center membership-box'>
                                                            <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>Next Renews</p>
                                                            <h4 className='text-dark mb-1 fw-600 fs-5'>on {moment(user?.activeSubscriptionPlan?.startDate).add(30, 'days').format('MMMM DD, YYYY')}</h4>

                                                        </div>
                                                    </Col>
                                                </Row>
                                            </div>
                                            <div>
                                                <h5 className='fs-6 fw-600 mt-4 mb-3 ms-3'>Past Subscriptions</h5>
                                                <hr />
                                                {mealPlans && mealPlans.length > 0 && mealPlans.filter(mealPlan => {
                                                    return mealPlan.status === 'deactive';
                                                })
                                                    .map(mealPlan => (
                                                        <>
                                                            <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                                <div className=''>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="57" height="57" viewBox="0 0 57 57" fill="none">
                                                                        <rect width="57" height="57" rx="7" fill="#F8FAF8" />
                                                                        <path d="M34.7767 28.4229L29.7297 15.7279C29.3413 14.7574 27.9437 14.7574 27.5557 15.7279L22.7028 28.4229L15.9477 22.095C15.0936 21.3186 13.7346 22.095 14.0453 23.2207L16.8018 34.4016C16.996 35.178 17.6947 35.7603 18.5488 35.7603H38.9306C39.746 35.7603 40.4834 35.178 40.6775 34.4013L43.4341 23.2205C43.706 22.0947 42.347 21.3181 41.5317 22.0947L34.7767 28.4229Z" fill="#A7F4AF" />
                                                                        <path d="M38.4258 40.6132H19.2475C18.2382 40.6132 17.4229 39.7978 17.4229 38.7885C17.4229 37.7793 18.2383 36.9639 19.2475 36.9639H38.387C39.3963 36.9639 40.2117 37.7793 40.2117 38.7885C40.2117 39.798 39.3965 40.6132 38.426 40.6132H38.4258Z" fill="#A7F4AF" />
                                                                    </svg>
                                                                </div>
                                                                <div className='ms-3'>
                                                                    <h4 className='text-dark mb-1 fw-600 fs-17'>{mealPlan?.title}</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>Last edit was {moment(new Date(mealPlan?.updatedAt)).fromNow()}</p>
                                                                </div>
                                                            </div>
                                                            <hr />
                                                        </>
                                                    ))}


                                                {/* <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                            <div className=''>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="57" height="57" viewBox="0 0 57 57" fill="none">
                                                                    <rect width="57" height="57" rx="7" fill="#F8FAF8" />
                                                                    <path d="M34.7767 28.4229L29.7297 15.7279C29.3413 14.7574 27.9437 14.7574 27.5557 15.7279L22.7028 28.4229L15.9477 22.095C15.0936 21.3186 13.7346 22.095 14.0453 23.2207L16.8018 34.4016C16.996 35.178 17.6947 35.7603 18.5488 35.7603H38.9306C39.746 35.7603 40.4834 35.178 40.6775 34.4013L43.4341 23.2205C43.706 22.0947 42.347 21.3181 41.5317 22.0947L34.7767 28.4229Z" fill="#A7F4AF" />
                                                                    <path d="M38.4258 40.6132H19.2475C18.2382 40.6132 17.4229 39.7978 17.4229 38.7885C17.4229 37.7793 18.2383 36.9639 19.2475 36.9639H38.387C39.3963 36.9639 40.2117 37.7793 40.2117 38.7885C40.2117 39.798 39.3965 40.6132 38.426 40.6132H38.4258Z" fill="#A7F4AF" />
                                                                </svg>
                                                            </div>
                                                            <div className='ms-3'>
                                                                <h4 className='text-dark mb-1 fw-600 fs-17'>Low carb meal plan</h4>
                                                                <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>Last edit was 4 days ago</p>
                                                            </div>
                                                        </div>
                                                        <hr /> */}
                                            </div>
                                        </Tab>
                                    </Tabs>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
