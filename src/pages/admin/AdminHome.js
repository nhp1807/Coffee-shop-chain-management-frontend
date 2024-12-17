import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSideBar from "../../components/sidebar/AdminSideBar";
import BASE_URL from "../../config";
import "../../assets/styles/Statistic.css";

const AdminHome = () => {
  const [dashboardData, setDashboardData] = useState(null);

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/get`);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div>
      <AdminSideBar />
      <div className="content">
        <h2>Dashboard</h2>
        {dashboardData ? (
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>Total Branches</h3>
              <p>{dashboardData.totalBranches}</p>
            </div>
            <a href="http://localhost:3000/Coffee-shop-chain-management-frontend#/admin/employee">
              <div className="dashboard-card">
                <h3>Total Employees</h3>
                <p>{dashboardData.totalEmployees}</p>
              </div>
            </a>
            <div className="dashboard-card">
              <h3>Total Products</h3>
              <p>{dashboardData.totalProducts}</p>
            </div>
            <div className="dashboard-card">
              <h3>Total Export Orders</h3>
              <p>{dashboardData.totalExportOrders}</p>
            </div>
            <a href="http://localhost:3000/Coffee-shop-chain-management-frontend#/admin/import-order">
              <div className="dashboard-card">
                <h3>Total Import Orders</h3>
                <p>{dashboardData.totalImportOrders}</p>
              </div>
            </a>
            
            <div className="dashboard-card">
              <h3>Total Revenue</h3>
              <p>${dashboardData.totalRevenue}</p>
            </div>
          </div>
        ) : (
          <p>Loading dashboard data...</p>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
