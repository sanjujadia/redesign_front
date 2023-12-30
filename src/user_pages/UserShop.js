import React, { useState, useEffect } from 'react';
//import UserSidebar from '../User_components/UserSidebar';
//import TopBar from '../components/TopBar';
import { Col, Row } from 'react-bootstrap';
//import TableImg from '../assets/images/table-img.png';
import UserProductBox from '../User_components/UserProductBox';
import { useAuth } from '../context/AuthProvider';
import { useNavigate } from 'react-router-dom';

export default function UserShop() {
    const navigate = useNavigate()
    const { user, isAuthenticated } = useAuth()
    const [products, setProducts] = useState([])
    const [announcement, setAnnouncement] = useState()

    const fetchProducts = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getProducts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())

        if (res.status) {
            setProducts(res?.data)
        }
    }

    const fetchAnnouncement = async () => {
        const res = await fetch(`${process.env.REACT_APP_BASE_URL}/user/getAnnouncement`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())

        if (res.status) {
            setAnnouncement(res?.data)
        }
    }

    useEffect(() => {
        if (isAuthenticated) {
            fetchProducts()
            fetchAnnouncement()
        } else {
            navigate('/')
        }
    }, [user])

    return (
        <div>
            <div className='mt-1 main-content'>
                <div className='py-3 px-5'>
                    <span className='text-white text-center py-3 mb-0 fw-600 fs-17 bg-green d-block w-100 custom-shadow border-0 px-3 rounded-0'>{announcement?.announcement}</span>
                </div>
                <div className='p-xl-5 p-3 pt-xl-3'>
                    <Row>
                        <Col lg={12}>
                            <div className='product-grid'>
                                {products && products.length > 0
                                    ?
                                    products.map((data, i) => (
                                        <UserProductBox data={data} />
                                    ))
                                    :
                                    <></>
                                }

                                {/* <UserProductBox />
                                        <UserProductBox />
                                        <UserProductBox />
                                        <UserProductBox />
                                        <UserProductBox />
                                        <UserProductBox />
                                        <UserProductBox />
                                        <UserProductBox />
                                        <UserProductBox />
                                        <UserProductBox />
                                        <UserProductBox />
                                        <UserProductBox />
                                        <UserProductBox />
                                        <UserProductBox /> */}
                            </div>
                        </Col>
                    </Row>
                </div>
            </div>
        </div>
    )
}
