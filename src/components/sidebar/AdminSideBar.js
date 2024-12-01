import React, { useState } from 'react'
import { Link } from 'react-router-dom';

export default function AdminSideBar() {
    const [isProductMenuVisible, setIsProductMenuVisible] = useState(false);

    // Hàm hiển thị/ẩn menu Product
    const toggleProductMenu = () => {
        setIsProductMenuVisible(!isProductMenuVisible);
    };

    return (
        <div className="sidebar">
            <h2>LOGO</h2>
            <ul>
                <li><Link to={"/admin/home"}><button><i class="bi bi-house"></i>Home</button></Link></li>
                <li>
                    <Link><button onClick={toggleProductMenu}><i class="bi bi-cup"></i>Product</button></Link>
                    {/* Hiển thị Menu, Material, Import Order nếu isProductMenuVisible là true */}
                    {isProductMenuVisible && (
                        <ul>
                            <li><Link to={"/admin/product"}><button><i class="bi bi-menu-app"></i>Menu</button></Link></li>
                            <li><Link to={"/admin/material"}><button><i class="bi bi-feather"></i>Material</button></Link></li>
                            <li><Link to={"/manager/import-order"}><button><i class="bi bi-cart2"></i>Import Order</button></Link></li>
                        </ul>
                    )}
                </li>
                <li><Link to={"/admin/supplier"}><button><i class="bi bi-arrow-down-square"></i>Supplier</button></Link></li>
                <li><Link to={"/admin/branch"}><button><i class="bi bi-shop"></i>Branch</button></Link></li>
                <li><Link to={"/manager/employee"}><button><i class="bi bi-people-fill"></i>Employee</button></Link></li>
                <li><Link to={"/admin/account"}><button><i class="bi bi-person-circle"></i>Account</button></Link></li>
            </ul>
        </div>
    )
}
