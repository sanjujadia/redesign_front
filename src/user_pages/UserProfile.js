import React, { useState, useEffect } from 'react';
import UserSidebar from '../User_components/UserSidebar';
import TopBar from '../components/TopBar';
import { Button, Col, Row, Form, Modal } from 'react-bootstrap';
import UserImg from '../assets/images/admin.png';
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'

export default function UserProfile() {
    const navigate = useNavigate()
    const { user, isAuthenticated, updateUser } = useAuth()
    const initialPasswordFields = {
        newPassword: '',
        confirmPassword: ''
    }
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [userProfile, setUserProfile] = useState()
    const [password, setPassword] = useState(initialPasswordFields)
    const [passwordError, setPasswordError] = useState("");

    const fetchUserProfile = async (id) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/profile/getProfile/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())

        if (res.status) {
            console.log('userProfile', res.data)
            setUserProfile(res.data)
        } else {
            setUserProfile(null)
        }
    }

    const handleImageChange = async (e) => {
        const files = e.target.files
        if (files.length > 0) {
            const file = files[0]
            const formdata = new FormData()
            formdata.append('id', userProfile?._id)
            formdata.append('profileImage', file)
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/profile/updateProfileImage`, {
                method: 'POST',
                body: formdata
            }).then(res => res.json())

            if (res.status) {
                console.log('image', res.data)
                setUserProfile(prev => ({ ...prev, image: res?.data }))
                updateUser({ ...user, image: res?.data })
                toast.success('Profile image updated successfully')
            } else {
                toast.error(res.message)
            }
        }
    }

    const handleChangePassword = async () => {
        if (handlePasswordValidation()) {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/profile/updatePassword`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: userProfile?._id, password: password?.newPassword })
            }).then(res => res.json())
            if (res.status) {
                setPassword(initialPasswordFields)
                setShowPasswordModal(false)
                toast.success(res.message)
            } else {
                toast.error(res.message)
            }
        }
    }


    const handlePasswordInput = (e) => {
        const { name, value } = e.target
        const passwordInputValue = value.trim();
        const passwordInputFieldName = name;
        const NewPassword = { ...password, [passwordInputFieldName]: passwordInputValue }
        setPassword(NewPassword)

    }

    const handlePasswordValidation = () => {
        if (password.newPassword == '' && password.confirmPassword == '') {
            setPasswordError('')
            return false
        }
        if (password.newPassword && password.confirmPassword == '') {
            setPasswordError('Confirm password should not blank')
            return false
        } else {
            setPasswordError('')
        }
        if (password.newPassword !== password.confirmPassword) {
            setPasswordError('Confirm password not matched')
            return false
        } else {
            setPasswordError('')
        }

        return true
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserProfile(user?._id)
        } else {
            navigate('/')
        }
    }, [user])

    return (
        <div className='p-3'>
            <div className=' p-xl-2 p-3 main-content'>
                <Row>
                    <Col>
                        <div className='shadow-sm bg-white rounded p-5 profile-form'>
                            {/* <Button className='bg-green custom-shadow text-white fs-6 fw-600 d-block  ms-auto mb-3 px-5 border-0 py-2'>Update Profile</Button> */}
                            <Form>
                                <Row>
                                    <Col xxl={2} lg={4}>
                                        <div>
                                            <div className='profile-img'><img src={userProfile?.image} className='img-fluid w-100 h-100' /></div>
                                            <div className="wrapper">
                                                <input type="file" id="file" onChange={handleImageChange} />
                                                <label for="file"> <span className='d-inline me-2'><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                                    <path d="M17.1775 2.86879L15.1312 0.822453C14.6038 0.295771 13.8889 0 13.1435 0C12.3982 0 11.6834 0.295795 11.1559 0.822453L9.66328 2.31495L1.21382 10.7644C1.20769 10.7705 1.20581 10.779 1.19984 10.7854C1.12408 10.8647 1.0631 10.9566 1.0194 11.0572C1.00919 11.0806 1.00526 11.1043 0.997086 11.1284C0.977911 11.1757 0.962665 11.2244 0.951664 11.2742L0.0128897 16.9072H0.0127322C-0.0325327 17.1793 0.0441661 17.4576 0.222552 17.6681C0.40094 17.8785 0.66293 18 0.938784 18C0.990334 17.9998 1.04189 17.9954 1.09281 17.9871L6.72578 17.0483C6.7756 17.0372 6.82432 17.0219 6.87147 17.0028C6.89536 16.9946 6.91941 16.9907 6.94267 16.9806H6.94283C7.04326 16.9369 7.1352 16.8758 7.21442 16.8002C7.2207 16.7942 7.22919 16.7923 7.23548 16.7862L17.1777 6.844C17.7042 6.31656 18 5.60173 18 4.85629C18 4.11101 17.7042 3.39619 17.1777 2.86874L17.1775 2.86879ZM2.08118 15.9187L2.50381 13.3819L4.61807 15.4961L2.08118 15.9187ZM15.8502 5.51628L15.0214 6.34505L11.6548 2.97863L12.4836 2.14986V2.1497C12.659 1.9754 12.8963 1.87749 13.1437 1.87749C13.3911 1.87749 13.6284 1.9754 13.8038 2.1497L15.8501 4.19604C16.0249 4.37128 16.1231 4.60861 16.1231 4.85614C16.1231 5.10367 16.0249 5.34102 15.8501 5.51624L15.8502 5.51628Z" fill="white" />
                                                </svg></span>Change Picture</label>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xxl={10} lg={8}>
                                        <div className='ps-sm-5'>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>First Name</Form.Label>
                                                <Form.Control type="text" placeholder="Micheal" value={userProfile?.firstname} disabled />
                                            </Form.Group>
                                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                <Form.Label>Last Name</Form.Label>
                                                <Form.Control type="text" placeholder="" value={userProfile?.lastname ? userProfile?.lastname : ''} disabled />
                                            </Form.Group>
                                        </div>
                                    </Col>
                                    <Col lg={12}>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control type="number" placeholder="0123456789" value={userProfile?.phonenumber ? userProfile?.phonenumber : ''} disabled />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control type="email" placeholder="michealwison12@gmial.com" value={userProfile?.email} disabled />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                            <Form.Label> Address</Form.Label>
                                            <Form.Control as="textarea" placeholder='1537 Virgil Street Port St Joe, FL 32456' rows={3} value={userProfile?.address ? userProfile?.address : ''} disabled />
                                        </Form.Group>
                                        <Button className='bg-green custom-shadow text-white fs-6 fw-600 d-block mt-5 px-5 border-0 py-2' onClick={() => setShowPasswordModal(true)}>Change Password</Button>
                                    </Col>
                                </Row>
                            </Form>
                        </div>
                    </Col>
                </Row>
            </div>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showPasswordModal} size="md" onHide={() => { setShowPasswordModal(false); setPassword(initialPasswordFields) }}>
                <Modal.Header className='text-center border-0 bg-green custom-modal-header' closeButton>
                    <span></span>
                    <Modal.Title className='text-white'>Change Password</Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-5'>
                    <div>
                        <div className=''>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-black fs-15 fw-normal'>New Password</Form.Label>
                                <Form.Control className='shadow-none border py-3' name='newPassword' value={password?.newPassword} type="text" placeholder="Enter new password" onKeyUp={handlePasswordValidation} onChange={(e) => handlePasswordInput(e)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                                <Form.Label className='text-black fs-15 fw-normal'>Confirm Password</Form.Label>
                                <Form.Control className='shadow-none border py-3' name='confirmPassword' value={password?.confirmPassword} type="text" placeholder="Confirm password" onKeyUp={handlePasswordValidation} onChange={(e) => handlePasswordInput(e)} />
                                <p className="text-danger">{passwordError}</p>
                            </Form.Group>
                        </div>
                        <Button className='bg-green text-white w-100 d-block py-3 custom-shadow border-0 mt-5 mb-3' onClick={handleChangePassword}>Change Password</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div >
    )
}
