import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { BASE_URL } from '../helper';

export default function InsertProduct() {
    
    // STATE: Name, Price, Barcode, AND QUANTITY
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productBarcode, setProductBarcode] = useState("");
    const [productQty, setProductQty] = useState(""); // <--- NEW FIELD
    
    const [error, setError] = useState(false);
    const navigate = useNavigate();

    const addProduct = async (e) => {
        e.preventDefault();

        // VALIDATION
        if (!productName || !productPrice || !productBarcode || !productQty) {
            setError(true);
            return false;
        }

        // CONNECT TO BACKEND
        try {
            const res = await fetch("${BASE_URL}", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    ProductName: productName,
                    ProductPrice: productPrice,
                    ProductBarcode: productBarcode,
                    ProductQty: productQty 
                })
            });

            const data = await res.json();

            if (res.status === 422 || !data) {
                alert("Error: Check inputs");
            } else {
                alert("Product Added Successfully!");
                navigate("/products");
            }
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className='app-container'>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="m-0">NEW_ENTRY</h1>
                <NavLink to="/products" className='neo-button text-decoration-none' style={{backgroundColor: '#ef4444', color: 'white'}}> 
                    <i className="fa-solid fa-xmark me-2"></i> CANCEL
                </NavLink>
            </div>

            <div className='mx-auto' style={{maxWidth: '800px'}}>
                <div className='neo-card'>
                    <form>
                        <div className="row">
                            <div className="mb-4 col-md-6">
                                <label className="form-label fw-bold">PRODUCT_NAME</label>
                                <input type="text" className="form-control border-3 border-black rounded-0 p-3" 
                                    value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Item Name" />
                                {error && !productName && <span className='text-danger fw-bold'>* Required</span>}
                            </div>
                            <div className="mb-4 col-md-6">
                                <label className="form-label fw-bold">BARCODE</label>
                                <input type="number" className="form-control border-3 border-black rounded-0 p-3" 
                                    value={productBarcode} onChange={(e) => setProductBarcode(e.target.value)} placeholder="Barcode" />
                                {error && !productBarcode && <span className='text-danger fw-bold'>* Required</span>}
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-4 col-md-6">
                                <label className="form-label fw-bold">PRICE ($)</label>
                                <input type="number" className="form-control border-3 border-black rounded-0 p-3" 
                                    value={productPrice} onChange={(e) => setProductPrice(e.target.value)} placeholder="0.00" />
                                {error && !productPrice && <span className='text-danger fw-bold'>* Required</span>}
                            </div>
                            
                            {/* QUANTITY INPUT */}
                            <div className="mb-4 col-md-6">
                                <label className="form-label fw-bold text-primary">INITIAL_STOCK (UNITS)</label>
                                <input type="number" className="form-control border-3 border-black rounded-0 p-3 bg-light" 
                                    value={productQty} onChange={(e) => setProductQty(e.target.value)} placeholder="Qty" />
                                {error && !productQty && <span className='text-danger fw-bold'>* Required</span>}
                            </div>
                        </div>

                        <div className='mt-4 text-end'>
                            <button onClick={addProduct} className="neo-button border-0 w-100 py-3">
                                CONFIRM_ENTRY <i className="fa-solid fa-check ms-2"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}