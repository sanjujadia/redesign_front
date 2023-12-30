import React, { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import UserSidebar from '../User_components/UserSidebar'
import TopBar from '../components/TopBar'
import { Button, ButtonGroup, Col, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import MealMenu from '../components/MealMenu'
import DietCard from '../components/DietCard'
import { useAuth } from '../context/AuthProvider'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import moment from 'moment'

export default function ViewMealPlan() {
    const params = useParams()
    const mealPlanId = params.id
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [mealPlan, setMealPlan] = useState(null)
    const [mealPlans, setMealPlans] = useState(null)
    const [dates, setDates] = useState([])

    const fetchMealPlan = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getMealPlan/${mealPlanId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())

        if (res.status) {
            console.log(res)
            setMealPlan(res?.data)
            setMealPlans(res.mealdata)
            setDates(res.dates)
        }
    }

    const handleDeleteMealPlan = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/admin/deleteMealPlan/${mealPlanId}`, {
            method: 'DELETE'
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

    console.log('mealplans', mealPlans)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/')
        } else {
            fetchMealPlan()
        }
    }, [user])

    return (
        <div>
            <div className='mt-1 main-content'>
                <div className='bg-white py-3 px-4'>
                    <Row>
                        <Col lg={4}>
                            <div>
                                <h5 className='text-dark mb-0 fw-600 fs-5 left-border'>{mealPlan?.title}</h5>
                                <p className='text-custom-grey fw-600 fs-17 ps-2 mb-0'>Last edit was {moment(mealPlan?.updatedAt).fromNow()}</p>
                            </div>
                        </Col>
                        <Col lg={8}>
                            <div className='text-end'>
                                <Button className='bg-none border-0 text-custom-grey fs-15 py-0' onClick={() => navigate(`/add-plan/${mealPlanId}`)}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M13.3603 2.23128L11.7687 0.639685C11.3585 0.230044 10.8025 0 10.2227 0C9.64305 0 9.08707 0.230063 8.67684 0.639685L7.51588 1.80051L0.944086 8.3723C0.939318 8.37707 0.937851 8.38367 0.933206 8.38868C0.874285 8.45029 0.826855 8.52181 0.79287 8.60004C0.784924 8.61825 0.781868 8.63671 0.775511 8.65542C0.760598 8.69221 0.74874 8.73011 0.740183 8.76886L0.0100253 13.15H0.00990281C-0.0253032 13.3617 0.0343514 13.5782 0.173096 13.7418C0.311842 13.9055 0.515612 14 0.730166 14C0.77026 13.9999 0.810357 13.9965 0.849963 13.99L5.23116 13.2598C5.26991 13.2511 5.30781 13.2393 5.34448 13.2244C5.36306 13.218 5.38176 13.215 5.39986 13.2071H5.39998C5.47809 13.1732 5.5496 13.1256 5.61121 13.0668C5.6161 13.0622 5.6227 13.0607 5.62759 13.0559L13.3604 5.32311C13.7699 4.91288 14 4.3569 14 3.77712C14 3.19745 13.7699 2.64148 13.3604 2.23124L13.3603 2.23128ZM1.6187 12.3812L1.94741 10.4081L3.59183 12.0525L1.6187 12.3812ZM12.3279 4.29044L11.6833 4.93504L9.06485 2.31671L9.70945 1.67211V1.67199C9.84588 1.53642 10.0305 1.46027 10.2229 1.46027C10.4153 1.46027 10.5999 1.53642 10.7363 1.67199L12.3279 3.26358C12.4638 3.39989 12.5402 3.58448 12.5402 3.777C12.5402 3.96952 12.4638 4.15412 12.3279 4.29041L12.3279 4.29044Z" fill="#26BAFA" />
                                </svg>Edit</Button>
                                <div className='vr mx-1'></div>
                                <Button className='bg-none border-0 text-custom-grey fs-15 py-0' onClick={handleDeleteMealPlan}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                                    <path d="M2.6342 2.67757V2.67778V2.67757ZM7.54307 0L6.1102 0.000508323V0.000711673H6.10949C5.61692 0.000711673 5.21778 0.406291 5.21778 0.906433V0.992348L1.09694 0.99245C0.852 0.99245 0.65332 1.19407 0.65332 1.44288V2.23634C0.65332 2.48513 0.851993 2.68676 1.09694 2.68676H1.62686V2.68707L12.0263 2.68717L12.0264 2.68697V2.68717H12.0325L12.5563 2.68697C12.674 2.68697 12.7867 2.63948 12.8699 2.55509C12.9531 2.4706 12.9999 2.35602 12.9999 2.23655V1.44257C12.9999 1.32311 12.9531 1.20862 12.8699 1.12414C12.7867 1.03965 12.6739 0.992166 12.5563 0.992166L8.43545 0.992268V0.906251C8.43545 0.665892 8.34142 0.435392 8.174 0.265398C8.00667 0.095501 7.77965 3.55961e-05 7.54294 3.55961e-05L7.54307 0ZM7.04057 4.45898C7.20449 4.45918 7.33727 4.5941 7.33727 4.76055L7.33747 11.2794C7.33747 11.3595 7.30613 11.4362 7.25045 11.4927C7.19468 11.5494 7.11917 11.5811 7.04037 11.5814L6.61298 11.5811V11.5814C6.53417 11.5811 6.45867 11.5494 6.40289 11.4927C6.34721 11.4362 6.31587 11.3595 6.31587 11.2794L6.31607 4.76055C6.31607 4.59441 6.44845 4.4596 6.61198 4.4596L6.61238 4.45991L6.61488 4.4593L6.61528 4.4592L7.03977 4.45899L7.04057 4.45898ZM4.37478 4.44749L4.36887 4.45349V4.45369H4.36927C4.52849 4.45369 4.66007 4.5819 4.66559 4.74469L4.88759 11.2597C4.89029 11.3397 4.86165 11.4175 4.80788 11.4759L4.80778 11.476C4.754 11.5345 4.6796 11.5689 4.6009 11.5716L4.17371 11.5866C4.17111 11.5867 4.1661 11.5868 4.1635 11.5868C4.0884 11.5868 4.0159 11.5579 3.96082 11.5056C3.90314 11.4511 3.8693 11.3755 3.86659 11.2956L3.64509 4.78058C3.63938 4.61404 3.76776 4.47443 3.93169 4.46866L4.35846 4.45371V4.45391C4.35997 4.45371 4.36127 4.45361 4.36257 4.45361C4.36437 4.45361 4.36628 4.45371 4.36768 4.45391L4.36808 4.45351L4.37478 4.44749ZM9.28774 4.45349C9.29015 4.45359 9.29265 4.45359 9.29475 4.45369V4.45389L9.72152 4.46864C9.88545 4.47443 10.0138 4.61403 10.0081 4.78056L9.78662 11.2955C9.78392 11.3755 9.75007 11.4511 9.69249 11.5056C9.63742 11.5579 9.56482 11.5867 9.48972 11.5867C9.48711 11.5867 9.48211 11.5866 9.4795 11.5865L9.05232 11.5716V11.5718C8.97361 11.5689 8.89911 11.5344 8.84543 11.4759C8.79166 11.4175 8.76292 11.3396 8.76573 11.2597L8.98763 4.74467C8.99314 4.5822 9.12431 4.45419 9.28312 4.45419L9.28352 4.4544L9.28593 4.45379L9.28683 4.45358V4.45348L9.28774 4.45349ZM1.6631 3.34807L2.08797 11.1005L2.08897 11.1146C2.12562 11.5605 2.15787 12.366 2.69309 12.8064V12.8066C3.19118 13.2162 4.03363 13.2097 4.57137 13.2221L4.58269 13.2222L5.92343 13.2228L5.92263 13.223C5.93124 13.2232 5.93985 13.2234 5.94856 13.2234L5.94876 13.2237L6.81984 13.2231L7.70374 13.2235L7.70394 13.2237C7.71236 13.2235 7.72077 13.2233 7.72908 13.2229H7.72988L7.72918 13.2231L9.06982 13.2224L9.08113 13.2222C9.61888 13.2098 10.4613 13.2164 10.9594 12.8069V12.8066C11.4946 12.3663 11.527 11.5609 11.5636 11.1149L11.5646 11.1008L11.9899 3.34839L1.6631 3.34807Z" fill="#FF6161" />
                                </svg>Delete</Button>
                                <Button className='text-white mb-0 fw-600 fs-17 bg-green custom-shadow border-0 px-3 py-2 ms-2'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M13.3033 5.3513L9.56443 7.29614C8.55782 6.1929 7.1091 5.49975 5.49976 5.49975C2.46381 5.49975 0 7.96392 0 10.9999C0 14.0359 2.464 16.5001 5.49976 16.5001C6.69768 16.5001 7.8065 16.1161 8.70977 15.4661L12.2441 17.7332C12.1505 18.0389 12.0999 18.3633 12.0999 18.7C12.0999 20.5216 13.5782 22 15.3999 22C17.2216 22 18.7 20.5216 18.7 18.7C18.7 16.8783 17.2216 15.4 15.3999 15.4C14.718 15.4 14.0843 15.6068 13.5585 15.9622L10.2211 13.8216C10.715 12.9966 10.9999 12.0308 10.9999 11C10.9999 10.3652 10.8922 9.75587 10.694 9.18832L14.3022 7.3116C15.1084 8.22353 16.2877 8.79991 17.6 8.79991C20.0288 8.79991 22 6.82876 22 4.39995C22 1.97114 20.0288 0 17.6 0C15.1712 0 13.2 1.97114 13.2 4.39995C13.2 4.72664 13.2352 5.04449 13.3033 5.35149L13.3033 5.3513Z" fill="white" />
                                </svg>Share</Button>
                            </div>
                        </Col>
                    </Row>

                </div>
                <div className='p-xl-5 p-3'>
                    <div className='shadow bg-white rounded'>
                        <div>
                            <ButtonGroup className='' size="sm">
                                <Button className='bg-green custom-border'><svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 13 13" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M2.43744 0V2.42671H0V0H2.43744ZM13 0V2.42671H4.87489V0H13ZM2.43744 4.85342V7.28013H0V4.85342H2.43744ZM13 4.85342V7.28013H4.87489V4.85342H13ZM2.43744 9.70662V12.1333H0V9.70662H2.43744ZM13 9.70662V12.1333H4.87489V9.70662H13Z" fill="white" />
                                </svg></Button>
                                <Button className='bg-none border-light borde-2 rounded-0 '><svg xmlns="http://www.w3.org/2000/svg" width="16" height="15" viewBox="0 0 16 15" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M14.8654 8.6682C14.857 8.6682 14.8488 8.66749 14.8402 8.66466L8.09185 6.87467C8.06668 6.86803 8.04504 6.85148 8.03161 6.829C8.0186 6.80623 8.01506 6.77908 8.02213 6.75391L9.83051 0.0725333C9.84466 0.0206346 9.89811 -0.0104771 9.951 0.00323971C10.4175 0.126836 10.8715 0.297943 11.2999 0.510207C11.7172 0.71752 12.1155 0.966963 12.4829 1.25162C12.8436 1.53133 13.1792 1.84797 13.4792 2.19257C13.7766 2.53408 14.0422 2.90585 14.2685 3.29799C14.4919 3.68545 14.6791 4.09583 14.8246 4.51795C14.9719 4.94389 15.0772 5.38537 15.139 5.82997C15.2012 6.28321 15.2189 6.7442 15.1906 7.20052C15.1615 7.66901 15.084 8.13796 14.9604 8.59501C14.9485 8.63899 14.9084 8.66798 14.8651 8.66798L14.8654 8.6682Z" fill="#B0B0B0" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M7.09049 14.3868C6.47282 14.3868 5.85482 14.3058 5.25297 14.1464C4.78604 14.0226 4.3325 13.8517 3.90362 13.6395C3.48633 13.4322 3.08851 13.1827 2.72113 12.8975C2.35996 12.6178 2.0244 12.3011 1.72476 11.9565C1.42737 11.615 1.16179 11.2432 0.935525 10.8515C0.71181 10.4641 0.524854 10.0537 0.37878 9.63159C0.231993 9.20564 0.126216 8.76416 0.0649844 8.31913C0.00233748 7.86589 -0.0153402 7.4049 0.0133677 6.94858C0.0420745 6.48034 0.119569 6.01114 0.243024 5.55409C0.45076 4.78734 0.78279 4.06899 1.22966 3.41877C1.66195 2.7906 2.1931 2.23853 2.80798 1.77797C3.41704 1.32165 4.09158 0.967234 4.81337 0.724429C5.54674 0.477806 6.31024 0.352783 7.08206 0.352783C7.69973 0.352783 8.31802 0.433813 8.91987 0.593184C8.94504 0.600396 8.96667 0.6168 8.97968 0.639283C8.99312 0.662051 8.99623 0.688778 8.98944 0.714372L7.20709 7.30054L13.8599 9.06493C13.8855 9.07158 13.9071 9.08812 13.9201 9.11103C13.9335 9.1338 13.9367 9.16053 13.9299 9.18612C13.7221 9.95287 13.3901 10.6712 12.9429 11.3214C12.5107 11.9496 11.9799 12.5017 11.3646 12.9625C10.7556 13.4186 10.081 13.7725 9.35923 14.0156C8.62542 14.2617 7.86222 14.3868 7.09011 14.3868L7.09049 14.3868Z" fill="#B0B0B0" />
                                </svg></Button>
                            </ButtonGroup>
                        </div>
                        <div className='meal-grid'>
                            {dates.map((date, i) => (
                                <MealMenu date={date} data={mealPlan} />
                            ))}
                        </div>

                    </div>
                </div>
                <div className='p-xl-5 p-3'>
                    <div className='px-3 py-4 bg-green rounded'>
                        <div className='week-grid'>
                            {dates.map((date, i) => (
                                <h4 className='text-white fs-6 mb-0'>{moment(date).format('dddd')}</h4>
                            ))}
                        </div>
                    </div>
                    <div className='bg-white p-4 rounded-4 shadow mt-3'>
                        {mealPlan?.meals && mealPlan?.meals.map((mealTitle, rowIndex) => (
                            <div key={rowIndex} className="meal-planner-grid">
                                <p className="text-rotate-90 fw-600 text-dark mb-0 text-center">
                                    {mealTitle ? mealTitle : ""}
                                </p>
                                {dates.map((date, columnIndex) => (
                                    <div className='meal-planner-item rounded-4 shadow' key={columnIndex} >
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
                </div>
            </div>
        </div>
    )
}
