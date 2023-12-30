import React from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function CreateWorkout() {
    return (
        <div>
            <div className='dashboard-layout'>
                <div><Sidebar /></div>
                <div className='dashboard-content'>
                    <TopBar />
                    <div className='mt-1 main-content'>
                        <div className='bg-white py-3 px-4'>
                            <Row>
                                <Col lg={12}>
                                    <div>
                                        <Link to="/workout-calendar" className='text-dark mb-0 fw-600 fs-5 text-decoration-none'><svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M18.8641 6.73026H4.25331L8.85671 2.12686C9.35722 1.62634 9.35722 0.825985 8.85671 0.375384C8.3562 -0.125128 7.55584 -0.125128 7.10524 0.375384L0.350429 7.0806C0.100173 7.33051 0 7.68094 0 7.98109C0 8.28124 0.100173 8.63168 0.350429 8.88158L7.05529 15.5864C7.55581 16.087 8.35616 16.087 8.80677 15.5864C9.30728 15.0859 9.30728 14.2856 8.80677 13.835L4.20336 9.23157H18.8142C19.4647 9.23157 19.9649 8.68114 19.9649 7.98064C19.9649 7.28049 19.5143 6.73008 18.8641 6.73008V6.73026Z" fill="black" />
                                        </svg><span className='date-circle'>1</span>Friday, June 2023</Link>
                                        <Button variant='primary' className='rounded-0 px-5 text-white ms-5'>Metabolic Conditioning</Button>
                                    </div>
                                </Col>
                            </Row>

                        </div>
                        <div className='p-xl-5 p-3'>
                            <div className='bg-white rounded-32 p-5p-xl-5 p-3 h-75vh'>
                                <Row>
                                    <Col xxl={7} lg={12} className=''>
                                    <div>
                                    <p className='text-dark fw-600 fs-6'>Body Weight Only</p>
                                <div className=''>
                                    <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                        <Col sm="4">
                                            <Form.Control className='shadow-none border border-2 fw-600 text-black py-3 bg-light' type="text" placeholder="Add an element" />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control className='shadow-none border border-2 fw-600 text-black py-3 bg-light' type="text" placeholder="Time" />
                                        </Col>
                                        <Col sm="4">
                                            <Form.Control className='shadow-none border border-2 fw-600 text-black py-3 bg-light' type="text" placeholder="Target Reps" />
                                        </Col>
                                    </Form.Group>
                                </div>
                                <div className='d-flex gap-3 mt-4'>
                                    <Button className='text-green custom-border bg-white d-block w-100 py-3 fs-6 fw-600'>Add more elements</Button>
                                    <Button className='text-white custom-border bg-green d-block w-100 py-3 fs-6 fw-600'>Save workout</Button>
                                </div>
                                    </div>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
