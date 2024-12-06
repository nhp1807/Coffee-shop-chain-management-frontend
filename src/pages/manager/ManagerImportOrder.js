import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css";
import ManagerSideBar from "../../components/sidebar/ManagerSideBar";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";

const ManagerImportOrder = () => {
    const [importOrders, setImportOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const branchID = localStorage.getItem("branchID"); // Lấy branchID từ localStorage

    useEffect(() => {
        if (branchID) {
            loadImportOrders(branchID);
        }
    }, [branchID]);

    const loadImportOrders = async (branchID) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/import-order/get/branch/${branchID}`);
            const orders = result.data.data || [];
            const suppliersRes = await axios.get(`${BASE_URL}/api/supplier/get/all`);
            const suppliers = suppliersRes.data.data || [];

            const supplierMap = suppliers.reduce((acc, supplier) => {
                acc[supplier.supplierID] = supplier.name;
                return acc;
            }, {});

            const enrichedOrders = orders.map((order) => ({
                ...order,
                supplierName: supplierMap[order.supplierID] || "Unknown Supplier",
            }));

            // Định dạng trạng thái
            enrichedOrders.forEach((order) => {
                order.status = order.status ? "Confirmed" : "Pending";
            });

            // Định dạng ngày
            enrichedOrders.forEach((order) => {
                const date = new Date(order.date);
                order.date = date.toLocaleDateString();
            });

            // Sắp xếp theo ngày từ mới đến cũ
            enrichedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

            setImportOrders(enrichedOrders);
        } catch (error) {
            console.error("Error loading import orders:", error);
        }
    };

    const handleAddImportOrder = () => {
        // Điều hướng đến trang tạo Import Order mới và truyền branchID hiện tại
        navigate("/manager/import-order/detail/new", { state: { branchID } });
    };

    const handleViewEditOrder = (importOrderId) => {
        navigate(`/manager/import-order/detail/${importOrderId}`);
    };

    const filteredImportOrders = importOrders.filter((importOrder) =>
        importOrder.date.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-page">
            <ManagerSideBar />
            <div className="content">
                <div className="header">
                    <h1>Import Orders</h1>
                    <button className="add-item-btn" onClick={handleAddImportOrder}>
                        + Add Import Order
                    </button>
                </div>

                <div className="menu">
                    <h3>Import Order Management</h3>
                    <p>Home > Import Order</p>
                    <div className="search-container">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Search import order..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Supplier</th>
                            <th>Payment</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredImportOrders.map((order, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{order.date}</td>
                                <td>{order.supplierName || "N/A"}</td>
                                <td>{order.paymentMethod}</td>
                                <td>{order.total} VNĐ</td>
                                <td>{order.status || "Pending"}</td>
                                <td>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleViewEditOrder(order.importID)}
                                    >
                                        View/Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagerImportOrder;
