import React from 'react';
import { bundle } from 'i18n/bundle';
import { formatCurrency } from 'services/Util';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

const OverdueBillsTable = ({ overdueBills }) => {

    return (
        <table className="table custom-table danger">
            <thead>
                <tr>
                    <th scope="col"></th>
                    <th scope="col">{bundle('description')}</th>
                    <th scope="col">{bundle('due')}</th>
                    <th scope="col">{bundle('amount')}</th>
                    <th scope="col">{bundle('status')}</th>
                    <th scope="col"></th>
                </tr>
            </thead>
            <tbody>
                {overdueBills.map(bill => (
                    <tr key={bill.id}>
                        <td>
                            <FontAwesomeIcon icon={faExclamationTriangle} className="warning-icon" />
                        </td>
                        <td>{bill.description}</td>
                        <td>{moment(bill.dueDate, 'YYYY-MM-DD').format('DD/MM/YYYY')}</td>
                        <td>{formatCurrency(Number(bill.amount).toFixed(2))}</td>
                        <td>
                            {'overdue' === bill.state ? (
                                <span className="badge badge-danger">{bundle(bill.state)}</span>
                            ) : (
                                <span className="badge badge-warning">{bundle(bill.state)}</span>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default OverdueBillsTable;
