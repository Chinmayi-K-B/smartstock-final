import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

export default function InsertProduct() {
    const navigate = useNavigate();

    const [inpval, setINP] = useState({
        ProductName: "",
        ProductBarcode: "",
        ProductPrice: "",
        ProductQty: ""
    });

    const setdata = (e) => {
        const { name, value } = e.target;
        setINP((preval) => {
            return {
                ...preval,
                [name]: value
            }
        })
    };

    const addinpdata = async (e) => {
        e.preventDefault();

        const { ProductName, ProductBarcode, ProductPrice, ProductQty } = inpval;
        
        // 1. DATA VALIDATION
        if (ProductName === "") {
            alert("Product Name is required");
            return;
        }

        console.log("Sending Data...", inpval);

        try {
            // FIXED: Ensure this URL uses standard http protocol
            const res = await fetch("http://localhost:3001/insertproduct", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ProductName, 
                    ProductBarcode, 
                    ProductPrice, 
                    ProductQty
                })
            });

            const data = await res.json();
            console.log("Server Response:", data);

            if (res.status === 422 || !data) {
                alert("Error: Backend rejected the data. Check console.");
                console.log("Error Details:", data);
            } else {
                alert("Data Added Successfully! 🚀");
                navigate("/products");
            }
        } catch (error) {
            console.error("Connection Failed:", error);
            alert("Connection Error: Is the Backend running on port 3001?");
        }
    }

    return (
        <div className="container mt-5">
            <h1 className='fw-bold mb-4'>NEW_ENTRY</h1>
            
            <div className='neo-card p-5' style={{backgroundColor: '#f3f4f6'}}>
                <form>
                    <div className="row">
                        {/* PRODUCT NAME */}
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label className="form-label fw-bold">PRODUCT_NAME</label>
                            <input type="text" value={inpval.ProductName} onChange={setdata} name="ProductName" className="form-control border-2 border-black rounded-0" />
                        </div>

                        {/* BARCODE */}
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label className="form-label fw-bold">BARCODE</label>
                            <input type="number" value={inpval.ProductBarcode} onChange={setdata} name="ProductBarcode" className="form-control border-2 border-black rounded-0" />
                        </div>

                        {/* PRICE */}
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            {/* Correct Visual Symbol */}
                            <label className="form-label fw-bold">PRICE (₹)</label>
                            <input type="number" value={inpval.ProductPrice} onChange={setdata} name="ProductPrice" className="form-control border-2 border-black rounded-0" />
                        </div>

                        {/* QTY */}
                        <div className="mb-3 col-lg-6 col-md-6 col-12">
                            <label className="form-label fw-bold">INITIAL_STOCK (UNITS)</label>
                            <input type="number" value={inpval.ProductQty} onChange={setdata} name="ProductQty" className="form-control border-2 border-black rounded-0" />
                        </div>
                    </div>

                    {/* BUTTONS */}
                    <button type="submit" onClick={addinpdata} className="neo-button w-100 mt-3" style={{backgroundColor: '#facc15', color: 'black'}}>
                        CONFIRM_ENTRY <i className="fa-solid fa-check ms-2"></i>
                    </button>
                    
                    <NavLink to="/products" className="btn btn-danger w-100 mt-3 border-2 border-black rounded-0 fw-bold">
                        CANCEL
                    </NavLink>
                </form>
            </div>
        </div>
    )
}