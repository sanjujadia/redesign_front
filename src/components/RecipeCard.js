import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Modal } from 'react-bootstrap';
//import SladPic from '../assets/images/greek-salad-food 2.png';
import { Link } from 'react-router-dom';
//import {toast} from 'react-toastify'
import { TailSpin } from 'react-loader-spinner';
import {
    FacebookShareButton,
    FacebookIcon,
    LinkedinShareButton,
    LinkedinIcon,
    TelegramShareButton,
    TelegramIcon,
    TwitterShareButton,
    TwitterIcon,
    WhatsappShareButton,
    WhatsappIcon
} from "react-share";
export default function RecipeCard(props) {
    const path = window.location.href;
    const [data, setData] = useState()
    const [show, setShow] = useState(false)
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setData(props.data)
        setLoading(false);
    }, [props])

    const HandleShareButton = () => {
        setShow(true)
    }

    const HandleDeleteReceipe = async (id) => {
        let confirm = window.confirm('Are you want to sure to delete this receipe')
        if(confirm){
            console.log('Yes ')
            const response = await fetch(`${process.env.REACT_APP_BASE_URL}/recipe/deleteRecipe`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json'
                },
                body:JSON.stringify({id})
            }).then(res => res.json()).then(data => {return data})
            if(response.status){
                props.reloadFunction(true,response.message)
            }else{
                props.reloadFunction(false,response.message)
            }

        }else{
           console.log('No')
        }
    }

    console.log(data, 'Props Receipe Data')
    return (
        <>
            {loading && (
        <div className="loader-overlay">
          <TailSpin height={80} width={80} color="#4fa94d" ariaLabel="tail-spin-loading" radius={1} visible={true} />
        </div>
      )}
            {
                data?.map((item) => {
                    return (
                        <div className='recipe-box'>
                            <div className='recipe-card-img'>
                                <img src={item?.image} className='w-100 h-100 object-fit-cover' />
                            </div>
                            <div className='recipe-card-body'>
                                <Link to="/view-recipe" className='text-dark mb-2 fw-600 fs-5 text-decoration-none d-block'>
                                    {item?.ReceipeName}
                                </Link>
                                <p className='text-custom-grey fw-normal fs-17 ps-2 mb-0 d-inline me-3'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                                    <path d="M10.7161 0C5.17345 0 0.666992 4.57565 0.666992 10.2034C0.666992 15.8312 5.17345 20.4069 10.7161 20.4069C16.2588 20.4069 20.7653 15.8312 20.7653 10.2034C20.7653 4.57565 16.2588 0 10.7161 0ZM15.2226 12.0335H9.36447V4.48397H11.167V9.97443H15.2228L15.2226 12.0335Z" fill="#86C52F" />
                                </svg>{item?.time} minutes</p>
                                <p className='text-custom-grey fw-normal fs-17 ps-2 mb-0 d-inline me-3'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                                    <path fillRule="evenodd" clipRule="evenodd" d="M18.8859 7.22865C18.6167 6.90192 18.1382 6.8564 17.8142 7.12979L13.4622 10.8119H2.32854C1.90861 10.8119 1.56787 11.1579 1.56787 11.5841V15.1414C1.56787 17.0126 3.06788 18.5348 4.91074 18.5348H14.9592C16.8021 18.5348 18.3012 17.0126 18.3012 15.1414V11.5841C18.3012 11.1579 17.9613 10.8119 17.5407 10.8119H15.8392L18.7888 8.31586C19.1113 8.04328 19.1555 7.55603 18.8862 7.2285" fill="#FF964A" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M6.13206 8.49536C6.32824 8.49536 6.52296 8.41819 6.66978 8.26911L9.71211 5.17992C9.98601 4.90195 10.0111 4.4586 9.76849 4.15127L6.72602 0.289881C6.59829 0.12854 6.41193 0.0249757 6.20888 0.00410004C6.00727 -0.0174479 5.80114 0.0466581 5.64451 0.179445L1.08091 4.04084C0.896935 4.19679 0.795735 4.43167 0.808733 4.6749C0.822394 4.91812 0.947073 5.14141 1.14643 5.27648L5.71003 8.36567C5.83856 8.45294 5.98618 8.49536 6.13223 8.49536" fill="#FF964A" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M10.6956 7.72327C11.1154 7.72327 11.4561 7.37729 11.4561 6.95092C11.4561 6.52468 11.1154 6.17871 10.6956 6.17871C10.2758 6.17871 9.93506 6.52468 9.93506 6.95092C9.93506 7.37729 10.2758 7.72327 10.6956 7.72327Z" fill="#FF964A" />
                                    <path fillRule="evenodd" clipRule="evenodd" d="M9.17411 8.49536C8.75432 8.49536 8.41357 8.84134 8.41357 9.26771C8.41357 9.69395 8.75432 10.0399 9.17411 10.0399C9.59403 10.0399 9.93478 9.69395 9.93478 9.26771C9.93478 8.84134 9.59403 8.49536 9.17411 8.49536Z" fill="#FF964A" />
                                </svg>{item?.ingredients?.length} ingredients</p>
                            </div>
                            <hr />
                            <div className='recipe-card-footer'>
                                <ButtonGroup size="sm">
                                    <Button className='bg-none border-0 text-custom-grey fs-15 py-0' onClick={HandleShareButton}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path fillRule="evenodd" clipRule="evenodd" d="M8.46576 3.40537L6.08646 4.643C5.44589 3.94093 4.52397 3.49984 3.49985 3.49984C1.56788 3.49984 0 5.06795 0 6.99995C0 8.93196 1.568 10.5001 3.49985 10.5001C4.26216 10.5001 4.96777 10.2557 5.54258 9.84204L7.79168 11.2848C7.73215 11.4793 7.69992 11.6858 7.69992 11.9C7.69992 13.0592 8.6407 14 9.79995 14C10.9592 14 11.9 13.0592 11.9 11.9C11.9 10.7408 10.9592 9.79998 9.79995 9.79998C9.36599 9.79998 8.96276 9.93159 8.62816 10.1578L6.50434 8.79558C6.81866 8.27058 6.99995 7.65594 6.99995 7.00002C6.99995 6.59606 6.93139 6.20828 6.8053 5.84711L9.10138 4.65284C9.61445 5.23316 10.3649 5.59994 11.2 5.59994C12.7456 5.59994 14 4.34558 14 2.79997C14 1.25436 12.7456 0 11.2 0C9.65438 0 8.4 1.25436 8.4 2.79997C8.4 3.00786 8.42238 3.21013 8.46574 3.40549L8.46576 3.40537Z" fill="#86C52F" />
                                    </svg>Share</Button>
                                    <div className='vr mx-1'></div>
                                    <Button className='bg-none border-0 text-custom-grey fs-15 py-0'><Link to={`/edit-recipe/${item?._id}`} className='text-decoration-none text-custom-grey'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                                        <path d="M13.3603 2.23128L11.7687 0.639685C11.3585 0.230044 10.8025 0 10.2227 0C9.64305 0 9.08707 0.230063 8.67684 0.639685L7.51588 1.80051L0.944086 8.3723C0.939318 8.37707 0.937851 8.38367 0.933206 8.38868C0.874285 8.45029 0.826855 8.52181 0.79287 8.60004C0.784924 8.61825 0.781868 8.63671 0.775511 8.65542C0.760598 8.69221 0.74874 8.73011 0.740183 8.76886L0.0100253 13.15H0.00990281C-0.0253032 13.3617 0.0343514 13.5782 0.173096 13.7418C0.311842 13.9055 0.515612 14 0.730166 14C0.77026 13.9999 0.810357 13.9965 0.849963 13.99L5.23116 13.2598C5.26991 13.2511 5.30781 13.2393 5.34448 13.2244C5.36306 13.218 5.38176 13.215 5.39986 13.2071H5.39998C5.47809 13.1732 5.5496 13.1256 5.61121 13.0668C5.6161 13.0622 5.6227 13.0607 5.62759 13.0559L13.3604 5.32311C13.7699 4.91288 14 4.3569 14 3.77712C14 3.19745 13.7699 2.64148 13.3604 2.23124L13.3603 2.23128ZM1.6187 12.3812L1.94741 10.4081L3.59183 12.0525L1.6187 12.3812ZM12.3279 4.29044L11.6833 4.93504L9.06485 2.31671L9.70945 1.67211V1.67199C9.84588 1.53642 10.0305 1.46027 10.2229 1.46027C10.4153 1.46027 10.5999 1.53642 10.7363 1.67199L12.3279 3.26358C12.4638 3.39989 12.5402 3.58448 12.5402 3.777C12.5402 3.96952 12.4638 4.15412 12.3279 4.29041L12.3279 4.29044Z" fill="#26BAFA" />
                                    </svg>Edit</Link></Button>
                                    <div className='vr mx-1'></div>
                                    <Button className='bg-none border-0 text-custom-grey fs-15 py-0' onClick={() => HandleDeleteReceipe(item?._id)}><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="13" height="14" viewBox="0 0 13 14" fill="none">
                                        <path d="M2.6342 2.67757V2.67778V2.67757ZM7.54307 0L6.1102 0.000508323V0.000711673H6.10949C5.61692 0.000711673 5.21778 0.406291 5.21778 0.906433V0.992348L1.09694 0.99245C0.852 0.99245 0.65332 1.19407 0.65332 1.44288V2.23634C0.65332 2.48513 0.851993 2.68676 1.09694 2.68676H1.62686V2.68707L12.0263 2.68717L12.0264 2.68697V2.68717H12.0325L12.5563 2.68697C12.674 2.68697 12.7867 2.63948 12.8699 2.55509C12.9531 2.4706 12.9999 2.35602 12.9999 2.23655V1.44257C12.9999 1.32311 12.9531 1.20862 12.8699 1.12414C12.7867 1.03965 12.6739 0.992166 12.5563 0.992166L8.43545 0.992268V0.906251C8.43545 0.665892 8.34142 0.435392 8.174 0.265398C8.00667 0.095501 7.77965 3.55961e-05 7.54294 3.55961e-05L7.54307 0ZM7.04057 4.45898C7.20449 4.45918 7.33727 4.5941 7.33727 4.76055L7.33747 11.2794C7.33747 11.3595 7.30613 11.4362 7.25045 11.4927C7.19468 11.5494 7.11917 11.5811 7.04037 11.5814L6.61298 11.5811V11.5814C6.53417 11.5811 6.45867 11.5494 6.40289 11.4927C6.34721 11.4362 6.31587 11.3595 6.31587 11.2794L6.31607 4.76055C6.31607 4.59441 6.44845 4.4596 6.61198 4.4596L6.61238 4.45991L6.61488 4.4593L6.61528 4.4592L7.03977 4.45899L7.04057 4.45898ZM4.37478 4.44749L4.36887 4.45349V4.45369H4.36927C4.52849 4.45369 4.66007 4.5819 4.66559 4.74469L4.88759 11.2597C4.89029 11.3397 4.86165 11.4175 4.80788 11.4759L4.80778 11.476C4.754 11.5345 4.6796 11.5689 4.6009 11.5716L4.17371 11.5866C4.17111 11.5867 4.1661 11.5868 4.1635 11.5868C4.0884 11.5868 4.0159 11.5579 3.96082 11.5056C3.90314 11.4511 3.8693 11.3755 3.86659 11.2956L3.64509 4.78058C3.63938 4.61404 3.76776 4.47443 3.93169 4.46866L4.35846 4.45371V4.45391C4.35997 4.45371 4.36127 4.45361 4.36257 4.45361C4.36437 4.45361 4.36628 4.45371 4.36768 4.45391L4.36808 4.45351L4.37478 4.44749ZM9.28774 4.45349C9.29015 4.45359 9.29265 4.45359 9.29475 4.45369V4.45389L9.72152 4.46864C9.88545 4.47443 10.0138 4.61403 10.0081 4.78056L9.78662 11.2955C9.78392 11.3755 9.75007 11.4511 9.69249 11.5056C9.63742 11.5579 9.56482 11.5867 9.48972 11.5867C9.48711 11.5867 9.48211 11.5866 9.4795 11.5865L9.05232 11.5716V11.5718C8.97361 11.5689 8.89911 11.5344 8.84543 11.4759C8.79166 11.4175 8.76292 11.3396 8.76573 11.2597L8.98763 4.74467C8.99314 4.5822 9.12431 4.45419 9.28312 4.45419L9.28352 4.4544L9.28593 4.45379L9.28683 4.45358V4.45348L9.28774 4.45349ZM1.6631 3.34807L2.08797 11.1005L2.08897 11.1146C2.12562 11.5605 2.15787 12.366 2.69309 12.8064V12.8066C3.19118 13.2162 4.03363 13.2097 4.57137 13.2221L4.58269 13.2222L5.92343 13.2228L5.92263 13.223C5.93124 13.2232 5.93985 13.2234 5.94856 13.2234L5.94876 13.2237L6.81984 13.2231L7.70374 13.2235L7.70394 13.2237C7.71236 13.2235 7.72077 13.2233 7.72908 13.2229H7.72988L7.72918 13.2231L9.06982 13.2224L9.08113 13.2222C9.61888 13.2098 10.4613 13.2164 10.9594 12.8069V12.8066C11.4946 12.3663 11.527 11.5609 11.5636 11.1149L11.5646 11.1008L11.9899 3.34839L1.6631 3.34807Z" fill="#FF6161" />
                                    </svg>Delete</Button>
                                </ButtonGroup>
                            </div>
                        </div>
                    )
                })
            }

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Share Link</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FacebookShareButton url={path}>
                        <FacebookIcon size={32} round />
                    </FacebookShareButton>
                    <TwitterShareButton url={path}>
                        <TwitterIcon size={32} round />
                    </TwitterShareButton>
                    <LinkedinShareButton url={path}>
                        <LinkedinIcon size={32} round />
                    </LinkedinShareButton>
                    <TelegramShareButton url={path}>
                        <TelegramIcon size={32} round />
                    </TelegramShareButton>
                    <WhatsappShareButton url={path}>
                        <WhatsappIcon size={32} round />
                    </WhatsappShareButton>
                </Modal.Body>
                <Modal.Footer>
                </Modal.Footer>
            </Modal>
        </>

    )
}
