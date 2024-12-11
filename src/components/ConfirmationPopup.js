import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConfirmationPopup({ show, message, onConfirm, onCancel }) {
  const navigate = useNavigate();  // Hook để điều hướng trang

  if (!show) return null;

  // Hàm xử lý khi xác nhận (Yes)
  const handleConfirm = () => {
    onConfirm(); // Nếu có callback từ ngoài, gọi nó
    navigate('/login'); // Điều hướng đến trang login
  };

  // Hàm xử lý khi hủy bỏ (No)
  const handleCancel = () => {
    onCancel(); // Nếu có callback từ ngoài, gọi nó
  };

  return (
    <div className="popup-overlay">
      <div className="popup-content">
        <h5>{message}</h5>
        <div>
          <button className="btn btn-success" onClick={handleConfirm}>Yes</button>
          <button className="btn btn-danger" onClick={handleCancel}>No</button>
        </div>
      </div>
    </div>
  );
}
