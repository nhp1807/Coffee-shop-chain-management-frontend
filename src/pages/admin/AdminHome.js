import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminSideBar from "../../components/sidebar/AdminSideBar";
import BASE_URL from "../../config";
import "../../assets/styles/Statistic.css";

const AdminHome = () => {
  const [accountStats, setAccountStats] = useState(null);
  const [branchStats, setBranchStats] = useState(null);
  const [productStats, setProductStats] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const fetchStatistics = async () => {
    try {
      const [accountResponse, branchResponse, productResponse] = await Promise.all([
        axios.get(`${BASE_URL}/api/account/get/stat`),
        axios.post(`${BASE_URL}/api/branch/get/stat/all`, {
          startDate,
          endDate,
        }),
        axios.post(`${BASE_URL}/api/product/get/stat`, {
          startDate,
          endDate,
        }),
      ]);

      setAccountStats(accountResponse.data.data);
      setBranchStats(branchResponse.data.data);
      setProductStats(productResponse.data.data);
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  useEffect(() => {
    fetchStatistics();
  }, []);

  const handleFilterChange = () => {
    // Fetch data again with updated dates
    fetchStatistics();
  };

  return (
    <div>
      <AdminSideBar />
      <div className="content">
        {/* Bộ lọc thời gian */}
        <div className="filter-section">
          <h2>Statistic filter</h2>
          <label>
            Start date:
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End date:
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button className="action-btn" onClick={handleFilterChange}>Filter</button>
        </div>

        {/* Tổng tài khoản */}
        {accountStats && (
          <div className="stat-section">
            <h2>Account statistics</h2>
            <p>
              Total accounts: <strong>{accountStats.totalAccount}</strong>
            </p>
          </div>
        )}

        {/* Thống kê chi nhánh */}
        {branchStats && branchStats.length > 0 && (
          <div className="stat-section">
            <h2>Branch statistics</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>Branch</th>
                  <th>Total employee</th>
                  <th>Total export order</th>
                  <th>Export order revenue</th>
                  <th>Total import order</th>
                  <th>Import order cost</th>
                </tr>
              </thead>
              <tbody>
                {branchStats.map((branch) => (
                  <tr key={branch.branchID}>
                    <td>{branch.branchID}</td>
                    <td>{branch.totalEmployees}</td>
                    <td>{branch.totalExportedOrders}</td>
                    <td>{branch.totalExportedOrdersMoney}</td>
                    <td>{branch.totalImportedOrders}</td>
                    <td>{branch.totalImportedOrdersMoney}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Thống kê sản phẩm */}
        {productStats && productStats.length > 0 && (
          <div className="stat-section">
            <h2>Product statistics</h2>
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Product name</th>
                  <th>Total order</th>
                  <th>Total revenue</th>
                </tr>
              </thead>
              <tbody>
                {productStats.map((product) => (
                  <tr key={product.productID}>
                    <td>{product.productID}</td>
                    <td>{product.productName}</td>
                    <td>{product.totalSales}</td>
                    <td>{product.totalRevenue}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminHome;
