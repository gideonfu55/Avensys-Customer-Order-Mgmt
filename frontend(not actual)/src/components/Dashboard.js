import React from 'react'
import './Dashboard.css'
import NavBar from './NavBar';
import { Link } from 'react-router-dom';

function Dashboard() {
    return (
        <div className='dashboard-body'>
            <NavBar />
            <div className='dashboard-content'>
                {/* Search Bar */}
                <form className='search'>
                    <input type='text' placeholder='Search..' className='form-control search' />
                </form>
                {/* Highlights */}
                <div className='highlight-overview'>
                    <h5>Overview</h5>
                    <div className='highlights'>
                        <div className='highlight-1'>
                            Highlight 1
                        </div>
                        <div className='highlight-2'>
                            Highlight 2
                        </div>
                        <div className='highlight-3'>
                            Highlight 3
                        </div>
                    </div>
                </div>
                {/* Add PO Button? */}
                <div className='po-creation-card'>
                    <p>Ready to create a purchase order?</p>
                    <button className='btn btn-dark' type='button'>Create PO</button>
                </div>
                {/* View Different Tables */}
                <div className='po-types'>
                    <h5>View Tables</h5>
                    <div className='po-tables'>
                        <div className='po-table-1'>
                            <h1><b>Enterprise Service</b> Purchase Orders</h1>
                            <button className='btn btn-dark' type='button'>
                                View More
                            </button>
                        </div>
                        <div className='po-table-2'>
                            <h1><b>Talent Service</b> Purchase Orders</h1>
                            <button className='btn btn-dark' type='button'>
                                View More
                            </button>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}

export default Dashboard