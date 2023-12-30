import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Form, InputGroup, Modal, ModalTitle, Row, Table, Pagination } from 'react-bootstrap';
import { useAuth } from '../context/AuthProvider';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import UserSidebar from "../User_components/UserSidebar";
import TopBar from "../components/TopBar";
import MealData from "../User_components/MealData";
// import FoodImg from '../assets/images/greek-salad-food 2.png';
import DayMeal from "../User_components/DayMeal";
import { toast, ToastContainer } from 'react-toastify'
import moment from 'moment'
import axios from 'axios'
import Usertrytofavcard from '../User_components/Usertrytofavcard';

export default function MealPlanner() {
  const navigate = useNavigate()
  const { user, isAuthenticated } = useAuth()
  const initialFilterSnack = {
    search: '',
    duration: [10, 50],
    calories: [100, 2000],
    carbs: [10, 1500],
    protein: [10, 150],
    tags: [],
    includeIngredients: [],
    excludeIngredients: []
  }
  const initialMealsPerDay = {
    selectedMeals: [],
    calories: [100, 2000],
    fat: [0, 1500],
    carbs: [10, 1500],
    fiber: [0, 0],
    sugar: [0, 0],
    protein: [10, 150],
    includeIngredients: [],
    excludeIngredients: [],
    repeatMeals:false
    // budget: [10, 3000]
  }
  const [showModalmealplanpopup, setShowModalmealplanpopup] = useState(false)
  const [showModaladdsnack, setShowModaladdsnack] = useState(false)
  const [showperdaymeal, setShowperdaymeal] = useState(false)
  const [showsharemodal, setShowsharemodal] = useState(false)
  const [showsharemodal2, setShowsharemodal2] = useState(false)
  const [showcalendarmodal, setShowcalendarmodal] = useState(false)
  const [showmealModal, setShowmealModal] = useState(false)
  const [userId, setUserId] = useState()
  const [addSnackTitle, setAddSnackTitle] = useState()
  const [filterSnack, setFilterSnack] = useState(initialFilterSnack)
  const [recipes, setRecipes] = useState(null)
  const [recipePrevPageLink, setRecipePrevPageLink] = useState()
  const [recipeNextPageLink, setRecipeNextPageLink] = useState()
  // const [totalPages, setTotalPages] = useState()
  // const [totalRecords, setTotalRecords] = useState()
  const [tempSelectedDate, setTempSelectedDate] = useState()
  const [selectedDate, setSelectedDate] = useState()
  const [dates, setDates] = useState([]);
  const [days, setDays] = useState([])
  const [mealsPerDay, setMealsPerday] = useState(initialMealsPerDay)
  const [mealPlan, setMealPlan] = useState(null)
  const [mealPlanTitle, setMealPlanTitle] = useState(null)
  const [mealPlanId, setMealPlanId] = useState(null)
  const [mealSelectedDate, setMealSelectedDate] = useState(null)
  const [mealPlans, setMealPlans] = useState(null)
  const [ingredientsList, setIngredientsList] = useState([])
  const [tryrecipes, setTryrecipes] = useState([]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getalltrytoFavRecipes`);
        const data = await response.json();

        if (data.status) {
          const detailedRecipes = await Promise.all(
            data.data.map(async (recipe) => {
              const detailedResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/recipe/${recipe.recipeId}`);
              const detailedData = await detailedResponse.json();
              
              if (detailedData.status) {
                return detailedData.data; // Returning detailed recipe data
              } else {
                console.error(detailedData.message);
                return null; // Return null if fetching details fails
              }
            })
          );

          setTryrecipes(detailedRecipes.filter(recipe => recipe !== null));
        } else {
          console.error(data.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

 
  const handleRecipes = (nextPageLink) => {
    // if (!filterSnack?.search){
    //   alert('Search value should not blank')
    //   return
    // }
    if (nextPageLink) {
      const response = axios.get(nextPageLink)
        .then(res => {
          console.log('recipes', res?.data)
          setRecipes(res?.data)
          setRecipeNextPageLink(res?.data?._links?.next?.href)
        }).catch(error => console.log(error))
    } else {
      console.log('kkkkkkkkkk', `https://api.edamam.com/api/recipes/v2?type=any&q=${filterSnack.search}&app_id=${process.env.REACT_APP_EDAMAM_RECIPE_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_RECIPE_APP_KEY}&calories=${filterSnack.calories[0] + '-' + filterSnack.calories[1]}${addSnackTitle ? `&mealType=${addSnackTitle}&` : '&'}time=${encodeURIComponent(filterSnack.duration[0] + '-' + filterSnack.duration[1])}&${encodeURIComponent(`nutrients[PROCNT]`)}=${filterSnack.protein[0] + '-' + filterSnack.protein[1]}`)

      const response = axios.get(`https://api.edamam.com/api/recipes/v2?type=any&q=${filterSnack.search}&app_id=${process.env.REACT_APP_EDAMAM_RECIPE_APP_ID}&app_key=${process.env.REACT_APP_EDAMAM_RECIPE_APP_KEY}&calories=${filterSnack.calories[0] + '-' + filterSnack.calories[1]}${addSnackTitle ? `&mealType=${addSnackTitle === 'Snack-1' ? 'snack' : addSnackTitle === 'Snack-2' ? 'snack' : addSnackTitle === 'Snack-3' ? 'snack' : addSnackTitle}&` : '&'}time=${encodeURIComponent(filterSnack.duration[0] + '-' + filterSnack.duration[1])}&${encodeURIComponent(`nutrients[PROCNT]`)}=${filterSnack.protein[0] + '-' + filterSnack.protein[1]}`)
        .then(res => {
          console.log('recipes', res?.data)
          setRecipes(res?.data)
          setRecipeNextPageLink(res?.data?._links?.next?.href)
        }).catch(error => console.log(error))
    }
  }

  const saveMealPlan = async () => {
    if (!mealPlanTitle) {
      toast.error('Meal plan title should not blank')
      return
    }
    // if (mealPlanId) {
    //   const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/updateMealPlan`, {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify({ id: mealPlanId, userId: user?._id, mealPlan: mealPlan, meal:mealPlans })
    //   }).then(res => res.json())

    //   if (res.status) {
    //     setShowperdaymeal(false)
    //     toast.success(res.message)
    //   }
    // } else {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/createMealPlan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ userId: userId, title: mealPlanTitle, days: days, mealPlan: mealPlan, meal: mealPlans })
    }).then(res => res.json())

    if (res.status) {
      setMealPlanId(res?.data?._id)
      toast.success(res.message)
      setShowModalmealplanpopup(false)
    } else {
      toast.error(res.message)
    }
  }



  function redirectToLogin() {
    // Must define all scopes needed for application
    const scope = encodeURIComponent('product.compact cart.basic:rw profile.compact');
    // Build authorization URL
    const url =
      // Base URL (https://api.kroger.com/v1/connect/oauth2)
      `https://api-ce.kroger.com/v1/connect/oauth2/authorize?` +
      // ClientId (specified in .env file)
      `client_id=testsaasapp-8200c5b8f2d2abb7207900ab9a208dab4486267705865591304` +
      // Pre-configured redirect URL (http://localhost:3000/callback)
      `&redirect_uri=${encodeURIComponent('https://api.freshgains.com/kroger/callback')}` +
      // Grant type
      `&response_type=code` +
      // Scope specified above
      `&scope=${encodeURIComponent('product.compact cart.basic:write profile.compact')}`;
    // Browser redirects to the OAuth2 /authorize page
    window.location = url;
  }


  const handleKrogerLogin = () => {
    // Redirect the user to the Kroger authorization endpoint
    window.location.href = 'https://api-ce.kroger.com/v1/connect/oauth2/authorize' +
      `?scope=${encodeURIComponent('product.compact cart.basic:write profile.compact')}&response_type=code&client_id=${'testsaasapp-8200c5b8f2d2abb7207900ab9a208dab4486267705865591304'}&redirect_uri=${'https://api.freshgains.com/kroger/callback'}`;
  };
  // }

  // const updateMealPlanTitle = async () => {
  //   const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/updateMealPlanTitle`,{
  //     method:'POST',
  //     headers:{
  //       'Content-Type':'application/json'
  //     },
  //     body:JSON.stringify({id:mealPlanId,title:mealPlanTitle})
  //   }).then(res => res.json())

  //   if (res.status) {
  //     setShowModalmealplanpopup(false)
  //     toast.success(res.message)
  //   }else{
  //     setShowModalmealplanpopup(false)
  //     toast.error(res.message)
  //   }
  // }

  const handleFilterSnackInput = (e) => {
    const { name, value } = e.target
    const newValue = value.split(',').map(item => item.trim())
    const updatedValues = { ...filterSnack, [name]: newValue };
    setFilterSnack(updatedValues)
  }

  const handleFilterSnackRange = (e) => {
    const { name, value } = e.target
    const updatedValues = { ...filterSnack, [name]: value };
    setFilterSnack(updatedValues)
  }

  const generateDatesAndMealPlans = () => {
    const newDates = selectedDate ? [...Array(7)].map((_, i) => selectedDate.clone().add(i, 'days')) : [...Array(7)].map((_, i) => moment().clone().add(i, 'days'));
    const daysOfWeek = newDates.map(date => date.format('dddd'));
    if (!mealPlans) {
      const newMealPlans = {}
      // Attach meal plans to the dates (adjust this as needed)
      newDates.forEach((date) => {
        newMealPlans[date.format('YYYY-MM-DD')] = {
          Breakfast: null,
          'Snack-1': null,
          Lunch: null,
          'Snack-2': null,
          Dinner: null,
          'Snack-3': null,
        };
      });

      setDates(newDates);
      setDays(daysOfWeek)
      setMealPlans(newMealPlans);
      setShowcalendarmodal(false);
    } else {
      const newMealPlans = {}
      newDates.forEach((date, i) => {
        const formattedDate = date.format('YYYY-MM-DD');
        const mealData = mealPlans[formattedDate] || {};
        newMealPlans[formattedDate] = mealData;
      });

      setDates(newDates);
      setDays(daysOfWeek)
      setMealPlans(newMealPlans);
      setShowcalendarmodal(false);
    }
  }

  const handleIngredients = () => {
    const ingredientsByCategory = new Map();

    // Loop through the dates
    for (const date in mealPlans) {
      if (mealPlans.hasOwnProperty(date)) {
        const dateData = mealPlans[date];

        // Define an array of meal categories to consider
        const mealCategories = ['Breakfast', 'Snack-1', 'Lunch', 'Snack-2', 'Dinner', 'Snack-3'];

        for (const mealCategory of mealCategories) {
          if (dateData && dateData[mealCategory] && dateData[mealCategory].recipe) {
            const ingredients = dateData[mealCategory].recipe.ingredients;

            for (const ingredient of ingredients) {
              const foodCategory = ingredient.foodCategory;
              const food = ingredient.food;
              const quantity = ingredient.quantity;
              const measure = ingredient.measure;

              // If the food exists in the ingredientsByCategory map, add the quantity
              if (ingredientsByCategory.has(foodCategory)) {
                const existingIngredients = ingredientsByCategory.get(foodCategory);
                const existingIngredient = existingIngredients.find((item) => item.food.toLowerCase() === food.toLowerCase());

                if (existingIngredient) {
                  existingIngredient.quantity += quantity;
                } else {
                  existingIngredients.push({
                    food: food,
                    quantity: quantity.toFixed(2),
                    foodCategory: foodCategory,
                    measure: measure,
                  });
                }
              } else {
                // Otherwise, create a new category entry
                ingredientsByCategory.set(foodCategory, [{
                  food: food,
                  quantity: quantity.toFixed(2),
                  foodCategory: foodCategory,
                  measure: measure,
                }]);
              }
            }
          }
        }
      }
    }

    // Convert the map to a single array
    const reducedIngredientsByCategory = Array.from(ingredientsByCategory, ([category, ingredients]) => ({
      category: category,
      ingredients: ingredients,
    }));

    console.log(reducedIngredientsByCategory);

    //   console.log(categoriesArray);

    setIngredientsList(reducedIngredientsByCategory)




  }


  //   setDates(newDates);
  //   setMealPlans(newMealPlans);
  //   setShowcalendarmodal(false);
  // };

  useEffect(() => {
    // Function to generate new dates and attach meal plans
    if (selectedDate) {
      generateDatesAndMealPlans();
    }
  }, [selectedDate]);


  const generateMealPlan = () => {
    setMealPlan(mealsPerDay)
    generateDatesAndMealPlans()
    setShowperdaymeal(false)
  }
 useEffect(() => {
    const generateMealPlan = () => {
      setMealPlan(mealsPerDay);
      generateDatesAndMealPlans();  
      //setShowperdaymeal(true)
    };

    // Call the generateMealPlan function
    generateMealPlan();
  }, [mealsPerDay]);
  console.log('mealplantitle', mealPlanTitle)
  console.log('mealsPerDay', mealsPerDay)
  console.log('mealPlans', mealPlans)
  console.log('ingredientsList', ingredientsList)
  // const handleDates = () => {
  //   const newDates = [...Array(7)].map((_, i) => selectedDate.clone().add(i, 'days'));
  //   console.log('newDates', newDates)
  //   setDates(newDates);
  //   setShowcalendarmodal(false)
  // }

  const handleMealsInput = (e) => {
    const { name, value } = e.target
    const newValue = value.split(',').map(item => item.trim())
    const updatedValues = { ...mealsPerDay, [name]: newValue };
    setMealsPerday(updatedValues)
  }

  const handleMealsRange = (e) => {
    const { name, value } = e.target
    const updatedValues = { ...mealsPerDay, [name]: value };
    setMealsPerday(updatedValues)
  }

  const handleMealsCheck = (e) => {
    const { value } = e.target
    if (mealsPerDay?.selectedMeals.includes(value)) {
      const updatedValue = mealsPerDay?.selectedMeals.filter(item => item != value)
      setMealsPerday({ ...mealsPerDay, selectedMeals: updatedValue })
    } else {
      const updatedValue = [...mealsPerDay?.selectedMeals, value]
      setMealsPerday({ ...mealsPerDay, selectedMeals: updatedValue })
    }
  }
  
  const handleRepeatMeals = () => {
    setMealsPerday((prevMeals) => ({
      ...prevMeals,
      repeatMeals: !prevMeals.repeatMeals,
    }));
  }

  // const generateMealPlan = () => {
  //   setMealPlan(mealsPerDay)
  // }

  const handleSelectedRecipe = (recipe) => {
    const newSelectedRecipes = { ...mealPlans };
    newSelectedRecipes[mealSelectedDate] = newSelectedRecipes[mealSelectedDate] || {};
    newSelectedRecipes[mealSelectedDate][addSnackTitle] = recipe// Replace with the actual recipe
    setMealPlans(newSelectedRecipes);
  }

  const handleRowClick = (index, mealTitle, date) => {
    setMealSelectedDate(date.format('YYYY-MM-DD'))
    if (mealTitle) {
      setShowModaladdsnack(true);
      setAddSnackTitle(mealTitle);
    }
  };

  // const handleFilterInputs = (e) => {
  //   const tagsString = e.target.value
  //   // Split the comma-separated string into an array of tags
  //   const newTags = tagsString.split(',').map(tag => tag.trim());

  //   // Create a new copy of the recipe object with updated tags
  //   const updatedRecipe = { ...filterSnack, tags: newTags };

  //   // Update the state with the new recipe object
  //   setRecipe(updatedRecipe);
  // };

  // useEffect(() => {

  // }, [selectedDate]);

  useEffect(() => {
    if (!filterSnack.search) {
      setRecipes([])
      setRecipeNextPageLink('')
    } else {
      handleRecipes()
    }
  }, [filterSnack.search])
 
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/')
    } else {
      setUserId(user?._id)
    }
   }, [user])
  //  const defaultMeals = ["Breakfast", "Lunch", "Dinner"];
 
 
   return (
    <div>
      <ToastContainer />
        
      <div className=" p-xl-2 p-3 main-content">
        <div className="meal-plan-header">
          <Button onClick={() => setShowperdaymeal(true)} className='bg-warning py-2 d-block text-center text-white rounded border-0'>Smart Meal Plan</Button>
          <Button onClick={() => setShowcalendarmodal(true)} className='purple py-2 d-block text-center text-white rounded border-0'>Change Start Date</Button>
          <Button onClick={() => { handleIngredients(); setShowmealModal(true) }} className='orange py-2 d-block text-center text-white rounded border-0'>View Shopping List</Button>
          <Button onClick={() => setShowsharemodal(true)} className='bg-info py-2 d-block text-center text-white rounded border-0'>Share</Button>
          <Button onClick={() => setShowModalmealplanpopup(true)} className='bg-green py-2 d-block text-center text-white rounded border-0'>Save</Button>
        </div>
         
               {/* 7days shows */}
          
        <div className="my-3">
          <div className="meal-data-grid shadow">
            {/* <p className="text-rotate-90 fw-600 mb-0">Breakfast</p> */}
            {dates.map((date, i) => (
              <MealData date={date} data={mealPlan} />
            ))}
          </div>
        </div>

              {/* breakfast , lunch , dinner */}

        <div className="bg-white p-5 rounded-4 shadow mt-3">
   {mealPlan?.selectedMeals && mealPlan?.selectedMeals.map((mealTitle, rowIndex) => (
    <div key={rowIndex} className="meal-planner-grid">
      <p className="text-rotate-90 fw-600 text-dark mb-0 text-center">
        {mealTitle}
      </p>

      {dates.map((date, columnIndex) => (
        <div className='meal-planner-item rounded-4 shadow' key={columnIndex} onClick={() => handleRowClick(rowIndex, mealTitle, date)}>
          {mealPlans[moment(date).format('YYYY-MM-DD')] && (
            <>
              <p className="text-align-left mb-0">
                {mealTitle}
              </p>
              <span className="green-line-2"></span>
              {mealPlans[moment(date).format('YYYY-MM-DD')][mealTitle]?.recipe && (
                <div className="meal-planner-image">
                  <img className="w-100 h-100 object-fit-cover"
                    src={mealPlans[moment(date).format('YYYY-MM-DD')][mealTitle]?.recipe?.image}
                    alt={mealTitle}
                  />
                  <p>
                    {mealPlans[moment(date).format('YYYY-MM-DD')][mealTitle]?.recipe?.label.length > 10 ? mealPlans[moment(date).format('YYYY-MM-DD')][mealTitle]?.recipe?.label.slice(0, 10) + ' ...' : mealPlans[moment(date).format('YYYY-MM-DD')][mealTitle]?.recipe?.label}
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      ))}
          </div>
        ))}
       </div>

        {/* I want to try this section */}
        <div className="bg-white p-5 rounded-4 shadow mt-3">
          <h3>I Want to Try This!</h3>

          
          <div className='p-xl-5 p-3'>
                    <Row>
                        <Col lg={12}>
                            
                            <div className='recipe-grid'>
                                {tryrecipes && tryrecipes?.length > 0 ? tryrecipes.map(item => (
                                    <Usertrytofavcard data={item} />
                                ))
                                    :
                                    <></>}

                            </div>
                        </Col>
                    </Row>
                </div>

          {/* {mealPlan?.selectedMeals && mealPlan?.selectedMeals.map((mealTitle, rowIndex) => (
            <div key={rowIndex} className="meal-planner-grid">
              <p className="text-rotate-90 fw-600 text-dark mb-0 text-center">
                {mealTitle}

              </p>

              {dates.map((date, columnIndex) => (
                <div className='meal-planner-item rounded-4 shadow' key={columnIndex} onClick={() => handleRowClick(rowIndex, mealTitle, date)}>
                  {mealPlans[moment(date).format('YYYY-MM-DD')] && (
                    <>
                      <p className="text-align-left mb-0">
                        {mealTitle}
                      </p>
                      <span className="green-line-2"></span>
                      {mealPlans[moment(date).format('YYYY-MM-DD')][mealTitle]?.recipe && (
                        <div className="meal-planner-image">
                          <img className="w-100 h-100 object-fit-cover"
                            src={mealPlans[moment(date).format('YYYY-MM-DD')][mealTitle]?.recipe?.image}
                            alt={mealTitle}
                          />
                          <p>
                            {mealPlans[moment(date).format('YYYY-MM-DD')][mealTitle]?.recipe?.label.length > 10 ? mealPlans[moment(date).format('YYYY-MM-DD')][mealTitle]?.recipe?.label.slice(0, 10) + ' ...' : mealPlans[moment(date).format('YYYY-MM-DD')][mealTitle]?.recipe?.label}
                          </p>
                        </div>

                      )}
                    </>
                  )}
                </div>
              ))}
            </div>
          ))} */}
        </div>
      </div>
            {/* save meal plan  */}
      <Modal aria-labelledby="contained-modal-title-vcenter"
        centered show={showModalmealplanpopup} size="lg" onHide={() => setShowModalmealplanpopup(false)}>
        <Modal.Header className='border-0' closeButton>

        </Modal.Header>
        <Modal.Body>
          <div className='text-center'>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label className="text-black fs-5">Name Your Meal Plan</Form.Label>
              <Form.Control type="text" placeholder="" value={mealPlanTitle} onChange={(e) => setMealPlanTitle(e.target.value)} />
            </Form.Group>
            <Button className='bg-white fs-5 text-green w-100 d-block py-2 custom-shadow custom-border Raleway mt-4 mb-2' onClick={saveMealPlan}>Save</Button>
          </div>
        </Modal.Body>
      </Modal>
              
          {/* add breakfast     */}
      <Modal aria-labelledby="contained-modal-title-vcenter"
        centered show={showModaladdsnack} size="xl" className="" onHide={() => setShowModaladdsnack(false)}>
        <Modal.Header className='border-0 pb-0' closeButton>
          <ModalTitle>Add {addSnackTitle}</ModalTitle>
        </Modal.Header>
        <Modal.Body>
          <Row>
            <Col lg={5}>
              <div className="rounded bg-white p-3 shadow Inter">
                <Form>
                  <Form.Group className="mb-0" controlId="formBasicEmail">
                    <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterSnack.duration[0]} Minutes</span><span className="fw-normal fs-6 text-black">{filterSnack.duration[1]} Minutes</span></Form.Label>
                    <Box sx={{ width: 300 }}>
                      <Slider
                        getAriaLabel={() => 'range'}
                        sx={{
                          width: 415,
                          height: 8,
                          color: '#80c522',
                        }}
                        min={0}
                        max={150}
                        name="duration"
                        value={filterSnack.duration}
                        onChange={handleFilterSnackRange}
                        valueLabelDisplay="auto"
                      // getAriaValueText={valuetext}
                      />
                    </Box>
                  </Form.Group>
                  <Form.Group className="mb-0" controlId="formBasicEmail">
                    <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterSnack.calories[0]} Calories</span><span className="fw-normal fs-6 text-black">{filterSnack.calories[1]} Calories</span></Form.Label>
                    <Box sx={{ width: 300 }}>
                      <Slider
                        getAriaLabel={() => 'range'}
                        sx={{
                          width: 415,
                          height: 8,
                          color: '#80c522',
                        }}
                        min={0}
                        max={2500}
                        name='calories'
                        value={filterSnack.calories}
                        onChange={handleFilterSnackRange}
                        valueLabelDisplay="auto"
                      // getAriaValueText={valuetext}
                      />
                    </Box>
                  </Form.Group>
                  <Form.Group className="mb-0" controlId="formBasicEmail">
                    <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterSnack.protein[0]} Protein</span><span className="fw-normal fs-6 text-black">{filterSnack.protein[1]} Protein</span></Form.Label>
                    <Box sx={{ width: 300 }}>
                      <Slider
                        getAriaLabel={() => 'range'}
                        sx={{
                          width: 415,
                          height: 8,
                          color: '#80c522',
                        }}
                        min={0}
                        max={200}
                        name='protein'
                        value={filterSnack.protein}
                        onChange={handleFilterSnackRange}
                        valueLabelDisplay="auto"
                      // getAriaValueText={valuetext}
                      />
                    </Box>
                  </Form.Group>
                  <Form.Group className="mb-0" controlId="formBasicEmail">
                    <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{filterSnack.carbs[0]} Carbs</span><span className="fw-normal fs-6 text-black">{filterSnack.carbs[1]} Carbs</span></Form.Label>
                    <Box sx={{ width: 300 }}>
                      <Slider
                        getAriaLabel={() => 'range'}
                        sx={{
                          width: 415,
                          height: 8,
                          color: '#80c522',
                        }}
                        min={0}
                        max={2000}
                        name="carbs"
                        value={filterSnack.carbs}
                        onChange={handleFilterSnackRange}
                        valueLabelDisplay="auto"
                      // getAriaValueText={valuetext}
                      />
                    </Box>
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="formBasicEmail">
                    <Form.Label className="fw-normal fs-6 text-black">Tags</Form.Label>
                    <Form.Control type="text" placeholder="" name='tags' value={filterSnack?.tags?.length > 0 ? filterSnack?.tags.map(item => { return item }) : ''} onChange={handleFilterSnackInput} />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="formBasicEmail">
                    <Form.Label className="fw-normal fs-6 text-black">Include ingredients</Form.Label>
                    <Form.Control type="text" placeholder="" name='includeIngredients' value={filterSnack?.includeIngredients?.length > 0 ? filterSnack?.includeIngredients.map(item => { return item }) : ''} onChange={handleFilterSnackInput} />
                  </Form.Group>
                  <Form.Group className="mb-2" controlId="formBasicEmail">
                    <Form.Label className="fw-normal fs-6 text-black">Exclude ingredients</Form.Label>
                    <Form.Control type="text" placeholder="" name='excludeIngredients' value={filterSnack?.excludeIngredients?.length > 0 ? filterSnack?.excludeIngredients.map(item => { return item }) : ''} onChange={handleFilterSnackInput} />
                  </Form.Group>
                </Form>
                <Button className='bg-green fs-6 text-white border-0 w-100 d-block py-2 custom-shadow Raleway mt-4 mb-2' disabled={!filterSnack.search} onClick={() => { setRecipeNextPageLink(null); handleRecipes() }}>Filter Recipes</Button>
              </div>
            </Col>
            <Col lg={7}>
              <div className="rounded shadow bg-white p-3 Inter">
                <div className="d-flex justify-content-between align-items-center">
                  <p className="">Recipes</p>
                  <p>{recipes?.from}-{recipes?.to} of {recipes?.count} recipes</p>
                </div>
                <InputGroup className="mb-3 border rounded bg-grey">
                  <InputGroup.Text className="bg-none border-0 pe-0" id="basic-addon1"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-search" viewBox="0 0 16 16">
                    <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
                  </svg></InputGroup.Text>
                  <Form.Control
                    placeholder="Search"
                    type="search"
                    className="shadow-none outline-0 bg-none border-0"
                    aria-label=""
                    aria-describedby="basic-addon1"
                    onChange={(e) => { setFilterSnack({ ...filterSnack, search: e.target.value }) }}
                  />
                </InputGroup>
                <div className="modal-filter-diet">
                  {recipes?.hits && recipes?.hits?.length > 0
                    ?
                    recipes?.hits?.map((recipe, i) => (
                      <>
                        <div className="d-flex gap-2 align-items-center" onClick={() => { handleSelectedRecipe(recipe); setShowModaladdsnack(false) }}>
                          <div className='food-img'><img className='w-100 h-100' src={recipe?.recipe?.images?.THUMBNAIL?.url} /></div>
                          <div>
                            <h5 className="mb-0 fs-6 text-black fw-600">{recipe?.recipe?.label}</h5>
                            <p className="mb-0 fs-15 text-muted">
                              {`calories ${parseInt(recipe?.recipe?.calories)}, 
                            Fat ${parseInt(recipe?.recipe?.totalNutrients?.FAT.quantity)}${recipe?.recipe?.totalNutrients?.FAT.unit}, 
                            Carbs ${parseInt(recipe?.recipe?.totalNutrients?.CHOCDF.quantity)}${recipe?.recipe?.totalNutrients?.CHOCDF.unit}, 
                            Protein ${parseInt(recipe?.recipe?.totalNutrients?.PROCNT?.quantity)}${recipe?.recipe?.totalNutrients?.PROCNT?.unit}`}
                            </p>
                          </div>
                        </div>
                        <hr />
                      </>
                    ))
                    :
                    <></>
                  }
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'right', gap: '10px' }}>
                  {/* <Button className='bg-green fs-6 text-white border-0 w-2 d-block py-2 custom-shadow Raleway mt-4 mb-2' disabled={!recipePrevPageLink}>{'<'}</Button> */}
                  <Button className='bg-green fs-6 text-white border-0 w-2 d-block py-2 custom-shadow Raleway mt-4 mb-2' onClick={() => handleRecipes(recipeNextPageLink)}>{'>'}</Button>
                </div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
      
      {/* Smart  Meal Plan */}
      <Modal aria-labelledby="contained-modal-title-vcenter"
        centered show={showperdaymeal} size="md" onHide={() => setShowperdaymeal(false)}>
        <Modal.Header className=' border-0 pb-0' closeButton>
          <ModalTitle>Meals Per Day</ModalTitle>
        </Modal.Header>
        <Modal.Body >
          <Form>
            <Row className="mb-2">
              <Col lg={4}>
                <Form.Group controlId="formBasicCheckbox">
                  <Form.Check type="checkbox" className="fw-normal fs-6 text-black" checked={mealsPerDay?.selectedMeals?.includes('Breakfast')} value='Breakfast' label="Breakfast" onChange={handleMealsCheck} />
                </Form.Group>
              </Col>
              <Col lg={4}>
                <Form.Group controlId="formBasicCheckbox1">
                  <Form.Check type="checkbox" className="fw-normal fs-6 text-black" checked={mealsPerDay?.selectedMeals?.includes('Snack-1')} value='Snack-1' label="Snack-1" onChange={handleMealsCheck} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4}>
                <Form.Group controlId="formBasicCheckbox2">
                  <Form.Check type="checkbox" className="fw-normal fs-6 text-black" checked={mealsPerDay?.selectedMeals?.includes('Lunch')} value='Lunch' label="Lunch" onChange={handleMealsCheck} />
                </Form.Group>
              </Col>
              <Col lg={4}>
                <Form.Group controlId="formBasicCheckbox3">
                  <Form.Check type="checkbox" className="fw-normal fs-6 text-black" checked={mealsPerDay?.selectedMeals?.includes('Snack-2')} value='Snack-2' label="Snack-2" onChange={handleMealsCheck} />
                </Form.Group>
              </Col>
            </Row>
            <Row className="mb-2">
              <Col lg={4}>
                <Form.Group controlId="formBasicCheckbox4">
                  <Form.Check type="checkbox" className="fw-normal fs-6 text-black" checked={mealsPerDay?.selectedMeals?.includes('Dinner')} value='Dinner' label="Dinner" onChange={handleMealsCheck} />
                </Form.Group>
              </Col>
              <Col lg={4}>
                <Form.Group controlId="formBasicCheckbox5">
                  <Form.Check type="checkbox" className="fw-normal fs-6 text-black" checked={mealsPerDay?.selectedMeals?.includes('Snack-3')} value='Snack-3' label="Snack-3" onChange={handleMealsCheck} />
                </Form.Group>
              </Col>
            </Row>
            <h6>Daily Targets</h6>
            <Form.Group className="mb-0" controlId="formBasicEmail">
              <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{mealsPerDay.calories[0]} Calories</span><span className="fw-normal fs-6 text-black">{mealsPerDay.calories[1]} Calories</span></Form.Label>
              <Box sx={{ width: 450 }}>
                <Slider
                  getAriaLabel={() => 'range'}
                  sx={{
                    width: 450,
                    height: 8,
                    color: '#80c522',
                  }}
                  min={0}
                  max={2500}
                  step={10}
                  name="calories"
                  value={mealsPerDay.calories}
                  onChange={handleMealsRange}
                  valueLabelDisplay="auto"
                // getAriaValueText={valuetext}
                />
              </Box>
            </Form.Group>
            <Form.Group className="mb-0" controlId="formBasicEmail">
              <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{mealsPerDay.protein[0]} Protein</span><span className="fw-normal fs-6 text-black">{mealsPerDay.protein[1]} Protein</span></Form.Label>
              <Box sx={{ width: 450 }}>
                <Slider
                  getAriaLabel={() => 'range'}
                  sx={{
                    width: 450,
                    height: 8,
                    color: '#80c522',
                  }}
                  min={0}
                  max={150}
                  step={5}
                  name="protein"
                  value={mealsPerDay.protein}
                  onChange={handleMealsRange}
                  valueLabelDisplay="auto"
                // getAriaValueText={valuetext}
                />
              </Box>
            </Form.Group>
            <Form.Group className="mb-0" controlId="formBasicEmail">
              <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{mealsPerDay.carbs[0]} Carbs</span><span className="fw-normal fs-6 text-black">{mealsPerDay.carbs[1]} Carbs</span></Form.Label>
              <Box sx={{ width: 450 }}>
                <Slider
                  getAriaLabel={() => 'range'}
                  sx={{
                    width: 450,
                    height: 8,
                    color: '#80c522',
                  }}
                  min={0}
                  max={1500}
                  step={5}
                  name="carbs"
                  value={mealsPerDay.carbs}
                  onChange={handleMealsRange}
                  valueLabelDisplay="auto"
                // getAriaValueText={valuetext}
                />
              </Box>
            </Form.Group>

            <Form.Group className="mb-0" controlId="formBasicEmail">
              <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{mealsPerDay.fat[0]} Fats</span><span className="fw-normal fs-6 text-black">{mealsPerDay.fat[1]} Fats</span></Form.Label>
              <Box sx={{ width: 450 }}>
                <Slider
                  getAriaLabel={() => 'range'}
                  sx={{
                    width: 450,
                    height: 8,
                    color: '#80c522',
                  }}
                  min={0}
                  max={1500}
                  step={5}
                  name="fat"
                  value={mealsPerDay.fat}
                  onChange={handleMealsRange}
                  valueLabelDisplay="auto"
                // getAriaValueText={valuetext}
                />
              </Box>
            </Form.Group>

            <Form.Group className="mb-2" controlId="formBasicEmail">
              <Form.Label className="fw-normal fs-6 text-black">Tags</Form.Label>
              <Form.Control type="text" placeholder="" name='tags' value={mealsPerDay?.tags?.length > 0 ? mealsPerDay?.tags.map(item => { return item }) : ''} onChange={handleMealsInput} />
            </Form.Group>
            <Form.Group className="mb-2" controlId="formBasicEmail">
              <Form.Label className="fw-normal fs-6 text-black">Include ingredients</Form.Label>
              <Form.Control type="text" placeholder="" name='includeIngredients' value={mealsPerDay?.includeIngredients?.length > 0 ? mealsPerDay?.includeIngredients.map(item => { return item }) : ''} onChange={handleMealsInput} />
            </Form.Group>
            <Form.Group className="mb-2" controlId="formBasicEmail">
              <Form.Label className="fw-normal fs-6 text-black">Exclude ingredients</Form.Label>
              <Form.Control type="text" placeholder="" name='excludeIngredients' value={mealsPerDay?.excludeIngredients?.length > 0 ? mealsPerDay?.excludeIngredients.map(item => { return item }) : ''} onChange={handleMealsInput} />
            </Form.Group>
            <h6>Generator</h6>
              {/* <Form.Group className="mb-0" controlId="formBasicEmail">
                <Form.Label className="d-flex justify-content-between mb-0"><span className="fw-normal fs-6 text-black">{`${'$'}${mealsPerDay.budget[0]}.00`} </span><span className="fw-normal fs-6 text-black">{`${'$'}${mealsPerDay.budget[1]}.00`}</span></Form.Label>
                <Box sx={{ width: 450 }}>
                  <Slider
                    getAriaLabel={() => 'range'}
                    sx={{
                      width: 450,
                      height: 8,
                      color: '#80c522',
                    }}
                    min={0}
                    max={3000}
                    step={10}
                    name="budget"
                    value={mealsPerDay.budget}
                    onChange={handleMealsRange}
                    valueLabelDisplay="auto"
                  // getAriaValueText={valuetext}
                  />
                </Box>
              </Form.Group> */}
            <Form.Group controlId="formBasicCheckbox">
              <Form.Check type="checkbox" className="fw-normal fs-6 text-black" checked={mealsPerDay?.repeatMeals} label="Repeat Meals" onChange={handleRepeatMeals} />
            </Form.Group>
          </Form>
          <Button className='bg-green fs-6 text-white border-0 w-100 d-block py-2 custom-shadow Raleway mt-4 mb-2' onClick={generateMealPlan}>Generate Meal Plan</Button>
        </Modal.Body>
      </Modal>

      <Modal aria-labelledby="contained-modal-title-vcenter"
        centered show={showsharemodal} size="lg" onHide={() => setShowsharemodal(false)}>
        <Modal.Header className=' border-0 pb-0' closeButton>
        </Modal.Header>
        <Modal.Body >
          <div className="text-center">
            <p className="text-dark fw-600 fs-2 mt-3 mb-0">
              Did you know...
            </p>
            <p className="text-dark fw-600 fs-6 mt-1 mb-0 w-75 mx-auto">
              You earn up to $75.00 anytime some joins FreshGains by
              clicking a link you;ve shared on social media?
            </p>
            <div className="my-3">
              <Link
                to="/"
                className="text-decoration-none d-inline-block"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                >
                  <g clip-path="url(#clip0_79_20846)">
                    <path
                      d="M29.2717 32C30.2281 32 31.381 31.7552 32.0135 31.0378C32.4884 30.4993 32.4998 29.8634 32.4998 29.1454V2.60412C32.4998 2.06373 32.1682 1.40066 31.7658 1.04003C31.0281 0.378996 30.0549 0 29.0643 0H3.49554C2.70274 0 2.04321 0.150309 1.48157 0.709852C0.902287 1.28696 0.5 2.21919 0.5 3.03689V28.9567C0.5 29.7991 0.624974 30.6835 1.22061 31.2792C1.81628 31.8749 2.70082 31.9999 3.54324 31.9999L29.2717 32Z"
                      fill="#485A96"
                    />
                    <path
                      d="M22.5794 32.0009V19.6088H26.7389L27.3616 14.7793H22.5793V11.6959C22.5793 10.2977 22.9675 9.34488 24.9727 9.34488L27.53 9.34368V5.02426C27.0877 4.96551 25.5695 4.83398 23.8035 4.83398C20.1163 4.83398 17.592 7.08458 17.592 11.2178V14.7793H13.4219V19.6088H17.592V32.0008L22.5794 32.0009Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_79_20846">
                      <rect
                        width="32"
                        height="32"
                        fill="white"
                        transform="translate(0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Link
                to="/"
                className="mx-2 text-decoration-none d-inline-block"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                >
                  <g clip-path="url(#clip0_79_20849)">
                    <path
                      d="M27.7 0H5.3C2.64903 0 0.5 2.14903 0.5 4.8V27.2C0.5 29.851 2.64903 32 5.3 32H27.7C30.351 32 32.5 29.851 32.5 27.2V4.8C32.5 2.14903 30.351 0 27.7 0Z"
                      fill="#1DA1F2"
                    />
                    <path
                      d="M27.8125 9.50083C27.0625 9.87583 26.1875 10.1258 25.3125 10.2508C26.25 9.68833 26.9375 8.81333 27.3125 7.75083C26.4375 8.25083 25.5 8.62583 24.5 8.81333C23.8199 8.11672 22.9321 7.65948 21.9701 7.51023C21.008 7.36098 20.0235 7.52776 19.1642 7.98555C18.305 8.44334 17.6174 9.16744 17.2047 10.0492C16.7919 10.9309 16.6762 11.9228 16.875 12.8758C13.375 12.6883 10 11.0633 7.8125 8.25083C7.51485 8.72624 7.31425 9.25586 7.22226 9.80917C7.13027 10.3625 7.14872 10.9285 7.27654 11.4747C7.40436 12.0208 7.63903 12.5363 7.96701 12.9913C8.29498 13.4463 8.70979 13.8319 9.1875 14.1258C8.5 14.1258 7.8125 14.0008 7.1875 13.6883C7.25 15.7508 8.6875 17.5633 10.6875 18.0008C10.0625 18.1883 9.375 18.1883 8.6875 18.0633C9.3125 19.8758 11 21.1258 12.875 21.1883C11.0625 22.6883 8.625 23.3758 6.3125 23.0008C8.24495 24.2903 10.4999 25.0128 12.8219 25.0864C15.144 25.16 17.4402 24.5818 19.4504 23.4173C21.4606 22.2528 23.1046 20.5485 24.1959 18.4976C25.2872 16.4467 25.7822 14.1312 25.625 11.8133C26.5 11.1883 27.25 10.4383 27.8125 9.50083Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_79_20849">
                      <rect
                        width="32"
                        height="32"
                        fill="white"
                        transform="translate(0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Link
                to="/"
                className="text-decoration-none d-inline-block"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="33"
                  height="32"
                  viewBox="0 0 33 32"
                  fill="none"
                >
                  <g clip-path="url(#clip0_79_20852)">
                    <path
                      d="M27.7 0H5.3C2.64903 0 0.5 2.14903 0.5 4.8V27.2C0.5 29.851 2.64903 32 5.3 32H27.7C30.351 32 32.5 29.851 32.5 27.2V4.8C32.5 2.14903 30.351 0 27.7 0Z"
                      fill="#BD081B"
                    />
                    <path
                      d="M17.0625 3.5C10.25 3.5 6.8125 8.375 6.8125 12.5C6.8125 14.9375 7.75 17.125 9.75 17.9375C10.0625 18.0625 10.375 17.9375 10.5 17.625L10.75 16.4375C10.875 16.0625 10.8125 15.9375 10.5625 15.625C10 14.9375 9.625 14.0625 9.625 12.8125C9.625 9.1875 12.3125 5.9375 16.6875 5.9375C20.5625 5.9375 22.6875 8.3125 22.6875 11.4375C22.6875 15.625 20.8125 19.0625 18.125 19.0625C16.625 19.0625 15.5 17.875 15.875 16.3125C16.25 14.5 17.125 12.5625 17.125 11.25C17.125 10.0625 16.5 9.0625 15.1875 9.0625C13.625 9.0625 12.4375 10.6875 12.4375 12.8125C12.4375 14.125 12.875 15.0625 12.875 15.0625L11 22.875C10.5 25.1875 10.9375 28.0625 11 28.3125C11 28.5 11.25 28.5625 11.3125 28.4375C11.4375 28.25 13.3125 26 13.9375 23.75L14.9375 19.75C15.4375 20.75 16.875 21.5625 18.4375 21.5625C23.0625 21.5625 26.1875 17.375 26.1875 11.75C26.1875 7.4375 22.5625 3.5 17.0625 3.5Z"
                      fill="white"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_79_20852">
                      <rect
                        width="32"
                        height="32"
                        fill="white"
                        transform="translate(0.5)"
                      />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
            </div>
            <div className="mx-5 mb-4 border rounded d-flex align-items-center p-2 gap-3 bg-white">
              <InputGroup className="">
                <InputGroup.Text className="border-0 bg-white" id="basic-addon1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="25"
                    height="25"
                    viewBox="0 0 25 25"
                    fill="none"
                  >
                    <path
                      d="M13.2845 18.0809C13.3894 18.1854 13.4726 18.3096 13.5294 18.4463C13.5862 18.5831 13.6154 18.7297 13.6154 18.8777C13.6154 19.0258 13.5862 19.1724 13.5294 19.3092C13.4726 19.4459 13.3894 19.5701 13.2845 19.6746L12.7276 20.2315C11.6724 21.2867 10.2412 21.8795 8.74887 21.8795C7.25655 21.8795 5.82535 21.2867 4.77012 20.2315C3.71489 19.1763 3.12207 17.7451 3.12207 16.2527C3.12207 14.7604 3.71489 13.3292 4.77012 12.274L7.03137 10.0137C8.04526 8.99727 9.40941 8.40701 10.8444 8.36378C12.2794 8.32055 13.6766 8.82764 14.7498 9.78117C14.8606 9.87966 14.9509 9.99901 15.0156 10.1324C15.0803 10.2658 15.1181 10.4106 15.1268 10.5586C15.1355 10.7066 15.1149 10.8549 15.0663 10.9949C15.0178 11.135 14.9421 11.2641 14.8436 11.3749C14.7451 11.4857 14.6257 11.576 14.4923 11.6407C14.3589 11.7054 14.2141 11.7432 14.0661 11.7519C13.9181 11.7606 13.7698 11.74 13.6298 11.6915C13.4897 11.6429 13.3606 11.5672 13.2498 11.4687C12.6062 10.8971 11.7686 10.593 10.9082 10.6186C10.0479 10.6443 9.2298 10.9976 8.62137 11.6065L6.362 13.864C5.72896 14.497 5.37332 15.3556 5.37332 16.2509C5.37332 17.1461 5.72896 18.0047 6.362 18.6377C6.99504 19.2708 7.85362 19.6264 8.74887 19.6264C9.64412 19.6264 10.5027 19.2708 11.1357 18.6377L11.6926 18.0809C11.7971 17.9763 11.9212 17.8933 12.0578 17.8367C12.1943 17.7801 12.3407 17.7509 12.4886 17.7509C12.6364 17.7509 12.7828 17.7801 12.9194 17.8367C13.0559 17.8933 13.18 17.9763 13.2845 18.0809ZM20.2295 4.76836C19.1734 3.71475 17.7425 3.12305 16.2507 3.12305C14.759 3.12305 13.3281 3.71475 12.272 4.76836L11.7151 5.32523C11.5038 5.53658 11.385 5.82322 11.385 6.12211C11.385 6.42099 11.5038 6.70764 11.7151 6.91898C11.9265 7.13033 12.2131 7.24906 12.512 7.24906C12.8109 7.24906 13.0975 7.13033 13.3089 6.91898L13.8657 6.36211C14.4988 5.72907 15.3574 5.37343 16.2526 5.37343C17.1479 5.37343 18.0065 5.72907 18.6395 6.36211C19.2725 6.99515 19.6282 7.85373 19.6282 8.74898C19.6282 9.64423 19.2725 10.5028 18.6395 11.1359L16.3792 13.3971C15.7702 14.0057 14.9517 14.3586 14.0911 14.3835C13.2305 14.4084 12.393 14.1035 11.7498 13.5312C11.639 13.4327 11.5099 13.357 11.3698 13.3084C11.2298 13.2598 11.0815 13.2393 10.9335 13.248C10.7855 13.2567 10.6407 13.2944 10.5073 13.3591C10.3739 13.4238 10.2546 13.5141 10.1561 13.6249C10.0576 13.7357 9.98187 13.8648 9.93327 14.0049C9.88468 14.145 9.86415 14.2932 9.87286 14.4412C9.88156 14.5892 9.91933 14.734 9.98401 14.8674C10.0487 15.0008 10.139 15.1202 10.2498 15.2187C11.3223 16.172 12.7186 16.6794 14.1529 16.637C15.5872 16.5947 16.9511 16.0058 17.9654 14.9909L20.2267 12.7305C21.2815 11.6747 21.8743 10.2434 21.8748 8.75097C21.8753 7.2585 21.2836 5.82681 20.2295 4.77023V4.76836Z"
                      fill="black"
                    />
                  </svg>
                </InputGroup.Text>
                <Form.Control
                  className="border-0 shadow-none outline-0 fw-600 text-dark"
                  placeholder="https://codepen.io/coding_dev"
                  aria-label=""
                  aria-describedby="basic-addon1"
                />
              </InputGroup>
              <Button className="bg-green custom-shadow text-white fs-6 fw-600 d-block  ms-auto px-3 border-0 py-2">
                Copy
              </Button>
            </div>
            <span className="bg-green custom-shadow text-white fs-15 fw-600 d--inline-block ms-auto px-2 border-0 py-1">Helpful Tip: Most high earning members link to FreshGains from Insagram</span>
          </div>

        </Modal.Body>
      </Modal>

      <Modal className="grocery-store-modal" aria-labelledby="contained-modal-title-vcenter"
        centered show={showsharemodal2} size="md" onHide={() => setShowsharemodal2(false)}>
        <Modal.Header className=' border-0 pb-0' closeButton>
        </Modal.Header>
        <Modal.Body >
          <div className="text-center">
            <p className="text-dark fw-600 fs-2 mt-3 mb-0">
              Select your grocery store
            </p>
            <div className="my-3 grocery-svg-logo">
              <Link
                to="/"
                className="text-decoration-none d-inline-block"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="180" height="37" viewBox="0 0 180 37" fill="none">
                  <g clip-path="url(#clip0_80_3704)">
                    <path d="M107.436 0.165017C107.049 0.24568 106.306 0.498192 105.783 0.726154C105.261 0.954116 104.568 1.43634 104.245 1.79758C103.921 2.15881 103.577 2.75151 103.482 3.11274C103.385 3.47397 103.306 4.77687 103.306 6.00611L103.304 8.24189H100.842V10.3462H103.304C103.315 21.5479 103.29 22.0301 103.002 22.3036C102.798 22.4965 102.321 22.6175 101.634 22.6544L100.579 22.7087V24.6376L110.513 24.7253V22.621C107.485 22.621 107.325 22.586 107.083 22.2265C106.859 21.8951 106.819 20.9166 106.819 16.089L106.821 10.3462L111.305 10.2585V8.32957L106.821 8.24189C106.821 4.228 106.884 3.64407 107.128 3.15658C107.32 2.77606 107.686 2.4271 108.096 2.23596C108.481 2.0571 108.975 1.96592 109.282 2.01677C109.787 2.10094 109.798 2.12198 109.544 2.499C109.398 2.71644 109.277 3.16886 109.275 3.50729C109.272 3.85625 109.425 4.32971 109.629 4.60326C109.824 4.86805 110.262 5.1644 110.601 5.26085C111.002 5.37483 111.415 5.37658 111.788 5.26611C112.103 5.17317 112.556 4.88909 112.799 4.63483C113.105 4.31393 113.258 3.92639 113.306 3.35824C113.348 2.83743 113.269 2.33767 113.086 1.97293C112.928 1.65905 112.542 1.21715 112.228 0.989187C111.913 0.761225 111.378 0.48241 111.041 0.370183C110.701 0.257955 109.91 0.133453 109.282 0.0913675C108.653 0.0510358 107.823 0.0843533 107.436 0.165017ZM162.473 0.79805C161.215 0.922552 160.127 1.02952 160.055 1.03829C159.983 1.0453 159.923 1.48544 159.923 2.01677V2.98123C161.836 2.97596 162.383 3.06189 162.52 3.19691C162.694 3.37051 162.742 5.45198 162.74 12.7573C162.736 21.0148 162.705 22.1248 162.46 22.358C162.277 22.5316 161.827 22.621 161.141 22.621H160.099V24.7253H169.066V22.621C166.823 22.5386 166.678 22.4878 166.473 22.095C166.299 21.7618 166.255 20.643 166.292 17.448C166.339 13.471 166.362 13.1992 166.737 12.4943C166.983 12.0313 167.449 11.5491 167.967 11.2177C168.426 10.9266 169.079 10.6109 169.418 10.518C169.756 10.4251 170.309 10.3497 170.649 10.3514C170.986 10.3532 171.6 10.5092 172.012 10.7004C172.428 10.895 172.914 11.3001 173.111 11.6175C173.439 12.1523 173.46 12.4978 173.462 17.2289C173.462 21.0762 173.409 22.3019 173.242 22.4001C173.121 22.472 172.587 22.5702 172.056 22.6193L171.088 22.7087V24.6376L179.616 24.7253V22.621C177.86 22.6316 177.515 22.5509 177.292 22.3194C177.018 22.0371 176.988 21.4865 176.989 16.659V11.3106C176.182 9.7517 175.692 9.15724 175.21 8.79776C174.781 8.47686 173.993 8.09108 173.462 7.94203C172.812 7.75966 172.064 7.69829 171.176 7.7544C170.295 7.80876 169.566 7.97535 168.978 8.25241C168.495 8.48037 167.684 9.08359 167.176 9.59388L166.253 10.5215V0.526249C165.094 0.56132 163.73 0.673548 162.473 0.79805Z" fill="#4C9E45" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M7.64981 7.73163C8.69427 7.71585 9.48904 7.8123 10.2873 8.05429C10.9502 8.25595 11.7257 8.6505 12.1336 8.99244C12.5204 9.3186 12.9952 9.89377 13.1886 10.2725C13.5051 10.8915 13.5491 11.4159 13.6335 15.5192C13.7144 19.4454 13.7706 20.1521 14.0361 20.6045C14.2067 20.8938 14.5214 21.3988 15.1228 22.323L13.804 23.5189C13.0145 24.2343 12.327 24.7166 12.0896 24.7201C11.8259 24.7236 11.4162 24.4079 10.0236 22.814L9.23232 23.4417C8.79625 23.7872 8.08412 24.2343 7.64981 24.436C7.03966 24.7166 6.49809 24.8007 5.27604 24.806C3.87463 24.813 3.59329 24.7586 2.81435 24.3325C2.3308 24.0677 1.75758 23.6153 1.53954 23.3242C1.32151 23.0331 1.02435 22.4615 0.876644 22.0512C0.728943 21.6408 0.609375 20.7921 0.609375 20.1661C0.609375 19.5383 0.734218 18.6703 0.885436 18.2372C1.03841 17.8023 1.35667 17.1921 1.59405 16.8782C1.82967 16.5643 2.35893 16.0803 2.77039 15.8032C3.18184 15.5262 4.03112 15.1404 4.66061 14.9493C5.28834 14.7564 6.61414 14.5109 9.40816 14.204V13.2834C9.4064 12.6714 9.28859 12.1716 9.05649 11.7929C8.8279 11.4229 8.47271 11.1511 8.04544 11.0195C7.54606 10.8652 7.20494 10.8652 6.63876 11.0195C6.19389 11.1405 5.71386 11.4351 5.45187 11.749C5.20922 12.0384 5.01228 12.4329 5.01228 12.6258C5.01228 12.8187 4.87337 13.0449 4.70457 13.1273C4.53049 13.2132 3.74803 13.2062 2.90226 13.1133C1.85253 12.9958 1.34437 12.859 1.19666 12.6539C1.03314 12.4259 1.04193 12.1927 1.24238 11.5737C1.38129 11.1388 1.69428 10.4882 1.93517 10.127C2.17782 9.76576 2.7106 9.24495 3.12206 8.96964C3.53351 8.69609 4.22454 8.34362 4.66061 8.18931C5.09493 8.03325 5.61012 7.87367 5.80354 7.83159C5.99696 7.7895 6.8269 7.74566 7.64981 7.73163ZM6.18159 17.3271C5.90728 17.4902 5.531 17.9198 5.34637 18.281C5.1635 18.6422 5.01228 19.2542 5.01228 19.64C5.01228 20.0258 5.13009 20.5782 5.27604 20.8675C5.42022 21.1568 5.69804 21.4725 5.89146 21.5689C6.08488 21.6654 6.49985 21.7443 6.81459 21.7443C7.12934 21.7425 7.64277 21.5847 7.95752 21.3936C8.27226 21.2007 8.7013 20.7079 8.91054 20.2976C9.1954 19.7435 9.30441 19.1823 9.33606 18.1057L9.38002 16.659C8.37952 16.687 7.77289 16.7695 7.38605 16.8624C6.99922 16.9553 6.45765 17.164 6.18159 17.3271ZM25.585 7.84912C25.9226 7.89121 26.5556 8.09637 26.9917 8.30329C27.5227 8.5558 27.9851 8.97315 29.0138 10.4619L29.4973 9.70263C29.7628 9.28528 30.3167 8.74869 30.7281 8.51021C31.1396 8.27173 31.8412 8.00694 32.2878 7.91926C32.7643 7.82633 33.4553 7.82457 33.9582 7.91576C34.4295 8.00168 35.1715 8.29102 35.6076 8.55931C36.1702 8.90652 36.543 9.32386 37.3941 10.9599L37.3694 17.6234C37.3518 22.5088 37.2903 24.3483 37.1356 24.5131C36.9931 24.6692 36.4146 24.7394 35.2999 24.7323C33.9828 24.7271 33.6189 24.6675 33.3885 24.4185C33.1406 24.1484 33.1107 23.5119 33.1424 19.2016C33.1635 16.5012 33.174 13.9357 33.1687 13.5026C33.1599 12.9116 33.0457 12.5925 32.7116 12.2313C32.3898 11.8823 32.0979 11.749 31.6513 11.749C31.3119 11.749 30.8178 11.856 30.5523 11.9875C30.2868 12.119 29.9299 12.5136 29.7611 12.8643C29.4885 13.4289 29.4533 14.1181 29.4533 18.8509C29.4533 23.4838 29.4164 24.2343 29.1773 24.4623C28.9733 24.6569 28.4775 24.7253 27.2871 24.7288C26.2145 24.7306 25.5973 24.6569 25.4496 24.5096C25.2808 24.3395 25.2263 23.0665 25.2228 19.2016C25.2192 16.4047 25.1454 13.7604 25.0557 13.3272C24.9678 12.8923 24.7128 12.3593 24.493 12.1383C24.2099 11.8577 23.8829 11.7403 23.387 11.7385C22.9527 11.7368 22.4991 11.8735 22.2002 12.0945C21.9258 12.2961 21.641 12.7345 21.5425 13.108C21.4441 13.4728 21.3667 16.0856 21.3667 18.9824C21.3649 23.4961 21.328 24.2343 21.0889 24.4623C20.8849 24.6569 20.3891 24.7253 19.1986 24.7288C18.1261 24.7306 17.5089 24.6569 17.3612 24.5096C17.1889 24.336 17.1396 22.5299 17.1396 16.3959C17.1396 10.4356 17.1906 8.45059 17.3524 8.28576C17.4913 8.14372 18.1085 8.06656 19.1142 8.06656C20.2554 8.06656 20.7302 8.13495 20.9253 8.3296C21.0818 8.48566 21.1926 8.93106 21.1996 9.42557C21.2084 10.1393 21.2401 10.2112 21.4194 9.92884C21.5337 9.74647 21.8256 9.36069 22.0683 9.07135C22.3092 8.78201 22.7452 8.42779 23.0354 8.284C23.3255 8.14197 23.8794 7.96661 24.2662 7.89822C24.653 7.82983 25.2456 7.80704 25.585 7.84912ZM47.0368 7.73339C47.858 7.72637 48.9271 7.82457 49.4106 7.95434C49.8942 8.08234 50.5272 8.31206 50.8173 8.46287C51.1074 8.61367 51.598 9.00121 51.9075 9.32211C52.2169 9.64476 52.6091 10.2234 52.7814 10.6092C53.0434 11.2037 53.1014 11.9822 53.1577 15.6945C53.2122 19.2051 53.279 20.1836 53.497 20.6045C53.6465 20.8938 53.9173 21.3269 54.1019 21.5689C54.2848 21.8092 54.4289 22.1248 54.4237 22.2704C54.4166 22.4141 53.8206 23.0261 53.0979 23.6294C52.3752 24.2326 51.6455 24.7288 51.4767 24.7341C51.3079 24.7376 50.8894 24.4413 50.5465 24.0765C50.2036 23.71 49.8361 23.2523 49.7324 23.0595C49.5495 22.7228 49.5108 22.735 48.7723 23.354C48.3503 23.71 47.647 24.1624 47.2127 24.3588C46.7766 24.557 45.9062 24.7692 45.2785 24.8323C44.4556 24.9147 43.8525 24.8674 43.1245 24.6604C42.5302 24.4921 41.8515 24.1396 41.4752 23.8047C41.1253 23.4908 40.6769 22.9192 40.48 22.5334C40.2479 22.081 40.0949 21.3673 40.0456 20.5168C39.9823 19.4436 40.0439 19.0087 40.3727 18.1495C40.6224 17.4954 41.0461 16.8343 41.4892 16.4047C41.8814 16.0242 42.597 15.5314 43.0806 15.3105C43.5641 15.0913 44.5927 14.7967 45.3664 14.6564C46.1401 14.5161 47.2285 14.3583 48.7952 14.204V13.1519C48.7952 12.2365 48.7284 12.0261 48.2817 11.5298C47.8228 11.0195 47.6698 10.9599 46.8311 10.9652C46.177 10.9687 45.7339 11.0809 45.3664 11.3334C45.0763 11.5333 44.7 12.0226 44.5312 12.4241C44.3624 12.824 44.1637 13.1799 44.0916 13.215C44.0195 13.2518 43.3654 13.215 42.641 13.1343C41.9148 13.0554 41.1446 12.9485 40.9266 12.8959C40.6347 12.8257 40.5327 12.6749 40.5345 12.3189C40.5362 12.0541 40.6997 11.4807 40.8967 11.0476C41.0919 10.6127 41.5455 9.95514 41.9025 9.58689C42.2612 9.21689 42.8695 8.75045 43.2564 8.55054C43.6432 8.35064 44.3149 8.08761 44.751 7.96661C45.1853 7.84561 46.2139 7.7404 47.0368 7.73339ZM45.85 17.2429C45.5352 17.4042 45.1185 17.7532 44.9233 18.018C44.7281 18.2828 44.5242 18.8159 44.4696 19.2016C44.4063 19.6418 44.4714 20.1643 44.6437 20.6045C44.8002 21.0043 45.1079 21.4006 45.3611 21.5251C45.6055 21.6461 46.0821 21.7443 46.4214 21.7443C46.8399 21.7443 47.2144 21.59 47.5942 21.2621C47.902 20.9973 48.2958 20.4642 48.4699 20.0784C48.6862 19.5997 48.7882 18.9456 48.7917 18.018L48.7952 16.659C47.7736 16.687 47.2391 16.7519 46.9489 16.8238C46.6588 16.894 46.1647 17.0833 45.85 17.2429ZM76.8409 7.84035C77.2277 7.88419 77.9398 8.03675 78.4234 8.17879C78.9069 8.32083 79.6788 8.71012 80.1378 9.04154C80.5967 9.37296 81.2526 10.0586 81.5919 10.5654C81.933 11.0722 82.4078 12.098 82.6469 12.845C82.8878 13.592 83.134 14.8546 83.1938 15.6507C83.2764 16.7063 83.2237 17.5007 83.0004 18.5879C82.8333 19.4068 82.4975 20.5115 82.2566 21.0429C82.0122 21.5795 81.3756 22.458 80.8235 23.0209C80.2169 23.6381 79.4872 24.1765 78.9509 24.3992C78.4673 24.6008 77.6761 24.827 77.1925 24.9024C76.709 24.9778 75.8579 24.9691 75.3023 24.8831C74.7467 24.7955 73.915 24.5359 73.456 24.3045C72.9971 24.0748 72.2832 23.5417 71.8718 23.1208C71.4603 22.7017 70.9311 22.0021 70.6937 21.5689C70.4563 21.1341 70.1011 20.1486 69.9007 19.377C69.658 18.4336 69.5402 17.427 69.5437 16.3083C69.5455 15.3684 69.6703 14.1461 69.8321 13.5026C69.9886 12.8748 70.3438 11.9086 70.6216 11.3545C70.8994 10.8004 71.4656 10.0113 71.8823 9.60092C72.2973 9.19059 73.0094 8.67855 73.4648 8.46111C73.9185 8.24367 74.7062 7.99817 75.2144 7.914C75.7226 7.83159 76.454 7.79827 76.8409 7.84035ZM74.6605 12.1331C74.4372 12.5364 74.2174 13.4096 74.1066 14.3355C74.0047 15.179 73.9695 16.5397 74.031 17.3604C74.0908 18.1793 74.2631 19.284 74.4143 19.8154C74.5779 20.3941 74.8891 20.9727 75.1933 21.2621C75.5151 21.5689 75.8896 21.7443 76.2254 21.7443C76.5156 21.7443 76.971 21.6373 77.2365 21.5058C77.502 21.3743 77.8537 20.999 78.0172 20.6729C78.1825 20.345 78.4093 19.6435 78.5236 19.114C78.6572 18.495 78.6977 17.3008 78.6379 15.7822C78.5869 14.4793 78.4462 13.0993 78.3284 12.7135C78.2089 12.3277 77.8853 11.7946 77.6075 11.5298C77.233 11.1721 76.9358 11.0511 76.4452 11.0599C76.083 11.0651 75.6153 11.1598 75.4078 11.2668C75.2003 11.3755 74.8645 11.7648 74.6605 12.1331ZM94.0727 7.85964C94.4595 7.90348 95.1259 8.10689 95.5532 8.31031C95.9823 8.51372 96.5115 8.91704 96.7313 9.20637C96.9511 9.49571 97.2694 10.0867 97.4382 10.5215C97.709 11.2107 97.7547 12.1295 97.8109 17.7988C97.8707 23.9047 97.8567 24.2992 97.556 24.5096C97.3608 24.6447 96.6786 24.7306 95.7871 24.7288C94.9888 24.7271 94.1782 24.6464 93.9848 24.55C93.6454 24.3799 93.6331 24.1993 93.6313 19.0701C93.6313 16.1154 93.554 13.4745 93.4555 13.108C93.3606 12.7468 93.1232 12.2926 92.9298 12.0997C92.6906 11.8613 92.3407 11.7473 91.8308 11.7455C91.2927 11.7438 90.9639 11.8542 90.6562 12.1401C90.4206 12.3593 90.1041 12.8134 89.9529 13.1519C89.7278 13.6551 89.668 14.7108 89.6258 19.0263C89.5784 23.7416 89.5414 24.3097 89.2724 24.5096C89.0878 24.6464 88.4231 24.7306 87.5228 24.7288C86.7246 24.7271 85.914 24.6464 85.7205 24.55C85.3759 24.3781 85.3689 24.1993 85.3689 16.3959C85.3689 8.59263 85.3759 8.41377 85.7205 8.24192C85.914 8.14547 86.6648 8.06656 87.391 8.06656C88.1154 8.06656 88.868 8.14547 89.0614 8.24192C89.3568 8.38922 89.4131 8.59263 89.4148 10.6092L89.7841 9.99547C89.9863 9.65704 90.3239 9.19585 90.5296 8.96964C90.7371 8.74519 91.145 8.43832 91.4352 8.29102C91.7253 8.14372 92.2792 7.96836 92.666 7.89997C93.0528 7.83334 93.6859 7.81405 94.0727 7.85964Z" fill="black" />
                    <path fillRule="evenodd" clipRule="evenodd" d="M118.733 7.72992C119.111 7.71589 119.129 7.77726 119.129 10.5216L120.066 9.51328C120.581 8.95916 121.313 8.37347 121.693 8.2139C122.072 8.05257 122.778 7.86494 123.261 7.79655C123.801 7.71939 124.513 7.75622 125.107 7.893C125.638 8.01399 126.351 8.25247 126.69 8.41906C127.027 8.5874 127.404 8.85219 127.525 9.01001C127.706 9.24323 127.671 9.4256 127.33 10.0393C127.1 10.4497 126.646 11.0108 126.319 11.2879C125.99 11.5649 125.406 11.9542 125.019 12.1524C124.534 12.4014 123.852 12.5399 122.822 12.596C121.999 12.6416 121.188 12.6276 121.019 12.5645C120.743 12.4628 120.736 12.4014 120.959 11.9683C121.097 11.7035 121.432 11.2738 121.707 11.0143C121.981 10.7566 122.64 10.3375 124.14 9.62375L123.349 9.743C122.913 9.80788 122.28 10.0008 121.942 10.1691C121.603 10.3375 121.056 10.7425 120.726 11.0687C120.395 11.3948 119.92 12.0945 119.671 12.6258C119.229 13.564 119.215 13.7043 119.155 17.7988C119.101 21.469 119.129 22.0459 119.375 22.3142C119.606 22.565 119.961 22.6211 122.997 22.6211V24.7254H112.975V22.6211H114.03C114.928 22.6211 115.123 22.5632 115.35 22.2266C115.572 21.8951 115.614 20.9465 115.614 16.3521C115.612 13.3378 115.572 10.753 115.524 10.6093C115.456 10.4058 115.134 10.3462 112.799 10.3462L112.795 8.32963L115.391 8.09641C116.819 7.9684 118.065 7.83688 118.162 7.80356C118.259 7.77025 118.515 7.73693 118.733 7.72992ZM135.482 7.77375C136.913 7.81935 137.565 7.92631 138.383 8.24897C139.039 8.50849 139.804 9.00826 140.405 9.56939C140.936 10.0674 141.585 10.8986 141.843 11.4176C142.102 11.9384 142.429 12.7959 142.57 13.3273C142.708 13.8568 142.872 14.8634 143.043 16.8344L130.822 16.8309L130.936 18.0163C131 18.6686 131.182 19.5173 131.342 19.9031C131.504 20.2889 131.847 20.8763 132.107 21.2095C132.38 21.5567 132.992 21.9968 133.547 22.2423C134.39 22.6176 134.706 22.6632 136.009 22.5983C137.208 22.5369 137.66 22.4335 138.295 22.0687C138.729 21.818 139.318 21.3077 139.603 20.9342C139.888 20.5589 140.224 19.9978 140.351 19.6839C140.577 19.1228 140.598 19.114 142.867 19.114L142.765 19.6839C142.71 19.9978 142.478 20.6484 142.251 21.1306C142.023 21.6146 141.398 22.4194 140.857 22.928C140.319 23.4347 139.343 24.1029 138.691 24.4132C137.655 24.906 137.28 24.9866 135.745 25.0463C134.726 25.0866 133.581 25.0252 133.02 24.9007C132.487 24.7832 131.62 24.4781 131.093 24.2238C130.564 23.9696 129.732 23.3629 129.247 22.8771C128.759 22.3931 128.133 21.5251 127.854 20.9482C127.576 20.373 127.231 19.3507 127.089 18.6756C126.917 17.8549 126.862 16.9256 126.926 15.8699C126.98 14.944 127.172 13.8568 127.39 13.2396C127.592 12.6609 127.944 11.8718 128.169 11.486C128.394 11.1002 128.963 10.3988 129.436 9.92887C129.908 9.45717 130.611 8.91181 130.998 8.71541C131.385 8.51901 132.136 8.2139 132.668 8.03679C133.423 7.78603 134.043 7.72816 135.482 7.77375ZM132.032 11.3107C131.814 11.6 131.52 12.112 131.379 12.4505C131.24 12.7872 131.077 13.3992 131.017 13.8095L130.91 14.5547L138.91 14.56C138.699 13.1291 138.423 12.2856 138.16 11.7631C137.787 11.0231 137.504 10.7197 136.888 10.4006C136.31 10.099 135.812 9.98849 135.042 9.992C134.302 9.99375 133.755 10.113 133.208 10.3901C132.781 10.6075 132.252 11.0213 132.032 11.3107ZM151.483 7.76674C153.165 7.81759 153.438 7.87546 154.56 8.41906C155.237 8.74698 155.829 9.03982 155.878 9.07138C155.926 9.10295 156.084 8.80835 156.23 8.41731C156.492 7.71238 156.501 7.70712 158.309 7.71589L158.252 13.5903H156.348L156.081 12.8012C155.924 12.3418 155.495 11.7017 155.054 11.2668C154.505 10.7285 154.016 10.4427 153.285 10.2357C152.61 10.0446 151.866 9.97622 151.043 10.0288C150.259 10.0779 149.605 10.2305 149.242 10.4462C148.93 10.632 148.574 10.974 148.451 11.2037C148.33 11.4352 148.244 11.9086 148.26 12.2558C148.281 12.7047 148.434 13.0204 148.787 13.3395C149.184 13.7008 149.976 13.9585 152.713 14.6144C155.272 15.2299 156.387 15.5823 157.102 16.0049C157.76 16.3925 158.233 16.8431 158.597 17.4358C159.084 18.2232 159.131 18.4319 159.128 19.8031C159.124 20.9991 159.047 21.4497 158.746 22.0074C158.539 22.3931 158.066 22.9999 157.695 23.3576C157.326 23.7136 156.547 24.2238 155.966 24.4921C155.08 24.899 154.614 24.9884 153.065 25.0498C151.544 25.1111 151.003 25.0585 149.988 24.7534C149.311 24.55 148.4 24.1449 147.175 23.3278L146.994 23.9836C146.818 24.6237 146.793 24.6394 144.977 24.7254V18.4126H145.944C146.895 18.4126 146.913 18.4213 147.02 18.9825C147.08 19.2964 147.271 19.8277 147.444 20.1661C147.618 20.5028 148.024 21.0271 148.346 21.3305C148.669 21.6338 149.288 22.0652 149.724 22.2897C150.385 22.6299 150.79 22.6983 152.186 22.7035C153.587 22.707 153.976 22.6456 154.604 22.3142C155.015 22.0968 155.469 21.6829 155.615 21.3936C155.759 21.1043 155.878 20.6694 155.878 20.4292C155.878 20.1872 155.798 19.8137 155.699 19.5962C155.601 19.3788 155.304 19.0702 155.04 18.9088C154.776 18.7475 153.116 18.2547 151.351 17.8129C149.585 17.371 147.806 16.8431 147.394 16.6397C146.983 16.4363 146.422 16.0611 146.148 15.8068C145.873 15.5525 145.497 15.0475 145.313 14.6863C145.128 14.325 144.927 13.6938 144.866 13.2834C144.804 12.8731 144.845 12.1436 144.952 11.6614C145.061 11.1792 145.388 10.4497 145.678 10.0393C145.97 9.62901 146.505 9.09593 146.867 8.8557C147.229 8.61371 148.001 8.25774 148.581 8.06484C149.429 7.78252 149.999 7.72465 151.483 7.76674Z" fill="#4C9E45" />
                    <path d="M56.9031 8.2856C56.787 8.41712 56.7255 9.06593 56.7519 9.90764L56.7958 11.3105C61.0879 11.3789 62.3311 11.4578 62.3293 11.5297C62.3258 11.6016 60.9613 13.5936 59.2962 15.9574L56.2683 20.2536V24.1114C56.9488 24.0746 57.74 23.8396 58.4662 23.5678C59.683 23.1084 59.9696 23.0698 62.1588 23.0768C64.1141 23.0838 64.7031 23.1487 65.4996 23.4468C66.0307 23.645 66.7041 23.9098 66.9942 24.0325C67.2844 24.1553 67.6607 24.2044 67.8295 24.1395C68.0897 24.0413 68.1372 23.7923 68.1372 22.5332C68.1372 21.2251 68.0879 20.9936 67.7415 20.6359C67.5235 20.4114 66.8307 20.0537 66.203 19.8415C65.5735 19.6293 64.4534 19.3979 63.7132 19.3277C62.9729 19.2576 62.3205 19.1419 62.2625 19.07C62.2063 18.9981 63.4248 17.1428 64.9739 14.9491L67.789 10.9598C67.7855 8.55039 67.7257 8.22247 67.5218 8.15408C67.3758 8.10498 64.9721 8.06641 62.1781 8.06641C58.3361 8.06641 57.0508 8.11901 56.9031 8.2856ZM59.785 25.5248C59.108 25.6581 58.039 26.0263 57.4112 26.3437C56.5813 26.7628 56.2683 27.0171 56.2683 27.2696C56.2683 27.594 56.358 27.6133 57.5871 27.5309C58.3115 27.4818 59.7481 27.4432 60.7785 27.4432C62.4067 27.4432 62.6986 27.4888 63.0257 27.7939C63.2507 28.0043 63.3984 28.355 63.3967 28.6707C63.3931 28.96 63.2683 29.6702 63.1206 30.2489C62.9711 30.8275 62.572 32.0498 62.2326 32.9669C61.8265 34.0681 61.677 34.6924 61.793 34.8081C61.9091 34.9256 62.1166 34.88 62.4137 34.6766C62.6599 34.5083 63.161 33.9945 63.5268 33.5368C63.8908 33.0791 64.4147 32.2304 64.6908 31.6517C64.9669 31.073 65.3414 30.0069 65.5243 29.2844C65.7054 28.5602 65.8548 27.5554 65.8531 27.0486C65.8513 26.2858 65.7827 26.0859 65.4557 25.879C65.2377 25.7405 64.5853 25.5441 64.0051 25.4389C63.4248 25.3354 62.514 25.2565 61.9829 25.267C61.4502 25.2758 60.462 25.3933 59.785 25.5248ZM14.2578 26.6102C14.1857 26.8207 14.3616 27.11 14.8152 27.5309C15.1792 27.8675 16.1498 28.6549 16.971 29.2792C17.7921 29.9034 19.0968 30.8047 19.8705 31.2817C20.6441 31.7604 22.2267 32.6056 23.3872 33.1615C24.5477 33.7174 26.3271 34.4592 27.3435 34.8081C28.358 35.1588 29.981 35.6375 30.9481 35.8725C31.9152 36.1093 33.8933 36.4582 35.3439 36.6529C36.7946 36.8457 38.8519 37.0018 39.9157 37.0018C40.9795 37.0018 42.7994 36.8773 43.9599 36.7283C45.1204 36.5774 46.8611 36.2934 47.8282 36.097C48.7953 35.9006 50.733 35.364 52.1362 34.9063C53.5376 34.4469 55.5562 33.6402 56.62 33.1142C57.6838 32.5864 59.1678 31.7464 59.9169 31.2466C60.9385 30.5645 61.2796 30.2383 61.2831 29.942C61.2849 29.7246 61.1847 29.4475 61.0633 29.3247C60.9402 29.2038 60.7416 29.1038 60.6202 29.1056C60.4989 29.1073 59.3525 29.5001 58.0706 29.9771C56.7888 30.454 54.6717 31.1204 53.367 31.4553C52.0606 31.792 50.0438 32.2286 48.8832 32.4268C47.7227 32.6249 45.9028 32.8652 44.839 32.9634C43.7752 33.0616 41.8358 33.1422 40.5311 33.1422C39.2246 33.1405 37.2465 33.0581 36.1352 32.9581C35.0222 32.8564 33.1636 32.6162 32.0031 32.4215C30.8426 32.2286 28.9822 31.8411 27.871 31.5623C26.7579 31.2835 24.938 30.7416 23.8268 30.3576C22.7137 29.9753 21.1312 29.3756 20.3101 29.0249C19.4872 28.6742 17.9257 27.9184 16.8373 27.345C15.7489 26.7716 14.7466 26.3034 14.6095 26.3034C14.4741 26.3034 14.3141 26.4419 14.2578 26.6102Z" fill="black" />
                  </g>
                  <defs>
                    <clipPath id="clip0_80_3704">
                      <rect width="179" height="37" fill="white" transform="translate(0.616211)" />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Link
                to="/"
                className="mx-2 text-decoration-none d-inline-block"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="131" height="37" viewBox="0 0 131 37" fill="none">
                  <g clip-path="url(#clip0_80_3710)">
                    <path d="M3.22928 32.7929C3.58222 32.9711 4.12404 33.1501 4.68255 33.1501C5.28434 33.1501 5.60289 32.9038 5.60289 32.5293C5.60289 32.1712 5.32762 31.9677 4.63139 31.7206C3.66785 31.387 3.04048 30.8614 3.04048 30.0266C3.04048 29.0468 3.86638 28.2985 5.23318 28.2985C5.88698 28.2985 6.36882 28.4347 6.71203 28.5893L6.41998 29.6354C6.18791 29.5245 5.775 29.362 5.2076 29.362C4.63935 29.362 4.36492 29.6188 4.36492 29.9147C4.36492 30.2815 4.69144 30.4431 5.43967 30.7242C6.46318 31.0988 6.94503 31.6262 6.94503 32.434C6.94503 33.3962 6.1968 34.2223 4.60496 34.2223C3.9432 34.2223 3.28933 34.045 2.96289 33.8651L3.22928 32.7929ZM11.3648 33.1158C11.3648 33.5167 11.3824 33.8991 11.4248 34.1279H10.2468L10.1701 33.7114H10.1435C9.86827 34.0449 9.43851 34.2222 8.93997 34.2222C8.08848 34.2222 7.58113 33.6101 7.58113 32.9456C7.58113 31.8654 8.56144 31.3458 10.0491 31.3546V31.2944C10.0491 31.0735 9.92824 30.7591 9.2841 30.7591C8.85264 30.7591 8.39823 30.9032 8.12287 31.0735L7.88199 30.2396C8.17403 30.0781 8.75024 29.8729 9.51617 29.8729C10.9174 29.8729 11.3647 30.6911 11.3647 31.6691V33.1158H11.3648ZM10.0925 32.1623C9.40419 32.1545 8.87126 32.316 8.87126 32.8181C8.87126 33.15 9.09453 33.3123 9.38742 33.3123C9.71394 33.3123 9.9804 33.0993 10.0669 32.8355C10.0842 32.7629 10.0927 32.6884 10.0925 32.6138V32.1623ZM13.2656 29.9672L13.833 31.8988C13.9317 32.2318 14.0121 32.57 14.0739 32.9116H14.0995C14.1683 32.5712 14.2371 32.2568 14.3324 31.8988L14.8733 29.9672H16.2498L14.6845 34.1281H13.3777L11.8467 29.9672H13.2656ZM17.73 32.4607C17.7715 32.996 18.3053 33.2527 18.9159 33.2527C19.3633 33.2527 19.7242 33.1916 20.0771 33.0824L20.2491 33.9592C19.8185 34.1286 19.2944 34.222 18.7262 34.222C17.2985 34.222 16.4814 33.3968 16.4814 32.094C16.4814 31.04 17.1441 29.8725 18.6061 29.8725C19.965 29.8725 20.4812 30.9195 20.4812 31.949C20.4812 32.1708 20.4548 32.3673 20.438 32.4607H17.73ZM19.2688 31.5752C19.2688 31.2609 19.1312 30.7326 18.5285 30.7326C17.9788 30.7326 17.7547 31.2268 17.7203 31.5752H19.2688ZM23.0011 31.2942C23.0011 30.7755 22.9835 30.3328 22.9658 29.967H24.067L24.1269 30.5285H24.1535C24.3344 30.2648 24.7041 29.8727 25.4267 29.8727C25.9676 29.8727 26.3982 30.1451 26.5791 30.5791H26.5958C26.7512 30.3573 26.94 30.1975 27.1376 30.0779C27.3697 29.9408 27.6282 29.8727 27.9379 29.8727C28.7453 29.8727 29.3559 30.435 29.3559 31.6777V34.1279H28.0835V31.8654C28.0835 31.2611 27.8858 30.9118 27.4649 30.9118C27.1632 30.9118 26.9488 31.1161 26.8623 31.3633C26.8279 31.4567 26.8102 31.5929 26.8102 31.6942V34.1279H25.5379V31.7963C25.5379 31.2698 25.3481 30.9117 24.9361 30.9117C24.6008 30.9117 24.4031 31.1676 24.3255 31.3789C24.2822 31.4811 24.2734 31.6007 24.2734 31.7029V34.1278H23.0011V31.2942ZM34.5506 32.001C34.5506 33.5239 33.4583 34.2225 32.3323 34.2225C31.1023 34.2225 30.1555 33.4226 30.1555 32.0778C30.1555 30.7331 31.0511 29.873 32.4003 29.873C33.6903 29.873 34.5506 30.7506 34.5506 32.001ZM31.5064 32.0438C31.5064 32.7589 31.8073 33.2951 32.3667 33.2951C32.8732 33.2951 33.2006 32.793 33.2006 32.0438C33.2006 31.4221 32.9597 30.7933 32.3667 30.7933C31.7385 30.7933 31.5064 31.4299 31.5064 32.0438ZM35.3589 31.2942C35.3589 30.7755 35.3421 30.3328 35.3254 29.967H36.4601L36.5201 30.5363H36.5456C36.7186 30.2726 37.1483 29.8726 37.8445 29.8726C38.7048 29.8726 39.3499 30.4349 39.3499 31.6601V34.1278H38.0422V31.8225C38.0422 31.2863 37.8525 30.9196 37.3804 30.9196C37.0187 30.9196 36.8042 31.1676 36.7187 31.4051C36.6833 31.4898 36.6666 31.6104 36.6666 31.729V34.1278H35.3589V31.2942ZM41.4046 32.4607C41.4478 32.996 41.9808 33.2527 42.5923 33.2527C43.0396 33.2527 43.4005 33.1916 43.7526 33.0824L43.9255 33.9592C43.4949 34.1286 42.9699 34.222 42.4025 34.222C40.9748 34.222 40.1578 33.3968 40.1578 32.094C40.1578 31.04 40.8204 29.8725 42.2825 29.8725C43.6413 29.8725 44.1567 30.9195 44.1567 31.949C44.1567 32.1708 44.1319 32.3673 44.1143 32.4607H41.4046ZM42.9443 31.5752C42.9443 31.2609 42.8075 30.7326 42.2048 30.7326C41.6542 30.7326 41.431 31.2268 41.3966 31.5752H42.9443ZM45.8687 29.9672L46.496 32.0106C46.5649 32.2568 46.6513 32.5633 46.7025 32.7842H46.7281C46.789 32.5633 46.8569 32.249 46.9178 32.0106L47.434 29.9672H48.8361L47.8549 32.7074C47.2532 34.3586 46.8491 35.0222 46.3769 35.4388C45.9199 35.8309 45.439 35.9671 45.1116 36.009L44.8363 34.9123C45.0005 34.8861 45.2061 34.8101 45.4037 34.6913C45.6023 34.5883 45.8167 34.3839 45.9464 34.1709C45.9888 34.1115 46.0153 34.0451 46.0153 33.984C46.0153 33.9421 46.0065 33.8741 45.9544 33.7719L44.4156 29.9672H45.8687ZM50.0454 34.2221C49.606 34.2221 49.2884 33.8912 49.2884 33.4389C49.2884 32.9804 49.606 32.6486 50.0622 32.6486C50.5184 32.6486 50.8281 32.9708 50.8281 33.4389C50.8281 33.8912 50.5184 34.2221 50.0534 34.2221H50.0454ZM53.7462 28.3917H55.0617V33.0398H57.3674V34.1278H53.7462V28.3917ZM59.6204 28.8095C59.6204 29.1675 59.3451 29.4574 58.9153 29.4574C58.5015 29.4574 58.2271 29.1675 58.2359 28.8095C58.2271 28.4349 58.5015 28.1555 58.9232 28.1555C59.345 28.1555 59.6116 28.4349 59.6204 28.8095ZM58.2694 34.1283V29.9674H59.5771V34.1282H58.2694V34.1283ZM61.7702 29.9672L62.3375 31.8988C62.4398 32.249 62.5184 32.5798 62.5784 32.9116H62.604C62.6719 32.5712 62.7416 32.2568 62.8369 31.8988L63.3786 29.9672H64.7552L63.1898 34.1281H61.8813L60.3513 29.9672H61.7702ZM66.2343 32.4607C66.2775 32.996 66.8105 33.2527 67.4203 33.2527C67.8685 33.2527 68.2294 33.1916 68.5815 33.0824L68.7535 33.9592C68.3239 34.1286 67.7988 34.222 67.2323 34.222C65.8046 34.222 64.9867 33.3968 64.9867 32.094C64.9867 31.04 65.6494 29.8725 67.1115 29.8725C68.4703 29.8725 68.9865 30.9195 68.9865 31.949C68.9865 32.1708 68.96 32.3673 68.9416 32.4607H66.2343ZM67.7741 31.5752C67.7741 31.2609 67.6364 30.7326 67.0329 30.7326C66.4822 30.7326 66.2599 31.2268 66.2264 31.5752H67.7741ZM71.5058 28.0864H72.8126V30.4607H72.8302C73.0799 30.1027 73.5193 29.8731 74.1035 29.8731C75.1094 29.8731 75.8497 30.6991 75.84 31.9757C75.84 33.4733 74.8773 34.2217 73.9146 34.2217C73.4249 34.2217 72.9501 34.0452 72.6493 33.5502H72.6317L72.5805 34.1282H71.4714C71.4881 33.8566 71.5058 33.3545 71.5058 32.8865V28.0864ZM72.8126 32.3582C72.8126 32.4429 72.8214 32.5206 72.8382 32.5888C72.9238 32.9363 73.2255 33.2009 73.6049 33.2009C74.1635 33.2009 74.5076 32.7757 74.5076 32.0265C74.5076 31.3794 74.2146 30.8694 73.6049 30.8694C73.2511 30.8694 72.9237 31.1322 72.8382 31.5077C72.8209 31.5863 72.8123 31.6666 72.8126 31.747V32.3582ZM77.6814 32.4607C77.7247 32.996 78.2577 33.2527 78.8674 33.2527C79.3148 33.2527 79.6757 33.1916 80.0286 33.0824L80.2007 33.9592C79.771 34.1286 79.2451 34.222 78.6777 34.222C77.251 34.222 76.4339 33.3968 76.4339 32.094C76.4339 31.04 77.0966 29.8725 78.5587 29.8725C79.9175 29.8725 80.4328 30.9195 80.4328 31.949C80.4328 32.1708 80.4072 32.3673 80.3904 32.4607H77.6814ZM79.2195 31.5752C79.2195 31.2609 79.0809 30.7326 78.4818 30.7326C77.9312 30.7326 77.7071 31.2268 77.6727 31.5752H79.2195ZM82.8488 28.8349V29.9674H83.7876V30.9192H82.8488V32.4264C82.8488 32.9293 82.9696 33.1581 83.3649 33.1581C83.5458 33.1581 83.6244 33.1503 83.7532 33.1241L83.7612 34.1039C83.5891 34.1703 83.2794 34.2217 82.9087 34.2217C82.4879 34.2217 82.1358 34.0698 81.9293 33.8568C81.6884 33.6097 81.5675 33.2097 81.5675 32.6229V30.9193H81.009V29.9675H81.5675V29.1842L82.8488 28.8349ZM86.1779 28.8349V29.9674H87.1141V30.9192H86.1779V32.4264C86.1779 32.9293 86.2988 33.1581 86.6923 33.1581C86.8732 33.1581 86.9508 33.1503 87.0805 33.1241L87.0885 34.1039C86.9164 34.1703 86.6085 34.2217 86.237 34.2217C85.817 34.2217 85.4632 34.0698 85.2567 33.8568C85.0167 33.6097 84.8958 33.2097 84.8958 32.6229V30.9193H84.3364V29.9675H84.8958V29.1842L86.1779 28.8349ZM89.0491 32.4607C89.0923 32.996 89.6262 33.2527 90.2385 33.2527C90.6842 33.2527 91.0451 33.1916 91.3971 33.0824L91.5682 33.9592C91.1394 34.1286 90.6161 34.222 90.0479 34.222C88.6202 34.222 87.8031 33.3968 87.8031 32.094C87.8031 31.04 88.4658 29.8725 89.9279 29.8725C91.2849 29.8725 91.8029 30.9195 91.8029 31.949C91.8029 32.1708 91.7764 32.3673 91.7588 32.4607H89.0491ZM90.5897 31.5752C90.5897 31.2609 90.4521 30.7326 89.8503 30.7326C89.2988 30.7326 89.0755 31.2268 89.0403 31.5752H90.5897ZM92.7556 31.3367C92.7556 30.7237 92.7397 30.3247 92.723 29.9675H93.8497L93.8929 30.7333H93.9273C94.1418 30.1273 94.6571 29.8724 95.0612 29.8724C95.1812 29.8724 95.2421 29.8724 95.3365 29.8898V31.1158C95.242 31.0896 95.13 31.0739 94.9835 31.0739C94.5018 31.0739 94.1762 31.3288 94.0905 31.7287C94.0738 31.8143 94.065 31.9164 94.065 32.0186V34.1283H92.7555V31.3367H92.7556ZM96.6819 34.2221C96.2433 34.2221 95.9265 33.8912 95.9265 33.4389C95.9265 32.9804 96.2433 32.6486 96.6995 32.6486C97.1548 32.6486 97.4645 32.9708 97.4645 33.4389C97.4645 33.8912 97.1547 34.2221 96.6907 34.2221H96.6819Z" fill="#0071CE" />
                    <path d="M115.16 10.3223C115.886 10.3223 116.483 9.94947 116.564 9.46659L117.282 1.44431C117.282 0.651449 116.343 0 115.162 0C113.983 0 113.046 0.651449 113.046 1.44431L113.762 9.46659C113.841 9.94947 114.439 10.3223 115.162 10.3223H115.16ZM110.778 12.8286C111.143 12.2069 111.114 11.5083 110.731 11.1984L104.068 6.57384C103.376 6.17653 102.337 6.65414 101.746 7.66619C101.155 8.67656 101.26 9.80562 101.952 10.2012L109.329 13.6014C109.791 13.7708 110.419 13.4452 110.781 12.8243L110.778 12.8286ZM119.544 12.8242C119.908 13.4451 120.533 13.7708 120.995 13.6014L128.373 10.2011C129.068 9.80554 129.168 8.6764 128.581 7.66611C127.989 6.65407 126.947 6.17638 126.257 6.57376L119.594 11.1983C119.213 11.5083 119.184 12.2069 119.547 12.8286L119.544 12.8242ZM115.16 20.3425C115.886 20.3425 116.483 20.7137 116.564 21.1966L117.282 29.2179C117.282 30.0126 116.343 30.6622 115.162 30.6622C113.983 30.6622 113.046 30.0125 113.046 29.2179L113.762 21.1966C113.841 20.7137 114.439 20.3425 115.162 20.3425H115.16ZM119.544 17.8372C119.908 17.2147 120.533 16.8916 120.995 17.0636L128.373 20.4595C129.068 20.8568 129.168 21.9868 128.581 22.998C127.989 24.0065 126.947 24.4859 126.257 24.0903L119.594 19.4693C119.213 19.155 119.184 18.4564 119.547 17.8355L119.544 17.8372ZM110.778 17.8359C111.143 18.4569 111.114 19.1554 110.731 19.4689L104.068 24.0899C103.376 24.4855 102.337 24.0061 101.746 22.9975C101.155 21.9864 101.26 20.8572 101.952 20.4591L109.329 17.0632C109.791 16.8911 110.419 17.2151 110.782 17.8377L110.778 17.8359Z" fill="#FDBB30" />
                    <path d="M76.78 16.254C76.78 13.2248 75.4733 10.5598 71.0543 10.5598C68.7858 10.5598 66.9849 11.1903 66.0028 11.7518L66.7219 14.1863C67.6193 13.6257 69.0514 13.162 70.4058 13.162C72.647 13.1559 73.0141 14.4168 73.0141 15.2254V15.4175C68.1275 15.4096 65.0401 17.0836 65.0401 20.4953C65.0401 22.5779 66.6125 24.5295 69.347 24.5295C71.0279 24.5295 72.4344 23.8658 73.2762 22.8022H73.3591C73.3591 22.8022 73.9177 25.1128 76.9936 24.2291C76.8322 23.2668 76.7801 22.2417 76.7801 21.0078L76.78 16.254ZM73.1324 19.4535C73.1324 19.6997 73.1102 19.9547 73.0415 20.1774C72.7591 21.103 71.7894 21.8863 70.5779 21.8863C69.5667 21.8863 68.7646 21.3187 68.7646 20.1181C68.7646 18.2816 70.8073 17.7735 73.1324 17.7857V19.4535ZM0.658203 6.43472C0.658203 6.43472 3.85061 19.381 4.35974 21.482C4.95441 23.9348 6.02654 24.8377 9.11569 24.2291L11.109 16.2016C11.6137 14.2081 11.9535 12.7865 12.2782 10.7589H12.3355C12.5632 12.8066 12.8888 14.2142 13.3044 16.2086C13.3044 16.2086 14.1153 19.8525 14.5309 21.7666C14.9483 23.6798 16.1077 24.8848 19.1334 24.2291L23.8833 6.43465H20.0485L18.4267 14.1278C17.9908 16.3667 17.5955 18.1166 17.2902 20.1652H17.2363C16.9583 18.1366 16.6063 16.4566 16.1625 14.2753L14.4736 6.43465H10.4782L8.67287 14.078C8.16112 16.3999 7.68197 18.2755 7.37756 20.2542H7.32285C7.01141 18.3907 6.59579 16.0339 6.14663 13.7854C6.14663 13.7854 5.07366 8.31902 4.69691 6.43457H0.658203L0.658203 6.43472ZM34.7821 16.254C34.7821 13.2248 33.4745 10.5598 29.0573 10.5598C26.7879 10.5598 24.9869 11.1903 24.0048 11.7518L24.7231 14.1863C25.6222 13.6257 27.0526 13.162 28.407 13.162C30.65 13.1559 31.0171 14.4168 31.0171 15.2254V15.4175C26.1296 15.4096 23.0422 17.0836 23.0422 20.4953C23.0422 22.5779 24.6146 24.5295 27.3465 24.5295C29.0292 24.5295 30.4356 23.8658 31.2792 22.8022H31.3613C31.3613 22.8022 31.9198 25.1128 34.9958 24.2291C34.8343 23.2668 34.7823 22.2417 34.7823 21.0078V16.254H34.7821ZM31.1344 19.4535C31.1344 19.6997 31.1132 19.9547 31.0435 20.1774C30.7611 21.103 29.7914 21.8863 28.5799 21.8863C27.5696 21.8863 26.7667 21.3187 26.7667 20.1181C26.7667 18.2816 28.8094 17.7735 31.1345 17.7857L31.1344 19.4535ZM40.8683 20.4507V6.4348H37.2171V24.2292H40.8683V20.4507ZM88.6404 6.43472V19.5618C88.6404 21.3712 88.9846 22.639 89.7214 23.4136C90.3646 24.0912 91.4235 24.5296 92.6941 24.5296C93.7732 24.5296 94.8356 24.327 95.3359 24.1428L95.2892 21.3196C94.9168 21.4096 94.488 21.4821 93.9021 21.4821C92.658 21.4821 92.2415 20.6936 92.2415 19.0694V14.0475H95.4207V10.6428H92.2415V6.43472H88.6404ZM79.2148 10.8613V24.2293H82.9817V17.3842C82.9817 17.0149 83.0037 16.6926 83.0628 16.3975C83.3417 14.9637 84.4499 14.0468 86.0408 14.0468C86.4767 14.0468 86.7891 14.094 87.128 14.1428V10.6421C86.8439 10.5862 86.6506 10.56 86.2977 10.56C84.8921 10.56 83.2932 11.4577 82.6217 13.3831H82.5194V10.8613H79.2148ZM43.4256 10.8613V24.2293H47.0963V16.3896C47.0963 16.022 47.1387 15.6334 47.2684 15.2954C47.5729 14.506 48.3141 13.5831 49.4991 13.5831C50.9806 13.5831 51.6732 14.8222 51.6732 16.6106V24.2293H55.3404V16.2945C55.3404 15.9434 55.3889 15.5217 55.493 15.2108C55.7948 14.3131 56.5942 13.5831 57.6954 13.5831C59.1973 13.5831 59.9173 14.8004 59.9173 16.9048V24.2293H63.5871V16.3556C63.5871 12.2035 61.457 10.56 59.0517 10.56C57.9866 10.56 57.1466 10.8237 56.386 11.2856C55.7472 11.6734 55.1754 12.2252 54.6751 12.9508H54.6213C54.0407 11.51 52.6765 10.56 50.8986 10.56C48.6141 10.56 47.587 11.7057 46.964 12.6776H46.9103V10.8613H43.4256Z" fill="#0071CE" />
                    <path d="M129.935 23.416C130.295 23.416 130.574 23.6929 130.574 24.0369C130.574 24.3897 130.295 24.6621 129.932 24.6621C129.572 24.6621 129.285 24.3897 129.285 24.0369C129.285 23.6929 129.572 23.416 129.932 23.416H129.935ZM129.928 23.5409C129.652 23.5409 129.445 23.7645 129.445 24.0369C129.445 24.3137 129.652 24.5338 129.935 24.5338C130.211 24.5372 130.414 24.3137 130.414 24.0369C130.414 23.7645 130.211 23.5409 129.932 23.5409H129.928ZM129.832 24.3591H129.687V23.7417C129.766 23.7262 129.847 23.7186 129.928 23.7189C130.047 23.7189 130.1 23.7382 130.145 23.7679C130.18 23.795 130.207 23.8438 130.207 23.9006C130.207 23.9722 130.153 24.0255 130.077 24.0482V24.056C130.138 24.0753 130.173 24.1241 130.192 24.2071C130.211 24.3023 130.222 24.3398 130.238 24.3591H130.081C130.062 24.3364 130.05 24.2831 130.031 24.2115C130.019 24.1433 129.981 24.1127 129.901 24.1127H129.832V24.3591ZM129.836 24.0106H129.905C129.985 24.0106 130.05 23.9845 130.05 23.9199C130.05 23.8631 130.008 23.8246 129.916 23.8246C129.878 23.8246 129.851 23.829 129.836 23.8324L129.836 24.0106Z" fill="#FDBB30" />
                  </g>
                  <defs>
                    <clipPath id="clip0_80_3710">
                      <rect width="130" height="37" fill="white" transform="translate(0.616211)" />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Link
                to="/"
                className="text-decoration-none d-inline-block"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="186" height="37" viewBox="0 0 186 37" fill="none">
                  <g clip-path="url(#clip0_80_3715)">
                    <path d="M22.7862 14.8302C24.9757 17.0303 26.7666 20.6329 25.7417 22.7734C23.0013 28.4974 2.55225 38.5374 0.81566 36.799C-0.920928 35.0625 9.12435 14.6064 14.85 11.8642C16.9906 10.8394 20.5932 12.6302 22.795 14.8198C22.7932 14.8215 22.7915 14.825 22.7862 14.8302Z" fill="#FF8200" />
                    <path d="M33.6202 12.4134C33.2651 11.0966 32.3575 9.76569 31.0022 9.6083C28.5171 9.31974 24.6014 13.7128 24.8813 14.7551C25.1611 15.7974 30.6944 17.6354 32.7597 16.1507C33.8248 15.3847 33.9752 13.7303 33.6254 12.4134H33.6202ZM25.9306 0.243314C27.7756 0.74348 29.6416 2.01488 29.8619 3.91411C30.2677 7.39778 24.1083 12.8891 22.6463 12.4974C21.1842 12.1056 18.6082 4.34782 20.6911 1.45001C21.7648 -0.0434937 24.0838 -0.253353 25.9323 0.236319C25.9306 0.236319 25.9306 0.239817 25.9306 0.243314Z" fill="#43B02A" />
                    <path d="M80.9542 20.8637L79.1249 20.5856C77.3813 20.3285 76.3722 19.7637 76.3722 18.7371C76.3722 17.5584 77.6856 16.8274 79.6268 16.8274C80.9997 16.8274 82.1172 17.3415 83.1874 17.8872L83.4008 17.9956C83.6474 18.1215 83.9132 18.1845 84.1878 18.1845C84.8226 18.1845 85.4085 17.84 85.7145 17.2838L85.8632 17.0145C86.0992 16.5843 86.15 16.0894 86.0048 15.6207C85.8597 15.1538 85.5396 14.776 85.1024 14.5574C83.5442 13.7774 81.8531 13.0762 79.6251 13.0762C74.9697 13.0762 71.9722 15.3234 71.9722 18.9417C71.9722 21.9112 74.1058 23.7737 78.1456 24.3246L79.9906 24.5642C81.9405 24.837 82.8884 25.4141 82.8884 26.3288C82.8884 27.1735 82.4319 28.2945 79.4117 28.2945C77.7468 28.2945 76.0557 27.8713 74.6829 27.0021C74.4083 26.829 74.0935 26.7363 73.77 26.7363C73.1666 26.7363 72.5948 27.0563 72.2765 27.5705L72.1733 27.7366C71.918 28.1493 71.841 28.6565 71.9617 29.1269C72.0824 29.5973 72.3797 29.9856 72.7994 30.2199C75.1918 31.5648 77.9549 32.0422 79.41 32.0422C84.263 32.0422 87.2657 29.9156 87.2657 26.1731C87.271 23.1826 85.1444 21.4653 80.9542 20.8637ZM137.377 27.4008C137.027 27.0091 136.523 26.7852 135.999 26.7852C135.644 26.7852 135.297 26.8867 134.995 27.0773C134.007 27.7034 132.926 28.0356 131.864 28.0356C128.949 28.0356 126.833 25.7324 126.833 22.5601C126.833 19.3877 128.949 17.0845 131.864 17.0845C132.984 17.0845 133.986 17.3888 134.927 18.0148C135.656 18.4993 136.702 18.3751 137.301 17.735L137.457 17.5689C137.868 17.1317 138.062 16.5371 137.992 15.9407C137.924 15.3549 137.604 14.832 137.116 14.5084C135.682 13.5571 133.905 13.0552 131.976 13.0552C126.38 13.0552 122.471 16.9638 122.471 22.5583C122.471 28.1546 126.38 32.0632 131.976 32.0632C133.914 32.0632 135.701 31.5508 137.146 30.5802C137.629 30.2567 137.947 29.739 138.019 29.1584C138.092 28.5743 137.908 27.9884 137.517 27.5512L137.377 27.4008ZM46.8153 6.62646C45.3585 6.62646 44.2183 7.78244 44.2183 9.25671C44.2183 10.738 45.334 11.8537 46.8153 11.8537C48.2895 11.8537 49.4455 10.7135 49.4455 9.25671C49.4455 7.78244 48.2895 6.62646 46.8153 6.62646ZM47.6005 13.2108H46.0685C45.3183 13.2108 44.7097 13.8194 44.7097 14.5697V30.2427C44.7097 30.9929 45.3183 31.6015 46.0685 31.6015H47.6005C48.3507 31.6015 48.9593 30.9929 48.9593 30.2427V14.5697C48.9593 13.8194 48.3507 13.2108 47.6005 13.2108ZM97.9021 27.9534C96.183 27.9465 94.1841 26.5999 94.1841 24.2407V17.1702H97.9143C98.6646 17.1702 99.2732 16.5616 99.2732 15.8113V14.5697C99.2732 13.8194 98.6646 13.2108 97.9143 13.2108H94.1841V9.13079C94.1841 8.38054 93.5755 7.77195 92.8252 7.77195H91.2093C90.4591 7.77195 89.8505 8.38054 89.8505 9.13079V23.9871C89.8505 28.2647 93.0963 32.0457 97.5908 32.0457H97.5926C98.0403 32.0457 98.4635 31.8708 98.7835 31.5508C99.1018 31.2325 99.2784 30.8093 99.2784 30.3598V29.3123C99.2749 28.5585 98.6576 27.9569 97.9021 27.9534ZM60.7744 13.0569C55.3356 13.0569 52.3014 17.408 52.3014 21.1295V30.2427C52.3014 30.9929 52.9099 31.6015 53.6602 31.6015H55.2097C55.9599 31.6015 56.5685 30.9929 56.5685 30.2427V21.8133C56.5685 18.9907 58.2789 17.1212 60.7727 17.1212C63.2665 17.1212 64.9769 18.9907 64.9769 21.8133V30.2427C64.9769 30.9929 65.5855 31.6015 66.3357 31.6015H67.8852C68.6354 31.6015 69.244 30.9929 69.244 30.2427V21.1295C69.2475 17.4063 66.215 13.0569 60.7744 13.0569ZM172.659 13.2458C172.07 13.1164 170.592 13.0569 169.826 13.0569C169.758 13.0569 169.69 13.0587 169.623 13.0587C165.412 13.0587 161.523 16.4916 161.523 21.224C161.523 21.2274 161.521 21.2327 161.521 21.2362V30.2427C161.521 30.9929 162.13 31.6015 162.88 31.6015H164.429C165.18 31.6015 165.788 30.9929 165.788 30.2427V21.3796C165.788 18.8036 167.628 17.1229 169.882 17.1229C170.295 17.1299 170.737 17.1754 171.171 17.2611C171.29 17.2838 171.409 17.2961 171.53 17.2961C172.39 17.2961 173.135 16.7015 173.336 15.8655C173.446 15.4056 173.529 15.0646 173.605 14.7515C173.682 14.4385 173.63 14.0852 173.452 13.7984C173.271 13.5151 172.99 13.3175 172.659 13.2458ZM184.025 17.1702C184.775 17.1702 185.384 16.5616 185.384 15.8113V14.5697C185.384 13.8194 184.775 13.2108 184.025 13.2108H180.295V9.13079C180.295 8.38054 179.686 7.77195 178.934 7.77195H177.318C176.568 7.77195 175.959 8.38054 175.959 9.13079V23.9871C175.959 28.2647 179.205 32.0457 183.7 32.0457H183.701C184.151 32.0457 184.572 31.8708 184.892 31.5508C185.211 31.2325 185.387 30.8093 185.387 30.3598V29.3123C185.387 28.5568 184.77 27.9552 184.014 27.9534C182.295 27.9465 180.296 26.5999 180.296 24.2407V17.1702H184.025ZM154.449 14.5154C154.447 14.5137 154.444 14.5119 154.442 14.5102C153.008 13.5588 151.231 13.0569 149.302 13.0569C149.269 13.0569 149.236 13.0587 149.202 13.0587C149.169 13.0587 149.136 13.0569 149.103 13.0569C147.174 13.0569 145.395 13.5588 143.963 14.5102C143.961 14.5119 143.958 14.5137 143.956 14.5154C141.375 16.1401 139.799 19.0099 139.799 22.5618C139.799 26.2816 141.528 29.2546 144.33 30.8303C145.636 31.6015 147.188 32.0615 148.86 32.0632C151.913 32.0649 153.758 30.3354 154.337 29.5799V30.2304C154.337 30.9807 154.945 31.5893 155.696 31.5893H157.245C157.995 31.5893 158.604 30.9807 158.604 30.2304V22.5601C158.606 19.0082 157.03 16.1384 154.449 14.5154ZM150.909 27.7506C150.412 27.915 149.907 28.0094 149.405 28.0304C149.368 28.0321 149.332 28.0321 149.295 28.0339C149.263 28.0339 149.234 28.0356 149.202 28.0356C149.171 28.0356 149.141 28.0339 149.11 28.0339C149.073 28.0339 149.036 28.0321 148.999 28.0304C148.498 28.0094 147.99 27.915 147.495 27.7506C145.491 27.0423 144.16 25.0766 144.16 22.5601C144.16 19.5905 146.016 17.3818 148.644 17.1125C148.658 17.1107 148.672 17.1107 148.686 17.109C148.746 17.1037 148.805 17.0985 148.866 17.095C148.9 17.0932 148.935 17.0915 148.968 17.0897C149.026 17.088 149.085 17.0862 149.143 17.0862C149.164 17.0862 149.183 17.0845 149.204 17.0845C149.225 17.0845 149.244 17.0845 149.265 17.0862C149.325 17.0862 149.382 17.088 149.44 17.0897C149.475 17.0915 149.508 17.0932 149.542 17.095C149.601 17.0985 149.662 17.102 149.722 17.109C149.736 17.1107 149.75 17.1107 149.764 17.1125C152.392 17.3818 154.248 19.5888 154.248 22.5601C154.244 25.0749 152.913 27.0423 150.909 27.7506ZM115.766 14.5154C115.765 14.5137 115.761 14.5119 115.759 14.5102C114.325 13.5588 112.549 13.0569 110.62 13.0569C110.586 13.0569 110.553 13.0587 110.52 13.0587C110.487 13.0587 110.453 13.0569 110.42 13.0569C108.491 13.0569 106.713 13.5588 105.28 14.5102C105.279 14.5119 105.275 14.5137 105.273 14.5154C102.692 16.1401 101.116 19.0099 101.116 22.5618C101.116 26.2816 102.846 29.2546 105.648 30.8303C106.954 31.6015 108.505 32.0615 110.177 32.0632C113.231 32.0649 115.076 30.3354 115.654 29.5799V30.2304C115.654 30.9807 116.263 31.5893 117.013 31.5893H118.563C119.313 31.5893 119.922 30.9807 119.922 30.2304V22.5601C119.923 19.0082 118.348 16.1384 115.766 14.5154ZM112.227 27.7506C111.73 27.915 111.225 28.0094 110.723 28.0304C110.686 28.0321 110.649 28.0321 110.613 28.0339C110.581 28.0339 110.551 28.0356 110.52 28.0356C110.488 28.0356 110.459 28.0339 110.427 28.0339C110.39 28.0339 110.354 28.0321 110.317 28.0304C109.815 28.0094 109.308 27.915 108.813 27.7506C106.809 27.0423 105.478 25.0766 105.478 22.5601C105.478 19.5905 107.334 17.3818 109.962 17.1125C109.976 17.1107 109.99 17.1107 110.004 17.109C110.063 17.1037 110.123 17.0985 110.184 17.095C110.217 17.0932 110.252 17.0915 110.286 17.0897C110.343 17.088 110.403 17.0862 110.46 17.0862C110.481 17.0862 110.501 17.0845 110.522 17.0845C110.543 17.0845 110.562 17.0845 110.583 17.0862C110.642 17.0862 110.7 17.088 110.758 17.0897C110.793 17.0915 110.826 17.0932 110.859 17.095C110.919 17.0985 110.98 17.102 111.039 17.109C111.053 17.1107 111.067 17.1107 111.081 17.1125C113.71 17.3818 115.565 19.5888 115.565 22.5601C115.562 25.0749 114.231 27.0423 112.227 27.7506Z" fill="#43B02A" />
                  </g>
                  <defs>
                    <clipPath id="clip0_80_3715">
                      <rect width="184.767" height="37" fill="white" transform="translate(0.616211)" />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
              <Link
                to="/"
                className="text-decoration-none d-inline-block"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="75" height="50" viewBox="0 0 75 50" fill="none">
                  <path d="M22.2018 21.7645V19.9256H18.9062V31.2014H22.2826V24.9526C22.8612 23.647 23.8374 22.994 25.2112 22.9936C25.612 22.9917 26.012 23.0319 26.4046 23.1137V19.8757C26.1149 19.7691 25.7631 19.7158 25.349 19.7158C24.204 19.7158 23.1549 20.3987 22.2018 21.7645Z" fill="#134B97" />
                  <path d="M37.204 29.7124C38.2922 28.5905 38.8363 27.203 38.8363 25.5499C38.8363 23.9107 38.2922 22.5281 37.204 21.402C36.1158 20.2759 34.7647 19.7129 33.1507 19.7129C31.5366 19.7129 30.1874 20.2785 29.1029 21.4099C28.0184 22.5412 27.476 23.9212 27.4756 25.5499C27.4756 27.1787 28.018 28.5602 29.1029 29.6945C30.1878 30.8288 31.537 31.3961 33.1507 31.3965C34.7647 31.398 36.1158 30.8366 37.204 29.7124ZM31.3662 27.4977C30.9027 26.9688 30.671 26.3203 30.671 25.5522C30.671 24.7971 30.9027 24.1536 31.3662 23.6218C31.8296 23.09 32.4247 22.8239 33.1512 22.8235C33.8774 22.8235 34.4741 23.0896 34.9413 23.6218C35.4084 24.154 35.6418 24.7975 35.6414 25.5522C35.6414 26.314 35.408 26.9608 34.9413 27.4926C34.4745 28.0244 33.8778 28.2903 33.1512 28.2903C32.4247 28.2903 31.8296 28.0261 31.3662 27.4977Z" fill="#134B97" />
                  <path d="M58.518 19.7158C56.9534 19.7158 55.6287 20.269 54.5438 21.3752C53.4589 22.4815 52.9165 23.874 52.9165 25.5529C52.9165 27.2732 53.4359 28.6774 54.4746 29.7653C55.5134 30.8532 56.8742 31.3979 58.5573 31.3994C59.6879 31.3994 60.6543 31.1855 61.4565 30.7577C62.291 30.3041 63.039 29.7034 63.6656 28.9838L61.2202 27.5976C60.5892 28.1811 59.7674 28.4728 58.7549 28.4728C57.3021 28.4728 56.4475 27.8198 56.191 26.5138H63.8438C63.8455 26.4219 63.8522 26.3301 63.8637 26.2389C63.8766 26.1226 63.8864 26.016 63.893 25.9192C63.8997 25.8227 63.903 25.7414 63.903 25.6746C63.903 24.0223 63.4001 22.6165 62.3942 21.4571C61.3883 20.2977 60.0962 19.7173 58.518 19.7158ZM56.2303 24.4842C56.3945 23.8585 56.6739 23.3757 57.0683 23.0357C57.4513 22.7 57.9425 22.5185 58.4488 22.5258C58.9484 22.5258 59.4004 22.7231 59.8049 23.1176C60.2093 23.5122 60.451 23.9679 60.53 24.4847L56.2303 24.4842Z" fill="#134B97" />
                  <path d="M71.7661 19.7158C70.6222 19.7158 69.5737 20.3989 68.6206 21.7651V19.9256H65.3267V31.2014H68.6992V24.9526C69.2778 23.647 70.254 22.994 71.6278 22.9936C72.0286 22.9917 72.4285 23.0319 72.8211 23.1137V19.8757C72.53 19.7691 72.1783 19.7158 71.7661 19.7158Z" fill="#134B97" />
                  <path d="M15.6573 17.798C15.7073 17.4101 15.7372 17.0199 15.7469 16.6289H15.7513C15.7513 12.2179 19.2938 8.62925 23.6443 8.62925C27.9949 8.62925 31.5373 12.2195 31.5373 16.6289H34.7183C34.7183 10.4401 29.7506 5.40527 23.6443 5.40527C17.6017 5.40527 12.6772 10.3363 12.5742 16.4365H12.5687C12.5663 16.7541 12.5443 17.0713 12.5028 17.3862C12.3573 18.5317 11.9355 20.1833 10.7532 21.5448C9.8283 22.6107 8.56299 23.3321 6.97775 23.7079V16.2171H3.4082V31.1993H6.97831V27.0015C8.02684 26.823 9.04688 26.5022 10.011 26.0478L13.2301 31.1988H17.5004L12.7895 24.0552C12.9091 23.9312 13.027 23.805 13.141 23.6743C14.8541 21.7007 15.4547 19.3906 15.6573 17.798Z" fill="#134B97" />
                  <path d="M51.4921 34.4966V19.9256H48.2773V20.8855C47.5212 20.1057 46.5648 19.7158 45.408 19.7158C43.981 19.7158 42.7449 20.2596 41.6995 21.3472C40.6541 22.4347 40.1314 23.7835 40.1314 25.3935C40.1314 26.9953 40.6665 28.3305 41.7366 29.399C42.8067 30.4675 44.0295 31.0015 45.4052 31.0011C46.5225 30.9944 47.4923 30.6825 48.3144 30.0654V34.4972C48.2982 36.31 47.5764 38.043 46.3059 39.319C45.0354 40.5951 43.3191 41.3111 41.5304 41.3111C39.7417 41.3111 38.0254 40.5951 36.7549 39.319C35.4844 38.043 34.7625 36.31 34.7464 34.4972H31.5659C31.5659 40.0661 36.036 44.5949 41.529 44.5949C46.9246 44.5949 51.3293 40.2254 51.4865 34.7945H51.4904V34.6408C51.4904 34.592 51.4943 34.5443 51.4943 34.4955L51.4921 34.4966ZM47.612 27.3048C47.1552 27.8157 46.5552 28.0711 45.812 28.0711C45.0821 28.0711 44.4854 27.8157 44.022 27.3048C43.5585 26.7939 43.3268 26.1582 43.3268 25.3975C43.3268 24.6375 43.5585 24.0017 44.022 23.4901C44.4854 22.9785 45.0821 22.7229 45.812 22.7233C46.5482 22.7233 47.1465 22.9789 47.607 23.4901C48.0675 24.0014 48.2976 24.6371 48.2972 25.3975C48.2976 26.1578 48.069 26.7936 47.6115 27.3048H47.612Z" fill="#134B97" />
                  <path d="M53.9759 39.748C53.9691 40.0719 53.8374 40.3802 53.609 40.6068C53.3806 40.8334 53.0737 40.9603 52.7541 40.9603C52.4345 40.9603 52.1276 40.8334 51.8991 40.6068C51.6707 40.3802 51.539 40.0719 51.5322 39.748C51.5322 39.0793 52.0763 38.5425 52.7577 38.5425C53.439 38.5425 53.9759 39.081 53.9759 39.748ZM51.8367 39.748C51.8367 40.2843 52.2285 40.7107 52.7649 40.7107C53.2868 40.7107 53.6715 40.2843 53.6715 39.757C53.6715 39.2297 53.2874 38.7871 52.7577 38.7871C52.228 38.7871 51.8372 39.219 51.8372 39.748H51.8367ZM52.5689 40.3803H52.2922V39.1747C52.4429 39.1479 52.5958 39.1357 52.7488 39.1382C52.9736 39.1382 53.0754 39.1747 53.1623 39.2263C53.1999 39.2589 53.2299 39.2996 53.25 39.3454C53.2701 39.3912 53.2798 39.441 53.2785 39.4911C53.2785 39.6235 53.1772 39.7262 53.0322 39.7716V39.7862C53.1479 39.8305 53.2132 39.9186 53.2497 40.0801C53.2863 40.2636 53.3051 40.3371 53.3366 40.3814H53.0394C53.0029 40.3371 52.9841 40.2271 52.9453 40.0874C52.9237 39.955 52.8512 39.8961 52.6985 39.8961H52.5678L52.5689 40.3803ZM52.5761 39.697H52.7068C52.859 39.697 52.9835 39.6454 52.9835 39.5208C52.9835 39.4086 52.9038 39.3368 52.73 39.3368C52.6789 39.3357 52.6278 39.3405 52.5778 39.3514L52.5761 39.697Z" fill="#134B97" />
                </svg>
              </Link>
              <Link
                to="/"
                className="text-decoration-none d-inline-block"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="113" height="38" viewBox="0 0 113 38" fill="none">
                  <g clip-path="url(#clip0_80_3729)">
                    <path d="M35.0575 29.9492V21.5138C35.0575 20.4707 34.7621 19.6314 34.1711 18.9961C33.5638 18.354 32.7081 18.0064 31.8251 18.0431C30.9266 18.0043 30.0542 18.351 29.4275 18.9961C28.8265 19.6314 28.5261 20.4707 28.5261 21.5138V29.9492L22.6406 29.9964V6.13916H28.5261V14.4479C29.8869 13.223 31.6104 12.6106 33.6967 12.6106C35.8732 12.6106 37.6246 13.3024 38.9511 14.6861C40.2776 16.0698 40.9408 17.7927 40.9408 19.8547V29.9578L35.0575 29.9492Z" fill="#241239" />
                    <path d="M48.4254 10.4532C47.4617 11.4148 46.0141 11.7022 44.7562 11.1815C43.4982 10.6607 42.6772 9.43424 42.6752 8.07281C42.6609 7.17695 43.0184 6.31519 43.6626 5.69245C44.2939 5.06029 45.1506 4.70508 46.044 4.70508C46.9374 4.70508 47.7941 5.06029 48.4254 5.69245C49.0684 6.31585 49.425 7.17736 49.4106 8.07281C49.425 8.96825 49.0684 9.82977 48.4254 10.4532ZM48.9685 29.9489H43.083V13.1126H48.9685V29.9489Z" fill="#241239" />
                    <path d="M11.0608 5.62799C12.7506 5.59964 14.4322 5.87069 16.0276 6.4286C17.4785 6.96091 18.6011 7.5898 19.3953 8.31528C19.9125 8.78105 20.6831 9.54088 20.6831 9.54088L16.6436 13.6684C16.6436 13.6684 15.8344 13.091 15.4502 12.8098C13.8847 11.6522 12.4102 11.0741 11.0264 11.0756C10.321 11.0497 9.62087 11.2064 8.9938 11.5306C8.44862 11.8354 8.17602 12.2489 8.17602 12.7712C8.17602 13.5868 8.78846 14.1428 10.0133 14.439L14.3598 15.4242C18.8959 16.4458 21.1639 18.8391 21.1639 22.6039C21.1639 24.6902 20.3053 26.521 18.5882 28.0965C16.8711 29.672 14.4328 30.459 11.2733 30.4575C9.14262 30.4575 7.27167 30.1513 5.66044 29.5389C4.04921 28.9264 2.75422 28.1444 1.77546 27.1929L0.408203 25.8235L5.05945 21.7453C5.05945 21.7453 5.94591 22.5008 6.30007 22.8657C7.6464 24.2283 9.48657 24.9886 11.4021 24.9735C12.3522 24.9735 13.0949 24.7925 13.63 24.4305C14.1652 24.0684 14.4313 23.6391 14.4285 23.1426C14.4482 22.5901 14.1684 22.0699 13.6966 21.7818C13.21 21.4713 12.4338 21.2001 11.3677 20.9683L7.62655 20.1527C5.81069 19.7692 4.34184 18.9822 3.21999 17.7916C2.09814 16.6011 1.53721 15.0986 1.53721 13.2842C1.53721 11.0548 2.43297 9.22464 4.2245 7.79371C6.01603 6.36277 8.29479 5.64087 11.0608 5.62799Z" fill="#241239" />
                    <path d="M83.6218 27.5792L81.2093 23.7543C80.8931 24.0007 80.5635 24.2292 80.2219 24.4391C79.8233 24.7233 79.3521 24.8885 78.8633 24.9156C77.9775 24.9156 77.5346 24.394 77.5346 23.3508V23.0053H77.5497V17.9762H82.9157V13.1125H77.5497V8.17578H71.6514V24.8082C71.6514 26.6684 72.2409 28.0629 73.42 28.9916C74.5991 29.9202 76.0393 30.3853 77.7407 30.3869C78.7898 30.3935 79.8318 30.2147 80.8186 29.8587C81.7007 29.5651 82.4914 29.0474 83.1131 28.3562C83.3265 28.1287 83.4986 27.8658 83.6218 27.5792Z" fill="#241239" />
                    <path d="M67.4381 15.0335C65.9313 13.456 63.837 12.5752 61.6557 12.6017C59.7239 12.6017 58.2164 13.1805 57.1332 14.3381V13.1125H51.2778V37.4999H57.1289V21.5478C57.1131 20.6319 57.4684 19.7486 58.1141 19.0988C58.7476 18.4455 59.6188 18.0767 60.5288 18.0767C61.4388 18.0767 62.31 18.4455 62.9435 19.0988C64.2601 20.4661 64.2601 22.6296 62.9435 23.9969C62.3196 24.6638 61.4419 25.0344 60.5288 25.0164C60.1199 25.0186 59.7112 24.9942 59.3054 24.9435V30.2064C60.0401 30.385 60.7944 30.4701 61.5505 30.4597C63.7699 30.49 65.9 29.5866 67.4209 27.9699C69.0436 26.3143 69.8542 24.1486 69.8528 21.4727C69.8513 18.7969 69.0464 16.6505 67.4381 15.0335Z" fill="#241239" />
                    <path d="M100.77 31.3484C97.5448 31.3524 94.3481 30.7488 91.3469 29.5691C89.8062 28.9523 88.8412 27.4101 88.9601 25.7549L89.8036 11.9943L93.9912 12.2498L93.1627 25.7721C98.0668 27.623 103.479 27.6131 108.376 25.7442C108.273 24.2267 107.732 16.2549 107.402 11.6015C103.214 13.7136 99.6749 13.8789 97.0713 12.048C95.431 10.8876 94.4676 8.99369 94.4956 6.98464C94.4777 4.88321 95.4814 2.90396 97.1872 1.67659C98.6883 0.583595 100.603 0.228518 102.397 0.710709C104.382 1.24516 106.121 2.77125 107.05 4.78887L103.238 6.54033C102.83 5.65387 102.09 4.97131 101.306 4.75882C100.716 4.59868 100.084 4.72766 99.6041 5.10654C99.0148 5.54746 98.6731 6.24449 98.6854 6.98034C98.6644 7.62309 98.9615 8.23491 99.4796 8.6159C101.074 9.73847 104.294 8.8842 108.091 6.33213C108.753 5.88732 109.609 5.85572 110.302 6.25057C111.276 6.80863 111.332 7.59851 111.407 8.69317L112.579 25.7012C112.716 27.3739 111.739 28.9381 110.175 29.5476C107.182 30.7376 103.99 31.3484 100.77 31.3484Z" fill="#23CC6B" />
                  </g>
                  <defs>
                    <clipPath id="clip0_80_3729">
                      <rect width="112.184" height="37" fill="white" transform="translate(0.408203 0.5)" />
                    </clipPath>
                  </defs>
                </svg>
              </Link>
            </div>
          </div>

        </Modal.Body>
      </Modal>

      <Modal aria-labelledby="contained-modal-title-vcenter"
        centered show={showcalendarmodal} size="md" onHide={() => setShowcalendarmodal(false)}>
        <Modal.Header className=' border-0 pb-0' closeButton>
        </Modal.Header>
        <Modal.Body >
          <div className="text-center">
            <p className="text-dark fw-600 fs-4 mt-3 mb-0">
              What date will your meal plan begin?
            </p>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <DateCalendar value={selectedDate} onChange={(newValue) => setTempSelectedDate(newValue)} />
            </LocalizationProvider>
            <Button className='bg-green fs-6 text-white border-0 w-100 d-block py-2 custom-shadow Raleway mt-4 mb-2' onClick={() => { setSelectedDate(tempSelectedDate); toast.success('Date changed'); setShowcalendarmodal(false) }}>Create Meal Plan</Button>
          </div>

        </Modal.Body>
      </Modal>

      <Modal aria-labelledby="contained-modal-title-vcenter"
        centered show={showmealModal} size="lg" onHide={() => setShowmealModal(false)}>
        <Modal.Header className=' border-0 pb-0'>
          <div className="d-flex justify-content-between align-items-center w-100">
            <div className="d-flex gap-2">
              <Button className='bg-white fs-6 text-green custom-border d-block py-2 custom-shadow Raleway'>Print Shopping List</Button>
              <Button className='bg-green fs-6 text-white border-0 d-block py-2 custom-shadow Raleway' onClick={() => redirectToLogin()}>Order groceries</Button>
            </div>
            <p className="mb-0 fs-5 fw-600">Estimated Cost: $125.00</p>
          </div>
        </Modal.Header>
        <Modal.Body >
          <div className=" perday-meal-grid">
            {ingredientsList && ingredientsList.length > 0 ?
              ingredientsList.map((list) =>
                <DayMeal data={list} />
              )
              :
              <></>
            }
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
