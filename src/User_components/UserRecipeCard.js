import React from 'react';
import { Button, ButtonGroup } from 'react-bootstrap';
import SladPic from '../assets/images/greek-salad-food 2.png';
import { Link } from 'react-router-dom';

export default function UserRecipeCard(props) {

    const recipeId = (url) => {
        // Split the URL by '#'
        const parts = url.split('#');

        // Get the last part after the '#' symbol
        return parts[parts.length - 1];
    }
    return (
        <div className='recipe-box'>
            <div className='recipe-card-img'>
                <img src={props?.data?.recipe?.image} className='w-100 h-100 object-fit-cover' />
            </div>
            <div className='recipe-card-body'>
                <Link
                    to={`/view-recipe/${recipeId(props?.data?.recipe?.uri)}`}
                    className='text-dark mb-2 fw-600 fs-5 text-decoration-none d-block'
                    style={{ minHeight: '4em', lineHeight: '1.5' }}
                >
                    {props?.data?.recipe?.label}
                </Link>

                <div className='d-flex align-items-center mb-2'>
                    <p className='text-custom-grey fw-normal fs-17 me-3'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="21" height="21" viewBox="0 0 21 21" fill="none">
                        <path d="M10.7161 0C5.17345 0 0.666992 4.57565 0.666992 10.2034C0.666992 15.8312 5.17345 20.4069 10.7161 20.4069C16.2588 20.4069 20.7653 15.8312 20.7653 10.2034C20.7653 4.57565 16.2588 0 10.7161 0ZM15.2226 12.0335H9.36447V4.48397H11.167V9.97443H15.2228L15.2226 12.0335Z" fill="#86C52F" />
                    </svg>{props?.data?.recipe?.totalTime} minutes</p>
                    <p className='text-custom-grey fw-normal fs-17 me-3'>
                        <svg className='me-1' xmlns="http://www.w3.org/2000/svg" width="20" height="19" viewBox="0 0 20 19" fill="none">
                            <path fillRule="evenodd" clipRule="evenodd" d="M18.8859 7.22865C18.6167 6.90192 18.1382 6.8564 17.8142 7.12979L13.4622 10.8119H2.32854C1.90861 10.8119 1.56787 11.1579 1.56787 11.5841V15.1414C1.56787 17.0126 3.06788 18.5348 4.91074 18.5348H14.9592C16.8021 18.5348 18.3012 17.0126 18.3012 15.1414V11.5841C18.3012 11.1579 17.9613 10.8119 17.5407 10.8119H15.8392L18.7888 8.31586C19.1113 8.04328 19.1555 7.55603 18.8862 7.2285" fill="#FF964A" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M6.13206 8.49536C6.32824 8.49536 6.52296 8.41819 6.66978 8.26911L9.71211 5.17992C9.98601 4.90195 10.0111 4.4586 9.76849 4.15127L6.72602 0.289881C6.59829 0.12854 6.41193 0.0249757 6.20888 0.00410004C6.00727 -0.0174479 5.80114 0.0466581 5.64451 0.179445L1.08091 4.04084C0.896935 4.19679 0.795735 4.43167 0.808733 4.6749C0.822394 4.91812 0.947073 5.14141 1.14643 5.27648L5.71003 8.36567C5.83856 8.45294 5.98618 8.49536 6.13223 8.49536" fill="#FF964A" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M10.6956 7.72327C11.1154 7.72327 11.4561 7.37729 11.4561 6.95092C11.4561 6.52468 11.1154 6.17871 10.6956 6.17871C10.2758 6.17871 9.93506 6.52468 9.93506 6.95092C9.93506 7.37729 10.2758 7.72327 10.6956 7.72327Z" fill="#FF964A" />
                            <path fillRule="evenodd" clipRule="evenodd" d="M9.17411 8.49536C8.75432 8.49536 8.41357 8.84134 8.41357 9.26771C8.41357 9.69395 8.75432 10.0399 9.17411 10.0399C9.59403 10.0399 9.93478 9.69395 9.93478 9.26771C9.93478 8.84134 9.59403 8.49536 9.17411 8.49536Z" fill="#FF964A" />
                        </svg>
                        {props?.data?.recipe?.ingredients?.length} ingredients
                    </p>
                </div>
                {/* <hr /> */}
                {/* <div className='recipe-card-footer'>
                    <Button className='bg-none border-0 text-custom-grey fs-15 py-0'><svg className='me-2' xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 14 14" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.46576 3.40537L6.08646 4.643C5.44589 3.94093 4.52397 3.49984 3.49985 3.49984C1.56788 3.49984 0 5.06795 0 6.99995C0 8.93196 1.568 10.5001 3.49985 10.5001C4.26216 10.5001 4.96777 10.2557 5.54258 9.84204L7.79168 11.2848C7.73215 11.4793 7.69992 11.6858 7.69992 11.9C7.69992 13.0592 8.6407 14 9.79995 14C10.9592 14 11.9 13.0592 11.9 11.9C11.9 10.7408 10.9592 9.79998 9.79995 9.79998C9.36599 9.79998 8.96276 9.93159 8.62816 10.1578L6.50434 8.79558C6.81866 8.27058 6.99995 7.65594 6.99995 7.00002C6.99995 6.59606 6.93139 6.20828 6.8053 5.84711L9.10138 4.65284C9.61445 5.23316 10.3649 5.59994 11.2 5.59994C12.7456 5.59994 14 4.34558 14 2.79997C14 1.25436 12.7456 0 11.2 0C9.65438 0 8.4 1.25436 8.4 2.79997C8.4 3.00786 8.42238 3.21013 8.46574 3.40549L8.46576 3.40537Z" fill="#86C52F" />
                </svg>Share</Button>
            
                </div> */}
            </div>
        </div>
    )
}
