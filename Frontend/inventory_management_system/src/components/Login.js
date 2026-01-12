import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Login() {

    const [inpval, setInpval] = useState({
        email: "",
        password: ""
    });

    const navigate = useNavigate();

    const setdata = (e) => {
        const { name, value } = e.target;
        setInpval(() => {
            return {
                ...inpval,
                [name]: value
            }
        })
    };

    const loginuser = async (e) => {
        e.preventDefault();

        const { email, password } = inpval;

        if (email === "") {
            alert("Email is required!");
        } else if (password === "") {
            alert("Password is required!");
        } else {
            console.log("Attempting to login..."); // Debugging Log

            try {
                // --- FIXED LINE BELOW: Used full URL + /login endpoint ---
                const res = await fetch("https://smartstock-backend-x2vv.onrender.com", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        email, password
                    })
                });

                const data = await res.json();
                console.log("Server Response:", data); // Debugging Log

                if (res.status === 422 || !data) {
                    alert("Invalid Credentials");
                } else {
                    // 1. SUCCESS!
                    alert("Access Granted. Welcome back.");
                    
                    // 2. SAVE THE TOKEN
                    localStorage.setItem("usersdatatoken", data.result.token);

                    // 3. REDIRECT TO PRODUCTS
                    navigate("/products");
                }
            } catch (error) {
                console.error("Login Error:", error);
                alert("Connection Error. Please check console.");
            }
        }
    }

    return (
        <div className="app-container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className='neo-card p-5' style={{ width: '100%', maxWidth: '500px', backgroundColor: '#facc15' }}>
                <h2 className="mb-4 fw-bold text-center">SECURE_LOGIN</h2>
                
                <form>
                    {/* EMAIL */}
                    <div className="mb-3 text-start">
                        <label className="form-label fw-bold">EMAIL_ADDRESS</label>
                        <input type="email" onChange={setdata} value={inpval.email} name="email" 
                            className="form-control border-3 border-black rounded-0 p-2" placeholder="Enter Email" />
                    </div>

                    {/* PASSWORD */}
                    <div className="mb-4 text-start">
                        <label className="form-label fw-bold">ACCESS_CODE</label>
                        <input type="password" onChange={setdata} value={inpval.password} name="password" 
                            className="form-control border-3 border-black rounded-0 p-2" placeholder="Password" />
                    </div>

                    {/* BUTTON */}
                    <button className="neo-button w-100 mb-3" style={{backgroundColor: 'white'}} onClick={loginuser}>
                        AUTHENTICATE <i className="fa-solid fa-lock ms-2"></i>
                    </button>

                    <p className="text-center">Need clearance? <NavLink to="/register" className="fw-bold text-black">REGISTER_NOW</NavLink></p>
                </form>
            </div>
        </div>
    )
}