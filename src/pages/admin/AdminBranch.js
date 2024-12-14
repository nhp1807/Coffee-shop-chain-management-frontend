import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css"; // CSS riêng cho Branch
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AdminSideBar from "../../components/sidebar/AdminSideBar";
import BASE_URL from "../../config";

const AdminBranch = () => {

    const [branches, setBranches] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedBranch, setSelectedBranch] = useState(null); // Branch được chọn
    const [isEdit, setIsEdit] = useState(false); // Để phân biệt View/Edit
    const [newBranch, setNewBranch] = useState({ address: "", phone: "", fax: "" }); // Dữ liệu cho Add Branch

    useEffect(() => {
        loadBranches();
    }, []);

    const loadBranches = async () => {
        const result = await axios.get(`${BASE_URL}/branch/get/all`);
        setBranches(result.data.data);
    };

    const deleteBranch = async (id) => {
        await axios.delete(`${BASE_URL}/branch/delete/${id}`);
        loadBranches();
    };

    const handleViewEdit = (branch, isEditMode) => {
        setSelectedBranch(branch);
        setIsEdit(isEditMode);
    };

    const handleAddBranch = () => {
        setSelectedBranch(null); // Reset selected branch
        setIsEdit(false);
        setNewBranch({ address: "", phone: "", fax: "" });
    };

    const saveBranch = async () => {
        if (isEdit && selectedBranch) {
            await axios.put(`${BASE_URL}/branch/update/${selectedBranch.branchID}`, selectedBranch);
        } else {
            await axios.post(`${BASE_URL}/branch/create`, newBranch);
        }
        loadBranches();
    };

    const filteredBranches = branches.filter((branch) =>
        branch.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-page">
            <AdminSideBar />

            <div className="content">
                <div className="header">
                    <h1>Branches</h1>
                    <button className="add-item-btn" data-bs-toggle="modal" data-bs-target="#branchModal" onClick={handleAddBranch}>
                        + Add Branch
                    </button>
                </div>

                <div className="menu">
                    <h3>Branch Management</h3>
                    <p>Home > Branches</p>
                    <div className="search-container">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Search branch..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="table">
                    <thead>
                    <tr>
                        <th>#</th>
                        <th>Address</th>
                        <th>Phone</th>
                        <th>Fax</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {filteredBranches.map((branch, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{branch.address}</td>
                            <td>{branch.phone}</td>
                            <td>{branch.fax}</td>
                            <td>
                                <button className="action-btn" data-bs-toggle="modal" data-bs-target="#branchModal" onClick={() => handleViewEdit(branch, false)}>
                                    View
                                </button>
                                <button className="action-btn" data-bs-toggle="modal" data-bs-target="#branchModal" onClick={() => handleViewEdit(branch, true)}>
                                    Edit
                                </button>
                                <button onClick={() => deleteBranch(branch.branchID)} className="action-btn">Delete</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div className="modal fade" id="branchModal" tabIndex="-1" aria-labelledby="branchModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="branchModalLabel">
                                {selectedBranch ? (isEdit ? "Edit Branch" : "View Branch") : "Add Branch"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedBranch ? selectedBranch.address : newBranch.address}
                                    onChange={(e) =>
                                        selectedBranch
                                            ? setSelectedBranch({ ...selectedBranch, address: e.target.value })
                                            : setNewBranch({ ...newBranch, address: e.target.value })
                                    }
                                    disabled={!isEdit && selectedBranch}
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedBranch ? selectedBranch.phone : newBranch.phone}
                                    onChange={(e) =>
                                        selectedBranch
                                            ? setSelectedBranch({ ...selectedBranch, phone: e.target.value })
                                            : setNewBranch({ ...newBranch, phone: e.target.value })
                                    }
                                    disabled={!isEdit && selectedBranch}
                                />
                            </div>
                            <div className="form-group">
                                <label>Fax</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedBranch ? selectedBranch.fax : newBranch.fax}
                                    onChange={(e) =>
                                        selectedBranch
                                            ? setSelectedBranch({ ...selectedBranch, fax: e.target.value })
                                            : setNewBranch({ ...newBranch, fax: e.target.value })
                                    }
                                    disabled={!isEdit && selectedBranch}
                                />
                            </div>
                        </div>
                        <div className="modal-footer">
                            {isEdit || !selectedBranch ? (
                                <button type="button" className="btn btn-primary" onClick={saveBranch} data-bs-dismiss="modal">
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

export default AdminBranch;