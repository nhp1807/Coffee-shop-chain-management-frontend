import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css";
import AdminSideBar from "../../components/sidebar/AdminSideBar";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../config";
import CheckResponse from "../../api/CheckResponse";

const AdminProduct = () => {
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/api/product/get/all`);
            const products = result.data.data || [];

            console.log("Products:", products);

            // Lấy danh sách Material và Product tương ứng
            const [materialsRes] = await Promise.all([ 
                axios.get(`${BASE_URL}/api/material/get/all`),
            ]);
            const materials = materialsRes.data.data || [];

            const materialMap = materials.reduce((acc, material) => {
                acc[material.materialID] = material.name;
                return acc;
            }, {});

            // Enrich dữ liệu sản phẩm với tên Material
            const enrichedProducts = products.map((product) => ({
                ...product,
                materials: product.productMaterials.map((pm) => ({
                    ...pm,
                    materialName: materialMap[pm.materialID] || "Unknown Material",
                })),
            }));

            console.log("Enriched Products:", enrichedProducts);

            setProducts(enrichedProducts);
        } catch (error) {
            console.error("Error loading products:", error);
        }
    };

    const handleAddProduct = () => {
        navigate("/admin/product/detail/new");
    };

    const handleViewEditProduct = (productId) => {
        navigate(`/admin/product/detail/${productId}`);
    };

    const handleDeleteProduct = async (productId) => {
        try {
            const reponse = await axios.delete(`${BASE_URL}/api/product/delete/${productId}`);
            CheckResponse(reponse);
            loadProducts();
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    };

    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="admin-page">
            <AdminSideBar />
            <div className="content">
                <div className="header">
                    <h1>Products</h1>
                    <button className="add-item-btn" onClick={handleAddProduct}>
                        + Add Product
                    </button>
                </div>

                <div className="menu">
                    <h3>Product Management</h3>
                    <p>Home > Products</p>
                    <div className="search-container">
                        <i className="bi bi-search"></i>
                        <input
                            type="text"
                            placeholder="Search products..."
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <table className="table">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th className="price-column">Price</th>
                            <th className="image-column">Image</th>
                            <th>Recipe</th>
                            <th className="actions-column">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
                                <td>{product.name}</td>
                                <td>{product.description}</td>
                                <td className="price-column">{product.price} VNĐ</td>
                                <td className="image-column"><img src={product.image} alt={product.name} width="100" /></td>
                                <td>{product.recipe}</td>
                                <td className="actions-column">
                                    <button
                                        className="action-btn"
                                        onClick={() => handleViewEditProduct(product.productID)}
                                    >
                                        View/Edit
                                    </button>
                                    <button
                                        className="action-btn"
                                        onClick={() => handleDeleteProduct(product.productID)}
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminProduct;