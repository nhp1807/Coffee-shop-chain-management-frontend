import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css";
import ManagerSideBar from "../../components/sidebar/ManagerSideBar";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";
import CheckResponse from "../../api/CheckResponse";

const ExportOrder = () => {
    const [exportOrders, setExportOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();
    const branchID = localStorage.getItem("branchID"); // Lấy branchID từ localStorage

    useEffect(() => {
        if (branchID) {
            loadExportOrders(branchID);
        }
    }, [branchID]);

    const loadExportOrders = async (branchID) => {
        try {
            const result = await axios.get(`${BASE_URL}/api/export-order/get/branch/${branchID}`);
            const orders = result.data.data || [];
            const employeesRes = await axios.get(`${BASE_URL}/api/employee/get/all`);
            const employees = employeesRes.data.data || [];

            const employeeMap = employees.reduce((acc, employee) => {
                acc[employee.employeeID] = employee.name;
                return acc;
            }, {});

            const enrichedOrders = orders.map((order) => ({
                ...order,
                employeeName: employeeMap[order.employeeID] || "Unknown Supplier",
            }));

            // Sắp xếp theo ngày từ mới đến cũ
            enrichedOrders.sort((a, b) => new Date(b.date) - new Date(a.date));

            // Định dạng ngày
            enrichedOrders.forEach((order) => {
                const date = new Date(order.date);
                order.date = date.toLocaleDateString();
            });

            setExportOrders(enrichedOrders);
        } catch (error) {
            console.error("Error loading export orders:", error);
        }
    };

    const handleAddExportOrder = () => {
        // Điều hướng đến trang tạo Export Order mới và truyền branchID hiện tại
        navigate("/manager/export-order/detail/new", { state: { branchID } });
    };

    const handleViewEditOrder = (exportOrderId) => {
        navigate(`/manager/export-order/detail/${exportOrderId}`);
    };

    const filteredExportOrders = exportOrders.filter((exportOrder) =>
        exportOrder.date.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-page">
            <ManagerSideBar />
            <div className="content">
                <div className="header">
                    <h1>Export Orders</h1>
                    <button className="add-item-btn" onClick={handleAddExportOrder}>
                        + Add Export Order
                    </button>
                </div>

                <div className="menu">
                    <h3>Export Order Management</h3>
                    <p>Home > Export Order</p>
                    <div className="search-container">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Search export order..."
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
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredExportOrders.map((order, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{order.date}</td>
                                <td>{order.employeeName || "N/A"}</td>
                                <td>{order.paymentMethod}</td>
                                <td>{order.total} VNĐ</td>
                                <td>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleViewEditOrder(order.exportID)}
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

export default ExportOrder;
