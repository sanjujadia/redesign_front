import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { Button, Col, Row, Form, Tab, Tabs, Modal } from 'react-bootstrap';
import UserSidebar from '../User_components/UserSidebar';
import UserRecipeCard from '../User_components/UserRecipeCard';
import { useAuth } from '../context/AuthProvider'
import { useNavigate } from 'react-router-dom';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import { TailSpin } from 'react-loader-spinner';
import Accordion from 'react-bootstrap/Accordion';
import { AccordionActions } from '@mui/material';

export default function UserRecipe() {
    const [loading, setLoading] = useState(true);
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
        protein: [0, 20],
        VitaminA: [0, 2500],
        VitaminC: [0, 75],
        VitaminD: [0, 100],
        VitaminE: [0, 5],
        VitaminK: [0, 60],
        Thiamine: [0, 1],
        Riboflavin: [0, 1],
        Niacin: [0, 5],
        VitaminB6: [0, 1],
        Folate: [0, 200],
        VitaminB12: [0, 3],
        Sodium: [0, 250],
        Potassium: [0, 1000],
        Calcium: [0, 300],
        Iron: [0, 5],
        Phosphorous: [0, 40],
        Magnesium: [0, 150],
        Zinc: [0, 5],
        Selenium: [0, 30]

    }
    const [showFilterModal, setShowFilterModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState([])
    const [recipeData, setRecipeData] = useState([])
    const [filterRecipe, setFilterRecipe] = useState(initialFilterValues)
    const [dataFound, setDataFound] = useState(true);

    const handleCategory = (category) => {
        if (category)
            if (filterRecipe.mealType.includes(category)) {
                // Category is already selected, so remove it
                const categoryArray = filterRecipe.mealType
                const updatedValues = filterRecipe.mealType.filter((item) => item !== category)
                setFilterRecipe({ ...filterRecipe, mealType: updatedValues });
            } else {
                // Category is not selected, so add it
                const categoryArray = filterRecipe.mealType
                const updatedValues = [...categoryArray, category]
                setFilterRecipe({ ...filterRecipe, mealType: updatedValues });
            }
    }

    const fetchRecipes = async () => {
        setLoading(true);
        // const response = await fetch(`${process.env.REACT_APP_BASE_URL}/recipe/getRecipes`, {
        //     method: "POST",
        //     headers: {
        //         "Content-Type": "application/json"
        //     },
        //     body: JSON.stringify({ filter: filterRecipe })
        // }).then(res => res.json()).then(data => {
        //     console.log('data', data)
        //     return data
        // })
        // if (response.status) {
        //     setRecipeData(response.data)
        // }else{
        //     setRecipeData([])
        // }

        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/recipes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());

            if (response.status) {
                setRecipeData(response?.data?.hits);
                setDataFound(true);
                console.log(response?.data?.hits);
            }
            else {
                setRecipeData([]);
            }
        } catch (error) {
            console.error("Error fetching recipes: ", error);
            setDataFound(false);
            setRecipeData([]);
            setLoading(false);
        } finally {
            setLoading(false);
        }
    };
    const handleFilterRecipeRange = (e) => {
        const { name, value } = e.target
        const updatedValues = { ...filterRecipe, [name]: value };
        setFilterRecipe(updatedValues)
    }

    const handleFilterRecipeInput = (e) => {
        const { name, value } = e.target
        const newValue = value ? value.split(',').map(item => item.trim()) : []
        const updatedValues = { ...filterRecipe, [name]: newValue };
        setFilterRecipe(updatedValues)
    }

    const handleMealSelection = (value) => {
        let newMealTypes, updatedValues
        if (filterRecipe.mealType.includes(value)) {
            newMealTypes = filterRecipe.mealType.filter(meal => meal !== value)
            updatedValues = { ...filterRecipe, mealType: newMealTypes }
            setFilterRecipe(updatedValues)
        } else {
            newMealTypes = [...filterRecipe.mealType, value]
            updatedValues = { ...filterRecipe, mealType: newMealTypes }
            setFilterRecipe(updatedValues)
        }
    }

    useEffect(() => {
        fetchRecipes()
    }, [filterRecipe?.mealType])

    useEffect(() => {
        if (isAuthenticated) {
            handleCategory()
            fetchRecipes()
        } else {
            navigate('/')
        }
    }, [user, filterRecipe.mealType])

    // console.log(selectedCategory,'selectedCategory')
    console.log('recipes', recipeData)
    console.log('filterRecipe', filterRecipe)
    return (
        <div>
            {loading && (
                <div className="loader-overlay">
                    <TailSpin height={80} width={80} color="#4fa94d" ariaLabel="tail-spin-loading" radius={1} visible={true} />
                </div>
            )}
            <div className='mt-1 main-content'>
                <div className='bg-white py-3 px-4'>
                    <Row>
                        <Col lg={4}>
                            <div>
                                <h5 className='text-dark mb-0 fw-600 fs-5 left-border'>View Recipes</h5>
                                <p className='text-custom-grey fw-600 fs-17 ps-2 mb-0'>{recipeData?.length > 1 ? recipeData?.length + ' Recipes' : recipeData?.length + ' Recipe'}</p>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div className='text-end'>
                                <Button className='text-custom-grey mb-0 fw-600 fs-17 bg-none border border-gray px-3' onClick={() => setShowFilterModal(true)}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                                    <path d="M0.918945 0H16.7566V2.56205H0.918945V0Z" fill="#959595" />
                                    <path d="M9.30334 10.7136H6.74145V13.9742L10.9338 17.2348L10.9336 10.2476L15.3355 3.74951H2.33936L6.50838 9.78179H9.30322C9.55942 9.78179 9.76899 10.038 9.76899 10.2942C9.76899 10.5504 9.55941 10.7133 9.30322 10.7133L9.30334 10.7136Z" fill="#959595" />
                                </svg>Filter</Button>
                            </div>
                        </Col>
                    </Row>

                </div>
                <div className='p-xl-5 p-3'>
                    <Row>
                        <Col lg={12}>
                            {/* <div className='d-flex gap-2 align-items-center justify-content-between'>
                                <span className={`rounded bg-none text-center text-green px-5 py-2 d-block w-100 me-2 fs-17 custom-shadow custom-border fw-normal mb-2 cursor ${filterRecipe.mealType.includes('breakfast') ? "category" : ""}`} onClick={() => handleCategory('breakfast')}>Breakfast</span>
                                <span className={`rounded bg-none text-center text-green px-5 py-2 d-block w-100 me-2 fs-17 custom-shadow custom-border fw-normal mb-2 cursor ${filterRecipe.mealType.includes('lunch') ? "category" : ""}`} onClick={() => handleCategory('lunch')}>Lunch</span>
                                <span className={`rounded bg-none text-center text-green px-5 py-2 d-block w-100 me-2 fs-17 custom-shadow custom-border fw-normal mb-2 cursor ${filterRecipe.mealType.includes('dinner') ? "category" : ""}`} onClick={() => handleCategory('dinner')}>Dinner</span>
                                <span className={`rounded bg-none text-center text-green px-5 py-2 d-block w-100 me-2 fs-17 custom-shadow custom-border fw-normal mb-2 cursor ${filterRecipe.mealType.includes('snack') ? "category" : ""}`} onClick={() => handleCategory('snack')}>Snack</span>
                                <span className={`rounded bg-none text-center text-green px-5 py-2 d-block w-100 me-2 fs-17 custom-shadow custom-border fw-normal mb-2 cursor ${filterRecipe.mealType.includes('dessert') ? "category" : ""}`} onClick={() => handleCategory('dessert')}>Dessert</span>
                            </div> */}
                            <div className='recipe-grid'>
                                {dataFound ? recipeData.map(item => (
                                    <UserRecipeCard data={item} />
                                ))
                                    :
                                    <> <p>No user recipe data found</p></>}

                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
            <Modal
                aria-labelledby="contained-modal-title-vcenter"
                centered
                show={showFilterModal}
                size="md"
                onHide={() => setShowFilterModal(false)}
            >
                <Modal.Header className="text-center border-0" closeButton>
                    <span></span>
                    <Modal.Title className="">Filter Recipes</Modal.Title>
                </Modal.Header>
                <Modal.Body className="px-3 ">
                    <div className="profile-tab">
                        <Tabs
                            defaultActiveKey="Advanced"
                            id="justify-tab-example"
                            className="mb-3 p-0"
                        >
                            <Tab eventKey="Advanced" title="Advanced">
                                <div>
                                    <div>
                                        <h5 className="my-2">Meal Type</h5>
                                        <div className="mb-2">
                                            <span className={`rounded bg-white text-custom-grey px-4 custom-border py-2 d-inline-block me-2 fs-17 custom-shadow fw-normal mb-2 cursor ${filterRecipe?.mealType?.includes('breakfast') ? "category" : ""}`} onClick={() => handleCategory('breakfast')}>Breakfast</span>
                                            <span className={`rounded bg-white text-custom-grey px-4 custom-border py-2 d-inline-block me-2 fs-17 custom-shadow fw-normal mb-2 cursor ${filterRecipe?.mealType?.includes('lunch') ? "category" : ""}`} onClick={() => handleCategory('lunch')}>Lunch</span>
                                            <span className={`rounded bg-white text-custom-grey px-4 custom-border py-2 d-inline-block me-2 fs-17 custom-shadow fw-normal mb-2 cursor ${filterRecipe?.mealType?.includes('dinner') ? "category" : ""}`} onClick={() => handleCategory('dinner')}>Dinner</span>
                                            <span className={`rounded bg-white text-custom-grey px-4 custom-border py-2 d-inline-block me-2 fs-17 custom-shadow fw-normal mb-2 cursor ${filterRecipe?.mealType?.includes('dessert') ? "category" : ""}`} onClick={() => handleCategory('dessert')}>Dessert</span>
                                            <span className={`rounded bg-white text-custom-grey px-4 custom-border py-2 d-inline-block me-2 fs-17 custom-shadow fw-normal mb-2 cursor ${filterRecipe?.mealType?.includes('snack') ? "category" : ""}`} onClick={() => handleCategory('snack')}>Snack</span>
                                        </div>
                                        <Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                            <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.duration[0]} Minutes</span><span className="fw-normal fs-6 text-black">{filterRecipe?.duration[1]} Minutes</span></Form.Label>
                                            <Box sx={{ width: 300 }}>
                                                <Slider
                                                    getAriaLabel={() => 'range'}
                                                    sx={{
                                                        width: 400,
                                                        height: 8,
                                                        color: '#F36F27',
                                                    }}
                                                    min={0}
                                                    max={60}
                                                    name="duration"
                                                    value={filterRecipe?.duration}
                                                    onChange={handleFilterRecipeRange}
                                                    valueLabelDisplay="auto"
                                                // getAriaValueText={valuetext}
                                                />
                                            </Box>
                                        </Form.Group>
                                        <Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                            <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.ingredients[0]} Ingredients</span><span className="fw-normal fs-6 text-black">{filterRecipe?.ingredients[1]} Ingredients</span></Form.Label>
                                            <Box sx={{ width: 300 }}>
                                                <Slider
                                                    getAriaLabel={() => 'range'}
                                                    sx={{
                                                        width: 400,
                                                        height: 8,
                                                        color: '#F36F27',
                                                    }}
                                                    min={0}
                                                    max={50}
                                                    name="ingredients"
                                                    value={filterRecipe?.ingredients}
                                                    onChange={handleFilterRecipeRange}
                                                    valueLabelDisplay="auto"
                                                // getAriaValueText={valuetext}
                                                />
                                            </Box>
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label className='text-black fw-600 fs-17'>Tags</Form.Label>
                                            <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' type="text" placeholder="" name='tags' value={filterRecipe.tags} onChange={handleFilterRecipeInput} />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label className='text-black fw-600 fs-17'>Include ingredients</Form.Label>
                                            <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' type="text" placeholder="" name='includeIngredients' value={filterRecipe.includeIngredients} onChange={handleFilterRecipeInput} />
                                        </Form.Group>
                                        <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                                            <Form.Label className='text-black fw-600 fs-17'>Exclude ingredients</Form.Label>
                                            <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' type="text" placeholder="" name='excludeIngredients' value={filterRecipe.excludeIngredients} onChange={handleFilterRecipeInput} />
                                        </Form.Group>
                                    </div>
                                    <Button className="bg-green w-100 text-white py-2 custom-border" onClick={() => { fetchRecipes(); setShowFilterModal(false) }}>
                                        Filter Recipes
                                    </Button>
                                    <Button className="bg-none w-100 text-green py-1 border-0" onClick={() => setFilterRecipe(initialFilterValues)}>
                                        Reset Recipes
                                    </Button>
                                </div>
                            </Tab>
                            <Tab eventKey="Nutrition" title="Nutrition">
                                <div>
                                    <Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                        <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.calories[0]} Calories</span><span className="fw-normal fs-6 text-black">{filterRecipe?.calories[1]} Calories</span></Form.Label>
                                        <Box sx={{ width: 300 }}>
                                            <Slider
                                                getAriaLabel={() => 'range'}
                                                sx={{
                                                    width: 400,
                                                    height: 8,
                                                    color: '#F36F27',
                                                }}
                                                min={0}
                                                max={3000}
                                                name="calories"
                                                value={filterRecipe?.calories}
                                                onChange={handleFilterRecipeRange}
                                                valueLabelDisplay="auto"
                                            // getAriaValueText={valuetext}
                                            />
                                        </Box>
                                    </Form.Group>
                                    <Accordion><Accordion.Item eventKey="0"><Accordion.Header>
                                        <Form.Label className='text-green fw-600 fs-17'>Macros</Form.Label>

                                        {/* <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' type="text" placeholder="" /> */}
                                    </Accordion.Header><Accordion.Body><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                        <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.fat[0]} Fat</span><span className="fw-normal fs-6 text-black">{filterRecipe?.fat[1]} Fat</span></Form.Label>
                                        <Box sx={{ width: 300 }}>
                                            <Slider
                                                getAriaLabel={() => 'range'}
                                                sx={{
                                                    width: 400,
                                                    height: 8,
                                                    color: '#F36F27',
                                                }}
                                                min={0}
                                                max={150}
                                                name="fat"
                                                value={filterRecipe?.fat}
                                                onChange={handleFilterRecipeRange}
                                                valueLabelDisplay="auto"
                                            // getAriaValueText={valuetext}
                                            />
                                        </Box>
                                    </Form.Group>
                                            <Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.saturated[0]} Saturated</span><span className="fw-normal fs-6 text-black">{filterRecipe?.saturated[1]} Saturated</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={150}
                                                        name="saturated"
                                                        value={filterRecipe?.saturated}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group>
                                            <Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.polyunsaturated[0]} Polyunsaturated</span><span className="fw-normal fs-6 text-black">{filterRecipe?.polyunsaturated[1]} Polyunsaturated</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={150}
                                                        name="polyunsaturated"
                                                        value={filterRecipe?.polyunsaturated}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group>
                                            <Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.monosaturated[0]} Monosaturated</span><span className="fw-normal fs-6 text-black">{filterRecipe?.monosaturated[1]} Monosaturated</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={150}
                                                        name="monosaturated"
                                                        value={filterRecipe?.monosaturated}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group>
                                            <Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.carbs[0]} Carbs</span><span className="fw-normal fs-6 text-black">{filterRecipe?.carbs[1]} Carbs</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={150}
                                                        name="carbs"
                                                        value={filterRecipe?.carbs}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group>
                                            <Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.fiber[0]} Fiber</span><span className="fw-normal fs-6 text-black">{filterRecipe?.fiber[1]} Fiber</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={150}
                                                        name="fiber"
                                                        value={filterRecipe?.fiber}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group>
                                            <Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.sugar[0]} Sugar</span><span className="fw-normal fs-6 text-black">{filterRecipe?.sugar[1]} Sugar</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={150}
                                                        name="sugar"
                                                        value={filterRecipe?.sugar}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group>
                                            <Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.protein[0]} Protein</span><span className="fw-normal fs-6 text-black">{filterRecipe?.protein[1]} Protein</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={150}
                                                        name="protein"
                                                        value={filterRecipe?.protein}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group></Accordion.Body></Accordion.Item>
                                        <Accordion.Item eventKey='1'><Accordion.Header><Form.Label className='text-green fw-600 fs-17'>Vitamins</Form.Label></Accordion.Header><Accordion.Body><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                            <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminA[0]} VitaminA</span><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminA[1]} UI+</span></Form.Label>
                                            <Box sx={{ width: 300 }}>
                                                <Slider
                                                    getAriaLabel={() => 'range'}
                                                    sx={{
                                                        width: 400,
                                                        height: 8,
                                                        color: '#F36F27',
                                                    }}
                                                    min={0}
                                                    max={2500}
                                                    name="VitaminA"
                                                    value={filterRecipe?.VitaminA}
                                                    onChange={handleFilterRecipeRange}
                                                    valueLabelDisplay="auto"
                                                // getAriaValueText={valuetext}
                                                />
                                            </Box>
                                        </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminC[0]} VitaminC</span><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminC[1]}mg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={75}
                                                        name="VitaminC"
                                                        value={filterRecipe?.VitaminC}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group>
                                            <Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminE[0]} VitaminE</span><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminE[1]} mg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={5}
                                                        name="VitaminE"
                                                        value={filterRecipe?.VitaminE}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminD[0]} VitaminD</span><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminD[1]} IU+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={100}
                                                        name="VitaminD"
                                                        value={filterRecipe?.VitaminD}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminK[0]} VitaminK</span><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminK[1]} µg</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={60}
                                                        name="VitaminK"
                                                        value={filterRecipe?.VitaminK}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminB6[0]} VitaminB6</span><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminB6[1]} mg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={1}
                                                        name="VitaminB6"
                                                        value={filterRecipe?.VitaminB6}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group>
                                            <Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminB12[0]} VitaminB12</span><span className="fw-normal fs-6 text-black">{filterRecipe?.VitaminB12[1]} µg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={3}
                                                        name="VitaminB12"
                                                        value={filterRecipe?.VitaminB12}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.Thiamine[0]} Thiamine</span><span className="fw-normal fs-6 text-black">{filterRecipe?.Thiamine[1]} mg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={1}
                                                        name="Thiamine"
                                                        value={filterRecipe?.Thiamine}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.Riboflavin[0]} Riboflavin</span><span className="fw-normal fs-6 text-black">{filterRecipe?.Riboflavin[1]} mg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={1}
                                                        name="Riboflavin"
                                                        value={filterRecipe?.Riboflavin}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.Niacin[0]} Niacin</span><span className="fw-normal fs-6 text-black">{filterRecipe?.Niacin[1]} mg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={5}
                                                        name="Niacin"
                                                        value={filterRecipe?.Niacin}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.Folate[0]} Folate</span><span className="fw-normal fs-6 text-black">{filterRecipe?.Folate[1]} µg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={200}
                                                        name="Folate"
                                                        value={filterRecipe?.Folate}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group></Accordion.Body></Accordion.Item>
                                        <Accordion.Item eventKey='2'><Accordion.Header><Form.Label className='text-green fw-600 fs-17'>Minerals</Form.Label></Accordion.Header><Accordion.Body><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                            <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.Sodium[0]} Sodium</span><span className="fw-normal fs-6 text-black">{filterRecipe?.Sodium[1]} mg+</span></Form.Label>
                                            <Box sx={{ width: 300 }}>
                                                <Slider
                                                    getAriaLabel={() => 'range'}
                                                    sx={{
                                                        width: 400,
                                                        height: 8,
                                                        color: '#F36F27',
                                                    }}
                                                    min={0}
                                                    max={250}
                                                    name="Sodium"
                                                    value={filterRecipe?.Sodium}
                                                    onChange={handleFilterRecipeRange}
                                                    valueLabelDisplay="auto"
                                                // getAriaValueText={valuetext}
                                                />
                                            </Box>
                                        </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.Potassium[0]} Potassium</span><span className="fw-normal fs-6 text-black">{filterRecipe?.Potassium[1]} mg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={100}
                                                        name="Potassium"
                                                        value={filterRecipe?.Potassium}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.Calcium[0]} Calcium</span><span className="fw-normal fs-6 text-black">{filterRecipe?.Calcium[1]} mg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={300}
                                                        name="Calcium"
                                                        value={filterRecipe?.Calcium}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.Iron[0]} Iron</span><span className="fw-normal fs-6 text-black">{filterRecipe?.Iron[1]} mg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={5}
                                                        name="Iron"
                                                        value={filterRecipe?.Iron}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.Phosphorous[0]} Phosphorous</span><span className="fw-normal fs-6 text-black">{filterRecipe?.Phosphorous[1]} mg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={40}
                                                        name="Phosphorous"
                                                        value={filterRecipe?.Phosphorous}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.Magnesium[0]} Magnesium</span><span className="fw-normal fs-6 text-black">{filterRecipe?.Magnesium[1]} mg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={150}
                                                        name="Magnesium"
                                                        value={filterRecipe?.Magnesium}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.Zinc[0]} Zinc</span><span className="fw-normal fs-6 text-black">{filterRecipe?.Zinc[1]} mg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={5}
                                                        name="Zinc"
                                                        value={filterRecipe?.Zinc}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group><Form.Group className="mb-0 px-2" controlId="formBasicEmail">
                                                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterRecipe?.Selenium[0]} Selenium</span><span className="fw-normal fs-6 text-black">{filterRecipe?.Selenium[1]} µg+</span></Form.Label>
                                                <Box sx={{ width: 300 }}>
                                                    <Slider
                                                        getAriaLabel={() => 'range'}
                                                        sx={{
                                                            width: 400,
                                                            height: 8,
                                                            color: '#F36F27',
                                                        }}
                                                        min={0}
                                                        max={30}
                                                        name="Selenium"
                                                        value={filterRecipe?.Selenium}
                                                        onChange={handleFilterRecipeRange}
                                                        valueLabelDisplay="auto"
                                                    // getAriaValueText={valuetext}
                                                    />
                                                </Box>
                                            </Form.Group></Accordion.Body></Accordion.Item>
                                    </Accordion>

                                    <Button className="bg-green w-100 text-white py-2 custom-border" onClick={() => { fetchRecipes(); setShowFilterModal(false) }}>
                                        Filter Recipes
                                    </Button>
                                    <Button className="bg-none w-100 text-green py-1 border-0" onClick={() => setFilterRecipe(initialFilterValues)}>
                                        Reset Recipes
                                    </Button>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}