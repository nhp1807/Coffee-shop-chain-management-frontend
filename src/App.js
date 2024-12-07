import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import AdminAccount from './pages/admin/AdminAccount';
import CreateAccount from './entity/accounts/CreateAccount';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'; // Đảm bảo HashRouter được import đúng
import UpdateAccount from './entity/accounts/UpdateAccount';
import ViewAccount from './entity/accounts/ViewAccount';
import LoginForm from './pages/LoginForm';
import AdminHome from './pages/admin/AdminHome';
import AdminProduct from './pages/admin/AdminProduct';
import ManagerHome from './pages/manager/ManagerHome';
import AdminBranch from './pages/admin/AdminBranch';
import AdminSupplier from './pages/admin/AdminSupplier';
import ManagerEmployee from './pages/manager/ManagerEmployee';
import ManagerImportOrder from './pages/manager/ManagerImportOrder';
import AdminMaterial from './pages/admin/AdminMaterial';
import ManagerImportOrderDetail from './pages/manager/ImportOrderDetail';
import AdminImportOrderDetail from './pages/admin/ImportOrderDetail';
import AdminImportOrder from './pages/admin/AdminImportOrder';
import AdminEmployee from './pages/admin/AdminEmployee';
import ProductDetail from './pages/admin/ProductDetail';
import ManagerTimesheet from './pages/manager/ManagerTimesheet';
import ManagerStorage from './pages/manager/ManagerStorage';
import AdminStorage from './pages/admin/AdminStorage';
import Timesheet from './pages/employee/Timesheet';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/check-in" element={<Timesheet />} />
          <Route path="/" element={<LoginForm />} />
          <Route path="/login" element={<LoginForm />} />
          
          {/* Admin Routes */}
          <Route path="/admin/home" element={<AdminHome />} />
          <Route path="/admin/account" element={<AdminAccount />} />
          <Route path="/admin/account/get/:id" element={<ViewAccount />} />
          <Route path="/admin/branch" element={<AdminBranch />} />
          <Route path="/admin/product" element={<AdminProduct />} />
          <Route path="/admin/product/detail/:productID" element={<ProductDetail />} />
          <Route path="/admin/material" element={<AdminMaterial />} />
          <Route path="/admin/supplier" element={<AdminSupplier />} />
          <Route path="/admin/import-order" element={<AdminImportOrder />} />
          <Route path="/admin/storage" element={<AdminStorage />} />
          <Route path="/admin/import-order/detail/:importOrderID" element={<AdminImportOrderDetail />} />
          <Route path="/admin/employee" element={<AdminEmployee />} />
          
          {/* Manager Routes */}
          <Route path="/manager/home" element={<ManagerHome />} />
          <Route path="/manager/employee" element={<ManagerEmployee />} />
          <Route path="/manager/import-order" element={<ManagerImportOrder />} />
          <Route path="/manager/import-order/detail/:importOrderID" element={<ManagerImportOrderDetail />} />
          <Route path="/manager/timesheet" element={<ManagerTimesheet />} />
          <Route path="/manager/storage" element={<ManagerStorage />} />

          {/* Account Management Routes */}
          <Route path="/createaccount" element={<CreateAccount />} />
          <Route path="/updateaccount/:id" element={<UpdateAccount />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
