import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ManagerSideBar from "../../components/sidebar/ManagerSideBar"; // Sidebar
import "../../assets/styles/AdminObject.css"; // CSS Style
import "../../assets/styles/Suggestion.css";
import { Modal } from "react-bootstrap";
import BASE_URL from "../../config";
import CheckResponse from "../../api/CheckResponse";

const ImportOrderDetail = () => {
    const { importOrderID } = useParams();
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDetail, setEditingDetail] = useState(null);

    const [importOrder, setImportOrder] = useState({
        importID: "",
        total: 0,
        paymentMethod: "cash",
        date: "",
        status: "",
        supplierID: "",
        branchID: "",
        detailImportOrders: [],
    });
    const [suppliers, setSuppliers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [materials, setMaterials] = useState([]); // Dữ liệu nguyên liệu (Material)
    const [newDetail, setNewDetail] = useState({
        name: "", // Đảm bảo có giá trị khởi tạo
        quantity: 0,
        price: 0,
        description: "",
    });

    const [showModal, setShowModal] = useState(false); // Trạng thái của modal
    const [filteredMaterials, setFilteredMaterials] = useState([]); // Lưu trữ danh sách vật liệu lọc được

    useEffect(() => {
        const loadData = async () => {
            try {
                await loadSuppliersAndBranches();
                await loadMaterials();

                // Lấy branchID từ localStorage
                const storedBranchID = localStorage.getItem("branchID");
                if (storedBranchID) {
                    setImportOrder((prevOrder) => ({
                        ...prevOrder,
                        branchID: storedBranchID, // Cập nhật branchID từ localStorage
                    }));
                }

                if (importOrderID !== "new") {
                    await loadImportOrder(importOrderID);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };
        loadData();
    }, [importOrderID]);

    const loadSuppliersAndBranches = async () => {
        try {
            const [suppliersRes, branchesRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/supplier/get/all`),
                axios.get(`${BASE_URL}/api/branch/get/all`),
            ]);

            setSuppliers(suppliersRes.data.data || []);
            setBranches(branchesRes.data.data || []);
        } catch (error) {
            console.error("Error loading suppliers or branches:", error);
        }
    };

    const loadMaterials = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/material/get/all`);
            setMaterials(response.data.data || []);
        } catch (error) {
            console.error("Error loading materials:", error);
        }
    };

    const loadImportOrder = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/import-order/get/${id}`);
            const date = new Date(response.data.data.date);
            response.data.data.date = date.toLocaleDateString();

            // Get supplier and branch name
            const [supplierRes, branchRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/supplier/get/${response.data.data.supplierID}`),
                axios.get(`${BASE_URL}/api/branch/get/${response.data.data.branchID}`),
            ]);

            response.data.data.supplierName = supplierRes.data.data.name;
            response.data.data.branchAddress = branchRes.data.data.address;
            response.data.data.supplierID = supplierRes.data.data.supplierID;
            response.data.data.branchID = branchRes.data.data.branchID;


            setImportOrder(response.data.data);
        } catch (error) {
            console.error("Error loading import order:", error);
        }
    };

    const handleSave = async () => {
        try {
            if (importOrderID === "new") {
                await axios.post(`${BASE_URL}/api/import-order/create`, importOrder);
            }
            navigate("/manager/import-order");
        } catch (error) {
            console.error("Error saving import order:", error);
        }
    };

    const addDetail = async () => {
        if (!newDetail.name || !newDetail.quantity || !newDetail.price) {
            alert("Please fill in all fields before adding detail.");
            return;
        }

        try {
            const response = await axios.put(`${BASE_URL}/api/import-order-detail/add/${importOrderID}`, newDetail);
            CheckResponse(response);
            await loadImportOrder(importOrderID);

            setShowModal(false);
            setNewDetail({
                name: "",
                quantity: 0,
                price: 0,
                description: "",
            });
        } catch (error) {
            console.error("Error adding detail:", error);
        }
    };

    const handleDeleteDetail = async (materialID) => {
        try {

            const response = await axios.delete(`${BASE_URL}/api/import-order-detail/delete/${importOrderID}/${materialID}`);
            CheckResponse(response);

            // Cập nhật lại danh sách chi tiết sau khi xóa
            setImportOrder((prevOrder) => ({
                ...prevOrder,
                detailImportOrders: prevOrder.detailImportOrders.filter(
                    (detail) => detail.materialID !== materialID
                ),
            }));
            loadImportOrder(importOrderID);
        } catch (error) {
            console.error("Error deleting detail:", error);
        }
    };

    const handleEditDetail = async (materialID) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/import-order-detail/get/${importOrderID}/${materialID}`);
            setEditingDetail(response.data.data);
            setShowEditModal(true);
        } catch (error) {
            console.error("Error fetching detail:", error);
        }
    }; 
    
    const updateDetail = async () => {
        try {
            await axios.put(`${BASE_URL}/api/import-order-detail/update/${importOrderID}/${editingDetail.materialID}`, editingDetail);
            setShowEditModal(false);
    
            // Cập nhật lại danh sách chi tiết sau khi chỉnh sửa
            await loadImportOrder(importOrderID);
        } catch (error) {
            console.error("Error updating detail:", error);
        }
    };    

    const handleMaterialSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setNewDetail({ ...newDetail, name: e.target.value });
        setFilteredMaterials(
            materials.filter((material) => material.name && material.name.toLowerCase().includes(searchTerm))
        );
    };


    const handleMaterialSelect = (name) => {
        if (!name) {
            console.error("Material name is required!");
            return;
        }
        setNewDetail({
            ...newDetail,
            name: name,
        });
        setFilteredMaterials([]);  // Đóng danh sách gợi ý khi đã chọn
    };


    return (
        <div className="admin-page">
            <ManagerSideBar />
            <div className="content">
                <div className="header">
                    <h1>{importOrderID === "new" ? "Add New Import Order" : "Edit Import Order"}</h1>
                </div>

                <div className="menu">
                    <h3>Import Order Detail</h3>
                    <p>Home > Import Order > {importOrderID === "new" ? "New" : "Edit"}</p>
                </div>

                {/* Form Supplier and Branch */}
                <div className="form-group">
                    <label>Supplier</label>
                    <select
                        className="form-control"
                        value={importOrder.supplierID || ""}
                        onChange={(e) =>
                            setImportOrder({ ...importOrder, supplierID: e.target.value })
                        }
                    >
                        <option value="">-- Select Supplier --</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.supplierID} value={supplier.supplierID}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Branch</label>
                    <select
                        className="form-control"
                        value={importOrder.branchID || ""}
                        onChange={(e) =>
                            setImportOrder({ ...importOrder, branchID: e.target.value })
                        }
                    >
                        <option value="">-- Select Branch --</option>
                        {branches.map((branch) => (
                            <option key={branch.branchID} value={branch.branchID}>
                                {branch.address}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Payment Method</label>
                    <select
                        className="form-control"
                        value={importOrder.paymentMethod}
                        onChange={(e) =>
                            setImportOrder({ ...importOrder, paymentMethod: e.target.value })
                        }
                    >
                        <option value="cash">Cash</option>
                        <option value="bank">Bank</option>
                    </select>
                </div>
                <div className="form-group">
                    <label>Total</label>
                    <input type="number" className="form-control" value={importOrder.total} readOnly />
                </div>

                {/* Table to display details */}
                <h3>Details</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Material</th>
                            <th>Quantity</th>
                            <th>Price</th>
                            <th>Description</th>
                            <th>Action</th> {/* Cột Action để chứa nút xóa */}
                        </tr>
                    </thead>
                    <tbody>
                        {importOrder?.detailImportOrders?.length > 0 ? (
                            importOrder.detailImportOrders.map((detail, index) => (
                                <tr key={index}>
                                    <td>{detail?.name || "Unknown Material"}</td> {/* Kiểm tra xem detail.name có tồn tại không */}
                                    <td>{detail?.quantity}</td>
                                    <td>{detail?.price}</td>
                                    <td>{detail?.description}</td>
                                    <td>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleEditDetail(detail.materialID)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleDeleteDetail(detail.materialID)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: "center" }}>
                                    No details available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <button className="action-btn" onClick={() => setShowModal(true)}>
                    Add Detail
                </button>
                <button className="action-btn" onClick={handleSave}>
                    Save
                </button>

                {/* Modal to Add Detail */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Detail</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group" style={{ position: 'relative' }}>  {/* Thêm style relative cho form-group */}
                            <label>Material</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newDetail.name}
                                onChange={handleMaterialSearch}
                                placeholder="Enter material name"
                            />
                            {/* Hiển thị danh sách gợi ý nếu có */}
                            {filteredMaterials.length > 0 && (
                                <ul className="suggestions-list">
                                    {filteredMaterials.map((material) => (
                                        <li
                                            key={material.materialID}
                                            onClick={() => handleMaterialSelect(material.name)}
                                        >
                                            {material.name}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                value={newDetail.quantity}
                                onChange={(e) =>
                                    setNewDetail({ ...newDetail, quantity: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                className="form-control"
                                value={newDetail.price}
                                onChange={(e) =>
                                    setNewDetail({ ...newDetail, price: e.target.value })
                                }
                            />
                        </div>

                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                value={newDetail.description}
                                onChange={(e) =>
                                    setNewDetail({ ...newDetail, description: e.target.value })
                                }
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="action-btn" onClick={() => setShowModal(false)}>
                            Close
                        </button>
                        <button className="action-btn" onClick={addDetail}>
                            Add Detail
                        </button>
                    </Modal.Footer>
                </Modal>
                <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Edit Detail</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label>Material</label>
                            <input
                                type="text"
                                className="form-control"
                                value={editingDetail?.name || ""}
                                readOnly
                            />
                        </div>
                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                value={editingDetail?.quantity || ""}
                                onChange={(e) =>
                                    setEditingDetail({ ...editingDetail, quantity: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                className="form-control"
                                value={editingDetail?.price || ""}
                                onChange={(e) =>
                                    setEditingDetail({ ...editingDetail, price: e.target.value })
                                }
                            />
                        </div>
                        <div className="form-group">
                            <label>Description</label>
                            <textarea
                                className="form-control"
                                value={editingDetail?.description || ""}
                                onChange={(e) =>
                                    setEditingDetail({ ...editingDetail, description: e.target.value })
                                }
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="action-btn" onClick={() => setShowEditModal(false)}>
                            Close
                        </button>
                        <button className="action-btn" onClick={updateDetail}>
                            Save Changes
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default ImportOrderDetail;
