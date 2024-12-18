import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import AdminSideBar from "../../components/sidebar/AdminSideBar";
import {BASE_URL} from "../../config";
import { Modal, Button, Form } from "react-bootstrap";

const AdminTimesheet = () => {
    const [timesheets, setTimesheets] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [searchQuery, setSearchQuery] = useState(""); // State cho thanh tìm kiếm
    const [showModal, setShowModal] = useState(false);
    const [month, setMonth] = useState("");
    const [year, setYear] = useState("");

    useEffect(() => {
        loadTimesheets();
        loadEmployees();
    }, []);

    const loadTimesheets = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/timesheet/get/all`);

            const formattedTimesheets = response.data.data.map((timesheet) => {
                const date = new Date(timesheet.date);
                return {
                    ...timesheet,
                    date: date.toLocaleString(),
                };
            });

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

    const handleCalculateSalary = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/timesheet/calculate/salary/${month}/${year}`);
            const salaryData = response.data.data;

            console.log("Salary data:", salaryData);

            // Gửi dữ liệu sang backend để tạo file Excel và gửi email
            await axios.post(`${BASE_URL}/api/timesheet/send-salary-report`, salaryData);

            alert("Salary reports have been sent to employees' emails.");
            setMonth("");
            setYear("");
            setShowModal(false);
        } catch (error) {
            console.error("Failed to calculate salary:", error);
            alert("Failed to calculate salary. Please try again.");
        }
    };

    const filteredTimesheets = timesheets.filter((timesheet) => {
        const employeeName = getEmployeeName(timesheet.employeeID).toLowerCase();
        return employeeName.includes(searchQuery);
    });

    return (
        <div className="admin-page">
            <AdminSideBar />

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

                    {/* Nút Calculate Salary */}
                    <Button variant="primary" onClick={() => setShowModal(true)}>
                        Calculate Salary
                    </Button>
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

                {/* Modal */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Calculate Salary</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form>
                            <Form.Group>
                                <Form.Label>Month</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter month (1-12)"
                                    value={month}
                                    onChange={(e) => setMonth(e.target.value)}
                                />
                            </Form.Group>
                            <Form.Group>
                                <Form.Label>Year</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter year"
                                    value={year}
                                    onChange={(e) => setYear(e.target.value)}
                                />
                            </Form.Group>
                        </Form>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={() => setShowModal(false)}>
                            Close
                        </Button>
                        <Button variant="primary" onClick={handleCalculateSalary}>
                            Calculate
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default AdminTimesheet;
