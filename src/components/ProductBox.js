import React from 'react';
import { Button } from 'react-bootstrap';
import ProductImg from '../assets/images/products.png';

export default function ProductBox(props) {
  return (
    <div>
        <div className='product-box'>
            <div className='img-product'>
                <img className='w-100' src={props?.data?.image} />
            </div>
            <span className='d-block bg-green w-100 py-2 text-white text-center rounded custom-shadow fs-6 fw-normal mt-2'>Member Price: ${props?.data?.memberPrice}.00</span>
            <Button className='py-2 text-green bg-white w-100 text-center rounded mt-2 fs-6 fw-normal' style={{ border: '1px solid #85C52E' }} onClick={() => { window.open(props?.data?.link, '_blank' )}}>View Product</Button>
        </div>
    </div>
  )
}
