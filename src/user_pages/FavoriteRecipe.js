import React, { useEffect, useState } from 'react';
//import TopBar from '../components/TopBar';
import { Button, Col, Row } from 'react-bootstrap';
//import UserSidebar from '../User_components/UserSidebar';
import FavoriteRecipeCard from '../User_components/FavoriteRecipeCard';
//import { useAuth } from '../context/AuthProvider';
//import { useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Usertrytofavcard from '../User_components/Usertrytofavcard';
import { TailSpin } from 'react-loader-spinner';

export default function FavoriteRecipe() {
    // const navigate = useNavigate()
    // const { user, isAuthenticated } = useAuth()
    // const [recipes, setRecipes] = useState([])
    const [loading, setLoading] = useState(true);
    const [favouriteData, setFavouriteData] = useState([]);
    const [dataFound, setDataFound] = useState(true);


    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             const userdata = JSON.parse(localStorage.getItem('userdata'));
    //             const token = userdata.token;
    
    //             const response = await fetch(`${process.env.REACT_APP_BASE_URL}/favtry/getallMyFavourire`, {
    //                 method: 'GET',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'Authorization': `Bearer ${token}`,
    //                 },
    //             });
    
               
    //             const data = await response.json();
    //             console.log(data, "dataaaa>>>");
    
    //             if (data.status) {
    //                 setFavouriteData(data);
    //             } else {
    //                 console.error("error");
    //             }
    //         } catch (error) {
    //             console.error('Error fetching data:', error);
    //         }
    //     };
    
    //     fetchData();
    // }, []);
    
    useEffect(() => {
        const fetchData = async () => {
          setLoading(true);
          try {
            const userdata = JSON.parse(localStorage.getItem('userdata'));
            const token = userdata.token;
      
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/favtry/getallMyFavourire`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            });
      
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
               
            }
      
            const data = await response.json();
         
      
            if (data.status) {
              const detailedRecipes = await Promise.all(
                data.data.map(async (recipe) => {
                  const detailedResponse = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/recipe/${recipe.recipeId}`);
                  const detailedData = await detailedResponse.json();
      
                  if (detailedData.status) {
                    setLoading(false);
                    return detailedData.data;  
                   
                  } else {
                    console.error(detailedData.message);
                    setDataFound(false);
                    return null; // Return null if fetching details fails
                  }
                })
              );
      
              setFavouriteData(detailedRecipes.filter(recipe => recipe !== null));
              setDataFound(true);
            } else {
              setLoading(false);
              setDataFound(false);
              console.error(data.message);
            }
          } catch (error) {
            console.error('Error fetching data:', error);
            setLoading(false);
            setDataFound(false);
          }
        };
      
        fetchData();
      }, []);
      
    

 

    // useEffect(() => {

    //     if (isAuthenticated) {
    //         fetchFavouriteRecipe(user?._id)
    //     } else {
    //         navigate('/')
    //     }

    // }, [user])

    return (
        <div>
            <ToastContainer />
            {loading && (
        <div className="loader-overlay">
          <TailSpin height={80} width={80} color="#4fa94d" ariaLabel="tail-spin-loading" radius={1} visible={true} />
        </div>
      )}
            <div className='main-content mt-1'>
                <div className='bg-white p-3'>
                    <Row>
                        <Col lg={4}>
                        <div style={{ height: '60px' }}>
                                <h5 className='text-dark mb-0 fw-600 fs-5 left-border'>Favorite Recipes</h5>
                                <p className='text-custom-grey fw-600 fs-17 ps-2 mb-0'>{favouriteData ? favouriteData.length : 0} Recipes</p>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div className='text-end'>
                                <Button className='text-custom-grey mb-0 fw-600 fs-17 bg-none border border-gray px-3'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="17" height="18" viewBox="0 0 17 18" fill="none">
                                    <path d="M0.918945 0H16.7566V2.56205H0.918945V0Z" fill="#959595" />
                                    <path d="M9.30334 10.7136H6.74145V13.9742L10.9338 17.2348L10.9336 10.2476L15.3355 3.74951H2.33936L6.50838 9.78179H9.30322C9.55942 9.78179 9.76899 10.038 9.76899 10.2942C9.76899 10.5504 9.55941 10.7133 9.30322 10.7133L9.30334 10.7136Z" fill="#959595" />
                                </svg>Filter</Button>
                            </div>
                        </Col>
                    </Row>

                </div>
                {/* <div className='p-xl-5 p-3'>
                    <Row>
                        <Col lg={12}>
                            <div className='recipe-grid'>
                                {favouriteData && favouriteData.length > 0 ? favouriteData.map((recipe, i) => (
                                    <FavoriteRecipeCard data={recipe} />

                                ))
                                    :
                                    <></>
                                }
                                
                            </div>
                        </Col>
                    </Row>
                </div> */}

                <div className='p-xl-5 p-3'>
                    <Row>
                        <Col lg={12}>
                            
                            <div className='recipe-grid'>
                                {dataFound ? favouriteData.map(item => (
                                    <Usertrytofavcard data={item} />
                                ))
                                    :
                                    <> <p>no favorite recipes found.
                                 </p></>}

                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
