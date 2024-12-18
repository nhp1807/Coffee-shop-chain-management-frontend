import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSideBar from "../../components/sidebar/AdminSideBar";
import { BASE_URL, BASE_URL_FRONTEND } from "../../config";
import "../../assets/styles/Statistic.css";

const AdminHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [branchStats, setBranchStats] = useState(null);
  const [showProductStats, setShowProductStats] = useState(false);
  const [showBranchStats, setShowBranchStats] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/dashboard/admin/get`);
      setDashboardData(response.data.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  const fetchProductStats = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/product/get/stat`, {
        startDate: startDate || null,
        endDate: endDate || null
      });
      setProductStats(response.data.data);
    } catch (error) {
      console.error("Error fetching product statistics:", error);
    }
  };

  const fetchBranchStats = async () => {
    try {
      const response = await axios.post(`${BASE_URL}/api/branch/get/stat/all`, {
        startDate: startDate || null,
        endDate: endDate || null
      });
      setBranchStats(response.data.data);
    } catch (error) {
      console.error("Error fetching branch statistics:", error);
    }
  };

  const handleProductCardClick = () => {
    setShowProductStats(!showProductStats);
    setShowBranchStats(false);
    if (!productStats || showBranchStats) {
      fetchProductStats();
    }
  };

  const handleBranchCardClick = () => {
    setShowBranchStats(!showBranchStats);
    setShowProductStats(false);
    if (!branchStats || showProductStats) {
      fetchBranchStats();
    }
  };

  const handleDateChange = () => {
    if (showProductStats) {
      fetchProductStats();
    }
    if (showBranchStats) {
      fetchBranchStats();
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (!dashboardData) {
    return (
      <div>
        <AdminSideBar />
        <div className="content">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <AdminSideBar />
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
          {/* Branch Card */}
          <div 
            className="dashboard-card" 
            onClick={handleBranchCardClick}
            style={{ cursor: 'pointer' }}
          >
            <h3>Total Branches</h3>
            <p>{dashboardData.totalBranches}</p>
          </div>

          {/* Employee Card */}
          <a href={`${BASE_URL_FRONTEND}/admin/employee`}>
            <div className="dashboard-card">
              <h3>Total Employees</h3>
              <p>{dashboardData.totalEmployees}</p>
            </div>
          </a>

          {/* Product Card */}
          <div 
            className="dashboard-card" 
            onClick={handleProductCardClick}
            style={{ cursor: 'pointer' }}
          >
            <h3>Total Products</h3>
            <p>{dashboardData.totalProducts}</p>
          </div>

          {/* Export Orders Card */}
          <a href={`${BASE_URL_FRONTEND}/admin/export-order`}>
            <div className="dashboard-card">
              <h3>Total Export Orders</h3>
              <p>{dashboardData.totalExportOrders}</p>
            </div>
          </a>

          {/* Import Orders Card */}
          <a href={`${BASE_URL_FRONTEND}/admin/import-order`}>
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

        {/* Product Statistics Table */}
        {showProductStats && (
          <div className="stats-table-container">
            <h3>Product Statistics</h3>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Product ID</th>
                  <th>Product Name</th>
                  <th>Total Sales</th>
                  <th>Total Revenue</th>
                </tr>
              </thead>
              <tbody>
                {productStats ? (
                  productStats.map((product) => (
                    <tr key={product.productID}>
                      <td>{product.productID}</td>
                      <td>{product.productName}</td>
                      <td>{product.totalSales}</td>
                      <td>${product.totalRevenue.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">Loading statistics...</td>
                  </tr>
                )}
              </tbody>
              {productStats && (
                <tfoot>
                  <tr>
                    <td colSpan="2"><strong>Total</strong></td>
                    <td><strong>{productStats.reduce((sum, product) => sum + product.totalSales, 0)}</strong></td>
                    <td><strong>${productStats.reduce((sum, product) => sum + product.totalRevenue, 0).toLocaleString()}</strong></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}

        {/* Branch Statistics Table */}
        {showBranchStats && (
          <div className="stats-table-container">
            <h3>Branch Statistics</h3>
            <table className="stats-table">
              <thead>
                <tr>
                  <th>Branch ID</th>
                  <th>Total Employees</th>
                  <th>Exported Orders</th>
                  <th>Export Revenue</th>
                  <th>Imported Orders</th>
                  <th>Import Costs</th>
                </tr>
              </thead>
              <tbody>
                {branchStats ? (
                  branchStats.map((branch) => (
                    <tr key={branch.branchID}>
                      <td>{branch.branchID}</td>
                      <td>{branch.totalEmployees}</td>
                      <td>{branch.totalExportedOrders}</td>
                      <td>${branch.totalExportedOrdersMoney.toLocaleString()}</td>
                      <td>{branch.totalImportedOrders}</td>
                      <td>${branch.totalImportedOrdersMoney.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">Loading statistics...</td>
                  </tr>
                )}
              </tbody>
              {branchStats && (
                <tfoot>
                  <tr>
                    <td colSpan="2"><strong>Total</strong></td>
                    <td><strong>{branchStats.reduce((sum, branch) => sum + branch.totalExportedOrders, 0)}</strong></td>
                    <td><strong>${branchStats.reduce((sum, branch) => sum + branch.totalExportedOrdersMoney, 0).toLocaleString()}</strong></td>
                    <td><strong>{branchStats.reduce((sum, branch) => sum + branch.totalImportedOrders, 0)}</strong></td>
                    <td><strong>${branchStats.reduce((sum, branch) => sum + branch.totalImportedOrdersMoney, 0).toLocaleString()}</strong></td>
                  </tr>
                </tfoot>
              )}
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;