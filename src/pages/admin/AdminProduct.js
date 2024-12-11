import React, { useState } from "react";
import '../../assets/styles/AdminObject.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import AdminSideBar from "../../components/sidebar/AdminSideBar";

const AdminProduct = () => {
    // Dữ liệu giả để hiển thị bảng
    const [items, setItems] = useState([
        { id: 1, title: 'A', description: 'Some Description', actions: ['View', 'Edit', 'Delete'] },
        { id: 2, title: 'B', description: 'Another Description', actions: ['View', 'Edit', 'Delete'] },
        { id: 3, title: 'C', description: 'Description C', actions: ['View', 'Edit', 'Delete'] },
        { id: 4, title: 'D', description: 'Description D', actions: ['View', 'Edit', 'Delete'] },
        { id: 5, title: 'E', description: 'Description E', actions: ['View', 'Edit', 'Delete'] },
    ]);

    // Hàm để xử lý tìm kiếm
    const handleSearch = (e) => {
        console.log(e.target.value); // Xử lý tìm kiếm
    };

    return (
        <div className="admin-page">
            <AdminSideBar />
            
            <div className="content">
                <div className="header">
                    <h1>Product</h1>
                    <button className="add-item-btn">+ Add Item</button>
                </div>

                <div className="menu">
                    <h3>Menu</h3>
                    <p>Product > Menu</p>
                    <div className="search-container">
                        <i className="bi bi-search"></i>
                        <input type="text" placeholder="Search item..." onChange={handleSearch} />
                    </div>
                </div>

                <table className="table">
                    <thead>
                    <tr>
                        <th>Table Title</th>
                        <th>A</th>
                        <th>B</th>
                        <th>C</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {items.map((item) => (
                        <tr key={item.id}>
                            <td>{item.title}</td>
                            <td>{item.description}</td>
                            <td>{item.description}</td>
                            <td>{item.description}</td>
                            <td>
                                {item.actions.map((action, index) => (
                                    <button key={index} className="action-btn">{action}</button>
                                ))}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div className="pagination">
                    <button>{"<"}</button>
                    <span>1</span>
                    <span>2</span>
                    <span>3</span>
                    <span>4</span>
                    <button>{">"}</button>
                </div>
            </div>
        </div>
    );
};

export default AdminProduct;