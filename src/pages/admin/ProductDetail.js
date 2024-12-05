import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import AdminSideBar from "../../components/sidebar/AdminSideBar"; // Sidebar
import "../../assets/styles/AdminObject.css"; // CSS Style
import { Modal } from "react-bootstrap";
import BASE_URL from "../../config";

const ProductDetail = () => {
    const { productID } = useParams(); // To fetch the product ID from the URL
    const navigate = useNavigate();

    const [product, setProduct] = useState({
        productID: "",
        name: "",
        description: "",
        price: 0,
        image: "",
        productMaterials: [], // List of product materials
    });
    const [materials, setMaterials] = useState([]); // Material list from API
    const [newProductMaterial, setNewProductMaterial] = useState({
        materialID: "",
        quantity: 0,
    });

    const [showModal, setShowModal] = useState(false); // To show the modal for adding new product material

    useEffect(() => {
        const loadProductData = async () => {
            try {
                // Fetch product details
                const response = await axios.get(`${BASE_URL}/product/get/${productID}`);
                setProduct(response.data.data);

                // Fetch material list
                const materialsRes = await axios.get(`${BASE_URL}/material/get/all`);
                setMaterials(materialsRes.data.data || []);
            } catch (error) {
                console.error("Error loading product or materials:", error);
            }
        };
        if (productID !== "new") {
            loadProductData();
        }
    }, [productID]);

    const handleSave = async () => {
        try {
            if (productID === "new") {
                await axios.post(`${BASE_URL}/product/create`, product);
            } else {
                await axios.put(`${BASE_URL}/product/update/${productID}`, product);
            }
            navigate("/admin/product");
        } catch (error) {
            console.error("Error saving product:", error);
        }
    };

    const addProductMaterial = async () => {
        console.log("Adding material:", newProductMaterial);
        if (!newProductMaterial.materialID || !newProductMaterial.quantity) {
            alert("Please fill in all fields before adding material.");
            return;
        }
    
        try {
            // Gửi yêu cầu thêm vật liệu vào sản phẩm
            const response = await axios.put(`${BASE_URL}/product/add-material/${productID}`, newProductMaterial);
    
            // Sau khi thêm, gọi lại API để lấy dữ liệu cập nhật của sản phẩm
            const updatedProductResponse = await axios.get(`${BASE_URL}/product/get/${productID}`);
            setProduct(updatedProductResponse.data.data);  // Cập nhật lại sản phẩm với danh sách vật liệu mới
    
            setShowModal(false); // Đóng modal
        } catch (error) {
            console.error("Error adding material:", error);
        }
    };
    
    const handleDeleteMaterial = async (materialID) => {
        try {
            await axios.delete(`${BASE_URL}/product/delete-material/${productID}/${materialID}`);
            setProduct((prevProduct) => ({
                ...prevProduct,
                productMaterials: prevProduct.productMaterials.filter((material) => material.materialID !== materialID),
            }));
        } catch (error) {
            console.error("Error deleting material:", error);
        }
    };

    return (
        <div className="admin-page">
            <AdminSideBar />
            <div className="content">
                <div className="header">
                    <h1>{productID === "new" ? "Add New Product" : "Edit Product"}</h1>
                </div>

                <div className="menu">
                    <h3>Product Detail</h3>
                    <p>Home > Products > {productID === "new" ? "New" : "Edit"}</p>
                </div>

                {/* Product Form */}
                <div className="form-group">
                    <label>Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={product.name || ""}
                        onChange={(e) => setProduct({ ...product, name: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Description</label>
                    <textarea
                        className="form-control"
                        value={product.description || ""}
                        onChange={(e) => setProduct({ ...product, description: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Price</label>
                    <input
                        type="number"
                        className="form-control"
                        value={product.price || 0}
                        onChange={(e) => setProduct({ ...product, price: e.target.value })}
                    />
                </div>

                <div className="form-group">
                    <label>Image</label>
                    <input
                        type="text"
                        className="form-control"
                        value={product.image || ""}
                        onChange={(e) => setProduct({ ...product, image: e.target.value })}
                    />
                </div>

                {/* Product Materials Table */}
                <h3>Product Materials</h3>
                <table className="table">
                    <thead>
                        <tr>
                            <th>Material</th>
                            <th>Quantity</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {product.productMaterials.length > 0 ? (
                            product.productMaterials.map((pm, index) => (
                                <tr key={index}>
                                    <td>{pm.materialName || "Unknown Material"}</td>
                                    <td>{pm.quantity}</td>
                                    <td>
                                        <button
                                            className="action-btn"
                                            onClick={() => handleDeleteMaterial(pm.materialID)}
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3" style={{ textAlign: "center" }}>
                                    No materials added
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>

                <button className="action-btn" onClick={() => setShowModal(true)}>
                    Add Material
                </button>
                <button className="action-btn" onClick={handleSave}>
                    Save
                </button>

                {/* Modal for Adding Material */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Add Material</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="form-group">
                            <label>Material</label>
                            <select
                                className="form-control"
                                value={newProductMaterial.materialID}
                                onChange={(e) => setNewProductMaterial({ ...newProductMaterial, materialID: e.target.value })}
                            >
                                <option value="">-- Select Material --</option>
                                {materials.map((material) => (
                                    <option key={material.materialID} value={material.materialID}>
                                        {material.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label>Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                value={newProductMaterial.quantity}
                                onChange={(e) => setNewProductMaterial({ ...newProductMaterial, quantity: e.target.value })}
                            />
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                        <button className="action-btn" onClick={addProductMaterial}>
                            Add Material
                        </button>
                        <button className="action-btn" onClick={() => setShowModal(false)}>
                            Close
                        </button>
                    </Modal.Footer>
                </Modal>
            </div>
        </div>
    );
};

export default ProductDetail;
