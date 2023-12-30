import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import Sidebar from '../components/Sidebar';
//import UserSidebar from '../User_components/UserSidebar';
//import TopBar from '../components/TopBar';
import { Button, Col, Row, Form, Modal } from 'react-bootstrap';
import RecipeCard from '../components/RecipeCard';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { toast, ToastContainer } from 'react-toastify';


export default function Recipe() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const initialFilterValues = {
        mealType: [],
        duration: [0, 30],
        ingredients: [0, 10],
        tags: [],
        includeIngredients: [],
        excludeIngredients: [],
        calories: [0, 2500],
        fat: [0, 150],
        saturated: [0, 10],
        polyunsaturated: [0, 10],
        monosaturated: [0, 10],
        carbs: [0, 20],
        fiber: [0, 20],
        sugar: [0, 20],
        protein: [0, 20]
    }
    const [showTagModal, setShowTagModal] = useState(false)
    const [filterRecipe, setFilterRecipe] = useState(initialFilterValues)
    const [recipeData, setRecipeData] = useState([])
    const [tagList, setTagList] = useState([])
    const [tagInput, setTaginput] = useState()

    const fetchRecipes = async () => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getAllRecipes`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ tags: tagList })
        }).then(res => res.json()).then(data => {
            console.log('data', data)
            return data
        })

        if (response.status) {
            setRecipeData(response.data)
        }
    }

    const reloadAfterRecipe = (bool,message) => {
        if(bool){
            toast.success(message)
            fetchRecipes()
        }else{
            toast.error(message)
        } 
    }

    const handleTags = () => {
        setTagList([...tagList, tagInput])
        setTaginput('')
        setShowTagModal(false)
    }

    useEffect(() => {
        fetchRecipes()
    },[tagList])

    useEffect(() => {
        if (isAuthenticated) {
            fetchRecipes()
        } else {
            navigate('/login')
        }
    }, [user])

    return (
        <div>
        <ToastContainer/>
            <div className='mt-1 main-content'>
                <div className='bg-white py-3 px-4'>
                    <Row>
                        <Col lg={4}>
                            <div>
                                <h5 className='text-dark mb-0 fw-600 fs-5 left-border'>Add New Recipes</h5>
                                <p className='text-custom-grey fw-600 fs-17 ps-2 mb-0'>{recipeData?.length} Recipes</p>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div className='text-end'>
                                <Button className='text-custom-grey mb-0 fw-600 fs-17 bg-none border border-gray px-3'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                                    <path d="M0.918945 0H16.7566V2.56205H0.918945V0Z" fill="#959595" />
                                    <path d="M9.30334 10.7136H6.74145V13.9742L10.9338 17.2348L10.9336 10.2476L15.3355 3.74951H2.33936L6.50838 9.78179H9.30322C9.55942 9.78179 9.76899 10.038 9.76899 10.2942C9.76899 10.5504 9.55941 10.7133 9.30322 10.7133L9.30334 10.7136Z" fill="#959595" />
                                </svg>Filter</Button>
                                <Button className='mb-0 fw-600 fs-17 bg-none border border-0 p-0 mx-3'><svg xmlns="http://www.w3.org/2000/svg" width="42" height="42" viewBox="0 0 42 42" fill="none">
                                    <rect x="0.5" y="0.5" width="41" height="41" rx="6.5" stroke="#E4E4E4" />
                                    <path d="M12 14H27.8376V16.5621H12V14Z" fill="#959595" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M17.8225 24.7136H20.3844L20.3843 24.7133C20.444 24.7133 20.5011 24.7045 20.5537 24.6877C19.7291 26.6449 19.9835 28.9489 21.3171 30.6921L17.8225 27.9742V24.7136ZM23.9417 21.4029L26.4166 17.7495H13.4204L17.5894 23.7818H20.3843C20.5854 23.7818 20.7578 23.9397 20.8226 24.1315C21.0913 23.6419 21.4331 23.1817 21.8479 22.7669C22.4634 22.1514 23.1787 21.6968 23.9417 21.4029Z" fill="#959595" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M23.3153 30.7806C21.35 28.8153 21.35 25.6289 23.3153 23.6637C25.2806 21.6984 28.467 21.6984 30.4322 23.6637C32.3975 25.629 32.3975 28.8154 30.4322 30.7806C28.4669 32.7459 25.2805 32.7459 23.3153 30.7806ZM26.7442 26.1871L25.6444 25.0871C25.3942 24.8371 24.9888 24.8371 24.7386 25.0871C24.4885 25.3373 24.4885 25.7427 24.7386 25.9929L25.8385 27.0927C25.9099 27.1642 25.9099 27.2801 25.8385 27.3516L24.7386 28.4514C24.4885 28.7016 24.4885 29.1071 24.7386 29.3572C24.9887 29.6074 25.3941 29.6074 25.6444 29.3572L26.7442 28.2574C26.8157 28.1859 26.9316 28.1859 27.003 28.2574L28.1028 29.3572C28.353 29.6074 28.7586 29.6074 29.0086 29.3572C29.2588 29.1072 29.2588 28.7016 29.0086 28.4514L27.9088 27.3516C27.8374 27.2801 27.8374 27.1642 27.9088 27.0927L29.0086 25.9929C29.2588 25.7427 29.2588 25.3373 29.0086 25.0871C28.7586 24.8371 28.3531 24.8371 28.1028 25.0871L27.003 26.1871C26.9316 26.2584 26.8157 26.2584 26.7442 26.1871Z" fill="#959595" />
                                </svg></Button>
                                <Link to={recipeData.length > 0 ? "/create-recipe" : "/add-recipe"} className='px-3 py-2 rounded text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 px-3 text-decoration-none'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M15.5 6.14545V9.85455H9.73864V16H6.26136V9.85455H0.5V6.14545H6.26136V0H9.73864V6.14545H15.5Z" fill="white" />
                                </svg>Add Recipe</Link>
                            </div>
                        </Col>
                    </Row>

                </div>
                <div className='p-xl-5 p-3'>
                    <Row>
                        <Col lg={12}>
                            <div>
                            {tagList && tagList.length > 0 
                            ?
                            tagList.map(item => (
                                <span className='rounded bg-white text-custom-grey px-3 py-2 d-inline-block me-2 fs-17 shadow fw-normal mb-2'>{item}</span>
                            ))
                            :
                            <></>}
                                
                                {/* <span className='rounded bg-white text-custom-grey px-3 py-2 d-inline-block me-2 fs-17 shadow fw-normal mb-2'>chickenfree</span>
                                <span className='rounded bg-white text-custom-grey px-3 py-2 d-inline-block me-2 fs-17 shadow fw-normal mb-2'>glutenfree</span>
                                <span className='rounded bg-white text-custom-grey px-3 py-2 d-inline-block me-2 fs-17 shadow fw-normal mb-2'>eggfree</span>
                                <span className='rounded bg-white text-custom-grey px-3 py-2 d-inline-block me-2 fs-17 shadow fw-normal mb-2'>oilfree</span>
                                <span className='rounded bg-white text-custom-grey px-3 py-2 d-inline-block me-2 fs-17 shadow fw-normal mb-2'>beeffree</span>
                                <span className='rounded bg-white text-custom-grey px-3 py-2 d-inline-block me-2 fs-17 shadow fw-normal mb-2'>porkfree</span>
                                <span className='rounded bg-white text-custom-grey px-3 py-2 d-inline-block me-2 fs-17 shadow fw-normal mb-2'>smoothie</span>
                                <span className='rounded bg-white text-custom-grey px-3 py-2 d-inline-block me-2 fs-17 shadow fw-normal mb-2'>seafood</span>
                                <span className='rounded bg-white text-custom-grey px-3 py-2 d-inline-block me-2 fs-17 shadow fw-normal mb-2'>soyfree</span>
                                <span className='rounded bg-white text-custom-grey px-3 py-2 d-inline-block me-2 fs-17 shadow fw-normal mb-2'>loxoxalate</span>
                                <span className='rounded bg-white text-custom-grey px-3 py-2 d-inline-block me-2 fs-17 shadow fw-normal mb-2'>vegetarian</span>
                                <span className='rounded bg-white text-custom-grey px-3 py-2 d-inline-block me-2 fs-17 shadow fw-normal mb-2'>vegan</span> */}
                                <Button className='bg-green border-0 p-0' onClick={() => setShowTagModal(true)}><svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 60 60" fill="none">
                                    <g filter="url(#filter0_d_57_892)">
                                        <rect x="11" y="8" width="45" height="45" rx="7" fill="url(#paint0_linear_57_892)" />
                                    </g>
                                    <path d="M38 26.1455V29.8545H32.2386V36H28.7614V29.8545H23V26.1455H28.7614V20H32.2386V26.1455H38Z" fill="white" />
                                    <defs>
                                        <filter id="filter0_d_57_892" x="0" y="0" width="60" height="60" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                            <feOffset dy="3" />
                                            <feGaussianBlur stdDeviation="5.5" />
                                            <feComposite in2="hardAlpha" operator="out" />
                                            <feColorMatrix type="matrix" values="0 0 0 0 0.563686 0 0 0 0 0.783333 0 0 0 0 0.267639 0 0 0 0.3 0" />
                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_57_892" />
                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_57_892" result="shape" />
                                        </filter>
                                        <linearGradient id="paint0_linear_57_892" x1="17.1796" y1="8.00001" x2="51.2347" y2="10.3013" gradientUnits="userSpaceOnUse">
                                            <stop stopColor="#8DC63F" />
                                            <stop offset="1" stopColor="#7FC520" />
                                        </linearGradient>
                                    </defs>
                                </svg></Button>
                            </div>
                            <div className='recipe-grid'>
                                <RecipeCard data={recipeData} reloadFunction={reloadAfterRecipe} />
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showTagModal} size="md" onHide={() => setShowTagModal(false)}>
                <Modal.Header className='text-center border-0 bg-green custom-modal-header' closeButton>
                    <span></span>
                    <Modal.Title className='text-white'>Add Tag</Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-5'>
                    <div>
                        <div className=''>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-black fs-15 fw-normal'>Tag</Form.Label>
                                <Form.Control className='shadow-none border py-3' value={tagInput} type="text" placeholder="Tag Name" onChange={(e) => setTaginput(e.target.value)} />
                            </Form.Group>
                        </div>
                        <Button className='bg-green text-white w-100 d-block py-3 custom-shadow border-0 mt-5 mb-3' onClick={handleTags}>Add Tag</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
