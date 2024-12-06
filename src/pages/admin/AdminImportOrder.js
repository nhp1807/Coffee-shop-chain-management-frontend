import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css";
import AdminSideBar from "../../components/sidebar/AdminSideBar";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";

const AdminImportOrder = () => {
    const [importOrders, setImportOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadImportOrders();
    }, []);

    const loadImportOrders = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/api/import-order/get/all`);
            const orders = result.data.data || [];
            const [suppliersRes, branchesRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/supplier/get/all`),
                axios.get(`${BASE_URL}/api/branch/get/all`),
            ]);
            const suppliers = suppliersRes.data.data || [];
            const branches = branchesRes.data.data || [];

            const supplierMap = suppliers.reduce((acc, supplier) => {
                acc[supplier.supplierID] = supplier.name;
                return acc;
            }, {});

            const branchMap = branches.reduce((acc, branch) => {
                acc[branch.branchID] = branch.address;
                return acc;
            }, {});

            const enrichedOrders = orders.map((order) => ({
                ...order,
                supplierName: supplierMap[order.supplierID] || "Unknown Supplier",
                branchAddress: branchMap[order.branchID] || "Unknown Address",
            }));

            // if status true then show "Confirmed" else "Pending"
            enrichedOrders.forEach((order) => {
                if (order.status) {
                    order.status = "Confirmed";
                } else {
                    order.status = "Pending";
                }
            });

            // format date
            enrichedOrders.forEach((order) => {
                const date = new Date(order.date);
                order.date = date.toLocaleDateString();
            });

            setImportOrders(enrichedOrders);
        } catch (error) {
            console.error("Error loading import orders:", error);
        }
    };

    const handleAddImportOrder = () => {
        navigate("/admin/import-order/detail/new");
    };

    const handleViewEditOrder = (importOrderID) => {
        navigate(`/admin/import-order/detail/${importOrderID}`);
    };

    const handleConfirmOrder = async (importOrderID) => {
        try {
            const response = await axios.post(`${BASE_URL}/api/import-order/confirm/${importOrderID}`);
            if (response.status === 200) {
                alert("Order confirmed successfully!");
                loadImportOrders(); // Reload orders after confirming
            } else {
                alert("Failed to confirm order.");
            }
        } catch (error) {
            console.error("Error confirming order:", error);
            alert("An error occurred while confirming the order.");
        }
    };

    const filteredImportOrders = importOrders.filter((importOrders) =>
        importOrders.date.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-page">
            <AdminSideBar />
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
                            <th>Branch</th>
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
                                <td>{order.branchAddress || "N/A"}</td>
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
                                    <button
                                        className="action-btn confirm-btn"
                                        onClick={() => handleConfirmOrder(order.importID)}
                                    >
                                        Confirm
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

export default AdminImportOrder;
