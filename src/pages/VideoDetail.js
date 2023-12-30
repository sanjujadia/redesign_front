import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import { Button, ButtonGroup, Col, Form, Modal, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import VideoDemo from '../assets/images/v-mov.mp4';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'
import ReactPlayer from 'react-player';
import { toast, ToastContainer } from 'react-toastify'


export default function VideoDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [showVideoModal, setShowVideoModal] = useState(false)
    const [videoDetail, setVideodetail] = useState(null)
    const [updateVideoDetail, setUpdateVideoDetail] = useState(null)
    const [thumbnail, setThumbnail] = useState()
    const [selectedFile, setSelectedFile] = useState()
    const fileInputRef = useRef(null)

    const fetchVideoDetail = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getSingleHowToVideo/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())

        if (res.status) {
            setVideodetail(res.data)
            setUpdateVideoDetail(res.data)
            setThumbnail(res.data.videoThumbnail)
        }
    }

    const handleUpdateVideo = async (e) => {
        e.preventDefault()
        let formdata = new FormData()
        formdata.append('id', updateVideoDetail._id)
        formdata.append('videoTitle', updateVideoDetail.videoTitle)
        formdata.append('videoUrl', updateVideoDetail.videoUrl)
        formdata.append('videoThumbnail', updateVideoDetail.videoThumbnail)
        formdata.append('description', updateVideoDetail.description)
        formdata.append('selectedFile', selectedFile)
        
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/updateHowToVideo`,{
            method:'POST',
            body:formdata
        }).then(res => res.json())
        
        if(res.status){
            setShowVideoModal(false)
            fetchVideoDetail()
            toast.success(res.message)
        }else{
            toast.error(res.message)
        }
    }

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            console.log(file,'file')
            setSelectedFile(file);
            setThumbnail(URL.createObjectURL(file))
            // Use createObjectURL with the 'file' object
            // const url = URL.createObjectURL(file);
            // ... rest of your code
        }
    };
console.log(thumbnail,'thumbnail')
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

    const handleVideoDelete = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/deleteHowToVideo/${videoDetail?._id}`,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            }
        }).then(res => res.json())

        if(res.status){
          toast.success(res.message)
          navigate('/how-to-videos')
        }else{
            toast.error(res.message)
        }
    }

