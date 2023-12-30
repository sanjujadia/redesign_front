import React, { useState, useEffect } from 'react';
import TopBar from '../components/TopBar';
import { Button, Col, Row, Modal, ProgressBar } from 'react-bootstrap';
import UserSidebar from '../User_components/UserSidebar';
import WomenWorkout from '../assets/images/Women-workout.png';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider'
import moment from 'moment'
import io from 'socket.io-client';
const socket = io(process.env.REACT_APP_BASE_URL);

export default function Dashboard() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const initialNutritionValue = {
        calories: 2000,
        fats: 65,
        carbs: 300,
        fiber: 25,
        sugar: 50,
        protein: 50,
        vitaminA: 900,
        vitaminC: 90,
        calcium: 1300,
        iron: 18
    }
    const [recipe, setRecipe] = useState(initialNutritionValue)
    const [nutritionalDataModal, setNutritionalDataModal] = useState(false)
    const [calories, setCalories] = useState(null)
    const [protein, setProtein] = useState(null)
    const [carbs, setCarbs] = useState(null)
    const [fat, setFat] = useState(null)
    const [announcement, setAnnouncement] = useState(null)
    const [workout, setWorkout] = useState()
    const [mealPlan, setMealPlan] = useState()
    const [meals, setMeals] = useState([])
    const [date, setDate] = useState(moment())
    const [nutritionDataDate, setNutritionDataDate] = useState()
    const [notifications, setNotifications] = useState([])

    console.log('meals', meals)
    console.log('calories', calories)
    // const fetchMealPlan = async (id) => {
    //     console.log(id)
    //     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getActiveMealPlan/${id}`, {
    //         method: 'GET',
    //         headers: {
    //             "Content-Type": "application/json"
    //         }
    //     }).then(res => res.json()).then(data => { return data })
    //     if (response) {
    //         if (response.data) {
    //             console.log(response.data)
    //             setActiveMealPlan(response.data.mealPlan[0].mealPlanId)
    //         }
    //     }
    // }

    const fetchAnnouncement = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getAnnouncement`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())

        if (res.status) {
            setAnnouncement(res?.data)
        }
    }

    const fetchWorkout = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getWorkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user?._id, date })
        }).then(res => res.json())

        if (res.status) {
            console.log(res.data)
            setWorkout(res.data)
        } else {
            setWorkout(null)
            console.log(res.message)
        }
    }

    const fetchMeals = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getMeals`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId: user?._id, date })
        }).then(res => res.json())

        if (res.status) {
            console.log(res.data)
            setMealPlan(res.data.meal)
            setMeals(res.data.meal.filter(item => moment(item.date).format('YYYY-MM-DD') === moment(date).format('YYYY-MM-DD')))
            // const calories = Object.keys(meals[0].meal).reduce((acc, meal) => {
            //     const mealData = meals[0].meal[meal];
            //     if (mealData && mealData.recipe && mealData.recipe.calories) {
            //       acc += parseInt(mealData.recipe.calories);
            //     }
            //     return acc;
            //   }, 0);
            let totalData
            if (meals && meals[0] && meals[0]?.meal && meals[0].meal != 'undefined') {
                console.log('kkkkkk')
            totalData = Object.keys(meals[0]?.meal).reduce((acc, meal) => {
                const mealData = meals[0].meal[meal];
              
                if (mealData && mealData.recipe) {
                  const calories = parseInt(mealData.recipe.calories)
                  const protein = parseInt(mealData.recipe.totalNutrients['PROCNT'].quantity)
                  const carbs = parseInt(mealData.recipe.totalNutrients['CHOCDF'].quantity)
                  const fat = parseInt(mealData.recipe.totalNutrients['FAT'].quantity)
                  if (calories) {
                    acc.calories += calories;
                  }
                  if (protein) {
                    acc.protein += protein;
                  }
                  if (carbs) {
                    acc.carbs += carbs;
                  }
                  if (fat) {
                    acc.fat += fat;
                  }
                }
              
                return acc;
              }, { calories: 0, protein: 0, carbs: 0, fat: 0 }) 
            }else{
                totalData = { calories: 0, protein: 0, carbs: 0, fat: 0 }
            }
            setCalories(totalData.calories)
            setProtein(totalData.protein)
            setCarbs(totalData.carbs)
            setFat(totalData.fat)
        } else {
            console.log(res.message)
            setMealPlan([])  
        }
    }

    const fetchNotifications = async (id) => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getNotifications/${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())

        if (res.status) {
            console.log('notifications', res.data)
            setNotifications(res.data)
        } else {
            setNotifications(res.data)
        }
    }

    const handleDateChange = (days) => {
        const newDate = moment(date);
        newDate.add(days, 'days');
        setDate(newDate);
        if(mealPlan && mealPlan.length > 0){
            setMeals(mealPlan.filter(item => moment(item.date).format('YYYY-MM-DD') === moment(newDate).format('YYYY-MM-DD')))
            // if (meals && meals[0] && meals[0]?.meal && meals[0]?.meal != 'undefined') {
            //     console.log('kkkkkk')
            // const totalData = Object.keys(meals[0].meal).reduce((acc, meal) => {
            //     const mealData = meals[0].meal[meal];
              
            //     if (mealData && mealData.recipe) {
            //       const calories = parseInt(mealData.recipe.calories)
            //       const protein = parseInt(mealData.recipe.totalNutrients['PROCNT'].quantity)
            //       const carbs = parseInt(mealData.recipe.totalNutrients['CHOCDF'].quantity)
            //       const fat = parseInt(mealData.recipe.totalNutrients['FAT'].quantity)
            //       if (calories) {
            //         acc.calories += calories;
            //       }
            //       if (protein) {
            //         acc.protein += protein;
            //       }
            //       if (carbs) {
            //         acc.carbs += carbs;
            //       }
            //       if (fat) {
            //         acc.fat += fat;
            //       }
            //     }
              
            //     return acc;
            //   }, { calories: 0, protein: 0, carbs: 0, fat: 0 }) 
            // }else{
            //     const totalData = { calories: 0, protein: 0, carbs: 0, fat: 0 }
            // }
        }else{
            setMeals([...meals, {date:new Date(moment().format('YYYY-MM-DD')),meal:{'Breakfast':null,'Snack-1':null,'Lunch':null,'Snack-2':null,'Dinner':null,'Snack-3':null}}])
        }
        
    };

    useEffect(() => {
        fetchWorkout()
        fetchMeals()
    }, [date])

    useEffect(() => {
        let userdata = JSON.parse(localStorage.getItem('userdata'))
        if (isAuthenticated) {
            // fetchMealPlan(user?._id)
            fetchWorkout()
            fetchMeals()
            fetchAnnouncement()
            // fetchNotifications(user?._id)
            socket.emit("setup", userdata);
        } else {
            navigate('/')
        }
    }, [user])

    // console.log('activeMealPlan', activeMealPlan)
    console.log('date', date)

    return (
        <div className='p-4'>
            {/* <div className='dashboard-layout'>
                <div><UserSidebar user={user} /></div>
                <div className='dashboard-content'>
                    <TopBar data={notifications} /> */}
                    <div className=''>
                        <span className='d-block bg-green text-white text-center py-2  mb-5 mt-3 '>{announcement?.announcement}</span>

                        <p className='my-3 fs-5 fw-600 text-dark'>
                            <span onClick={() => handleDateChange(-1)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M14 7L9 12L14 17" stroke="#292929" stroke-width="1.5" stroke-linecap="round" strokeLinejoin="round" />
                            </svg></span>
                            {date.format("dddd, DD MMMM YYYY")}
                            <span onClick={() => handleDateChange(1)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M10 7L15 12L10 17" stroke="#292929" stroke-width="1.5" stroke-linecap="round" strokeLinejoin="round" />
                            </svg></span>
                        </p>

                        <div>
                            <Row className='dashboard-container'>
                                <Col xxl={3}>
                                    <div className='p-3 bg-white shadow rounded'>
                                        {workout ?
                                            <>
                                                <div className='workout-img'>
                                                    <img className='w-100 h-100 object-fit-cover' src={workout?.workout_card?.workoutImage} />
                                                </div>

                                                <div>

                                                    <Button className='bg-green text-white d-block custom-shadow custom-border w-100 my-3 py-3 rounded-0'>{workout?.workout_card?.workoutType}</Button>
                                                    <p className='text-muted fw-normal'>Workout Time: <b className='text-black'>{workout && workout?.workout_card?.workoutTime ? moment(workout?.workout_card?.workoutTime, 'mm:ss').format('mm') : 0} min</b></p>
                                                    {workout?.status == 'Workout' ?
                                                        <Button className='bg-none text-green d-block custom-shadow custom-border w-100 my-2 py-3 rounded' onClick={() => navigate('/user-workout-calendar')}>Start Workout</Button>
                                                        :
                                                        <label className='bg-none text-green text-center d-block custom-shadow custom-border w-100 my-2 py-3 rounded'>{workout?.status ? workout?.status : 'No workout'}</label>
                                                    }

                                                </div>
                                            </>
                                            :
                                            <>No workout for today</>
                                        }
                                    </div>
                                </Col>
                                <Col xxl={9}>
                                    <div>
                                        <Row>
                                            <Col xxl={12}>
                                                <div className='p-3 bg-white shadow rounded mb-4'>
                                                    <h4 className='text-black fs-4 fw-600'>Nutrition</h4>
                                                    <div className='d-flex justify-content-between align-items-center mb-3 nutrition-box'>
                                                        <h4 className='text-black fs-5 fw-600'>Breakfast Title</h4>
                                                        <p className='text-black fs-5 fw-600'>{meals && meals[0] && meals[0].meal && meals[0].meal['Breakfast'] ? meals[0].meal['Breakfast'].recipe.label : ""}</p>
                                                        <div className='breakfast-grid'>
                                                            <div className='text-center'>
                                                                <span className='yellow '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Breakfast'] ? parseInt(meals[0]?.meal['Breakfast']?.recipe?.calories) : 0}</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Cals</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='blue '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Breakfast'] ? parseInt(meals[0]?.meal['Breakfast']?.recipe?.totalNutrients['CHOCDF'].quantity) : 0}</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Carbs</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='lightgreen '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Breakfast'] ? parseInt(meals[0]?.meal['Breakfast']?.recipe?.totalNutrients['PROCNT'].quantity) : 0}</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Protein</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='pink-2 '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Breakfast'] ? parseInt(meals[0]?.meal['Breakfast']?.recipe?.totalNutrients['FAT'].quantity) : 0}</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Fats</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <Button className='text-green bg-none border-0 p-0 fw-600'>Edit</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex justify-content-between align-items-center mb-3 nutrition-box'>
                                                        <h4 className='text-black fs-5 fw-600'>Snack-I</h4>
                                                        <p className='text-black fs-5 fw-600'>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-1'] ? meals[0]?.meal['Snack-1']?.recipe?.label : ""}</p>
                                                        <div className='breakfast-grid'>
                                                            <div className='text-center'>
                                                                <span className='yellow '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-1'] ? parseInt(meals[0]?.meal['Snack-1']?.recipe?.calories) : 0}</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Cals</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='blue '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-1'] ? parseInt(meals[0]?.meal['Snack-1']?.recipe?.totalNutrients['CHOCDF'].quantity) : 0}</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Carbs</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='lightgreen '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-1'] ? parseInt(meals[0]?.meal['Snack-1']?.recipe?.totalNutrients['PROCNT'].quantity) : 0}</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Protein</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='pink-2 '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-1'] ? parseInt(meals[0]?.meal['Snack-1']?.recipe?.totalNutrients['FAT'].quantity) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Fats</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <Button className='text-green bg-none border-0 p-0 fw-600'>Edit</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex justify-content-between align-items-center mb-3 nutrition-box'>
                                                        <h4 className='text-black fs-5 fw-600'>Lunch Title</h4>
                                                        <p className='text-black fs-5 fw-600' style={{width:'300px'}}>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Lunch'] ? meals[0]?.meal['Lunch']?.recipe?.label : ""}</p>
                                                        <div className='breakfast-grid'>
                                                            <div className='text-center'>
                                                                <span className='yellow '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Lunch'] ? parseInt(meals[0]?.meal['Lunch']?.recipe?.calories) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Cals</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='blue '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Lunch'] ? parseInt(meals[0]?.meal['Lunch']?.recipe?.totalNutrients['CHOCDF'].quantity) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Carbs</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='lightgreen '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Lunch'] ? parseInt(meals[0]?.meal['Lunch']?.recipe?.totalNutrients['PROCNT'].quantity) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Protein</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='pink-2 '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Lunch'] ? parseInt(meals[0]?.meal['Lunch']?.recipe?.totalNutrients['FAT'].quantity) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Fats</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <Button className='text-green bg-none border-0 p-0 fw-600'>Edit</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex justify-content-between align-items-center mb-3 nutrition-box'>
                                                        <h4 className='text-black fs-5 fw-600'>Snack-II</h4>
                                                        <p className='text-black fs-5 fw-600'>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-2'] ? meals[0]?.meal['Snack-2']?.recipe?.label : ""}</p>
                                                        <div className='breakfast-grid'>
                                                            <div className='text-center'>
                                                                <span className='yellow '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-2'] ? parseInt(meals[0]?.meal['Snack-2']?.recipe?.calories) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Cals</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='blue '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-2'] ? parseInt(meals[0]?.meal['Snack-2']?.recipe?.totalNutrients['CHOCDF'].quantity) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Carbs</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='lightgreen '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-2'] ? parseInt(meals[0]?.meal['Snack-2']?.recipe?.totalNutrients['PROCNT'].quantity) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Protein</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='pink-2 '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-2'] ? parseInt(meals[0]?.meal['Snack-2']?.recipe?.totalNutrients['FAT'].quantity) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Fats</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <Button className='text-green bg-none border-0 p-0 fw-600'>Edit</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex justify-content-between align-items-center mb-3 nutrition-box'>
                                                        <h4 className='text-black fs-5 fw-600'>Dinner Title</h4>
                                                        <p className='text-black fs-5 fw-600'>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Dinner'] ? meals[0]?.meal['Dinner']?.recipe?.label : ""}</p>
                                                        <div className='breakfast-grid'>
                                                            <div className='text-center'>
                                                                <span className='yellow '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Dinner'] ? parseInt(meals[0]?.meal['Dinner']?.recipe?.calories) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Cals</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='blue '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Dinner'] ? parseInt(meals[0]?.meal['Dinner']?.recipe?.totalNutrients['CHOCDF'].quantity) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Carbs</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='lightgreen '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Dinner'] ? parseInt(meals[0]?.meal['Dinner']?.recipe?.totalNutrients['PROCNT'].quantity) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Protein</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='pink-2 '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Dinner'] ? parseInt(meals[0]?.meal['Dinner']?.recipe?.totalNutrients['FAT'].quantity) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Fats</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <Button className='text-green bg-none border-0 p-0 fw-600'>Edit</Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className='d-flex justify-content-between align-items-center mb-3 nutrition-box'>
                                                        <h4 className='text-black fs-5 fw-600'>Snack-III</h4>
                                                        <p className='text-black fs-5 fw-600'>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-3'] ? meals[0]?.meal['Snack-3']?.recipe?.label : ""}</p>
                                                        <div className='breakfast-grid'>
                                                            <div className='text-center'>
                                                                <span className='yellow '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-3'] ? parseInt(meals[0]?.meal['Snack-3']?.recipe?.calories) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Cals</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='blue '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-3'] ? parseInt(meals[0]?.meal['Snack-3']?.recipe?.totalNutrients['CHOCDF'].quantity) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Carbs</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='lightgreen '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-3'] ? parseInt(meals[0]?.meal['Snack-3']?.recipe?.totalNutrients['PROCNT'].quantity) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Protein</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <span className='pink-2 '>{meals && meals[0] && meals[0].meal && meals[0]?.meal['Snack-3'] ? parseInt(meals[0]?.meal['Snack-3']?.recipe?.totalNutrients['FAT'].quantity) : 0 }</span>
                                                                <p className='text-muted fs-17 mb-0 fw-600'>Fats</p>
                                                            </div>
                                                            <div className='text-center'>
                                                                <Button className='text-green bg-none border-0 p-0 fw-600'>Edit</Button>
                                                            </div>
                                                        </div>
                                                    </div> 
                                                </div>
                                                <div className='px-3 py-4 bg-white shadow rounded mt-3 text-center'>
                                                    <div className='daily-nutri-data'>
                                                        <div className='data-box d-flex justify-content-between align-items-center'>
                                                            <h4 className='text-black fs-5 fw-600'>Today’s Calories</h4>
                                                            <div className='text-center rounded total-data data-1' >
                                                                <p className='mb-2'>{calories ? calories : 0} Calories</p>
                                                                <p className='mb-0'>98% DV</p>
                                                            </div>
                                                        </div>
                                                        <div className='data-box d-flex justify-content-between align-items-center'>
                                                            <h4 className='text-black fs-5 fw-600'>Today’s Protein</h4>
                                                            <div className='text-center rounded total-data data-2' >
                                                                <p className='mb-2'>{protein ? protein : 0} Protein</p>
                                                                <p className='mb-0'>98% DV</p>
                                                            </div>
                                                        </div>
                                                        <div className='data-box d-flex justify-content-between align-items-center'>
                                                            <h4 className='text-black fs-5 fw-600'>Today’s Carbs</h4>
                                                            <div className='text-center rounded total-data data-3' >
                                                                <p className='mb-2'>{carbs ? carbs : 0} Carbs</p>
                                                                <p className='mb-0'>98% DV</p>
                                                            </div>
                                                        </div>
                                                        <div className='data-box d-flex justify-content-between align-items-center'>
                                                            <h4 className='text-black fs-5 fw-600'>Today’s Fat</h4>
                                                            <div className='text-center rounded total-data data-4' >
                                                                <p className='mb-2'>{fat ? fat : 0} Fat</p>
                                                                <p className='mb-0'>98% DV</p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <Button className='border-0 bg-none text-green fw-600 rounded-0 mt-3 mb-2 text-decoration-underline' onClick={() => setNutritionalDataModal(true)}>See All Daily Nutrition Data</Button>
                                                </div>
                                            </Col>
                                        </Row>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                        {/* <div className='mt-3 p-3 bg-white shadow rounded'>
                            <h4 className='text-black fs-4 fw-600'>iWatch | FitBit</h4>
                            <div className='iwatch-grid mt-3 mb-2'>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                                <span className='d-block w-100 text-green custom-border py-2 text-center fs-6 fw-600'>Watch Data</span>
                            </div>
                        </div> */}
                    </div>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={nutritionalDataModal} size="md" onHide={() => { setNutritionalDataModal(false) }}>
                {/* <Modal.Header className='text-center border-0 bg-green custom-modal-header' closeButton>
                    <Modal.Title className='text-white'>Add Video</Modal.Title>
                </Modal.Header> */}
                <Modal.Body className='p-3'>
                    <div className='px-4 py-2'>
                        <h4 className='text-dark mb-1 fw-600 fs-4 mt-3'>Daily Nutrition Data</h4>
                        <p className='my-3 fs-5 fw-600 text-dark'>
                            <span onClick={() => handleDateChange(-1)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M14 7L9 12L14 17" stroke="#292929" stroke-width="1.5" stroke-linecap="round" strokeLinejoin="round" />
                            </svg></span>
                            {date.format("dddd, DD MMMM YYYY")}
                            <span onClick={() => handleDateChange(1)}><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                                <path d="M10 7L15 12L10 17" stroke="#292929" stroke-width="1.5" stroke-linecap="round" strokeLinejoin="round" />
                            </svg></span>
                        </p>
                        {/* <span className='green-line'></span> */}
                        <div className='nutri-progressbar my-3'>
                            <div className='mb-3'>
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <h5 className='text-dark mb-1 fw-600 fs-17'>Calories</h5>
                                    <div>
                                        <h5 className='text-custom-grey mb-1 fw-600 fs-17 d-inline'>{recipe.calories}</h5>
                                        <span><svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                            <circle cx="3.5" cy="3.5" r="3.5" fill="#FF964A" />
                                        </svg></span>
                                        <h5 className='text-dark mb-1 fw-600 fs-17 d-inline'></h5>
                                    </div>
                                </div>
                                <ProgressBar variant='COLOR_CALORIES' now={100} />
                            </div>
                            <div className='mb-3'>
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <h5 className='text-dark mb-1 fw-600 fs-17'>Fat</h5>
                                    <div>
                                        <h5 className='text-custom-grey mb-1 fw-600 fs-17 d-inline'>{recipe?.fats}g</h5>
                                        <span><svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                            <circle cx="3.5" cy="3.5" r="3.5" fill="#FB68AF" />
                                        </svg></span>
                                        <h5 className='text-dark mb-1 fw-600 fs-17 d-inline'>29%</h5>
                                    </div>
                                </div>
                                <ProgressBar variant="COLOR_FATS" now={29} />
                            </div>
                            <div className='mb-3'>
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <h5 className='text-dark mb-1 fw-600 fs-17'>Carbs</h5>
                                    <div>
                                        <h5 className='text-custom-grey mb-1 fw-600 fs-17 d-inline'>{recipe?.carbs}g</h5>
                                        <span><svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                            <circle cx="3.5" cy="3.5" r="3.5" fill="#4EC5E8" />
                                        </svg></span>
                                        <h5 className='text-dark mb-1 fw-600 fs-17 d-inline'>60%</h5>
                                    </div>
                                </div>
                                <ProgressBar variant="COLOR_CARBS" now={60} />
                            </div>
                            <div className='mb-3'>
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <h5 className='text-dark mb-1 fw-600 fs-17'>Fiber</h5>
                                    <div>
                                        <h5 className='text-custom-grey mb-1 fw-600 fs-17 d-inline'>{recipe?.fiber}g</h5>
                                        <span><svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                            <circle cx="3.5" cy="3.5" r="3.5" fill="#9FDC1C" />
                                        </svg></span>
                                        <h5 className='text-dark mb-1 fw-600 fs-17 d-inline'>3%</h5>
                                    </div>
                                </div>
                                <ProgressBar variant="PROGRESS_BAR" now={3} />
                            </div>
                            <div className='mb-3'>
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <h5 className='text-dark mb-1 fw-600 fs-17'>Sugar</h5>
                                    <div>
                                        <h5 className='text-custom-grey mb-1 fw-600 fs-17 d-inline'>{recipe?.sugar}g</h5>
                                        <span><svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                            <circle cx="3.5" cy="3.5" r="3.5" fill="#AA8EFD" />
                                        </svg></span>
                                        <h5 className='text-dark mb-1 fw-600 fs-17 d-inline'>10%</h5>
                                    </div>
                                </div>
                                <ProgressBar variant="COLOR_SUGAR" now={10} />
                            </div>
                            <div className='mb-3'>
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <h5 className='text-dark mb-1 fw-600 fs-17'>Protein</h5>
                                    <div>
                                        <h5 className='text-custom-grey mb-1 fw-600 fs-17 d-inline'>{recipe?.protein}g</h5>
                                        <span><svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                            <circle cx="3.5" cy="3.5" r="3.5" fill="#36FBE0" />
                                        </svg></span>
                                        <h5 className='text-dark mb-1 fw-600 fs-17 d-inline'>10%</h5>
                                    </div>
                                </div>
                                <ProgressBar variant="COLOR_PROTEIN" now={10} />
                            </div>
                            {/* <div className='mb-3'>
                                                                <div className='d-sm-flex align-items-center justify-content-between'>
                                                                    <h5 className='text-dark mb-1 fw-600 fs-17'>Cholesterol</h5>
                                                                    <div>
                                                                        <h5 className='text-custom-grey mb-1 fw-600 fs-17 d-inline'>{recipe?.nutrition?.cholesterol}mg </h5>
                                                                        <span><svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                                                            <circle cx="3.5" cy="3.5" r="3.5" fill="#9FDC1C" />
                                                                        </svg></span>
                                                                        <h5 className='text-dark mb-1 fw-600 fs-17 d-inline'>20%</h5>
                                                                    </div>
                                                                </div>
                                                                <ProgressBar variant="success" now={20} />
                                                            </div> */}
                            <div className='mb-3'>
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <h5 className='text-dark mb-1 fw-600 fs-17'>Vitamin A</h5>
                                    <div>
                                        <h5 className='text-custom-grey mb-1 fw-600 fs-17 d-inline'>{recipe?.vitaminA}mcg</h5>
                                        <span><svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                            <circle cx="3.5" cy="3.5" r="3.5" fill="#F089D1" />
                                        </svg></span>
                                        <h5 className='text-dark mb-1 fw-600 fs-17 d-inline'>100%</h5>
                                    </div>
                                </div>
                                <ProgressBar variant="COLOR_VITAMINA" now={100} />
                            </div>
                            <div className='mb-3'>
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <h5 className='text-dark mb-1 fw-600 fs-17'>Vitamin C</h5>
                                    <div>
                                        <h5 className='text-custom-grey mb-1 fw-600 fs-17 d-inline'>{recipe?.vitaminC}mg</h5>
                                        <span><svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                            <circle cx="3.5" cy="3.5" r="3.5" fill="#ADD0D5" />
                                        </svg></span>
                                        <h5 className='text-dark mb-1 fw-600 fs-17 d-inline'>100%</h5>
                                    </div>
                                </div>
                                <ProgressBar variant="COLOR_VITAMINC" now={100} />
                            </div>
                            <div className='mb-3'>
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <h5 className='text-dark mb-1 fw-600 fs-17'>Calcium</h5>
                                    <div>
                                        <h5 className='text-custom-grey mb-1 fw-600 fs-17 d-inline'>{recipe?.calcium}mg</h5>
                                        <span><svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                            <circle cx="3.5" cy="3.5" r="3.5" fill="#F8C91B" />
                                        </svg></span>
                                        <h5 className='text-dark mb-1 fw-600 fs-17 d-inline'>100%</h5>
                                    </div>
                                </div>
                                <ProgressBar variant="COLOR_CALCIUM" now={100} />
                            </div>
                            <div className='mb-3'>
                                <div className='d-sm-flex align-items-center justify-content-between'>
                                    <h5 className='text-dark mb-1 fw-600 fs-17'>Iron</h5>
                                    <div>
                                        <h5 className='text-custom-grey mb-1 fw-600 fs-17 d-inline'>{recipe?.iron}mg</h5>
                                        <span><svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                            <circle cx="3.5" cy="3.5" r="3.5" fill="#FFF400" />
                                        </svg></span>
                                        <h5 className='text-dark mb-1 fw-600 fs-17 d-inline'>100%</h5>
                                    </div>
                                </div>
                                <ProgressBar variant="COLOR_IRON" now={100} />
                            </div>
                            <div>
                                <span className='mt-3 bg-light px-5 py-4 text-center rounded w-100 d-inline-block text-dark fw-600 fs-6'>% Daily Value ≈ 2,000 Calorie Diet</span>
                            </div>

                        </div>

                    </div>
                </Modal.Body>
            </Modal>
        </div>
    )
}



