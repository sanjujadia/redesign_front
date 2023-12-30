import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Button, Col, Form, InputGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Salad from '../assets/images/greek-salad.png';
import Men from '../assets/images/young-man.png';
import moment from 'moment'
import io from 'socket.io-client';

const socket = io(process.env.REACT_APP_BASE_URL);

export default function Message() {
    const navigate = useNavigate()
    const [user, setUser] = useState({})
    const [onlineUsers, setOnlineUsers] = useState([])
    const [chats, setChats] = useState([])
    const [chatId, setChatId] = useState()
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [selectedUser, setSelectedUser] = useState()
    const [selectedChat, setSelectedChat] = useState()
    const [search, setSearch] = useState()
    const [userOnline, setUserOnline] = useState(false)

    const fetchMessages = async (chatId) => {

        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/chat/getMessages`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            authorization:"Bearer " + `${user?.token}`, 
            body: JSON.stringify({ chatId })
        })

        if (res.ok) {
            const response = await res.json()
            console.log(response?.data)
            setMessages(response?.data)
        }

    }

    const fetchChats = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/chat/getChats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            authorization:"Bearer " + `${user?.token}` 
        })
        const response = await res.json()
        if (response.status) {
            setChats(response?.data)
        }
    }

    const sendMessage = () => {
        console.log('user', user)
        console.log('selectedUser', selectedUser)
        if (message.trim() !== '') {
            const newMessage = {
                _id: null,
                senderId: { _id: user._id, image: user.image },
                receiverId: {_id:selectedUser?._id,image:selectedUser?.image},
                chatId: selectedChat,
                message: message,
                createdAt: new Date().toISOString()
            };
            setMessages(current => [...current, newMessage]);
            socket.emit('chat message', newMessage);
            setMessage('');
        }
    };
    useEffect(() => {
        socket.on('online-users', (users) => {
            console.log(users,'kkkkk')
            setOnlineUsers(users);
          });
    },[onlineUsers])
    console.log(messages)
    useEffect(() => {
        let userdata = JSON.parse(localStorage.getItem('userdata'))
        if (userdata) {
            setUser(userdata)
            socket.emit("setup", userdata);
            socket.on("connected", () => setUserOnline(true));
            socket.on('online-users', (users) => {
                setOnlineUsers(users);
              });
              fetchChats()
        } else {
            navigate('/')
        }
    }, [localStorage.getItem('userdata')])

    useEffect(() => {
        // Listen for incoming messages
        socket.on('message recieved', (message) => {
            
            const chat = chats.map((item) => {if(item._id === message.chatId){item.latestMessage=message;console.log(message.time);item.createdAt = message.time}return item});
            setChats(chat)
            
            console.log('message',message)
            setMessages([...messages, message]);
        });
        
        
        // return () => {
        //     // Clean up socket connection
        //     socket.disconnect();
        // };
    }, [messages]);

    
    // console.log('messages',messages)
    // console.log('user', user)
    // console.log('selectedUser', selectedUser)
console.log('chats',chats)
    return (
        <div>
           
                        <div className='p-xl-5 p-3'>
                            <Row>
                                <Col xxl={5} lg={12} className='mb-3'>
                                    <div className='p-4 bg-white shadow-sm rounded '>
                                        <div className='d-sm-flex justify-content-between align-items-center'>
                                            <h5 className='text-dark mb-0 fw-600 fs-15 left-border'>Messages</h5>
                                            {/* <Link to="" className='text-green fs-15 fw-600'>View all</Link> */}
                                        </div>
                                        <div>
                                            <InputGroup className="border border-gray bg-light rounded mt-3" >
                                                <InputGroup.Text className='border-0 bg-none' id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="19" viewBox="0 0 18 19" fill="none">
                                                    <path d="M8.03143 0.756583C5.67537 0.757592 3.46224 1.88926 2.07826 3.80052C0.694115 5.71199 0.30612 8.17197 1.03464 10.4179C1.76336 12.6641 3.52018 14.425 5.76104 15.1547C8.00174 15.8842 10.4554 15.4944 12.3616 14.1062L16.0277 17.7816C16.3195 18.0741 16.7449 18.1884 17.1436 18.0814C17.5423 17.9742 17.8536 17.6621 17.9605 17.2624C18.0672 16.8627 17.9533 16.4362 17.6615 16.1437L13.9954 12.4683C15.0662 10.9928 15.5531 9.17177 15.3625 7.3572C15.1716 5.54263 14.3166 3.86351 12.9625 2.64422C11.6085 1.42492 9.85152 0.752335 8.0317 0.756366L8.03143 0.756583ZM8.03143 13.2007C6.69162 13.2007 5.40676 12.6671 4.45937 11.7173C3.51199 10.7675 2.97982 9.47942 2.97982 8.13621C2.97982 6.79299 3.51199 5.50487 4.45937 4.55507C5.40676 3.60528 6.69162 3.07176 8.03143 3.07176C9.37124 3.07176 10.6561 3.60528 11.6035 4.55507C12.5509 5.50487 13.083 6.79299 13.083 8.13621C13.0814 9.4788 12.5489 10.7662 11.6017 11.7155C10.6547 12.6651 9.37067 13.1991 8.03143 13.2007Z" fill="#ADADAD" />
                                                </svg></InputGroup.Text>
                                                <Form.Control
                                                    className='border-0 bg-none shadow-none outline-none py-2 text-dark fw-600'
                                                    placeholder="Search messages"
                                                    value={search}
                                                    onChange={(e) => setSearch(e.target.value)}
                                                    type='search'
                                                    aria-describedby="basic-addon1"
                                                />
                                            </InputGroup>
                                        </div>
                                        <div className='h-70vh overflow-auto'>
                                            <hr />
                                            {chats && chats.length > 0 ?
                                                chats.filter(chat => {
                                                        return search ? (chat.users[1]?.firstname?.includes(search) || (chat?.latestMessage && chat?.latestMessage?.message?.includes(search))) : true
                                                    }).sort((a, b) => a?.latestMessage?.createdAt < b?.latestMessage?.createdAt ? 1 : -1).map((chat, i) => (
                                                    <>
                                                        <div className='d-sm-flex justify-content-start align-items-center ps-3 cursor' onClick={() => { setSelectedChat(chat._id); setSelectedUser(chat?.users[1]); socket.emit("join chat", chat._id); fetchMessages(chat._id) }}>
                                                            <div className='img-salad'>
                                                                <img className='img-fluid w-100 h-100' src={chat?.users[1]?.image} />
                                                                <span className={`${onlineUsers.includes(chat?.users[1]?._id) ? 'green-dot' : 'pink-dot'}`}></span>
                                                                {/* <span className={`${chat?.users[1]?.isOnline ? 'green-dot' : 'pink-dot'}`}></span> */}
                                                            </div>
                                                            <div className='ms-3 w-100'>
                                                                <div className='d-sm-flex justify-content-between align-items-center'>
                                                                    <h4 className='text-dark mb-1 fw-600 fs-17'>{chat?.users[1]?.lastname == null ? chat?.users[1]?.firstname : chat?.users[1]?.firstname + " " + chat?.users[1]?.lastname}</h4>
                                                                    <p className='text-custom-grey fw-600 fs-15 mb-0'>{moment(new Date(chat?.latestMessage?.createdAt)).fromNow()}</p>
                                                                </div>
                                                                <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>{chat?.latestMessage?.message}</p>
                                                            </div>
                                                        </div>
                                                        <hr />
                                                    </>
                                                ))
                                                :
                                                <></>
                                            }
                                        </div>

                                    </div>
                                </Col>
                                <Col xxl={7} lg={12}>
                                    <div className='px-2 py-3 bg-white rounded'>
                                    {!selectedUser ? 
                                    <></>
                                    :
                                    <>
                                    <div className='d-sm-flex justify-content-start align-items-center px-4 pt-3 pb-2'>
                                            <div className='img-salad'>
                                                <img className='img-fluid w-100 h-100' src={selectedUser?.image} />
                                            </div>
                                            <div className='ms-3 w-100'>
                                                <div className='d-sm-flex justify-content-between align-items-center'>
                                                    <div>
                                                        <h4 className='text-dark mb-1 fw-600 fs-17'>{selectedUser?.firstname}</h4>
                                                        <p className={`d-inline me-3 fw-600 fs-15 mb-0 ${onlineUsers.includes(selectedUser?._id) ? 'text-green' : 'text-pink'}`}>{onlineUsers.includes(selectedUser?._id) ? 'Active' : 'Offline'}</p>
                                                    </div>
                                                    <Button className='bg-none border-0 pb-0'><svg xmlns="http://www.w3.org/2000/svg" width="6" height="20" viewBox="0 0 6 20" fill="none">
                                                        <path fillRule="evenodd" clipRule="evenodd" d="M5.21739 2.6087C5.21739 4.04944 4.04944 5.21739 2.6087 5.21739C1.16795 5.21739 0 4.04944 0 2.6087C0 1.16795 1.16795 0 2.6087 0C4.04944 0 5.21739 1.16795 5.21739 2.6087ZM5.21739 10.0001C5.21739 11.4408 4.04944 12.6087 2.6087 12.6087C1.16795 12.6087 0 11.4408 0 10.0001C0 8.55931 1.16795 7.39136 2.6087 7.39136C4.04944 7.39136 5.21739 8.55931 5.21739 10.0001ZM2.6087 20C4.04944 20 5.21739 18.832 5.21739 17.3913C5.21739 15.9505 4.04944 14.7826 2.6087 14.7826C1.16795 14.7826 0 15.9505 0 17.3913C0 18.832 1.16795 20 2.6087 20Z" fill="#BBBBBB" />
                                                    </svg></Button>
                                                </div>

                                            </div>
                                        </div>
                                        <hr />
                                        </>
                                    }
                                        
                                        
                                        <div className='px-4 py-3 msg-list'>
                                            {messages && messages.length > 0
                                                ?
                                                messages.map((message, i) => (
                                                    <>
                                                        {message?.senderId?._id === user._id ?
                                                            (<div className='msg-right' key={i}>
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
                                                            (<div className='msg-left' key={i}>
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
                                            }

                                            
                                        </div>
                                        <hr />
                                        <div className="msg-type px-3 pb-3">
                                            <Button className='bg-none border-0'><svg xmlns="http://www.w3.org/2000/svg" width="15" height="28" viewBox="0 0 15 28" fill="none">
                                                <path d="M7.62929 27.0182C9.57828 27.0182 11.4474 26.2441 12.8253 24.8659C14.2033 23.4878 14.9777 21.6187 14.9777 19.6699V5.11253C14.8442 3.24402 13.7697 1.57134 12.1253 0.673431C10.4811 -0.224477 8.49307 -0.224477 6.84889 0.673431C5.2047 1.57134 4.13021 3.24402 3.99669 5.11253V17.239C3.99669 18.5368 4.68898 19.7359 5.81297 20.3847C6.93675 21.0335 8.32133 21.0335 9.44517 20.3847C10.5691 19.7359 11.2614 18.5368 11.2614 17.239V9.97429H9.0261V17.239C9.0261 17.7381 8.75986 18.1995 8.32757 18.4489C7.89528 18.6986 7.3628 18.6986 6.93051 18.4489C6.49822 18.1995 6.23198 17.7381 6.23198 17.239V5.11253C6.33314 4.02108 6.97477 3.05282 7.94068 2.53436C8.9064 2.0157 10.0679 2.0157 11.0336 2.53436C11.9995 3.05282 12.6409 4.02108 12.7423 5.11253V19.6699C12.7423 21.4967 11.7678 23.1845 10.1856 24.098C8.60354 25.0114 6.65449 25.0114 5.07233 24.098C3.49011 23.1845 2.51561 21.4967 2.51561 19.6699V9.97429H0.280273V19.6699C0.280273 21.6187 1.05464 23.4878 2.43259 24.8659C3.81074 26.2441 5.67985 27.0182 7.62864 27.0182H7.62929Z" fill="#535353" />
                                            </svg></Button>
                                            <Form.Control className='text-dark fw-600 border-0 shadow-none bg-none' type="text" value={message} placeholder="Write a message..." onChange={(e) => setMessage(e.target.value)} />
                                            <Button className='bg-green custom-shadow border-0 rounded text-white fw-600 px-3' onClick={sendMessage}><svg className='' xmlns="http://www.w3.org/2000/svg" width="15" height="17" viewBox="0 0 15 17" fill="none">
                                                <path fillRule="evenodd" clipRule="evenodd" d="M13.0947 8.49941L1.27637 1.51874V5.14196L6.9614 8.49919L1.27637 11.8575V15.4807L13.0947 8.49941Z" fill="white" />
                                                <path d="M0.708349 6.50019C0.274466 6.24393 0 5.71789 0 5.14209V1.51887C0 0.392676 0.996386 -0.340766 1.84508 0.160547L13.6634 7.14122C14.6077 7.69903 14.6077 9.29988 13.6634 9.8577L1.84508 16.8395C0.996386 17.3408 0 16.6073 0 15.4813V11.8581C0 11.2823 0.274293 10.7563 0.708349 10.4998L4.09356 8.50008L0.708349 6.50019ZM2.55343 3.96676V4.20208L7.52989 7.14094C8.47443 7.69875 8.47462 9.2996 7.53007 9.85742L2.55361 12.7974V13.0325L10.2271 8.4993L2.55343 3.96676Z" fill="white" />
                                            </svg> Send</Button>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
               
    )
}


{/* <div className='msg-right'>
                                                <div className='d-flex gap-3'>
                                                    <div>
                                                        <span className='msg bg-green text-white'>Hi, How are you?</span>
                                                        <span className='fw-15 d-block text-custom-grey text-end'>11:44 PM</span>
                                                    </div>
                                                    <div className='message-img'>
                                                        <img className='w-100 h-100' src={Men} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='msg-left'>
                                                <div className='d-flex gap-3'>
                                                    <div className='message-img'>
                                                        <img className='w-100 h-100' src={Men} />
                                                    </div>
                                                    <div>
                                                        <span className='msg bg-light'>Good evening, Micheal</span>
                                                        <span className='fw-15 d-inline-block text-custom-grey'>11:45 PM</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='msg-right'>
                                                <div className='d-flex gap-3'>
                                                    <div>
                                                        <span className='msg bg-green text-white'>There are several ways you can filter recipes to find those that suit your client's needs. All of our filters are available at the very top of both the Recipes and Recipe Box panels by clicking on the Filter button:</span>
                                                        <span className='fw-15 d-block text-custom-grey text-end'>11:46 PM</span>
                                                    </div>
                                                    <div className='message-img'>
                                                        <img className='w-100 h-100' src={Men} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='msg-left'>
                                                <div className='d-flex gap-3'>
                                                    <div className='message-img'>
                                                        <img className='w-100 h-100' src={Men} />
                                                    </div>
                                                    <div>
                                                        <span className='msg bg-light'>Good evening, Micheal</span>
                                                        <span className='fw-15 d-inline-block text-custom-grey'>11:45 PM</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='msg-right'>
                                                <div className='d-flex gap-3'>
                                                    <div>
                                                        <span className='msg bg-green text-white'>There are several ways you can filter recipes to find those that suit your client's needs. All of our filters are available at the very top of both the Recipes and Recipe Box panels by clicking on the Filter button:</span>
                                                        <span className='fw-15 d-block text-custom-grey text-end'>11:46 PM</span>
                                                    </div>
                                                    <div className='message-img'>
                                                        <img className='w-100 h-100' src={Men} />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='msg-left'>
                                                <div className='d-flex gap-3'>
                                                    <div className='message-img'>
                                                        <img className='w-100 h-100' src={Men} />
                                                    </div>
                                                    <div>
                                                        <span className='msg bg-light'>Good evening, Micheal</span>
                                                        <span className='fw-15 d-inline-block text-custom-grey'>11:45 PM</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='msg-right'>
                                                <div className='d-flex gap-3'>
                                                    <div>
                                                        <span className='msg bg-green text-white'>There are several ways you can filter recipes to find those that suit your client's needs. All of our filters are available at the very top of both the Recipes and Recipe Box panels by clicking on the Filter button:</span>
                                                        <span className='fw-15 d-block text-custom-grey text-end'>11:46 PM</span>
                                                    </div>
                                                    <div className='message-img'>
                                                        <img className='w-100 h-100' src={Men} />
                                                    </div>
                                                </div>
                                            </div> */}
