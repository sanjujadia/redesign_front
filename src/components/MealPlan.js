import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import { toast, ToastContainer } from 'react-toastify';

export default function MealPlan(props) {
    const navigate = useNavigate()


    return (
        <div className='plan-grid'>
            <div className=''>
                <svg xmlns="http://www.w3.org/2000/svg" width="79" height="79" viewBox="0 0 79 79" fill="none">
                    <g filter="url(#filter0_d_87_236)">
                        <rect x="11" y="8" width="57" height="57" rx="12" fill="url(#paint0_linear_87_236)" />
                    </g>
                    <path d="M50.95 31.6501H28.85C28.34 31.6501 28 31.3101 28 30.8001V26.8901C28 25.7851 28.935 24.8501 30.04 24.8501H49.845C50.865 24.8501 51.8 25.7851 51.8 26.8901V30.8001C51.8 31.3101 51.46 31.6501 50.95 31.6501ZM29.7 29.9501H50.1V26.8901C50.1 26.7201 49.93 26.5501 49.76 26.5501H30.04C29.87 26.5501 29.7 26.7201 29.7 26.8901V29.9501Z" fill="white" />
                    <path d="M33.78 27.4H33.27C32.675 27.4 32.25 26.975 32.25 26.38V25.02C32.25 24.425 32.675 24 33.27 24H33.78C34.375 24 34.8 24.425 34.8 25.02V26.38C34.8 26.975 34.375 27.4 33.78 27.4Z" fill="white" />
                    <path d="M46.02 27.4H46.53C47.125 27.4 47.55 26.975 47.55 26.38V25.02C47.55 24.425 47.125 24 46.53 24H46.02C45.425 24 45 24.425 45 25.02V26.38C45 26.975 45.425 27.4 46.02 27.4Z" fill="white" />
                    <path d="M50.95 29.95H28.85C28.34 29.95 28 30.29 28 30.8V46.95C28 47.46 28.34 47.8 28.85 47.8H50.95C51.46 47.8 51.8 47.46 51.8 46.95V30.8C51.8 30.29 51.46 29.95 50.95 29.95ZM43.045 39.3L39.9 42.7L36.755 39.3C35.905 38.365 35.905 36.835 36.755 35.9L37.01 35.645C37.775 34.88 38.965 34.88 39.73 35.645L39.9 35.9L40.155 35.645C40.92 34.88 42.11 34.88 42.875 35.645L43.13 35.9C43.98 36.835 43.98 38.365 43.045 39.3Z" fill="white" />
                    <defs>
                        <filter id="filter0_d_87_236" x="0" y="0" width="79" height="79" filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix" />
                            <feColorMatrix in="SourceAlpha" type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0" result="hardAlpha" />
                            <feOffset dy="3" />
                            <feGaussianBlur stdDeviation="5.5" />
                            <feComposite in2="hardAlpha" operator="out" />
                            <feColorMatrix type="matrix" values="0 0 0 0 0.563686 0 0 0 0 0.783333 0 0 0 0 0.267639 0 0 0 0.3 0" />
                            <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_87_236" />
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_dropShadow_87_236" result="shape" />
                        </filter>
                        <linearGradient id="paint0_linear_87_236" x1="20.2694" y1="8.00002" x2="71.352" y2="11.452" gradientUnits="userSpaceOnUse">
                            <stop stopColor="#8DC63F" />
                            <stop offset="1" stopColor="#7FC520" />
                        </linearGradient>
                    </defs>
                </svg>
            </div>
            <div className=''>
                <Link to={`/view-mealplan/${props?.data?._id}`} className='text-dark fw-600 fs-17 text-decoration-none d-block'>{props?.data?.title}</Link>
                <p className='d-inline text-custom-grey fw-600 fs-15 mb-0'>Last edit was {moment(new Date(props?.data?.updatedAt)).fromNow()}</p>
            </div>
            <div>
                <ButtonGroup className='my-2' size="sm">
                    <Button className='bg-none border-0 d-flex align-items-center text-custom-grey fs-15 py-0' onClick={() => navigate(`/add-plan/${props?.data?._id}`)}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M13.3603 2.23128L11.7687 0.639685C11.3585 0.230044 10.8025 0 10.2227 0C9.64305 0 9.08707 0.230063 8.67684 0.639685L7.51588 1.80051L0.944086 8.3723C0.939318 8.37707 0.937851 8.38367 0.933206 8.38868C0.874285 8.45029 0.826855 8.52181 0.79287 8.60004C0.784924 8.61825 0.781868 8.63671 0.775511 8.65542C0.760598 8.69221 0.74874 8.73011 0.740183 8.76886L0.0100253 13.15H0.00990281C-0.0253032 13.3617 0.0343514 13.5782 0.173096 13.7418C0.311842 13.9055 0.515612 14 0.730166 14C0.77026 13.9999 0.810357 13.9965 0.849963 13.99L5.23116 13.2598C5.26991 13.2511 5.30781 13.2393 5.34448 13.2244C5.36306 13.218 5.38176 13.215 5.39986 13.2071H5.39998C5.47809 13.1732 5.5496 13.1256 5.61121 13.0668C5.6161 13.0622 5.6227 13.0607 5.62759 13.0559L13.3604 5.32311C13.7699 4.91288 14 4.3569 14 3.77712C14 3.19745 13.7699 2.64148 13.3604 2.23124L13.3603 2.23128ZM1.6187 12.3812L1.94741 10.4081L3.59183 12.0525L1.6187 12.3812ZM12.3279 4.29044L11.6833 4.93504L9.06485 2.31671L9.70945 1.67211V1.67199C9.84588 1.53642 10.0305 1.46027 10.2229 1.46027C10.4153 1.46027 10.5999 1.53642 10.7363 1.67199L12.3279 3.26358C12.4638 3.39989 12.5402 3.58448 12.5402 3.777C12.5402 3.96952 12.4638 4.15412 12.3279 4.29041L12.3279 4.29044Z" fill="#26BAFA" />
                    </svg>Edit</Button>
                    <div className='vr mx-1'></div>
                    <Button className='bg-none border-0 d-flex align-items-center text-custom-grey fs-15 py-0' onClick={() => props?.handleDelete(props?.data?._id)}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                        <path d="M2.6342 2.67757V2.67778V2.67757ZM7.54307 0L6.1102 0.000508323V0.000711673H6.10949C5.61692 0.000711673 5.21778 0.406291 5.21778 0.906433V0.992348L1.09694 0.99245C0.852 0.99245 0.65332 1.19407 0.65332 1.44288V2.23634C0.65332 2.48513 0.851993 2.68676 1.09694 2.68676H1.62686V2.68707L12.0263 2.68717L12.0264 2.68697V2.68717H12.0325L12.5563 2.68697C12.674 2.68697 12.7867 2.63948 12.8699 2.55509C12.9531 2.4706 12.9999 2.35602 12.9999 2.23655V1.44257C12.9999 1.32311 12.9531 1.20862 12.8699 1.12414C12.7867 1.03965 12.6739 0.992166 12.5563 0.992166L8.43545 0.992268V0.906251C8.43545 0.665892 8.34142 0.435392 8.174 0.265398C8.00667 0.095501 7.77965 3.55961e-05 7.54294 3.55961e-05L7.54307 0ZM7.04057 4.45898C7.20449 4.45918 7.33727 4.5941 7.33727 4.76055L7.33747 11.2794C7.33747 11.3595 7.30613 11.4362 7.25045 11.4927C7.19468 11.5494 7.11917 11.5811 7.04037 11.5814L6.61298 11.5811V11.5814C6.53417 11.5811 6.45867 11.5494 6.40289 11.4927C6.34721 11.4362 6.31587 11.3595 6.31587 11.2794L6.31607 4.76055C6.31607 4.59441 6.44845 4.4596 6.61198 4.4596L6.61238 4.45991L6.61488 4.4593L6.61528 4.4592L7.03977 4.45899L7.04057 4.45898ZM4.37478 4.44749L4.36887 4.45349V4.45369H4.36927C4.52849 4.45369 4.66007 4.5819 4.66559 4.74469L4.88759 11.2597C4.89029 11.3397 4.86165 11.4175 4.80788 11.4759L4.80778 11.476C4.754 11.5345 4.6796 11.5689 4.6009 11.5716L4.17371 11.5866C4.17111 11.5867 4.1661 11.5868 4.1635 11.5868C4.0884 11.5868 4.0159 11.5579 3.96082 11.5056C3.90314 11.4511 3.8693 11.3755 3.86659 11.2956L3.64509 4.78058C3.63938 4.61404 3.76776 4.47443 3.93169 4.46866L4.35846 4.45371V4.45391C4.35997 4.45371 4.36127 4.45361 4.36257 4.45361C4.36437 4.45361 4.36628 4.45371 4.36768 4.45391L4.36808 4.45351L4.37478 4.44749ZM9.28774 4.45349C9.29015 4.45359 9.29265 4.45359 9.29475 4.45369V4.45389L9.72152 4.46864C9.88545 4.47443 10.0138 4.61403 10.0081 4.78056L9.78662 11.2955C9.78392 11.3755 9.75007 11.4511 9.69249 11.5056C9.63742 11.5579 9.56482 11.5867 9.48972 11.5867C9.48711 11.5867 9.48211 11.5866 9.4795 11.5865L9.05232 11.5716V11.5718C8.97361 11.5689 8.89911 11.5344 8.84543 11.4759C8.79166 11.4175 8.76292 11.3396 8.76573 11.2597L8.98763 4.74467C8.99314 4.5822 9.12431 4.45419 9.28312 4.45419L9.28352 4.4544L9.28593 4.45379L9.28683 4.45358V4.45348L9.28774 4.45349ZM1.6631 3.34807L2.08797 11.1005L2.08897 11.1146C2.12562 11.5605 2.15787 12.366 2.69309 12.8064V12.8066C3.19118 13.2162 4.03363 13.2097 4.57137 13.2221L4.58269 13.2222L5.92343 13.2228L5.92263 13.223C5.93124 13.2232 5.93985 13.2234 5.94856 13.2234L5.94876 13.2237L6.81984 13.2231L7.70374 13.2235L7.70394 13.2237C7.71236 13.2235 7.72077 13.2233 7.72908 13.2229H7.72988L7.72918 13.2231L9.06982 13.2224L9.08113 13.2222C9.61888 13.2098 10.4613 13.2164 10.9594 12.8069V12.8066C11.4946 12.3663 11.527 11.5609 11.5636 11.1149L11.5646 11.1008L11.9899 3.34839L1.6631 3.34807Z" fill="#FF6161" />
                    </svg>Delete</Button>
                </ButtonGroup>
            </div>
        </div>
    )
}
