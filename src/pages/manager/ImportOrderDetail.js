import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ManagerSideBar from "../../components/sidebar/ManagerSideBar"; // Sidebar
import "../../assets/styles/AdminObject.css"; // CSS Style
import "../../assets/styles/Suggestion.css";
import { Modal, Button } from "react-bootstrap"; // Để sử dụng modal

const ImportOrderDetail = () => {
    const { importOrderId } = useParams();
    const navigate = useNavigate();

    const [importOrder, setImportOrder] = useState({
        importID: "",
        total: 0,
        paymentMethod: "cash",
        date: "",
        status: "",
        supplierId: "",
        branchId: "",
        detailImportOrders: [],
    });
    const [suppliers, setSuppliers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [materials, setMaterials] = useState([]); // Dữ liệu nguyên liệu (Material)
    const [newDetail, setNewDetail] = useState({
        materialName: "", // Thay đổi từ materialID thành materialName để người dùng nhập tay
        quantity: 0,
        price: 0,
        description: "",
    });

    const [showModal, setShowModal] = useState(false); // Trạng thái của modal
    const [filteredMaterials, setFilteredMaterials] = useState([]); // Lưu trữ danh sách vật liệu lọc được

    useEffect(() => {
        loadSuppliersAndBranches();
        loadMaterials(); // Tải dữ liệu vật liệu khi khởi tạo
        if (importOrderId !== "new") {
            loadImportOrder(importOrderId);
        }
    }, [importOrderId]);

    const loadSuppliersAndBranches = async () => {
        try {
            const [suppliersRes, branchesRes] = await Promise.all([
                axios.get("http://localhost:8080/api/supplier/get/all"),
                axios.get("http://localhost:8080/api/branch/get/all"),
            ]);
            setSuppliers(suppliersRes.data.data || []);
            setBranches(branchesRes.data.data || []);
        } catch (error) {
            console.error("Error loading suppliers or branches:", error);
        }
    };

    const loadMaterials = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/material/get/all");
            // console.log("Materials:", response.data.data);
            setMaterials(response.data.data || []);
        } catch (error) {
            console.error("Error loading materials:", error);
        }
    };

    const loadImportOrder = async (id) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/import-order/get/${id}`);
            const date = new Date(response.data.data.date);
            response.data.data.date = date.toLocaleDateString();

            // Get supplier and branch name
            const [supplierRes, branchRes] = await Promise.all([
                axios.get(`http://localhost:8080/api/supplier/get/${response.data.data.supplierId}`),
                axios.get(`http://localhost:8080/api/branch/get/${response.data.data.branchId}`),
            ]);

            response.data.data.supplierName = supplierRes.data.data.name;
            response.data.data.branchAddress = branchRes.data.data.address;

            setImportOrder(response.data.data);
        } catch (error) {
            console.error("Error loading import order:", error);
        }
    };

    const handleSave = async () => {
        try {
            if (importOrderId === "new") {
                await axios.post("http://localhost:8080/api/import-order/create", importOrder);
            } else {
                await axios.put(`http://localhost:8080/api/import-order/update/${importOrderId}`, importOrder);
            }
            navigate("/manager/import-order");
        } catch (error) {
            console.error("Error saving import order:", error);
        }
    };

    const addDetail = async () => {
        // Gửi chi tiết mới lên API để thêm vào Import Order
        try {
            const response = await axios.put(`http://localhost:8080/api/import-order/add/${importOrderId}`, newDetail);
            setImportOrder((prevOrder) => ({
                ...prevOrder,
                detailImportOrders: [...prevOrder.detailImportOrders, response.data.data], // Thêm detail mới vào importOrder
            }));
            setShowModal(false); // Đóng modal
        } catch (error) {
            console.error("Error adding detail:", error);
        }
    };

    const handleDeleteDetail = async (materialId) => {
        try {
            // Gọi API để xóa chi tiết
            await axios.delete(`http://localhost:8080/api/import-order/delete/${importOrderId}/${materialId}`);
            
            // Cập nhật lại danh sách chi tiết sau khi xóa
            setImportOrder((prevOrder) => ({
                ...prevOrder,
                detailImportOrders: prevOrder.detailImportOrders.filter(
                    (detail) => detail.materialId !== materialId
                ),
            }));
        } catch (error) {
            console.error("Error deleting detail:", error);
        }
    };
    

    const handleMaterialSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setNewDetail({ ...newDetail, materialName: e.target.value });
        setFilteredMaterials(
            materials.filter((material) =>
                material.name.toLowerCase().includes(searchTerm)
            )
        );
    };

    const handleMaterialSelect = (materialName) => {
        setNewDetail({
            ...newDetail,
            materialName: materialName,
        });
        setFilteredMaterials([]);  // Đóng danh sách gợi ý khi đã chọn
    };

    return (
        <div className="admin-page">
            <ManagerSideBar />
            <div className="content">
                <div className="header">
                    <h1>{importOrderId === "new" ? "Add New Import Order" : "Edit Import Order"}</h1>
                </div>

                <div className="menu">
                    <h3>Import Order Detail</h3>
                    <p>Home > Import Order > {importOrderId === "new" ? "New" : "Edit"}</p>
                </div>

                {/* Form Supplier and Branch */}
                <div className="form-group">
                    <label>Supplier</label>
                    <select
                        className="form-control"
                        value={importOrder.supplierName}
                        onChange={(e) =>
                            setImportOrder({ ...importOrder, supplierId: e.target.value })
                        }
                    >
                        <option value="">-- Select Supplier --</option>
                        {suppliers.map((supplier) => (
                            <option key={supplier.supplierId} value={supplier.supplierId}>
                                {supplier.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Branch</label>
                    <select
                        className="form-control"
                        value={importOrder.branchAddress}
                        onChange={(e) =>
                            setImportOrder({ ...importOrder, branchId: e.target.value })
                        }
                    >
                        <option value="">-- Select Branch --</option>
                        {branches.map((branch) => (
                            <option key={branch.branchId} value={branch.branchId}>
                                {branch.address}
                            </option>
                        ))}
                    </select>
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
                        {importOrder.detailImportOrders.length > 0 ? (
                            importOrder.detailImportOrders.map((detail, index) => (
                                <tr key={index}>
                                    <td>{detail.materialName}</td>
                                    <td>{detail.quantity}</td>
                                    <td>{detail.price}</td>
                                    <td>{detail.description}</td>
                                    <td>
                                        {/* Nút xóa */}
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDeleteDetail(detail.materialId)}
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
            </div>
        </div>
    );
};

export default ImportOrderDetail;
