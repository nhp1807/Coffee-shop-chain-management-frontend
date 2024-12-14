import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AdminSideBar from "../../components/sidebar/AdminSideBar";
import BASE_URL from "../../config";

const AdminMaterial = () => {
    const [materials, setMaterials] = useState([]); // Danh sách material
    const [searchTerm, setSearchTerm] = useState(""); // Từ khóa tìm kiếm
    const [selectedMaterial, setSelectedMaterial] = useState(null); // Material đang chọn
    const [isEdit, setIsEdit] = useState(false); // Trạng thái chỉnh sửa
    const [newMaterial, setNewMaterial] = useState({ name: "" }); // Material mới

    useEffect(() => {
        loadMaterials(); // Tải danh sách material khi component được mount
    }, []);

    // Lấy danh sách material từ API
    const loadMaterials = async () => {
        const result = await axios.get('${BASE_URL}/api/material/get/all');
        setMaterials(result.data.data || []);
    };

    // Xóa material
    const deleteMaterial = async (id) => {
        await axios.delete(`${BASE_URL}/api/material/delete/${id}`);
        loadMaterials(); // Tải lại danh sách sau khi xóa
    };

    // Xử lý hiển thị modal View/Edit
    const handleViewEdit = (material, isEditMode) => {
        setSelectedMaterial(material);
        setIsEdit(isEditMode);
    };

    // Xử lý thêm mới material
    const handleAddMaterial = () => {
        setSelectedMaterial(null);
        setIsEdit(false);
        setNewMaterial({ name: "" }); // Reset form thêm mới
    };

    // Lưu material (thêm mới hoặc chỉnh sửa)
    const saveMaterial = async () => {
        if (isEdit && selectedMaterial) {
            // Cập nhật material
            await axios.put(`${BASE_URL}/api/material/update/${selectedMaterial.materialID}`, selectedMaterial);
        } else {
            // Thêm mới material
            await axios.post('${BASE_URL}/api/material/create', newMaterial);
        }
        loadMaterials(); // Tải lại danh sách
    };

    // Lọc material theo từ khóa tìm kiếm
    const filteredMaterials = materials.filter((material) =>
        material.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-page">
            <AdminSideBar />

            <div className="content">
                <div className="header">
                    <h1>Materials</h1>
                    <button
                        className="add-item-btn"
                        data-bs-toggle="modal"
                        data-bs-target="#materialModal"
                        onClick={handleAddMaterial}
                    >
                        + Add Material
                    </button>
                </div>

                <div className="menu">
                    <h3>Material Management</h3>
                    <p>Home > Materials</p>
                    <div className="search-container">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Search material..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Name</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredMaterials.map((material, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{material.name}</td>
                            <td>
                                <button
                                    className="action-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#materialModal"
                                    onClick={() => handleViewEdit(material, false)}
                                >
                                    View
                                </button>
                                <button
                                    className="action-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#materialModal"
                                    onClick={() => handleViewEdit(material, true)}
                                >
                                    Edit
                                </button>
                                <button onClick={() => deleteMaterial(material.materialID)} className="action-btn">
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div
                className="modal fade"
                id="materialModal"
                tabIndex="-1"
                aria-labelledby="materialModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="materialModalLabel">
                                {selectedMaterial
                                    ? isEdit
                                        ? "Edit Material"
                                        : "View Material"
                                    : "Add Material"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedMaterial ? selectedMaterial.name : newMaterial.name}
                                    onChange={(e) =>
                                        selectedMaterial
                                            ? setSelectedMaterial({ ...selectedMaterial, name: e.target.value })
                                            : setNewMaterial({ ...newMaterial, name: e.target.value })
                                    }
                                    disabled={!isEdit && selectedMaterial}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            {(isEdit || !selectedMaterial) && (
                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={saveMaterial}
                                    data-bs-dismiss="modal"
                                >
                                    Save
                                </button>
                            )}
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminMaterial;