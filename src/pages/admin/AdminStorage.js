import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css"; // Sử dụng lại CSS từ AdminObject
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ManagerSideBar from "../../components/sidebar/ManagerSideBar";

const AdminStorage = () => {
    const [storages, setStorages] = useState([]);
    const [branches, setBranches] = useState([]); // Danh sách tất cả các branch
    const [searchAddress, setSearchAddress] = useState(""); // Tìm kiếm theo địa chỉ

    useEffect(() => {
        loadBranches();
        loadStorages();
    }, []);

    const loadBranches = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/branch/get/all");
            setBranches(response.data.data); // Lưu danh sách các branch
        } catch (error) {
            console.error("Failed to load branches:", error);
        }
    };

    const loadStorages = async () => {
        try {
            const response = await axios.get("http://localhost:8080/api/storage/get/all");
            const storages = response.data.data;

            // Lấy thêm thông tin Material cho mỗi storage
            const updatedStorages = await Promise.all(
                storages.map(async (storage) => {
                    const materialResponse = await axios.get(`http://localhost:8080/api/material/get/${storage.materialID}`);
                    return { ...storage, materialName: materialResponse.data.data.name };
                })
            );

            setStorages(updatedStorages);
        } catch (error) {
            console.error("Failed to load storages:", error);
        }
    };

    const handleOrder = () => {
        window.location.href = "/admin/import-order"; // Điều hướng tới trang Import Order
    };

    // Lọc các storage theo từ khóa tìm kiếm địa chỉ branch
    const filteredStorages = storages.filter((storage) => {
        // Tìm branch tương ứng với storage
        const branch = branches.find((branch) => branch.branchID === storage.branchID);
        // Kiểm tra và lọc theo địa chỉ
        return branch && branch.address.toLowerCase().includes(searchAddress.toLowerCase());
    });
    

    return (
        <div className="admin-page">
            <ManagerSideBar />

            <div className="content">
                <div className="header">
                    <h1>Storages</h1>
                    <button className="add-item-btn" onClick={handleOrder}>
                        Order
                    </button>
                </div>

                <div className="menu">
                    <h3>Storage Management</h3>
                    <p>Home > Storages</p>
                    <div className="search-container">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Search by branch address..."
                            onChange={(e) => setSearchAddress(e.target.value)}
                        />
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Material</th>
                            <th>Quantity</th>
                            <th>Branch Address</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredStorages.map((storage, index) => {
                            const branch = branches.find((branch) => branch.branchID === storage.branchID);
                            return (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{storage.materialName}</td>
                                    <td>{storage.quantity}</td>
                                    <td>{branch?.address || "Unknown"}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminStorage;
