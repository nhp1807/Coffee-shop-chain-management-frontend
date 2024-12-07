import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css"; // Sử dụng lại CSS của AdminProduct
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AdminSideBar from "../../components/sidebar/AdminSideBar";
import BASE_URL from "../../config";
import CheckResponse from "../../api/CheckResponse";

const AdminEmployee = () => {
    const [employees, setEmployees] = useState([]);
    const [branchs, setbranchs] = useState([]); // Danh sách branch
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedEmployee, setSelectedEmployee] = useState(null); // Employee được chọn
    const [isEdit, setIsEdit] = useState(false); // Để phân biệt View/Edit
    const [newEmployee, setNewEmployee] = useState({
        name: "",
        dob: "",
        phone: "",
        email: "",
        address: "",
        branchID: "",
    });

    useEffect(() => {
        loadEmployees();
        loadbranchs(); 
    }, []);

    const loadEmployees = async () => {
        const employeeResult = await axios.get(`${BASE_URL}/api/employee/get/all`);
        const branchResult = await axios.get(`${BASE_URL}/api/branch/get/all`);
        
        // Lưu danh sách branchs
        const branches = branchResult.data.data;
    
        // Kết hợp branch address vào danh sách employees
        const employeesWithBranch = employeeResult.data.data.map((employee) => {
            const branch = branches.find((b) => b.branchID === employee.branchID);
            return {
                ...employee,
                branchAddress: branch ? branch.address : "N/A",
            };
        });

        // Format date
        employeesWithBranch.forEach((employee) => {
            const date = new Date(employee.dob);
            employee.dob = date.toLocaleDateString();
        });
    
        setEmployees(employeesWithBranch);
    };
    

    const loadbranchs = async () => {
        const result = await axios.get(`${BASE_URL}/api/branch/get/all`);
        setbranchs(result.data.data);
    };

    const deleteEmployee = async (id) => {
        const respone = await axios.delete(`${BASE_URL}/api/employee/delete/${id}`);
        CheckResponse(respone);
        loadEmployees();
    };

    const handleViewEdit = (employee, isEditMode) => {
        setSelectedEmployee(employee);
        setIsEdit(isEditMode);
    };

    const handleAddEmployee = () => {
        setSelectedEmployee(null); // Reset selected employee
        setIsEdit(false);
        setNewEmployee({
            name: "",
            dob: "",
            phone: "",
            email: "",
            address: "",
            branchID: "", // Reset branchID
        });
    };

    const saveEmployee = async () => {
        var respone;
        if (isEdit && selectedEmployee) {
            respone = await axios.put(`${BASE_URL}/api/employee/update/${selectedEmployee.employeeID}`, selectedEmployee);
        } else {
            respone = await axios.post(`${BASE_URL}/api/employee/create`, newEmployee);
        }
        CheckResponse(respone);
        loadEmployees();
    };

    const filteredEmployees = employees.filter((employee) =>
        employee.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-page">
            <AdminSideBar />

            <div className="content">
                <div className="header">
                    <h1>Employees</h1>
                    <button className="add-item-btn" data-bs-toggle="modal" data-bs-target="#employeeModal" onClick={handleAddEmployee}>
                        + Add Employee
                    </button>
                </div>

                <div className="menu">
                    <h3>Employee Management</h3>
                    <p>Home > Employees</p>
                    <div className="search-container">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Search employee..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Date of Birth</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Address</th>
                            <th>Branch</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredEmployees.map((employee, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{employee.name}</td>
                                <td>{employee.dob}</td>
                                <td>{employee.phone}</td>
                                <td>{employee.email}</td>
                                <td>{employee.address}</td>
                                <td>{employee.branchAddress || "N/A"}</td> {/* Hiển thị tên branch */}
                                <td>
                                    <button className="action-btn" data-bs-toggle="modal" data-bs-target="#employeeModal" onClick={() => handleViewEdit(employee, false)}>
                                        View
                                    </button>
                                    <button className="action-btn" data-bs-toggle="modal" data-bs-target="#employeeModal" onClick={() => handleViewEdit(employee, true)}>
                                        Edit
                                    </button>
                                    <button onClick={() => deleteEmployee(employee.employeeID)} className="action-btn">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            <div className="modal fade" id="employeeModal" tabIndex="-1" aria-labelledby="employeeModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="employeeModalLabel">
                                {selectedEmployee ? (isEdit ? "Edit Employee" : "View Employee") : "Add Employee"}
                            </h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label>Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedEmployee ? selectedEmployee.name : newEmployee.name}
                                    onChange={(e) =>
                                        selectedEmployee
                                            ? setSelectedEmployee({ ...selectedEmployee, name: e.target.value })
                                            : setNewEmployee({ ...newEmployee, name: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Date of Birth</label>
                                <input
                                    type="date"
                                    className="form-control"
                                    value={selectedEmployee ? selectedEmployee.dob : newEmployee.dob}
                                    onChange={(e) =>
                                        selectedEmployee
                                            ? setSelectedEmployee({ ...selectedEmployee, dob: e.target.value })
                                            : setNewEmployee({ ...newEmployee, dob: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedEmployee ? selectedEmployee.phone : newEmployee.phone}
                                    onChange={(e) =>
                                        selectedEmployee
                                            ? setSelectedEmployee({ ...selectedEmployee, phone: e.target.value })
                                            : setNewEmployee({ ...newEmployee, phone: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    value={selectedEmployee ? selectedEmployee.email : newEmployee.email}
                                    onChange={(e) =>
                                        selectedEmployee
                                            ? setSelectedEmployee({ ...selectedEmployee, email: e.target.value })
                                            : setNewEmployee({ ...newEmployee, email: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Address</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={selectedEmployee ? selectedEmployee.address : newEmployee.address}
                                    onChange={(e) =>
                                        selectedEmployee
                                            ? setSelectedEmployee({ ...selectedEmployee, address: e.target.value })
                                            : setNewEmployee({ ...newEmployee, address: e.target.value })
                                    }
                                />
                            </div>
                            <div className="form-group">
                                <label>Branch</label>
                                <select
                                    className="form-control"
                                    value={selectedEmployee ? selectedEmployee.branchID : newEmployee.branchID}
                                    onChange={(e) =>
                                        selectedEmployee
                                            ? setSelectedEmployee({ ...selectedEmployee, branchID: e.target.value })
                                            : setNewEmployee({ ...newEmployee, branchID: e.target.value })
                                    }
                                >
                                    <option value="">-- Select branch --</option>
                                    {branchs && branchs.map((branch) => (
                                        <option key={branch.branchID} value={branch.branchID}>
                                            {branch.address}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="modal-footer">
                            {isEdit || !selectedEmployee ? (
                                <button type="button" className="btn btn-primary" onClick={saveEmployee} data-bs-dismiss="modal">
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

export default AdminEmployee;
