import React from 'react';
import { Button } from 'react-bootstrap';
import DietImg from '../assets/images/turmeric-cauliflower.png';

export default function DietCard() {
    return (
        <div className='shadow bg-white rounded p-3 diet-card'>
            <div className='d-flex align-items-center justify-content-between'>
                <div>
                    <h6>Breakfast</h6>
                    <span className='green'></span>
                </div>
                <Button className='bg-none border-0 '><svg xmlns="http://www.w3.org/2000/svg" width="5" height="14" viewBox="0 0 5 14" fill="none">
                    <path fillRule="evenodd" clipRule="evenodd" d="M0.977815 11.132C0.977815 10.072 1.85226 9.21267 2.93093 9.21267C4.00961 9.21267 4.88405 10.072 4.88405 11.132C4.88405 12.192 4.00961 13.0513 2.93093 13.0513C1.85226 13.0513 0.977815 12.192 0.977815 11.132ZM0.978039 6.52543C0.978039 5.46543 1.85248 4.60613 2.93116 4.60613C4.00984 4.60613 4.88428 5.46543 4.88428 6.52543C4.88428 7.58543 4.00984 8.44473 2.93116 8.44473C1.85248 8.44473 0.978039 7.58543 0.978039 6.52543ZM2.93116 0.000147652C1.85248 0.000147559 0.978039 0.859448 0.978039 1.91945C0.978039 2.97945 1.85248 3.83875 2.93116 3.83875C4.00984 3.83875 4.88428 2.97945 4.88428 1.91945C4.88428 0.859448 4.00984 0.000147744 2.93116 0.000147652Z" fill="#CCCCCC" />
                </svg></Button>
            </div>
            <div className='diet-card-img'>
                <img src={DietImg} className='w-100 h-100 objectfit-cover' />
            </div>
            <p>Pineapple Turmeric Cauliflower Porridqe</p>
        </div>
    )
}
