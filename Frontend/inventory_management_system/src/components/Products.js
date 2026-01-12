import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
// 1. Import the PDF libraries
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'

export default function Products() {

    useEffect(() => {
        getProducts();
    }, [])

    const [productData, setProductData] = useState([]);

    const getProducts = async (e) => {
        try {
            const res = await fetch("http://localhost:3001/products", {
                method: "GET",
                headers: { "Content-Type": "application/json" }
            });

            const data = await res.json();

            if (res.status === 201) {
                setProductData(data);
            } else {
                console.log("Something went wrong.");
            }
        } catch (err) { console.log(err); }
    }

    const deleteProduct = async (id) => {
        const response = await fetch(`${BASE_URL}/${id}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" }
        });
        const deletedata = await response.json();
        if (response.status === 422 || !deletedata) {
            console.log("Error");
        } else {
            getProducts();
        }
    }

    // --- NEW: PDF GENERATOR FUNCTION ---
    const generatePDF = () => {
        const doc = new jsPDF();

        // 1. Add Title
        doc.setFontSize(20);
        doc.text("SMART_STOCK_MANAGER REPORT", 14, 22);
        
        // 2. Add Date
        doc.setFontSize(11);
        doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);

        // 3. Define Table Columns
        const tableColumn = ["Item Name", "Price ($)", "Barcode", "Stock Qty", "Status"];
        
        // 4. Define Table Rows
        const tableRows = [];

        productData.forEach(item => {
            const qty = item.ProductQty || 0;
            let status = "IN STOCK";
            if (qty < 20) status = "CRITICAL";
            else if (qty < 50) status = "LOW STOCK";

            const rowData = [
                item.ProductName,
                item.ProductPrice,
                item.ProductBarcode,
                qty,
                status
            ];
            tableRows.push(rowData);
        });

        // 5. Create Table
        autoTable(doc, {
            head: [tableColumn],
            body: tableRows,
            startY: 40,
            theme: 'grid',
            styles: { fontSize: 10, cellPadding: 3 },
            headStyles: { fillColor: [26, 26, 26], textColor: [255, 255, 255] } // Matches your dark theme
        });

        // 6. Save File
        doc.save("Inventory_Report.pdf");
    };

    // Helper for Visual Status
    const getStockStatus = (qty) => {
        if (qty < 20) return { label: 'CRITICAL', class: 'status-critical' };
        if (qty < 50) return { label: 'LOW STOCK', class: 'status-low' };
        return { label: 'IN STOCK', class: 'status-ok' };
    };

    return (
        <div className='app-container'>
            
            {/* Header Section */}
            <div className="d-flex justify-content-between align-items-center mb-5">
                <div className="d-flex align-items-center gap-3">
                    <NavLink to="/" className='neo-button text-decoration-none p-2 px-3' style={{backgroundColor: '#ffffff'}}> 
                        <i className="fa-solid fa-arrow-left"></i>
                    </NavLink>
                    <h1 className="m-0 text-start">INVENTORY_LOGS</h1>
                </div>

                <div className="d-flex gap-3">
                    {/* NEW EXPORT BUTTON */}
                    <button onClick={generatePDF} className='neo-button border-0' style={{backgroundColor: '#c084fc'}}>
                        <i className="fa-solid fa-file-pdf me-2"></i> EXPORT_PDF
                    </button>

                    <NavLink to="/insertproduct" className='neo-button text-decoration-none'> 
                        <i className="fa-solid fa-plus me-2"></i> ADD_ITEM
                    </NavLink>
                </div>
            </div>

            {/* Data Table */}
            <div className="overflow-auto" style={{ maxHeight: "80vh", border: "3px solid black", boxShadow: "8px 8px 0px 0px #000" }}>
                <table className="table mb-0 fs-6" style={{borderCollapse: 'collapse'}}>
                    <thead style={{position: 'sticky', top: 0, zIndex: 100}}>
                        <tr className="tr_color">
                            <th scope="col" className="p-3">ID</th>
                            <th scope="col" className="p-3">ITEM_NAME</th>
                            <th scope="col" className="p-3">PRICE ($)</th>
                            <th scope="col" className="p-3">BARCODE</th>
                            <th scope="col" className="p-3">STOCK_LEVEL</th>
                            <th scope="col" className="p-3">STATUS</th>
                            <th scope="col" className="p-3 text-center">ACTIONS</th>
                        </tr>
                    </thead>
                    <tbody>
                        {productData.map((element, id) => {
                            const mockStock = element.ProductQty || 0; 
                            const status = getStockStatus(mockStock);

                            return (
                                <tr key={id} className="neo-table-row">
                                    <th scope="row" className="p-3 border-end border-black">{id + 1}</th>
                                    <td className="p-3 fw-bold border-end border-black">{element.ProductName}</td>
                                    <td className="p-3 border-end border-black">${element.ProductPrice}</td>
                                    <td className="p-3 border-end border-black font-monospace">{element.ProductBarcode}</td>
                                    
                                    <td className="p-3 border-end border-black" style={{width: '200px'}}>
                                        <div className="d-flex justify-content-between small mb-1">
                                            <span>{mockStock} units</span>
                                            <span>100</span>
                                        </div>
                                        <div className="progress-container">
                                            <div className="progress-fill" style={{
                                                    width: `${Math.min(mockStock, 100)}%`, 
                                                    backgroundColor: mockStock < 20 ? '#ef4444' : (mockStock < 50 ? '#facc15' : '#4ade80')
                                                }}></div>
                                        </div>
                                    </td>

                                    <td className="p-3 border-end border-black">
                                        <span className={`badge-stock ${status.class}`}>{status.label}</span>
                                    </td>

                                    <td className="p-3 text-center">
                                        <NavLink to={`/updateproduct/${element._id}`} className="btn p-0 me-3 text-primary border-0 bg-transparent">
                                            <i className="fa-solid fa-pen-to-square fa-xl"></i>
                                        </NavLink>
                                        <button className="btn p-0 text-danger border-0 bg-transparent" onClick={() => deleteProduct(element._id)}>
                                            <i className="fa-solid fa-trash fa-xl"></i>
                                        </button>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>

            {productData.length === 0 && (
                <div className="neo-card mt-4 text-center">
                    <h3>NO_DATA_FOUND</h3>
                    <p>Database is empty.</p>
                </div>
            )}
        </div>
    )
}