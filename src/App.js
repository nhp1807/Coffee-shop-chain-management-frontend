import './App.css';
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Navbar from './layout/Navbar';
import Home from './pages/Home';
import CreateAccount from './entity/accounts/CreateAccount';
import { BrowserRouter, Routes, Route, Router } from 'react-router-dom';
import UpdateAccount from './entity/accounts/UpdateAccount';
import ViewAccount from './entity/accounts/ViewAccount';
import LoginForm from './pages/LoginForm';
import AdminHome from './pages/AdminHome';
import ManagerHome from './pages/ManagerHome';

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        {/* <Navbar /> */}
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route exact path="/home" element={<Home />} />
          <Route exact path="/login" element={<LoginForm />} />
          <Route exact path="/admin/home" element={<AdminHome />} />
          <Route exact path="/manager/home" element={<ManagerHome />} />
          <Route exact path="/viewaccount/:id" element={<ViewAccount />} />
          <Route exact path="/createaccount" element={<CreateAccount />} />
          <Route exact path="/updateaccount/:id" element={<UpdateAccount />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
