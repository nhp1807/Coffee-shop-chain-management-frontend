import React, { useEffect, useState } from "react";
import axios from "axios";
import "../../assets/styles/AdminObject.css"; // Sử dụng lại CSS của AdminProduct
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import SideBar from "../../components/sidebar/AdminSideBar";

const AdminAccount = () => {
  const [accounts, setAccounts] = useState([]);
  const [branches, setBranches] = useState([]); // Danh sách branch
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedAccount, setSelectedAccount] = useState(null); // Account được chọn
  const [isEdit, setIsEdit] = useState(false); // Để phân biệt View/Edit
  const [newAccount, setNewAccount] = useState({ username: "", role: "", email: "", branchID: "" }); // Dữ liệu cho Add Account

  useEffect(() => {
    loadAccounts();
    loadBranches(); // Lấy danh sách branch
  }, []);

  const loadAccounts = async () => {
    const result = await axios.get("http://localhost:8080/api/account/get/all");
    const accountsData = result.data.data;

    // Lấy address cho từng branchID
    const accountsWithBranchAddress = await Promise.all(
      accountsData.map(async (account) => {
        const branchAddress = account.branchID ? await loadBranchName(account.branchID) : "N/A";
        return { ...account, branchAddress };
      })
    );

    setAccounts(accountsWithBranchAddress);
  };


  const loadBranches = async () => {
    const result = await axios.get("http://localhost:8080/api/branch/get/all");
    console.log("Result:" + result.data.data);
    setBranches(result.data.data);
  };

  const loadBranchName = async (branchID) => {
    const result = await axios.get(`http://localhost:8080/api/branch/get/${branchID}`);
    return result.data.data.address;
  };

  const deleteAccount = async (id) => {
    await axios.delete(`http://localhost:8080/api/account/delete/${id}`);
    loadAccounts();
  };

  const handleViewEdit = (account, isEditMode) => {
    setSelectedAccount(account);
    setIsEdit(isEditMode);
  };

  const handleAddAccount = () => {
    setSelectedAccount(null);
    setIsEdit(false);
    setNewAccount({ username: "", role: "", email: "", branchID: "" });
  };

  const saveAccount = async () => {
    if (isEdit && selectedAccount) {
      await axios.put(`http://localhost:8080/api/account/update/${selectedAccount.accountID}`, selectedAccount);
    } else {
      await axios.post("http://localhost:8080/api/account/create", newAccount);
    }
    loadAccounts();
  };

  const filteredAccounts = accounts.filter((account) =>
    account.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="admin-page">
      <SideBar />

      
    </div>
  );
};

export default AdminAccount;
