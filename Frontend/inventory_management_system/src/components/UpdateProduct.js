import React, { useEffect, useState } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';

export default function UpdateProduct() {
    
    // STATE
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productBarcode, setProductBarcode] = useState("");
    const [productQty, setProductQty] = useState("");

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const { id } = useParams();

    // 1. GET DATA (Pre-fill the form)
    useEffect(() => {
        const getProduct = async () => {
            try {
                // FIXED: Changed ₹{id} back to ${id}
                // JavaScript needs ${} to insert the variable value
                const res = await fetch(`http://localhost:3001/products/${id}`);
                const data = await res.json();

                if (res.status === 201) {
                    setProductName(data.ProductName);
                    setProductPrice(data.ProductPrice);
                    setProductBarcode(data.ProductBarcode);
                    setProductQty(data.ProductQty);
                } else {
                    alert("Product not found.");
                }
            } catch (err) {
                console.log("Error fetching product:", err);
            }
        };
        getProduct();
    }, [id]);

    // 2. UPDATE DATA
    const updateProduct = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // FIXED: Changed ₹{id} back to ${id}
            const response = await fetch(`http://localhost:3001/updateproduct/${id}`, {
                method: "PATCH", 
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ProductName: productName,
                    ProductPrice: productPrice,
                    ProductBarcode: productBarcode,
                    ProductQty: productQty
                })
            });

            const data = await response.json();

            if (response.status === 201 || response.status === 200) {
                alert("Updated Successfully! 🚀");
                navigate('/products');
            } else {
                alert("Update Failed. Please check inputs.");
            }
        } catch (err) {
            console.log("Update Error:", err);
            alert("Error connecting to server.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='container mt-5'>
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h1 className="fw-bold">UPDATE_ENTRY</h1>
                <NavLink to="/products" className='btn btn-danger rounded-0 border-2 border-black fw-bold'> 
                    <i className="fa-solid fa-xmark me-2"></i> CANCEL
                </NavLink>
            </div>

            <div className='mx-auto' style={{maxWidth: '800px'}}>
                <div className='neo-card p-5' style={{backgroundColor: '#fff'}}>
                    <form>
                        <div className="row">
                            <div className="mb-4 col-md-6">
                                <label className="form-label fw-bold">PRODUCT_NAME</label>
                                <input type="text" className="form-control border-2 border-black rounded-0 p-3" 
                                    value={productName} onChange={(e) => setProductName(e.target.value)} />
                            </div>
                            <div className="mb-4 col-md-6">
                                <label className="form-label fw-bold">BARCODE</label>
                                <input type="number" className="form-control border-2 border-black rounded-0 p-3" 
                                    value={productBarcode} onChange={(e) => setProductBarcode(e.target.value)} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-4 col-md-6">
                                {/* This ₹ is correct because it is just text on the screen */}
                                <label className="form-label fw-bold">PRICE (₹)</label>
                                <input type="number" className="form-control border-2 border-black rounded-0 p-3" 
                                    value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
                            </div>
                            <div className="mb-4 col-md-6">
                                <label className="form-label fw-bold text-primary">CURRENT_STOCK</label>
                                <input type="number" className="form-control border-2 border-black rounded-0 p-3 bg-light" 
                                    value={productQty} onChange={(e) => setProductQty(e.target.value)} />
                            </div>
                        </div>

                        <button onClick={updateProduct} className="neo-button w-100 py-3 mt-3" style={{backgroundColor: '#facc15', color: 'black'}} disabled={loading}>
                            {loading ? 'SAVING...' : 'SAVE_CHANGES'} <i className="fa-solid fa-floppy-disk ms-2"></i>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}