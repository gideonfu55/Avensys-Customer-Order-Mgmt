import React, { useEffect, useState } from 'react'
import NavBar from './NavBar'
import './ES.css'
import axios from 'axios'

function ES() {
    const [ES, setES] = useState([])
    useEffect(() => {
        axios.get("https://localhost:8080/PO")
        .then((response) => {
            setES(response.data)
        })
        .catch((error) => {
            console.error(error);
        })

    console.log("ES POs: ", ES);

    });

    return (
        <div className='dashboard-body'>
            <NavBar />
            <div className='dashboard-content'>
                <table>
                    <thead>
                        <tr>
                            <th>PO #</th>
                            <th>Vendor</th>
                            <th>Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Balance Value</th>
                            <th>Total Value</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {

                        }
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ES