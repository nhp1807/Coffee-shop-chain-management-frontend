import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ManagerSideBar from "../../components/sidebar/ManagerSideBar";
import BASE_URL from "../../config";

const AdminTimesheet = () => {
    const [timesheets, setTimesheets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // State cho thanh tìm kiếm

    useEffect(() => {
        loadTimesheets();
        loadEmployees();
    }, []);

    const loadTimesheets = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/timesheet/get/all`);

            // Format date to dd/mm/yyyy HH:mm:ss
            const formattedTimesheets = response.data.data.map((timesheet) => {
                const date = new Date(timesheet.date);
                return {
                    ...timesheet,
                    date: date.toLocaleString(),
                };
            });

            // Lấy branchAddress cho từng timesheet
            const timesheetsWithBranchInfo = await Promise.all(
                formattedTimesheets.map(async (timesheet) => {
                    try {
                        const branchResponse = await axios.get(`${BASE_URL}/api/branch/get/${timesheet.branchID}`);
                        return {
                            ...timesheet,
                            branchAddress: branchResponse.data.data.address,
                        };
                    } catch (error) {
                        console.error(`Failed to load branch info for branchID ${timesheet.branchID}:`, error);
                        return {
                            ...timesheet,
                            branchAddress: "N/A",
                        };
                    }
                })
            );

            setTimesheets(timesheetsWithBranchInfo);
        } catch (error) {
            console.error("Failed to load timesheets:", error);
        }
    };

    const loadEmployees = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/employee/get/all`);
            setEmployees(response.data.data);
        } catch (error) {
            console.error("Failed to load employees:", error);
        }
    };

    const getEmployeeName = (employeeID) => {
        const employee = employees.find((emp) => emp.employeeID === employeeID);
        return employee ? employee.name : "N/A";
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value.toLowerCase());
    };

    const filteredTimesheets = timesheets.filter((timesheet) => {
        const employeeName = getEmployeeName(timesheet.employeeID).toLowerCase();
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
                    <h3>Timesheets</h3>
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
                            <th>Branch Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTimesheets.map((timesheet, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{timesheet.date}</td>
                                <td>{timesheet.shift}</td>
                                <td>{getEmployeeName(timesheet.employeeID)}</td>
                                <td>{timesheet.branchAddress}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminTimesheet;
