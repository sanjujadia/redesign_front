import React, { useState, useEffect } from 'react';
import { Button, Badge, Col, Container, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import OutsideClickHandler from 'react-outside-click-handler';
import FoodImage from '../assets/images/greek-salad-food 2.png'
import moment from 'moment'

export default function TopBar(props) {
    const { user, isAuthenticated } = useAuth()
    const [notificationVisible, setNotificationVisible] = useState(false)
    const [alertVisible, setAlertVisible] = useState(false)
    const [notificationBadgeVisible, setNotificationBadgeVisible] = useState(true)
    const [alertBadgeVisible, setAlertBadgeVisible] = useState(true)
    const [notifications, setNotifications] = useState([])
    const [alerts, setAlerts] = useState([])

    const handleNotificationVisible = () => {
        setNotificationVisible(!notificationVisible)
        setNotificationBadgeVisible(notifications.length > 0 ? false : true)
    }
    const handleAlertVisible = () => {
        setAlertVisible(!alertVisible)
        setAlertBadgeVisible(false)
    }

    // const fetchNotifications = async (id) => {
    //     const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getNotifications/${id}`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(res => res.json())

    //     if (res.status) {
    //         console.log('notifications', res.data)
    //         setNotifications(res.data)
    //     } else {
    //         setNotifications(res.data)
    //     }
    // }
    const fetchNotifications = async (id) => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getNotifications/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (res.ok) {
                const data = await res.json();
                if (data.status) {
                    console.log('notifications', data.data);
                    setNotifications(data.data);
                } else {
                    setNotifications(data.data);
                }
            } else {
                console.error('Failed to fetch notifications:', res.status);
                // Handle the error as needed
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
            // Handle the error as needed
        }
    };
    

    useEffect(() => {
        if (isAuthenticated) {
            fetchNotifications(user?._id)
        }
    }, [user])

    return (
        <div className='topbar bg-white shadow-sm py-3 position-relative'>
            <div className='px-5'>
                <Row className='align-items-center'>
                    <Col xl={6} className='d-none d-xxl-block'></Col>
                    <Col xxl={4} xl={6} lg={6} sm={6} >
                        <div>
                            {/* <InputGroup className="border border-gray" style={{ borderRadius: '50px' }}>
                                <InputGroup.Text className='border-0 bg-none' id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                    <path d="M8.03143 0.756583C5.67537 0.757592 3.46224 1.88926 2.07826 3.80052C0.694115 5.71199 0.30612 8.17197 1.03464 10.4179C1.76336 12.6641 3.52018 14.425 5.76104 15.1547C8.00174 15.8842 10.4554 15.4944 12.3616 14.1062L16.0277 17.7816C16.3195 18.0741 16.7449 18.1884 17.1436 18.0814C17.5423 17.9742 17.8536 17.6621 17.9605 17.2624C18.0672 16.8627 17.9533 16.4362 17.6615 16.1437L13.9954 12.4683C15.0662 10.9928 15.5531 9.17177 15.3625 7.3572C15.1716 5.54263 14.3166 3.86351 12.9625 2.64422C11.6085 1.42492 9.85152 0.752335 8.0317 0.756366L8.03143 0.756583ZM8.03143 13.2007C6.69162 13.2007 5.40676 12.6671 4.45937 11.7173C3.51199 10.7675 2.97982 9.47942 2.97982 8.13621C2.97982 6.79299 3.51199 5.50487 4.45937 4.55507C5.40676 3.60528 6.69162 3.07176 8.03143 3.07176C9.37124 3.07176 10.6561 3.60528 11.6035 4.55507C12.5509 5.50487 13.083 6.79299 13.083 8.13621C13.0814 9.4788 12.5489 10.7662 11.6017 11.7155C10.6547 12.6651 9.37067 13.1991 8.03143 13.2007Z" fill="#ADADAD" />
                                </svg></InputGroup.Text>
                                <Form.Control
                                    className='border-0 bg-none shadow-none outline-none'
                                    placeholder="Search"
                                    type='search'
                                    aria-describedby="basic-addon1"
                                />
                            </InputGroup> */}
                        </div>
                    </Col>
                    <Col className='text-end' xxl={2} xl={6} lg={6} sm={6}>
                        <div className='d-flex justify-content-end gap-4 badge-icon'>
                            <Link to=""><svg xmlns="http://www.w3.org/2000/svg" width="26" height="19" viewBox="0 0 26 19" fill="none" onClick={handleNotificationVisible}>
                                <path d="M4.21113 0.310547H21.772C21.772 0.310547 25.2363 0.310547 25.2363 3.78366V14.8359C25.2363 14.8359 25.2363 18.3105 21.772 18.3105H4.21113C4.21113 18.3105 0.746815 18.3105 0.746815 14.8359V3.78416C0.746815 3.78416 0.746817 0.310647 4.21113 0.310647V0.310547ZM4.10572 5.19781L11.7432 10.5594C12.0873 10.8 12.3921 10.9351 12.6576 10.9973C12.7416 11.0204 12.8343 11.0356 12.9332 11.0405C13.1428 11.0546 13.3218 11.0239 13.4715 10.9719C13.7153 10.9006 13.9884 10.7732 14.293 10.5592L21.9305 5.19811C21.9305 5.19811 23.4785 4.11073 22.7254 3.03255C22.7254 3.03255 21.9724 1.95533 20.4246 3.04116L13.018 8.24091L5.61141 3.04116C4.06343 1.95533 3.31018 3.03255 3.31018 3.03255C2.55738 4.11073 4.10536 5.19811 4.10536 5.19811L4.10572 5.19781Z" fill="#85C52D" />
                            </svg><Badge bg="secondary" className={`${!notificationBadgeVisible ? 'display-none' : ''}`} onClick={handleNotificationVisible}>{notifications?.length > 0 ? notifications?.length : 0}</Badge></Link>
                            <Link to=""><svg xmlns="http://www.w3.org/2000/svg" width="22" height="24" viewBox="0 0 22 24" fill="none" onClick={handleAlertVisible}>
                                <path d="M0.693292 18.4219C1.15489 18.8846 1.73973 19.1315 2.3862 19.1315H19.3455C19.9919 19.1315 20.5765 18.8846 21.0384 18.4219C21.9925 17.4653 21.9618 15.8915 20.9461 14.9659L20.1766 14.287C19.6841 13.8243 19.4071 13.2069 19.4071 12.5281V8.76347C19.4071 4.75197 16.3292 0 11.0968 0H10.6352C5.40276 0 2.3248 4.72117 2.3248 8.76347V12.5281C2.3248 13.2069 2.04784 13.8548 1.55532 14.287L0.785844 14.9659C-0.230086 15.8915 -0.26103 17.4651 0.693308 18.4219H0.693292Z" fill="#85C52D" />
                                <path d="M10.8504 23.7609C12.6356 23.7609 14.0823 22.3102 14.0823 20.52H7.61865C7.61887 22.3102 9.06549 23.7609 10.8505 23.7609H10.8504Z" fill="#85C52D" />
                            </svg><Badge bg="secondary" className={`${!alertBadgeVisible ? 'display-none' : ''}`} onClick={handleAlertVisible}>2</Badge></Link>
                        </div>
                    </Col>
                </Row>
            </div>
            <OutsideClickHandler onOutsideClick={() => { setNotificationVisible(false) }}>
                {notificationVisible && (
                    <div className={`dropdown-menu notification-ui_dd ${notificationVisible ? 'show' : ''}`} aria-labelledby="navbarDropdown">
                        <div className="notification-ui_dd-header">
                            <h3 className="text-center">Notification</h3>
                        </div>
                        <div className="notification-ui_dd-content">
                            {notifications && notifications.length > 0 ?
                                notifications.map((item, i) =>
                                (<div className="notification-list">
                                    <div className="notification-list_img">
                                        <img src={FoodImage} alt="user" />
                                    </div>
                                    <div className="notification-list_detail">
                                        <p>{item.text}</p>
                                        <p><small>{moment(item?.createdAt).fromNow()}</small></p>
                                    </div>
                                    {/* <div className="notification-list_feature-img">
                                        <img src="https://i.imgur.com/AbZqFnR.jpg" alt="Feature image"/>
                                    </div> */}
                                </div>))

                                :
                                (<></>)
                            }
                            {/* <div className="notification-list">
                                    <div className="notification-list_img">
                                        <img src="https://i.imgur.com/w4Mp4ny.jpg" alt="user"/>
                                    </div>
                                    <div className="notification-list_detail">
                                        <p><b>Richard Miles</b> reacted to your post</p>
                                        <p><small>1 day ago</small></p>
                                    </div>
                                    <div className="notification-list_feature-img">
                                        <img src="https://i.imgur.com/AbZqFnR.jpg" alt="Feature image"/>
                                    </div>
                                </div>
                                <div className="notification-list">
                                    <div className="notification-list_img">
                                        <img src="https://i.imgur.com/ltXdE4K.jpg" alt="user"/>
                                    </div>
                                    <div className="notification-list_detail">
                                        <p><b>Brian Cumin</b> reacted to your post</p>
                                        <p><small>1 day ago</small></p>
                                    </div>
                                    <div className="notification-list_feature-img">
                                        <img src="https://i.imgur.com/bpBpAlH.jpg" alt="Feature image"/>
                                    </div>
                                </div>
                                <div className="notification-list">
                                    <div className="notification-list_img">
                                        <img src="https://i.imgur.com/CtAQDCP.jpg" alt="user"/>
                                    </div>
                                    <div className="notification-list_detail">
                                        <p><b>Lance Bogrol</b> reacted to your post</p>
                                        <p><small>1 day ago</small></p>
                                    </div>
                                    <div className="notification-list_feature-img">
                                        <img src="https://i.imgur.com/iIhftMJ.jpg" alt="Feature image"/>
                                    </div>
                                </div> */}
                        </div>
                        <div className="notification-ui_dd-footer">
                            <a href="#" className="btn btn-success btn-block" onClick={() => setNotificationVisible(false)}>View All</a>
                        </div>
                    </div>
                )}
            </OutsideClickHandler>
            <OutsideClickHandler onOutsideClick={() => { setAlertVisible(false) }}>
                {alertVisible && (
                    <div className={`dropdown-menu notification-ui_dd ${alertVisible ? 'show' : ''}`} aria-labelledby="navbarDropdown">
                        <div className="notification-ui_dd-header">
                            <h3 className="text-center">Alert</h3>
                        </div>
                        <div className="notification-ui_dd-content">
                            {alerts && alerts.length > 0 ?
                                alerts.map((item, i) =>
                                (<div className="notification-list">
                                    <div className="notification-list_img">
                                        <img src={FoodImage} alt="user" />
                                    </div>
                                    <div className="notification-list_detail">
                                        <p>{item.text}</p>
                                        <p><small>{moment(item?.createdAt).fromNow()}</small></p>
                                    </div>
                                    {/* <div className="notification-list_feature-img">
                                        <img src="https://i.imgur.com/AbZqFnR.jpg" alt="Feature image"/>
                                    </div> */}
                                </div>))

                                :
                                (<></>)
                            }
                            {/* <div className="notification-list">
                                    <div className="notification-list_img">
                                        <img src="https://i.imgur.com/w4Mp4ny.jpg" alt="user"/>
                                    </div>
                                    <div className="notification-list_detail">
                                        <p><b>Richard Miles</b> reacted to your post</p>
                                        <p><small>1 day ago</small></p>
                                    </div>
                                    <div className="notification-list_feature-img">
                                        <img src="https://i.imgur.com/AbZqFnR.jpg" alt="Feature image"/>
                                    </div>
                                </div>
                                <div className="notification-list">
                                    <div className="notification-list_img">
                                        <img src="https://i.imgur.com/ltXdE4K.jpg" alt="user"/>
                                    </div>
                                    <div className="notification-list_detail">
                                        <p><b>Brian Cumin</b> reacted to your post</p>
                                        <p><small>1 day ago</small></p>
                                    </div>
                                    <div className="notification-list_feature-img">
                                        <img src="https://i.imgur.com/bpBpAlH.jpg" alt="Feature image"/>
                                    </div>
                                </div>
                                <div className="notification-list">
                                    <div className="notification-list_img">
                                        <img src="https://i.imgur.com/CtAQDCP.jpg" alt="user"/>
                                    </div>
                                    <div className="notification-list_detail">
                                        <p><b>Lance Bogrol</b> reacted to your post</p>
                                        <p><small>1 day ago</small></p>
                                    </div>
                                    <div className="notification-list_feature-img">
                                        <img src="https://i.imgur.com/iIhftMJ.jpg" alt="Feature image"/>
                                    </div>
                                </div> */}
                        </div>
                        <div className="notification-ui_dd-footer">
                            <Button href="#" className="btn btn-success btn-block" disabled={alerts.length === 0} onClick={() => setNotificationVisible(false)}>View All</Button>
                        </div>
                    </div>
                )}
            </OutsideClickHandler>
        </div>
    )
} 