import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ManagerSideBar from "../../components/sidebar/ManagerSideBar";

const Timesheet = () => {
    const [timesheets, setTimesheets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [branchAddress, setBranchAddress] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // State cho thanh tìm kiếm
    const branchID = localStorage.getItem("branchID"); // Lấy branchId từ localStorage

    useEffect(() => {
        if (branchID) {
            loadTimesheets(branchID);
            loadBranchInfo(branchID);
            loadEmployees();
        }
    }, [branchID]);

    const loadTimesheets = async (branchID) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/timesheet/get/branch/${branchID}`);

            // format date to dd/mm/yyyy HH:mm:ss
            response.data.data.forEach((timesheet) => {
                const date = new Date(timesheet.date);
                timesheet.date = date.toLocaleString();
            });

            setTimesheets(response.data.data);
        } catch (error) {
            console.error("Failed to load timesheets:", error);
        }
    };

    const loadBranchInfo = async (branchID) => {
        try {
            const response = await axios.get(`http://localhost:8080/api/branch/get/${branchID}`);
            setBranchAddress(response.data.data.address);
        } catch (error) {
            console.error("Failed to load branch information:", error);
        }
    };

    const loadEmployees = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/employee/get/all");
            setEmployees(response.data.data);
        } catch (error) {
            console.error("Failed to load employees:", error);
        }
    };

    const getEmployeeName = (employeeId) => {
        const employee = employees.find((emp) => emp.employeeID === employeeId);
        return employee ? employee.name : "N/A";
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredTimesheets = timesheets.filter((timesheet) => {
        const employeeName = getEmployeeName(timesheet.employeeId).toLowerCase();
        return employeeName.includes(searchQuery);
    });

    return (
        <div className="admin-page">
            <ManagerSideBar />

            <div className="content">
                <div className="header">
                    <h1>Timesheets</h1>
                </div>

                <div className="menu">
                    <h3>Branch Timesheets</h3>
                    <p>Home > Timesheets</p>

                    {/* Thanh tìm kiếm */}
                    <div className="search-container">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Search by employee name..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="form-control"
                        />
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Shift</th>
                            <th>Employee</th>
                            <th>Branch</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTimesheets.map((timesheet, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{timesheet.date}</td>
                                <td>{timesheet.shift}</td>
                                <td>{getEmployeeName(timesheet.employeeId)}</td>
                                <td>{branchAddress}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Timesheet;
