import React, { useContext, useState } from 'react';
import './LoginPopup.css';
import { assets } from '../../assets/assets';
import { StoreContext } from '../../Context/StoreContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginPopup = ({ setShowLogin }) => {
    const { setToken, url, loadCartData } = useContext(StoreContext);
    const [currState, setCurrState] = useState("Sign Up");
    const [data, setData] = useState({
        name: "",
        email: "",
        password: "",
        role: "" 
    });

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
    }

    const onLogin = async (e) => {
        e.preventDefault();
        
        let new_url = url;
        if (currState === "Login") {
            new_url += "/api/user/login";
        } else {
            new_url += "/api/user/register";
        }

        try {
            const response = await axios.post(new_url, data);
            console.log('Response Data:', response.data);
            if (response.data.success) {
                setToken(response.data.token);
                localStorage.setItem("token", response.data.token);
                localStorage.setItem("role", response.data.role);
                localStorage.setItem("restaurantname", response.data.name);
                localStorage.setItem("email", data.email);  // Guarda el email del formulario

                // Añade el email al response.data
                const updatedResponseData = { ...response.data, email: data.email };
                
                loadCartData({ token: response.data.token });
                setShowLogin(false);
                toast.success(`Response Data: ${JSON.stringify(updatedResponseData, null, 2)}`);

            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error occurred during login");
        }
        window.location.reload();
    }

    const onForgotPassword = async () => {
        if (!data.email) {
            toast.error("Please enter your email for password recovery");
            return;
        }

        try {
            const response = await axios.post(`${url}/api/user/forgotpassword`, { email: data.email });
            if (response.data.success) {
                toast.success("Password reset link sent to your email");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error(error);
            toast.error("Error sending password reset link");
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" && 
                        <>
                            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required />
                            <select name='role' onChange={onChangeHandler} value={data.role} required>
                                <option value="" disabled>Vous êtes</option>
                                <option value="user">User</option>
                                <option value="manager">Manager</option>
                                <option value="deliverer">Deliverer</option>
                                <option value="restaurateur">Restaurateur</option>
                                <option value="servicetechnique">servicetechnique</option>
                                <option value="serviceCommercial">serviceCommercial</option>
                            </select>
                        </>
                    }
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' required />
                    <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='Password' required />
                </div>
                <button>{currState === "Login" ? "Login" : "Create account"}</button>
                <div className="login-popup-condition">
                    <input type="checkbox" name="" id="" required/>
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
                {currState === "Login" && 
                    <p>Forgot password? <span onClick={onForgotPassword}>Click here</span></p>
                }
            </form>
        </div>
    );
}

export default LoginPopup;
