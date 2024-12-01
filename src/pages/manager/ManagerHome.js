import React from "react";
import ManagerSideBar from "../../components/sidebar/ManagerSideBar";

const ManagerHome = () => {
  return (
    <div>
      <ManagerSideBar />
      <h1>Chào mừng Manager!</h1>
      <p>Đây là trang chủ của người quản lý.</p>
      {/* Thêm các tính năng và thông tin riêng cho Manager ở đây */}
    </div>
  );
};

export default ManagerHome;
