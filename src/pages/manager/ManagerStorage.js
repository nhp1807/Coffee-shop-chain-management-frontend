import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css"; // Sử dụng lại CSS từ AdminObject
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import ManagerSideBar from "../../components/sidebar/ManagerSideBar";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";
import CheckResponse from "../../api/CheckResponse";

const ManagerStorage = () => {
    const [storages, setStorages] = useState([]);
    const branchID = localStorage.getItem("branchID"); // Lấy branchID từ localStorage
    const [branchAddress, setBranchAddress] = useState(""); // Địa chỉ chi nhánh
    const navigate = useNavigate();

    useEffect(() => {
        if (branchID) {
            loadBranchAddress(branchID);
            loadStorages(branchID);
        }
    }, [branchID]);

    const loadBranchAddress = async (branchID) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/branch/get/${branchID}`);

            setBranchAddress(response.data.data.address);
        } catch (error) {
            console.error("Failed to load branch address:", error);
        }
    };

    const loadStorages = async (branchID) => {
        try {
            const response = await axios.get(`${BASE_URL}/api/storage/get/branch/${branchID}`);
            const storages = response.data.data;

            // Lấy thêm thông tin Material cho mỗi storage
            const updatedStorages = await Promise.all(
                storages.map(async (storage) => {
                    const materialResponse = await axios.get(`${BASE_URL}/api/material/get/${storage.materialID}`);
                    return { ...storage, materialName: materialResponse.data.data.name };
                })
            );

            console.log(updatedStorages);

            setStorages(updatedStorages);
        } catch (error) {
            console.error("Failed to load storages:", error);
        }
    };

    const handleOrder = () => {
        navigate("/manager/import-order"); // Điều hướng tới trang Import Order
    };

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
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Material</th>
                            <th>Quantity</th>
                            <th>Branch ID</th>
                        </tr>
                    </thead>
                    <tbody>
                        {storages.map((storage, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{storage.materialName}</td>
                                <td>{storage.quantity}</td>
                                <td>{storage.branchID}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ManagerStorage;