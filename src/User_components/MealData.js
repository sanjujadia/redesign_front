import React from 'react';
 

export default function MealData(props) {
    return (
        <div>
            <div>
                <span className='d-block border text-center border-bottom-0 text-green rounded-right rounded-top p-1 fw-600'>{props?.date?.format('MMMM D, YYYY')}</span>
                <div className=' p-1 meal-data-list rounded-bottom rounded-left'>
                    <div className='d-flex gap-1 align-items-center justify-content-between'>
                        <p className='text-dark mb-0 fw-600'><span className='grey-dot'></span>Calories</p>
                        <span className='text-muted fw-600'>{props?.data?.calories[1] ? props?.data?.calories[1] : 0}</span>
                    </div>
                    <div className='d-flex gap-1 align-items-center justify-content-between'>
                        <p className='text-dark mb-0 fw-600'><span className='grey-dot'></span>Fat</p>
                        <span className='text-muted fw-600'>0g</span>
                    </div>
                    <div className='d-flex gap-1 align-items-center justify-content-between'>
                        <p className='text-dark mb-0 fw-600'><span className='grey-dot'></span>Carbs</p>
                        <span className='text-muted fw-600'>{props?.data?.carbs[1] ? props?.data?.carbs[1] : 0}g</span>
                    </div>
                    <div className='d-flex gap-1 align-items-center justify-content-between'>
                        <p className='text-dark mb-0 fw-600'><span className='grey-dot'></span>Fiber</p>
                        <span className='text-muted fw-600'>0g</span>
                    </div>
                    <div className='d-flex gap-1 align-items-center justify-content-between'>
                        <p className='text-dark mb-0 fw-600'><span className='grey-dot'></span>Sugar</p>
                        <span className='text-muted fw-600'>0g</span>
                    </div>
                    <div className='d-flex gap-1 align-items-center justify-content-between'>
                        <p className='text-dark mb-0 fw-600'><span className='grey-dot'></span>Protein</p>
                        <span className='text-muted fw-600'>{props?.data?.protein[1] ? props?.data?.protein[1] : 0}g</span>
                    </div>
                    {/*<div className='d-flex gap-1 align-items-center'>
                    <span className='grey-dot'></span>
                    <p className='text-dark mb-0 fw-600'>Sodium</p>
                    <span className='text-muted fw-600'>0g</span>
                </div>
               <div className='d-flex gap-1 align-items-center'>
                    <span className='grey-dot'></span>
                    <p className='text-dark mb-0 fw-600'>Sodium</p>
                    <span className='text-muted fw-600'>0g</span>
                </div>
                <div className='d-flex gap-1 align-items-center'>
                    <span className='grey-dot'></span>
                    <p className='text-dark mb-0 fw-600'>Sodium</p>
                    <span className='text-muted fw-600'>0g</span>
                </div> */}
                </div>
            </div>
        </div>
    )
}
