import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function ManagerSideBar() {
    const [isProductMenuVisible, setIsProductMenuVisible] = useState(false);

    // Hàm hiển thị/ẩn menu Product
    const toggleProductMenu = () => {
        setIsProductMenuVisible(!isProductMenuVisible);
    };

    return (
        <div className="sidebar">
            <div className="logo-container">
                <img src="https://static.vecteezy.com/system/resources/previews/029/177/647/non_2x/coffee-shop-logo-transparent-free-png.png" alt="Logo" className="logo" />
            </div>
            <ul>
                <li><Link to={"/manager/home"}><button><i className="bi bi-house"></i>Home</button></Link></li>
                <li><Link to={"/manager/import-order"}><button><i className="bi bi-cart2"></i>Import Order</button></Link></li>
                <li><Link to={"/manager/export-order"}><button><i className="bi bi-cart2"></i>Export Order</button></Link></li>
                <li><Link to={"/manager/employee"}><button><i className="bi bi-people-fill"></i>Employee</button></Link></li>
                <li><Link to={"/manager/timesheet"}><button><i className="bi bi-card-checklist"></i>Timesheet</button></Link></li>
                <li><Link to={"/manager/storage"}><button><i className="bi bi-archive"></i>Storage</button></Link></li>
                <li><Link to={"/"}><button><i className="bi bi-box-arrow-left"></i>Logout</button></Link></li>
            </ul>
        </div>
    )
}
