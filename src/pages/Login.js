import React, { useState, useEffect } from 'react';
import { Button, Form, Col } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { TailSpin } from 'react-loader-spinner';
import io from 'socket.io-client';
import {Icon} from 'react-icons-kit';
import {eyeOff} from 'react-icons-kit/feather/eyeOff';
import {eye} from 'react-icons-kit/feather/eye'

const socket = io(process.env.REACT_APP_BASE_URL);

const Login = (props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    };

    const handleLogin = async () => {
        if (!email || !password) {
            toast.error('Email or password required');
        } else {
            setLoading(true);

            try {
                const response = await fetch(`${process.env.REACT_APP_BASE_URL}/user/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                }).then((res) => res.json());

                if (response.status) {
                    const user = response.data;
                    socket.emit('setup', user);
                    props.setToken(user?.token);
                    localStorage.setItem('userdata', JSON.stringify(user));
                    navigate('/');
                } else {
                    toast.error(response.message);
                }
            } catch (error) {
                console.error('Login error:', error);
                toast.error('An error occurred during login.');
            } finally {
                setLoading(false);
            }
        }
    };

    const handleVisitor = async () => {
        await fetch(`${process.env.REACT_APP_BASE_URL}/admin/visitor`, {
            method: 'POST',
        });
    };

    useEffect(() => {
        localStorage.removeItem('userdata');
        handleVisitor();
    }, []);

    return (
        <>
            <ToastContainer />
            {loading && (
                <div className="loader-overlay">
                    <TailSpin height={80} width={80} color="#4fa94d" ariaLabel="tail-spin-loading" radius={1} visible={true} />
                </div>
            )}
            <div className='login-grid'>
                <div className='login-welcome'>
                    <div className='d-flex align-items-center h-100 mob_div'>
                        <Col lg={9} className='mx-auto'>
                            <div>
                                <img className='mx-auto d-flex' src={require("../../src/assets/images/Logo.png")} alt="logo" />
                                <p className='text-custom'>Login to Get Started!</p>
                                <div className='login-form mt-5'>
                                    <Form.Group className="mb-3" controlId="formBasicEmail">
                                        <Form.Label className='email_txt'>Email <span className='star'>*</span></Form.Label>
                                        <Form.Control type="email" className='' placeholder="Enter your Email" autoComplete='true' onChange={(e) => setEmail(e.target.value)} />
                                    </Form.Group>

                                    <div className="password-container">
            <Form.Label className='email_txt'>Password <span className='star'>*</span></Form.Label>
            <input
                placeholder="Enter your Password"
                autoComplete="false"
                type={showPassword ? 'text' : 'password'}
                id="formBasicPassword"
                className="form-control password-input"
                onChange={(e) => setPassword(e.target.value)}
            />
            {showPassword ? (
                // Using Icon component for eyeOff
                <Icon style={{ color: '#F36F27' }} icon={eyeOff} className="toggle-password" onClick={togglePassword} />
            ) : (
                // Using Icon component for eye
                <Icon style={{ color: '#F36F27' }} icon={eye} className="toggle-password" onClick={togglePassword} />
            )}
        </div>

                                    <div className="containerr">
                                        <label className="checkbox-label">
                                            <input type="checkbox" id="rememberMe" /> Remember Me
                                        </label>
                                        <span className="remember-me-label">Forgot Password?</span>
                                    </div>

                                    <Button variant="primary" type="submit" className='log_btn d-block text-white w-100 border-0 fs-4 mt-5 fst-normal py-2 custom-shadow text-decoration-none text-center' onClick={handleLogin}>
                                        Login
                                    </Button>
                                    <div className="dont_acc">
                                        <p>Don’t have an account? <Link to="#"><span className='join_btn'>Join Now!</span></Link> </p>
                                    </div>
                                    <div className='mt-sm-5 text-center pt-3'>
                                        <Link to="/" className='text-green d-inline me-5 fst-normal '>Terms & Conditions</Link>
                                        <Link to="/" className='text-green d-inline fst-normal '>Privacy Policy</Link>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </div>
                </div>
                <div className='login-logo'>
                    <img className='login_bg' src={require("../../src/assets/images/login-bg.png")} alt="" />
                </div>
            </div>
        </>
    );
};

export default Login;
