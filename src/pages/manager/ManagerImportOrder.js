import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css";
import ManagerSideBar from "../../components/sidebar/ManagerSideBar";
import { useNavigate } from "react-router-dom";

const AdminImportOrder = () => {
    const [importOrders, setImportOrders] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadImportOrders();
    }, []);

    const loadImportOrders = async () => {
        try {
            const result = await axios.get("http://localhost:8080/api/import-order/get/all");
            const orders = result.data.data || [];
            const [suppliersRes, branchesRes] = await Promise.all([
                axios.get("http://localhost:8080/api/supplier/get/all"),
                axios.get("http://localhost:8080/api/branch/get/all"),
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
                supplierName: supplierMap[order.supplierId] || "Unknown Supplier",
                branchAddress: branchMap[order.branchId] || "Unknown Address",
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

            console.log("Enriched orders:", enrichedOrders);

            setImportOrders(enrichedOrders);
        } catch (error) {
            console.error("Error loading import orders:", error);
        }
    };

    const handleAddImportOrder = () => {
        navigate("/manager/import-order/detail/new");
    };

    const handleViewEditOrder = (importOrderId) => {
        navigate(`/manager/import-order/detail/${importOrderId}`);
    };

    const filteredImportOrders = importOrders.filter((importOrders) =>
        importOrders.date.toLowerCase().includes(searchTerm.toLowerCase())
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
                            <th>Branch</th>
                            <th>Payment Method</th>
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

export default AdminImportOrder;
