import React, { useState } from 'react'
import './App.css';
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { AuthProvider } from './context/AuthProvider'
import Home from "./components/Home";
import Login from './pages/Login';
import YourProfile from './pages/YourProfile';
import Users from './pages/Users';
import UserDeatils from './pages/UserDeatils';
import Message from './pages/Message';
import Shop from './pages/Shop';
import Announcement from './pages/Announcement';
import Faq from './pages/Faq';
import Recipe from './pages/Recipe';
import ViewRecipe from './pages/ViewRecipe';
import EditRecipe from './pages/EditRecipe';
import AddRecipe from './pages/AddRecipe';
import CreateRecipe from './pages/CreateRecipe';
import HowToVideos from './pages/HowToVideos';
import VideoDetail from './pages/VideoDetail';
import AddVideo from './pages/AddVideo';
import Database from './pages/Database';
import Plan from './pages/Plan';
import ViewMealPlan from './pages/ViewMealPlan';
import AddPlan from './pages/AddPlan';
import WorkOutCalendar from './pages/WorkOutCalendar';
import AddWorkout from './pages/AddWorkout';
import CreateWorkout from './pages/CreateWorkout';
import CreateWorkoutCard from './pages/CreateWorkoutCard';
import WorkoutView from './pages/WorkoutView';
import Dashboard from './user_pages/Dashboard';
import UserRecipe from './user_pages/UserRecipe';
import SavedPlan from './user_pages/SavedPlan';
import FavoriteRecipe from './user_pages/FavoriteRecipe';
import ExerciseDatabase from './user_pages/ExerciseDatabase';
import FavoriteWorkout from './user_pages/FavoriteWorkout';
import UserProfile from './user_pages/UserProfile';
import UserShop from './user_pages/UserShop';
import UserVideos from './user_pages/UserVideos';
import UserFaq from './user_pages/UserFaq';
import ShareEarn from './user_pages/ShareEarn';
import MessageSupport from './user_pages/MessageSupport';
import UserWorkoutCalendar from './user_pages/UserWorkoutCalendar';
import MealPlanner from './user_pages/MealPlanner';
import MyPages from './pages/MyRecipe';
import AddUserRecipe from './pages/AddUserRecipe';
import CreateUserRecipe from './pages/CreateUserRecipe';
import AddUserPlan from './pages/AddUserPlan';
import ViewUserMealPlan from './pages/ViewUserMealPlan';     

const App = () => {
  const [token, setToken] = useState(JSON.parse(localStorage.getItem('userdata'))?.token)
 
  if(!token){
    return <Login setToken={setToken}/>
  }
  return (
    <div className="App">
        <AuthProvider>
          <Routes>
            <Route path="/login" element={<Login setToken={setToken}/>} />
            <Route path="/*" element={<Home />}>
              <Route path="yourprofile" element={<YourProfile />} />
              <Route path="user" element={<Users />} />
              <Route path="userdetail/:id" element={<UserDeatils />} />
              <Route path="message" element={<Message />} />
              <Route path="shop" element={<Shop />} />
              <Route path="announcement" element={<Announcement />} />
              <Route path="faq" element={<Faq />} />
              <Route path="recipe" element={<Recipe />} />
              <Route path="view-recipe/:id" element={<ViewRecipe />} />
              <Route path="edit-recipe/:id" element={<EditRecipe />} />
              <Route path="add-recipe" element={<AddRecipe />} />
              <Route path="add-user-recipe" element={<AddUserRecipe />} />
              <Route path="create-recipe" element={<EditRecipe />} />
              <Route path="create-user-recipe" element={<CreateUserRecipe />} />
              <Route path="how-to-videos" element={<HowToVideos />} />
              <Route path="video-detail/:id" element={<VideoDetail />} />
              <Route path="add-video" element={<AddVideo />} />
              <Route path="database" element={<Database />} />
              <Route path="plan" element={<Plan />} />
              <Route path="view-mealplan/:id" element={<ViewMealPlan />} />
              <Route path="view-usermealplan/:id" element={<ViewUserMealPlan />} />
              <Route path="add-plan" element={<AddPlan />} />
              <Route path="add-userplan" element={<AddUserPlan />} />
              <Route path="add-userplan/:id" element={<AddUserPlan />} />
              <Route path="add-plan/:id" element={<AddPlan />} />
              <Route path="workout-calendar" element={<WorkOutCalendar />} />
              <Route path="add-workout" element={<AddWorkout />} />
              <Route path="create-workout" element={<CreateWorkout />} />
              <Route path="create-workout-card" element={<CreateWorkoutCard />} />
              <Route path="workout-view" element={<WorkoutView />} />
              {/* <---------User-side-start---------> */}
              <Route path="my-recipe" element={<MyPages />} />
              <Route path="user-recipe" element={<UserRecipe />} />
              <Route path="save-plan" element={<SavedPlan />} />
              <Route path="favorite-recipe" element={<FavoriteRecipe />} />
              <Route path="exercise-database" element={<ExerciseDatabase />} />
              <Route path="favorite-workout" element={<FavoriteWorkout />} />
              <Route path="user-profile" element={<UserProfile />} />
              <Route path="user-shop" element={<UserShop />} />
              <Route path="user-videos" element={<UserVideos />} />
              <Route path="user-faq" element={<UserFaq />} />
              <Route path="message-support" element={<MessageSupport />} />
              <Route path="share-earn" element={<ShareEarn />} />
              <Route path="user-workout-calendar" element={<UserWorkoutCalendar />} />
              <Route path="meal-planner" element={<MealPlanner />} />
            </Route>
            {/* <---------User-side-start---------> */}

          </Routes>
        </AuthProvider>
      
    </div>

  );
}

export default App;
