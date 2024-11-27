import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {Link, useNavigate, useParams } from 'react-router-dom';

export default function UpdateAccount() {

    let navigate = useNavigate();

    const {id} = useParams()

    const [account, setAccount] = useState({
        username: "",
        password: "",
        role: "",
        email: "",
        chatID: "",
        branchID: ""
    });

    const { username, password, role, email, chatID, branchID } = account;

    const onInputChange = (e) => {
        setAccount({ ...account, [e.target.name]: e.target.value });
    };

    useEffect(() =>{
        loadAccount()
    },[])

    const onSubmit = async (e) => {
        e.preventDefault();
        await axios.put(`http://localhost:8080/api/account/update/${id}`, account);
        navigate("/");
    };

    const loadAccount = async () => {
        const result = await axios.get(`http://localhost:8080/api/account/get/${id}`)
        setAccount(result.data.data)
    }

    return (
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Update Account</h2>
                    <form onSubmit={(e) => onSubmit(e)}>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Username</label>
                            <input readOnly type="text" className="form-control" placeholder="Enter your username" name='username' value={username} onChange={(e) => onInputChange(e)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Role</label>
                            <input readOnly type="text" className="form-control" placeholder="Enter your role" name='role' value={role} onChange={(e) => onInputChange(e)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Password</label>
                            <input type="text" className="form-control" placeholder="Enter your password" name='password' value={password} onChange={(e) => onInputChange(e)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">Email</label>
                            <input type="text" className="form-control" placeholder="Enter your email" name='email' value={email} onChange={(e) => onInputChange(e)} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="username" className="form-label">ChatID</label>
                            <input type="text" className="form-control" placeholder="Enter your branch id" name='branchID' value={chatID} onChange={(e) => onInputChange(e)} />
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
