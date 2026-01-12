import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'

export default function Register() {

    const [inpval, setInpval] = useState({
        name: "",
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

    const addinpdata = async (e) => {
        e.preventDefault();

        const { name, email, password } = inpval;

        if (name === "") {
            alert("Name is required!");
        } else if (email === "") {
            alert("Email is required!");
        } else if (password === "") {
            alert("Password is required!");
        } else {
            const res = await fetch("${BASE_URL}/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name, email, password
                })
            });

            const data = await res.json();

            if (res.status === 422 || !data) {
                alert("Email already exists or Invalid Details");
            } else {
                alert("Registration Successful!");
                navigate("/login");
            }
        }
    }

    return (
        <div className="app-container d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
            <div className='neo-card p-5' style={{ width: '100%', maxWidth: '500px' }}>
                <h2 className="mb-4 fw-bold text-center">NEW_USER_PROTOCOL</h2>
                
                <form>
                    {/* NAME */}
                    <div className="mb-3 text-start">
                        <label className="form-label fw-bold">OPERATOR_NAME</label>
                        <input type="text" onChange={setdata} value={inpval.name} name="name" 
                            className="form-control border-3 border-black rounded-0 p-2" placeholder="Enter Name" />
                    </div>

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
                    <button className="neo-button w-100 mb-3" onClick={addinpdata}>
                        INITIALIZE_USER
                    </button>

                    <p className="text-center">Already have access? <NavLink to="/login" className="fw-bold text-black">LOGIN_HERE</NavLink></p>
                </form>
            </div>
        </div>
    )
}