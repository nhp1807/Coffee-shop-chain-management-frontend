import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import AdminAccount from './pages/admin/AdminAccount';
import CreateAccount from './entity/accounts/CreateAccount';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
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

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route exact path="/" element={<LoginForm />} />
          
          <Route exact path="/login" element={<LoginForm />} />
          <Route exact path="/admin/home" element={<AdminHome />} />
          <Route exact path="/admin/account" element={<AdminAccount />} />
          <Route exact path="/admin/branch" element={<AdminBranch />} />
          <Route exact path="/admin/product" element={<AdminProduct />} />
          <Route exact path="/admin/product/detail/:productId" element={<ProductDetail />} />
          <Route exact path="/admin/material" element={<AdminMaterial />} />
          <Route exact path="/admin/supplier" element={<AdminSupplier />} />
          <Route exact path="/admin/import-order" element={<AdminImportOrder />} />
          <Route exact path="/admin/import-order/detail/:importOrderId" element={<AdminImportOrderDetail />} />
          <Route exact path="/admin/employee" element={<AdminEmployee />} />
          <Route exact path="/admin/account/get/:id" element={<ViewAccount />} />

          <Route exact path="/manager/home" element={<ManagerHome />} />
          <Route exact path="/manager/employee" element={<ManagerEmployee />} />
          <Route exact path="/manager/import-order" element={<ManagerImportOrder />} />
          <Route exact path="/manager/import-order/detail/:importOrderId" element={<ManagerImportOrderDetail />} />

          <Route exact path="/viewaccount/:id" element={<ViewAccount />} />
          <Route exact path="/createaccount" element={<CreateAccount />} />
          <Route exact path="/updateaccount/:id" element={<UpdateAccount />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
