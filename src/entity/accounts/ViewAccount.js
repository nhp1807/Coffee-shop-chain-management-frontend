import React, { useEffect, useState } from 'react'
import axios from 'axios';
import {Link, useNavigate, useParams } from 'react-router-dom';

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
        <div className="container">
            <div className="row">
                <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
                    <h2 className="text-center m-4">Account Information</h2>

                    <div className='card'>
                        <div className='card-header'>
                            Details of account:
                            <ul className='list-group list-group-flush'>
                                <li className='list-group-item'>
                                    <b>Username: </b>
                                    {account.username}
                                </li>
                                <li className='list-group-item'>
                                    <b>Role: </b>
                                    {account.role}
                                </li>
                                <li className='list-group-item'>
                                    <b>ChatID: </b>
                                    {account.chatID}
                                </li>
                                <li className='list-group-item'>
                                    <b>Email: </b>
                                    {account.email}
                                </li>
                                <li className='list-group-item'>
                                    <b>BranchID: </b>
                                    {account.branchID}
                                </li>
                            </ul>
                        </div>
                    </div>
                    <Link className='btn btn-primary my-2' to = {"/"}>Back to home</Link>
                </div>
            </div>
        </div>
    )
}
