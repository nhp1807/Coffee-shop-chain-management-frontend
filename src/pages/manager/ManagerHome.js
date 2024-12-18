import React, { useEffect, useState } from "react";
import axios from "axios";
import ManagerSideBar from "../../components/sidebar/ManagerSideBar";
import { BASE_URL, BASE_URL_FRONTEND } from "../../config";
import "../../assets/styles/Statistic.css";

const ManagerHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [branchStats, setBranchStats] = useState(null);
  const [showProductStats, setShowProductStats] = useState(false);
  const [showBranchStats, setShowBranchStats] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchDashboardData = async () => {
    try {
      const branchID = localStorage.getItem("branchID");
      const response = await axios.get(`${BASE_URL}/api/dashboard/manager/get/${branchID}`);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const handleDateChange = () => {
    if (showProductStats) {
      // fetchProductStats();
    }
    if (showBranchStats) {
      // fetchBranchStats();
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <div>
        <ManagerSideBar />
        <div className="content">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <ManagerSideBar />
      <div className="content">
        <h2>Dashboard</h2>
        
        {/* Date Filter Section */}
        <div className="date-filter">
          <div className="date-input-group">
            <label>Start Date:</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </div>
          <div className="date-input-group">
            <label>End Date:</label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>
          <button onClick={handleDateChange}>Apply Filter</button>
        </div>

        <div className="dashboard-grid">

          {/* Employee Card */}
          <a href={`${BASE_URL_FRONTEND}/manager/employee`}>
            <div className="dashboard-card">
              <h3>Total Employees</h3>
              <p>{dashboardData.totalEmployees}</p>
            </div>
          </a>

          {/* Export Orders Card */}
          <a href={`${BASE_URL_FRONTEND}/manager/export-order`}> 
            <div className="dashboard-card">
              <h3>Total Export Orders</h3>
              <p>{dashboardData.totalExportOrders}</p>
            </div>
          </a>

          {/* Import Orders Card */}
          <a href={`${BASE_URL_FRONTEND}/manager/import-order`}>
            <div className="dashboard-card">
              <h3>Total Import Orders</h3>
              <p>{dashboardData.totalImportOrders}</p>
            </div>
          </a>

          {/* Revenue Card */}
          <div className="dashboard-card">
            <h3>Total Revenue</h3>
            <p>${dashboardData.totalRevenue}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManagerHome;