import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { Link, useParams} from 'react-router-dom';

export default function Home() {

    const [accounts, setAccounts] = useState([]);

    const {id} = useParams()

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        const result = await axios.get("http://localhost:8080/api/account/get/all");
        setAccounts(result.data.data);
    }

    const deleteAccount = async (id) => {
        await axios.delete(`http://localhost:8080/api/account/delete/${id}`)
        loadAccounts()
    }

    return (
        <div className='container'>
            <div className='py-4'>
                <table className="table border shadow">
                    <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Username</th>
                            <th scope="col">Role</th>
                            <th scope="col">Email</th>
                            <th scope="col">BranchID</th>
                            <th scope="col">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            accounts.map((account, index) => (
                                <tr>
                                    <th scope="row" key={index}>{index + 1}</th>
                                    <td>{account.username}</td>
                                    <td>{account.role}</td>
                                    <td>{account.email}</td>
                                    <td>{account.branchID}</td>
                                    <td>
                                        <Link to={`/viewaccount/${account.accountID}`} className="btn btn-primary mx-2">View</Link>
                                        <Link to={`/updateaccount/${account.accountID}`} className="btn btn-warning mx-2">Edit</Link>
                                        <button onClick={()=> deleteAccount(account.accountID)} className="btn btn-danger mx-2">Delete</button>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}
