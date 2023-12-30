import React from 'react';

export default function MealMenu(props) {
    return (
        <div className='meal-box mr-2'>
            <div className='meal-item'>
                <span className='orange square'></span>
                <h5 className='text-black mb-0 fw-600 fs-15'>Calories</h5>
                <h5 className='text-muted mb-0 fw-600 fs-15'>{props?.data?.calories[1] ? props?.data?.calories[1] : 0}</h5>
            </div>
            <div className='meal-item'>
                <span className='pink square'></span>
                <h5 className='text-black mb-0 fw-600 fs-15'>Fat</h5>
                <h5 className='text-muted mb-0 fw-600 fs-15'>{props?.data?.fat[1] ? props?.data?.fat[1] : 0}g</h5>
            </div>
            <div className='meal-item'>
                <span className='purple square'></span>
                <h5 className='text-black mb-0 fw-600 fs-15'>Carbs</h5>
                <h5 className='text-muted mb-0 fw-600 fs-15'>{props?.data?.carbs[1] ? props?.data?.carbs[1] : 0}g</h5>
            </div>
            <div className='meal-item'>
                <span className='green square'></span>
                <h5 className='text-black mb-0 fw-600 fs-15'>Fiber</h5>
                <h5 className='text-muted mb-0 fw-600 fs-15'>{props?.data?.fiber[1] ? props?.data?.fiber[1] : 0}g</h5>
            </div>
            <div className='meal-item'>
                <span className='purple square'></span>
                <h5 className='text-black mb-0 fw-600 fs-15'>Sugar</h5>
                <h5 className='text-muted mb-0 fw-600 fs-15'>{props?.data?.sugar[1] ? props?.data?.sugar[1] : 0}g</h5>
            </div>
            <div className='meal-item'>
                <span className='green square'></span>
                <h5 className='text-black mb-0 fw-600 fs-15 '>Protein</h5>
                <h5 className='text-muted mb-0 fw-600 fs-15'>{props?.data?.protein[1] ? props?.data?.protein[1] : 0}g</h5>
            </div>
        </div>
        
    )
}
