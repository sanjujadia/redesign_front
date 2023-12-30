import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import UserSidebar from '../User_components/UserSidebar';
import TopBar from '../components/TopBar';
import { Button, Col, Form, ProgressBar, Row } from 'react-bootstrap';
import { Link, useParams, useNavigate } from 'react-router-dom';
import MultiSelect from '../components/MultiSelect';
import { closestIndexTo } from 'date-fns';
import axios from 'axios'
import { toast, ToastContainer } from 'react-toastify'

export default function AddPlan() {
  const params = useParams()
  const mealPlanId = params.id
  const navigate = useNavigate()
  const [user, setUser] = useState({})

 
  const initialValues = {
    calories: null,
    fat: null,
    carbs: null,
    protein: null,
    tags: [],
    excludeIngredients: []
  }
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const meals = ['Breakfast', 'Snack-1', 'Lunch', 'Snack-2', 'Dinner', 'Snack-3']
  const [mealPlanTitle, setMealPlanTitle] = useState('')
  const [mealPlanFilter, setMealPlanFilter] = useState(initialValues)
  const [selectedMeals, setSelectedMeals] = useState([])
  const [selectedDays, setSelectedDays] = useState([])
  const [totalRecipes, setTotalRecipes] = useState(null)
  const [mealplan, setMealplan] = useState(null)
  // const [calories, setCalories] = useState(null)

  const fetchMealPlan = async (id) => {
    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getMealPlan/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    }).then(res => res.json())
    if (res.status) {
      console.log(res?.data)
      setMealplan(res?.data)
      setMealPlanTitle(res?.data?.title)
      setSelectedMeals(res?.data?.meals)
      setSelectedDays(res?.data?.days)
      setMealPlanFilter({
        ...mealPlanFilter,
        calories: res?.data?.calories ? res?.data?.calories[1] : "",
        fat: res?.data?.fat ? res?.data?.fat[1] : "",
        carbs: res?.data?.carbs ? res?.data?.carbs[1] : "",
        protein: res?.data?.protein ? res?.data?.protein[1] : "",
        tags: res?.data?.tags.map(item => { return item }),
        excludeIngredients: res?.data?.excludeIngredients.map(item => { return item })
      })
    }
  }

  const handleDays = (data) => {
    const updatedValues = data.map(item => item.value)
    setSelectedDays(updatedValues)
  }

  const handleMeals = (data) => {
    const updatedValues = data.map(item => item.value)
    setSelectedMeals(updatedValues)
  }

  const handleFilterSnackInput = (e) => {
    const { name, value } = e.target
    const newValue = value.split(',').map(item => item.trim())
    const updatedValues = { ...mealPlanFilter, [name]: newValue };
    setMealPlanFilter(updatedValues)
  }

  // function isNumberKey(event){
  //   var charCode = (event.which) ? event.which : event.keyCode
  //   if (charCode > 31 && (charCode < 48 || charCode > 57))
  //       return false;
  //   return true;
  //   }

  const handleFieldValidation = () => {
    if (!mealPlanTitle) {
      toast.error('Meal plan title should not blank')
      return false
    }
    if (selectedDays.length === 0) {
      toast.error('Select atleast one day')
      return false
    }
    if (selectedMeals.length === 0) {
      toast.error('Select atleast one meal type')
      return false
    }
    if (!mealPlanFilter?.calories || !mealPlanFilter?.carbs || !mealPlanFilter?.fat || !mealPlanFilter?.protein) {
      toast.error('Nutrition data should not blank')
      return false
    }

    return true
  }
  const handleAddMealPlan = async () => {
    if (!mealplan) {
      if (handleFieldValidation()) {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/createMealPlan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            title: mealPlanTitle,
            days: selectedDays,
            meals: selectedMeals,
            filter: mealPlanFilter,
          })
        }).then(res => res.json())
        if (res.status) {
          toast.success(res.message)

          if (user?.userType === 'admin') {
            navigate('/plan')
          } else {
            navigate('/save-plan')
          }
        }
      }
    } else {
      if (handleFieldValidation()) {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/updateMealPlan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: mealPlanId,
            title: mealPlanTitle,
            days: selectedDays,
            meals: selectedMeals,
            filter: mealPlanFilter,
          })
        }).then(res => res.json())
        if (res.status) {
          toast.success(res.message)
          if (user?.userType === 'admin') {
            navigate('/plan')
          } else {
            navigate('/save-plan')
          }
        }
      }
    }
  }



  const fetchFilterRecipes = async () => {
    const calories = mealPlanFilter?.calories ? encodeURIComponent(mealPlanFilter?.calories) : 0
    const fat = mealPlanFilter?.fat ? encodeURIComponent(mealPlanFilter?.fat) : 0
    const carbs = mealPlanFilter?.carbs ? encodeURIComponent(mealPlanFilter?.carbs) : 0
    const protein = mealPlanFilter?.protein ? encodeURIComponent(mealPlanFilter?.protein) : 0
    const excludeIngredients = mealPlanFilter?.excludeIngredients.map(ingredient => encodeURIComponent(ingredient)).join('&excluded=')
    const dietLabels = mealPlanFilter?.tags.map(tag => encodeURIComponent(tag)).join('&diet=')
    const healthLabels = mealPlanFilter?.tags.map(tag => encodeURIComponent(tag)).join('&health=')
    const uniqueMealSet = new Set();

    // Convert 'Snack-1', 'Snack-2', and 'Snack-3' to 'Snack'
    const filterMeals = selectedMeals.map(mealType => {
      if (mealType.startsWith('Snack')) {
        return 'Snack';
      }
      return mealType;
    });

    // Add the cleaned meal types to the set to ensure uniqueness
    filterMeals.forEach(mealType => uniqueMealSet.add(mealType));

    // Convert the set back to an array
    const uniqueMealTypes = Array.from(uniqueMealSet);

    // Join the unique meal types with '&mealType='
    const mealType = uniqueMealTypes.map(mealType => encodeURIComponent(mealType)).join('&mealType=');

    const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/getRecipesTotalMealplan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        calories,
        fat,
        carbs,
        protein,
        excludeIngredients,
        mealType,
        dietLabels,
        healthLabels
      })
    }).then(res => res.json())
    if (res.status) {
      console.log(res?.data)
      setTotalRecipes(res?.data?.count)
    }
  }

  console.log('mealPlanFilter', mealPlanFilter)
  useEffect(() => {
    fetchFilterRecipes()
  }, [mealPlanFilter, selectedMeals])

  useEffect(() => {
    let userdata = JSON.parse(localStorage.getItem('userdata'))
    if (userdata) {
      setUser(userdata)
      fetchMealPlan(mealPlanId)
    } else {
      navigate('/')
    }
  }, [localStorage.getItem('userdata')])

  return (
    <div>
      <ToastContainer />
      <div className='mt-1 main-content'>
        <div className='bg-white py-4 px-4'>
          <Row className='align-items-center'>
            <Col lg={12}>
              <div>
              <Link to='/plan' className='text-dark mb-0 fw-600 fs-5 text-decoration-none'>
                                <svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M18.8641 6.73026H4.25331L8.85671 2.12686C9.35722 1.62634 9.35722 0.825985 8.85671 0.375384C8.3562 -0.125128 7.55584 -0.125128 7.10524 0.375384L0.350429 7.0806C0.100173 7.33051 0 7.68094 0 7.98109C0 8.28124 0.100173 8.63168 0.350429 8.88158L7.05529 15.5864C7.55581 16.087 8.35616 16.087 8.80677 15.5864C9.30728 15.0859 9.30728 14.2856 8.80677 13.835L4.20336 9.23157H18.8142C19.4647 9.23157 19.9649 8.68114 19.9649 7.98064C19.9649 7.28049 19.5143 6.73008 18.8641 6.73008V6.73026Z" fill="black" />
                                </svg>{mealplan ? 'Edit Plan' : 'Add New Plan'}</Link>
                {/* <h5 className='text-dark mb-0 fw-600 fs-5 left-border'>{mealplan ? 'Edit Plan' : 'Add New Plan'}</h5> */}
              </div>
            </Col>
          </Row>

        </div>
        <div className='p-xl-5 p-3'>
          <div className='bg-white shadow rounded p-xl-5 p-3'>
            <h5 className='text-muted mb-0 fw-600 fs-15 left-border'>{mealplan ? 'Please edit your plan' : 'Please add you new plan'}</h5>
            <Row className=' mt-5'>
              <Col lg={10} className='mx-auto'>
                <Form className='add-plan-form'>
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Col sm="6">
                      <Form.Label className='text-black fw-600 fs-15'>Title</Form.Label>
                      <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' type="text" placeholder="Enter title" value={mealPlanTitle} onChange={(e) => setMealPlanTitle(e.target.value)} />
                    </Col>
                    <Col sm="6">
                      <Form.Label className='text-black fw-600 fs-15'>Calories</Form.Label>
                      <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' value={mealPlanFilter?.calories == null ? "" : mealPlanFilter?.calories} type="text" placeholder="0" onChange={(e) => setMealPlanFilter(prev => ({ ...prev, calories: e.target.value.replace(/\D/g, "") }))} />
                    </Col>
                  </Form.Group>
                  <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                    <Col sm="6">
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className='text-black fw-600 fs-15'>Days</Form.Label>
                        <MultiSelect data={days} value={selectedDays} handleChange={handleDays} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className='text-black fw-600 fs-15'>Meals</Form.Label>
                        <MultiSelect data={meals} value={selectedMeals} handleChange={handleMeals} />
                      </Form.Group>
                    </Col>
                    <Col sm="6">
                      <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
                        <Col sm="4">
                          <Form.Label className='text-black fw-600 fs-15'>Fat</Form.Label>
                          <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' value={mealPlanFilter?.fat == null ? "" : mealPlanFilter?.fat} type="text" placeholder="0" onChange={(e) => setMealPlanFilter(prev => ({ ...prev, fat: e.target.value.replace(/\D/g, '') }))} />
                        </Col>
                        <Col sm="4">
                          <Form.Label className='text-black fw-600 fs-15'>Carbs</Form.Label>
                          <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' pattern="\d*" value={mealPlanFilter?.carbs == null ? "" : mealPlanFilter?.carbs} type="text" placeholder="0" onChange={(e) => setMealPlanFilter(prev => ({ ...prev, carbs: e.target.value.replace(/\D/g, '') }))} />
                        </Col>
                        <Col sm="4">
                          <Form.Label className='text-black fw-600 fs-15'>Protein</Form.Label>
                          <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' pattern="\d*" value={mealPlanFilter?.protein == null ? "" : mealPlanFilter?.protein} type="text" placeholder="0" onChange={(e) => setMealPlanFilter(prev => ({ ...prev, protein: e.target.value.replace(/\D/g, '') }))} />
                        </Col>
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className='text-black fw-600 fs-15'>Tags</Form.Label>
                        <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' name='tags' value={mealPlanFilter?.tags} type="text" placeholder="Enter tags" onChange={handleFilterSnackInput} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label className='text-black fw-600 fs-15'>Exclude ingredients</Form.Label>
                        <Form.Control className='shadow-none border border-2 fw-600 text-black py-3' name='excludeIngredients' value={mealPlanFilter?.excludeIngredients} type="text" placeholder=" Enter ingredients" onChange={handleFilterSnackInput} />
                      </Form.Group>
                      <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <div className='d-flex justify-content-between'>
                          <Form.Label className='text-black fw-600 fs-15'>Recipes matching all rules</Form.Label><span className='text-muted fs-15 fw-600'>{totalRecipes} recipes</span>
                        </div>
                        <ProgressBar now={totalRecipes} max={15000} />
                      </Form.Group>
                    </Col>
                  </Form.Group>
                </Form>
                <div>
                  <Row>
                    <Col lg={6}></Col>
                    <Col lg={6}>
                      <div className='text-center px-5 mt-3'>
                        <Button className='text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 w-100 py-3' onClick={handleAddMealPlan}>{mealplan ? 'Update Plan' : 'Create Plan'}</Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              </Col>
            </Row>

          </div>
        </div>
      </div>
    </div>
  )
}
