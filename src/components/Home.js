import React, { useState, useEffect } from 'react';
import { Routes, Route, useNavigate, Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import UserSidebar from '../User_components/UserSidebar';
import TopBar from '../components/TopBar';
import Admindashboard from "../pages/Admindashboard";
import YourProfile from '../pages/YourProfile';
import Users from '../pages/Users';
import UserDeatils from '../pages/UserDeatils';
import Message from '../pages/Message';
import Shop from '../pages/Shop';
import Announcement from '../pages/Announcement';
import Faq from '../pages/Faq';
import Recipe from '../pages/Recipe';
import ViewRecipe from '../pages/ViewRecipe';
import EditRecipe from '../pages/EditRecipe';
import AddRecipe from '../pages/AddRecipe';
import CreateRecipe from '../pages/CreateRecipe';
import HowToVideos from '../pages/HowToVideos';
import VideoDetail from '../pages/VideoDetail';
import AddVideo from '../pages/AddVideo';
import Database from '../pages/Database';
import Plan from '../pages/Plan';
import ViewMealPlan from '../pages/ViewMealPlan';
import AddPlan from '../pages/AddPlan';
import WorkOutCalendar from '../pages/WorkOutCalendar';
import AddWorkout from '../pages/AddWorkout';
import CreateWorkout from '../pages/CreateWorkout';
import CreateWorkoutCard from '../pages/CreateWorkoutCard';
import WorkoutView from '../pages/WorkoutView';
import Dashboard from '../user_pages/Dashboard';
import UserRecipe from '../user_pages/UserRecipe';
import SavedPlan from '../user_pages/SavedPlan';
import FavoriteRecipe from '../user_pages/FavoriteRecipe';
import ExerciseDatabase from '../user_pages/ExerciseDatabase';
import FavoriteWorkout from '../user_pages/FavoriteWorkout';
import UserProfile from '../user_pages/UserProfile';
import UserShop from '../user_pages/UserShop';
import UserVideos from '../user_pages/UserVideos';
import UserFaq from '../user_pages/UserFaq';
import ShareEarn from '../user_pages/ShareEarn';
import MessageSupport from '../user_pages/MessageSupport';
import UserWorkoutCalendar from '../user_pages/UserWorkoutCalendar';
import MealPlanner from '../user_pages/MealPlanner';
import { Button, ButtonGroup, Col, Form, ProgressBar, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Salad from '../assets/images/greek-salad.png';
import UserImg from '../assets/images/admin.png';
import SplineChart from '../components/SplineChart';
import { differenceInDays } from 'date-fns'
import { useAuth } from '../context/AuthProvider'
import moment from 'moment';
import io from 'socket.io-client';


const socket = io(process.env.REACT_APP_BASE_URL);

export default function Home({children}) {
  const navigate = useNavigate()
  const { user, isAuthenticated, showSidebar } = useAuth()
  const [latestRecipes, setLatestRecipes] = useState([])
  const [latestMealPlans, setLatestMealPlans] = useState([])
  const [latestUsers, setLatestUsers] = useState([])
  const [latestMessages, setLatestMessages] = useState([])
  const [visitorSearchValue, setVisitorSearchValue] = useState('lastweek')
  const [visitorData, setVisitorData] = useState([])
  const [activeMembers, setActiveMembers] = useState(0)
  const [monthlySubscriber, setMonthlySubscriber] = useState(0)
  const [yearlySubscriber, setYearlySubscriber] = useState(0)


  // const fetchRecipesData = async () => {
  //   const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getLatestRecipes`, {
  //     method: 'GET',
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   }).then(res => res.json()).then(data => { return data })
  //   if (response) {
  //     setLatestRecipes(response.data)
  //   } else {
  //     setLatestRecipes([])
  //   }
  // }
  // const fetchMealPlansData = async () => {
  //   const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getLatestMealPlans`, {
  //     method: 'GET',
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   }).then(res => res.json()).then(data => { return data })
  //   if (response) {
  //     // let mealPlanData = response.data
  //     // mealPlanData.map(mealPlan => {
  //     //   mealPlan['diffDays'] = differenceInDays(new Date(), new Date(mealPlan.updatedAt))

  //     // })
  //     setLatestMealPlans(response.data)
  //   } else {
  //     setLatestMealPlans([])
  //   }
  // }

  // const fetchUsersData = async (req, res) => {
  //   const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getLatestUsers`, {
  //     method: 'GET',
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   }).then(res => res.json()).then(data => { return data })
  //   if (response) {
  //     setLatestUsers(response.data)
  //   } else {
  //     setLatestUsers([])
  //   }
  // }

  // const fetchMessagesData = async (req, res) => {
  //   const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getLatestMessages`, {
  //     method: 'GET',
  //     headers: {
  //       "Content-Type": "application/json"
  //     }
  //   }).then(res => res.json()).then(data => { return data })
  //   if (response) {
  //     setLatestMessages(response.data)
  //   } else {
  //     setLatestMessages([])
  //   }
  // }

  // const fetchVisitorData = async () => {

  //   const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getVisitorData`, {
  //     method: 'POST',
  //     headers: {
  //       "Content-Type": "application/json"
  //     },
  //     body: JSON.stringify({ dataParam: visitorSearchValue })
  //   }).then(res => res.json()).then(data => {
  //     console.log('visitor data', data)
  //     return data
  //   })
  //   if (response) {
  //     console.log('response.chartData', response.chartData)
  //     setVisitorData(response.chartData)
  //   } else {
  //     setVisitorData([])
  //   }
  // }

  // const fetchActiveMembers = async () => {
  //   const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getActiveMembers`, {
  //     method: 'GET',
  //     headers: {
  //       "Content-Type": "application/json"
  //     },

  //   }).then(res => res.json()).then(data => { return data })
  //   if (response) {
  //     setActiveMembers(response.data.length)
  //   } else {
  //     setActiveMembers(0)
  //   }
  // }

  // const fetchMonthlySubscribers = async () => {
  //   const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getMonthlySubscriber`, {
  //     method: 'GET',
  //     headers: {
  //       "Content-Type": "application/json"
  //     },

  //   }).then(res => res.json()).then(data => { return data })
  //   if (response.status) {
  //     setMonthlySubscriber(response.data.length)
  //   }
  // }

  // const fetchYearlySubscribers = async () => {
  //   const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getAnnualSubscriber`, {
  //     method: 'GET',
  //     headers: {
  //       "Content-Type": "application/json"
  //     },

  //   }).then(res => res.json()).then(data => { return data })
  //   if (response) {
  //     setYearlySubscriber(response.data.length)
  //   } else {
  //     setYearlySubscriber(0)
  //   }
  // }
  // useEffect(() => {
  //   fetchVisitorData()
  // }, [visitorSearchValue])

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login')
    }
  }, [user,isAuthenticated])

  return (
    <div>
      <div className='dashboard-layout'>
        <div>{user?.userType === 'admin' ? <Sidebar user={user}/> : <UserSidebar user={user}/>}</div>
        <div className={`dashboard-content ${showSidebar && 'dash-active'}`}>
          <TopBar />
          <div className='main-content'>
            <Routes>
            { user?.userType === 'admin' ? <Route path='/' element={<Admindashboard />} /> : <Route path="/" element={<Dashboard />} />}
            </Routes>
            <Outlet/>
          </div>
        </div>
      </div>
    </div>
  )
}