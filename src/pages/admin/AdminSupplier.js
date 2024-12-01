import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css"; // Sử dụng lại CSS của AdminProduct
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SideBar from "../../components/sidebar/AdminSideBar";

const AdminSupplier = () => {
    const [suppliers, setSuppliers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedSupplier, setSelectedSupplier] = useState(null); // Supplier được chọn
    const [isEdit, setIsEdit] = useState(false); // Để phân biệt View/Edit
    const [newSupplier, setNewSupplier] = useState({ name: "", phone: "", address: "" }); // Dữ liệu cho Add Supplier

    useEffect(() => {
        loadSuppliers();
    }, []);

    const loadSuppliers = async () => {
        const result = await axios.get("http://localhost:8080/api/supplier/get/all");
        setSuppliers(result.data.data);
    };

    const deleteSupplier = async (id) => {
        await axios.delete(`http://localhost:8080/api/supplier/delete/${id}`);
        loadSuppliers();
    };

    const handleViewEdit = (supplier, isEditMode) => {
        setSelectedSupplier(supplier);
        setIsEdit(isEditMode);
    };

    const handleAddSupplier = () => {
        setSelectedSupplier(null); // Reset selected supplier
        setIsEdit(false);
        setNewSupplier({ name: "", phone: "", address: "" });
    };

    const saveSupplier = async () => {
        if (isEdit && selectedSupplier) {
            await axios.put(`http://localhost:8080/api/supplier/update/${selectedSupplier.supplierID}`, selectedSupplier);
        } else {
            await axios.post("http://localhost:8080/api/supplier/create", newSupplier);
        }
        loadSuppliers();
    };

    const filteredSuppliers = suppliers.filter((supplier) =>
        supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-page">
            <SideBar />

            <div className="content">
                <div className="header">
                    <h1>Suppliers</h1>
                    <button className="add-item-btn" data-bs-toggle="modal" data-bs-target="#supplierModal" onClick={handleAddSupplier}>
                        + Add Supplier
                    </button>
                </div>

                <div className="menu">
                    <h3>Supplier Management</h3>
                    <p>Home > Suppliers</p>
                    <div className="search-container">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Search supplier..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Address</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredSuppliers.map((supplier, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{supplier.name}</td>
                                <td>{supplier.phone}</td>
                                <td>{supplier.address}</td>
                                <td>
                                    <button className="action-btn" data-bs-toggle="modal" data-bs-target="#supplierModal" onClick={() => handleViewEdit(supplier, false)}>
                                        View
                                    </button>
                                    <button className="action-btn" data-bs-toggle="modal" data-bs-target="#supplierModal" onClick={() => handleViewEdit(supplier, true)}>
                                        Edit
                                    </button>
                                    <button onClick={() => deleteSupplier(supplier.supplierID)} className="action-btn">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div className="modal fade" id="supplierModal" tabIndex="-1" aria-labelledby="supplierModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="supplierModalLabel">
                                {selectedSupplier ? (isEdit ? "Edit Supplier" : "View Supplier") : "Add Supplier"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedSupplier ? selectedSupplier.name : newSupplier.name}
                                    onChange={(e) =>
                                        selectedSupplier
                                            ? setSelectedSupplier({ ...selectedSupplier, name: e.target.value })
                                            : setNewSupplier({ ...newSupplier, name: e.target.value })
                                    }
                                    disabled={!isEdit && selectedSupplier}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedSupplier ? selectedSupplier.phone : newSupplier.phone}
                                    onChange={(e) =>
                                        selectedSupplier
                                            ? setSelectedSupplier({ ...selectedSupplier, phone: e.target.value })
                                            : setNewSupplier({ ...newSupplier, phone: e.target.value })
                                    }
                                    disabled={!isEdit && selectedSupplier}
                                />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedSupplier ? selectedSupplier.address : newSupplier.address}
                                    onChange={(e) =>
                                        selectedSupplier
                                            ? setSelectedSupplier({ ...selectedSupplier, address: e.target.value })
                                            : setNewSupplier({ ...newSupplier, address: e.target.value })
                                    }
                                    disabled={!isEdit && selectedSupplier}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            {isEdit || !selectedSupplier ? (
                                <button type="button" className="btn btn-primary" onClick={saveSupplier} data-bs-dismiss="modal">
                                    Save
                                </button>
                            ) : null}
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

export default AdminSupplier;
