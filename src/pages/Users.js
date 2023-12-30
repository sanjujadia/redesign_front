import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Col, Form, InputGroup, Row } from 'react-bootstrap';
//import Sidebar from '../components/Sidebar';
//import TopBar from '../components/TopBar';
//import UserImg from '../assets/images/admin.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'
import io from 'socket.io-client';
import { TailSpin } from 'react-loader-spinner';
const socket = io(process.env.REACT_APP_BASE_URL);

export default function Users() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [users, setUsers] = useState(null);
    const [searchUser, setSearchUser] = useState();
    const [onlineUsers, setOnlineUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    // const fetchUsersData = async () => {
    //        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getAllUsers`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(res => res.json())
    //     if (response.status) {
    //         setUsers(response?.data)
    //     } else {
    //         setUsers([])
    //     }
    // }
    const fetchUsersData = async () => {
        try {
          setLoading(true); // Set loading to true before the fetch
          const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getAllUsers`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          }).then(res => res.json());
    
          if (response.status) {
            setUsers(response?.data);
          }
        } catch (error) {
          console.error('Error fetching users:', error);
        } finally {
          setLoading(false);  
        }
      };
    useEffect(() => {
        // let userdata = JSON.parse(localStorage.getItem('userdata'))
        // console.log('userdata',userdata)
        if (isAuthenticated) {
            fetchUsersData()
            socket.on('online-users', (users) => {
                setOnlineUsers(users);
              });
        } else {
            navigate('/')
        }
    }, [localStorage.getItem('userdata')])

    console.log('users', users)
    return (
        <div className='p-4'>
 {loading && (
        <div className="loader-overlay">
          <TailSpin height={80} width={80} color="#4fa94d" ariaLabel="tail-spin-loading" radius={1} visible={true} />
        </div>
      )}
            <Row>
                <Col>
                    <div className='shadow-sm bg-white rounded p-xl-5 p-3'>
                        <Row className='align-items-center'>
                            <Col lg={5}>
                                <div>
                                    <h5 className='text-dark mb-0 fw-600 fs-5 left-border'>Add New Users</h5>
                                    <p className='text-custom-grey fw-600 fs-17 ps-2 mb-0'>{users && users?.length > 1 ? users?.length + ' users' : users?.length + ' user'}</p>
                                </div>
                            </Col>
                            <Col></Col>
                            <Col lg={5}>
                                <InputGroup className="border border-gray bg-light rounded " >
                                    <InputGroup.Text className='border-0 bg-none' id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                        <path d="M8.03143 0.756583C5.67537 0.757592 3.46224 1.88926 2.07826 3.80052C0.694115 5.71199 0.30612 8.17197 1.03464 10.4179C1.76336 12.6641 3.52018 14.425 5.76104 15.1547C8.00174 15.8842 10.4554 15.4944 12.3616 14.1062L16.0277 17.7816C16.3195 18.0741 16.7449 18.1884 17.1436 18.0814C17.5423 17.9742 17.8536 17.6621 17.9605 17.2624C18.0672 16.8627 17.9533 16.4362 17.6615 16.1437L13.9954 12.4683C15.0662 10.9928 15.5531 9.17177 15.3625 7.3572C15.1716 5.54263 14.3166 3.86351 12.9625 2.64422C11.6085 1.42492 9.85152 0.752335 8.0317 0.756366L8.03143 0.756583ZM8.03143 13.2007C6.69162 13.2007 5.40676 12.6671 4.45937 11.7173C3.51199 10.7675 2.97982 9.47942 2.97982 8.13621C2.97982 6.79299 3.51199 5.50487 4.45937 4.55507C5.40676 3.60528 6.69162 3.07176 8.03143 3.07176C9.37124 3.07176 10.6561 3.60528 11.6035 4.55507C12.5509 5.50487 13.083 6.79299 13.083 8.13621C13.0814 9.4788 12.5489 10.7662 11.6017 11.7155C10.6547 12.6651 9.37067 13.1991 8.03143 13.2007Z" fill="#ADADAD" />
                                    </svg></InputGroup.Text>
                                    <Form.Control
                                        className='border-0 bg-none shadow-none outline-none py-2'
                                        placeholder="Search users"
                                        value={searchUser}
                                        onChange={(e) => setSearchUser(e.target.value)}
                                        type='search'
                                        aria-describedby="basic-addon1"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                        <Row className='mt-4'>
                            <Col lg={12}>
                                <div className='user-grid'>
                                    {users && users.length > 0 ?
                                        users.filter(user => {
                                            return searchUser ? user.firstname.includes(searchUser) || user.email.includes(searchUser) : users
                                        }).map((user, i) => (
                                            <div>
                                                <hr />
                                                <div className='d-sm-flex justify-content-start align-items-center ps-3'>

                                                    <div className='img-salad'>
                                                        <img className='img-fluid w-100 h-100 cursor' src={user?.image} onClick={() => navigate(`/userdetail/${user?._id}`)} />
                                                        <span className={`${onlineUsers.includes(user?._id) ? 'green-dot' : 'pink-dot'}`}></span>
                                                    </div>
                                                    <div className='ms-3 w-100'>
                                                        <div className='d-sm-flex justify-content-between align-items-center'>
                                                            <div>
                                                                <h4 className='text-dark mb-0 fw-600 fs-17 cursor' onClick={() => navigate(`/userdetail/${user?._id}`)}>{user?.lastname == null ? user?.firstname : user?.firstname + " " + user?.lastname}</h4>
                                                                <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>{user?.email}</p>
                                                            </div>
                                                            <Link to={`/userdetail/${user?._id}`} className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                            </svg></Link>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                        :
                                        <>
                                            <hr />
                                        </>
                                    }

                                    {/* <div>
                                                    <hr />
                                                    <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                        <div className='img-salad'>
                                                            <img className='img-fluid w-100 h-100' src={UserImg} />
                                                            <span className='pink-dot'></span>
                                                        </div>
                                                        <div className='ms-3 w-100'>
                                                            <div className='d-sm-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <h4 className='text-dark mb-0 fw-600 fs-17'>Symond Write</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>symondwrite13@gmail.com</p>
                                                                </div>
                                                                <Link to="/userdetail" className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                                </svg></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <hr />
                                                    <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                        <div className='img-salad'>
                                                            <img className='img-fluid w-100 h-100' src={UserImg} />
                                                            <span className='green-dot'></span>
                                                        </div>
                                                        <div className='ms-3 w-100'>
                                                            <div className='d-sm-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <h4 className='text-dark mb-0 fw-600 fs-17'>Symond Write</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>symondwrite13@gmail.com</p>
                                                                </div>
                                                                <Link to="/userdetail" className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                                </svg></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <hr />
                                                    <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                        <div className='img-salad'>
                                                            <img className='img-fluid w-100 h-100' src={UserImg} />
                                                            <span className='green-dot'></span>
                                                        </div>
                                                        <div className='ms-3 w-100'>
                                                            <div className='d-sm-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <h4 className='text-dark mb-0 fw-600 fs-17'>Symond Write</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>symondwrite13@gmail.com</p>
                                                                </div>
                                                                <Link to="/userdetail" className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                                </svg></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <hr />
                                                    <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                        <div className='img-salad'>
                                                            <img className='img-fluid w-100 h-100' src={UserImg} />
                                                            <span className='green-dot'></span>
                                                        </div>
                                                        <div className='ms-3 w-100'>
                                                            <div className='d-sm-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <h4 className='text-dark mb-0 fw-600 fs-17'>Symond Write</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>symondwrite13@gmail.com</p>
                                                                </div>
                                                                <Link to="/userdetail" className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                                </svg></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <hr />
                                                    <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                        <div className='img-salad'>
                                                            <img className='img-fluid w-100 h-100' src={UserImg} />
                                                            <span className='pink-dot'></span>
                                                        </div>
                                                        <div className='ms-3 w-100'>
                                                            <div className='d-sm-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <h4 className='text-dark mb-0 fw-600 fs-17'>Symond Write</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>symondwrite13@gmail.com</p>
                                                                </div>
                                                                <Link to="/userdetail" className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                                </svg></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <hr />
                                                    <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                        <div className='img-salad'>
                                                            <img className='img-fluid w-100 h-100' src={UserImg} />
                                                            <span className='green-dot'></span>
                                                        </div>
                                                        <div className='ms-3 w-100'>
                                                            <div className='d-sm-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <h4 className='text-dark mb-0 fw-600 fs-17'>Symond Write</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>symondwrite13@gmail.com</p>
                                                                </div>
                                                                <Link to="/userdetail" className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                                </svg></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <hr />
                                                    <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                        <div className='img-salad'>
                                                            <img className='img-fluid w-100 h-100' src={UserImg} />
                                                            <span className='green-dot'></span>
                                                        </div>
                                                        <div className='ms-3 w-100'>
                                                            <div className='d-sm-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <h4 className='text-dark mb-0 fw-600 fs-17'>Symond Write</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>symondwrite13@gmail.com</p>
                                                                </div>
                                                                <Link to="/userdetail" className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                                </svg></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <hr />
                                                    <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                        <div className='img-salad'>
                                                            <img className='img-fluid w-100 h-100' src={UserImg} />
                                                            <span className='pink-dot'></span>
                                                        </div>
                                                        <div className='ms-3 w-100'>
                                                            <div className='d-sm-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <h4 className='text-dark mb-0 fw-600 fs-17'>Symond Write</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>symondwrite13@gmail.com</p>
                                                                </div>
                                                                <Link to="/userdetail" className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                                </svg></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <hr />
                                                    <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                        <div className='img-salad'>
                                                            <img className='img-fluid w-100 h-100' src={UserImg} />
                                                            <span className='green-dot'></span>
                                                        </div>
                                                        <div className='ms-3 w-100'>
                                                            <div className='d-sm-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <h4 className='text-dark mb-0 fw-600 fs-17'>Symond Write</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>symondwrite13@gmail.com</p>
                                                                </div>
                                                                <Link to="/userdetail" className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                                </svg></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <hr />
                                                    <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                        <div className='img-salad'>
                                                            <img className='img-fluid w-100 h-100' src={UserImg} />
                                                            <span className='green-dot'></span>
                                                        </div>
                                                        <div className='ms-3 w-100'>
                                                            <div className='d-sm-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <h4 className='text-dark mb-0 fw-600 fs-17'>Symond Write</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>symondwrite13@gmail.com</p>
                                                                </div>
                                                                <Link to="/userdetail" className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                                </svg></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <hr />
                                                    <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                        <div className='img-salad'>
                                                            <img className='img-fluid w-100 h-100' src={UserImg} />
                                                            <span className='pink-dot'></span>
                                                        </div>
                                                        <div className='ms-3 w-100'>
                                                            <div className='d-sm-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <h4 className='text-dark mb-0 fw-600 fs-17'>Symond Write</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>symondwrite13@gmail.com</p>
                                                                </div>
                                                                <Link to="/userdetail" className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                                </svg></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <hr />
                                                    <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                        <div className='img-salad'>
                                                            <img className='img-fluid w-100 h-100' src={UserImg} />
                                                            <span className='pink-dot'></span>
                                                        </div>
                                                        <div className='ms-3 w-100'>
                                                            <div className='d-sm-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <h4 className='text-dark mb-0 fw-600 fs-17'>Symond Write</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>symondwrite13@gmail.com</p>
                                                                </div>
                                                                <Link to="/userdetail" className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                                </svg></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div>
                                                    <hr />
                                                    <div className='d-sm-flex justify-content-start align-items-center ps-3'>
                                                        <div className='img-salad'>
                                                            <img className='img-fluid w-100 h-100' src={UserImg} />
                                                            <span className='green-dot'></span>
                                                        </div>
                                                        <div className='ms-3 w-100'>
                                                            <div className='d-sm-flex justify-content-between align-items-center'>
                                                                <div>
                                                                    <h4 className='text-dark mb-0 fw-600 fs-17'>Symond Write</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>symondwrite13@gmail.com</p>
                                                                </div>
                                                                <Link to="/userdetail" className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                                </svg></Link>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div> */}
                                </div>
                            </Col>
                        </Row>
                    </div>
                </Col>
            </Row>
        </div>
    )
}
