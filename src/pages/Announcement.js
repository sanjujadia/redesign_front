import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function Announcement() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const [announcement, setAnnouncement] = useState({})
    const [newAnnouncement, setNewAnnouncement] = useState()

    const fetchAnnouncement = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getAnnouncement`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        })
        if (res.ok) {
            const response = await res.json()
            console.log(response?.data)
            setAnnouncement(response?.data)
        }
    }

    const handleAnnouncementSave = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/addAnnouncement`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ announcement: newAnnouncement })
        })
        if (res.ok) {
            const response = await res.json()
            setAnnouncement(response?.data)
            setNewAnnouncement('')
        }
    }

    useEffect(() => {
        if (user) {
            fetchAnnouncement()
        } else {
            navigate('/')
        }
    }, [])

    console.log('user', user)
    return (
        <div>
            <div className='mt-1 main-content'>
                <div className='p-xl-5 p-3'>
                    <Row className='align-items-center h-70vh'>
                        <Col lg={8} className='mx-auto'>
                            <div className='text-center'>
                                <p className='text-black fw-600 fs-5'><span className='text-custom-grey'>Current Announcement:</span> {announcement?.announcement}</p>
                                <Form.Group className="mb-5" controlId="exampleForm.ControlInput1">
                                    <Form.Label className='text-black fw-600 fs-5'>New Announcement</Form.Label>
                                    <Form.Control className='shadow-none border outline-0' value={newAnnouncement} type="text" placeholder="" onChange={(e) => setNewAnnouncement(e.target.value)} />
                                </Form.Group>
                                <Button className='bg-green text-white w-100 d-block py-2 custom-shadow border-0 fs-5' onClick={handleAnnouncementSave}>Save</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
