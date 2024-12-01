import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { createAccount } from '../../api/account';
import AdminSideBar from "../../components/sidebar/AdminSideBar";
export default function CreateAccount() {


    let navigate = useNavigate();

    const [account, setAccount] = useState({
        username: "",
        password: "",
        role: "",
        email: "",
        branchID: ""
    });

    const { username, password, role, email, branchID } = account;

    const onInputChange = (e) => {
        setAccount({ ...account, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        await createAccount(account);
        navigate("/");
    };

    return (
        <div className="container">
            <AdminSideBar />
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Register Account</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" className="form-control" placeholder="Enter your username" name='username' value={username} onChange={onInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">Password</label>
                            <input type="text" className="form-control" placeholder="Enter your password" name='password' value={password} onChange={onInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="role" className="form-label">Role</label>
                            <input type="text" className="form-control" placeholder="Enter your role" name='role' value={role} onChange={onInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input type="text" className="form-control" placeholder="Enter your email" name='email' value={email} onChange={onInputChange} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="branchID" className="form-label">BranchID</label>
                            <input type="text" className="form-control" placeholder="Enter your branch id" name='branchID' value={branchID} onChange={onInputChange} />
                        </div>
                        <button className="btn btn-success" type="submit">Submit</button>
                    </form>
                </div>
            </div>
        </div>
    )
}
