import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { Accordion, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import UserSidebar from '../User_components/UserSidebar';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { TailSpin } from 'react-loader-spinner';

export default function UserFaq() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [faqs, setFaqs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dataFound, setDataFound] = useState(true);


    const fetchFaqs = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getFaqs`, {
                method: 'GET',
                headers: {
                    'Content-type': 'application/json'
                }
            });
    
            if (res.ok) {
                const data = await res.json();
                if (data.status) {
                    setFaqs(data.data);
                    setDataFound(true);
                } else {
                    console.log('No faq data found.');
                    setLoading(false);
                    setDataFound(false);
                }
            } else {
                console.log('API request failed with status:', res.status);
                setLoading(false);
                setDataFound(false);
            }
        } catch (error) {
            console.error('Error fetching FAQs:', error);
            setLoading(false);
            setDataFound(false);
        } finally {
            setLoading(false);
        }
    };
    

    console.log(faqs, "sefsef");
    console.log(dataFound, "dataFound");
     


    useEffect(() => {
        if (isAuthenticated) {
            fetchFaqs()
        } else {
            navigate('/')
        }
    }, [user])

    return (
        <div className='p-4'>
            {loading && (
                <div className="loader-overlay">
                    <TailSpin height={80} width={80} color="#4fa94d" ariaLabel="tail-spin-loading" radius={1} visible={true} />
                </div>
            )}
            <div className='mt-1 main-content'>
                <div>
                    <Row className=''>
                        <Col lg={12} className='mx-auto'>
                            <div className='faq-container'>
                                <Accordion defaultActiveKey="">
                                    {dataFound !== null && (
                                        dataFound && faqs.length > 0 ? (
                                            faqs.map((item, i) => (
                                                <Accordion.Item eventkey={i} key={i}>
                                                    <Accordion.Header>{item?.faqTitle}</Accordion.Header>
                                                    <Accordion.Body>{item?.faqBody}</Accordion.Body>
                                                </Accordion.Item>
                                            ))
                                        ) : (

                                            !dataFound ? <p>No data found</p> : <p></p>
                                        )
                                    )}



                                    {/* <Accordion.Item eventkey="1">
                                                <Accordion.Header>How can I cancel my subscription?</Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventkey="2">
                                                <Accordion.Header>How can I cancel my subscription?</Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventkey="3">
                                                <Accordion.Header>How can I cancel my subscription?</Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventkey="4">
                                                <Accordion.Header>How can I cancel my subscription?</Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventkey="5">
                                                <Accordion.Header>How can I cancel my subscription?</Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventkey="6">
                                                <Accordion.Header>How can I cancel my subscription?</Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item>
                                            <Accordion.Item eventkey="7">
                                                <Accordion.Header>How can I cancel my subscription?</Accordion.Header>
                                                <Accordion.Body>
                                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                                                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
                                                    minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                                                    aliquip ex ea commodo consequat. Duis aute irure dolor in
                                                    reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
                                                    pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
                                                    culpa qui officia deserunt mollit anim id est laborum.
                                                </Accordion.Body>
                                            </Accordion.Item> */}
                                </Accordion>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
