import { Button } from 'bootstrap'
import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import ConfirmationPopup from './ConfirmationPopup';

export default function Navbar() {
    const [showPopup, setShowPopup] = useState(false);

    // Hàm xử lý khi người dùng nhấn nút "Yes"
    const handleConfirm = () => {
        // Logic xử lý logout ở đây
        console.log('Logging out...');
        setShowPopup(false);
        window.location.href = '/login';  // Điều hướng về trang login
    };

    // Hàm xử lý khi người dùng nhấn nút "No"
    const handleCancel = () => {
        setShowPopup(false);  // Đóng popup khi nhấn "No"
    };

    return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Coffee Shop Chain Management</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <Link
            to="#"
            className="btn btn-danger"
            onClick={() => setShowPopup(true)}  // Mở popup khi nhấn logout
          >
            Logout
          </Link>
        </div>
      </nav>

      {/* Hiển thị popup xác nhận khi cần */}
      <ConfirmationPopup
        show={showPopup}
        message="Bạn có chắc chắn muốn đăng xuất?"
        onConfirm={handleConfirm}
        onCancel={handleCancel}
      />
    </div>
  );
}
