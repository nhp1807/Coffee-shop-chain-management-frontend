import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css"; // Sử dụng lại CSS của AdminProduct
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AdminSideBar from "../../components/sidebar/AdminSideBar";
import BASE_URL from "../../config";

const AdminAccount = () => {
    
    const [accounts, setAccounts] = useState([]);
    const [branches, setBranches] = useState([]); // Danh sách branch
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedAccount, setSelectedAccount] = useState(null); // Account được chọn
    const [isEdit, setIsEdit] = useState(false); // Để phân biệt View/Edit
    const [newAccount, setNewAccount] = useState({ username: "", role: "", email: "", branchID: "" }); // Dữ liệu cho Add Account

    useEffect(() => {
        loadAccounts();
        loadBranches(); // Lấy danh sách branch
    }, []);

    const loadAccounts = async () => {
        const result = await axios.get(`${BASE_URL}/account/get/all`);
        const accountsData = result.data.data;
    
        // Lấy address cho từng branchID
        const accountsWithBranchAddress = await Promise.all(
            accountsData.map(async (account) => {
                const branchAddress = account.branchID ? await loadBranchName(account.branchID) : "N/A";
                return { ...account, branchAddress };
            })
        );
    
        setAccounts(accountsWithBranchAddress);
    };
    

    const loadBranches = async () => {
        const result = await axios.get(`${BASE_URL}/branch/get/all`);
        console.log("Result:" + result.data.data);
        setBranches(result.data.data);
    };

    const loadBranchName = async (branchID) => {
        const result = await axios.get(`${BASE_URL}/branch/get/${branchID}`);
        return result.data.data.address;
    };

    const deleteAccount = async (id) => {
        await axios.delete(`${BASE_URL}/account/delete/${id}`);
        loadAccounts();
    };

    const handleViewEdit = (account, isEditMode) => {
        setSelectedAccount(account);
        setIsEdit(isEditMode);
    };

    const handleAddAccount = () => {
        setSelectedAccount(null);
        setIsEdit(false);
        setNewAccount({ username: "", role: "", email: "", branchID: "" });
    };

    const saveAccount = async () => {
        if (isEdit && selectedAccount) {
            await axios.put(`${BASE_URL}/account/update/${selectedAccount.accountID}`, selectedAccount);
        } else {
            await axios.post("${BASE_URL}/account/create", newAccount);
        }
        loadAccounts();
    };

    const filteredAccounts = accounts.filter((account) =>
        account.username.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-page">
            <AdminSideBar />

            <div className="content">
                <div className="header">
                    <h1>Accounts</h1>
                    <button className="add-item-btn" data-bs-toggle="modal" data-bs-target="#accountModal" onClick={handleAddAccount}>
                        + Add Account
                    </button>
                </div>

                <div className="menu">
                    <h3>Account Management</h3>
                    <p>Home > Accounts</p>
                    <div className="search-container">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Search account..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Username</th>
                            <th>Role</th>
                            <th>Email</th>
                            <th>Branch</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAccounts.map((account, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{account.username}</td>
                                <td>{account.role}</td>
                                <td>{account.email}</td>
                                <td>{account.branchAddress || "N/A"}</td> {/* Hiển thị branchName */}
                                <td>
                                    <button className="action-btn" data-bs-toggle="modal" data-bs-target="#accountModal" onClick={() => handleViewEdit(account, false)}>
                                        View
                                    </button>
                                    <button className="action-btn" data-bs-toggle="modal" data-bs-target="#accountModal" onClick={() => handleViewEdit(account, true)}>
                                        Edit
                                    </button>
                                    <button onClick={() => deleteAccount(account.accountID)} className="action-btn">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div className="modal fade" id="accountModal" tabIndex="-1" aria-labelledby="accountModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="accountModalLabel">
                                {selectedAccount ? (isEdit ? "Edit Account" : "View Account") : "Add Account"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Username</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedAccount ? selectedAccount.username : newAccount.username}
                                    onChange={(e) =>
                                        selectedAccount
                                            ? setSelectedAccount({ ...selectedAccount, username: e.target.value })
                                            : setNewAccount({ ...newAccount, username: e.target.value })
                                    }
                                    disabled={!isEdit && selectedAccount}
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={selectedAccount ? selectedAccount.email : newAccount.email}
                                    onChange={(e) =>
                                        selectedAccount
                                            ? setSelectedAccount({ ...selectedAccount, email: e.target.value })
                                            : setNewAccount({ ...newAccount, email: e.target.value })
                                    }
                                    disabled={!isEdit && selectedAccount}
                                />
                            </div>
                            <div className="form-group">
                                <label>Branch</label>
                                <select
                                    className="form-control"
                                    value={selectedAccount ? selectedAccount.branchID : newAccount.branchID}
                                    onChange={(e) =>
                                        selectedAccount
                                            ? setSelectedAccount({ ...selectedAccount, branchID: e.target.value })
                                            : setNewAccount({ ...newAccount, branchID: e.target.value })
                                    }
                                    disabled={!isEdit && selectedAccount}
                                >
                                    <option value="">-- Select Branch --</option>
                                    {branches.map((branch) => (
                                        <option key={branch.branchID} value={branch.branchID}>
                                            {branch.address}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer">
                            {isEdit || !selectedAccount ? (
                                <button type="button" className="btn btn-primary" onClick={saveAccount} data-bs-dismiss="modal">
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

export default AdminAccount;
