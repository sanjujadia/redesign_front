import React, { useState, useEffect, useRef } from 'react';
//import Sidebar from '../components/Sidebar';
//import TopBar from '../components/TopBar';
import { Button, Col, Modal, Row, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import VideoCard from '../components/VideoCard';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';

export default function HowToVideos() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [showVideoModal, setShowVideoModal] = useState(false)
    const [videos, setVideos] = useState([])
    const [updateVideoDetail, setUpdateVideoDetail] = useState(null)
    const [thumbnail, setThumbnail] = useState()
    const [selectedFile, setSelectedFile] = useState(null)
    const [loading, setLoading] = useState(true);
    const fileInputRef = useRef(null)

    // const fetchVideos = async () => {
    //     const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getHowToVideo`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(res => res.json())

    //     if (res.status) {
    //         setVideos(res?.data)
    //     }
    // }
    const fetchVideos = async () => {
        setLoading(true); // Set loading to true when starting the fetch

        try {
            const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getHowToVideo`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());

            if (res.status) {
                setVideos(res?.data);
            } else {
                setVideos([]);
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            setLoading(false); 
        } finally {
            setLoading(false); // Set loading to false once the fetch is complete (whether successful or not)
        }
    };

    const handleUpdateVideo = async (e) => {
        e.preventDefault()
        let formdata = new FormData()
        formdata.append('id', updateVideoDetail._id)
        formdata.append('videoTitle', updateVideoDetail.videoTitle)
        formdata.append('videoUrl', updateVideoDetail.videoUrl)
        formdata.append('videoThumbnail', updateVideoDetail.videoThumbnail)
        formdata.append('description', updateVideoDetail.description)
        formdata.append('selectedFile', selectedFile)

        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/updateHowToVideo`, {
            method: 'POST',
            body: formdata
        }).then(res => res.json())

        if (res.status) {
            setShowVideoModal(false)
            fetchVideos()
            toast.success(res.message)
        } else {
            toast.error(res.message)
        }
    }

    const childCallback = (data, videodata) => {
        console.log(data, 'childcallback')
        setShowVideoModal(data)
        setUpdateVideoDetail(videodata)
    }

    const handleDeleteCallback = (boolean, data) => {
        if (boolean) {
            fetchVideos()
            toast.success(data)
        } else {
            toast.error(data)
        }
    }

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            setSelectedFile(file);
            setThumbnail(URL.createObjectURL(file))
            // Use createObjectURL with the 'file' object
            // const url = URL.createObjectURL(file);
            // ... rest of your code
        }
    };

    const handleImageClick = () => {
        // Trigger a click event on the hidden file input when the image is clicked
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger file input click when image is clicked
        }
    };

    const handleUpdateVideoDetail = (event) => {
        const { name, value } = event.target;
        setUpdateVideoDetail((prevObject) => ({
            ...prevObject,
            [name]: value,
        }));
    };

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        } else {
            fetchVideos()
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
                <div className='bg-white py-3 px-4 '>
                    <Row className='align-items-center'>
                        <Col lg={4}>
                            <div>
                                <h5 className='text-dark mb-0 fw-600 fs-5 left-border'>Add New  Video</h5>
                                <p className='text-custom-grey fw-600 fs-17 ps-2 mb-0'>{videos.length > 1 ? videos.length + ' Videos' : videos.length + ' Video'}</p>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div className='text-end'>
                                <Link to="/add-video" className='rounded py-3 px-3 text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 px-3 text-decoration-none'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M15.5 6.14545V9.85455H9.73864V16H6.26136V9.85455H0.5V6.14545H6.26136V0H9.73864V6.14545H15.5Z" fill="white" />
                                </svg>Add Video</Link>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div className='p-4'>
                    <Row>
                        <Col lg={12}>
                            <div className='recipe-grid mt-0'>
                                {videos && videos.length > 0
                                    ?
                                    videos.map((data) => (
                                        <VideoCard data={data} handleCallback={childCallback} handleDeleteCallback={handleDeleteCallback} />
                                    ))
                                    :
                                    <><p>no data found</p></>
                                }

                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showVideoModal} size="md" onHide={() => { setShowVideoModal(false); setThumbnail('') }}>
                <Modal.Header className='text-center border-0 bg-green custom-modal-header' closeButton>
                    <Modal.Title className='text-white'>Edit Video</Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-3'>
                    <div>
                        <div className=''>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Video  Title</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' name="videoTitle" value={updateVideoDetail?.videoTitle} type="text" placeholder="Video title" onChange={handleUpdateVideoDetail} />
                            </Form.Group>
                            <div className='text-center my-3'>
                                <div style={{ height: '300px' }}>
                                    <img className={`w-100 h-100 objectfit-cover ${updateVideoDetail?.videoThumbnail || thumbnail ? '' : 'noDisplay'}`} src={thumbnail ? thumbnail : updateVideoDetail?.videoThumbnail} onClick={handleImageClick} />

                                    <div className={`text-center ${updateVideoDetail?.videoThumbnail || thumbnail ? 'noDisplay' : ''}`}>
                                        <div className="wrapper-2 mt-0 bg-light rounded">
                                            <input type="file" id="file" onChange={handleFileChange} ref={fileInputRef} />
                                            <label for="file" className='text-muted mt-0 fw-600 p-5'><svg className='d-block mx-auto mb-2' xmlns="http://www.w3.org/2000/svg" width="63" height="53" viewBox="0 0 63 53" fill="none">
                                                <path d="M57.069 0H6.02244C3.20231 0 0.917969 2.25296 0.917969 5.02845V40.2281C0.917969 43.004 3.20231 45.2566 6.02244 45.2566H35.5934C35.4607 44.4371 35.3739 43.5996 35.3739 42.7422C35.3739 33.7158 42.8013 26.3996 51.9635 26.3996C55.8174 26.3996 59.355 27.7045 62.173 29.8793V5.02845C62.173 2.25286 59.886 0 57.0686 0L57.069 0ZM26.4415 32.686V12.5711L41.7553 22.6286L26.4415 32.686Z" fill="#D3D3D3" />
                                                <path d="M41.7554 45.2571H49.4123V52.8H54.5167V45.2571H62.1736L51.9641 32.686L41.7554 45.2571Z" fill="#D3D3D3" />
                                            </svg>Upload video thumbnail</label>
                                        </div>
                                    </div>
                                </div>

                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                    <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Video  URL</Form.Label>
                                    <Form.Control className='shadow-none border fw-600 text-black py-3' name="videoUrl" type="text" value={updateVideoDetail?.videoUrl} placeholder="http://www.youtube.com/watch?v=k4vBYiF_1a4&list" onChange={handleUpdateVideoDetail} />
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                    <Form.Label className='fs-15 text-custom-grey fw-600'>Short Description</Form.Label>
                                    <Form.Control className='shadow-none fw-600 border-2 border p-3' as="textarea" rows={4} name='description' value={updateVideoDetail?.description} placeholder='Description' onChange={handleUpdateVideoDetail} />
                                </Form.Group>
                            </div>
                            <Button className='bg-green text-white w-100 d-block py-3 custom-shadow border-0 mt-3 mb-3' onClick={handleUpdateVideo}>Save Video</Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
