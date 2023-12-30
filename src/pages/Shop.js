import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Button, Col, Row, Modal, Form } from 'react-bootstrap';
import ProductImg from '../assets/images/products.png';
import ProductBox from '../components/ProductBox';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';

export default function Shop() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [showModal, setShowModal] = useState(false)
    const [products, setProducts] = useState([])
    const [selectedImage, setSelectedImage] = useState(null)
    const [selectedImageFile, setSelectedImageFile] = useState(null)
    const [workoutType, setWorkoutType] = useState()
    const [memberPrice, setMemberPrice] = useState()
    const [loading, setLoading] = useState(true);
    const [link, setLink] = useState()
    const inputRef = useRef(null)
    console.log(memberPrice)

    // const fetchProducts = async () => {
    //     const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getProducts`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(res => res.json())
    //     if (res.status) {
    //         setProducts(res?.data)
    //     }
    // }

    const fetchProducts = async () => {
        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getProducts`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json'
            }
          });
    
          const data = await res.json();
    
          if (data.status) {
            setProducts(data?.data);
          }
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          // Set loading state to false after fetching is complete (whether successful or not)
          setLoading(false);
        }
      };
    

    const addProduct = async () => {
        const formdata = new FormData()
        formdata.append('workoutType', workoutType)
        formdata.append('memberPrice', memberPrice)
        formdata.append('link', link)
        formdata.append('productImage', selectedImageFile)
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/addProduct`, {
            method: 'POST',
            body: formdata
        }).then(res => res.json())
        if (res.status) {
            console.log(res?.data)
            setProducts(prev => [...prev, res?.data])
            setShowModal(false)
            setSelectedImage(null)
            setSelectedImageFile(null)
            setWorkoutType('')
            setMemberPrice('')
            setLink('')
            toast.success(res?.message)
        }else{
            toast.error(res?.message)
        }
    }
    const handleImage = (e) => {
        // e.persist();
        const file = e.target.files[0];
        if (file) {
            setSelectedImageFile(file);
            const url = URL.createObjectURL(file);
            setSelectedImage(url);
        }
    }

    const handleInputRef = () => {
        if (inputRef.current) {
            inputRef.current.click()
        }
    }

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        } else {
            fetchProducts()
        }
    }, [])

    return (
        <div>
            <ToastContainer />
            {loading && (
        <div className="loader-overlay">
          <TailSpin height={80} width={80} color="#4fa94d" ariaLabel="tail-spin-loading" radius={1} visible={true} />
        </div>
      )}
                    <div className='mt-1 main-content'>
                        <div className='bg-white py-3 px-5 text-end'>
                            <Button className='text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 px-3' onClick={() => setShowModal(true)}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                <path d="M15.5 6.14545V9.85455H9.73864V16H6.26136V9.85455H0.5V6.14545H6.26136V0H9.73864V6.14545H15.5Z" fill="white" />
                            </svg>Add a Product</Button>
                        </div>
                        <div className='p-xl-5 p-3'>
                            <Row>
                                <Col lg={12}>
                                    <div className='product-grid'>
                                        {products && products.length > 0
                                            ?
                                            products.map((product, i) => (
                                                <ProductBox data={product}/>
                                            ))
                                            :
                                            <></>
                                        }

                                        {/* <ProductBox />
                                        <ProductBox />
                                        <ProductBox />
                                        <ProductBox />
                                        <ProductBox />
                                        <ProductBox />
                                        <ProductBox />
                                        <ProductBox />
                                        <ProductBox /> */}
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showModal} size="sm" onHide={() => setShowModal(false)}>
                <Modal.Body>
                    <div>
                        <div className='border text-center'>
                            <img className={`w-100 objectfit-cover ${selectedImage ? '' : 'noDisplay'}`} src={selectedImage ? selectedImage : ''} style={{ height: '200px' }} onClick={handleInputRef} />
                            <div className={`text-center ${selectedImage ? 'noDisplay' : ''}`}>

                                <div className="wrapper-2">
                                    <input type="file" id="file" accept='image/*' onChange={handleImage} ref={inputRef} />
                                    <label for="file" className='text-muted mt-0 fw-600 p-5'><svg className='d-block mx-auto mb-2' xmlns="http://www.w3.org/2000/svg" width="64" height="69" viewBox="0 0 64 69" fill="none">
                                        <path d="M60.3591 18.1475H40.6601V22.7655C40.6601 26.085 37.9904 28.8266 34.599 28.8266H29.3317C26.0122 28.8266 23.2706 26.1569 23.2706 22.7655V18.1475H3.64373C2.05627 18.1475 0.82959 19.446 0.82959 20.9616V65.7714C0.82959 67.3589 2.12817 68.5855 3.64373 68.5855H60.3595C61.947 68.5855 63.1736 67.2869 63.1736 65.7714V20.9616C63.1736 19.4466 61.9465 18.1475 60.359 18.1475H60.3591ZM49.1027 29.332C51.6284 29.332 53.5763 31.3524 53.5763 33.8056C53.5763 36.2589 51.5559 38.2793 49.1027 38.2793C46.6494 38.2793 44.629 36.2589 44.629 33.8056C44.629 31.3524 46.5774 29.332 49.1027 29.332ZM57.5451 61.875C57.5451 62.4523 57.0397 62.9572 56.4629 62.9572H7.54018C6.96286 62.9572 6.45803 62.4518 6.45803 61.875V58.4116C6.45803 58.1232 6.53 57.9062 6.74644 57.6898L22.0438 40.1555C23.3424 38.64 25.7237 38.64 27.0947 40.1555L37.1965 51.7729C37.6294 52.2782 38.3511 52.2782 38.784 51.7729L42.9691 47.2268C44.1957 45.9283 46.216 45.9283 47.4427 47.2268L57.2567 58.1225C57.4011 58.3389 57.5451 58.5554 57.5451 58.8443L57.5451 61.875Z" fill="#D3D3D3" />
                                        <path d="M23.9197 14.1789H27.0948V22.7653C27.0948 23.9919 28.105 25.002 29.3315 25.002H34.5989C35.8255 25.002 36.8356 23.9918 36.8356 22.7653V14.1789H40.0107C41.7426 14.1789 42.6804 12.2305 41.5982 10.8594L33.5167 0.757634C32.7229 -0.252545 31.1355 -0.252545 30.3416 0.757634L22.2601 10.8594C21.3219 12.2305 22.2596 14.1789 23.9196 14.1789H23.9197Z" fill="#D3D3D3" />
                                    </svg>Upload photo</label>
                                </div>
                            </div>

                        </div>
                        <Form.Select aria-label="Default select example" className='shadow-none border-0 outline-0 text-center py-2 text-green bg-lightgreen' name="workoutType" // Set the name attribute
                            value={workoutType} onChange={(e) => setWorkoutType(e.target.value)}>
                            <option value="">Select Workout Type</option>
                            <option value="Lower Body">Lower Body</option>
                            <option value="Athletic Conditioning">Athletic Conditioning</option>
                            <option value="Anterior">Anterior</option>
                            <option value="Posterior">Posterior</option>
                            <option value="Upper Body">Upper Body</option>
                            <option value="Metcon">Metcon</option>
                        </Form.Select>
                        <Form.Group as={Row} className="my-2" controlId="">
                            <Form.Label className='text-black fw-600' column sm="6">
                                Member Price:
                            </Form.Label>
                            <Col sm="6">
                                <Form.Control type='text' className='shadow-none border outline-0' value={memberPrice} placeholder='' onChange={(e) => setMemberPrice(e.target.value)} />
                            </Col>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                            <Form.Label className='text-black fw-600'>Link:</Form.Label>
                            <Form.Control className='shadow-none border outline-0' type="text" placeholder="" onChange={(e) => setLink(e.target.value)} />
                        </Form.Group>
                        <Button className='bg-green text-white w-100 d-block py-2 custom-shadow border-0' onClick={addProduct}>Save Product</Button>
                        <Button className='bg-none text-custom-grey w-100 d-block pt-2 border-0 fs-15' onClick={() => setShowModal(false)}>No Thanks</Button>

                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
