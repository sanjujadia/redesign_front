import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import UserSidebar from '../User_components/UserSidebar';
import TopBar from '../components/TopBar';
import { Button, ButtonGroup, Col, Form, Modal, ProgressBar, Row, Tab, Tabs } from 'react-bootstrap';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SladPic from '../assets/images/greek-salad-food 2.png';
import UserImg from '../assets/images/young-man.png';
import { ToastContainer, toast } from 'react-toastify';

export default function ViewRecipe() {
    const params = useParams()
    const navigate = useNavigate()
    const [showModal, setShowModal] = useState(false)
    const [MoreStatus, setMoreStatus] = useState(false)
    const [user, setUser] = useState({})
    const [recipe, setRecipe] = useState({})
    const [nutrients, setNutrients] = useState()

    const handleDropdownTwoButton = () => {
        setMoreStatus(!MoreStatus)
    }
  
    // const fetchRecipe = async () => {
    //     const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/recipe/${params.id}`, {
    //         method: 'GET',
    //         headers: {
    //             'Content-Type': 'application/json'
    //         }
    //     }).then(res => res.json())
    //     console.log(response)
    //     if (response.status) {
    //         const nutrientsArray = Object.keys(response?.data?.recipe?.totalNutrients
    //            ).map((nutrientKey) => ({
    //             id: nutrientKey, // You can use a unique identifier if needed
    //             label: response?.data?.recipe?.totalNutrients[nutrientKey].label,
    //             quantity: response?.data?.recipe?.totalNutrients[nutrientKey].quantity,
    //             unit: response?.data?.recipe?.totalNutrients[nutrientKey].unit,
    //             dailyQuantity: response?.data?.recipe?.totalDaily[nutrientKey]?.quantity,
    //             dailyUnit: response?.data?.recipe?.totalDaily[nutrientKey]?.unit
    //           }));
    //           setRecipe(response.data)
    //           setNutrients(nutrientsArray);
    //     }
    // }
    const fetchRecipe = async () => {
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/recipe/${params.id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            }).then(res => res.json());

            console.log(response);

            if (response.status) {
                const nutrientsArray = response?.data?.recipe?.totalNutrients
                    ? Object.keys(response?.data?.recipe?.totalNutrients).map((nutrientKey) => ({
                        id: nutrientKey,
                        label: response?.data?.recipe?.name,
                        photo: response?.data?.recipe?.photo,
                        quantity: response?.data?.recipe?.totalNutrients[nutrientKey]?.quantity,
                        unit: response?.data?.recipe.totalNutrients[nutrientKey]?.unit,
                        dailyQuantity: response?.data?.recipe.totalDaily[nutrientKey]?.quantity,
                        dailyUnit: response?.data?.recipe?.totalDaily[nutrientKey]?.unit
                    }))
                    : [];

                setRecipe(response.data);
                setNutrients(nutrientsArray);
            }
        } catch (error) {
            console.error('Error fetching recipe:', error);
        }
    };

    const handleDeleteRecipe = async () => {
        console.log('handleDeleteRecipe called');

        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/deleteFavouriteRecipe`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: params.id })
        }).then(res => res.json()).then(data => { return data })

        toast.success(response.message)
        // props.reloadParent();
    }

    useEffect(() => {
        let userdata = JSON.parse(localStorage.getItem('userdata'))
        if (userdata) {
            setUser(userdata)
            fetchRecipe()
        } else {
            navigate('/')
        }
    }, [localStorage.getItem('userdata')])


    const handleTryButton = async () => {
        let userdata = JSON.parse(localStorage.getItem('userdata'));
        // const strippedRecipeId = params.id.substring("recipe_".length);
        try {
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/AddToTryFavRecipe`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${userdata?.token}`
                },
                body: JSON.stringify({ userId: userdata?._id, recipeId: params.id, description: "your_description", type: "recipe" })
            });

            const responseData = await response.json();

            if (responseData?.status) {
                toast.success(responseData.message);
                // props.reloadParent();  
            } else {
                toast.error(responseData.message);
            }
        } catch (error) {
            console.error('Error during handleTryButton:', error);
            toast.error('Error adding to want to try list');
        }
    };


    const handleFavButton = async () => {
        let userdata = JSON.parse(localStorage.getItem('userdata'));
        const response = await fetch(`${process.env.REACT_APP_BASE_URL}/favtry/addFavourire`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${userdata?.token}`
            },
            body: JSON.stringify({ recipeId: params.id, type: "recipe" })
        }).then(res => res.json())
        console.log(response);
        if (response?.status) {
            toast.success(response.message)
        }
    }

    return (
        <div>
            <div>
                {/* <div>
                    {user.userType === 'admin' ? <Sidebar user={user} /> : <UserSidebar user={user} />}
                </div> */}
                <div className='dashboard-content'>
                    {/* <TopBar /> */}
                    <div className='mt-1 main-content'>
                        <div className='bg-white py-3 px-4'>
                            <Row>
                                <Col lg={8} md={8}>
                                    <div>
                                        <Link to={user?.userType === "admin" ? "/recipe" : "/user-recipe"} className='text-dark mb-0 fw-600 fs-5 text-decoration-none'><svg className='me-3' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none">
                                            <path d="M18.8641 6.73026H4.25331L8.85671 2.12686C9.35722 1.62634 9.35722 0.825985 8.85671 0.375384C8.3562 -0.125128 7.55584 -0.125128 7.10524 0.375384L0.350429 7.0806C0.100173 7.33051 0 7.68094 0 7.98109C0 8.28124 0.100173 8.63168 0.350429 8.88158L7.05529 15.5864C7.55581 16.087 8.35616 16.087 8.80677 15.5864C9.30728 15.0859 9.30728 14.2856 8.80677 13.835L4.20336 9.23157H18.8142C19.4647 9.23157 19.9649 8.68114 19.9649 7.98064C19.9649 7.28049 19.5143 6.73008 18.8641 6.73008V6.73026Z" fill="black" />
                                        </svg>
                                            {/* {recipe?.recipe?.label} */}
                                            {recipe?.name}
                                        </Link>
                                    </div>
                                </Col>
                                <Col lg={4} md={4}>
                                    {/* <div className='text-end'>

                                        <Button className='text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 px-3'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                            <path fillRule="evenodd" clipRule="evenodd" d="M13.3033 5.3513L9.56443 7.29614C8.55782 6.1929 7.1091 5.49975 5.49976 5.49975C2.46381 5.49975 0 7.96392 0 10.9999C0 14.0359 2.464 16.5001 5.49976 16.5001C6.69768 16.5001 7.8065 16.1161 8.70977 15.4661L12.2441 17.7332C12.1505 18.0389 12.0999 18.3633 12.0999 18.7C12.0999 20.5216 13.5782 22 15.3999 22C17.2216 22 18.7 20.5216 18.7 18.7C18.7 16.8783 17.2216 15.4 15.3999 15.4C14.718 15.4 14.0843 15.6068 13.5585 15.9622L10.2211 13.8216C10.715 12.9966 10.9999 12.0308 10.9999 11C10.9999 10.3652 10.8922 9.75587 10.694 9.18832L14.3022 7.3116C15.1084 8.22353 16.2877 8.79991 17.6 8.79991C20.0288 8.79991 22 6.82876 22 4.39995C22 1.97114 20.0288 0 17.6 0C15.1712 0 13.2 1.97114 13.2 4.39995C13.2 4.72664 13.2352 5.04449 13.3033 5.35149L13.3033 5.3513Z" fill="white" />
                                        </svg>Share</Button>
                                    </div> */}
                                </Col>
                            </Row>

                        </div>
                        <div className='p-xl-5 p-3'>
                            <Row>
                                <Col xxl={7} lg={12} md={12} className='mb-3'>
                                    <div className='bg-white pb-3'>
                                        <div className='view-recipe-img'>
                                            <img src={recipe?.lphoto || recipe?.photo} className='w-100 h-100 object-fit-cover' />
                                        </div>
                                        <div className='d-sm-flex align-items-center justify-content-between p-3'>
                                            <div>
                                                <p className='text-custom-grey fw-normal fs-17 ps-2 mb-0 d-inline me-3'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                    <path d="M10.7161 0C5.17345 0 0.666992 4.57565 0.666992 10.2034C0.666992 15.8312 5.17345 20.4069 10.7161 20.4069C16.2588 20.4069 20.7653 15.8312 20.7653 10.2034C20.7653 4.57565 16.2588 0 10.7161 0ZM15.2226 12.0335H9.36447V4.48397H11.167V9.97443H15.2228L15.2226 12.0335Z" fill="#86C52F" />
                                                </svg>{recipe?.totaltime} minutes</p>
                                                <p className='text-custom-grey fw-normal fs-17 ps-2 mb-0 d-inline me-3'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M18.8859 7.22865C18.6167 6.90192 18.1382 6.8564 17.8142 7.12979L13.4622 10.8119H2.32854C1.90861 10.8119 1.56787 11.1579 1.56787 11.5841V15.1414C1.56787 17.0126 3.06788 18.5348 4.91074 18.5348H14.9592C16.8021 18.5348 18.3012 17.0126 18.3012 15.1414V11.5841C18.3012 11.1579 17.9613 10.8119 17.5407 10.8119H15.8392L18.7888 8.31586C19.1113 8.04328 19.1555 7.55603 18.8862 7.2285" fill="#FF964A" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.13206 8.49536C6.32824 8.49536 6.52296 8.41819 6.66978 8.26911L9.71211 5.17992C9.98601 4.90195 10.0111 4.4586 9.76849 4.15127L6.72602 0.289881C6.59829 0.12854 6.41193 0.0249757 6.20888 0.00410004C6.00727 -0.0174479 5.80114 0.0466581 5.64451 0.179445L1.08091 4.04084C0.896935 4.19679 0.795735 4.43167 0.808733 4.6749C0.822394 4.91812 0.947073 5.14141 1.14643 5.27648L5.71003 8.36567C5.83856 8.45294 5.98618 8.49536 6.13223 8.49536" fill="#FF964A" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.6956 7.72327C11.1154 7.72327 11.4561 7.37729 11.4561 6.95092C11.4561 6.52468 11.1154 6.17871 10.6956 6.17871C10.2758 6.17871 9.93506 6.52468 9.93506 6.95092C9.93506 7.37729 10.2758 7.72327 10.6956 7.72327Z" fill="#FF964A" />
                                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.17411 8.49536C8.75432 8.49536 8.41357 8.84134 8.41357 9.26771C8.41357 9.69395 8.75432 10.0399 9.17411 10.0399C9.59403 10.0399 9.93478 9.69395 9.93478 9.26771C9.93478 8.84134 9.59403 8.49536 9.17411 8.49536Z" fill="#FF964A" />
                                                </svg>{recipe?.ingredients?.length} ingredients</p>
                                            </div>
                                            {/* <div>
                                                <ButtonGroup size="sm">
                                                    <Button className='bg-none border-0 text-custom-grey fs-15 py-0'><Link to={`/edit-recipe/${recipe?._id}`} className='text-decoration-none text-custom-grey'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                                        <path d="M13.3603 2.23128L11.7687 0.639685C11.3585 0.230044 10.8025 0 10.2227 0C9.64305 0 9.08707 0.230063 8.67684 0.639685L7.51588 1.80051L0.944086 8.3723C0.939318 8.37707 0.937851 8.38367 0.933206 8.38868C0.874285 8.45029 0.826855 8.52181 0.79287 8.60004C0.784924 8.61825 0.781868 8.63671 0.775511 8.65542C0.760598 8.69221 0.74874 8.73011 0.740183 8.76886L0.0100253 13.15H0.00990281C-0.0253032 13.3617 0.0343514 13.5782 0.173096 13.7418C0.311842 13.9055 0.515612 14 0.730166 14C0.77026 13.9999 0.810357 13.9965 0.849963 13.99L5.23116 13.2598C5.26991 13.2511 5.30781 13.2393 5.34448 13.2244C5.36306 13.218 5.38176 13.215 5.39986 13.2071H5.39998C5.47809 13.1732 5.5496 13.1256 5.61121 13.0668C5.6161 13.0622 5.6227 13.0607 5.62759 13.0559L13.3604 5.32311C13.7699 4.91288 14 4.3569 14 3.77712C14 3.19745 13.7699 2.64148 13.3604 2.23124L13.3603 2.23128ZM1.6187 12.3812L1.94741 10.4081L3.59183 12.0525L1.6187 12.3812ZM12.3279 4.29044L11.6833 4.93504L9.06485 2.31671L9.70945 1.67211V1.67199C9.84588 1.53642 10.0305 1.46027 10.2229 1.46027C10.4153 1.46027 10.5999 1.53642 10.7363 1.67199L12.3279 3.26358C12.4638 3.39989 12.5402 3.58448 12.5402 3.777C12.5402 3.96952 12.4638 4.15412 12.3279 4.29041L12.3279 4.29044Z" fill="#26BAFA" />
                                                    </svg>Edit</Link></Button>
                                                    <div className='vr mx-1'></div>
                                                    <Button className='bg-none border-0 text-custom-grey fs-15 py-0' onClick={() => setShowModal(true)}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                                                        <path d="M1.98088 2.67757V2.67778V2.67757ZM6.88975 0L5.45688 0.000508323V0.000711673H5.45617C4.9636 0.000711673 4.56446 0.406291 4.56446 0.906433V0.992348L0.443616 0.99245C0.19868 0.99245 0 1.19407 0 1.44288V2.23634C0 2.48513 0.198672 2.68676 0.443616 2.68676H0.973544V2.68707L11.3729 2.68717L11.373 2.68697V2.68717H11.3791L11.903 2.68697C12.0206 2.68697 12.1334 2.63948 12.2166 2.55509C12.2998 2.4706 12.3466 2.35602 12.3466 2.23655V1.44257C12.3466 1.32311 12.2998 1.20862 12.2166 1.12414C12.1334 1.03965 12.0206 0.992166 11.903 0.992166L7.78213 0.992268V0.906251C7.78213 0.665892 7.6881 0.435392 7.52068 0.265398C7.35335 0.095501 7.12633 3.55961e-05 6.88962 3.55961e-05L6.88975 0ZM6.38725 4.45898C6.55117 4.45918 6.68395 4.5941 6.68395 4.76055L6.68415 11.2794C6.68415 11.3595 6.65281 11.4362 6.59713 11.4927C6.54136 11.5494 6.46585 11.5811 6.38704 11.5814L5.95966 11.5811V11.5814C5.88085 11.5811 5.80535 11.5494 5.74957 11.4927C5.69389 11.4362 5.66255 11.3595 5.66255 11.2794L5.66275 4.76055C5.66275 4.59441 5.79513 4.4596 5.95866 4.4596L5.95906 4.45991L5.96156 4.4593L5.96196 4.4592L6.38645 4.45899L6.38725 4.45898ZM3.72146 4.44749L3.71555 4.45349V4.45369H3.71595C3.87516 4.45369 4.00675 4.5819 4.01226 4.74469L4.23427 11.2597C4.23697 11.3397 4.20833 11.4175 4.15456 11.4759L4.15446 11.476C4.10068 11.5345 4.02628 11.5689 3.94758 11.5716L3.52039 11.5866C3.51779 11.5867 3.51278 11.5868 3.51018 11.5868C3.43508 11.5868 3.36258 11.5579 3.3075 11.5056C3.24982 11.4511 3.21598 11.3755 3.21327 11.2956L2.99177 4.78058C2.98606 4.61404 3.11444 4.47443 3.27837 4.46866L3.70514 4.45371V4.45391C3.70665 4.45371 3.70795 4.45361 3.70925 4.45361C3.71105 4.45361 3.71296 4.45371 3.71436 4.45391L3.71476 4.45351L3.72146 4.44749ZM8.63442 4.45349C8.63683 4.45359 8.63933 4.45359 8.64143 4.45369V4.45389L9.0682 4.46864C9.23213 4.47443 9.3605 4.61403 9.35481 4.78056L9.1333 11.2955C9.1306 11.3755 9.09675 11.4511 9.03917 11.5056C8.9841 11.5579 8.9115 11.5867 8.8364 11.5867C8.83379 11.5867 8.82878 11.5866 8.82618 11.5865L8.399 11.5716V11.5718C8.32029 11.5689 8.24579 11.5344 8.19211 11.4759C8.13834 11.4175 8.1096 11.3396 8.1124 11.2597L8.33431 4.74467C8.33982 4.5822 8.47099 4.45419 8.6298 4.45419L8.6302 4.4544L8.63261 4.45379L8.63351 4.45358V4.45348L8.63442 4.45349ZM1.00978 3.34807L1.43465 11.1005L1.43565 11.1146C1.4723 11.5605 1.50455 12.366 2.03977 12.8064V12.8066C2.53786 13.2162 3.38031 13.2097 3.91805 13.2221L3.92937 13.2222L5.27011 13.2228L5.26931 13.223C5.27792 13.2232 5.28653 13.2234 5.29524 13.2234L5.29544 13.2237L6.16652 13.2231L7.05042 13.2235L7.05062 13.2237C7.05903 13.2235 7.06745 13.2233 7.07576 13.2229H7.07656L7.07586 13.2231L8.4165 13.2224L8.42781 13.2222C8.96556 13.2098 9.808 13.2164 10.3061 12.8069V12.8066C10.8413 12.3663 10.8737 11.5609 10.9103 11.1149L10.9113 11.1008L11.3366 3.34839L1.00978 3.34807Z" fill="#FF6161" />
                                                    </svg>Delete</Button>
                                                    <div className='vr mx-1'></div>
                                                    <div className='position-relative'>
                                                        <Button className='bg-none border-0 text-custom-grey fs-15 py-0' onClick={() => handleDropdownTwoButton()}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="5" height="13" viewBox="0 0 5 13" fill="none">
                                                            <path fillRule="evenodd" clipRule="evenodd" d="M0.408119 11.0882C0.408119 10.0324 1.2511 9.17647 2.29097 9.17647C3.33085 9.17647 4.17383 10.0324 4.17383 11.0882C4.17383 12.1441 3.33085 13 2.29097 13C1.2511 13 0.408119 12.1441 0.408119 11.0882ZM0.408119 6.50004C0.408119 5.4442 1.2511 4.58828 2.29097 4.58828C3.33085 4.58828 4.17383 5.4442 4.17383 6.50004C4.17383 7.55588 3.33085 8.41181 2.29097 8.41181C1.2511 8.41181 0.408119 7.55588 0.408119 6.50004ZM2.29097 -1.82869e-05C1.2511 -1.83792e-05 0.408119 0.855908 0.408119 1.91175C0.408119 2.96758 1.2511 3.82351 2.29097 3.82351C3.33085 3.82351 4.17383 2.96758 4.17383 1.91175C4.17383 0.855908 3.33085 -1.81946e-05 2.29097 -1.82869e-05Z" fill="#F9B812" />
                                                        </svg>More</Button>
                                                        {
                                                            MoreStatus ?
                                                                <div className='custom-dropdown-2 active bg-white rounded shadow'>
                                                                    <Button className='fs-6 text-black fw-600 bg-none border-0 text-black d-block w-100 text-start text-nowrap'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                                        <path fillRule="evenodd" clipRule="evenodd" d="M18 5.14286V1.92857C18 1.7581 17.9323 1.59451 17.8117 1.47398C17.6912 1.35345 17.5276 1.28571 17.3571 1.28571H13.5V0.642857C13.5 0.472386 13.4323 0.308799 13.3117 0.188265C13.1912 0.0677314 13.0276 0 12.8571 0C12.6867 0 12.5231 0.0677314 12.4026 0.188265C12.282 0.308799 12.2143 0.472386 12.2143 0.642857V1.28571H9.64286V0.642857C9.64286 0.472386 9.57513 0.308799 9.45459 0.188265C9.33406 0.0677314 9.17047 0 9 0C8.82953 0 8.66594 0.0677314 8.54541 0.188265C8.42487 0.308799 8.35714 0.472386 8.35714 0.642857V1.28571H5.78571V0.642857C5.78571 0.472386 5.71798 0.308799 5.59745 0.188265C5.47691 0.0677314 5.31333 0 5.14286 0C4.97239 0 4.8088 0.0677314 4.68827 0.188265C4.56773 0.308799 4.5 0.472386 4.5 0.642857V1.28571H0.642857C0.472386 1.28571 0.308799 1.35345 0.188265 1.47398C0.0677314 1.59451 0 1.7581 0 1.92857V5.14286H18ZM4.5 1.28571H5.78571V3.21429C5.78571 3.44401 5.66317 3.65624 5.46429 3.77104C5.2654 3.88583 5.02031 3.88583 4.82143 3.77104C4.62254 3.65624 4.5 3.44402 4.5 3.21429V1.28571ZM8.35714 1.28571H9.64286V3.21429C9.64286 3.44401 9.52031 3.65624 9.32143 3.77104C9.12255 3.88583 8.87746 3.88583 8.67857 3.77104C8.47969 3.65624 8.35714 3.44402 8.35714 3.21429V1.28571ZM12.2143 1.28571H13.5V3.21429C13.5 3.44401 13.3775 3.65624 13.1786 3.77104C12.9797 3.88583 12.7346 3.88583 12.5357 3.77104C12.3368 3.65624 12.2143 3.44402 12.2143 3.21429V1.28571ZM18 7.86505V6.42857H0V17.3571C0 17.5276 0.0677314 17.6912 0.188265 17.8117C0.308799 17.9323 0.472386 18 0.642857 18H7.86505C7.31273 16.9551 7 15.7641 7 14.5C7 13.6693 7.13506 12.8701 7.38442 12.1232C7.29193 12.0679 7.21325 11.9894 7.15753 11.8929C7.04274 11.694 7.04274 11.4489 7.15753 11.25C7.27233 11.0511 7.48455 10.9286 7.71429 10.9286H7.9033C8.15269 10.4689 8.44874 10.0382 8.78507 9.64286H7.71429C7.48456 9.64286 7.27233 9.52031 7.15753 9.32143C7.04274 9.12255 7.04274 8.87746 7.15753 8.67857C7.27233 8.47969 7.48455 8.35714 7.71429 8.35714H10.1959C11.4142 7.50196 12.8985 7 14.5 7C15.7641 7 16.9551 7.31273 18 7.86505ZM6.24031 13.6883C6.36084 13.8088 6.42857 13.9724 6.42857 14.1429C6.42857 14.3133 6.36084 14.4769 6.24031 14.5974C6.11977 14.718 5.95619 14.7857 5.78571 14.7857H3.21429C2.98456 14.7857 2.77233 14.6632 2.65753 14.4643C2.54274 14.2654 2.54274 14.0203 2.65753 13.8214C2.77233 13.6225 2.98455 13.5 3.21429 13.5H5.78571C5.95619 13.5 6.11977 13.5677 6.24031 13.6883ZM6.24031 11.1168C6.36084 11.2374 6.42857 11.401 6.42857 11.5714C6.42857 11.7419 6.36084 11.9055 6.24031 12.026C6.11977 12.1466 5.95619 12.2143 5.78571 12.2143H3.21429C2.98456 12.2143 2.77233 12.0917 2.65753 11.8929C2.54274 11.694 2.54274 11.4489 2.65753 11.25C2.77233 11.0511 2.98455 10.9286 3.21429 10.9286H5.78571C5.95619 10.9286 6.11977 10.9963 6.24031 11.1168ZM6.24031 8.54541C6.36084 8.66594 6.42857 8.82953 6.42857 9C6.42857 9.17047 6.36084 9.33406 6.24031 9.45459C6.11977 9.57513 5.95619 9.64286 5.78571 9.64286H3.21429C2.98456 9.64286 2.77233 9.52031 2.65753 9.32143C2.54274 9.12255 2.54274 8.87746 2.65753 8.67857C2.77233 8.47969 2.98455 8.35714 3.21429 8.35714H5.78571C5.95619 8.35714 6.11977 8.42487 6.24031 8.54541Z" fill="#88C533" />
                                                                        <path d="M14.5 8.5C12.9086 8.5 11.3825 9.13214 10.2575 10.2575C9.13214 11.3825 8.5 12.9086 8.5 14.5C8.5 16.0914 9.13214 17.6175 10.2575 18.7425C11.3825 19.8679 12.9086 20.5 14.5 20.5C16.0914 20.5 17.6175 19.8679 18.7425 18.7425C19.8679 17.6175 20.5 16.0914 20.5 14.5C20.4983 12.9092 19.8655 11.3841 18.7405 10.2595C17.6159 9.13446 16.0908 8.50163 14.5 8.5ZM17.5 15.25H15.25V17.5C15.25 17.9142 14.9142 18.25 14.5 18.25C14.0858 18.25 13.75 17.9142 13.75 17.5V15.25H11.5C11.0858 15.25 10.75 14.9142 10.75 14.5C10.75 14.0858 11.0858 13.75 11.5 13.75H13.75V11.5C13.75 11.0858 14.0858 10.75 14.5 10.75C14.9142 10.75 15.25 11.0858 15.25 11.5V13.75H17.5C17.9142 13.75 18.25 14.0858 18.25 14.5C18.25 14.9142 17.9142 15.25 17.5 15.25Z" fill="#88C533" />
                                                                    </svg>Add plan</Button>
                                                                    <hr className='my-2' />
                                                                    <Button className='fs-6 text-black fw-600 bg-none border-0 text-black d-block w-100  text-start text-nowrap'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                                                                        <path d="M1.5075 2.83081C1.11669 2.83081 0.799805 3.14769 0.799805 3.53851V17.6925C0.799805 18.0833 1.11669 18.4002 1.5075 18.4002H15.6615C15.8492 18.4002 16.0292 18.3256 16.1619 18.1929C16.2946 18.0603 16.3692 17.8802 16.3692 17.6925C16.3692 17.5048 16.2946 17.3247 16.1619 17.1921C16.0292 17.0594 15.8492 16.9848 15.6615 16.9848H2.2152V3.53851C2.2152 3.14769 1.89832 2.83081 1.5075 2.83081Z" fill="#97CC4D" />
                                                                        <path d="M4.33856 0C4.15089 0 3.97081 0.0745632 3.83811 0.207255C3.70542 0.339946 3.63086 0.520034 3.63086 0.707699V14.8617C3.63086 15.0494 3.70542 15.2293 3.83811 15.3621C3.97081 15.4948 4.15089 15.5694 4.33856 15.5694H18.4925C18.6802 15.5694 18.8603 15.4948 18.993 15.3621C19.1257 15.2293 19.2002 15.0494 19.2002 14.8617V0.707699C19.2002 0.520034 19.1257 0.339946 18.993 0.207255C18.8603 0.0745632 18.6802 0 18.4925 0H4.33856ZM11.4156 4.2462C11.7727 4.2462 12.1304 4.48647 12.1233 4.96494V7.07699H14.2367C15.1937 7.06341 15.1937 8.50598 14.2367 8.49239H12.1233V10.6059C12.1304 10.9962 11.8171 11.3169 11.4225 11.3232C11.0279 11.3295 10.7007 11.0047 10.7079 10.6059V8.49239H8.59438C8.2042 8.49808 7.88417 8.18625 7.87706 7.79165C7.86995 7.39689 8.19552 7.07133 8.59438 7.07699H10.7079V4.96494C10.7007 4.48645 11.0582 4.2462 11.4156 4.2462Z" fill="#97CC4D" />
                                                                    </svg>Add to Collection</Button>
                                                                </div> :
                                                                <div className='custom-dropdown-2 bg-white rounded shadow'>
                                                                    <Button className='fs-6 text-black fw-600 bg-none border-0 text-black d-block w-100 text-start text-nowrap'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                                                        <path fillRule="evenodd" clipRule="evenodd" d="M18 5.14286V1.92857C18 1.7581 17.9323 1.59451 17.8117 1.47398C17.6912 1.35345 17.5276 1.28571 17.3571 1.28571H13.5V0.642857C13.5 0.472386 13.4323 0.308799 13.3117 0.188265C13.1912 0.0677314 13.0276 0 12.8571 0C12.6867 0 12.5231 0.0677314 12.4026 0.188265C12.282 0.308799 12.2143 0.472386 12.2143 0.642857V1.28571H9.64286V0.642857C9.64286 0.472386 9.57513 0.308799 9.45459 0.188265C9.33406 0.0677314 9.17047 0 9 0C8.82953 0 8.66594 0.0677314 8.54541 0.188265C8.42487 0.308799 8.35714 0.472386 8.35714 0.642857V1.28571H5.78571V0.642857C5.78571 0.472386 5.71798 0.308799 5.59745 0.188265C5.47691 0.0677314 5.31333 0 5.14286 0C4.97239 0 4.8088 0.0677314 4.68827 0.188265C4.56773 0.308799 4.5 0.472386 4.5 0.642857V1.28571H0.642857C0.472386 1.28571 0.308799 1.35345 0.188265 1.47398C0.0677314 1.59451 0 1.7581 0 1.92857V5.14286H18ZM4.5 1.28571H5.78571V3.21429C5.78571 3.44401 5.66317 3.65624 5.46429 3.77104C5.2654 3.88583 5.02031 3.88583 4.82143 3.77104C4.62254 3.65624 4.5 3.44402 4.5 3.21429V1.28571ZM8.35714 1.28571H9.64286V3.21429C9.64286 3.44401 9.52031 3.65624 9.32143 3.77104C9.12255 3.88583 8.87746 3.88583 8.67857 3.77104C8.47969 3.65624 8.35714 3.44402 8.35714 3.21429V1.28571ZM12.2143 1.28571H13.5V3.21429C13.5 3.44401 13.3775 3.65624 13.1786 3.77104C12.9797 3.88583 12.7346 3.88583 12.5357 3.77104C12.3368 3.65624 12.2143 3.44402 12.2143 3.21429V1.28571ZM18 7.86505V6.42857H0V17.3571C0 17.5276 0.0677314 17.6912 0.188265 17.8117C0.308799 17.9323 0.472386 18 0.642857 18H7.86505C7.31273 16.9551 7 15.7641 7 14.5C7 13.6693 7.13506 12.8701 7.38442 12.1232C7.29193 12.0679 7.21325 11.9894 7.15753 11.8929C7.04274 11.694 7.04274 11.4489 7.15753 11.25C7.27233 11.0511 7.48455 10.9286 7.71429 10.9286H7.9033C8.15269 10.4689 8.44874 10.0382 8.78507 9.64286H7.71429C7.48456 9.64286 7.27233 9.52031 7.15753 9.32143C7.04274 9.12255 7.04274 8.87746 7.15753 8.67857C7.27233 8.47969 7.48455 8.35714 7.71429 8.35714H10.1959C11.4142 7.50196 12.8985 7 14.5 7C15.7641 7 16.9551 7.31273 18 7.86505ZM6.24031 13.6883C6.36084 13.8088 6.42857 13.9724 6.42857 14.1429C6.42857 14.3133 6.36084 14.4769 6.24031 14.5974C6.11977 14.718 5.95619 14.7857 5.78571 14.7857H3.21429C2.98456 14.7857 2.77233 14.6632 2.65753 14.4643C2.54274 14.2654 2.54274 14.0203 2.65753 13.8214C2.77233 13.6225 2.98455 13.5 3.21429 13.5H5.78571C5.95619 13.5 6.11977 13.5677 6.24031 13.6883ZM6.24031 11.1168C6.36084 11.2374 6.42857 11.401 6.42857 11.5714C6.42857 11.7419 6.36084 11.9055 6.24031 12.026C6.11977 12.1466 5.95619 12.2143 5.78571 12.2143H3.21429C2.98456 12.2143 2.77233 12.0917 2.65753 11.8929C2.54274 11.694 2.54274 11.4489 2.65753 11.25C2.77233 11.0511 2.98455 10.9286 3.21429 10.9286H5.78571C5.95619 10.9286 6.11977 10.9963 6.24031 11.1168ZM6.24031 8.54541C6.36084 8.66594 6.42857 8.82953 6.42857 9C6.42857 9.17047 6.36084 9.33406 6.24031 9.45459C6.11977 9.57513 5.95619 9.64286 5.78571 9.64286H3.21429C2.98456 9.64286 2.77233 9.52031 2.65753 9.32143C2.54274 9.12255 2.54274 8.87746 2.65753 8.67857C2.77233 8.47969 2.98455 8.35714 3.21429 8.35714H5.78571C5.95619 8.35714 6.11977 8.42487 6.24031 8.54541Z" fill="#88C533" />
                                                                        <path d="M14.5 8.5C12.9086 8.5 11.3825 9.13214 10.2575 10.2575C9.13214 11.3825 8.5 12.9086 8.5 14.5C8.5 16.0914 9.13214 17.6175 10.2575 18.7425C11.3825 19.8679 12.9086 20.5 14.5 20.5C16.0914 20.5 17.6175 19.8679 18.7425 18.7425C19.8679 17.6175 20.5 16.0914 20.5 14.5C20.4983 12.9092 19.8655 11.3841 18.7405 10.2595C17.6159 9.13446 16.0908 8.50163 14.5 8.5ZM17.5 15.25H15.25V17.5C15.25 17.9142 14.9142 18.25 14.5 18.25C14.0858 18.25 13.75 17.9142 13.75 17.5V15.25H11.5C11.0858 15.25 10.75 14.9142 10.75 14.5C10.75 14.0858 11.0858 13.75 11.5 13.75H13.75V11.5C13.75 11.0858 14.0858 10.75 14.5 10.75C14.9142 10.75 15.25 11.0858 15.25 11.5V13.75H17.5C17.9142 13.75 18.25 14.0858 18.25 14.5C18.25 14.9142 17.9142 15.25 17.5 15.25Z" fill="#88C533" />
                                                                    </svg>Add plan</Button>
                                                                    <hr className='my-2' />
                                                                    <Button className='fs-6 text-black fw-600 bg-none border-0 text-black d-block w-100  text-start text-nowrap'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                                                                        <path d="M1.5075 2.83081C1.11669 2.83081 0.799805 3.14769 0.799805 3.53851V17.6925C0.799805 18.0833 1.11669 18.4002 1.5075 18.4002H15.6615C15.8492 18.4002 16.0292 18.3256 16.1619 18.1929C16.2946 18.0603 16.3692 17.8802 16.3692 17.6925C16.3692 17.5048 16.2946 17.3247 16.1619 17.1921C16.0292 17.0594 15.8492 16.9848 15.6615 16.9848H2.2152V3.53851C2.2152 3.14769 1.89832 2.83081 1.5075 2.83081Z" fill="#97CC4D" />
                                                                        <path d="M4.33856 0C4.15089 0 3.97081 0.0745632 3.83811 0.207255C3.70542 0.339946 3.63086 0.520034 3.63086 0.707699V14.8617C3.63086 15.0494 3.70542 15.2293 3.83811 15.3621C3.97081 15.4948 4.15089 15.5694 4.33856 15.5694H18.4925C18.6802 15.5694 18.8603 15.4948 18.993 15.3621C19.1257 15.2293 19.2002 15.0494 19.2002 14.8617V0.707699C19.2002 0.520034 19.1257 0.339946 18.993 0.207255C18.8603 0.0745632 18.6802 0 18.4925 0H4.33856ZM11.4156 4.2462C11.7727 4.2462 12.1304 4.48647 12.1233 4.96494V7.07699H14.2367C15.1937 7.06341 15.1937 8.50598 14.2367 8.49239H12.1233V10.6059C12.1304 10.9962 11.8171 11.3169 11.4225 11.3232C11.0279 11.3295 10.7007 11.0047 10.7079 10.6059V8.49239H8.59438C8.2042 8.49808 7.88417 8.18625 7.87706 7.79165C7.86995 7.39689 8.19552 7.07133 8.59438 7.07699H10.7079V4.96494C10.7007 4.48645 11.0582 4.2462 11.4156 4.2462Z" fill="#97CC4D" />
                                                                    </svg>Add to Collection</Button>
                                                                </div>
                                                        }
                                                    </div>
                                                </ButtonGroup>
                                            </div> */}
                                        </div>
                                        <hr />
                                        <div className='profile-tab'>
                                            <Tabs
                                                defaultActiveKey="Directions"
                                                id="justify-tab-example"
                                                className="mb-3"
                                            >
                                                <Tab eventkey="Directions" title="Directions">
                                                    <div>
                                                        {recipe?.instructionLines && recipe?.instructionLines?.length > 0
                                                            ?
                                                            recipe?.instructionLines.map((direction, i) => (
                                                                <>
                                                                    <div className='d-sm-flex justify-content-start align-items-center px-3'>
                                                                        <div className='ms-3 d-flex align-items-center'>
                                                                            <span className='d-inline me-2 bg-light text-black py-1 fw-normal px-2 rounded'>{i + 1}</span><p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>{direction}</p>
                                                                        </div>
                                                                    </div>
                                                                    <hr />
                                                                </>
                                                            ))
                                                            :
                                                            <></>
                                                        }


                                                    </div>
                                                </Tab>
                                                <Tab eventkey="Notes" title="Notes">
                                                    <div className='px-4'>
                                                        {recipe?.notes && recipe?.notes.length > 0
                                                            ?
                                                            recipe?.notes.map((note, i) => (
                                                                <>
                                                                    <h4 className='text-dark mb-1 fw-600 fs-17 mt-3'>{note?.title}</h4>
                                                                    <p className='d-inline me-3 text-custom-grey fw-600 fs-15 mb-0'>{note?.note}</p>
                                                                </>
                                                            ))
                                                            :
                                                            <></>
                                                        }

                                                    </div>
                                                </Tab>
                                            </Tabs>
                                        </div>
                                    </div>
                                </Col>

                                <Col xxl={5} lg={12} md={12}>
                                    <div className='buttons-group d-flex filter-days'>
                                        <button onClick={handleTryButton}>I Want to Try This!</button>
                                        <button onClick={handleFavButton}>Favorite This Recipe</button>
                                    </div>
                                    <div className='bg-white shadow rounded py-3 my-3'>
                                        <div className='profile-tab'>
                                            <Tabs
                                                defaultActiveKey="Ingredients"
                                                id="justify-tab-example"
                                                className="mb-3"
                                            >
                                                <Tab eventkey="Ingredients" title="Ingredients">
                                                    <div className='px-4 py-2'>
                                                        <h4 className='text-dark mb-1 fw-600 fs-4 mt-3'>Ingredients</h4>
                                                        <span className='green-line '></span>
                                                        <div className='border py-3 px-4 rounded mt-2'>
                                                            <Form.Label className='text-custom-grey fw-normal'>{recipe?.servingSize} servings</Form.Label>
                                                            <Form.Range />
                                                        </div>
                                                        <div className='my-4'>
                                                            {recipe?.ingredients && recipe?.ingredients?.length > 0
                                                                ?
                                                                recipe?.ingredients?.map((ingredient, i) => (
                                                                    <div className='ingridient'>
                                                                        <div className='d-flex align-items-center gap-3'>
                                                                            <span className='green-bullet'><svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36" fill="none">
                                                                                <g filter="url(#filter0_d_57_1072)">
                                                                                    <circle cx="18" cy="15" r="7" fill="url(#paint0_linear_57_1072)" />
                                                                                </g>
                                                                                <defs>
                                                                                    <filter id="filter0_d_57_1072" x="0" y="0" width="36" height="36" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                                                        <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                                                        <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                                        <feOffset dy="3" />
                                                                                        <feGaussianBlur stdDeviation="5.5" />
                                                                                        <feComposite in2="hardAlpha" operator="out" />
                                                                                        <feColorMatrix type="matrix" values="0 0 0 0 0.563686 0 0 0 0 0.783333 0 0 0 0 0.267639 0 0 0 0.3 0" />
                                                                                        <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_57_1072" />
                                                                                        <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_57_1072" result="shape" />
                                                                                    </filter>
                                                                                    <linearGradient id="paint0_linear_57_1072" x1="13.2767" y1="8" x2="25.8233" y2="8.84786" gradientUnits="userSpaceOnUse">
                                                                                        <stop stopColor="#8DC63F" />
                                                                                        <stop offset="1" stopColor="#7FC520" />
                                                                                    </linearGradient>
                                                                                </defs>
                                                                            </svg></span>
                                                                            {/* <p className='text-custom-grey fw-600 fs-15 mb-0'>{ingredient?.quantity + " " + ingredient?.text}</p> */}
                                                                            <h4 className='text-dark mb-1 fw-600 fs-17 mt-3'>{ingredient?.text}</h4>
                                                                        </div>
                                                                        {/* <h4 className='text-dark mb-1 fw-600 fs-17 mt-3'>{ingredient?.text}</h4> */}
                                                                    </div>
                                                                ))
                                                                :
                                                                <></>
                                                            }


                                                        </div>

                                                    </div>
                                                </Tab>
                                                <Tab eventkey="Nutrition" title="Nutrition">
                                                    <div className='px-4 py-2'>
                                                        <h4 className='text-dark mb-1 fw-600 fs-4 mt-3'>Nutritions</h4>
                                                        <span className='green-line'></span>
                                                        <div className='nutri-progressbar my-3'>
                                                            {recipe && recipe?.totalNutrients && Object.keys(recipe?.totalNutrients).length > 0 && (
                                                                Object.entries(recipe?.totalNutrients).map(([nutrientKey, nutrient], i) => (
                                                                    <div className='mb-3' key={i}>
                                                                        <div className='d-sm-flex align-items-center justify-content-between'>
                                                                            <h5 className='text-dark mb-1 fw-600 fs-17'>{nutrient?.label}</h5>
                                                                            <div>
                                                                                <h5 className='text-custom-grey mb-1 fw-600 fs-17 d-inline'>
                                                                                    {nutrient?.quantity.toFixed(2)} {nutrient.unit}
                                                                                </h5>
                                                                                <span>
                                                                                    <svg className='mx-2' xmlns="http://www.w3.org/2000/svg" width="7" height="7" viewBox="0 0 7 7" fill="none">
                                                                                        <circle cx="3.5" cy="3.5" r="3.5" fill="#9FDC1C" />
                                                                                    </svg>
                                                                                </span>
                                                                                <h5 className='text-dark mb-1 fw-600 fs-17 d-inline'>
                                                                                    {nutrient.dailyQuantity ? nutrient.dailyQuantity.toFixed(2) : 0}
                                                                                    {nutrient.dailyUnit ? nutrient.dailyUnit : "%"}
                                                                                </h5>
                                                                            </div>
                                                                        </div>
                                                                        <ProgressBar variant="success" now={nutrient.dailyQuantity ? nutrient.dailyQuantity.toFixed(2) : 0} />
                                                                    </div>
                                                                ))
                                                            )}
                                                            <div>
                                                                <span className='mt-3 bg-light px-5 py-4 text-center rounded w-100 d-inline-block text-dark fw-600 fs-6'>% Daily Value ≈ 2,000 Calorie Diet</span>
                                                            </div>
                                                        </div>


                                                    </div>
                                                </Tab>
                                                <Tab eventkey="Tags" title="Tags">
                                                    <div className='px-4 py-2'>
                                                        <h4 className='text-dark mb-1 fw-600 fs-4 mt-3'>Tags</h4>
                                                        <span className='green-line'></span>
                                                        <div className='tag-list'>
                                                            {recipe?.tags && recipe?.tags.length > 0
                                                                ?
                                                                recipe?.tags.map((tag, i) => (
                                                                    <>
                                                                        <span className='text-green text-center d-inline rounded py-2 px-3 bg-lightgreen fw-600'>{tag}</span>
                                                                    </>
                                                                ))
                                                                :
                                                                <></>
                                                            }
                                                        </div>
                                                    </div>
                                                </Tab>
                                                <Tab eventkey="Comments" title="Comments">
                                                    <div className='px-4 py-2'>
                                                        <h4 className='text-dark mb-1 fw-600 fs-4 mt-3'>Comments</h4>
                                                        <span className='green-line'></span>
                                                        <div className=''>
                                                            <h4 className='text-dark mb-1 fw-600 fs-17 mt-3'>3 comments</h4>
                                                            <div className='border bg-white comment-box p-3'>
                                                                <div className='d-flex gap-2 align-items-center'>
                                                                    <div className='comment-box-img'>
                                                                        <img src={UserImg} className='w-100 h-100 object-fit-cover' />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className='text-dark mb-1 fw-600 fs-17'>Symond Write </h4>
                                                                        <p className='text-custom-grey fw-600 fs-15 mb-0'>@symondwrite</p>
                                                                    </div>
                                                                </div>
                                                                <p className='my-2 text-dark fw-600'>This looks soooo good! Wonderful recipe (and photo.) Can't wait to share it with my clients.</p>
                                                                <p>Jun 18, 2022 at 12:00PM</p>
                                                                <hr />
                                                                <Button className='border-0 fw-600 p-0 bg-none text-dark d-inline me-3 text-dark'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="16" height="13" viewBox="0 0 16 13" fill="none">
                                                                    <path d="M5.87741 3.9601V1.10456C5.87741 0.819025 5.60865 0.726614 5.39027 0.945002L0.157589 6.17746C0.0565166 6.28237 0 6.42237 0 6.568C0 6.71371 0.0565189 6.85371 0.157589 6.95862L5.39027 12.1913C5.60027 12.4013 5.84385 12.3257 5.84385 12.0318V8.67221C12.7309 8.18508 15.9981 11.5698 15.9981 11.5698C15.2589 2.78444 5.87722 3.96021 5.87722 3.96021L5.87741 3.9601Z" fill="#8DC63F" />
                                                                </svg>Replay</Button>
                                                                <Button className='border-0 fw-600 p-0 bg-none text-custom-grey d-inline me-3'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                                                                    <path d="M1.98088 2.67757V2.67778V2.67757ZM6.88975 0L5.45688 0.000508323V0.000711673H5.45617C4.9636 0.000711673 4.56446 0.406291 4.56446 0.906433V0.992348L0.443616 0.99245C0.19868 0.99245 0 1.19407 0 1.44288V2.23634C0 2.48513 0.198672 2.68676 0.443616 2.68676H0.973544V2.68707L11.3729 2.68717L11.373 2.68697V2.68717H11.3791L11.903 2.68697C12.0206 2.68697 12.1334 2.63948 12.2166 2.55509C12.2998 2.4706 12.3466 2.35602 12.3466 2.23655V1.44257C12.3466 1.32311 12.2998 1.20862 12.2166 1.12414C12.1334 1.03965 12.0206 0.992166 11.903 0.992166L7.78213 0.992268V0.906251C7.78213 0.665892 7.6881 0.435392 7.52068 0.265398C7.35335 0.095501 7.12633 3.55961e-05 6.88962 3.55961e-05L6.88975 0ZM6.38725 4.45898C6.55117 4.45918 6.68395 4.5941 6.68395 4.76055L6.68415 11.2794C6.68415 11.3595 6.65281 11.4362 6.59713 11.4927C6.54136 11.5494 6.46585 11.5811 6.38704 11.5814L5.95966 11.5811V11.5814C5.88085 11.5811 5.80535 11.5494 5.74957 11.4927C5.69389 11.4362 5.66255 11.3595 5.66255 11.2794L5.66275 4.76055C5.66275 4.59441 5.79513 4.4596 5.95866 4.4596L5.95906 4.45991L5.96156 4.4593L5.96196 4.4592L6.38645 4.45899L6.38725 4.45898ZM3.72146 4.44749L3.71555 4.45349V4.45369H3.71595C3.87516 4.45369 4.00675 4.5819 4.01226 4.74469L4.23427 11.2597C4.23697 11.3397 4.20833 11.4175 4.15456 11.4759L4.15446 11.476C4.10068 11.5345 4.02628 11.5689 3.94758 11.5716L3.52039 11.5866C3.51779 11.5867 3.51278 11.5868 3.51018 11.5868C3.43508 11.5868 3.36258 11.5579 3.3075 11.5056C3.24982 11.4511 3.21598 11.3755 3.21327 11.2956L2.99177 4.78058C2.98606 4.61404 3.11444 4.47443 3.27837 4.46866L3.70514 4.45371V4.45391C3.70665 4.45371 3.70795 4.45361 3.70925 4.45361C3.71105 4.45361 3.71296 4.45371 3.71436 4.45391L3.71476 4.45351L3.72146 4.44749ZM8.63442 4.45349C8.63683 4.45359 8.63933 4.45359 8.64143 4.45369V4.45389L9.0682 4.46864C9.23213 4.47443 9.3605 4.61403 9.35481 4.78056L9.1333 11.2955C9.1306 11.3755 9.09675 11.4511 9.03917 11.5056C8.9841 11.5579 8.9115 11.5867 8.8364 11.5867C8.83379 11.5867 8.82878 11.5866 8.82618 11.5865L8.399 11.5716V11.5718C8.32029 11.5689 8.24579 11.5344 8.19211 11.4759C8.13834 11.4175 8.1096 11.3396 8.1124 11.2597L8.33431 4.74467C8.33982 4.5822 8.47099 4.45419 8.6298 4.45419L8.6302 4.4544L8.63261 4.45379L8.63351 4.45358V4.45348L8.63442 4.45349ZM1.00978 3.34807L1.43465 11.1005L1.43565 11.1146C1.4723 11.5605 1.50455 12.366 2.03977 12.8064V12.8066C2.53786 13.2162 3.38031 13.2097 3.91805 13.2221L3.92937 13.2222L5.27011 13.2228L5.26931 13.223C5.27792 13.2232 5.28653 13.2234 5.29524 13.2234L5.29544 13.2237L6.16652 13.2231L7.05042 13.2235L7.05062 13.2237C7.05903 13.2235 7.06745 13.2233 7.07576 13.2229H7.07656L7.07586 13.2231L8.4165 13.2224L8.42781 13.2222C8.96556 13.2098 9.808 13.2164 10.3061 12.8069V12.8066C10.8413 12.3663 10.8737 11.5609 10.9103 11.1149L10.9113 11.1008L11.3366 3.34839L1.00978 3.34807Z" fill="#FF6161" />
                                                                </svg>Delete</Button>
                                                            </div>
                                                            <div className='border bg-white comment-box p-3 mb-3'>
                                                                <div className='d-flex gap-2 align-items-center'>
                                                                    <div className='comment-box-img'>
                                                                        <img src={UserImg} className='w-100 h-100 object-fit-cover' />
                                                                    </div>
                                                                    <div>
                                                                        <h4 className='text-dark mb-1 fw-600 fs-17'>Symond Write </h4>
                                                                        <p className='text-custom-grey fw-600 fs-15 mb-0'>@symondwrite</p>
                                                                    </div>
                                                                </div>
                                                                <p className='my-2 text-dark fw-600'>This looks soooo good! Wonderful recipe (and photo.) Can't wait to share it with my clients.</p>
                                                                <p>Jun 18, 2022 at 12:00PM</p>
                                                                <hr />
                                                                <Button className='border-0 fw-600 p-0 bg-none text-dark d-inline me-3 text-dark'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="16" height="13" viewBox="0 0 16 13" fill="none">
                                                                    <path d="M5.87741 3.9601V1.10456C5.87741 0.819025 5.60865 0.726614 5.39027 0.945002L0.157589 6.17746C0.0565166 6.28237 0 6.42237 0 6.568C0 6.71371 0.0565189 6.85371 0.157589 6.95862L5.39027 12.1913C5.60027 12.4013 5.84385 12.3257 5.84385 12.0318V8.67221C12.7309 8.18508 15.9981 11.5698 15.9981 11.5698C15.2589 2.78444 5.87722 3.96021 5.87722 3.96021L5.87741 3.9601Z" fill="#8DC63F" />
                                                                </svg>Replay</Button>
                                                                <Button className='border-0 fw-600 p-0 bg-none text-custom-grey d-inline me-3'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                                                                    <path d="M1.98088 2.67757V2.67778V2.67757ZM6.88975 0L5.45688 0.000508323V0.000711673H5.45617C4.9636 0.000711673 4.56446 0.406291 4.56446 0.906433V0.992348L0.443616 0.99245C0.19868 0.99245 0 1.19407 0 1.44288V2.23634C0 2.48513 0.198672 2.68676 0.443616 2.68676H0.973544V2.68707L11.3729 2.68717L11.373 2.68697V2.68717H11.3791L11.903 2.68697C12.0206 2.68697 12.1334 2.63948 12.2166 2.55509C12.2998 2.4706 12.3466 2.35602 12.3466 2.23655V1.44257C12.3466 1.32311 12.2998 1.20862 12.2166 1.12414C12.1334 1.03965 12.0206 0.992166 11.903 0.992166L7.78213 0.992268V0.906251C7.78213 0.665892 7.6881 0.435392 7.52068 0.265398C7.35335 0.095501 7.12633 3.55961e-05 6.88962 3.55961e-05L6.88975 0ZM6.38725 4.45898C6.55117 4.45918 6.68395 4.5941 6.68395 4.76055L6.68415 11.2794C6.68415 11.3595 6.65281 11.4362 6.59713 11.4927C6.54136 11.5494 6.46585 11.5811 6.38704 11.5814L5.95966 11.5811V11.5814C5.88085 11.5811 5.80535 11.5494 5.74957 11.4927C5.69389 11.4362 5.66255 11.3595 5.66255 11.2794L5.66275 4.76055C5.66275 4.59441 5.79513 4.4596 5.95866 4.4596L5.95906 4.45991L5.96156 4.4593L5.96196 4.4592L6.38645 4.45899L6.38725 4.45898ZM3.72146 4.44749L3.71555 4.45349V4.45369H3.71595C3.87516 4.45369 4.00675 4.5819 4.01226 4.74469L4.23427 11.2597C4.23697 11.3397 4.20833 11.4175 4.15456 11.4759L4.15446 11.476C4.10068 11.5345 4.02628 11.5689 3.94758 11.5716L3.52039 11.5866C3.51779 11.5867 3.51278 11.5868 3.51018 11.5868C3.43508 11.5868 3.36258 11.5579 3.3075 11.5056C3.24982 11.4511 3.21598 11.3755 3.21327 11.2956L2.99177 4.78058C2.98606 4.61404 3.11444 4.47443 3.27837 4.46866L3.70514 4.45371V4.45391C3.70665 4.45371 3.70795 4.45361 3.70925 4.45361C3.71105 4.45361 3.71296 4.45371 3.71436 4.45391L3.71476 4.45351L3.72146 4.44749ZM8.63442 4.45349C8.63683 4.45359 8.63933 4.45359 8.64143 4.45369V4.45389L9.0682 4.46864C9.23213 4.47443 9.3605 4.61403 9.35481 4.78056L9.1333 11.2955C9.1306 11.3755 9.09675 11.4511 9.03917 11.5056C8.9841 11.5579 8.9115 11.5867 8.8364 11.5867C8.83379 11.5867 8.82878 11.5866 8.82618 11.5865L8.399 11.5716V11.5718C8.32029 11.5689 8.24579 11.5344 8.19211 11.4759C8.13834 11.4175 8.1096 11.3396 8.1124 11.2597L8.33431 4.74467C8.33982 4.5822 8.47099 4.45419 8.6298 4.45419L8.6302 4.4544L8.63261 4.45379L8.63351 4.45358V4.45348L8.63442 4.45349ZM1.00978 3.34807L1.43465 11.1005L1.43565 11.1146C1.4723 11.5605 1.50455 12.366 2.03977 12.8064V12.8066C2.53786 13.2162 3.38031 13.2097 3.91805 13.2221L3.92937 13.2222L5.27011 13.2228L5.26931 13.223C5.27792 13.2232 5.28653 13.2234 5.29524 13.2234L5.29544 13.2237L6.16652 13.2231L7.05042 13.2235L7.05062 13.2237C7.05903 13.2235 7.06745 13.2233 7.07576 13.2229H7.07656L7.07586 13.2231L8.4165 13.2224L8.42781 13.2222C8.96556 13.2098 9.808 13.2164 10.3061 12.8069V12.8066C10.8413 12.3663 10.8737 11.5609 10.9103 11.1149L10.9113 11.1008L11.3366 3.34839L1.00978 3.34807Z" fill="#FF6161" />
                                                                </svg>Delete</Button>
                                                            </div>
                                                            <hr />
                                                            <div className='d-flex '>
                                                                <Form.Control
                                                                    className='border-0 bg-none shadow-none outline-none py-2'
                                                                    placeholder="Write a comment"
                                                                    type='text'
                                                                    aria-describedby="basic-addon1"
                                                                />
                                                                <Button className='p-0 border-0 bg-none'><svg xmlns="http://www.w3.org/2000/svg" width="38" height="37" viewBox="0 0 38 37" fill="none">
                                                                    <rect x="2" width="31" height="31" rx="15.5" fill="#F8F8F8" />
                                                                    <g filter="url(#filter0_d_57_3660)">
                                                                        <path fillRule="evenodd" clipRule="evenodd" d="M18.369 19.1708C21.0167 17.8543 21.0166 14.0772 18.3689 12.7609L15.1362 11.1537C14.2439 10.71 13.1963 11.3591 13.1963 12.3556C13.1963 12.8652 13.4848 13.3308 13.9411 13.5577L14.5126 13.8417C16.2675 14.714 16.2676 17.2174 14.5128 18.0899L13.941 18.3742C13.4848 18.6011 13.1963 19.0667 13.1963 19.5762C13.1963 20.5727 14.2439 21.2218 15.1363 20.7781L18.369 19.1708Z" fill="url(#paint0_linear_57_3660)" />
                                                                        <path d="M12.6378 14.3115C12.2112 14.0995 11.9414 13.6642 11.9414 13.1877V10.1895C11.9414 9.25756 12.921 8.65063 13.7554 9.06547L25.3743 14.842C26.3027 15.3036 26.3027 16.6283 25.3743 17.0899L13.7554 22.8673C12.921 23.2821 11.9414 22.6752 11.9414 21.7434V18.7452C11.9414 18.2687 12.2111 17.8334 12.6378 17.6212C14.0048 16.9415 14.0048 14.9913 12.6378 14.3115ZM14.5777 12.2777C14.5198 12.2489 14.4518 12.2911 14.4518 12.3558C14.4518 12.3889 14.4705 12.4191 14.5001 12.4339L19.3443 14.8417C20.2729 15.3033 20.273 16.628 19.3444 17.0896L14.5003 19.4984C14.4707 19.5131 14.4519 19.5433 14.4519 19.5764C14.4519 19.6411 14.5199 19.6832 14.5778 19.6544L17.8107 18.0469C19.5297 17.1921 19.5297 14.7396 17.8105 13.8849L14.5777 12.2777Z" fill="url(#paint1_linear_57_3660)" />
                                                                    </g>
                                                                    <defs>
                                                                        <filter id="filter0_d_57_3660" x="0.941406" y="0.932617" width="36.1292" height="36.0674" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                                                                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                                                                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                                                                            <feOffset dy="3" />
                                                                            <feGaussianBlur stdDeviation="5.5" />
                                                                            <feComposite in2="hardAlpha" operator="out" />
                                                                            <feColorMatrix type="matrix" values="0 0 0 0 0.563686 0 0 0 0 0.783333 0 0 0 0 0.267639 0 0 0 0.3 0" />
                                                                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_57_3660" />
                                                                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_57_3660" result="shape" />
                                                                        </filter>
                                                                        <linearGradient id="paint0_linear_57_3660" x1="15.0858" y1="10.1892" x2="25.4979" y2="10.8968" gradientUnits="userSpaceOnUse">
                                                                            <stop stopColor="#8DC63F" />
                                                                            <stop offset="1" stopColor="#7FC520" />
                                                                        </linearGradient>
                                                                        <linearGradient id="paint1_linear_57_3660" x1="14.2391" y1="8.93262" x2="26.901" y2="9.79202" gradientUnits="userSpaceOnUse">
                                                                            <stop stopColor="#8DC63F" />
                                                                            <stop offset="1" stopColor="#7FC520" />
                                                                        </linearGradient>
                                                                    </defs>
                                                                </svg></Button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Tab>
                                            </Tabs>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </div>
                </div>
            </div>
            <Modal aria-labelledby="contained-modal-title-vcenter"
                centered show={showModal} size="sm" onHide={() => setShowModal(false)}>
                <Modal.Header className='text-center border-0' closeButton>
                    <Modal.Title>Delete Recipe</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div>
                        <div className='text-center'>
                            <svg className='my-3' xmlns="http://www.w3.org/2000/svg" width="132" height="89" viewBox="0 0 132 89" fill="none">
                                <ellipse cx="66" cy="84.5" rx="66" ry="4.5" fill="#E9EBE7" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M97.8946 87.107C97.8946 87.107 94.0553 83.0951 95.7808 75.4596C95.7808 75.4596 93.3651 70.3261 97.0319 66.573C97.0319 66.573 96.0397 60.5768 100.957 57.859C100.957 57.859 101.346 54.1491 104.452 51V87.0639H97.8946V87.107Z" fill="#DAFFD0" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M111.052 87.107C111.052 87.107 114.892 83.0951 113.166 75.4596C113.166 75.4596 115.582 70.3261 111.915 66.573C111.915 66.573 112.907 60.5768 107.989 57.859C107.989 57.859 107.601 54.1491 104.495 51V87.0639H111.052V87.107Z" fill="#B8F5A8" />
                                <path d="M99.2278 11.1405H95.6998C95.0497 8.07689 92.3577 5.84845 89.108 5.84845L73.976 5.8491V3.89918C73.976 1.76408 72.2119 0 70.0768 0H58.1936C56.0585 0 54.2944 1.76408 54.2944 3.89918V5.8491H39.2549C36.0052 5.8491 33.3133 8.07737 32.6631 11.1412H29.1351C27.928 11.1412 27 12.0698 27 13.2763V16.9894C27 18.1965 27.9286 19.1245 29.1351 19.1245H99.2275C100.435 19.1245 101.363 18.1959 101.363 16.9894V13.2763C101.363 12.0692 100.341 11.1405 99.2275 11.1405L99.2278 11.1405Z" fill="#FF5656" />
                                <path d="M94.4933 24.4165H33.7775C32.9421 24.4165 32.3852 25.1593 32.4778 25.9021L39.5333 82.533C39.9044 85.6893 42.6896 88.1036 45.8459 88.1036H82.424C85.6736 88.1036 88.3656 85.69 88.7366 82.533L95.7921 25.9021C95.886 25.1593 95.329 24.4165 94.4937 24.4165H94.4933ZM51.4167 76.4984C50.117 76.4984 49.003 75.4772 49.003 74.0848L48.7239 38.528C48.7239 37.2283 49.7452 36.1144 51.1375 36.1144C52.5298 36.207 53.5512 37.1356 53.5512 38.528L53.8296 74.0848C53.8303 75.3845 52.809 76.4989 51.4167 76.4989L51.4167 76.4984ZM66.5487 74.0843C66.5487 75.384 65.4348 76.4979 64.1351 76.4979C62.8353 76.4979 61.7215 75.3841 61.7215 74.0843V38.5275C61.7215 37.2278 62.8353 36.1139 64.1351 36.1139C65.4348 36.1139 66.5487 37.2277 66.5487 38.5275V74.0843ZM79.2679 74.0843C79.2679 75.384 78.1541 76.4979 76.8543 76.4979C75.5546 76.4979 74.4407 75.3841 74.4407 74.0843L74.7185 38.5275C74.7185 37.2278 75.7398 36.2066 77.1321 36.1139C78.4318 36.1139 79.5458 37.2277 79.5458 38.5275L79.2679 74.0843Z" fill="#FF5656" />
                                <path d="M23.7531 56.997C23.7531 56.997 27.0623 59.843 29.2134 56.997C31.3975 54.151 28.9486 48.9886 27.9227 48.1613C26.8969 47.334 24.5473 47.334 23.6207 45.4808C22.661 43.6276 20.8409 45.2491 18.359 43.1643C15.844 41.0795 13.9908 42.7341 12.27 41.2119C10.5491 39.6896 10.6484 46.8045 12.1376 48.7239C13.6268 50.6101 12.0383 55.1438 14.2555 55.1107C16.5058 55.0446 13.6929 59.7437 17.5317 61.5969C21.3373 63.417 23.6538 58.5855 23.7531 56.997Z" fill="#CCFFCE" />
                                <path d="M11.6074 41.8406C11.6074 41.8406 11.8391 42.0391 12.2362 42.4032C12.6333 42.7672 13.1628 43.2966 13.8246 43.9585C14.4865 44.6204 15.2145 45.3815 16.0087 46.2088C16.803 47.0361 17.5972 47.9627 18.3914 48.8893C18.7885 49.3526 19.1525 49.8159 19.5496 50.2792C19.9137 50.7425 20.2777 51.2389 20.6086 51.6691C20.9395 52.1324 21.2705 52.5957 21.5683 53.0259C21.8661 53.4561 22.1309 53.8863 22.3625 54.2834C22.5942 54.6805 22.7927 55.0445 22.9913 55.3754C23.1898 55.7064 23.3222 56.0042 23.4215 56.2359C23.6531 56.7322 23.7855 56.997 23.7855 56.997C23.7855 56.997 23.6862 56.6991 23.4877 56.2028C23.3884 55.938 23.2891 55.6402 23.1236 55.3093C22.9582 54.9783 22.7927 54.5812 22.5611 54.1841C22.3294 53.787 22.0647 53.3568 21.7999 52.8935C21.5021 52.4633 21.2043 51.9669 20.8733 51.5036C20.5424 51.0403 20.1784 50.5439 19.8144 50.0806C19.4504 49.6173 19.0533 49.1209 18.6561 48.6577C17.8619 47.7311 17.0346 46.8045 16.2404 45.9771C15.8433 45.5469 15.4462 45.1829 15.0821 44.8189C14.685 44.4549 14.321 44.124 13.9901 43.793C13.3282 43.1643 12.7326 42.6679 12.3024 42.337C11.8722 42.006 11.6074 41.8406 11.6074 41.8406Z" fill="#787E76" />
                                <path d="M23.2559 55.8058C23.2559 55.8058 23.2889 55.6734 23.3551 55.4748C23.4213 55.2432 23.5206 54.9453 23.6199 54.5813C23.7192 54.2173 23.8846 53.8202 24.0501 53.3569C24.1494 53.1252 24.2486 52.9267 24.3479 52.695C24.4472 52.4634 24.5796 52.2648 24.6788 52.0332C24.7781 51.8015 24.9436 51.603 25.0429 51.4044C25.1752 51.2059 25.3076 51.0073 25.4731 50.8088C25.6385 50.6433 25.7709 50.4448 25.9033 50.3124C26.0687 50.18 26.2011 50.0145 26.3335 49.9153C26.4989 49.816 26.6313 49.7167 26.7306 49.6174C26.863 49.5182 26.9953 49.4851 27.0615 49.4189C27.2601 49.3196 27.3593 49.2534 27.3593 49.2534C27.3593 49.2534 27.227 49.2865 27.0284 49.3527C26.9291 49.3858 26.7968 49.4189 26.6644 49.4851C26.532 49.5513 26.3666 49.6505 26.2011 49.7498C26.0356 49.8491 25.8702 49.9815 25.7047 50.1138C25.5392 50.2462 25.3738 50.4448 25.2083 50.6102C25.0429 50.8088 24.9105 51.0073 24.745 51.2059C24.6127 51.4375 24.4472 51.6361 24.3479 51.8677C24.1163 52.331 23.8846 52.7943 23.7522 53.2576C23.5868 53.7209 23.4875 54.1511 23.4213 54.5151C23.289 55.3094 23.2559 55.8058 23.2559 55.8058Z" fill="#787E76" />
                                <path d="M22.5607 54.4491C22.5607 54.4491 22.1636 54.1843 21.4687 53.9527C21.1378 53.8534 20.7076 53.721 20.2773 53.6218C20.0457 53.5887 19.8141 53.5225 19.5824 53.5225C19.3508 53.4894 19.086 53.4894 18.8544 53.4563C18.6227 53.4563 18.358 53.4563 18.1263 53.4563C17.8947 53.4563 17.663 53.4894 17.4314 53.4894C17.1997 53.5225 17.0012 53.5556 16.7695 53.5887C16.571 53.6218 16.3724 53.6548 16.207 53.6879C15.8429 53.7541 15.5451 53.8534 15.3466 53.9196C15.148 53.9858 15.0156 54.0189 15.0156 54.0189C15.0156 54.0189 15.148 54.0189 15.3466 53.9858C15.4458 53.9858 15.5782 53.9527 15.7106 53.9196C15.8429 53.8865 16.0084 53.8865 16.207 53.8534C16.3724 53.8534 16.571 53.8203 16.7695 53.7872C16.9681 53.7872 17.1997 53.7541 17.3983 53.7541C17.8285 53.7541 18.3249 53.721 18.7882 53.7541C19.0198 53.7872 19.2515 53.7872 19.4831 53.8203C19.7148 53.8534 19.9464 53.8534 20.1781 53.8865C20.6083 53.9527 21.0385 54.0189 21.3694 54.1182C21.7334 54.1843 21.9982 54.2836 22.1967 54.3498C22.4615 54.416 22.5607 54.4491 22.5607 54.4491Z" fill="#787E76" />
                                <path d="M21.1048 51.8677C21.1048 51.8677 21.0717 51.5037 21.1379 50.9411C21.171 50.6764 21.2041 50.3454 21.3034 50.0476C21.3365 49.8821 21.4026 49.7167 21.4357 49.5512C21.4688 49.3857 21.5681 49.2203 21.6012 49.0548C21.6674 48.8894 21.7336 48.7239 21.7997 48.5584C21.8659 48.393 21.9652 48.2606 22.0314 48.0951C22.1969 47.7973 22.3623 47.5326 22.5278 47.3009C22.6602 47.0693 22.8256 46.8707 22.8918 46.7383C22.9911 46.606 23.0242 46.5398 23.0242 46.5398C23.0242 46.5398 22.958 46.606 22.8256 46.7053C22.6933 46.8045 22.5278 46.97 22.3292 47.1686C22.1307 47.3671 21.9321 47.6318 21.7336 47.9297C21.6343 48.0951 21.535 48.2275 21.4688 48.393C21.4026 48.5584 21.3034 48.7239 21.2372 48.9225C21.171 49.0879 21.1048 49.2865 21.0717 49.4519C21.0386 49.6174 20.9724 49.816 20.9724 49.9814C20.9062 50.3454 20.9062 50.6764 20.9062 50.9411C20.9724 51.5368 21.1048 51.8677 21.1048 51.8677Z" fill="#787E76" />
                                <path d="M20.0128 50.4447C20.0128 50.4447 19.6818 50.213 19.1523 49.9483C18.5898 49.7166 17.8286 49.5181 17.0013 49.4519C16.8028 49.4519 16.6042 49.4519 16.4057 49.4519C16.2071 49.4519 16.0085 49.485 15.8431 49.485C15.6445 49.5181 15.4791 49.5512 15.3136 49.5843C15.1481 49.6174 14.9827 49.6505 14.8503 49.7166C14.7179 49.7497 14.5856 49.7828 14.4532 49.849C14.3539 49.8821 14.2546 49.9483 14.1554 49.9814C13.9899 50.0476 13.8906 50.0807 13.8906 50.0807C13.8906 50.0807 13.9899 50.0807 14.1554 50.0476C14.2546 50.0476 14.3539 50.0145 14.4532 49.9814C14.5856 49.9483 14.7179 49.9483 14.8503 49.9152C14.9827 49.8821 15.1481 49.8821 15.3136 49.849C15.4791 49.849 15.6445 49.8159 15.8431 49.8159C16.2071 49.8159 16.6042 49.7828 16.9682 49.8159C17.3653 49.849 17.7294 49.8821 18.0934 49.9483C18.4574 50.0145 18.7883 50.0807 19.0531 50.1469C19.6487 50.3123 20.0128 50.4447 20.0128 50.4447Z" fill="#787E76" />
                                <path d="M17.729 47.8635C17.729 47.8635 17.6959 47.5988 17.6959 47.2017C17.6628 46.8046 17.6298 46.2751 17.6298 45.7456C17.6298 45.2161 17.6628 44.6867 17.6959 44.3226C17.6959 44.1241 17.729 43.9586 17.729 43.8262C17.729 43.6939 17.729 43.6277 17.729 43.6277C17.729 43.6277 17.6959 43.6939 17.6628 43.7931C17.6298 43.8924 17.5305 44.0579 17.4974 44.2564C17.4312 44.455 17.3981 44.6866 17.365 44.9514C17.3319 45.2161 17.2988 45.4809 17.2988 45.7456C17.2988 46.2751 17.3981 46.8377 17.4974 47.2348C17.5967 47.5988 17.729 47.8635 17.729 47.8635Z" fill="#787E76" />
                                <path d="M16.9353 47.0031C16.9353 47.0031 16.7037 46.7715 16.2404 46.5399C16.0088 46.4075 15.7771 46.2751 15.4793 46.1758C15.1814 46.0435 14.8836 45.9773 14.5527 45.878C14.2218 45.8118 13.8908 45.7456 13.593 45.7125C13.2952 45.6794 12.9973 45.6794 12.7326 45.6794C12.4678 45.6794 12.2693 45.7125 12.1369 45.7125C12.0046 45.7456 11.9053 45.7456 11.9053 45.7456C11.9053 45.7456 11.9715 45.7456 12.1369 45.7787C12.2693 45.7787 12.4678 45.8118 12.7326 45.8449C13.229 45.9111 13.8577 46.0104 14.4865 46.1758C14.7843 46.242 15.1153 46.3413 15.4131 46.4075C15.7109 46.5068 15.9757 46.5729 16.2073 46.6722C16.6375 46.8708 16.9353 47.0031 16.9353 47.0031Z" fill="#787E76" />
                                <path d="M23.6524 56.6994C23.6524 56.6994 23.1891 56.6001 22.461 56.6001C22.097 56.6001 21.6999 56.6332 21.2366 56.6994C21.005 56.7325 20.7733 56.7986 20.5748 56.8648C20.3431 56.931 20.1115 56.9972 19.9129 57.0965C19.6813 57.1958 19.4827 57.295 19.2511 57.3943C19.0194 57.4936 18.8539 57.626 18.6554 57.7583C18.4568 57.8576 18.2914 58.0231 18.1259 58.1554C17.9604 58.2878 17.8281 58.4202 17.6957 58.5526C17.5633 58.6849 17.4641 58.7842 17.3648 58.9166C17.2655 59.0489 17.1993 59.1482 17.1331 59.2144C17.0008 59.3799 16.9346 59.4791 16.9346 59.4791C16.9346 59.4791 17.0338 59.413 17.1662 59.2475C17.2324 59.1813 17.3317 59.082 17.431 58.9828C17.5302 58.8835 17.6626 58.7842 17.795 58.6849C17.9273 58.5526 18.0597 58.4533 18.2252 58.354C18.3906 58.2547 18.5561 58.1224 18.7547 58.0231C18.9532 57.9238 19.1187 57.7914 19.3503 57.7252C19.5489 57.626 19.7474 57.5267 19.9791 57.4605C20.4093 57.295 20.8395 57.1627 21.2697 57.0634C21.4683 57.0303 21.6999 56.9641 21.8654 56.931C22.0639 56.8979 22.2625 56.8648 22.4279 56.8317C22.7589 56.7986 23.0567 56.7656 23.2553 56.7656C23.52 56.6994 23.6524 56.6994 23.6524 56.6994Z" fill="#787E76" />
                                <path d="M33.0524 55.7727C33.0524 55.7727 28.3532 63.6818 27.3936 77.0843" stroke="#787E76" stroke-miterlimit="10" />
                                <path d="M36.3611 62.4573C39.3394 61.0343 37.1553 57.3941 38.8761 57.4603C40.63 57.4934 39.3725 53.9856 40.5307 52.5295C41.689 51.0734 41.7882 45.547 40.4315 46.7052C39.0747 47.8966 37.6517 46.5729 35.6992 48.1944C33.7467 49.8159 32.3569 48.5584 31.6288 49.9814C30.9008 51.4044 29.0807 51.4044 28.2865 52.0331C27.4923 52.6619 25.606 56.6992 27.2937 58.8833C28.9814 61.0674 31.5295 58.8833 31.5295 58.8833C31.5957 60.1739 33.3827 63.8803 36.3611 62.4573Z" fill="#DAFFD0" />
                                <path d="M40.9287 47.2019C40.9287 47.2019 40.7632 47.3674 40.4654 47.6321C40.1676 47.8968 39.7373 48.3271 39.241 48.8234C38.7446 49.3198 38.1489 49.9155 37.5532 50.5773C36.9576 51.2061 36.3288 51.9341 35.7 52.6622C35.3691 53.0262 35.1044 53.3902 34.8066 53.7542C34.5087 54.1182 34.244 54.4823 33.9792 54.8463C33.7145 55.2103 33.4828 55.5412 33.2512 55.9052C33.0196 56.2362 32.821 56.5671 32.6224 56.8649C32.457 57.1628 32.2915 57.4606 32.1591 57.6922C31.9937 57.9239 31.9275 58.1555 31.8282 58.3541C31.6628 58.7181 31.5635 58.9498 31.5635 58.9498C31.5635 58.9498 31.6628 58.7181 31.7951 58.3541C31.8613 58.1555 31.9606 57.9239 32.093 57.6592C32.2253 57.3944 32.3577 57.0966 32.5232 56.7988C32.6886 56.5009 32.8872 56.17 33.1188 55.806C33.3505 55.475 33.5821 55.111 33.8469 54.747C34.1116 54.383 34.3763 54.019 34.6742 53.655C34.972 53.2909 35.2368 52.8938 35.5677 52.5629C36.1964 51.8349 36.8252 51.1399 37.454 50.5112C37.7518 50.1802 38.0827 49.8824 38.3475 49.6177C38.6453 49.3529 38.91 49.0882 39.1748 48.8234C39.7043 48.3271 40.1676 47.963 40.4654 47.6983C40.7301 47.3343 40.9287 47.2019 40.9287 47.2019Z" fill="#787E76" />
                                <path d="M31.8946 58.0229C31.8946 58.0229 31.8615 57.9236 31.8284 57.7582C31.7953 57.5927 31.696 57.3611 31.6298 57.0632C31.5305 56.7985 31.4313 56.4676 31.2989 56.1366C31.2327 55.9712 31.1665 55.8057 31.0672 55.6072C31.0011 55.4417 30.9018 55.2762 30.8025 55.0777C30.7032 54.9122 30.6039 54.7467 30.5047 54.5813C30.4054 54.4158 30.3061 54.2834 30.1737 54.118C30.0414 53.9856 29.9421 53.8532 29.8428 53.7209C29.7104 53.6216 29.6112 53.4892 29.5119 53.423C29.3795 53.3569 29.2802 53.2576 29.181 53.1914C29.0817 53.1252 28.9824 53.0921 28.9162 53.0259C28.7508 52.9266 28.6846 52.8936 28.6846 52.8936C28.6846 52.8936 28.7838 52.9267 28.9493 52.9928C29.0155 53.0259 29.1479 53.059 29.2471 53.0921C29.3464 53.1583 29.4788 53.2245 29.6112 53.2907C29.7435 53.3569 29.8759 53.4892 30.0083 53.5885C30.1406 53.6878 30.273 53.8202 30.4054 53.9525C30.5378 54.0849 30.637 54.2504 30.7694 54.4158C30.8687 54.5813 31.0011 54.7467 31.0672 54.9122C31.2658 55.2762 31.4313 55.6402 31.5305 55.9712C31.6629 56.3352 31.7291 56.6661 31.7953 56.9639C31.8945 57.6258 31.8946 58.0229 31.8946 58.0229Z" fill="#787E76" />
                                <path d="M32.457 56.964C32.457 56.964 32.788 56.7655 33.3174 56.5669C33.5822 56.4676 33.9131 56.3684 34.244 56.3022C34.4095 56.2691 34.608 56.236 34.7735 56.2029C34.9721 56.1698 35.1375 56.1698 35.3361 56.1367C35.5346 56.1367 35.7001 56.1367 35.8987 56.1367C36.0972 56.1367 36.2627 56.1698 36.4281 56.1698C36.5936 56.1698 36.7591 56.2029 36.9245 56.236C37.09 56.2691 37.2224 56.3022 37.3878 56.3353C37.6526 56.4015 37.8842 56.4676 38.0497 56.5007C38.2151 56.5669 38.2813 56.5669 38.2813 56.5669C38.2813 56.5669 38.182 56.5669 38.0166 56.5338C37.9504 56.5338 37.8511 56.5007 37.7188 56.5007C37.6195 56.4676 37.4871 56.4676 37.3547 56.4676C37.2224 56.4676 37.0569 56.4346 36.9245 56.4346C36.7591 56.4346 36.5936 56.4015 36.4281 56.4015C36.0972 56.4015 35.7001 56.4015 35.3361 56.4015C35.1375 56.4015 34.9721 56.4015 34.7735 56.4346C34.608 56.4676 34.4095 56.4676 34.244 56.5007C33.9131 56.5338 33.5822 56.6 33.3174 56.6662C33.0527 56.7324 32.8211 56.7986 32.6556 56.8317C32.5232 56.9309 32.457 56.964 32.457 56.964Z" fill="#787E76" />
                                <path d="M33.5829 54.9785C33.5829 54.9785 33.616 54.6807 33.5498 54.2836C33.5167 54.085 33.4836 53.8203 33.4175 53.5886C33.3844 53.4562 33.3513 53.3239 33.3182 53.1915C33.2851 53.0591 33.2189 52.9268 33.1858 52.7944C33.1196 52.662 33.0865 52.5296 33.0203 52.3973C32.9542 52.2649 32.888 52.1656 32.8549 52.0333C32.7225 51.8016 32.5901 51.6031 32.4909 51.4045C32.3916 51.239 32.2592 51.0736 32.193 50.9743C32.1268 50.875 32.0938 50.8088 32.0938 50.8088C32.0938 50.8088 32.1599 50.8419 32.2592 50.9412C32.3585 51.0405 32.4909 51.1398 32.6232 51.3052C32.7887 51.4707 32.9211 51.6692 33.0865 51.9009C33.1527 52.0333 33.2189 52.1325 33.2851 52.2649C33.3513 52.3973 33.4175 52.5297 33.4505 52.662C33.4836 52.7944 33.5498 52.9268 33.5829 53.0922C33.616 53.2246 33.6491 53.357 33.6822 53.4893C33.7153 53.7541 33.7484 54.0188 33.7153 54.2505C33.6822 54.6807 33.5829 54.9785 33.5829 54.9785Z" fill="#787E76" />
                                <path d="M34.4092 53.8533C34.4092 53.8533 34.6408 53.6547 35.071 53.4893C35.5012 53.2907 36.0969 53.1583 36.7257 53.1252C36.8911 53.1252 37.0235 53.1252 37.189 53.1252C37.3544 53.1252 37.4868 53.1583 37.6523 53.1583C37.7846 53.1583 37.9501 53.1914 38.0494 53.2245C38.1817 53.2576 38.3141 53.2907 38.4134 53.3238C38.5127 53.3569 38.6119 53.39 38.7112 53.4231C38.8105 53.4562 38.8767 53.4893 38.9429 53.5223C39.0752 53.5885 39.1414 53.6216 39.1414 53.6216C39.1414 53.6216 39.0752 53.6216 38.9429 53.5885C38.8767 53.5885 38.8105 53.5554 38.7112 53.5554C38.6119 53.5224 38.5127 53.5223 38.4134 53.5223C38.3141 53.5223 38.1817 53.4893 38.0494 53.4893C37.917 53.4893 37.7846 53.4562 37.6523 53.4562C37.3875 53.4562 37.0897 53.4231 36.7918 53.4562C36.494 53.4562 36.1962 53.4893 35.9314 53.5554C35.6667 53.5885 35.402 53.6547 35.1703 53.7209C34.707 53.754 34.4092 53.8533 34.4092 53.8533Z" fill="#787E76" />
                                <path d="M36.1973 51.8348C36.1973 51.8348 36.1973 51.6362 36.2304 51.3053C36.2635 51.0075 36.2634 50.5772 36.2634 50.1801C36.2634 49.783 36.2635 49.3859 36.2304 49.055C36.2304 48.8895 36.1973 48.7572 36.1973 48.691C36.1973 48.5917 36.1973 48.5586 36.1973 48.5586C36.1973 48.5586 36.2304 48.5917 36.2634 48.691C36.2965 48.7902 36.3627 48.8895 36.3958 49.055C36.4289 49.2204 36.4951 49.3859 36.4951 49.5845C36.5282 49.783 36.5282 49.9816 36.5282 50.2132C36.5282 50.6434 36.462 51.0405 36.3627 51.3384C36.2965 51.6693 36.1973 51.8348 36.1973 51.8348Z" fill="#787E76" />
                                <path d="M36.792 51.173C36.792 51.173 36.9905 51.0075 37.3215 50.809C37.4869 50.7097 37.6855 50.6104 37.9171 50.5111C38.1488 50.4119 38.3804 50.3457 38.6452 50.2795C38.9099 50.2133 39.1416 50.1802 39.4063 50.1471C39.638 50.114 39.8696 50.114 40.0682 50.114C40.2667 50.114 40.4322 50.1471 40.5315 50.1471C40.6307 50.1471 40.6969 50.1802 40.6969 50.1802C40.6969 50.1802 40.6307 50.1802 40.5315 50.2133C40.4322 50.2133 40.2667 50.2464 40.0682 50.2795C39.7041 50.3457 39.2078 50.4118 38.7114 50.5442C38.4797 50.6104 38.215 50.6766 38.0164 50.7428C37.7848 50.809 37.5862 50.8751 37.4207 50.9413C37.0236 51.0737 36.792 51.173 36.792 51.173Z" fill="#787E76" />
                                <path d="M31.5977 58.685C31.5977 58.685 31.9617 58.5857 32.5242 58.6188C32.789 58.6188 33.1199 58.6519 33.4508 58.7181C33.6163 58.7512 33.7818 58.7843 33.9803 58.8505C34.1458 58.9166 34.3443 58.9497 34.5098 59.0159C34.6753 59.0821 34.8407 59.1483 35.0062 59.2476C35.1717 59.3138 35.3371 59.413 35.4695 59.5123C35.635 59.6116 35.7342 59.7109 35.8666 59.8101C35.999 59.9094 36.0982 60.0087 36.1975 60.108C36.2968 60.2073 36.3961 60.3065 36.4623 60.3727C36.5285 60.472 36.5946 60.5382 36.6277 60.6044C36.727 60.7367 36.7601 60.8029 36.7601 60.8029C36.7601 60.8029 36.6939 60.7367 36.5946 60.6375C36.5284 60.5713 36.4623 60.5051 36.3961 60.4389C36.3299 60.3727 36.1975 60.3065 36.0982 60.2073C35.999 60.108 35.8997 60.0418 35.7673 59.9425C35.6349 59.8432 35.5026 59.777 35.3702 59.6778C35.2378 59.5785 35.0724 59.5123 34.9069 59.4461C34.7415 59.3799 34.576 59.2807 34.4105 59.2476C34.0796 59.1152 33.7487 59.0159 33.4177 58.9497C33.2523 58.9166 33.0868 58.8835 32.9544 58.8505C32.789 58.8174 32.6566 58.7843 32.5242 58.7843C32.2595 58.7512 32.0279 58.7181 31.8624 58.7181C31.6969 58.685 31.5977 58.685 31.5977 58.685Z" fill="#787E76" />
                                <path d="M38.28 69.9695H18.3252V72.6169H38.28V69.9695Z" fill="#DAFFD0" />
                                <path d="M35.0362 86.8468H21.6006L19.8467 72.6169H36.7901L35.0362 86.8468Z" fill="#80BE4F" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M79.7 87.2055C79.7 87.2055 77.4452 84.8493 78.4586 80.365C78.4586 80.365 77.0398 77.3501 79.1933 75.146C79.1933 75.146 78.6106 71.6244 81.4988 70.0283C81.4988 70.0283 81.7268 67.8495 83.5509 66V87.1802H79.7V87.2055Z" fill="#8DF570" />
                                <path fillRule="evenodd" clipRule="evenodd" d="M87.4291 87.2055C87.4291 87.2055 89.6839 84.8493 88.6705 80.365C88.6705 80.365 90.0892 77.3501 87.9358 75.146C87.9358 75.146 88.5185 71.6244 85.6303 70.0283C85.6303 70.0283 85.4023 67.8495 83.5781 66V87.1802H87.4291V87.2055Z" fill="#B8F5A8" />
                            </svg>
                            <h4 className='text-dark mb-1 fw-600 fs-17'>Are you sure? </h4>
                            <p className='text-custom-grey fw-600 fs-15 mb-0'>You want to delete this recipe? </p>
                        </div>

                        <Button className='bg-green text-white w-100 d-block py-2 custom-shadow border-0 mt-5 mb-3' onClick={handleDeleteRecipe}>Delete Recipe</Button>
                    </div>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div>
    )
}
