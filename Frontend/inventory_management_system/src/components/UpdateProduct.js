import React, { useEffect, useState } from 'react'
import { NavLink, useParams, useNavigate } from 'react-router-dom';

export default function UpdateProduct() {
    
    // STATE
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productBarcode, setProductBarcode] = useState("");
    const [productQty, setProductQty] = useState(""); // QUANTITY

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const { id } = useParams();

    // 1. GET DATA
    useEffect(() => {
        const getProduct = async () => {
            try {
                const res = await fetch(`http://localhost:3001/products/${id}`);
                const data = await res.json();

                if (res.status === 201) {
                    setProductName(data.ProductName);
                    setProductPrice(data.ProductPrice);
                    setProductBarcode(data.ProductBarcode);
                    setProductQty(data.ProductQty); // Load Qty
                }
            } catch (err) { console.log(err); }
        };
        getProduct();
    }, [id]);

    // 2. UPDATE DATA
    const updateProduct = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${BASE_URL}/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ProductName: productName,
                    ProductPrice: productPrice,
                    ProductBarcode: productBarcode,
                    ProductQty: productQty // Send Qty
                })
            });

            if (response.status === 201) {
                alert("Updated Successfully");
                navigate('/products');
            } else {
                setError("Update Failed");
            }
        } catch (err) {
            setError("Error connecting to server");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className='app-container'>
            <div className="d-flex justify-content-between align-items-center mb-5">
                <h1 className="m-0">UPDATE_ENTRY</h1>
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
                                    value={productName} onChange={(e) => setProductName(e.target.value)} />
                            </div>
                            <div className="mb-4 col-md-6">
                                <label className="form-label fw-bold">BARCODE</label>
                                <input type="number" className="form-control border-3 border-black rounded-0 p-3" 
                                    value={productBarcode} onChange={(e) => setProductBarcode(e.target.value)} />
                            </div>
                        </div>

                        <div className="row">
                            <div className="mb-4 col-md-6">
                                <label className="form-label fw-bold">PRICE ($)</label>
                                <input type="number" className="form-control border-3 border-black rounded-0 p-3" 
                                    value={productPrice} onChange={(e) => setProductPrice(e.target.value)} />
                            </div>
                            <div className="mb-4 col-md-6">
                                <label className="form-label fw-bold text-primary">CURRENT_STOCK</label>
                                <input type="number" className="form-control border-3 border-black rounded-0 p-3 bg-light" 
                                    value={productQty} onChange={(e) => setProductQty(e.target.value)} />
                            </div>
                        </div>

                        <div className='mt-2 text-end'>
                            <button onClick={updateProduct} className="neo-button border-0 w-100 py-3" disabled={loading}>
                                {loading ? 'SAVING...' : 'SAVE_CHANGES'} <i className="fa-solid fa-floppy-disk ms-2"></i>
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}