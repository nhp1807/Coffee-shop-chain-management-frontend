import React, { useState } from 'react'
import axios from 'axios';
import {Link, useNavigate } from 'react-router-dom';
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
        await axios.post("http://localhost:8080/api/account/create", account);
        navigate("/");
    };

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Register Account</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input type="text" className="form-control" placeholder="Enter your username" name='username' value={username} onChange={(e) => onInputChange(e)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Password</label>
                            <input type="text" className="form-control" placeholder="Enter your password" name='password' value={password} onChange={(e) => onInputChange(e)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Role</label>
                            <input type="text" className="form-control" placeholder="Enter your role" name='role' value={role} onChange={(e) => onInputChange(e)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Email</label>
                            <input type="text" className="form-control" placeholder="Enter your email" name='email' value={email} onChange={(e) => onInputChange(e)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">BranchID</label>
                            <input type="text" className="form-control" placeholder="Enter your branch id" name='branchID' value={branchID} onChange={(e) => onInputChange(e)} />
                        </div>
                        <button className="btn btn-success" type="submit">Submit</button>
                        <Link to="/" className="btn btn-danger mx-2">Cancel</Link>
                    </form>
                </div>
            </div>
        </div>
    )
}
