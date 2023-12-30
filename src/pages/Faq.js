import React, { useState, useEffect } from 'react';
//import Sidebar from '../components/Sidebar';
//import TopBar from '../components/TopBar';
import { Accordion, Button, Col, Form, Modal, Row } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';

export default function Faq() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const initialFaq = {
        faqTitle: '',
        faqBody: ''
    }
    const [showModal, setShowModal] = useState(false)
    const [faqs, setFaqs] = useState([])
    const [faq, setFaq] = useState(initialFaq)
    const [loading, setLoading] = useState(true);
    const [action, setAction] = useState('add'); // Add this line

 
    const fetchFaq = async () => {
        try {
          setLoading(true); // Set loading to true before the fetch
          const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getFaq`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
    
          if (res.ok) {
            const response = await res.json();
            setFaqs(response?.data);
          }
        } catch (error) {
          console.error('Error fetching FAQs:', error);
        } finally {
          setLoading(false);  
        }
      };
    const handleAddFaq = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/addFaq`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ faqTitle: faq?.faqTitle, faqBody: faq?.faqBody })
        })
        if (res.ok) {
            const response = await res.json()
            setFaqs([...faqs, response?.data])
            setFaq(initialFaq)
            setShowModal(false)
        }
    }

    const handleFaqChange = (event) => {
        const { name, value } = event.target;
        setFaq((prevObject) => ({
            ...prevObject,
            [name]: value,
        }));
    };

    const handleUpdateFaq = (faqId) => {
        const selectedFaq = faqs.find((faq) => faq._id === faqId);
        setFaq(selectedFaq);
        setAction('update'); 
        setShowModal(true);
      };
      
      

    const handleUpdate = async () => {
        try {
          const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/update-faq`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              faqId: faq?._id,
              faqTitle: faq?.faqTitle,
              faqBody: faq?.faqBody,
            }),
          });
      
          if (res.ok) {
            const updatedFaq = await res.json();
            // Update the faq in the state
            setFaqs((prevFaqs) =>
              prevFaqs.map((prevFaq) =>
                prevFaq._id === faq?._id ? { ...prevFaq, ...updatedFaq.data } : prevFaq
              )
            );
            setShowModal(false);
            setFaq(initialFaq); // Reset faq to initial state
            setAction('add'); // Reset action to 'add' after handling update
          } else {
            console.error('Failed to update FAQ');
          }
        } catch (error) {
          console.error('An error occurred while updating FAQ', error);
        }
      };
      

 
    const handleDeleteFaq = async (faqId) => {
        try {
          const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/delete-faq`, {
            method: 'DELETE',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              faqId: faqId,
            }),
          });
      
          if (res.ok) {
            // Remove the deleted FAQ from the state
            setFaqs((prevFaqs) => prevFaqs.filter((prevFaq) => prevFaq._id !== faqId));
          } else {
            console.error('Failed to delete FAQ');
          }
        } catch (error) {
          console.error('An error occurred while deleting FAQ', error);
        }
      };

    useEffect(() => {
        if (!user) {
            navigate('/')
        }
        fetchFaq()
    }, [])
    return (
        <div>
         
            {loading && (
        <div className="loader-overlay">
          <TailSpin height={80} width={80} color="#4fa94d" ariaLabel="tail-spin-loading" radius={1} visible={true} />
        </div>
      )}
           
            <div className='mt-1 main-content'>
                <div className='p-xl-5 p-3'>
                    <Row className=''>
                        <Col lg={12} className='mx-auto'>
                            <div className='faq-container'>
                                <Accordion defaultActiveKey="">
                                    {faqs && faqs.length > 0 ?
                                        faqs.map((faq, i) => (
                                            <Accordion.Item eventkey={i}>
                                                <Accordion.Header>{faq?.faqTitle}
                                                    <Button variant="link" size="sm" className="mx-2" onClick={() => handleUpdateFaq(faq._id)}>
                                                        Update
                                                    </Button>
                                                    <Button variant="link" size="sm" onClick={() => handleDeleteFaq(faq._id)}>
                                                        Delete
                                                    </Button></Accordion.Header>
                                                <Accordion.Body>
                                                    {faq?.faqBody}
                                                </Accordion.Body>
                                            </Accordion.Item>
                                        ))
                                        :
                                        <></>
                                    }
                                </Accordion>
                                <Button onClick={() => setShowModal(true)} className='bg-green text-white w-100 d-block py-2 custom-shadow border-0 fs-5 mt-3'>Add Question</Button>
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showModal} size="md" onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>{action === 'add' ? 'Add Question' : 'Update Question'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control className='shadow-none border outline-0' type="text" name="faqTitle" value={faq?.faqTitle} onChange={handleFaqChange} placeholder="Add Question" />
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Control as="textarea" rows={3} name="faqBody" value={faq?.faqBody} onChange={handleFaqChange} placeholder='Answer' />
                        </Form.Group>
                        <Button className='bg-green text-white w-100 d-block py-2 custom-shadow border-0'
                            onClick={action === 'add' ? handleAddFaq : handleUpdate}
                        >
                            {action === 'add' ? 'Add' : 'Update'}
                        </Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
