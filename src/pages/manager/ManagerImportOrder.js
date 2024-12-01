import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css"; // CSS dùng chung
import SideBar from "../../components/sidebar/AdminSideBar";

const AdminImportOrder = () => {
    const [importOrders, setImportOrders] = useState([]);
    const [suppliers, setSuppliers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [materials, setMaterials] = useState([]);
    const [selectedImportOrder, setSelectedImportOrder] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Lưu trữ từ khóa tìm kiếm
    const [suggestedMaterials, setSuggestedMaterials] = useState([]); // Lưu trữ danh sách gợi ý
    const [newImportOrder, setNewImportOrder] = useState({
        supplierID: "",
        branchID: "",
        paymentMethod: "cash",
        details: [],
    });
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [newDetail, setNewDetail] = useState({
        materialName: "",
        quantity: 0,
        price: 0,
        description: "",
    });

    useEffect(() => {
        loadImportOrders();
        loadSuppliers();
        loadBranches();
        loadMaterials();
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

            setImportOrders(enrichedOrders);
        } catch (error) {
            console.error("Error loading import orders:", error);
        }
    };

    const loadSuppliers = async () => {
        try {
            const result = await axios.get("http://localhost:8080/api/supplier/get/all");
            setSuppliers(result.data.data || []);
        } catch (error) {
            console.error("Error loading suppliers:", error);
        }
    };

    const loadBranches = async () => {
        try {
            const result = await axios.get("http://localhost:8080/api/branch/get/all");
            setBranches(result.data.data || []);
        } catch (error) {
            console.error("Error loading branches:", error);
        }
    };

    const loadMaterials = async () => {
        try {
            const result = await axios.get("http://localhost:8080/api/material/get/all");
            setMaterials(result.data.data || []);
        } catch (error) {
            console.error("Error loading materials:", error);
        }
    };

    const handleAddImportOrder = () => {
        setSelectedImportOrder(null);
        setIsEdit(false);
        setNewImportOrder({
            supplierID: "",
            branchID: "",
            paymentMethod: "cash",
            details: [],
        });
    };

    const saveImportOrder = async () => {
        try {
            if (isEdit && selectedImportOrder) {
                await axios.put(`http://localhost:8080/api/importOrder/update/${selectedImportOrder.importID}`, selectedImportOrder);
            } else {
                await axios.post("http://localhost:8080/api/importOrder/create", newImportOrder);
            }
            loadImportOrders(); // Reload orders after saving
        } catch (error) {
            console.error("Error saving import order:", error);
        }
    };

    const addDetailToNewOrder = () => {
        setShowDetailModal(true); // Hiển thị modal nhập thông tin detail
    };

    const saveNewDetail = async () => {
        try {
            const response = await axios.post(
                `http://localhost:8080/api/import-order/add/${newImportOrder.supplierID}`, // Đây là id của import order hiện tại
                newDetail
            );
            // Cập nhật lại chi tiết cho đơn nhập hàng hiện tại
            setNewImportOrder((prevOrder) => ({
                ...prevOrder,
                details: [...prevOrder.details, newDetail],
            }));
            setNewDetail({ materialName: "", quantity: 0, price: 0, description: "" });
            setShowDetailModal(false); // Đóng modal
        } catch (error) {
            console.error("Error saving new detail:", error);
        }
    };

    // Hàm gọi API để tìm kiếm vật liệu
    const searchMaterials = async (query) => {
        if (query.length < 2) {
            setSuggestedMaterials([]); // Nếu từ khóa ngắn hơn 2 ký tự, không tìm kiếm
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8080/api/material/search?name=${query}`);
            setSuggestedMaterials(response.data.data || []);
        } catch (error) {
            console.error("Error searching materials:", error);
        }
    };

    // Hàm gọi khi người dùng nhập liệu vào ô tìm kiếm
    const handleMaterialSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        searchMaterials(query);
    };

    // Chọn một vật liệu từ gợi ý
    const handleMaterialSelect = (material) => {
        setNewDetail({
            ...newDetail,
            materialName: material.name, // Chọn tên vật liệu từ gợi ý
        });
        setSuggestedMaterials([]); // Ẩn danh sách gợi ý sau khi chọn
    };

    return (
        <div className="admin-page">
            <SideBar />

            <div className="content">
                <div className="header">
                    <h1>Import Orders</h1>
                    <button className="add-item-btn" data-bs-toggle="modal" data-bs-target="#importOrderModal" onClick={handleAddImportOrder}>
                        + Add Import Order
                    </button>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Supplier</th>
                            <th>Branch</th>
                            <th>Payment Method</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {importOrders.map((order, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{order.supplierName || "N/A"}</td>
                                <td>{order.branchAddress || "N/A"}</td>
                                <td>{order.paymentMethod}</td>
                                <td>
                                    <button className="action-btn">View</button>
                                    <button className="action-btn">Edit</button>
                                    <button className="action-btn">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal for Import Order */}
            <div className="modal fade" id="importOrderModal" tabIndex="-1" aria-labelledby="importOrderModalLabel" aria-hidden="true">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Add/Edit Import Order</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Supplier</label>
                                <select className="form-control" onChange={(e) => setNewImportOrder({ ...newImportOrder, supplierID: e.target.value })}>
                                    <option>-- Select Supplier --</option>
                                    {suppliers.map((supplier) => (
                                        <option key={supplier.supplierID} value={supplier.supplierID}>
                                            {supplier.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Branch</label>
                                <select className="form-control" onChange={(e) => setNewImportOrder({ ...newImportOrder, branchID: e.target.value })}>
                                    <option>-- Select Branch --</option>
                                    {branches.map((branch) => (
                                        <option key={branch.branchID} value={branch.branchID}>
                                            {branch.address}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <h5>Details</h5>
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th>Material</th>
                                        <th>Quantity</th>
                                        <th>Price</th>
                                        <th>Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {newImportOrder.details.map((detail, index) => (
                                        <tr key={index}>
                                            <td>{detail.materialName}</td>
                                            <td>{detail.quantity}</td>
                                            <td>{detail.price}</td>
                                            <td>{detail.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <button className="btn btn-primary" onClick={addDetailToNewOrder}>
                                Add Detail
                            </button>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-primary" onClick={saveImportOrder}>
                                Save
                            </button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal for Detail */}
            {showDetailModal && (
                <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Add Material Detail</h5>
                                <button type="button" className="btn-close" onClick={() => setShowDetailModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <div className="form-group">
                                    <label>Material</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newDetail.materialName}
                                        onChange={handleMaterialSearch} // Gọi hàm tìm kiếm khi thay đổi giá trị
                                        placeholder="Start typing material name..."
                                    />
                                    {/* Hiển thị gợi ý vật liệu */}
                                    {suggestedMaterials.length > 0 && (
                                        <ul className="suggestions-list">
                                            {suggestedMaterials.map((material) => (
                                                <li
                                                    key={material.materialID}
                                                    onClick={() => handleMaterialSelect(material)} // Chọn vật liệu khi nhấp vào gợi ý
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
                                        onChange={(e) => setNewDetail({ ...newDetail, quantity: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Price</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={newDetail.price}
                                        onChange={(e) => setNewDetail({ ...newDetail, price: e.target.value })}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Description</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={newDetail.description}
                                        onChange={(e) => setNewDetail({ ...newDetail, description: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={saveNewDetail}>
                                    Save Detail
                                </button>
                                <button type="button" className="btn btn-secondary" onClick={() => setShowDetailModal(false)}>
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

        </div>
    );
};

export default AdminImportOrder;
