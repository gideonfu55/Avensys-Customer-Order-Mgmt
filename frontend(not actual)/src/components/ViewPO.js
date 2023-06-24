import React from 'react'
import './ViewPO.css'

function ViewPO() {
    return (
        <div className='modal-fade'>
            <div className="modal-dialog modal-dialog-expanded">
                {/* Current PO */}
                <div>
                    <table className='table table-light table-hover'>
                        <thead>
                            <tr>
                                <th scope="col">PO #</th>
                                <th scope="col">Client</th>
                                <th scope="col">Type</th>
                                <th scope="col">Start Date</th>
                                <th scope="col">End Date</th>
                                <th scope="col">Milestone (%)</th>
                                <th scope="col">Total Value</th>
                                <th scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>1</td>
                                <td>Avensys Consulting</td>
                                <td>Enterprise Service</td>
                                <td>01-01-2023</td>
                                <td>01-02-2024</td>
                                <td>60%</td>
                                <td>$200,000</td>
                                <td>Outstanding</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                {/* All Invoices */}
                <div>
                    <h5>Invoices</h5>
                </div>
                {/* Update PO? */}
                <div>

                </div>
            </div>


        </div>
    )
}

export default ViewPO