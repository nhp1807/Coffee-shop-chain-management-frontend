import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {Link, useNavigate, useParams } from 'react-router-dom';
import AdminSideBar from '../../components/sidebar/AdminSideBar';
import '../../assets/styles/ViewAccount.css';

export default function ViewAccount() {
    
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

    useEffect(() =>{
        loadAccount()
    },[])

    const loadAccount = async () => {
        const result = await axios.get(`http://localhost:8080/api/account/get/${id}`)
        setAccount(result.data.data)
    }

    return (
        <div className="admin-page">
    <AdminSideBar />
    <div className="content">
        <div className="menu">
            <h3>Account Information</h3>
            <p>Home > Accounts > View</p>
            <div className="view-account">
                {Object.entries(account).map(([key, value]) => (
                    <div className="view-account-item" key={key}>
                        <label>{key.charAt(0).toUpperCase() + key.slice(1)}</label>
                        <p>{value}</p>
                    </div>
                ))}
            </div>
        </div>
    </div>
</div>

    )
}