console.log('updateVideoDetail',updateVideoDetail)

    useEffect(() => {
        if (isAuthenticated) {
            fetchVideoDetail()
        } else {
            navigate('/')
        }
    }, [])

    return (
        <div>
            <div className='dashboard-layout'>
                <div><Sidebar user={user} /></div>
                <div className='dashboard-content'>
                    <TopBar />
                    <div className='mt-1 main-content'>
                        <div className='bg-white py-3 px-4'>
                            <Row>
                                <Col lg={12}>
                                    <div>
                                        <Link to="/how-to-videos" className='text-dark mb-0 fw-600 fs-5 text-decoration-none'><svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M18.8641 6.73026H4.25331L8.85671 2.12686C9.35722 1.62634 9.35722 0.825985 8.85671 0.375384C8.3562 -0.125128 7.55584 -0.125128 7.10524 0.375384L0.350429 7.0806C0.100173 7.33051 0 7.68094 0 7.98109C0 8.28124 0.100173 8.63168 0.350429 8.88158L7.05529 15.5864C7.55581 16.087 8.35616 16.087 8.80677 15.5864C9.30728 15.0859 9.30728 14.2856 8.80677 13.835L4.20336 9.23157H18.8142C19.4647 9.23157 19.9649 8.68114 19.9649 7.98064C19.9649 7.28049 19.5143 6.73008 18.8641 6.73008V6.73026Z" fill="black" />
                                        </svg>{videoDetail?.videoTitle}</Link>
                                    </div>
                                </Col>
                            </Row>

                        </div>
                        <div className='p-xl-5 p-3'>
                            <div className='bg-white shadow h-75vh rounded p-4'>
                                <Row>
                                    <Col lg={8}>
                                        <div className='videodetail-video' style={{borderRadius:'13px !important'}}>
                                            <ReactPlayer url={videoDetail?.videoUrl} height="100%" width="100%" id="video" preload="metadata" style={{ borderRadius: '10px' }} poster={videoDetail?.videoThumbnail} controls />
                                            {/* <iframe className='rounded' src={VideoDemo} title="" autoplay="false" height="400" width="60%"></iframe> */}
                                            {/* <video controls height="100%" width="100%" id="video" preload="metadata" style={{ borderRadius: '10px' }} poster="//cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/poster.jpg">
                                                <source src="//cdn.jsdelivr.net/npm/big-buck-bunny-1080p@0.0.6/video.mp4" type="video/mp4" />
                                            </video> */}
                                        </div>
                                        <ButtonGroup className='my-2' size="sm">
                                            <Button className='bg-none border-0 text-custom-grey fs-15 py-0' onClick={() => setShowVideoModal(true)}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                <path d="M13.3603 2.23128L11.7687 0.639685C11.3585 0.230044 10.8025 0 10.2227 0C9.64305 0 9.08707 0.230063 8.67684 0.639685L7.51588 1.80051L0.944086 8.3723C0.939318 8.37707 0.937851 8.38367 0.933206 8.38868C0.874285 8.45029 0.826855 8.52181 0.79287 8.60004C0.784924 8.61825 0.781868 8.63671 0.775511 8.65542C0.760598 8.69221 0.74874 8.73011 0.740183 8.76886L0.0100253 13.15H0.00990281C-0.0253032 13.3617 0.0343514 13.5782 0.173096 13.7418C0.311842 13.9055 0.515612 14 0.730166 14C0.77026 13.9999 0.810357 13.9965 0.849963 13.99L5.23116 13.2598C5.26991 13.2511 5.30781 13.2393 5.34448 13.2244C5.36306 13.218 5.38176 13.215 5.39986 13.2071H5.39998C5.47809 13.1732 5.5496 13.1256 5.61121 13.0668C5.6161 13.0622 5.6227 13.0607 5.62759 13.0559L13.3604 5.32311C13.7699 4.91288 14 4.3569 14 3.77712C14 3.19745 13.7699 2.64148 13.3604 2.23124L13.3603 2.23128ZM1.6187 12.3812L1.94741 10.4081L3.59183 12.0525L1.6187 12.3812ZM12.3279 4.29044L11.6833 4.93504L9.06485 2.31671L9.70945 1.67211V1.67199C9.84588 1.53642 10.0305 1.46027 10.2229 1.46027C10.4153 1.46027 10.5999 1.53642 10.7363 1.67199L12.3279 3.26358C12.4638 3.39989 12.5402 3.58448 12.5402 3.777C12.5402 3.96952 12.4638 4.15412 12.3279 4.29041L12.3279 4.29044Z" fill="#26BAFA" />
                                            </svg>Edit</Button>
                                            <div className='vr mx-1'></div>
                                            <Button className='bg-none border-0 text-custom-grey fs-15 py-0'  onClick={handleVideoDelete}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                                                <path d="M2.6342 2.67757V2.67778V2.67757ZM7.54307 0L6.1102 0.000508323V0.000711673H6.10949C5.61692 0.000711673 5.21778 0.406291 5.21778 0.906433V0.992348L1.09694 0.99245C0.852 0.99245 0.65332 1.19407 0.65332 1.44288V2.23634C0.65332 2.48513 0.851993 2.68676 1.09694 2.68676H1.62686V2.68707L12.0263 2.68717L12.0264 2.68697V2.68717H12.0325L12.5563 2.68697C12.674 2.68697 12.7867 2.63948 12.8699 2.55509C12.9531 2.4706 12.9999 2.35602 12.9999 2.23655V1.44257C12.9999 1.32311 12.9531 1.20862 12.8699 1.12414C12.7867 1.03965 12.6739 0.992166 12.5563 0.992166L8.43545 0.992268V0.906251C8.43545 0.665892 8.34142 0.435392 8.174 0.265398C8.00667 0.095501 7.77965 3.55961e-05 7.54294 3.55961e-05L7.54307 0ZM7.04057 4.45898C7.20449 4.45918 7.33727 4.5941 7.33727 4.76055L7.33747 11.2794C7.33747 11.3595 7.30613 11.4362 7.25045 11.4927C7.19468 11.5494 7.11917 11.5811 7.04037 11.5814L6.61298 11.5811V11.5814C6.53417 11.5811 6.45867 11.5494 6.40289 11.4927C6.34721 11.4362 6.31587 11.3595 6.31587 11.2794L6.31607 4.76055C6.31607 4.59441 6.44845 4.4596 6.61198 4.4596L6.61238 4.45991L6.61488 4.4593L6.61528 4.4592L7.03977 4.45899L7.04057 4.45898ZM4.37478 4.44749L4.36887 4.45349V4.45369H4.36927C4.52849 4.45369 4.66007 4.5819 4.66559 4.74469L4.88759 11.2597C4.89029 11.3397 4.86165 11.4175 4.80788 11.4759L4.80778 11.476C4.754 11.5345 4.6796 11.5689 4.6009 11.5716L4.17371 11.5866C4.17111 11.5867 4.1661 11.5868 4.1635 11.5868C4.0884 11.5868 4.0159 11.5579 3.96082 11.5056C3.90314 11.4511 3.8693 11.3755 3.86659 11.2956L3.64509 4.78058C3.63938 4.61404 3.76776 4.47443 3.93169 4.46866L4.35846 4.45371V4.45391C4.35997 4.45371 4.36127 4.45361 4.36257 4.45361C4.36437 4.45361 4.36628 4.45371 4.36768 4.45391L4.36808 4.45351L4.37478 4.44749ZM9.28774 4.45349C9.29015 4.45359 9.29265 4.45359 9.29475 4.45369V4.45389L9.72152 4.46864C9.88545 4.47443 10.0138 4.61403 10.0081 4.78056L9.78662 11.2955C9.78392 11.3755 9.75007 11.4511 9.69249 11.5056C9.63742 11.5579 9.56482 11.5867 9.48972 11.5867C9.48711 11.5867 9.48211 11.5866 9.4795 11.5865L9.05232 11.5716V11.5718C8.97361 11.5689 8.89911 11.5344 8.84543 11.4759C8.79166 11.4175 8.76292 11.3396 8.76573 11.2597L8.98763 4.74467C8.99314 4.5822 9.12431 4.45419 9.28312 4.45419L9.28352 4.4544L9.28593 4.45379L9.28683 4.45358V4.45348L9.28774 4.45349ZM1.6631 3.34807L2.08797 11.1005L2.08897 11.1146C2.12562 11.5605 2.15787 12.366 2.69309 12.8064V12.8066C3.19118 13.2162 4.03363 13.2097 4.57137 13.2221L4.58269 13.2222L5.92343 13.2228L5.92263 13.223C5.93124 13.2232 5.93985 13.2234 5.94856 13.2234L5.94876 13.2237L6.81984 13.2231L7.70374 13.2235L7.70394 13.2237C7.71236 13.2235 7.72077 13.2233 7.72908 13.2229H7.72988L7.72918 13.2231L9.06982 13.2224L9.08113 13.2222C9.61888 13.2098 10.4613 13.2164 10.9594 12.8069V12.8066C11.4946 12.3663 11.527 11.5609 11.5636 11.1149L11.5646 11.1008L11.9899 3.34839L1.6631 3.34807Z" fill="#FF6161" />
                                            </svg>Delete</Button>
                                        </ButtonGroup>
                                        <div>
                                            <p className='text-custom-grey fw-600 fs-6 mt-3'>Description:</p>
                                            <p className='text-dark fw-600 fs-6 mb-0'>{videoDetail?.description}</p>
                                        </div>
                                    </Col>
                                </Row>
                            </div>

                        </div>
                    </div>
                </div>
            </div>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showVideoModal} size="md" onHide={() => {setShowVideoModal(false);setThumbnail('')}}>
                <Modal.Header className='text-center border-0 bg-green custom-modal-header' closeButton>
                    <Modal.Title className='text-white'>Edit Video</Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-3'>
                    <div>
                        <div className=''>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Video  Title</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' name="videoTitle" value={updateVideoDetail?.videoTitle} type="text" placeholder="Video title" onChange={handleUpdateVideoDetail}/>
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
                                    <Form.Control className='shadow-none fw-600 border-2 border p-3' as="textarea" rows={4} name='description' value={updateVideoDetail?.description} placeholder='Description' onChange={handleUpdateVideoDetail}/>
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
