import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import ManagerSideBar from "../../components/sidebar/ManagerSideBar"; // Sidebar
import "../../assets/styles/AdminObject.css"; // CSS Style
import "../../assets/styles/Suggestion.css";
import { Modal } from "react-bootstrap";
import {BASE_URL} from "../../config";
import CheckResponse from "../../api/CheckResponse";

const ExportOrderDetail = () => {
    const { exportOrderID } = useParams();
    const navigate = useNavigate();
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingDetail, setEditingDetail] = useState(null);
    const branchID = localStorage.getItem("branchID"); // Lấy branchID từ localStorage


    const [exportOrder, setExportOrder] = useState({
        exportID: "",
        total: 0,
        paymentMethod: "cash",
        date: "",
        employeeID: "",
        branchID: "",
        detailExportOrders: [],
    });
    const [employees, setEmployees] = useState([]);
    const [branches, setBranches] = useState([]);
    const [products, setProducts] = useState([]); // Dữ liệu nguyên liệu (Material)
    const [newDetail, setNewDetail] = useState({
        name: "", // Đảm bảo có giá trị khởi tạo
        quantity: 0,
        // price: 0,
        description: "",
    });

    const [showModal, setShowModal] = useState(false); // Trạng thái của modal
    const [filteredProducts, setFilteredProducts] = useState([]); // Lưu trữ danh sách vật liệu lọc được

    useEffect(() => {
        const loadData = async () => {
            try {
                await loadEmployeesAndBranches();
                await loadProducts();

                // Lấy branchID từ localStorage
                const storedBranchID = localStorage.getItem("branchID");
                if (storedBranchID) {
                    setExportOrder((prevOrder) => ({
                        ...prevOrder,
                        branchID: storedBranchID, // Cập nhật branchID từ localStorage
                    }));
                }

                if (exportOrderID !== "new") {
                    await loadExportOrder(exportOrderID);
                }
            } catch (error) {
                console.error("Error loading data:", error);
            }
        };
        loadData();
    }, [exportOrderID]);

    const loadEmployeesAndBranches = async () => {
        try {
            const [employeesRes, branchesRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/employee/get/branch/${branchID}`),
                axios.get(`${BASE_URL}/api/branch/get/all`),
            ]);

            setEmployees(employeesRes.data.data || []);
            setBranches(branchesRes.data.data || []);
        } catch (error) {
            console.error("Error loading employees or branches:", error);
        }
    };

    const loadProducts = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/product/get/all`);
            setProducts(response.data.data || []);
        } catch (error) {
            console.error("Error loading products:", error);
        }
    };

    const loadExportOrder = async (id) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/export-order/get/${id}`);

            const date = new Date(response.data.data.date);
            response.data.data.date = date.toLocaleDateString();

            // Get employee and branch name
            const [employeeRes, branchRes] = await Promise.all([
                axios.get(`${BASE_URL}/api/employee/get/${response.data.data.employeeID}`),
                axios.get(`${BASE_URL}/api/branch/get/${response.data.data.branchID}`),
            ]);

            response.data.data.employeeName = employeeRes.data.data.name;
            response.data.data.branchAddress = branchRes.data.data.address;
            response.data.data.employeeID = employeeRes.data.data.employeeID;
            response.data.data.branchID = branchRes.data.data.branchID;

            setExportOrder(response.data.data);
        } catch (error) {
            console.error("Error loading export order:", error);
        }
    };

    const handleSave = async () => {
        try {
            if (exportOrderID === "new") {
                await axios.post(`${BASE_URL}/api/export-order/create`, exportOrder);
            }
            navigate("/manager/export-order");
        } catch (error) {
            console.error("Error saving import order:", error);
        }
    };

    const addDetail = async () => {
        if (!newDetail.name || !newDetail.quantity) {
            alert("Please fill in all fields before adding detail.");
            return;
        }

        try {
            const response = await axios.put(`${BASE_URL}/api/export-order-detail/add/${exportOrderID}`, newDetail);
            CheckResponse(response);
            await loadExportOrder(exportOrderID);

            setShowModal(false);
            setNewDetail({
                name: "",
                quantity: 0,
                // price: 0,
                description: "",
            });
        } catch (error) {
            console.error("Error adding detail:", error);
        }
    };

    const handleDeleteDetail = async (productID) => {
        try {

            const response = await axios.delete(`${BASE_URL}/api/export-order-detail/delete/${exportOrderID}/${productID}`);
            CheckResponse(response);

            // Cập nhật lại danh sách chi tiết sau khi xóa
            setExportOrder((prevOrder) => ({
                ...prevOrder,
                detailExportOrders: prevOrder.detailExportOrders.filter(
                    (detail) => detail.productID !== productID
                ),
            }));
            loadExportOrder(exportOrderID);
        } catch (error) {
            console.error("Error deleting detail:", error);
        }
    };

    const handleEditDetail = async (productID) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/export-order-detail/get/${exportOrderID}/${productID}`);

            setEditingDetail(response.data.data);
            setShowEditModal(true);
        } catch (error) {
            console.error("Error fetching detail:", error);
        }
    };

    const updateDetail = async () => {
        try {
            await axios.put(`${BASE_URL}/api/export-order-detail/update/${exportOrderID}/${editingDetail.productID}`, editingDetail);
            setShowEditModal(false);
    
            // Cập nhật lại danh sách chi tiết sau khi chỉnh sửa
            await loadExportOrder(exportOrderID);
        } catch (error) {
            console.error("Error updating detail:", error);
        }
    };   
    

    const handleProductSearch = (e) => {
        const searchTerm = e.target.value.toLowerCase();
        setNewDetail({ ...newDetail, name: e.target.value });
        setFilteredProducts(
            products.filter((product) => product.name && product.name.toLowerCase().includes(searchTerm))
        );
    };


    const handleProductSelect = (name) => {
        if (!name) {
            console.error("Product name is required!");
            return;
        }
        setNewDetail({
            ...newDetail,
            name: name,
        });
        setFilteredProducts([]);  // Đóng danh sách gợi ý khi đã chọn
    };


    return (
        <div className="admin-page">
            <ManagerSideBar />
            <div className="content">
                <div className="header">
                    <h1>{exportOrderID === "new" ? "Add New Import Order" : "Edit Import Order"}</h1>
                </div>

                <div className="menu">
                    <h3>Export Order Detail</h3>
                    <p>Home > Export Order > {exportOrderID === "new" ? "New" : "Edit"}</p>
                </div>

                {/* Form Employee and Branch */}
                <div className="form-group">
                    <label>Employee</label>
                    <select
                        className="form-control"
                        value={exportOrder.employeeID || ""}
                        onChange={(e) =>
                            setExportOrder({ ...exportOrder, employeeID: e.target.value })
                        }
                    >
                        <option value="">-- Select Employee --</option>
                        {employees.map((employee) => (
                            <option key={employee.employeeID} value={employee.employeeID}>
                                {employee.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Branch</label>
                    <select
                        className="form-control"
                        value={exportOrder.branchID || ""}
                        onChange={(e) =>
                            setExportOrder({ ...exportOrder, branchID: e.target.value })
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
                        value={exportOrder.paymentMethod}
                        onChange={(e) =>
                            setExportOrder({ ...exportOrder, paymentMethod: e.target.value })
                        }
                    >
                        <option value="cash">Cash</option>
                        <option value="bank">Bank</option>
                    </select>
                </div>

                <div className="form-group">
                    <label>Total</label>
                    <input type="number" className="form-control" value={exportOrder.total} disabled />
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
                        {exportOrder?.detailExportOrders?.length > 0 ? (
                            exportOrder.detailExportOrders.map((detail, index) => (
                                <tr key={index}>
                                    <td>{detail?.name || "Unknown Product"}</td> {/* Kiểm tra xem detail.name có tồn tại không */}
                                    <td>{detail?.quantity}</td>
                                    <td>{detail?.price}</td>
                                    <td>{detail?.description}</td>
                                    <td>
                                        <button
                                            className="action-btn edit"
                                            onClick={() => handleEditDetail(detail.productID)}
                                        >
                                            Edit
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => handleDeleteDetail(detail.productID)}
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

                <button className="action-btn edit" onClick={() => setShowModal(true)}>
                    Add Detail
                </button>
                <button className="action-btn view" onClick={handleSave}>
                    Save
                </button>

                {/* Modal to Add Detail */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Detail</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group" style={{ position: 'relative' }}>  {/* Thêm style relative cho form-group */}
                            <label>Product</label>
                            <input
                                type="text"
                                className="form-control"
                                value={newDetail.name}
                                onChange={handleProductSearch}
                                placeholder="Enter product name"
                            />
                            {/* Hiển thị danh sách gợi ý nếu có */}
                            {filteredProducts.length > 0 && (
                                <ul className="suggestions-list">
                                    {filteredProducts.map((product) => (
                                        <li
                                            key={product.productID}
                                            onClick={() => handleProductSelect(product.name)}
                                        >
                                            {product.name}
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

                        {/* <div className="form-group">
                            <label>Price</label>
                            <input
                                type="number"
                                className="form-control"
                                value={newDetail.price}
                                onChange={(e) =>
                                    setNewDetail({ ...newDetail, price: e.target.value })
                                }
                            />
                        </div> */}

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
                        <button className="btn btn-secondary" onClick={() => setShowModal(false)}>
                            Close
                        </button>
                        <button className="btn btn-primary" onClick={addDetail}>
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
                            <label>Product</label>
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
                        <button className="btn btn-secondary" onClick={() => setShowEditModal(false)}>
                            Close
                        </button>
                        <button className="btn btn-primary" onClick={updateDetail}>
                            Save Changes
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default ExportOrderDetail;
