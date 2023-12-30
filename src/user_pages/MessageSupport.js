import React, { useState, useEffect } from 'react';
//import UserSidebar from '../User_components/UserSidebar';
//import TopBar from '../components/TopBar';
import { Button, Col, Row, Form } from 'react-bootstrap';
//import Salad from '../assets/images/greek-salad.png';
//import Men from '../assets/images/young-man.png';
import io from 'socket.io-client';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'

const socket = io(process.env.REACT_APP_BASE_URL);


export default function MessageSupport() {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedChat, setSelectedChat] = useState('')
    const [supportUser, setSupportUser] = useState(null)
    const [userOnline, setUserOnline] = useState(false)
    const [onlineUsers, setOnlineUsers] = useState([])

    const fetchChat = async (userId) => {
        let supportUserResponse
        const resSupportUser = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getSupportUser`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (resSupportUser.ok) {
            supportUserResponse = await resSupportUser.json()
            console.log(supportUserResponse)
            setSupportUser(supportUserResponse?.data)
        } else {
            return
        }
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/chat/createChat`, {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({ receiverId: supportUserResponse?.data?._id, senderId: userId })
        })

        if (res.ok) {
            const response = await res.json()
            console.log(response._id)
            setSelectedChat(response._id)
            fetchMessages(response._id);
            socket.emit("join chat", response._id);
        }
    }

    const fetchMessages = async (chatId) => {

        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/chat/getMessages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ chatId })
        })

        if (res.ok) {
            const response = await res.json()
            setMessages(response?.data)
        }
    }
    const sendMessage = () => {
        console.log('user', user)
        console.log('supportUser', supportUser)
        if (message.trim() !== '') {
            const newMessage = {
                _id: null,
                senderId: { _id: user._id, image: user.image },
                receiverId: { _id: supportUser?._id, image: supportUser?.image },
                chatId: selectedChat,
                message: message,
                createdAt: new Date().toISOString()
            };
            setMessages(current => [...current, newMessage]);
            socket.emit('chat message', newMessage);
            setMessage('');
        }
    };

    const setupUserData = async () => {
        try {
            let userdata = JSON.parse(localStorage.getItem('userdata'));
            if (userdata) {
                console.log(userdata)
                setUser(userdata);
                // await fetchSupportUser();
                await fetchChat(userdata._id);
                socket.emit("setup", userdata);
                socket.on("connected", () => setUserOnline(true));
            } else {
                navigate('/');
            }
        } catch (error) {
            console.error("Error setting up user data:", error);
        }
    };

    useEffect(() => {
        socket.on('online-users', (users) => {
            setOnlineUsers(users);
        });
    }, [onlineUsers])

    useEffect(() => {
        setupUserData()
    }, [localStorage.getItem('userdata')])

    useEffect(() => {
        // Listen for incoming messages
        socket.on('message recieved', (message) => {
            setMessages([...messages, message]);
        });

        //   return () => {
        //     // Clean up socket connection
        //     socket.disconnect();
        //   };
    }, [messages]);




    console.log('messages', messages)
    console.log('supportUser', supportUser)
    console.log('onlineUsers', onlineUsers)
    return (
        <div className='p-2'>
            <div className='main-content'>
                <div className='p-xl-4'>
                    <Row>
                        <Col lg={12}>
                            <div className='px-2 py-3 bg-white rounded'>
                                <div className='d-sm-flex justify-content-start align-items-center px-4 pt-3 pb-2'>
                                    <div className='img-salad'>
                                        <img className='img-fluid w-100 h-100' src={supportUser?.image} />
                                    </div>
                                    <div className='ms-3 w-100'>
                                        <div className='d-sm-flex justify-content-between align-items-center'>
                                            <div>
                                                <h4 className='text-dark mb-1 fw-600 fs-17'>{supportUser?.firstname}</h4>
                                                <p className={`${onlineUsers.includes(supportUser?._id) ? 'text-green' : 'text-pink'} d-flex align-items-center gap-2 me-3 fw-600 fs-15 mb-0`}><span className={`${onlineUsers.includes(supportUser?._id) ? 'green-dot' : 'pink-dot'} m-0 d-inline-block p-0`}></span>{onlineUsers.includes(supportUser?._id) ? 'Active' : 'Offline'}</p>
                                            </div>
                                        </div>

                                    </div>
                                </div>
                                <hr />
                                <div className='px-4 py-3 msg-list'>
                                    {/* {messages && messages.length > 0
                                        ?
                                        messages.map((message, i) => (
                                            <>
                                                {message?.senderId?._id === user?._id ?
                                                    (<div className='msg-right'>
                                                        <div className='d-flex gap-3'>
                                                            <div>
                                                                <span className='msg bg-green text-white'>{message?.message}</span>
                                                                <span className='fw-15 d-block text-custom-grey text-end'>{moment(message?.createdAt).format('h:mm A')}</span>
                                                            </div>
                                                            <div className='message-img'>
                                                                <img className='w-100 h-100' src={message?.senderId?.image} />
                                                            </div>
                                                        </div>
                                                    </div>)
                                                    :
                                                    (<div className='msg-left'>
                                                        <div className='d-flex gap-3'>
                                                            <div className='message-img'>
                                                                <img className='w-100 h-100' src={message?.senderId?.image} />
                                                            </div>
                                                            <div>
                                                                <span className='msg bg-light'>{message?.message}</span>
                                                                <span className='fw-15 d-inline-block text-custom-grey'>{moment(message?.createdAt).format('h:mm A')}</span>
                                                            </div>
                                                        </div>
                                                    </div>)
                                                }
                                            </>
                                        ))
                                        :
                                        <></>
                                    } */}

                                    {messages && messages.length > 0
                                        ? messages.map((message, i) => (
                                            <React.Fragment key={i}>
                                                {message?.senderId?._id === user?._id ? (
                                                    <div className='msg-right'>
                                                        <div className='d-flex gap-3'>
                                                            <div>
                                                                <span className='msg bg-green text-white'>{message?.message}</span>
                                                                <span className='fw-15 d-block text-custom-grey text-end'>{moment(message?.createdAt).format('h:mm A')}</span>
                                                            </div>
                                                            <div className='message-img'>
                                                                <img className='w-100 h-100' src={message?.senderId?.image} alt={`Sender ${i}`} />
                                                            </div>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className='msg-left'>
                                                        <div className='d-flex gap-3'>
                                                            <div className='message-img'>
                                                                <img className='w-100 h-100' src={message?.senderId?.image} alt={`Sender ${i}`} />
                                                            </div>
                                                            <div>
                                                                <span className='msg bg-light'>{message?.message}</span>
                                                                <span className='fw-15 d-inline-block text-custom-grey'>{moment(message?.createdAt).format('h:mm A')}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </React.Fragment>
                                        ))
                                        : <></>
                                    }
                                    {/* <div className='msg-left'>
                                                <div className='d-flex gap-3 flex-column'>
                                                    <div className='d-flex align-items-center gap-3'>
                                                        <div className='message-img rounded-circle'>
                                                            <img className='w-100 h-100 rounded-circle' src={Men} />
                                                        </div>
                                                        <span className='text-dark fw-600'>Rana Utban</span>
                                                        <span className='fs-15 d-inline-block text-custom-grey'>11:43 PM</span>
                                                    </div>
                                                    <div>
                                                        <span className='user-msg msg bg-light text-muted ms-5'>Hi, How are you?</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='msg-right '>
                                                <div className='d-flex gap-3 flex-column'>
                                                    <div className='d-flex align-items-center gap-3 justify-content-end'>

                                                        <span className='text-dark fw-600'>Rana Utban</span>
                                                        <span className='fs-15 d-inline-block text-custom-grey'>11:43 PM</span>
                                                        <div className='message-img rounded-circle'>
                                                            <img className='w-100 h-100 rounded-circle' src={Men} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className='user-msg msg bg-green text-white me-5'>Hi, How are you?</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='msg-left'>
                                                <div className='d-flex gap-3 flex-column'>
                                                    <div className='d-flex align-items-center gap-3'>
                                                        <div className='message-img rounded-circle'>
                                                            <img className='w-100 h-100 rounded-circle' src={Men} />
                                                        </div>
                                                        <span className='text-dark fw-600'>Rana Utban</span>
                                                        <span className='fs-15 d-inline-block text-custom-grey'>11:43 PM</span>
                                                    </div>
                                                    <div>
                                                        <span className='user-msg msg bg-light text-muted ms-5'>Lorem Ipsum is simply dummy text of the printing</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='msg-right '>
                                                <div className='d-flex gap-3 flex-column'>
                                                    <div className='d-flex align-items-center gap-3 justify-content-end'>

                                                        <span className='text-dark fw-600'>Rana Utban</span>
                                                        <span className='fs-15 d-inline-block text-custom-grey'>11:43 PM</span>
                                                        <div className='message-img rounded-circle'>
                                                            <img className='w-100 h-100 rounded-circle' src={Men} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className='user-msg msg bg-green text-white me-5'>Lorem Ipsum is simply dummy text of the printing</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='msg-left'>
                                                <div className='d-flex gap-3 flex-column'>
                                                    <div className='d-flex align-items-center gap-3'>
                                                        <div className='message-img rounded-circle'>
                                                            <img className='w-100 h-100 rounded-circle' src={Men} />
                                                        </div>
                                                        <span className='text-dark fw-600'>Rana Utban</span>
                                                        <span className='fs-15 d-inline-block text-custom-grey'>11:43 PM</span>
                                                    </div>
                                                    <div>
                                                        <span className='user-msg msg bg-light text-muted ms-5'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='msg-right '>
                                                <div className='d-flex gap-3 flex-column'>
                                                    <div className='d-flex align-items-center gap-3 justify-content-end'>
                                                        <span className='text-dark fw-600'>Rana Utban</span>
                                                        <span className='fs-15 d-inline-block text-custom-grey'>11:43 PM</span>
                                                        <div className='message-img rounded-circle'>
                                                            <img className='w-100 h-100 rounded-circle' src={Men} />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <span className='user-msg msg bg-green text-white me-5'>It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.</span>
                                                    </div>
                                                </div>
                                            </div> */}
                                </div>
                                <div className=" px-3 pb-3  pt-3">
                                    <div className='border rounded msg-type-2 px-2 pt-2 pb-5 bg-light'>
                                        <Form.Control className=' fw-600 border-0 shadow-none bg-none' type="text" value={message} placeholder="Write a message..." onChange={(e) => setMessage(e.target.value)} />
                                        <Button className='bg-green custom-shadow border-0 rounded text-white fw-600 px-0' onClick={sendMessage}><svg className='' xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M13.0947 8.49941L1.27637 1.51874V5.14196L6.9614 8.49919L1.27637 11.8575V15.4807L13.0947 8.49941Z" fill="white" />
                                            <path d="M0.708349 6.50019C0.274466 6.24393 0 5.71789 0 5.14209V1.51887C0 0.392676 0.996386 -0.340766 1.84508 0.160547L13.6634 7.14122C14.6077 7.69903 14.6077 9.29988 13.6634 9.8577L1.84508 16.8395C0.996386 17.3408 0 16.6073 0 15.4813V11.8581C0 11.2823 0.274293 10.7563 0.708349 10.4998L4.09356 8.50008L0.708349 6.50019ZM2.55343 3.96676V4.20208L7.52989 7.14094C8.47443 7.69875 8.47462 9.2996 7.53007 9.85742L2.55361 12.7974V13.0325L10.2271 8.4993L2.55343 3.96676Z" fill="white" />
                                        </svg> Send</Button>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
