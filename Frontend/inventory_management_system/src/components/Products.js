import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';

export default function Products() {

    const [productData, setProductData] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. FETCH DATA
    const getProducts = async () => {
        try {
            const res = await fetch("http://localhost:3001/products", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();

            if (res.status === 201) {
                setProductData(data);
                setLoading(false);
            } else {
                console.log("Something went wrong fetching data.");
            }
        } catch (err) {
            console.log("Connection Error:", err);
            setLoading(false);
        }
    }

    // 2. DELETE PRODUCT
    const deleteProduct = async (id) => {
        // Confirmation Dialog
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            // FIXED: Changed ₹{id} back to ${id} so the ID is inserted correctly
            const response = await fetch(`http://localhost:3001/deleteproduct/${id}`, {
                method: "DELETE",
                headers: { "Content-Type": "application/json" }
            });

            const deletedata = await response.json();

            if (response.status === 422 || !deletedata) {
                alert("Error deleting product.");
            } else {
                // Refresh data immediately
                getProducts(); 
                alert("Product deleted successfully.");
            }
        } catch (error) {
            alert("Connection error while deleting.");
        }
    }

    // Load data on page load
    useEffect(() => {
        getProducts();
    }, []);

    // Helper for Status Badge Color
    const getStockStatus = (qty) => {
        if (qty < 20) return { label: 'CRITICAL', class: 'status-critical' };
        if (qty < 50) return { label: 'LOW STOCK', class: 'status-low' };
        return { label: 'IN STOCK', class: 'status-ok' };
    };

    return (
        <div className='app-container'>
            
            {/* HEADER */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div className="d-flex align-items-center gap-3">
                    <NavLink to="/" className='neo-button text-decoration-none p-2 px-3' style={{backgroundColor: '#ffffff'}}> 
                        <i className="fa-solid fa-arrow-left"></i>
                    </NavLink>
                    <h1 className="m-0 text-start">INVENTORY_LOGS</h1>
                </div>

                <NavLink to="/insertproduct" className='neo-button text-decoration-none'> 
                    <i className="fa-solid fa-plus me-2"></i> ADD_ITEM
                </NavLink>
            </div>

            {/* TABLE */}
            <div className="table-responsive neo-card p-0">
                <table className="table table-hover mb-0 fs-6">
                    <thead className="table-dark">
                        <tr>
                            <th scope="col" className="p-3">ID</th>
                            <th scope="col" className="p-3">ITEM_NAME</th>
                            {/* Visual Symbol: Correct (₹) */}
                            <th scope="col" className="p-3">PRICE (₹)</th>
                            <th scope="col" className="p-3">BARCODE</th>
                            <th scope="col" className="p-3">STOCK_LEVEL</th>
                            <th scope="col" className="p-3">STATUS</th>
                            <th scope="col" className="p-3 text-center">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productData.length > 0 ? productData.map((element, id) => {
                            const mockStock = element.ProductQty || 0; 
                            const status = getStockStatus(mockStock);

                            return (
                                <tr key={id}>
                                    <th scope="row" className="p-3 align-middle">{id + 1}</th>
                                    <td className="p-3 fw-bold align-middle">{element.ProductName}</td>
                                    {/* Visual Symbol: Correct (₹) */}
                                    <td className="p-3 align-middle">₹{element.ProductPrice}</td>
                                    <td className="p-3 font-monospace align-middle">{element.ProductBarcode}</td>
                                    
                                    {/* Visual Progress Bar */}
                                    <td className="p-3 align-middle" style={{width: '200px'}}>
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span>{mockStock} units</span>
                                        </div>
                                        <div className="progress" style={{height: '10px', border: '1px solid black'}}>
                                            {/* FIXED: Changed ₹{} back to ${} for Math logic */}
                                            <div className="progress-bar" role="progressbar" 
                                                style={{
                                                    width: `${Math.min(mockStock, 100)}%`, 
                                                    backgroundColor: mockStock < 20 ? '#ef4444' : (mockStock < 50 ? '#facc15' : '#4ade80')
                                                }}
                                            ></div>
                                        </div>
                                    </td>

                                    <td className="p-3 align-middle">
                                        <span className={`badge rounded-0 border border-dark text-dark ${status.class === 'status-critical' ? 'bg-danger text-white' : (status.class === 'status-low' ? 'bg-warning' : 'bg-success')}`}>
                                            {status.label}
                                        </span>
                                    </td>

                                    <td className="p-3 text-center align-middle">
                                        {/* FIXED: Changed ₹{element._id} back to ${element._id} for the link */}
                                        <NavLink to={`/updateproduct/${element._id}`} className="btn btn-sm btn-outline-primary rounded-0 me-2 border-2 fw-bold">
                                            <i className="fa-solid fa-pen"></i>
                                        </NavLink>
                                        <button className="btn btn-sm btn-outline-danger rounded-0 border-2 fw-bold" onClick={() => deleteProduct(element._id)}>
                                            <i className="fa-solid fa-trash"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        }) : (
                            <tr>
                                <td colSpan="7" className="text-center p-5">
                                    {loading ? <h5>LOADING DATA...</h5> : (
                                        <>
                                            <h5>NO DATA FOUND</h5>
                                            <p className="text-muted">Database is empty or backend is disconnected.</p>
                                        </>
                                    )}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}