import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserSidebar from '../User_components/UserSidebar';
import TopBar from '../components/TopBar';
import { Button, ButtonGroup, Col, Form, Modal, Row, Tab, Tabs } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ChickenBowl from '../assets/images/food-chicken.png';
import MultiSelect from '../components/MultiSelect';
import { toast, ToastContainer } from 'react-toastify';
import { TimePicker } from 'antd';
import moment from 'moment';


export default function EditRecipe() {
    const params = useParams()
    const navigate = useNavigate()
    const initialRecipe = {
        title: '',
        time: '',
        servingSize: '',
        tags: [],
        directions: [],
        notes: [],
        ingredients: [],
        nutrition: {
            servingSize: '',
            calories: '',
            fat: '',
            carbs: '',
            fiber: '',
            sugar: '',
            protein: '',
            cholesterol: '',
            sodium: '',
            vitaminA: '',
            vitaminC: '',
            calcium: '',
            iron: ''
        },
        image: '',
        servingTime: []
    }
    const initialNutrition = {
        servingSize: '',
        calories: '',
        fat: '',
        carbs: '',
        fiber: '',
        sugar: '',
        protein: '',
        cholesterol: '',
        sodium: '',
        vitaminA: '',
        vitaminC: '',
        calcium: '',
        iron: ''
    }
    const initialNote = {
        title: '',
        note: ''
    }
    const [user, setUser] = useState({})
    const [showModal, setShowModal] = useState(false)
    const [recipe, setRecipe] = useState(initialRecipe)
    const [showIngredientModal, setShowIngredientModal] = useState(false)
    const [showNutritionModal, setShowNutritionModal] = useState(false)
    const [showNotesModal, setShowNotesModal] = useState(false)
    const [selectedDirection, setSelectedDirection] = useState()
    // const [selectedNote, setSelectedNote] = useState()
    const [note, setNote] = useState(initialNote)
    const [noteIndex, setNoteIndex] = useState(-1)
    const [direction, setDirection] = useState('')
    const [selectedIngredient, setSelectedIngredient] = useState({})
    const [selectedIngredientIndex, setSelectedIngredientIndex] = useState(-1)
    const [nutrition, setNutrition] = useState(initialNutrition)
    const [image, setImage] = useState()
    const [selectedImage, setSelectedImage] = useState(null);
    const fileInputRef = useRef(null)

    const handleFileChange = (event) => {
        const files = event.target.files;
        if (files.length > 0) {
            const file = files[0];
            setImage(URL.createObjectURL(file));
            setSelectedImage(file)
        }
    };

    const handleImageClick = () => {
        // Trigger a click event on the hidden file input when the image is clicked
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Trigger file input click when image is clicked
        }
    };
    const fetchRecipe = async (id) => {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/recipe/getRecipe/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()).then(data => { return data })

        if (response.status) {
            console.log(response.data, 'hghghgh')
            setRecipe(response.data)
            setImage(response?.data?.image)
        } else {
            toast.error(response.message)
        }

    }
    console.log('image', image)

    const handleUpdateRecipe = async () => {
        if (recipe.title && recipe.time && recipe.servingSize && recipe.directions.length > 0 && recipe.ingredients.length > 0 && recipe.notes.length > 0) {
            if (window.location.pathname === '/create-recipe') {
                const formData = new FormData();
                formData.append('recipe', JSON.stringify(recipe));
                formData.append('recipeImage', selectedImage);

                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/recipe/createRecipe`, {
                    method: 'POST',
                    body: formData
                }).then(res => res.json()).then(data => { return data })
                if (response.status) {
                    toast.success(response.message)
                    navigate('/recipe')
                } else {
                    toast.error(response.message)
                }

            } else {
                const formData = new FormData();
                formData.append('recipe', JSON.stringify(recipe));
                formData.append('recipeImage', selectedImage);
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/recipe/updateRecipe`, {
                    method: 'POST',
                    body: formData
                }).then(res => res.json()).then(data => { return data })
                if (response.status) {
                    // toast.success(response.message)
                    if (user?.userType === 'Admin') {
                        navigate('/recipe')
                    } else {
                        navigate('/user-recipe')
                    }

                } else {
                    toast.error(response.message)
                }
            }
        } else {
            toast.error('Please add the mandatory fields')
        }
    }

    const handleTags = (e) => {
        const tagsString = e.target.value
        // Split the comma-separated string into an array of tags
        const newTags = tagsString.split(',').map(tag => tag.trim());

        // Create a new copy of the recipe object with updated tags
        const updatedRecipe = { ...recipe, tags: newTags };

        // Update the state with the new recipe object
        setRecipe(updatedRecipe);
    };

    const handleDirection = () => {
        if (selectedDirection) {
            const index = recipe?.directions.findIndex((item) => item === selectedDirection);
            console.log('index', index)
            if (index !== -1) {
                setRecipe((prev) => {
                    const updatedDirections = [...prev.directions];
                    console.log('updatedDirections', updatedDirections)
                    updatedDirections[index] = direction;
                    return { ...prev, directions: updatedDirections };
                });
                setShowModal(false)
                setDirection('')
            }

        } else {
            // Handle the case when the item exists at the found index
            setRecipe((prev) => ({
                ...prev,
                directions: [...prev.directions, direction],
            }));
            setShowModal(false)
            setDirection('')
        }
    };

    const handleDirectionDelete = (index) => {
        if (index !== -1) {
            setRecipe((prev) => {
                const updatedDirections = [...prev.directions];
                updatedDirections.splice(index, 1); // Use splice to remove the element at the specified index
                return { ...prev, directions: updatedDirections };
            });
            setDirection('')
        }
    }

    const handleSelectedIngredientChange = (event) => {
        const { name, value } = event.target;
        setSelectedIngredient((prevObject) => ({
            ...prevObject,
            [name]: value,
        }));
    };



    const handleUpdateIngredient = () => {
        if (!selectedIngredient) {
            return; // Exit early if selectedIngredient is not defined
        }

        let updatedIngredients = [...recipe.ingredients];

        if (selectedIngredientIndex !== -1) {
            updatedIngredients[selectedIngredientIndex] = selectedIngredient;
            setRecipe((prev) => ({
                ...prev,
                ingredients: updatedIngredients,
            }));
            setShowIngredientModal(false);
            setSelectedIngredient({});
            setSelectedIngredientIndex(-1)
        } else {
            setRecipe((prev) => ({
                ...prev,
                ingredients: [...prev.ingredients, selectedIngredient],
            }));// Add the new ingredient
            setShowIngredientModal(false);
            setSelectedIngredient({});
            setSelectedIngredientIndex(-1)
        }
    };

    const handleIngredientDelete = (index) => {
        if (index !== -1) {
            setRecipe((prev) => {
                const updatedIngredients = [...prev.ingredients];
                console.log('updatedIngredients', updatedIngredients)
                updatedIngredients.splice(index, 1); // Use splice to remove the element at the specified index
                return { ...prev, ingredients: updatedIngredients };
            });
        }
    }

    const handleNoteChange = (event) => {
        const { name, value } = event.target;
        // Create a new object representing the updated state
        const updatedNotes = {
            ...note,
            [name]: value
        };

        // Update the state with the new object
        setNote(updatedNotes);
    };

    const handleNote = () => {
        if (noteIndex === -1) {
            setRecipe((prev) => ({
                ...prev,
                notes: [...prev.notes, note],
            }));
            setShowNotesModal(false);
            setNote(initialNote);
            setNoteIndex(-1)
        } else {
            // Handle the case when the item exists at the found index
            setRecipe((prev) => {
                const updatedNotes = [...prev.notes];
                updatedNotes[noteIndex] = note;
                return { ...prev, notes: updatedNotes };
            });
            setShowNotesModal(false);
            setNote(initialNote);
            setNoteIndex(-1)
        }
    };

    const handleNoteDelete = (index) => {
        if (index !== -1) {
            setRecipe((prev) => {
                const updatedNotes = [...prev.notes];
                updatedNotes.splice(index, 1); // Use splice to remove the element at the specified index
                return { ...prev, notes: updatedNotes };
            });
        }
    }

    const handleNutritionChange = (event) => {
        const { name, value } = event.target;
        // Create a new object representing the updated state
        const updatedNutrition = {
            ...nutrition,
            [name]: value
        };

        // Update the state with the new object
        setNutrition(updatedNutrition);
    };

    const handleNutritionUpdate = () => {
        setRecipe((prev) => ({
            ...prev,
            nutrition: nutrition,
        }));
        setNutrition(initialNutrition)
        setShowNutritionModal(false)
    }

    useEffect(() => {
        let userdata = JSON.parse(localStorage.getItem('userdata'))
        if (userdata) {
            setUser(userdata)
            if (Object.keys(params).length > 0) {
                fetchRecipe(params.id)
            }
        } else {
            navigate('/')
        }
    }, [localStorage.getItem('userdata')])

    console.log('recipe', recipe)
    console.log('nutrition', nutrition)
    console.log('noteIndex', noteIndex)
    return (
        <div>
            <ToastContainer />
            <div className='mt-1 main-content'>
                <div className='bg-white py-3 px-4'>
                    <Row>
                        <Col mg={8}>
                            <div>
                                <Link to={user?.userType === 'admin' ? "/recipe" : "/user-recipe"} className='text-dark mb-0 fw-600 fs-5 text-decoration-none'>
                                <svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M18.8641 6.73026H4.25331L8.85671 2.12686C9.35722 1.62634 9.35722 0.825985 8.85671 0.375384C8.3562 -0.125128 7.55584 -0.125128 7.10524 0.375384L0.350429 7.0806C0.100173 7.33051 0 7.68094 0 7.98109C0 8.28124 0.100173 8.63168 0.350429 8.88158L7.05529 15.5864C7.55581 16.087 8.35616 16.087 8.80677 15.5864C9.30728 15.0859 9.30728 14.2856 8.80677 13.835L4.20336 9.23157H18.8142C19.4647 9.23157 19.9649 8.68114 19.9649 7.98064C19.9649 7.28049 19.5143 6.73008 18.8641 6.73008V6.73026Z" fill="black" />
                                </svg>My recipe</Link>
                            </div>
                        </Col>
                        <Col md={4}>
                            <div className='text-end'>
                                <Button className='text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 px-3' onClick={() => handleUpdateRecipe()}>{window.location.pathname === '/create-recipe' ? 'Add recipe' : 'Save Recipe'}</Button>
                            </div>
                        </Col>
                    </Row>

                </div>
                <div className='p-xl-5 p-3'>
                    <Row>
                        <Col xxl={7} lg={12} className='mb-3'>
                            <div className='bg-white shadow rounded h-xl-auto position-relative'>
                                <div className='p-4'>
                                    <Row>
                                        <Col lg={5}>
                                            <div className='position-relative edit-cardimg bg-light d-flex align-items-center justify-content-center overflow-hidden'>
                                                <img className={`w-100 h-100 objectfit-cover ${image ? '' : 'noDisplay'}`} src={image ? image : ''} onClick={handleImageClick} />
                                                <div className={`text-center ${image ? 'noDisplay' : ''}`}>

                                                    <div className="wrapper-2">
                                                        <input type="file" id="file" onChange={handleFileChange} ref={fileInputRef} />
                                                        <label for="file" className='text-muted mt-0 fw-600 p-5'><svg className='d-block mx-auto mb-2' xmlns="http://www.w3.org/2000/svg" width="64" height="69" viewBox="0 0 64 69" fill="none">
                                                            <path d="M60.3591 18.1475H40.6601V22.7655C40.6601 26.085 37.9904 28.8266 34.599 28.8266H29.3317C26.0122 28.8266 23.2706 26.1569 23.2706 22.7655V18.1475H3.64373C2.05627 18.1475 0.82959 19.446 0.82959 20.9616V65.7714C0.82959 67.3589 2.12817 68.5855 3.64373 68.5855H60.3595C61.947 68.5855 63.1736 67.2869 63.1736 65.7714V20.9616C63.1736 19.4466 61.9465 18.1475 60.359 18.1475H60.3591ZM49.1027 29.332C51.6284 29.332 53.5763 31.3524 53.5763 33.8056C53.5763 36.2589 51.5559 38.2793 49.1027 38.2793C46.6494 38.2793 44.629 36.2589 44.629 33.8056C44.629 31.3524 46.5774 29.332 49.1027 29.332ZM57.5451 61.875C57.5451 62.4523 57.0397 62.9572 56.4629 62.9572H7.54018C6.96286 62.9572 6.45803 62.4518 6.45803 61.875V58.4116C6.45803 58.1232 6.53 57.9062 6.74644 57.6898L22.0438 40.1555C23.3424 38.64 25.7237 38.64 27.0947 40.1555L37.1965 51.7729C37.6294 52.2782 38.3511 52.2782 38.784 51.7729L42.9691 47.2268C44.1957 45.9283 46.216 45.9283 47.4427 47.2268L57.2567 58.1225C57.4011 58.3389 57.5451 58.5554 57.5451 58.8443L57.5451 61.875Z" fill="#D3D3D3" />
                                                            <path d="M23.9197 14.1789H27.0948V22.7653C27.0948 23.9919 28.105 25.002 29.3315 25.002H34.5989C35.8255 25.002 36.8356 23.9918 36.8356 22.7653V14.1789H40.0107C41.7426 14.1789 42.6804 12.2305 41.5982 10.8594L33.5167 0.757634C32.7229 -0.252545 31.1355 -0.252545 30.3416 0.757634L22.2601 10.8594C21.3219 12.2305 22.2596 14.1789 23.9196 14.1789H23.9197Z" fill="#D3D3D3" />
                                                        </svg>Upload photo</label>
                                                    </div>
                                                </div>

                                            </div>
                                        </Col>
                                        <Col lg={7}>
                                            <div>
                                                <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                    <Form.Label className='text-black fw-600 fs-17'>Title</Form.Label>
                                                    <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' type="text" value={recipe?.title} placeholder="Recipe title" onChange={(e) => setRecipe(prev => ({ ...prev, title: e.target.value }))} />
                                                </Form.Group>
                                                <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                    <Col sm="6">
                                                        <Form.Label className='text-black fw-600 fs-17 d-block'>Time</Form.Label>
                                                        {/* <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' type="text" value={recipe?.time} placeholder="20" onChange={(e) => setRecipe(prev => ({ ...prev, time: e.target.value }))} /> */}
                                                        <TimePicker className='custom-timepicker' format="mm:ss" value={recipe?.time ? moment(recipe?.time, 'mm:ss') : ''} onSelect={(value) => {
                                                            console.log('value', value)
                                                            // const timeString = moment(value).format("mm:ss")
                                                            const time = new Date(value);

                                                            // Extract minutes and seconds from the time value.
                                                            const minutes = time.getMinutes();
                                                            const seconds = time.getSeconds();

                                                            // Format minutes and seconds as a string in "mm:ss" format.
                                                            const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

                                                            // console.log(timeString);
                                                            console.log('timeString', timeString)
                                                            setRecipe(prev => ({ ...prev, time: timeString }))
                                                        }} />
                                                    </Col>
                                                    <Col sm="6">
                                                        <Form.Label className='text-black fw-600 fs-17'>Serving size</Form.Label>
                                                        <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' type="text" value={recipe?.servingSize} placeholder="0" onChange={(e) => setRecipe(prev => ({ ...prev, servingSize: e.target.value }))} />
                                                    </Col>
                                                </Form.Group>
                                            </div>
                                        </Col>
                                    </Row>
                                </div>
                                <div className='px-4 '>
                                    <div className='tag-selected'>
                                        <Form.Label className='text-black fw-600 fs-17'>Tags</Form.Label>
                                        {window.location.pathname === '/create-recipe' ?
                                            <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' type="text" value={recipe?.tags} placeholder="enter tags" onChange={handleTags} />
                                            :
                                            <MultiSelect data={recipe?.tags} />
                                        }
                                    </div>

                                </div>

                                <div className='px-1 py-3'>
                                    <hr />
                                    <div className='profile-tab'>
                                        <Tabs
                                            defaultActiveKey="Directions"
                                            id="justify-tab-example"
                                            className="mb-3"
                                        >
                                            <Tab eventkey="Directions" title="Directions">
                                                <div className='px-4'>

                                                    {recipe?.directions && recipe?.directions.length > 0 ? recipe?.directions.map((step, i) => (
                                                        <div className='direction-tabgrid mt-4'>
                                                            <span className='d-inline'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="22" viewBox="0 0 10 22" fill="none">
                                                                    <circle cx="2" cy="2" r="2" fill="#BAC8A8" />
                                                                    <circle cx="8" cy="2" r="2" fill="#BAC8A8" />
                                                                    <circle cx="2" cy="14" r="2" fill="#BAC8A8" />
                                                                    <circle cx="8" cy="14" r="2" fill="#BAC8A8" />
                                                                    <circle cx="2" cy="8" r="2" fill="#BAC8A8" />
                                                                    <circle cx="8" cy="8" r="2" fill="#BAC8A8" />
                                                                    <circle cx="2" cy="20" r="2" fill="#BAC8A8" />
                                                                    <circle cx="8" cy="20" r="2" fill="#BAC8A8" />
                                                                </svg>
                                                            </span>
                                                            <div>
                                                                <h4 className='text-dark mb-1 fw-600 fs-15'>{"Step " + (i + 1)}</h4>
                                                                <p className=' text-custom-grey fw-600 fs-15 mb-0'>{step}</p>
                                                            </div>
                                                            <div>
                                                                <ButtonGroup size="sm">
                                                                    <Button className='bg-none border-0 text-custom-grey fs-15 py-0' onClick={() => { setDirection(step); setSelectedDirection(step); setShowModal(true) }}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                        <path d="M13.3603 2.23128L11.7687 0.639685C11.3585 0.230044 10.8025 0 10.2227 0C9.64305 0 9.08707 0.230063 8.67684 0.639685L7.51588 1.80051L0.944086 8.3723C0.939318 8.37707 0.937851 8.38367 0.933206 8.38868C0.874285 8.45029 0.826855 8.52181 0.79287 8.60004C0.784924 8.61825 0.781868 8.63671 0.775511 8.65542C0.760598 8.69221 0.74874 8.73011 0.740183 8.76886L0.0100253 13.15H0.00990281C-0.0253032 13.3617 0.0343514 13.5782 0.173096 13.7418C0.311842 13.9055 0.515612 14 0.730166 14C0.77026 13.9999 0.810357 13.9965 0.849963 13.99L5.23116 13.2598C5.26991 13.2511 5.30781 13.2393 5.34448 13.2244C5.36306 13.218 5.38176 13.215 5.39986 13.2071H5.39998C5.47809 13.1732 5.5496 13.1256 5.61121 13.0668C5.6161 13.0622 5.6227 13.0607 5.62759 13.0559L13.3604 5.32311C13.7699 4.91288 14 4.3569 14 3.77712C14 3.19745 13.7699 2.64148 13.3604 2.23124L13.3603 2.23128ZM1.6187 12.3812L1.94741 10.4081L3.59183 12.0525L1.6187 12.3812ZM12.3279 4.29044L11.6833 4.93504L9.06485 2.31671L9.70945 1.67211V1.67199C9.84588 1.53642 10.0305 1.46027 10.2229 1.46027C10.4153 1.46027 10.5999 1.53642 10.7363 1.67199L12.3279 3.26358C12.4638 3.39989 12.5402 3.58448 12.5402 3.777C12.5402 3.96952 12.4638 4.15412 12.3279 4.29041L12.3279 4.29044Z" fill="#26BAFA" />
                                                                    </svg>Edit</Button>
                                                                    <div className='vr mx-1'></div>
                                                                    <Button className='bg-none border-0 text-custom-grey fs-15 py-0' onClick={() => { handleDirectionDelete(i) }}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                                                                        <path d="M1.98088 2.67757V2.67778V2.67757ZM6.88975 0L5.45688 0.000508323V0.000711673H5.45617C4.9636 0.000711673 4.56446 0.406291 4.56446 0.906433V0.992348L0.443616 0.99245C0.19868 0.99245 0 1.19407 0 1.44288V2.23634C0 2.48513 0.198672 2.68676 0.443616 2.68676H0.973544V2.68707L11.3729 2.68717L11.373 2.68697V2.68717H11.3791L11.903 2.68697C12.0206 2.68697 12.1334 2.63948 12.2166 2.55509C12.2998 2.4706 12.3466 2.35602 12.3466 2.23655V1.44257C12.3466 1.32311 12.2998 1.20862 12.2166 1.12414C12.1334 1.03965 12.0206 0.992166 11.903 0.992166L7.78213 0.992268V0.906251C7.78213 0.665892 7.6881 0.435392 7.52068 0.265398C7.35335 0.095501 7.12633 3.55961e-05 6.88962 3.55961e-05L6.88975 0ZM6.38725 4.45898C6.55117 4.45918 6.68395 4.5941 6.68395 4.76055L6.68415 11.2794C6.68415 11.3595 6.65281 11.4362 6.59713 11.4927C6.54136 11.5494 6.46585 11.5811 6.38704 11.5814L5.95966 11.5811V11.5814C5.88085 11.5811 5.80535 11.5494 5.74957 11.4927C5.69389 11.4362 5.66255 11.3595 5.66255 11.2794L5.66275 4.76055C5.66275 4.59441 5.79513 4.4596 5.95866 4.4596L5.95906 4.45991L5.96156 4.4593L5.96196 4.4592L6.38645 4.45899L6.38725 4.45898ZM3.72146 4.44749L3.71555 4.45349V4.45369H3.71595C3.87516 4.45369 4.00675 4.5819 4.01226 4.74469L4.23427 11.2597C4.23697 11.3397 4.20833 11.4175 4.15456 11.4759L4.15446 11.476C4.10068 11.5345 4.02628 11.5689 3.94758 11.5716L3.52039 11.5866C3.51779 11.5867 3.51278 11.5868 3.51018 11.5868C3.43508 11.5868 3.36258 11.5579 3.3075 11.5056C3.24982 11.4511 3.21598 11.3755 3.21327 11.2956L2.99177 4.78058C2.98606 4.61404 3.11444 4.47443 3.27837 4.46866L3.70514 4.45371V4.45391C3.70665 4.45371 3.70795 4.45361 3.70925 4.45361C3.71105 4.45361 3.71296 4.45371 3.71436 4.45391L3.71476 4.45351L3.72146 4.44749ZM8.63442 4.45349C8.63683 4.45359 8.63933 4.45359 8.64143 4.45369V4.45389L9.0682 4.46864C9.23213 4.47443 9.3605 4.61403 9.35481 4.78056L9.1333 11.2955C9.1306 11.3755 9.09675 11.4511 9.03917 11.5056C8.9841 11.5579 8.9115 11.5867 8.8364 11.5867C8.83379 11.5867 8.82878 11.5866 8.82618 11.5865L8.399 11.5716V11.5718C8.32029 11.5689 8.24579 11.5344 8.19211 11.4759C8.13834 11.4175 8.1096 11.3396 8.1124 11.2597L8.33431 4.74467C8.33982 4.5822 8.47099 4.45419 8.6298 4.45419L8.6302 4.4544L8.63261 4.45379L8.63351 4.45358V4.45348L8.63442 4.45349ZM1.00978 3.34807L1.43465 11.1005L1.43565 11.1146C1.4723 11.5605 1.50455 12.366 2.03977 12.8064V12.8066C2.53786 13.2162 3.38031 13.2097 3.91805 13.2221L3.92937 13.2222L5.27011 13.2228L5.26931 13.223C5.27792 13.2232 5.28653 13.2234 5.29524 13.2234L5.29544 13.2237L6.16652 13.2231L7.05042 13.2235L7.05062 13.2237C7.05903 13.2235 7.06745 13.2233 7.07576 13.2229H7.07656L7.07586 13.2231L8.4165 13.2224L8.42781 13.2222C8.96556 13.2098 9.808 13.2164 10.3061 12.8069V12.8066C10.8413 12.3663 10.8737 11.5609 10.9103 11.1149L10.9113 11.1008L11.3366 3.34839L1.00978 3.34807Z" fill="#FF6161" />
                                                                    </svg>Delete</Button>
                                                                </ButtonGroup>
                                                            </div>
                                                        </div>

                                                    ))
                                                        :
                                                        <div className='text-center mt-3'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="114" height="58" viewBox="0 0 114 58" fill="none">
                                                                <path d="M20.0005 22C20.0005 22 23.5616 27.5466 25.484 42.0748" stroke="#787E76" stroke-miterlimit="10" />
                                                                <ellipse cx="56.9478" cy="55.3726" rx="56.9473" ry="1.81747" fill="#E9EBE7" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M95.411 54.4881C95.411 54.4881 92.6062 51.5573 93.8668 45.9792C93.8668 45.9792 92.102 42.2289 94.7807 39.4871C94.7807 39.4871 94.0559 35.1066 97.6486 33.1212C97.6486 33.1212 97.9322 30.4109 100.201 28.1104V54.4566H95.411V54.4881Z" fill="#DAFFD0" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M105.023 54.4881C105.023 54.4881 107.828 51.5573 106.568 45.9792C106.568 45.9792 108.332 42.2289 105.654 39.4871C105.654 39.4871 106.379 35.1066 102.786 33.1212C102.786 33.1212 102.502 30.4109 100.233 28.1104V54.4566H105.023V54.4881Z" fill="#B8F5A8" />
                                                                <path d="M84.3331 32.0077V11.5835C84.3331 9.02344 82.2574 6.95004 79.6996 6.95004H42.633C41.352 6.95004 40.3164 5.91448 40.3164 4.63349C40.3164 3.35249 41.352 2.31694 42.633 2.31694H42.7765L79.7001 2.31655C80.3396 2.31655 80.8586 1.79762 80.8586 1.15808C80.8586 0.51892 80.3396 0 79.7001 0H42.6335C40.0734 0 38 2.07568 38 4.6335V50.9675C38 53.5253 40.0734 55.601 42.6335 55.601H67.8483C65.8467 53.0432 64.642 49.8322 64.642 46.3344C64.642 38.0176 71.3834 31.2756 79.7008 31.2756C81.3177 31.2752 82.8721 31.537 84.3339 32.0075L84.3331 32.0077ZM75.0665 20.8499H49.5826V16.2164H75.0665V20.8499Z" fill="#CDD4C4" />
                                                                <path d="M82.0166 37.0664H77.3832V44.0165H70.4331V48.65H77.3832V55.6H82.0166V48.65H88.9667V44.0165H82.0166V37.0664Z" fill="#CDD4C4" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M34.2547 57.0118C34.2547 57.0118 32.5847 55.2668 33.3352 51.9456C33.3352 51.9456 32.2845 49.7127 33.8794 48.0803C33.8794 48.0803 33.4478 45.4722 35.5869 44.2901C35.5869 44.2901 35.7557 42.6764 37.1067 41.3066V56.993H34.2547V57.0118Z" fill="#8DF570" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M39.9785 57.0118C39.9785 57.0118 41.6485 55.2668 40.8979 51.9456C40.8979 51.9456 41.9487 49.7127 40.3538 48.0803C40.3538 48.0803 40.7854 45.4722 38.6463 44.2901C38.6463 44.2901 38.4774 42.6764 37.1265 41.3066V56.993H39.9785V57.0118Z" fill="#B8F5A8" />
                                                                <path d="M22.1474 25.6854C22.1474 25.6854 25.2989 28.3957 27.3474 25.6854C29.4273 22.9752 27.0952 18.0589 26.1183 17.271C25.1413 16.4831 22.9038 16.4831 22.0214 14.7183C21.1074 12.9535 19.3741 14.4977 17.0105 12.5123C14.6154 10.5269 12.8506 12.1026 11.2118 10.6529C9.57308 9.20325 9.66763 15.9789 11.0858 17.8067C12.5039 19.6031 10.9912 23.9206 13.1027 23.8891C15.2457 23.8261 12.567 28.3011 16.2227 30.066C19.8469 31.7993 22.0529 27.1981 22.1474 25.6854Z" fill="#CCFFCE" />
                                                                <path d="M10.5808 11.252C10.5808 11.252 10.8014 11.441 11.1796 11.7877C11.5578 12.1344 12.062 12.6386 12.6923 13.2689C13.3226 13.8992 14.0159 14.624 14.7723 15.4119C15.5286 16.1998 16.285 17.0822 17.0413 17.9646C17.4195 18.4058 17.7662 18.847 18.1443 19.2882C18.491 19.7294 18.8377 20.2021 19.1528 20.6118C19.4679 21.053 19.7831 21.4942 20.0667 21.9039C20.3504 22.3136 20.6025 22.7233 20.8231 23.1015C21.0437 23.4796 21.2328 23.8263 21.4219 24.1415C21.6109 24.4566 21.737 24.7402 21.8315 24.9608C22.0521 25.4336 22.1782 25.6857 22.1782 25.6857C22.1782 25.6857 22.0837 25.402 21.8946 24.9293C21.8 24.6772 21.7055 24.3936 21.5479 24.0784C21.3903 23.7633 21.2328 23.3851 21.0122 23.0069C20.7916 22.6287 20.5394 22.2191 20.2873 21.7779C20.0037 21.3682 19.7201 20.8954 19.4049 20.4542C19.0898 20.013 18.7431 19.5403 18.3964 19.0991C18.0498 18.6579 17.6716 18.1852 17.2934 17.744C16.5371 16.8616 15.7492 15.9792 14.9929 15.1913C14.6147 14.7816 14.2365 14.4349 13.8899 14.0883C13.5117 13.7416 13.165 13.4265 12.8499 13.1113C12.2196 12.5125 11.6523 12.0398 11.2426 11.7247C10.8329 11.4095 10.5808 11.252 10.5808 11.252Z" fill="#787E76" />
                                                                <path d="M21.6743 24.5509C21.6743 24.5509 21.7058 24.4249 21.7689 24.2358C21.8319 24.0152 21.9264 23.7316 22.021 23.3849C22.1155 23.0382 22.2731 22.6601 22.4307 22.2189C22.5252 21.9982 22.6198 21.8092 22.7143 21.5886C22.8088 21.368 22.9349 21.1789 23.0294 20.9583C23.124 20.7377 23.2816 20.5486 23.3761 20.3595C23.5022 20.1704 23.6282 19.9813 23.7858 19.7922C23.9434 19.6347 24.0694 19.4456 24.1955 19.3195C24.3531 19.1934 24.4791 19.0359 24.6052 18.9413C24.7627 18.8468 24.8888 18.7522 24.9834 18.6577C25.1094 18.5632 25.2355 18.5316 25.2985 18.4686C25.4876 18.3741 25.5821 18.311 25.5821 18.311C25.5821 18.311 25.4561 18.3426 25.267 18.4056C25.1724 18.4371 25.0464 18.4686 24.9203 18.5316C24.7943 18.5947 24.6367 18.6892 24.4791 18.7838C24.3215 18.8783 24.164 19.0044 24.0064 19.1304C23.8488 19.2565 23.6913 19.4456 23.5337 19.6031C23.3761 19.7922 23.25 19.9813 23.0925 20.1704C22.9664 20.391 22.8088 20.5801 22.7143 20.8007C22.4937 21.2419 22.2731 21.6831 22.147 22.1243C21.9895 22.5655 21.8949 22.9752 21.8319 23.3219C21.7058 24.0782 21.6743 24.5509 21.6743 24.5509Z" fill="#787E76" />
                                                                <path d="M21.012 23.2589C21.012 23.2589 20.6338 23.0068 19.972 22.7862C19.6569 22.6917 19.2472 22.5656 18.8375 22.471C18.6169 22.4395 18.3963 22.3765 18.1757 22.3765C17.9551 22.345 17.703 22.345 17.4824 22.3135C17.2618 22.3135 17.0096 22.3135 16.789 22.3135C16.5684 22.3135 16.3478 22.345 16.1272 22.345C15.9066 22.3765 15.7175 22.408 15.4969 22.4395C15.3079 22.471 15.1188 22.5026 14.9612 22.5341C14.6145 22.5971 14.3309 22.6917 14.1418 22.7547C13.9527 22.8177 13.8267 22.8492 13.8267 22.8492C13.8267 22.8492 13.9527 22.8492 14.1418 22.8177C14.2364 22.8177 14.3624 22.7862 14.4885 22.7547C14.6145 22.7232 14.7721 22.7232 14.9612 22.6916C15.1188 22.6916 15.3079 22.6601 15.4969 22.6286C15.686 22.6286 15.9066 22.5971 16.0957 22.5971C16.5054 22.5971 16.9781 22.5656 17.4193 22.5971C17.6399 22.6286 17.8605 22.6286 18.0811 22.6601C18.3017 22.6917 18.5223 22.6916 18.7429 22.7232C19.1526 22.7862 19.5623 22.8492 19.8775 22.9438C20.2241 23.0068 20.4763 23.1013 20.6653 23.1644C20.9175 23.2274 21.012 23.2589 21.012 23.2589Z" fill="#787E76" />
                                                                <path d="M19.6256 20.8004C19.6256 20.8004 19.5941 20.4538 19.6571 19.918C19.6886 19.6659 19.7202 19.3507 19.8147 19.0671C19.8462 18.9095 19.9092 18.752 19.9408 18.5944C19.9723 18.4368 20.0668 18.2792 20.0983 18.1217C20.1614 17.9641 20.2244 17.8065 20.2874 17.6489C20.3504 17.4914 20.445 17.3653 20.508 17.2077C20.6656 16.9241 20.8232 16.672 20.9807 16.4514C21.1068 16.2308 21.2644 16.0417 21.3274 15.9156C21.4219 15.7896 21.4535 15.7266 21.4535 15.7266C21.4535 15.7266 21.3904 15.7896 21.2644 15.8841C21.1383 15.9787 20.9807 16.1363 20.7917 16.3253C20.6026 16.5144 20.4135 16.7665 20.2244 17.0502C20.1298 17.2077 20.0353 17.3338 19.9723 17.4914C19.9092 17.6489 19.8147 17.8065 19.7517 17.9956C19.6886 18.1532 19.6256 18.3423 19.5941 18.4998C19.5626 18.6574 19.4996 18.8465 19.4996 19.0041C19.4365 19.3507 19.4365 19.6659 19.4365 19.918C19.4996 20.4853 19.6256 20.8004 19.6256 20.8004Z" fill="#787E76" />
                                                                <path d="M18.5851 19.4454C18.5851 19.4454 18.2699 19.2248 17.7657 18.9727C17.23 18.7521 16.5051 18.563 15.7173 18.5C15.5282 18.5 15.3391 18.5 15.15 18.5C14.9609 18.5 14.7718 18.5315 14.6142 18.5315C14.4252 18.563 14.2676 18.5945 14.11 18.6261C13.9524 18.6576 13.7949 18.6891 13.6688 18.7521C13.5427 18.7836 13.4167 18.8152 13.2906 18.8782C13.1961 18.9097 13.1015 18.9727 13.007 19.0042C12.8494 19.0673 12.7549 19.0988 12.7549 19.0988C12.7549 19.0988 12.8494 19.0988 13.007 19.0673C13.1015 19.0673 13.1961 19.0358 13.2906 19.0042C13.4167 18.9727 13.5427 18.9727 13.6688 18.9412C13.7949 18.9097 13.9524 18.9097 14.11 18.8782C14.2676 18.8782 14.4252 18.8467 14.6142 18.8467C14.9609 18.8467 15.3391 18.8151 15.6857 18.8467C16.0639 18.8782 16.4106 18.9097 16.7572 18.9727C17.1039 19.0357 17.419 19.0988 17.6712 19.1618C18.2384 19.3194 18.5851 19.4454 18.5851 19.4454Z" fill="#787E76" />
                                                                <path d="M16.4112 16.9875C16.4112 16.9875 16.3796 16.7354 16.3796 16.3572C16.3481 15.979 16.3166 15.4748 16.3166 14.9705C16.3166 14.4663 16.3481 13.9621 16.3796 13.6154C16.3796 13.4263 16.4112 13.2688 16.4112 13.1427C16.4112 13.0166 16.4112 12.9536 16.4112 12.9536C16.4112 12.9536 16.3796 13.0166 16.3481 13.1112C16.3166 13.2057 16.2221 13.3633 16.1905 13.5524C16.1275 13.7415 16.096 13.9621 16.0645 14.2142C16.033 14.4663 16.0015 14.7184 16.0015 14.9705C16.0015 15.4748 16.096 16.0105 16.1905 16.3887C16.2851 16.7354 16.4112 16.9875 16.4112 16.9875Z" fill="#787E76" />
                                                                <path d="M15.6555 16.1678C15.6555 16.1678 15.4349 15.9472 14.9937 15.7266C14.7731 15.6006 14.5524 15.4745 14.2688 15.3799C13.9852 15.2539 13.7016 15.1909 13.3864 15.0963C13.0713 15.0333 12.7561 14.9703 12.4725 14.9387C12.1888 14.9072 11.9052 14.9072 11.6531 14.9072C11.401 14.9072 11.2119 14.9387 11.0858 14.9387C10.9598 14.9703 10.8652 14.9703 10.8652 14.9703C10.8652 14.9703 10.9283 14.9703 11.0858 15.0018C11.2119 15.0018 11.401 15.0333 11.6531 15.0648C12.1258 15.1278 12.7246 15.2224 13.3234 15.3799C13.607 15.443 13.9222 15.5375 14.2058 15.6005C14.4894 15.6951 14.7415 15.7581 14.9621 15.8527C15.3718 16.0418 15.6555 16.1678 15.6555 16.1678Z" fill="#787E76" />
                                                                <path d="M22.052 25.4017C22.052 25.4017 21.6108 25.3071 20.9175 25.3071C20.5708 25.3071 20.1927 25.3386 19.7514 25.4017C19.5308 25.4332 19.3102 25.4962 19.1212 25.5592C18.9006 25.6223 18.6799 25.6853 18.4909 25.7798C18.2703 25.8744 18.0812 25.9689 17.8606 26.0635C17.64 26.158 17.4824 26.2841 17.2933 26.4101C17.1042 26.5047 16.9466 26.6623 16.7891 26.7883C16.6315 26.9144 16.5054 27.0404 16.3794 27.1665C16.2533 27.2926 16.1588 27.3871 16.0642 27.5132C15.9697 27.6392 15.9067 27.7338 15.8436 27.7968C15.7176 27.9544 15.6545 28.0489 15.6545 28.0489C15.6545 28.0489 15.7491 27.9859 15.8751 27.8283C15.9382 27.7653 16.0327 27.6707 16.1273 27.5762C16.2218 27.4816 16.3479 27.3871 16.4739 27.2925C16.6 27.1665 16.726 27.0719 16.8836 26.9774C17.0412 26.8829 17.1988 26.7568 17.3878 26.6623C17.5769 26.5677 17.7345 26.4417 17.9551 26.3786C18.1442 26.2841 18.3333 26.1895 18.5539 26.1265C18.9636 25.9689 19.3733 25.8429 19.783 25.7483C19.9721 25.7168 20.1927 25.6538 20.3502 25.6223C20.5393 25.5908 20.7284 25.5592 20.886 25.5277C21.2011 25.4962 21.4848 25.4647 21.6738 25.4647C21.926 25.4017 22.052 25.4017 22.052 25.4017Z" fill="#787E76" />
                                                                <path d="M31.0038 24.519C31.0038 24.519 26.5287 32.051 25.6147 44.8145" stroke="#787E76" stroke-miterlimit="10" />
                                                                <path d="M34.1543 30.8852C36.9906 29.53 34.9107 26.0634 36.5494 26.1265C38.2197 26.158 37.0222 22.8174 38.1252 21.4308C39.2282 20.0441 39.3227 14.7812 38.0306 15.8842C36.7385 17.0187 35.3834 15.7581 33.524 17.3024C31.6647 18.8466 30.3411 17.649 29.6477 19.0042C28.9544 20.3593 27.2211 20.3593 26.4648 20.9581C25.7084 21.5568 23.9121 25.4016 25.5193 27.4816C27.1266 29.5616 29.5532 27.4816 29.5532 27.4816C29.6162 28.7107 31.318 32.2403 34.1543 30.8852Z" fill="#DAFFD0" />
                                                                <path d="M38.5039 16.3569C38.5039 16.3569 38.3463 16.5145 38.0627 16.7666C37.779 17.0187 37.3693 17.4284 36.8966 17.9012C36.4239 18.3739 35.8566 18.9411 35.2894 19.5714C34.7221 20.1702 34.1233 20.8635 33.5245 21.5569C33.2094 21.9035 32.9573 22.2502 32.6736 22.5968C32.39 22.9435 32.1379 23.2902 31.8858 23.6368C31.6337 23.9835 31.4131 24.2986 31.1925 24.6453C30.9719 24.9604 30.7828 25.2756 30.5937 25.5592C30.4361 25.8428 30.2785 26.1265 30.1525 26.3471C29.9949 26.5677 29.9319 26.7883 29.8373 26.9774C29.6798 27.324 29.5852 27.5446 29.5852 27.5446C29.5852 27.5446 29.6797 27.324 29.8058 26.9774C29.8688 26.7883 29.9634 26.5677 30.0894 26.3156C30.2155 26.0634 30.3416 25.7798 30.4991 25.4962C30.6567 25.2126 30.8458 24.8974 31.0664 24.5507C31.287 24.2356 31.5076 23.8889 31.7597 23.5423C32.0118 23.1956 32.264 22.849 32.5476 22.5023C32.8312 22.1556 33.0833 21.7774 33.3985 21.4623C33.9973 20.769 34.596 20.1072 35.1948 19.5084C35.4784 19.1933 35.7936 18.9096 36.0457 18.6575C36.3293 18.4054 36.5815 18.1533 36.8336 17.9012C37.3378 17.4284 37.779 17.0818 38.0627 16.8297C38.3148 16.483 38.5039 16.3569 38.5039 16.3569Z" fill="#787E76" />
                                                                <path d="M29.9004 26.6621C29.9004 26.6621 29.8689 26.5676 29.8374 26.41C29.8059 26.2524 29.7113 26.0318 29.6483 25.7482C29.5538 25.4961 29.4592 25.1809 29.3332 24.8658C29.2701 24.7082 29.2071 24.5506 29.1126 24.3615C29.0495 24.204 28.955 24.0464 28.8604 23.8573C28.7659 23.6997 28.6714 23.5422 28.5768 23.3846C28.4823 23.227 28.3877 23.101 28.2617 22.9434C28.1356 22.8173 28.0411 22.6913 27.9465 22.5652C27.8205 22.4707 27.7259 22.3446 27.6314 22.2816C27.5053 22.2186 27.4108 22.124 27.3162 22.061C27.2217 21.9979 27.1271 21.9664 27.0641 21.9034C26.9065 21.8089 26.8435 21.7773 26.8435 21.7773C26.8435 21.7773 26.9381 21.8089 27.0956 21.8719C27.1587 21.9034 27.2847 21.9349 27.3793 21.9664C27.4738 22.0295 27.5999 22.0925 27.7259 22.1555C27.852 22.2186 27.978 22.3446 28.1041 22.4392C28.2302 22.5337 28.3562 22.6598 28.4823 22.7858C28.6083 22.9119 28.7029 23.0694 28.8289 23.227C28.9235 23.3846 29.0495 23.5422 29.1126 23.6997C29.3016 24.0464 29.4592 24.3931 29.5538 24.7082C29.6798 25.0549 29.7429 25.37 29.8059 25.6537C29.9004 26.2839 29.9004 26.6621 29.9004 26.6621Z" fill="#787E76" />
                                                                <path d="M30.4363 25.6536C30.4363 25.6536 30.7514 25.4645 31.2557 25.2754C31.5078 25.1809 31.8229 25.0863 32.1381 25.0233C32.2956 24.9918 32.4847 24.9603 32.6423 24.9287C32.8314 24.8972 32.989 24.8972 33.1781 24.8657C33.3671 24.8657 33.5247 24.8657 33.7138 24.8657C33.9029 24.8657 34.0605 24.8972 34.218 24.8972C34.3756 24.8972 34.5332 24.9287 34.6908 24.9603C34.8483 24.9918 34.9744 25.0233 35.132 25.0548C35.3841 25.1178 35.6047 25.1809 35.7623 25.2124C35.9198 25.2754 35.9829 25.2754 35.9829 25.2754C35.9829 25.2754 35.8883 25.2754 35.7307 25.2439C35.6677 25.2439 35.5732 25.2124 35.4471 25.2124C35.3526 25.1809 35.2265 25.1809 35.1005 25.1809C34.9744 25.1809 34.8168 25.1494 34.6908 25.1494C34.5332 25.1494 34.3756 25.1178 34.218 25.1178C33.9029 25.1178 33.5247 25.1178 33.1781 25.1178C32.989 25.1178 32.8314 25.1178 32.6423 25.1494C32.4847 25.1809 32.2956 25.1809 32.1381 25.2124C31.8229 25.2439 31.5078 25.3069 31.2557 25.3699C31.0035 25.433 30.7829 25.496 30.6254 25.5275C30.4993 25.6221 30.4363 25.6536 30.4363 25.6536Z" fill="#787E76" />
                                                                <path d="M31.5082 23.7628C31.5082 23.7628 31.5398 23.4792 31.4767 23.101C31.4452 22.9119 31.4137 22.6598 31.3507 22.4392C31.3192 22.3132 31.2876 22.1871 31.2561 22.061C31.2246 21.935 31.1616 21.8089 31.1301 21.6829C31.067 21.5568 31.0355 21.4308 30.9725 21.3047C30.9095 21.1786 30.8464 21.0841 30.8149 20.958C30.6889 20.7374 30.5628 20.5483 30.4683 20.3593C30.3737 20.2017 30.2477 20.0441 30.1846 19.9496C30.1216 19.855 30.0901 19.792 30.0901 19.792C30.0901 19.792 30.1531 19.8235 30.2477 19.918C30.3422 20.0126 30.4683 20.1071 30.5943 20.2647C30.7519 20.4223 30.878 20.6114 31.0355 20.832C31.0986 20.958 31.1616 21.0526 31.2246 21.1786C31.2876 21.3047 31.3507 21.4308 31.3822 21.5568C31.4137 21.6829 31.4767 21.8089 31.5082 21.9665C31.5398 22.0926 31.5713 22.2186 31.6028 22.3447C31.6343 22.5968 31.6658 22.8489 31.6343 23.0695C31.6028 23.4792 31.5082 23.7628 31.5082 23.7628Z" fill="#787E76" />
                                                                <path d="M32.2957 22.6914C32.2957 22.6914 32.5163 22.5023 32.9259 22.3447C33.3356 22.1556 33.9029 22.0296 34.5017 21.998C34.6593 21.998 34.7853 21.998 34.9429 21.998C35.1005 21.998 35.2265 22.0296 35.3841 22.0296C35.5102 22.0296 35.6677 22.0611 35.7623 22.0926C35.8883 22.1241 36.0144 22.1556 36.1089 22.1871C36.2035 22.2187 36.298 22.2502 36.3926 22.2817C36.4871 22.3132 36.5501 22.3447 36.6132 22.3762C36.7392 22.4392 36.8023 22.4708 36.8023 22.4708C36.8023 22.4708 36.7392 22.4708 36.6132 22.4393C36.5501 22.4393 36.4871 22.4077 36.3926 22.4077C36.298 22.3762 36.2035 22.3762 36.1089 22.3762C36.0144 22.3762 35.8883 22.3447 35.7623 22.3447C35.6362 22.3447 35.5102 22.3132 35.3841 22.3132C35.132 22.3132 34.8483 22.2817 34.5647 22.3132C34.2811 22.3132 33.9974 22.3447 33.7453 22.4077C33.4932 22.4392 33.2411 22.5023 33.0205 22.5653C32.5793 22.5968 32.2957 22.6914 32.2957 22.6914Z" fill="#787E76" />
                                                                <path d="M33.9978 20.7689C33.9978 20.7689 33.9978 20.5798 34.0293 20.2646C34.0608 19.981 34.0608 19.5713 34.0608 19.1932C34.0608 18.815 34.0608 18.4368 34.0293 18.1216C34.0293 17.9641 33.9978 17.838 33.9978 17.775C33.9978 17.6804 33.9978 17.6489 33.9978 17.6489C33.9978 17.6489 34.0293 17.6804 34.0608 17.775C34.0923 17.8695 34.1554 17.9641 34.1869 18.1216C34.2184 18.2792 34.2814 18.4368 34.2814 18.6259C34.313 18.815 34.3129 19.0041 34.3129 19.2247C34.3129 19.6343 34.2499 20.0125 34.1554 20.2962C34.0923 20.6113 33.9978 20.7689 33.9978 20.7689Z" fill="#787E76" />
                                                                <path d="M34.5647 20.1388C34.5647 20.1388 34.7538 19.9813 35.0689 19.7922C35.2265 19.6976 35.4156 19.6031 35.6362 19.5086C35.8568 19.414 36.0774 19.351 36.3295 19.2879C36.5816 19.2249 36.8022 19.1934 37.0544 19.1619C37.275 19.1304 37.4956 19.1304 37.6846 19.1304C37.8737 19.1304 38.0313 19.1619 38.1259 19.1619C38.2204 19.1619 38.2834 19.1934 38.2834 19.1934C38.2834 19.1934 38.2204 19.1934 38.1259 19.2249C38.0313 19.2249 37.8737 19.2564 37.6846 19.2879C37.338 19.351 36.8653 19.414 36.3925 19.5401C36.1719 19.6031 35.9198 19.6661 35.7307 19.7291C35.5101 19.7922 35.321 19.8552 35.1635 19.9182C34.7853 20.0443 34.5647 20.1388 34.5647 20.1388Z" fill="#787E76" />
                                                                <path d="M29.6174 27.2926C29.6174 27.2926 29.9641 27.1981 30.4998 27.2296C30.752 27.2296 31.0671 27.2611 31.3822 27.3241C31.5398 27.3556 31.6974 27.3871 31.8865 27.4502C32.0441 27.5132 32.2331 27.5447 32.3907 27.6077C32.5483 27.6708 32.7059 27.7338 32.8634 27.8284C33.021 27.8914 33.1786 27.9859 33.3046 28.0805C33.4622 28.175 33.5568 28.2696 33.6828 28.3641C33.8089 28.4586 33.9034 28.5532 33.998 28.6477C34.0925 28.7423 34.1871 28.8368 34.2501 28.8998C34.3131 28.9944 34.3761 29.0574 34.4077 29.1205C34.5022 29.2465 34.5337 29.3095 34.5337 29.3095C34.5337 29.3095 34.4707 29.2465 34.3761 29.152C34.3131 29.0889 34.2501 29.0259 34.1871 28.9629C34.124 28.8999 33.998 28.8368 33.9034 28.7423C33.8089 28.6477 33.7143 28.5847 33.5883 28.4902C33.4622 28.3956 33.3362 28.3326 33.2101 28.238C33.084 28.1435 32.9265 28.0805 32.7689 28.0174C32.6113 27.9544 32.4538 27.8599 32.2962 27.8284C31.981 27.7023 31.6659 27.6078 31.3507 27.5447C31.1932 27.5132 31.0356 27.4817 30.9095 27.4502C30.752 27.4187 30.6259 27.3871 30.4998 27.3871C30.2477 27.3556 30.0271 27.3241 29.8695 27.3241C29.712 27.2926 29.6174 27.2926 29.6174 27.2926Z" fill="#787E76" />
                                                                <path d="M35.9816 38.0391H16.9783V40.5602H35.9816V38.0391Z" fill="#DAFFD0" />
                                                                <path d="M32.8927 54.1114H20.0978L18.4275 40.5601H34.563L32.8927 54.1114Z" fill="#80BE4F" />
                                                            </svg>
                                                            <p className='text-dark fw-600 fs-6 mt-3 mb-0'>No direction</p>
                                                            <p className='text-custom-grey fw-600 fs-6 mb-3'>Looks like you haven't added any directions yet.
                                                            </p>
                                                        </div>
                                                    }
                                                    <div className='mt-3 text-center w-100 mb-3'>
                                                        <hr />
                                                        <Button className='bg-none text-green fs-6 fw-600 border-0 mb-3' onClick={() => { setSelectedDirection(null); setShowModal(true) }}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 17" fill="none">
                                                            <path d="M15 6.96137V10.6705H9.23864V16.8159H5.76136V10.6705H0V6.96137H5.76136V0.815918H9.23864V6.96137H15Z" fill="#81C524" />
                                                        </svg>Add Direction</Button>
                                                    </div>
                                                </div>
                                            </Tab>
                                            <Tab eventkey="Notes" title="Notes">
                                                <div className='px-4'>

                                                    {recipe?.notes && recipe?.notes.length > 0 ? recipe?.notes.map((note, i) => (
                                                        <div className='direction-tabgrid mt-4'>
                                                            <span className='d-inline'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="22" viewBox="0 0 10 22" fill="none">
                                                                    <circle cx="2" cy="2" r="2" fill="#BAC8A8" />
                                                                    <circle cx="8" cy="2" r="2" fill="#BAC8A8" />
                                                                    <circle cx="2" cy="14" r="2" fill="#BAC8A8" />
                                                                    <circle cx="8" cy="14" r="2" fill="#BAC8A8" />
                                                                    <circle cx="2" cy="8" r="2" fill="#BAC8A8" />
                                                                    <circle cx="8" cy="8" r="2" fill="#BAC8A8" />
                                                                    <circle cx="2" cy="20" r="2" fill="#BAC8A8" />
                                                                    <circle cx="8" cy="20" r="2" fill="#BAC8A8" />
                                                                </svg>
                                                            </span>
                                                            <div>
                                                                <h4 className='text-dark mb-1 fw-600 fs-15'>{note?.title}</h4>
                                                                <p className=' text-custom-grey fw-600 fs-15 mb-0'>{note?.note}</p>
                                                            </div>
                                                            <div>
                                                                <ButtonGroup size="sm">
                                                                    <Button className='bg-none border-0 text-custom-grey fs-15 py-0' onClick={() => { setNote(note); setNoteIndex(i); setShowNotesModal(true) }}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                        <path d="M13.3603 2.23128L11.7687 0.639685C11.3585 0.230044 10.8025 0 10.2227 0C9.64305 0 9.08707 0.230063 8.67684 0.639685L7.51588 1.80051L0.944086 8.3723C0.939318 8.37707 0.937851 8.38367 0.933206 8.38868C0.874285 8.45029 0.826855 8.52181 0.79287 8.60004C0.784924 8.61825 0.781868 8.63671 0.775511 8.65542C0.760598 8.69221 0.74874 8.73011 0.740183 8.76886L0.0100253 13.15H0.00990281C-0.0253032 13.3617 0.0343514 13.5782 0.173096 13.7418C0.311842 13.9055 0.515612 14 0.730166 14C0.77026 13.9999 0.810357 13.9965 0.849963 13.99L5.23116 13.2598C5.26991 13.2511 5.30781 13.2393 5.34448 13.2244C5.36306 13.218 5.38176 13.215 5.39986 13.2071H5.39998C5.47809 13.1732 5.5496 13.1256 5.61121 13.0668C5.6161 13.0622 5.6227 13.0607 5.62759 13.0559L13.3604 5.32311C13.7699 4.91288 14 4.3569 14 3.77712C14 3.19745 13.7699 2.64148 13.3604 2.23124L13.3603 2.23128ZM1.6187 12.3812L1.94741 10.4081L3.59183 12.0525L1.6187 12.3812ZM12.3279 4.29044L11.6833 4.93504L9.06485 2.31671L9.70945 1.67211V1.67199C9.84588 1.53642 10.0305 1.46027 10.2229 1.46027C10.4153 1.46027 10.5999 1.53642 10.7363 1.67199L12.3279 3.26358C12.4638 3.39989 12.5402 3.58448 12.5402 3.777C12.5402 3.96952 12.4638 4.15412 12.3279 4.29041L12.3279 4.29044Z" fill="#26BAFA" />
                                                                    </svg>Edit</Button>
                                                                    <div className='vr mx-1'></div>
                                                                    <Button className='bg-none border-0 text-custom-grey fs-15 py-0' onClick={() => { handleNoteDelete(i) }}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                                                                        <path d="M1.98088 2.67757V2.67778V2.67757ZM6.88975 0L5.45688 0.000508323V0.000711673H5.45617C4.9636 0.000711673 4.56446 0.406291 4.56446 0.906433V0.992348L0.443616 0.99245C0.19868 0.99245 0 1.19407 0 1.44288V2.23634C0 2.48513 0.198672 2.68676 0.443616 2.68676H0.973544V2.68707L11.3729 2.68717L11.373 2.68697V2.68717H11.3791L11.903 2.68697C12.0206 2.68697 12.1334 2.63948 12.2166 2.55509C12.2998 2.4706 12.3466 2.35602 12.3466 2.23655V1.44257C12.3466 1.32311 12.2998 1.20862 12.2166 1.12414C12.1334 1.03965 12.0206 0.992166 11.903 0.992166L7.78213 0.992268V0.906251C7.78213 0.665892 7.6881 0.435392 7.52068 0.265398C7.35335 0.095501 7.12633 3.55961e-05 6.88962 3.55961e-05L6.88975 0ZM6.38725 4.45898C6.55117 4.45918 6.68395 4.5941 6.68395 4.76055L6.68415 11.2794C6.68415 11.3595 6.65281 11.4362 6.59713 11.4927C6.54136 11.5494 6.46585 11.5811 6.38704 11.5814L5.95966 11.5811V11.5814C5.88085 11.5811 5.80535 11.5494 5.74957 11.4927C5.69389 11.4362 5.66255 11.3595 5.66255 11.2794L5.66275 4.76055C5.66275 4.59441 5.79513 4.4596 5.95866 4.4596L5.95906 4.45991L5.96156 4.4593L5.96196 4.4592L6.38645 4.45899L6.38725 4.45898ZM3.72146 4.44749L3.71555 4.45349V4.45369H3.71595C3.87516 4.45369 4.00675 4.5819 4.01226 4.74469L4.23427 11.2597C4.23697 11.3397 4.20833 11.4175 4.15456 11.4759L4.15446 11.476C4.10068 11.5345 4.02628 11.5689 3.94758 11.5716L3.52039 11.5866C3.51779 11.5867 3.51278 11.5868 3.51018 11.5868C3.43508 11.5868 3.36258 11.5579 3.3075 11.5056C3.24982 11.4511 3.21598 11.3755 3.21327 11.2956L2.99177 4.78058C2.98606 4.61404 3.11444 4.47443 3.27837 4.46866L3.70514 4.45371V4.45391C3.70665 4.45371 3.70795 4.45361 3.70925 4.45361C3.71105 4.45361 3.71296 4.45371 3.71436 4.45391L3.71476 4.45351L3.72146 4.44749ZM8.63442 4.45349C8.63683 4.45359 8.63933 4.45359 8.64143 4.45369V4.45389L9.0682 4.46864C9.23213 4.47443 9.3605 4.61403 9.35481 4.78056L9.1333 11.2955C9.1306 11.3755 9.09675 11.4511 9.03917 11.5056C8.9841 11.5579 8.9115 11.5867 8.8364 11.5867C8.83379 11.5867 8.82878 11.5866 8.82618 11.5865L8.399 11.5716V11.5718C8.32029 11.5689 8.24579 11.5344 8.19211 11.4759C8.13834 11.4175 8.1096 11.3396 8.1124 11.2597L8.33431 4.74467C8.33982 4.5822 8.47099 4.45419 8.6298 4.45419L8.6302 4.4544L8.63261 4.45379L8.63351 4.45358V4.45348L8.63442 4.45349ZM1.00978 3.34807L1.43465 11.1005L1.43565 11.1146C1.4723 11.5605 1.50455 12.366 2.03977 12.8064V12.8066C2.53786 13.2162 3.38031 13.2097 3.91805 13.2221L3.92937 13.2222L5.27011 13.2228L5.26931 13.223C5.27792 13.2232 5.28653 13.2234 5.29524 13.2234L5.29544 13.2237L6.16652 13.2231L7.05042 13.2235L7.05062 13.2237C7.05903 13.2235 7.06745 13.2233 7.07576 13.2229H7.07656L7.07586 13.2231L8.4165 13.2224L8.42781 13.2222C8.96556 13.2098 9.808 13.2164 10.3061 12.8069V12.8066C10.8413 12.3663 10.8737 11.5609 10.9103 11.1149L10.9113 11.1008L11.3366 3.34839L1.00978 3.34807Z" fill="#FF6161" />
                                                                    </svg>Delete</Button>
                                                                </ButtonGroup>
                                                            </div>
                                                        </div>
                                                    ))
                                                        :
                                                        <div className='text-center mt-3'>
                                                            <svg xmlns="http://www.w3.org/2000/svg" width="114" height="58" viewBox="0 0 114 58" fill="none">
                                                                <path d="M20.0005 22C20.0005 22 23.5616 27.5466 25.484 42.0748" stroke="#787E76" stroke-miterlimit="10" />
                                                                <ellipse cx="56.9478" cy="55.3726" rx="56.9473" ry="1.81747" fill="#E9EBE7" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M95.411 54.4881C95.411 54.4881 92.6062 51.5573 93.8668 45.9792C93.8668 45.9792 92.102 42.2289 94.7807 39.4871C94.7807 39.4871 94.0559 35.1066 97.6486 33.1212C97.6486 33.1212 97.9322 30.4109 100.201 28.1104V54.4566H95.411V54.4881Z" fill="#DAFFD0" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M105.023 54.4881C105.023 54.4881 107.828 51.5573 106.568 45.9792C106.568 45.9792 108.332 42.2289 105.654 39.4871C105.654 39.4871 106.379 35.1066 102.786 33.1212C102.786 33.1212 102.502 30.4109 100.233 28.1104V54.4566H105.023V54.4881Z" fill="#B8F5A8" />
                                                                <path d="M84.3331 32.0077V11.5835C84.3331 9.02344 82.2574 6.95004 79.6996 6.95004H42.633C41.352 6.95004 40.3164 5.91448 40.3164 4.63349C40.3164 3.35249 41.352 2.31694 42.633 2.31694H42.7765L79.7001 2.31655C80.3396 2.31655 80.8586 1.79762 80.8586 1.15808C80.8586 0.51892 80.3396 0 79.7001 0H42.6335C40.0734 0 38 2.07568 38 4.6335V50.9675C38 53.5253 40.0734 55.601 42.6335 55.601H67.8483C65.8467 53.0432 64.642 49.8322 64.642 46.3344C64.642 38.0176 71.3834 31.2756 79.7008 31.2756C81.3177 31.2752 82.8721 31.537 84.3339 32.0075L84.3331 32.0077ZM75.0665 20.8499H49.5826V16.2164H75.0665V20.8499Z" fill="#CDD4C4" />
                                                                <path d="M82.0166 37.0664H77.3832V44.0165H70.4331V48.65H77.3832V55.6H82.0166V48.65H88.9667V44.0165H82.0166V37.0664Z" fill="#CDD4C4" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M34.2547 57.0118C34.2547 57.0118 32.5847 55.2668 33.3352 51.9456C33.3352 51.9456 32.2845 49.7127 33.8794 48.0803C33.8794 48.0803 33.4478 45.4722 35.5869 44.2901C35.5869 44.2901 35.7557 42.6764 37.1067 41.3066V56.993H34.2547V57.0118Z" fill="#8DF570" />
                                                                <path fillRule="evenodd" clipRule="evenodd" d="M39.9785 57.0118C39.9785 57.0118 41.6485 55.2668 40.8979 51.9456C40.8979 51.9456 41.9487 49.7127 40.3538 48.0803C40.3538 48.0803 40.7854 45.4722 38.6463 44.2901C38.6463 44.2901 38.4774 42.6764 37.1265 41.3066V56.993H39.9785V57.0118Z" fill="#B8F5A8" />
                                                                <path d="M22.1474 25.6854C22.1474 25.6854 25.2989 28.3957 27.3474 25.6854C29.4273 22.9752 27.0952 18.0589 26.1183 17.271C25.1413 16.4831 22.9038 16.4831 22.0214 14.7183C21.1074 12.9535 19.3741 14.4977 17.0105 12.5123C14.6154 10.5269 12.8506 12.1026 11.2118 10.6529C9.57308 9.20325 9.66763 15.9789 11.0858 17.8067C12.5039 19.6031 10.9912 23.9206 13.1027 23.8891C15.2457 23.8261 12.567 28.3011 16.2227 30.066C19.8469 31.7993 22.0529 27.1981 22.1474 25.6854Z" fill="#CCFFCE" />
                                                                <path d="M10.5808 11.252C10.5808 11.252 10.8014 11.441 11.1796 11.7877C11.5578 12.1344 12.062 12.6386 12.6923 13.2689C13.3226 13.8992 14.0159 14.624 14.7723 15.4119C15.5286 16.1998 16.285 17.0822 17.0413 17.9646C17.4195 18.4058 17.7662 18.847 18.1443 19.2882C18.491 19.7294 18.8377 20.2021 19.1528 20.6118C19.4679 21.053 19.7831 21.4942 20.0667 21.9039C20.3504 22.3136 20.6025 22.7233 20.8231 23.1015C21.0437 23.4796 21.2328 23.8263 21.4219 24.1415C21.6109 24.4566 21.737 24.7402 21.8315 24.9608C22.0521 25.4336 22.1782 25.6857 22.1782 25.6857C22.1782 25.6857 22.0837 25.402 21.8946 24.9293C21.8 24.6772 21.7055 24.3936 21.5479 24.0784C21.3903 23.7633 21.2328 23.3851 21.0122 23.0069C20.7916 22.6287 20.5394 22.2191 20.2873 21.7779C20.0037 21.3682 19.7201 20.8954 19.4049 20.4542C19.0898 20.013 18.7431 19.5403 18.3964 19.0991C18.0498 18.6579 17.6716 18.1852 17.2934 17.744C16.5371 16.8616 15.7492 15.9792 14.9929 15.1913C14.6147 14.7816 14.2365 14.4349 13.8899 14.0883C13.5117 13.7416 13.165 13.4265 12.8499 13.1113C12.2196 12.5125 11.6523 12.0398 11.2426 11.7247C10.8329 11.4095 10.5808 11.252 10.5808 11.252Z" fill="#787E76" />
                                                                <path d="M21.6743 24.5509C21.6743 24.5509 21.7058 24.4249 21.7689 24.2358C21.8319 24.0152 21.9264 23.7316 22.021 23.3849C22.1155 23.0382 22.2731 22.6601 22.4307 22.2189C22.5252 21.9982 22.6198 21.8092 22.7143 21.5886C22.8088 21.368 22.9349 21.1789 23.0294 20.9583C23.124 20.7377 23.2816 20.5486 23.3761 20.3595C23.5022 20.1704 23.6282 19.9813 23.7858 19.7922C23.9434 19.6347 24.0694 19.4456 24.1955 19.3195C24.3531 19.1934 24.4791 19.0359 24.6052 18.9413C24.7627 18.8468 24.8888 18.7522 24.9834 18.6577C25.1094 18.5632 25.2355 18.5316 25.2985 18.4686C25.4876 18.3741 25.5821 18.311 25.5821 18.311C25.5821 18.311 25.4561 18.3426 25.267 18.4056C25.1724 18.4371 25.0464 18.4686 24.9203 18.5316C24.7943 18.5947 24.6367 18.6892 24.4791 18.7838C24.3215 18.8783 24.164 19.0044 24.0064 19.1304C23.8488 19.2565 23.6913 19.4456 23.5337 19.6031C23.3761 19.7922 23.25 19.9813 23.0925 20.1704C22.9664 20.391 22.8088 20.5801 22.7143 20.8007C22.4937 21.2419 22.2731 21.6831 22.147 22.1243C21.9895 22.5655 21.8949 22.9752 21.8319 23.3219C21.7058 24.0782 21.6743 24.5509 21.6743 24.5509Z" fill="#787E76" />
                                                                <path d="M21.012 23.2589C21.012 23.2589 20.6338 23.0068 19.972 22.7862C19.6569 22.6917 19.2472 22.5656 18.8375 22.471C18.6169 22.4395 18.3963 22.3765 18.1757 22.3765C17.9551 22.345 17.703 22.345 17.4824 22.3135C17.2618 22.3135 17.0096 22.3135 16.789 22.3135C16.5684 22.3135 16.3478 22.345 16.1272 22.345C15.9066 22.3765 15.7175 22.408 15.4969 22.4395C15.3079 22.471 15.1188 22.5026 14.9612 22.5341C14.6145 22.5971 14.3309 22.6917 14.1418 22.7547C13.9527 22.8177 13.8267 22.8492 13.8267 22.8492C13.8267 22.8492 13.9527 22.8492 14.1418 22.8177C14.2364 22.8177 14.3624 22.7862 14.4885 22.7547C14.6145 22.7232 14.7721 22.7232 14.9612 22.6916C15.1188 22.6916 15.3079 22.6601 15.4969 22.6286C15.686 22.6286 15.9066 22.5971 16.0957 22.5971C16.5054 22.5971 16.9781 22.5656 17.4193 22.5971C17.6399 22.6286 17.8605 22.6286 18.0811 22.6601C18.3017 22.6917 18.5223 22.6916 18.7429 22.7232C19.1526 22.7862 19.5623 22.8492 19.8775 22.9438C20.2241 23.0068 20.4763 23.1013 20.6653 23.1644C20.9175 23.2274 21.012 23.2589 21.012 23.2589Z" fill="#787E76" />
                                                                <path d="M19.6256 20.8004C19.6256 20.8004 19.5941 20.4538 19.6571 19.918C19.6886 19.6659 19.7202 19.3507 19.8147 19.0671C19.8462 18.9095 19.9092 18.752 19.9408 18.5944C19.9723 18.4368 20.0668 18.2792 20.0983 18.1217C20.1614 17.9641 20.2244 17.8065 20.2874 17.6489C20.3504 17.4914 20.445 17.3653 20.508 17.2077C20.6656 16.9241 20.8232 16.672 20.9807 16.4514C21.1068 16.2308 21.2644 16.0417 21.3274 15.9156C21.4219 15.7896 21.4535 15.7266 21.4535 15.7266C21.4535 15.7266 21.3904 15.7896 21.2644 15.8841C21.1383 15.9787 20.9807 16.1363 20.7917 16.3253C20.6026 16.5144 20.4135 16.7665 20.2244 17.0502C20.1298 17.2077 20.0353 17.3338 19.9723 17.4914C19.9092 17.6489 19.8147 17.8065 19.7517 17.9956C19.6886 18.1532 19.6256 18.3423 19.5941 18.4998C19.5626 18.6574 19.4996 18.8465 19.4996 19.0041C19.4365 19.3507 19.4365 19.6659 19.4365 19.918C19.4996 20.4853 19.6256 20.8004 19.6256 20.8004Z" fill="#787E76" />
                                                                <path d="M18.5851 19.4454C18.5851 19.4454 18.2699 19.2248 17.7657 18.9727C17.23 18.7521 16.5051 18.563 15.7173 18.5C15.5282 18.5 15.3391 18.5 15.15 18.5C14.9609 18.5 14.7718 18.5315 14.6142 18.5315C14.4252 18.563 14.2676 18.5945 14.11 18.6261C13.9524 18.6576 13.7949 18.6891 13.6688 18.7521C13.5427 18.7836 13.4167 18.8152 13.2906 18.8782C13.1961 18.9097 13.1015 18.9727 13.007 19.0042C12.8494 19.0673 12.7549 19.0988 12.7549 19.0988C12.7549 19.0988 12.8494 19.0988 13.007 19.0673C13.1015 19.0673 13.1961 19.0358 13.2906 19.0042C13.4167 18.9727 13.5427 18.9727 13.6688 18.9412C13.7949 18.9097 13.9524 18.9097 14.11 18.8782C14.2676 18.8782 14.4252 18.8467 14.6142 18.8467C14.9609 18.8467 15.3391 18.8151 15.6857 18.8467C16.0639 18.8782 16.4106 18.9097 16.7572 18.9727C17.1039 19.0357 17.419 19.0988 17.6712 19.1618C18.2384 19.3194 18.5851 19.4454 18.5851 19.4454Z" fill="#787E76" />
                                                                <path d="M16.4112 16.9875C16.4112 16.9875 16.3796 16.7354 16.3796 16.3572C16.3481 15.979 16.3166 15.4748 16.3166 14.9705C16.3166 14.4663 16.3481 13.9621 16.3796 13.6154C16.3796 13.4263 16.4112 13.2688 16.4112 13.1427C16.4112 13.0166 16.4112 12.9536 16.4112 12.9536C16.4112 12.9536 16.3796 13.0166 16.3481 13.1112C16.3166 13.2057 16.2221 13.3633 16.1905 13.5524C16.1275 13.7415 16.096 13.9621 16.0645 14.2142C16.033 14.4663 16.0015 14.7184 16.0015 14.9705C16.0015 15.4748 16.096 16.0105 16.1905 16.3887C16.2851 16.7354 16.4112 16.9875 16.4112 16.9875Z" fill="#787E76" />
                                                                <path d="M15.6555 16.1678C15.6555 16.1678 15.4349 15.9472 14.9937 15.7266C14.7731 15.6006 14.5524 15.4745 14.2688 15.3799C13.9852 15.2539 13.7016 15.1909 13.3864 15.0963C13.0713 15.0333 12.7561 14.9703 12.4725 14.9387C12.1888 14.9072 11.9052 14.9072 11.6531 14.9072C11.401 14.9072 11.2119 14.9387 11.0858 14.9387C10.9598 14.9703 10.8652 14.9703 10.8652 14.9703C10.8652 14.9703 10.9283 14.9703 11.0858 15.0018C11.2119 15.0018 11.401 15.0333 11.6531 15.0648C12.1258 15.1278 12.7246 15.2224 13.3234 15.3799C13.607 15.443 13.9222 15.5375 14.2058 15.6005C14.4894 15.6951 14.7415 15.7581 14.9621 15.8527C15.3718 16.0418 15.6555 16.1678 15.6555 16.1678Z" fill="#787E76" />
                                                                <path d="M22.052 25.4017C22.052 25.4017 21.6108 25.3071 20.9175 25.3071C20.5708 25.3071 20.1927 25.3386 19.7514 25.4017C19.5308 25.4332 19.3102 25.4962 19.1212 25.5592C18.9006 25.6223 18.6799 25.6853 18.4909 25.7798C18.2703 25.8744 18.0812 25.9689 17.8606 26.0635C17.64 26.158 17.4824 26.2841 17.2933 26.4101C17.1042 26.5047 16.9466 26.6623 16.7891 26.7883C16.6315 26.9144 16.5054 27.0404 16.3794 27.1665C16.2533 27.2926 16.1588 27.3871 16.0642 27.5132C15.9697 27.6392 15.9067 27.7338 15.8436 27.7968C15.7176 27.9544 15.6545 28.0489 15.6545 28.0489C15.6545 28.0489 15.7491 27.9859 15.8751 27.8283C15.9382 27.7653 16.0327 27.6707 16.1273 27.5762C16.2218 27.4816 16.3479 27.3871 16.4739 27.2925C16.6 27.1665 16.726 27.0719 16.8836 26.9774C17.0412 26.8829 17.1988 26.7568 17.3878 26.6623C17.5769 26.5677 17.7345 26.4417 17.9551 26.3786C18.1442 26.2841 18.3333 26.1895 18.5539 26.1265C18.9636 25.9689 19.3733 25.8429 19.783 25.7483C19.9721 25.7168 20.1927 25.6538 20.3502 25.6223C20.5393 25.5908 20.7284 25.5592 20.886 25.5277C21.2011 25.4962 21.4848 25.4647 21.6738 25.4647C21.926 25.4017 22.052 25.4017 22.052 25.4017Z" fill="#787E76" />
                                                                <path d="M31.0038 24.519C31.0038 24.519 26.5287 32.051 25.6147 44.8145" stroke="#787E76" stroke-miterlimit="10" />
                                                                <path d="M34.1543 30.8852C36.9906 29.53 34.9107 26.0634 36.5494 26.1265C38.2197 26.158 37.0222 22.8174 38.1252 21.4308C39.2282 20.0441 39.3227 14.7812 38.0306 15.8842C36.7385 17.0187 35.3834 15.7581 33.524 17.3024C31.6647 18.8466 30.3411 17.649 29.6477 19.0042C28.9544 20.3593 27.2211 20.3593 26.4648 20.9581C25.7084 21.5568 23.9121 25.4016 25.5193 27.4816C27.1266 29.5616 29.5532 27.4816 29.5532 27.4816C29.6162 28.7107 31.318 32.2403 34.1543 30.8852Z" fill="#DAFFD0" />
                                                                <path d="M38.5039 16.3569C38.5039 16.3569 38.3463 16.5145 38.0627 16.7666C37.779 17.0187 37.3693 17.4284 36.8966 17.9012C36.4239 18.3739 35.8566 18.9411 35.2894 19.5714C34.7221 20.1702 34.1233 20.8635 33.5245 21.5569C33.2094 21.9035 32.9573 22.2502 32.6736 22.5968C32.39 22.9435 32.1379 23.2902 31.8858 23.6368C31.6337 23.9835 31.4131 24.2986 31.1925 24.6453C30.9719 24.9604 30.7828 25.2756 30.5937 25.5592C30.4361 25.8428 30.2785 26.1265 30.1525 26.3471C29.9949 26.5677 29.9319 26.7883 29.8373 26.9774C29.6798 27.324 29.5852 27.5446 29.5852 27.5446C29.5852 27.5446 29.6797 27.324 29.8058 26.9774C29.8688 26.7883 29.9634 26.5677 30.0894 26.3156C30.2155 26.0634 30.3416 25.7798 30.4991 25.4962C30.6567 25.2126 30.8458 24.8974 31.0664 24.5507C31.287 24.2356 31.5076 23.8889 31.7597 23.5423C32.0118 23.1956 32.264 22.849 32.5476 22.5023C32.8312 22.1556 33.0833 21.7774 33.3985 21.4623C33.9973 20.769 34.596 20.1072 35.1948 19.5084C35.4784 19.1933 35.7936 18.9096 36.0457 18.6575C36.3293 18.4054 36.5815 18.1533 36.8336 17.9012C37.3378 17.4284 37.779 17.0818 38.0627 16.8297C38.3148 16.483 38.5039 16.3569 38.5039 16.3569Z" fill="#787E76" />
                                                                <path d="M29.9004 26.6621C29.9004 26.6621 29.8689 26.5676 29.8374 26.41C29.8059 26.2524 29.7113 26.0318 29.6483 25.7482C29.5538 25.4961 29.4592 25.1809 29.3332 24.8658C29.2701 24.7082 29.2071 24.5506 29.1126 24.3615C29.0495 24.204 28.955 24.0464 28.8604 23.8573C28.7659 23.6997 28.6714 23.5422 28.5768 23.3846C28.4823 23.227 28.3877 23.101 28.2617 22.9434C28.1356 22.8173 28.0411 22.6913 27.9465 22.5652C27.8205 22.4707 27.7259 22.3446 27.6314 22.2816C27.5053 22.2186 27.4108 22.124 27.3162 22.061C27.2217 21.9979 27.1271 21.9664 27.0641 21.9034C26.9065 21.8089 26.8435 21.7773 26.8435 21.7773C26.8435 21.7773 26.9381 21.8089 27.0956 21.8719C27.1587 21.9034 27.2847 21.9349 27.3793 21.9664C27.4738 22.0295 27.5999 22.0925 27.7259 22.1555C27.852 22.2186 27.978 22.3446 28.1041 22.4392C28.2302 22.5337 28.3562 22.6598 28.4823 22.7858C28.6083 22.9119 28.7029 23.0694 28.8289 23.227C28.9235 23.3846 29.0495 23.5422 29.1126 23.6997C29.3016 24.0464 29.4592 24.3931 29.5538 24.7082C29.6798 25.0549 29.7429 25.37 29.8059 25.6537C29.9004 26.2839 29.9004 26.6621 29.9004 26.6621Z" fill="#787E76" />
                                                                <path d="M30.4363 25.6536C30.4363 25.6536 30.7514 25.4645 31.2557 25.2754C31.5078 25.1809 31.8229 25.0863 32.1381 25.0233C32.2956 24.9918 32.4847 24.9603 32.6423 24.9287C32.8314 24.8972 32.989 24.8972 33.1781 24.8657C33.3671 24.8657 33.5247 24.8657 33.7138 24.8657C33.9029 24.8657 34.0605 24.8972 34.218 24.8972C34.3756 24.8972 34.5332 24.9287 34.6908 24.9603C34.8483 24.9918 34.9744 25.0233 35.132 25.0548C35.3841 25.1178 35.6047 25.1809 35.7623 25.2124C35.9198 25.2754 35.9829 25.2754 35.9829 25.2754C35.9829 25.2754 35.8883 25.2754 35.7307 25.2439C35.6677 25.2439 35.5732 25.2124 35.4471 25.2124C35.3526 25.1809 35.2265 25.1809 35.1005 25.1809C34.9744 25.1809 34.8168 25.1494 34.6908 25.1494C34.5332 25.1494 34.3756 25.1178 34.218 25.1178C33.9029 25.1178 33.5247 25.1178 33.1781 25.1178C32.989 25.1178 32.8314 25.1178 32.6423 25.1494C32.4847 25.1809 32.2956 25.1809 32.1381 25.2124C31.8229 25.2439 31.5078 25.3069 31.2557 25.3699C31.0035 25.433 30.7829 25.496 30.6254 25.5275C30.4993 25.6221 30.4363 25.6536 30.4363 25.6536Z" fill="#787E76" />
                                                                <path d="M31.5082 23.7628C31.5082 23.7628 31.5398 23.4792 31.4767 23.101C31.4452 22.9119 31.4137 22.6598 31.3507 22.4392C31.3192 22.3132 31.2876 22.1871 31.2561 22.061C31.2246 21.935 31.1616 21.8089 31.1301 21.6829C31.067 21.5568 31.0355 21.4308 30.9725 21.3047C30.9095 21.1786 30.8464 21.0841 30.8149 20.958C30.6889 20.7374 30.5628 20.5483 30.4683 20.3593C30.3737 20.2017 30.2477 20.0441 30.1846 19.9496C30.1216 19.855 30.0901 19.792 30.0901 19.792C30.0901 19.792 30.1531 19.8235 30.2477 19.918C30.3422 20.0126 30.4683 20.1071 30.5943 20.2647C30.7519 20.4223 30.878 20.6114 31.0355 20.832C31.0986 20.958 31.1616 21.0526 31.2246 21.1786C31.2876 21.3047 31.3507 21.4308 31.3822 21.5568C31.4137 21.6829 31.4767 21.8089 31.5082 21.9665C31.5398 22.0926 31.5713 22.2186 31.6028 22.3447C31.6343 22.5968 31.6658 22.8489 31.6343 23.0695C31.6028 23.4792 31.5082 23.7628 31.5082 23.7628Z" fill="#787E76" />
                                                                <path d="M32.2957 22.6914C32.2957 22.6914 32.5163 22.5023 32.9259 22.3447C33.3356 22.1556 33.9029 22.0296 34.5017 21.998C34.6593 21.998 34.7853 21.998 34.9429 21.998C35.1005 21.998 35.2265 22.0296 35.3841 22.0296C35.5102 22.0296 35.6677 22.0611 35.7623 22.0926C35.8883 22.1241 36.0144 22.1556 36.1089 22.1871C36.2035 22.2187 36.298 22.2502 36.3926 22.2817C36.4871 22.3132 36.5501 22.3447 36.6132 22.3762C36.7392 22.4392 36.8023 22.4708 36.8023 22.4708C36.8023 22.4708 36.7392 22.4708 36.6132 22.4393C36.5501 22.4393 36.4871 22.4077 36.3926 22.4077C36.298 22.3762 36.2035 22.3762 36.1089 22.3762C36.0144 22.3762 35.8883 22.3447 35.7623 22.3447C35.6362 22.3447 35.5102 22.3132 35.3841 22.3132C35.132 22.3132 34.8483 22.2817 34.5647 22.3132C34.2811 22.3132 33.9974 22.3447 33.7453 22.4077C33.4932 22.4392 33.2411 22.5023 33.0205 22.5653C32.5793 22.5968 32.2957 22.6914 32.2957 22.6914Z" fill="#787E76" />
                                                                <path d="M33.9978 20.7689C33.9978 20.7689 33.9978 20.5798 34.0293 20.2646C34.0608 19.981 34.0608 19.5713 34.0608 19.1932C34.0608 18.815 34.0608 18.4368 34.0293 18.1216C34.0293 17.9641 33.9978 17.838 33.9978 17.775C33.9978 17.6804 33.9978 17.6489 33.9978 17.6489C33.9978 17.6489 34.0293 17.6804 34.0608 17.775C34.0923 17.8695 34.1554 17.9641 34.1869 18.1216C34.2184 18.2792 34.2814 18.4368 34.2814 18.6259C34.313 18.815 34.3129 19.0041 34.3129 19.2247C34.3129 19.6343 34.2499 20.0125 34.1554 20.2962C34.0923 20.6113 33.9978 20.7689 33.9978 20.7689Z" fill="#787E76" />
                                                                <path d="M34.5647 20.1388C34.5647 20.1388 34.7538 19.9813 35.0689 19.7922C35.2265 19.6976 35.4156 19.6031 35.6362 19.5086C35.8568 19.414 36.0774 19.351 36.3295 19.2879C36.5816 19.2249 36.8022 19.1934 37.0544 19.1619C37.275 19.1304 37.4956 19.1304 37.6846 19.1304C37.8737 19.1304 38.0313 19.1619 38.1259 19.1619C38.2204 19.1619 38.2834 19.1934 38.2834 19.1934C38.2834 19.1934 38.2204 19.1934 38.1259 19.2249C38.0313 19.2249 37.8737 19.2564 37.6846 19.2879C37.338 19.351 36.8653 19.414 36.3925 19.5401C36.1719 19.6031 35.9198 19.6661 35.7307 19.7291C35.5101 19.7922 35.321 19.8552 35.1635 19.9182C34.7853 20.0443 34.5647 20.1388 34.5647 20.1388Z" fill="#787E76" />
                                                                <path d="M29.6174 27.2926C29.6174 27.2926 29.9641 27.1981 30.4998 27.2296C30.752 27.2296 31.0671 27.2611 31.3822 27.3241C31.5398 27.3556 31.6974 27.3871 31.8865 27.4502C32.0441 27.5132 32.2331 27.5447 32.3907 27.6077C32.5483 27.6708 32.7059 27.7338 32.8634 27.8284C33.021 27.8914 33.1786 27.9859 33.3046 28.0805C33.4622 28.175 33.5568 28.2696 33.6828 28.3641C33.8089 28.4586 33.9034 28.5532 33.998 28.6477C34.0925 28.7423 34.1871 28.8368 34.2501 28.8998C34.3131 28.9944 34.3761 29.0574 34.4077 29.1205C34.5022 29.2465 34.5337 29.3095 34.5337 29.3095C34.5337 29.3095 34.4707 29.2465 34.3761 29.152C34.3131 29.0889 34.2501 29.0259 34.1871 28.9629C34.124 28.8999 33.998 28.8368 33.9034 28.7423C33.8089 28.6477 33.7143 28.5847 33.5883 28.4902C33.4622 28.3956 33.3362 28.3326 33.2101 28.238C33.084 28.1435 32.9265 28.0805 32.7689 28.0174C32.6113 27.9544 32.4538 27.8599 32.2962 27.8284C31.981 27.7023 31.6659 27.6078 31.3507 27.5447C31.1932 27.5132 31.0356 27.4817 30.9095 27.4502C30.752 27.4187 30.6259 27.3871 30.4998 27.3871C30.2477 27.3556 30.0271 27.3241 29.8695 27.3241C29.712 27.2926 29.6174 27.2926 29.6174 27.2926Z" fill="#787E76" />
                                                                <path d="M35.9816 38.0391H16.9783V40.5602H35.9816V38.0391Z" fill="#DAFFD0" />
                                                                <path d="M32.8927 54.1114H20.0978L18.4275 40.5601H34.563L32.8927 54.1114Z" fill="#80BE4F" />
                                                            </svg>
                                                            <p className='text-dark fw-600 fs-6 mt-3 mb-0'>No notes</p>
                                                            <p className='text-custom-grey fw-600 fs-6 mb-3'>Looks like you haven't added any notes yet.</p>
                                                        </div>
                                                    }
                                                    <div className='mt-3 text-center w-100 mb-3'>
                                                        <hr />
                                                        <Button className='bg-none text-green fs-6 fw-600 border-0 mb-3' onClick={() => { setNote(initialNote); setShowNotesModal(true) }}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 17" fill="none">
                                                            <path d="M15 6.96137V10.6705H9.23864V16.8159H5.76136V10.6705H0V6.96137H5.76136V0.815918H9.23864V6.96137H15Z" fill="#81C524" />
                                                        </svg>Add Notes</Button>
                                                    </div>
                                                </div>
                                            </Tab>
                                        </Tabs>
                                    </div>
                                </div>

                            </div>
                        </Col>
                        <Col xxl={5} lg={12}>
                            <div className='bg-white shadow rounded h-xl-auto position-relative'>
                                <div className='px-1 py-3'>
                                    <div className='profile-tab mt-3'>
                                        <Tabs
                                            defaultActiveKey="ingredients"
                                            id="justify-tab-example"
                                            className="mb-3"
                                        >
                                            <Tab eventkey="ingredients" title="Ingredients">
                                                <div className='px-4'>
                                                    {
                                                        recipe?.ingredients && recipe?.ingredients.length > 0
                                                            ?
                                                            recipe?.ingredients.map((item, i) => (
                                                                <div className='direction-tabgrid mt-4'>
                                                                    <span className='d-inline'>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="22" viewBox="0 0 10 22" fill="none">
                                                                            <circle cx="2" cy="2" r="2" fill="#BAC8A8" />
                                                                            <circle cx="8" cy="2" r="2" fill="#BAC8A8" />
                                                                            <circle cx="2" cy="14" r="2" fill="#BAC8A8" />
                                                                            <circle cx="8" cy="14" r="2" fill="#BAC8A8" />
                                                                            <circle cx="2" cy="8" r="2" fill="#BAC8A8" />
                                                                            <circle cx="8" cy="8" r="2" fill="#BAC8A8" />
                                                                            <circle cx="2" cy="20" r="2" fill="#BAC8A8" />
                                                                            <circle cx="8" cy="20" r="2" fill="#BAC8A8" />
                                                                        </svg>
                                                                    </span>
                                                                    <div>
                                                                        <h4 className='text-dark mb-1 fw-600 fs-15'>{item?.quantity + " " + item?.unit}</h4>
                                                                        <p className=' text-custom-grey fw-600 fs-15 mb-0'>{item?.ingredientName}</p>
                                                                    </div>
                                                                    <div>
                                                                        <ButtonGroup size="sm">
                                                                            <Button className='bg-none border-0 text-custom-grey fs-15 py-0' onClick={() => { setShowIngredientModal(true); setSelectedIngredient(item); setSelectedIngredientIndex(i) }}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                                <path d="M13.3603 2.23128L11.7687 0.639685C11.3585 0.230044 10.8025 0 10.2227 0C9.64305 0 9.08707 0.230063 8.67684 0.639685L7.51588 1.80051L0.944086 8.3723C0.939318 8.37707 0.937851 8.38367 0.933206 8.38868C0.874285 8.45029 0.826855 8.52181 0.79287 8.60004C0.784924 8.61825 0.781868 8.63671 0.775511 8.65542C0.760598 8.69221 0.74874 8.73011 0.740183 8.76886L0.0100253 13.15H0.00990281C-0.0253032 13.3617 0.0343514 13.5782 0.173096 13.7418C0.311842 13.9055 0.515612 14 0.730166 14C0.77026 13.9999 0.810357 13.9965 0.849963 13.99L5.23116 13.2598C5.26991 13.2511 5.30781 13.2393 5.34448 13.2244C5.36306 13.218 5.38176 13.215 5.39986 13.2071H5.39998C5.47809 13.1732 5.5496 13.1256 5.61121 13.0668C5.6161 13.0622 5.6227 13.0607 5.62759 13.0559L13.3604 5.32311C13.7699 4.91288 14 4.3569 14 3.77712C14 3.19745 13.7699 2.64148 13.3604 2.23124L13.3603 2.23128ZM1.6187 12.3812L1.94741 10.4081L3.59183 12.0525L1.6187 12.3812ZM12.3279 4.29044L11.6833 4.93504L9.06485 2.31671L9.70945 1.67211V1.67199C9.84588 1.53642 10.0305 1.46027 10.2229 1.46027C10.4153 1.46027 10.5999 1.53642 10.7363 1.67199L12.3279 3.26358C12.4638 3.39989 12.5402 3.58448 12.5402 3.777C12.5402 3.96952 12.4638 4.15412 12.3279 4.29041L12.3279 4.29044Z" fill="#26BAFA" />
                                                                            </svg>Edit</Button>
                                                                            <div className='vr mx-1'></div>
                                                                            <Button className='bg-none border-0 text-custom-grey fs-15 py-0' onClick={() => handleIngredientDelete(i)}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                                                                                <path d="M1.98088 2.67757V2.67778V2.67757ZM6.88975 0L5.45688 0.000508323V0.000711673H5.45617C4.9636 0.000711673 4.56446 0.406291 4.56446 0.906433V0.992348L0.443616 0.99245C0.19868 0.99245 0 1.19407 0 1.44288V2.23634C0 2.48513 0.198672 2.68676 0.443616 2.68676H0.973544V2.68707L11.3729 2.68717L11.373 2.68697V2.68717H11.3791L11.903 2.68697C12.0206 2.68697 12.1334 2.63948 12.2166 2.55509C12.2998 2.4706 12.3466 2.35602 12.3466 2.23655V1.44257C12.3466 1.32311 12.2998 1.20862 12.2166 1.12414C12.1334 1.03965 12.0206 0.992166 11.903 0.992166L7.78213 0.992268V0.906251C7.78213 0.665892 7.6881 0.435392 7.52068 0.265398C7.35335 0.095501 7.12633 3.55961e-05 6.88962 3.55961e-05L6.88975 0ZM6.38725 4.45898C6.55117 4.45918 6.68395 4.5941 6.68395 4.76055L6.68415 11.2794C6.68415 11.3595 6.65281 11.4362 6.59713 11.4927C6.54136 11.5494 6.46585 11.5811 6.38704 11.5814L5.95966 11.5811V11.5814C5.88085 11.5811 5.80535 11.5494 5.74957 11.4927C5.69389 11.4362 5.66255 11.3595 5.66255 11.2794L5.66275 4.76055C5.66275 4.59441 5.79513 4.4596 5.95866 4.4596L5.95906 4.45991L5.96156 4.4593L5.96196 4.4592L6.38645 4.45899L6.38725 4.45898ZM3.72146 4.44749L3.71555 4.45349V4.45369H3.71595C3.87516 4.45369 4.00675 4.5819 4.01226 4.74469L4.23427 11.2597C4.23697 11.3397 4.20833 11.4175 4.15456 11.4759L4.15446 11.476C4.10068 11.5345 4.02628 11.5689 3.94758 11.5716L3.52039 11.5866C3.51779 11.5867 3.51278 11.5868 3.51018 11.5868C3.43508 11.5868 3.36258 11.5579 3.3075 11.5056C3.24982 11.4511 3.21598 11.3755 3.21327 11.2956L2.99177 4.78058C2.98606 4.61404 3.11444 4.47443 3.27837 4.46866L3.70514 4.45371V4.45391C3.70665 4.45371 3.70795 4.45361 3.70925 4.45361C3.71105 4.45361 3.71296 4.45371 3.71436 4.45391L3.71476 4.45351L3.72146 4.44749ZM8.63442 4.45349C8.63683 4.45359 8.63933 4.45359 8.64143 4.45369V4.45389L9.0682 4.46864C9.23213 4.47443 9.3605 4.61403 9.35481 4.78056L9.1333 11.2955C9.1306 11.3755 9.09675 11.4511 9.03917 11.5056C8.9841 11.5579 8.9115 11.5867 8.8364 11.5867C8.83379 11.5867 8.82878 11.5866 8.82618 11.5865L8.399 11.5716V11.5718C8.32029 11.5689 8.24579 11.5344 8.19211 11.4759C8.13834 11.4175 8.1096 11.3396 8.1124 11.2597L8.33431 4.74467C8.33982 4.5822 8.47099 4.45419 8.6298 4.45419L8.6302 4.4544L8.63261 4.45379L8.63351 4.45358V4.45348L8.63442 4.45349ZM1.00978 3.34807L1.43465 11.1005L1.43565 11.1146C1.4723 11.5605 1.50455 12.366 2.03977 12.8064V12.8066C2.53786 13.2162 3.38031 13.2097 3.91805 13.2221L3.92937 13.2222L5.27011 13.2228L5.26931 13.223C5.27792 13.2232 5.28653 13.2234 5.29524 13.2234L5.29544 13.2237L6.16652 13.2231L7.05042 13.2235L7.05062 13.2237C7.05903 13.2235 7.06745 13.2233 7.07576 13.2229H7.07656L7.07586 13.2231L8.4165 13.2224L8.42781 13.2222C8.96556 13.2098 9.808 13.2164 10.3061 12.8069V12.8066C10.8413 12.3663 10.8737 11.5609 10.9103 11.1149L10.9113 11.1008L11.3366 3.34839L1.00978 3.34807Z" fill="#FF6161" />
                                                                            </svg>Delete</Button>
                                                                        </ButtonGroup>
                                                                    </div>
                                                                </div>

                                                            ))
                                                            :
                                                            <div className='text-center'>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="114" height="60" viewBox="0 0 114 60" fill="none">
                                                                    <path d="M19.9998 24C19.9998 24 23.5609 29.5466 25.4833 44.0748" stroke="#787E76" stroke-miterlimit="10" />
                                                                    <ellipse cx="56.9473" cy="57.3726" rx="56.9473" ry="1.81747" fill="#E9EBE7" />
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M98.1147 56.3778C98.1147 56.3778 95.3098 53.4469 96.5704 47.8688C96.5704 47.8688 94.8056 44.1186 97.4844 41.3768C97.4844 41.3768 96.7595 36.9963 100.352 35.0108C100.352 35.0108 100.636 32.3006 102.905 30V56.3463H98.1147V56.3778Z" fill="#DAFFD0" />
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M107.727 56.3778C107.727 56.3778 110.532 53.4469 109.271 47.8688C109.271 47.8688 111.036 44.1186 108.357 41.3768C108.357 41.3768 109.082 36.9963 105.489 35.0108C105.489 35.0108 105.206 32.3006 102.937 30V56.3463H107.727V56.3778Z" fill="#B8F5A8" />
                                                                    <path d="M87.5336 3.92288C88.308 2.76296 87.9952 1.19922 86.8349 0.425213C85.675 -0.349162 84.1112 -0.0364127 83.3372 1.12393L72.3191 17.6542H78.3765L87.5336 3.92288Z" fill="#CDD4C4" />
                                                                    <path d="M95.5239 45.3939H87.9582V37.8286H82.9147V45.3939H75.3494V50.4374H82.9147V58.0027H87.9582V50.4374H95.5239V45.3939Z" fill="#CDD4C4" />
                                                                    <path d="M55.1741 48.6789V55.4804H70.9027C69.7201 53.216 69.0441 50.646 69.0441 47.9151C69.0441 38.8618 76.3825 31.5236 85.4356 31.5236C87.9954 31.5236 90.4088 32.1264 92.5671 33.1727C94.4484 29.2365 95.523 24.8359 95.523 20.1753H35C35 33.3467 43.4306 44.5202 55.175 48.6786L55.1741 48.6789Z" fill="#CDD4C4" />
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M34.2539 59.0118C34.2539 59.0118 32.584 57.2668 33.3345 53.9456C33.3345 53.9456 32.2837 51.7127 33.8786 50.0803C33.8786 50.0803 33.4471 47.4722 35.5861 46.2901C35.5861 46.2901 35.755 44.6764 37.106 43.3066V58.993H34.2539V59.0118Z" fill="#8DF570" />
                                                                    <path fillRule="evenodd" clipRule="evenodd" d="M39.9778 59.0118C39.9778 59.0118 41.6478 57.2668 40.8972 53.9456C40.8972 53.9456 41.948 51.7127 40.3531 50.0803C40.3531 50.0803 40.7846 47.4722 38.6456 46.2901C38.6456 46.2901 38.4767 44.6764 37.1257 43.3066V58.993H39.9778V59.0118Z" fill="#B8F5A8" />
                                                                    <path d="M18.145 27.2342C18.145 27.2342 21.2965 29.9445 23.3449 27.2342C25.4249 24.524 23.0928 19.6077 22.1158 18.8198C21.1389 18.032 18.9013 18.032 18.0189 16.2671C17.105 14.5023 15.3717 16.0465 13.0081 14.0611C10.613 12.0757 8.84817 13.6514 7.20941 12.2018C5.57064 10.7521 5.66519 17.5277 7.08335 19.3556C8.50151 21.1519 6.9888 25.4694 9.10029 25.4379C11.2433 25.3749 8.56454 29.85 12.2202 31.6148C15.8444 33.3481 18.0505 28.7469 18.145 27.2342Z" fill="#CCFFCE" />
                                                                    <path d="M6.57837 12.8008C6.57837 12.8008 6.79897 12.9899 7.17715 13.3365C7.55532 13.6832 8.05956 14.1874 8.68985 14.8177C9.32014 15.448 10.0135 16.1729 10.7698 16.9607C11.5262 17.7486 12.2825 18.631 13.0389 19.5134C13.417 19.9546 13.7637 20.3958 14.1419 20.837C14.4885 21.2782 14.8352 21.751 15.1504 22.1606C15.4655 22.6018 15.7807 23.043 16.0643 23.4527C16.3479 23.8624 16.6 24.2721 16.8206 24.6503C17.0412 25.0285 17.2303 25.3751 17.4194 25.6903C17.6085 26.0054 17.7346 26.2891 17.8291 26.5097C18.0497 26.9824 18.1758 27.2345 18.1758 27.2345C18.1758 27.2345 18.0812 26.9509 17.8921 26.4781C17.7976 26.226 17.703 25.9424 17.5455 25.6273C17.3879 25.3121 17.2303 24.9339 17.0097 24.5557C16.7891 24.1776 16.537 23.7679 16.2849 23.3267C16.0013 22.917 15.7176 22.4443 15.4025 22.0031C15.0873 21.5619 14.7407 21.0891 14.394 20.6479C14.0473 20.2067 13.6692 19.734 13.291 19.2928C12.5346 18.4104 11.7468 17.528 10.9904 16.7401C10.6122 16.3304 10.2341 15.9838 9.88741 15.6371C9.50923 15.2904 9.16257 14.9753 8.84742 14.6601C8.21713 14.0614 7.64987 13.5886 7.24018 13.2735C6.83049 12.9584 6.57837 12.8008 6.57837 12.8008Z" fill="#787E76" />
                                                                    <path d="M17.6719 26.0998C17.6719 26.0998 17.7034 25.9737 17.7664 25.7846C17.8294 25.564 17.924 25.2804 18.0185 24.9337C18.1131 24.5871 18.2707 24.2089 18.4282 23.7677C18.5228 23.5471 18.6173 23.358 18.7119 23.1374C18.8064 22.9168 18.9325 22.7277 19.027 22.5071C19.1215 22.2865 19.2791 22.0974 19.3737 21.9083C19.4997 21.7192 19.6258 21.5301 19.7834 21.3411C19.9409 21.1835 20.067 20.9944 20.193 20.8683C20.3506 20.7423 20.4767 20.5847 20.6027 20.4902C20.7603 20.3956 20.8864 20.3011 20.9809 20.2065C21.107 20.112 21.233 20.0805 21.2961 20.0174C21.4851 19.9229 21.5797 19.8599 21.5797 19.8599C21.5797 19.8599 21.4536 19.8914 21.2645 19.9544C21.17 19.9859 21.0439 20.0174 20.9179 20.0805C20.7918 20.1435 20.6343 20.238 20.4767 20.3326C20.3191 20.4271 20.1615 20.5532 20.004 20.6792C19.8464 20.8053 19.6888 20.9944 19.5312 21.152C19.3737 21.3411 19.2476 21.5301 19.09 21.7192C18.964 21.9398 18.8064 22.1289 18.7119 22.3495C18.4913 22.7907 18.2707 23.2319 18.1446 23.6731C17.987 24.1143 17.8925 24.524 17.8294 24.8707C17.7034 25.627 17.6719 26.0998 17.6719 26.0998Z" fill="#787E76" />
                                                                    <path d="M17.0096 24.8077C17.0096 24.8077 16.6314 24.5556 15.9696 24.335C15.6544 24.2405 15.2447 24.1144 14.8351 24.0199C14.6145 23.9884 14.3938 23.9253 14.1732 23.9253C13.9526 23.8938 13.7005 23.8938 13.4799 23.8623C13.2593 23.8623 13.0072 23.8623 12.7866 23.8623C12.566 23.8623 12.3454 23.8938 12.1248 23.8938C11.9042 23.9253 11.7151 23.9568 11.4945 23.9884C11.3054 24.0199 11.1163 24.0514 10.9587 24.0829C10.6121 24.1459 10.3285 24.2405 10.1394 24.3035C9.95028 24.3665 9.82422 24.398 9.82422 24.398C9.82422 24.398 9.95028 24.3981 10.1394 24.3665C10.2339 24.3665 10.36 24.335 10.486 24.3035C10.6121 24.272 10.7697 24.272 10.9587 24.2405C11.1163 24.2405 11.3054 24.209 11.4945 24.1775C11.6836 24.1775 11.9042 24.1459 12.0933 24.1459C12.503 24.1459 12.9757 24.1144 13.4169 24.1459C13.6375 24.1774 13.8581 24.1775 14.0787 24.209C14.2993 24.2405 14.5199 24.2405 14.7405 24.272C15.1502 24.335 15.5599 24.3981 15.875 24.4926C16.2217 24.5556 16.4738 24.6502 16.6629 24.7132C16.915 24.7762 17.0096 24.8077 17.0096 24.8077Z" fill="#787E76" />
                                                                    <path d="M15.6232 22.3492C15.6232 22.3492 15.5917 22.0026 15.6547 21.4668C15.6862 21.2147 15.7177 20.8996 15.8123 20.6159C15.8438 20.4584 15.9068 20.3008 15.9383 20.1432C15.9698 19.9856 16.0644 19.8281 16.0959 19.6705C16.1589 19.5129 16.2219 19.3554 16.285 19.1978C16.348 19.0402 16.4425 18.9141 16.5056 18.7566C16.6632 18.4729 16.8207 18.2208 16.9783 18.0002C17.1044 17.7796 17.2619 17.5905 17.325 17.4645C17.4195 17.3384 17.451 17.2754 17.451 17.2754C17.451 17.2754 17.388 17.3384 17.2619 17.433C17.1359 17.5275 16.9783 17.6851 16.7892 17.8742C16.6001 18.0633 16.411 18.3154 16.2219 18.599C16.1274 18.7566 16.0329 18.8826 15.9698 19.0402C15.9068 19.1978 15.8123 19.3554 15.7492 19.5444C15.6862 19.702 15.6232 19.8911 15.5917 20.0487C15.5601 20.2063 15.4971 20.3953 15.4971 20.5529C15.4341 20.8996 15.4341 21.2147 15.4341 21.4668C15.4971 22.0341 15.6232 22.3492 15.6232 22.3492Z" fill="#787E76" />
                                                                    <path d="M14.5827 20.9943C14.5827 20.9943 14.2675 20.7737 13.7633 20.5215C13.2275 20.3009 12.5027 20.1119 11.7148 20.0488C11.5257 20.0488 11.3366 20.0488 11.1476 20.0488C10.9585 20.0488 10.7694 20.0803 10.6118 20.0803C10.4227 20.1119 10.2651 20.1434 10.1076 20.1749C9.95 20.2064 9.79242 20.2379 9.66636 20.3009C9.54031 20.3325 9.41425 20.364 9.28819 20.427C9.19365 20.4585 9.0991 20.5215 9.00456 20.5531C8.84698 20.6161 8.75244 20.6476 8.75244 20.6476C8.75244 20.6476 8.84698 20.6476 9.00456 20.6161C9.0991 20.6161 9.19365 20.5846 9.28819 20.5531C9.41425 20.5215 9.54031 20.5215 9.66636 20.49C9.79242 20.4585 9.95 20.4585 10.1076 20.427C10.2651 20.427 10.4227 20.3955 10.6118 20.3955C10.9585 20.3955 11.3366 20.364 11.6833 20.3955C12.0615 20.427 12.4081 20.4585 12.7548 20.5215C13.1015 20.5846 13.4166 20.6476 13.6687 20.7106C14.236 20.8682 14.5827 20.9943 14.5827 20.9943Z" fill="#787E76" />
                                                                    <path d="M12.4087 18.5363C12.4087 18.5363 12.3772 18.2842 12.3772 17.906C12.3457 17.5279 12.3142 17.0236 12.3142 16.5194C12.3142 16.0151 12.3457 15.5109 12.3772 15.1643C12.3772 14.9752 12.4087 14.8176 12.4087 14.6915C12.4087 14.5655 12.4087 14.5024 12.4087 14.5024C12.4087 14.5024 12.3772 14.5655 12.3457 14.66C12.3142 14.7546 12.2196 14.9121 12.1881 15.1012C12.1251 15.2903 12.0936 15.5109 12.0621 15.763C12.0305 16.0151 11.999 16.2673 11.999 16.5194C11.999 17.0236 12.0936 17.5594 12.1881 17.9375C12.2827 18.2842 12.4087 18.5363 12.4087 18.5363Z" fill="#787E76" />
                                                                    <path d="M11.653 17.7166C11.653 17.7166 11.4324 17.496 10.9912 17.2754C10.7706 17.1494 10.55 17.0233 10.2664 16.9288C9.98274 16.8027 9.69911 16.7397 9.38397 16.6451C9.06882 16.5821 8.75367 16.5191 8.47004 16.4876C8.18641 16.4561 7.90278 16.4561 7.65066 16.4561C7.39854 16.4561 7.20945 16.4876 7.08339 16.4876C6.95734 16.5191 6.86279 16.5191 6.86279 16.5191C6.86279 16.5191 6.92582 16.5191 7.08339 16.5506C7.20945 16.5506 7.39854 16.5821 7.65066 16.6136C8.12338 16.6767 8.72216 16.7712 9.32094 16.9288C9.60457 16.9918 9.91971 17.0863 10.2033 17.1494C10.487 17.2439 10.7391 17.307 10.9597 17.4015C11.3694 17.5906 11.653 17.7166 11.653 17.7166Z" fill="#787E76" />
                                                                    <path d="M18.0496 26.9505C18.0496 26.9505 17.6084 26.856 16.915 26.856C16.5684 26.856 16.1902 26.8875 15.749 26.9505C15.5284 26.982 15.3078 27.045 15.1187 27.1081C14.8981 27.1711 14.6775 27.2341 14.4884 27.3287C14.2678 27.4232 14.0787 27.5178 13.8581 27.6123C13.6375 27.7069 13.4799 27.8329 13.2909 27.959C13.1018 28.0535 12.9442 28.2111 12.7866 28.3371C12.6291 28.4632 12.503 28.5893 12.3769 28.7153C12.2509 28.8414 12.1563 28.9359 12.0618 29.062C11.9672 29.188 11.9042 29.2826 11.8412 29.3456C11.7151 29.5032 11.6521 29.5977 11.6521 29.5977C11.6521 29.5977 11.7466 29.5347 11.8727 29.3771C11.9357 29.3141 12.0303 29.2196 12.1248 29.125C12.2194 29.0305 12.3454 28.9359 12.4715 28.8414C12.5975 28.7153 12.7236 28.6208 12.8812 28.5262C13.0387 28.4317 13.1963 28.3056 13.3854 28.2111C13.5745 28.1165 13.7321 27.9905 13.9527 27.9275C14.1418 27.8329 14.3308 27.7384 14.5514 27.6753C14.9611 27.5178 15.3708 27.3917 15.7805 27.2972C15.9696 27.2656 16.1902 27.2026 16.3478 27.1711C16.5369 27.1396 16.726 27.1081 16.8835 27.0766C17.1987 27.045 17.4823 27.0135 17.6714 27.0135C17.9235 26.9505 18.0496 26.9505 18.0496 26.9505Z" fill="#787E76" />
                                                                    <path d="M27.0013 26.0679C27.0013 26.0679 22.5262 33.5999 21.6123 46.3633" stroke="#787E76" stroke-miterlimit="10" />
                                                                    <path d="M30.1519 32.434C32.9882 31.0789 30.9082 27.6123 32.547 27.6753C34.2173 27.7068 33.0197 24.3663 34.1227 22.9796C35.2257 21.593 35.3203 16.33 34.0282 17.433C32.7361 18.5676 31.381 17.307 29.5216 18.8512C27.6622 20.3954 26.3386 19.1979 25.6453 20.553C24.952 21.9081 23.2187 21.9081 22.4623 22.5069C21.706 23.1057 19.9096 26.9505 21.5169 29.0304C23.1241 31.1104 25.5507 29.0304 25.5507 29.0304C25.6138 30.2595 27.3156 33.7891 30.1519 32.434Z" fill="#DAFFD0" />
                                                                    <path d="M34.5014 17.9058C34.5014 17.9058 34.3438 18.0633 34.0602 18.3154C33.7766 18.5676 33.3669 18.9773 32.8942 19.45C32.4214 19.9227 31.8542 20.49 31.2869 21.1203C30.7197 21.719 30.1209 22.4124 29.5221 23.1057C29.207 23.4523 28.9548 23.799 28.6712 24.1457C28.3876 24.4923 28.1355 24.839 27.8833 25.1856C27.6312 25.5323 27.4106 25.8475 27.19 26.1941C26.9694 26.5093 26.7803 26.8244 26.5912 27.108C26.4337 27.3917 26.2761 27.6753 26.15 27.8959C25.9925 28.1165 25.9294 28.3371 25.8349 28.5262C25.6773 28.8729 25.5828 29.0935 25.5828 29.0935C25.5828 29.0935 25.6773 28.8729 25.8034 28.5262C25.8664 28.3371 25.9609 28.1165 26.087 27.8644C26.2131 27.6123 26.3391 27.3286 26.4967 27.045C26.6543 26.7614 26.8433 26.4462 27.064 26.0996C27.2846 25.7844 27.5052 25.4378 27.7573 25.0911C28.0094 24.7444 28.2615 24.3978 28.5451 24.0511C28.8288 23.7045 29.0809 23.3263 29.396 23.0111C29.9948 22.3178 30.5936 21.656 31.1924 21.0572C31.476 20.7421 31.7912 20.4584 32.0433 20.2063C32.3269 19.9542 32.579 19.7021 32.8311 19.45C33.3354 18.9773 33.7766 18.6306 34.0602 18.3785C34.3123 18.0318 34.5014 17.9058 34.5014 17.9058Z" fill="#787E76" />
                                                                    <path d="M25.898 28.2109C25.898 28.2109 25.8665 28.1164 25.835 27.9588C25.8034 27.8013 25.7089 27.5807 25.6459 27.297C25.5513 27.0449 25.4568 26.7298 25.3307 26.4146C25.2677 26.257 25.2047 26.0995 25.1101 25.9104C25.0471 25.7528 24.9525 25.5952 24.858 25.4061C24.7635 25.2486 24.6689 25.091 24.5744 24.9334C24.4798 24.7758 24.3853 24.6498 24.2592 24.4922C24.1332 24.3662 24.0386 24.2401 23.9441 24.114C23.818 24.0195 23.7235 23.8934 23.6289 23.8304C23.5029 23.7674 23.4083 23.6728 23.3138 23.6098C23.2192 23.5468 23.1247 23.5153 23.0617 23.4522C22.9041 23.3577 22.8411 23.3262 22.8411 23.3262C22.8411 23.3262 22.9356 23.3577 23.0932 23.4207C23.1562 23.4522 23.2823 23.4837 23.3768 23.5153C23.4714 23.5783 23.5974 23.6413 23.7235 23.7044C23.8495 23.7674 23.9756 23.8934 24.1017 23.988C24.2277 24.0825 24.3538 24.2086 24.4798 24.3346C24.6059 24.4607 24.7004 24.6183 24.8265 24.7758C24.921 24.9334 25.0471 25.091 25.1101 25.2486C25.2992 25.5952 25.4568 25.9419 25.5513 26.257C25.6774 26.6037 25.7404 26.9188 25.8034 27.2025C25.898 27.8328 25.898 28.2109 25.898 28.2109Z" fill="#787E76" />
                                                                    <path d="M26.4338 27.2024C26.4338 27.2024 26.749 27.0133 27.2532 26.8242C27.5053 26.7297 27.8205 26.6352 28.1356 26.5721C28.2932 26.5406 28.4823 26.5091 28.6399 26.4776C28.829 26.4461 28.9865 26.4461 29.1756 26.4146C29.3647 26.4146 29.5223 26.4146 29.7114 26.4146C29.9005 26.4146 30.058 26.4461 30.2156 26.4461C30.3732 26.4461 30.5307 26.4776 30.6883 26.5091C30.8459 26.5406 30.972 26.5721 31.1295 26.6036C31.3816 26.6667 31.6022 26.7297 31.7598 26.7612C31.9174 26.8242 31.9804 26.8242 31.9804 26.8242C31.9804 26.8242 31.8859 26.8242 31.7283 26.7927C31.6653 26.7927 31.5707 26.7612 31.4447 26.7612C31.3501 26.7297 31.2241 26.7297 31.098 26.7297C30.972 26.7297 30.8144 26.6982 30.6883 26.6982C30.5307 26.6982 30.3732 26.6667 30.2156 26.6667C29.9005 26.6667 29.5223 26.6667 29.1756 26.6667C28.9865 26.6667 28.829 26.6667 28.6399 26.6982C28.4823 26.7297 28.2932 26.7297 28.1356 26.7612C27.8205 26.7927 27.5053 26.8557 27.2532 26.9188C27.0011 26.9818 26.7805 27.0448 26.6229 27.0764C26.4969 27.1709 26.4338 27.2024 26.4338 27.2024Z" fill="#787E76" />
                                                                    <path d="M27.5058 25.3117C27.5058 25.3117 27.5373 25.028 27.4743 24.6499C27.4428 24.4608 27.4113 24.2087 27.3482 23.9881C27.3167 23.862 27.2852 23.7359 27.2537 23.6099C27.2222 23.4838 27.1591 23.3578 27.1276 23.2317C27.0646 23.1056 27.0331 22.9796 26.9701 22.8535C26.907 22.7275 26.844 22.6329 26.8125 22.5069C26.6864 22.2863 26.5604 22.0972 26.4658 21.9081C26.3713 21.7505 26.2452 21.5929 26.1822 21.4984C26.1192 21.4038 26.0876 21.3408 26.0876 21.3408C26.0876 21.3408 26.1507 21.3723 26.2452 21.4669C26.3398 21.5614 26.4658 21.656 26.5919 21.8135C26.7495 21.9711 26.8755 22.1602 27.0331 22.3808C27.0961 22.5069 27.1591 22.6014 27.2222 22.7275C27.2852 22.8535 27.3482 22.9796 27.3797 23.1056C27.4113 23.2317 27.4743 23.3578 27.5058 23.5153C27.5373 23.6414 27.5688 23.7675 27.6004 23.8935C27.6319 24.1456 27.6634 24.3977 27.6319 24.6183C27.6003 25.028 27.5058 25.3117 27.5058 25.3117Z" fill="#787E76" />
                                                                    <path d="M28.2932 24.2402C28.2932 24.2402 28.5138 24.0511 28.9235 23.8935C29.3332 23.7045 29.9005 23.5784 30.4992 23.5469C30.6568 23.5469 30.7829 23.5469 30.9404 23.5469C31.098 23.5469 31.2241 23.5784 31.3817 23.5784C31.5077 23.5784 31.6653 23.6099 31.7598 23.6414C31.8859 23.6729 32.0119 23.7045 32.1065 23.736C32.201 23.7675 32.2956 23.799 32.3901 23.8305C32.4847 23.862 32.5477 23.8935 32.6107 23.925C32.7368 23.9881 32.7998 24.0196 32.7998 24.0196C32.7998 24.0196 32.7368 24.0196 32.6107 23.9881C32.5477 23.9881 32.4847 23.9566 32.3901 23.9566C32.2956 23.925 32.201 23.925 32.1065 23.925C32.0119 23.925 31.8859 23.8935 31.7598 23.8935C31.6338 23.8935 31.5077 23.862 31.3817 23.862C31.1295 23.862 30.8459 23.8305 30.5623 23.862C30.2786 23.862 29.995 23.8935 29.7429 23.9566C29.4908 23.9881 29.2387 24.0511 29.0181 24.1141C28.5768 24.1456 28.2932 24.2402 28.2932 24.2402Z" fill="#787E76" />
                                                                    <path d="M29.9954 22.3177C29.9954 22.3177 29.9954 22.1286 30.0269 21.8135C30.0584 21.5298 30.0584 21.1202 30.0584 20.742C30.0584 20.3638 30.0584 19.9856 30.0269 19.6705C30.0269 19.5129 29.9954 19.3868 29.9954 19.3238C29.9954 19.2293 29.9954 19.1978 29.9954 19.1978C29.9954 19.1978 30.0269 19.2293 30.0584 19.3238C30.0899 19.4184 30.1529 19.5129 30.1845 19.6705C30.216 19.828 30.279 19.9856 30.279 20.1747C30.3105 20.3638 30.3105 20.5529 30.3105 20.7735C30.3105 21.1832 30.2475 21.5614 30.1529 21.845C30.0899 22.1601 29.9954 22.3177 29.9954 22.3177Z" fill="#787E76" />
                                                                    <path d="M30.5623 21.6877C30.5623 21.6877 30.7513 21.5301 31.0665 21.341C31.2241 21.2465 31.4131 21.1519 31.6338 21.0574C31.8544 20.9628 32.075 20.8998 32.3271 20.8368C32.5792 20.7737 32.7998 20.7422 33.0519 20.7107C33.2725 20.6792 33.4931 20.6792 33.6822 20.6792C33.8713 20.6792 34.0289 20.7107 34.1234 20.7107C34.218 20.7107 34.281 20.7422 34.281 20.7422C34.281 20.7422 34.218 20.7422 34.1234 20.7737C34.0289 20.7737 33.8713 20.8053 33.6822 20.8368C33.3355 20.8998 32.8628 20.9628 32.3901 21.0889C32.1695 21.1519 31.9174 21.2149 31.7283 21.278C31.5077 21.341 31.3186 21.404 31.161 21.4671C30.7829 21.5931 30.5623 21.6877 30.5623 21.6877Z" fill="#787E76" />
                                                                    <path d="M25.615 28.8414C25.615 28.8414 25.9617 28.7469 26.4974 28.7784C26.7495 28.7784 27.0647 28.8099 27.3798 28.8729C27.5374 28.9045 27.695 28.936 27.884 28.999C28.0416 29.062 28.2307 29.0935 28.3883 29.1566C28.5459 29.2196 28.7034 29.2826 28.861 29.3772C29.0186 29.4402 29.1761 29.5348 29.3022 29.6293C29.4598 29.7238 29.5543 29.8184 29.6804 29.9129C29.8064 30.0075 29.901 30.102 29.9955 30.1966C30.0901 30.2911 30.1846 30.3856 30.2476 30.4487C30.3107 30.5432 30.3737 30.6063 30.4052 30.6693C30.4998 30.7953 30.5313 30.8584 30.5313 30.8584C30.5313 30.8584 30.4682 30.7953 30.3737 30.7008C30.3107 30.6378 30.2476 30.5747 30.1846 30.5117C30.1216 30.4487 29.9955 30.3856 29.901 30.2911C29.8064 30.1966 29.7119 30.1335 29.5858 30.039C29.4598 29.9444 29.3337 29.8814 29.2077 29.7869C29.0816 29.6923 28.924 29.6293 28.7665 29.5663C28.6089 29.5032 28.4513 29.4087 28.2937 29.3772C27.9786 29.2511 27.6634 29.1566 27.3483 29.0936C27.1907 29.062 27.0331 29.0305 26.9071 28.999C26.7495 28.9675 26.6235 28.936 26.4974 28.936C26.2453 28.9045 26.0247 28.8729 25.8671 28.8729C25.7095 28.8414 25.615 28.8414 25.615 28.8414Z" fill="#787E76" />
                                                                    <path d="M31.9792 39.5879H12.9758V42.1091H31.9792V39.5879Z" fill="#DAFFD0" />
                                                                    <path d="M28.8903 55.6602H16.0953L14.425 42.1089H30.5606L28.8903 55.6602Z" fill="#80BE4F" />
                                                                </svg>
                                                                <p className='text-dark fw-600 fs-6 mt-3 mb-0'>No ingredients</p>
                                                                <p className='text-custom-grey fw-600 fs-6 mb-3'>Looks like you haven't added any ingredients yet.</p>
                                                            </div>
                                                    }

                                                </div>

                                                {/* <div className='px-4'>
                                                            <div className='direction-tabgrid mt-4'>
                                                                <span className='d-inline'>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="10" height="22" viewBox="0 0 10 22" fill="none">
                                                                        <circle cx="2" cy="2" r="2" fill="#BAC8A8" />
                                                                        <circle cx="8" cy="2" r="2" fill="#BAC8A8" />
                                                                        <circle cx="2" cy="14" r="2" fill="#BAC8A8" />
                                                                        <circle cx="8" cy="14" r="2" fill="#BAC8A8" />
                                                                        <circle cx="2" cy="8" r="2" fill="#BAC8A8" />
                                                                        <circle cx="8" cy="8" r="2" fill="#BAC8A8" />
                                                                        <circle cx="2" cy="20" r="2" fill="#BAC8A8" />
                                                                        <circle cx="8" cy="20" r="2" fill="#BAC8A8" />
                                                                    </svg>
                                                                </span>
                                                                <div>
                                                                    <h4 className='text-dark mb-1 fw-600 fs-15'>1 tsp</h4>
                                                                    <p className=' text-custom-grey fw-600 fs-15 mb-0'>Sweet Potato (medium, chopped)</p>
                                                                </div>
                                                                <div>
                                                                    <ButtonGroup size="sm">
                                                                        <Button className='bg-none border-0 text-custom-grey fs-15 py-0'><Link to="/" className='text-decoration-none text-custom-grey'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                                            <path d="M13.3603 2.23128L11.7687 0.639685C11.3585 0.230044 10.8025 0 10.2227 0C9.64305 0 9.08707 0.230063 8.67684 0.639685L7.51588 1.80051L0.944086 8.3723C0.939318 8.37707 0.937851 8.38367 0.933206 8.38868C0.874285 8.45029 0.826855 8.52181 0.79287 8.60004C0.784924 8.61825 0.781868 8.63671 0.775511 8.65542C0.760598 8.69221 0.74874 8.73011 0.740183 8.76886L0.0100253 13.15H0.00990281C-0.0253032 13.3617 0.0343514 13.5782 0.173096 13.7418C0.311842 13.9055 0.515612 14 0.730166 14C0.77026 13.9999 0.810357 13.9965 0.849963 13.99L5.23116 13.2598C5.26991 13.2511 5.30781 13.2393 5.34448 13.2244C5.36306 13.218 5.38176 13.215 5.39986 13.2071H5.39998C5.47809 13.1732 5.5496 13.1256 5.61121 13.0668C5.6161 13.0622 5.6227 13.0607 5.62759 13.0559L13.3604 5.32311C13.7699 4.91288 14 4.3569 14 3.77712C14 3.19745 13.7699 2.64148 13.3604 2.23124L13.3603 2.23128ZM1.6187 12.3812L1.94741 10.4081L3.59183 12.0525L1.6187 12.3812ZM12.3279 4.29044L11.6833 4.93504L9.06485 2.31671L9.70945 1.67211V1.67199C9.84588 1.53642 10.0305 1.46027 10.2229 1.46027C10.4153 1.46027 10.5999 1.53642 10.7363 1.67199L12.3279 3.26358C12.4638 3.39989 12.5402 3.58448 12.5402 3.777C12.5402 3.96952 12.4638 4.15412 12.3279 4.29041L12.3279 4.29044Z" fill="#26BAFA" />
                                                                        </svg>Edit</Link></Button>
                                                                        <div className='vr mx-1'></div>
                                                                        <Button className='bg-none border-0 text-custom-grey fs-15 py-0'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                                                                            <path d="M1.98088 2.67757V2.67778V2.67757ZM6.88975 0L5.45688 0.000508323V0.000711673H5.45617C4.9636 0.000711673 4.56446 0.406291 4.56446 0.906433V0.992348L0.443616 0.99245C0.19868 0.99245 0 1.19407 0 1.44288V2.23634C0 2.48513 0.198672 2.68676 0.443616 2.68676H0.973544V2.68707L11.3729 2.68717L11.373 2.68697V2.68717H11.3791L11.903 2.68697C12.0206 2.68697 12.1334 2.63948 12.2166 2.55509C12.2998 2.4706 12.3466 2.35602 12.3466 2.23655V1.44257C12.3466 1.32311 12.2998 1.20862 12.2166 1.12414C12.1334 1.03965 12.0206 0.992166 11.903 0.992166L7.78213 0.992268V0.906251C7.78213 0.665892 7.6881 0.435392 7.52068 0.265398C7.35335 0.095501 7.12633 3.55961e-05 6.88962 3.55961e-05L6.88975 0ZM6.38725 4.45898C6.55117 4.45918 6.68395 4.5941 6.68395 4.76055L6.68415 11.2794C6.68415 11.3595 6.65281 11.4362 6.59713 11.4927C6.54136 11.5494 6.46585 11.5811 6.38704 11.5814L5.95966 11.5811V11.5814C5.88085 11.5811 5.80535 11.5494 5.74957 11.4927C5.69389 11.4362 5.66255 11.3595 5.66255 11.2794L5.66275 4.76055C5.66275 4.59441 5.79513 4.4596 5.95866 4.4596L5.95906 4.45991L5.96156 4.4593L5.96196 4.4592L6.38645 4.45899L6.38725 4.45898ZM3.72146 4.44749L3.71555 4.45349V4.45369H3.71595C3.87516 4.45369 4.00675 4.5819 4.01226 4.74469L4.23427 11.2597C4.23697 11.3397 4.20833 11.4175 4.15456 11.4759L4.15446 11.476C4.10068 11.5345 4.02628 11.5689 3.94758 11.5716L3.52039 11.5866C3.51779 11.5867 3.51278 11.5868 3.51018 11.5868C3.43508 11.5868 3.36258 11.5579 3.3075 11.5056C3.24982 11.4511 3.21598 11.3755 3.21327 11.2956L2.99177 4.78058C2.98606 4.61404 3.11444 4.47443 3.27837 4.46866L3.70514 4.45371V4.45391C3.70665 4.45371 3.70795 4.45361 3.70925 4.45361C3.71105 4.45361 3.71296 4.45371 3.71436 4.45391L3.71476 4.45351L3.72146 4.44749ZM8.63442 4.45349C8.63683 4.45359 8.63933 4.45359 8.64143 4.45369V4.45389L9.0682 4.46864C9.23213 4.47443 9.3605 4.61403 9.35481 4.78056L9.1333 11.2955C9.1306 11.3755 9.09675 11.4511 9.03917 11.5056C8.9841 11.5579 8.9115 11.5867 8.8364 11.5867C8.83379 11.5867 8.82878 11.5866 8.82618 11.5865L8.399 11.5716V11.5718C8.32029 11.5689 8.24579 11.5344 8.19211 11.4759C8.13834 11.4175 8.1096 11.3396 8.1124 11.2597L8.33431 4.74467C8.33982 4.5822 8.47099 4.45419 8.6298 4.45419L8.6302 4.4544L8.63261 4.45379L8.63351 4.45358V4.45348L8.63442 4.45349ZM1.00978 3.34807L1.43465 11.1005L1.43565 11.1146C1.4723 11.5605 1.50455 12.366 2.03977 12.8064V12.8066C2.53786 13.2162 3.38031 13.2097 3.91805 13.2221L3.92937 13.2222L5.27011 13.2228L5.26931 13.223C5.27792 13.2232 5.28653 13.2234 5.29524 13.2234L5.29544 13.2237L6.16652 13.2231L7.05042 13.2235L7.05062 13.2237C7.05903 13.2235 7.06745 13.2233 7.07576 13.2229H7.07656L7.07586 13.2231L8.4165 13.2224L8.42781 13.2222C8.96556 13.2098 9.808 13.2164 10.3061 12.8069V12.8066C10.8413 12.3663 10.8737 11.5609 10.9103 11.1149L10.9113 11.1008L11.3366 3.34839L1.00978 3.34807Z" fill="#FF6161" />
                                                                        </svg>Delete</Button>
                                                                    </ButtonGroup>
                                                                </div>
                                                            </div>
                                                        </div> */}
                                                <div className=' text-center w-100 mb-3'>
                                                    <hr />
                                                    <Button className='bg-none text-green fw-600 border-0 fs-6' onClick={() => { setSelectedIngredient(null); setShowIngredientModal(true) }}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 17" fill="none">
                                                        <path d="M15 6.96137V10.6705H9.23864V16.8159H5.76136V10.6705H0V6.96137H5.76136V0.815918H9.23864V6.96137H15Z" fill="#81C524" />
                                                    </svg>Add Ingredients</Button>
                                                </div>
                                            </Tab>
                                            <Tab eventkey="Nutrition" title="Nutrition">
                                                <div className='px-5 mt-4'>
                                                    <h4 className='text-dark mb-1 fw-600 fs-17 left-border'>Information</h4>
                                                    <div className='mt-3 px-3'>
                                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                                            <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Serving size</Form.Label>
                                                            <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" value={recipe?.nutrition?.servingSize} onChange={(e) => setRecipe(prev => ({ ...prev, nutrition: { ...prev.nutrition, servingSize: e.target.value } }))} placeholder="Roasted Sweet Potato & Eggplant Pitas" />
                                                        </Form.Group>
                                                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                            <Col sm="4">
                                                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Calories</Form.Label>
                                                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" value={recipe?.nutrition?.calories} onChange={(e) => setRecipe(prev => ({ ...prev, nutrition: { ...prev.nutrition, calories: e.target.value } }))} placeholder="20" />
                                                            </Col>
                                                            <Col sm="4">
                                                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Fat</Form.Label>
                                                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" value={recipe?.nutrition?.fat} onChange={(e) => setRecipe(prev => ({ ...prev, nutrition: { ...prev.nutrition, fat: e.target.value } }))} placeholder="2" />
                                                            </Col>
                                                            <Col sm="4">
                                                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Carbs</Form.Label>
                                                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" value={recipe?.nutrition?.carbs} onChange={(e) => setRecipe(prev => ({ ...prev, nutrition: { ...prev.nutrition, carbs: e.target.value } }))} placeholder="2" />
                                                            </Col>
                                                        </Form.Group>
                                                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                            <Col sm="4">
                                                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Fiber</Form.Label>
                                                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" value={recipe?.nutrition?.fiber} onChange={(e) => setRecipe(prev => ({ ...prev, nutrition: { ...prev.nutrition, fiber: e.target.value } }))} placeholder="20" />
                                                            </Col>
                                                            <Col sm="4">
                                                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Sugar</Form.Label>
                                                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" value={recipe?.nutrition?.sugar} onChange={(e) => setRecipe(prev => ({ ...prev, nutrition: { ...prev.nutrition, sugar: e.target.value } }))} placeholder="2" />
                                                            </Col>
                                                            <Col sm="4">
                                                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Protein</Form.Label>
                                                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" value={recipe?.nutrition?.protein} onChange={(e) => setRecipe(prev => ({ ...prev, nutrition: { ...prev.nutrition, protein: e.target.value } }))} placeholder="2" />
                                                            </Col>
                                                        </Form.Group>
                                                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                            <Col sm="4">
                                                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Cholesterol</Form.Label>
                                                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" value={recipe?.nutrition?.cholesterol} onChange={(e) => setRecipe(prev => ({ ...prev, nutrition: { ...prev.nutrition, cholesterol: e.target.value } }))} placeholder="20" />
                                                            </Col>
                                                            <Col sm="4">
                                                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Sodium</Form.Label>
                                                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" value={recipe?.nutrition?.sodium} onChange={(e) => setRecipe(prev => ({ ...prev, nutrition: { ...prev.nutrition, sodium: e.target.value } }))} placeholder="2" />
                                                            </Col>
                                                            <Col sm="4">
                                                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Vitamin A</Form.Label>
                                                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" value={recipe?.nutrition?.vitaminA} onChange={(e) => setRecipe(prev => ({ ...prev, nutrition: { ...prev.nutrition, vitaminA: e.target.value } }))} placeholder="2" />
                                                            </Col>
                                                        </Form.Group>
                                                        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                                                            <Col sm="4">
                                                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Vitamin C</Form.Label>
                                                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" value={recipe?.nutrition?.vitaminC} onChange={(e) => setRecipe(prev => ({ ...prev, nutrition: { ...prev.nutrition, vitaminC: e.target.value } }))} placeholder="20" />
                                                            </Col>
                                                            <Col sm="4">
                                                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Calcium</Form.Label>
                                                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" value={recipe?.nutrition?.calcium} onChange={(e) => setRecipe(prev => ({ ...prev, nutrition: { ...prev.nutrition, calcium: e.target.value } }))} placeholder="2" />
                                                            </Col>
                                                            <Col sm="4">
                                                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Iron</Form.Label>
                                                                <Form.Control className='shadow-none border fw-600 text-black py-3' type="text" value={recipe?.nutrition?.iron} onChange={(e) => setRecipe(prev => ({ ...prev, nutrition: { ...prev.nutrition, iron: e.target.value } }))} placeholder="2" />
                                                            </Col>
                                                        </Form.Group>
                                                    </div>
                                                </div>
                                                <div className='text-center w-100 mb-3'>
                                                    <hr />
                                                    <Button className='bg-none text-green fw-600 border-0 fs-6' onClick={() => setShowNutritionModal(true)}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 15 17" fill="none">
                                                        <path d="M15 6.96137V10.6705H9.23864V16.8159H5.76136V10.6705H0V6.96137H5.76136V0.815918H9.23864V6.96137H15Z" fill="#81C524" />
                                                    </svg>Add Nutrition</Button>
                                                </div>
                                            </Tab>
                                        </Tabs>
                                    </div>
                                </div>

                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showModal} size="md" onHide={() => setShowModal(false)}>
                <Modal.Header className='text-center border-0 bg-green custom-modal-header' closeButton>
                    <span></span>
                    <Modal.Title className='text-white'>Add Direction</Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-5'>
                    <div>
                        <div className=''>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label className='fs-15 fw-normal'>Direction</Form.Label>
                                <Form.Control className='shadow-none border-2 border p-3' as="textarea" value={direction} rows={4} placeholder='Write a direction' onChange={(e) => setDirection(e.target.value)} />
                            </Form.Group>
                        </div>
                        <Button className='bg-green text-white w-100 d-block py-3 custom-shadow border-0 mt-5 mb-3' onClick={() => handleDirection()}>Add Direction</Button>
                    </div>
                </Modal.Body>
            </Modal>



            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showIngredientModal} size="md" onHide={() => setShowIngredientModal(false)}>
                <Modal.Header className='text-center border-0 bg-green custom-modal-header' closeButton>
                    <span></span>
                    <Modal.Title className='text-white'>Add Ingredient</Modal.Title>
                </Modal.Header>
                <Modal.Body className='px-5 py-3'>
                    <div>
                        <div className=''>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Name of ingredient</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' name="ingredientName" value={selectedIngredient?.ingredientName} onChange={(e) => handleSelectedIngredientChange(e)} type="text" placeholder="Name of ingredient" />
                            </Form.Group>
                            <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
                                <Col sm="6">
                                    <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Quantity</Form.Label>
                                    <Form.Control className='shadow-none border fw-600 text-black py-3' name="quantity" value={selectedIngredient?.quantity} onChange={(e) => handleSelectedIngredientChange(e)} type="text" placeholder="Quantity" />
                                </Col>
                                <Col sm="6">
                                    <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Unit of measure <svg className='ms-2' xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path d="M7.64 15.28C11.8596 15.28 15.28 11.8596 15.28 7.64C15.28 3.42042 11.8596 0 7.64 0C3.42042 0 0 3.42042 0 7.64C0 11.8596 3.42042 15.28 7.64 15.28ZM8.06444 2.674C8.76778 2.674 9.33778 3.24412 9.33778 3.94733C9.33778 4.65055 8.76778 5.22067 8.06444 5.22067C7.36111 5.22067 6.79111 4.65055 6.79111 3.94733C6.79111 3.24412 7.36111 2.674 8.06444 2.674ZM7.64 5.81489C8.91333 5.81489 9.22221 6.56619 9.07947 7.49302L8.48889 11.3327C8.48889 11.3327 8.91333 11.3327 9.76222 10.9083C9.76222 10.9083 9.33778 12.6061 7.64 12.6061C6.36667 12.6061 6.05779 11.8548 6.20053 10.9279L6.79111 7.08822C6.79111 7.08822 6.36667 7.08822 5.51778 7.51267C5.51778 7.51267 5.94222 5.81489 7.64 5.81489Z" fill="#A2C45A" />
                                    </svg></Form.Label>
                                    <Form.Control className='shadow-none border fw-600 text-black py-3' name="unit" value={selectedIngredient?.unit} onChange={(e) => handleSelectedIngredientChange(e)} type="text" placeholder="Unit of measure" />
                                </Col>
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Category</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' name="category" value={selectedIngredient?.category} onChange={(e) => handleSelectedIngredientChange(e)} type="text" placeholder="Choose your category" />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Preparation note</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black' as="textarea" name="preparationNote" value={selectedIngredient?.preparationNote} onChange={(e) => handleSelectedIngredientChange(e)} rows={3} placeholder='Write an optional note' />
                            </Form.Group>
                            <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Nutrition from</Form.Label>
                                <Form.Control className='shadow-none border fw-600 text-black py-3' name="nutritionFrom" value={selectedIngredient?.nutritionFrom} onChange={(e) => handleSelectedIngredientChange(e)} type="text" placeholder="Unavailable" />
                            </Form.Group>
                        </div>
                        <Button className='bg-green text-white w-100 d-block py-3 custom-shadow border-0 mt-3 mb-3' onClick={() => handleUpdateIngredient()}>Add Ingredient</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showNotesModal} size="md" onHide={() => setShowNotesModal(false)}>
                <Modal.Header className='text-center border-0 bg-green custom-modal-header' closeButton>
                    <span></span>
                    <Modal.Title className='text-white'>Add Note</Modal.Title>
                </Modal.Header>
                <Modal.Body className='p-5'>
                    <div>
                        <div className=''>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                <Form.Label className='text-black fs-15 fw-normal'>Title</Form.Label>
                                <Form.Control className='shadow-none border py-3' name='title' value={note?.title} type="text" placeholder="Enter title" onChange={(e) => handleNoteChange(e)} />
                            </Form.Group>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label className='text-black fs-15 fw-normal'>Note</Form.Label>
                                <Form.Control className='shadow-none border-2 border p-3' as="textarea" name='note' value={note?.note} rows={4} placeholder='Write a note' onChange={(e) => handleNoteChange(e)} />
                            </Form.Group>
                        </div>
                        <Button className='bg-green text-white w-100 d-block py-3 custom-shadow border-0 mt-5 mb-3' onClick={() => handleNote()}>Add Note</Button>
                    </div>
                </Modal.Body>
            </Modal>

            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showNutritionModal} size="md" onHide={() => setShowNutritionModal(false)}>
                <Modal.Header className='text-center border-0 bg-green custom-modal-header' closeButton>
                    <span></span>
                    <Modal.Title className='text-white'>Add Nutrition</Modal.Title>
                </Modal.Header>
                <Modal.Body className=''>
                    <div>
                        <div className=' mt-4'>
                            {/* <Form.Control className='shadow-none border fw-600 text-black py-3 bg-light' type="search" placeholder="Search" />
                            <hr /> */}
                            <h4 className='text-dark mb-1 fw-600 fs-17 left-border'>Information</h4>
                            <div className='mt-3 px-3'>
                                <Form.Group className="mb-2" controlId="exampleForm.ControlInput1">
                                    <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Serving size</Form.Label>
                                    <Form.Control className='shadow-none border fw-600 text-black py-3' name='servingSize' value={nutrition?.servingSize} type="text" onChange={handleNutritionChange} placeholder="" />
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
                                    <Col sm="4">
                                        <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Calories</Form.Label>
                                        <Form.Control className='shadow-none border fw-600 text-black py-3' name='calories' value={nutrition?.calories} onChange={handleNutritionChange} type="text" placeholder="" />
                                    </Col>
                                    <Col sm="4">
                                        <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Fat</Form.Label>
                                        <Form.Control className='shadow-none border fw-600 text-black py-3' name='fat' value={nutrition?.fat} onChange={handleNutritionChange} type="text" placeholder="" />
                                    </Col>
                                    <Col sm="4">
                                        <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Carbs</Form.Label>
                                        <Form.Control className='shadow-none border fw-600 text-black py-3' name='carbs' value={nutrition?.carbs} onChange={handleNutritionChange} type="text" placeholder="" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
                                    <Col sm="4">
                                        <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Fiber</Form.Label>
                                        <Form.Control className='shadow-none border fw-600 text-black py-3' name='fiber' value={nutrition?.fiber} onChange={handleNutritionChange} type="text" placeholder="" />
                                    </Col>
                                    <Col sm="4">
                                        <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Sugar</Form.Label>
                                        <Form.Control className='shadow-none border fw-600 text-black py-3' name='sugar' value={nutrition?.sugar} onChange={handleNutritionChange} type="text" placeholder="" />
                                    </Col>
                                    <Col sm="4">
                                        <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Protein</Form.Label>
                                        <Form.Control className='shadow-none border fw-600 text-black py-3' name='protein' value={nutrition?.protein} onChange={handleNutritionChange} type="text" placeholder="" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
                                    <Col sm="4">
                                        <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Cholesterol</Form.Label>
                                        <Form.Control className='shadow-none border fw-600 text-black py-3' name='cholesterol' value={nutrition?.cholesterol} onChange={handleNutritionChange} type="text" placeholder="" />
                                    </Col>
                                    <Col sm="4">
                                        <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Sodium</Form.Label>
                                        <Form.Control className='shadow-none border fw-600 text-black py-3' name='sodium' value={nutrition?.sodium} onChange={handleNutritionChange} type="text" placeholder="" />
                                    </Col>
                                    <Col sm="4">
                                        <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Vitamin A</Form.Label>
                                        <Form.Control className='shadow-none border fw-600 text-black py-3' name='vitaminA' value={nutrition?.vitaminA} onChange={handleNutritionChange} type="text" placeholder="" />
                                    </Col>
                                </Form.Group>
                                <Form.Group as={Row} className="mb-2" controlId="formPlaintextEmail">
                                    <Col sm="4">
                                        <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Vitamin C</Form.Label>
                                        <Form.Control className='shadow-none border fw-600 text-black py-3' name='vitaminC' value={nutrition?.vitaminC} onChange={handleNutritionChange} type="text" placeholder="" />
                                    </Col>
                                    <Col sm="4">
                                        <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Calcium</Form.Label>
                                        <Form.Control className='shadow-none border fw-600 text-black py-3' name='calcium' value={nutrition?.calcium} onChange={handleNutritionChange} type="text" placeholder="" />
                                    </Col>
                                    <Col sm="4">
                                        <Form.Label className='text-custom-grey fw-600 fs-15 mb-0'>Iron</Form.Label>
                                        <Form.Control className='shadow-none border fw-600 text-black py-3' name='iron' value={nutrition?.iron} onChange={handleNutritionChange} type="text" placeholder="" />
                                    </Col>
                                </Form.Group>
                            </div>
                        </div>
                        <Button className='bg-green text-white w-100 d-block py-3 custom-shadow border-0 mt-5 mb-3' onClick={() => handleNutritionUpdate()}>Add Nutrition</Button>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}
