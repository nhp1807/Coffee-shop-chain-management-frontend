import React from "react";
import AdminSideBar from "../../components/sidebar/AdminSideBar";

const AdminHome = () => {
  return (
    <div>
      <AdminSideBar />
      <h1>Chào mừng Admin!</h1>
      <p>Đây là trang chủ của quản trị viên.</p>
      {/* Thêm các tính năng và thông tin riêng cho Manager ở đây */}
    </div>
  );
};

export default AdminHome;
