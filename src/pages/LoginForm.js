import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/LoginForm.css";  // Import file CSS

const LoginForm = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleUsernameChange = (e) => setUsername(e.target.value);
    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const formData = new FormData();
            formData.append("username", username);
            formData.append("password", password);

            const response = await axios.post("http://localhost:8080/login", formData, {
                headers: {
                    "Content-Type": "application/form",
                },
            });

            if (response.data) {
                const { role, username, branchID } = response.data;
                handleLoginSuccess(role, username, branchID);
            }
        } catch (error) {
            if (error.response && error.response.data) {
                setError(error.response.data.message || "Đăng nhập thất bại.");
            } else {
                setError("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
            }
        }
    };

    const handleLoginSuccess = (role) => {
        if (role === "ROLE_ADMIN") {
            navigate("/admin/home");
        } else if (role === "ROLE_MANAGER") {
            navigate("/manager/home");
        } else {
            navigate("/home");
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h2 className="login-title">Login</h2>
                {error && <p className="error-message">{error}</p>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username:</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={username}
                            onChange={handleUsernameChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Password:</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={password}
                            onChange={handlePasswordChange}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">Đăng nhập</button>
                </form>
            </div>
        </div>
    );
};

export default LoginForm;