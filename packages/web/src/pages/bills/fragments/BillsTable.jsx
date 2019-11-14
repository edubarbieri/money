import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bundle } from 'i18n/bundle';
import moment from 'moment';
import { fetchBills, setRemoveBillConfirmation, setEditBill, setPayBill, fetchTotalBills } from 'reducers/bills/billsAction';
import { formatCurrency } from 'services/Util';
import Pagination from 'components/global/fragments/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort, faFileInvoiceDollar } from '@fortawesome/free-solid-svg-icons';
import BillsDateSelect from './BillsDateSelect';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';

const BillsTable = () => {
    const dispatch = useDispatch();
    const year = moment().get('year');
    const month = moment().month();
    const bills = useSelector(state => state.bills.all);
    const totalMonth = useSelector(state => state.bills.totalMonth);
    const refresh = useSelector(state => state.bills.refresh);
    const wallet = useSelector(state => state.wallet.wallet);
    const [filter, setFilter] = useState({
        withCategory: true,
        withUser: true,
        pageSize: 20,
        page: 1,
        order: 'dueDate_ASC',
        year: year,
        month: month + 1
    });

    const [sorter, setSorter] = useState({});

    useEffect(() => {
        dispatch(fetchBills(filter));
        dispatch(fetchTotalBills(filter));
    }, [dispatch, filter, refresh, wallet]);

    const formatDate = date => {
        if (!date) {
            return;
        }
        return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    };

    const toogleSorter = property => {
        const currentSorter = sorter[property];
        const auxJson = {};
        if (currentSorter === 'ASC') {
            auxJson[property] = 'DESC';
            setSorter(auxJson);
            setFilter({ ...filter, order: property + '_DESC' });
            return;
        }
        auxJson[property] = 'ASC';
        setSorter(auxJson);
        setFilter({ ...filter, order: property + '_ASC' });
    };

    const getRecurrency = (bill) => {
        return (bill.recurrentTotal) ? `${bill.recurrentCount}${bundle('of')}${bill.recurrentTotal || 0}` : (bill.recurrent) ? bundle('yes') : bundle('no');
    }

    const actionsButtons = bill => {
        return [
            <div
                key="edit"
                onClick={() => dispatch(setEditBill(bill))}
                className={bill.paymentDate ? 'disabled row-options edit' : 'row-options edit'}>
                <FontAwesomeIcon icon={faEdit} />
                <label>{bundle('edit')}</label>
            </div>,
            <div key="remove" onClick={() => dispatch(setRemoveBillConfirmation(bill))} className="row-options remove">
                <FontAwesomeIcon icon={faTrashAlt} />
                <label>{bundle('remove')}</label>
            </div>,
            <div
                key="pay"
                className={bill.paymentDate ? 'disabled row-options plus' : 'row-options plus'}
                onClick={() => dispatch(setPayBill(bill))}>
                <FontAwesomeIcon icon={faFileInvoiceDollar} />
                <label>{bundle('payed')}</label>
            </div>
        ];
    };
    return (
        <div className="mt-3">
            <div className="row">
                <div className="col-12">
                    <BillsDateSelect filter={filter} setFilter={setFilter} />
                </div>
            </div>
            <div className="row">
                <div className="col-12">
                    <table className="table table-striped table-responsive-sm custom-table danger">
                        <thead>
                            <tr>
                                <th className="sorter" onClick={() => toogleSorter('description')}>
                                    {bundle('description')}
                                    <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th className="sorter" onClick={() => toogleSorter('amount')}>
                                    {bundle('value')}
                                    <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th className="sorter" onClick={() => toogleSorter('dueDate')}>
                                    {bundle('due.date')}
                                    <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th className="sorter" onClick={() => toogleSorter('paymentDate')}>
                                    {bundle('payment.date')}
                                    <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th className="sorter" onClick={() => toogleSorter('category.name')}>
                                    {bundle('category')}
                                    <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th className="sorter" onClick={() => toogleSorter('amountPaid')}>
                                    {bundle('value.payed')}
                                    <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th className="sorter" onClick={() => toogleSorter('user.name')}>
                                    {bundle('member')}
                                    <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th>{bundle('recurrency')}</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bills.data &&
                                bills.data.map(bill => (
                                    <tr key={bill.id} className={bill.isPayd ? 'disabled' : ''}>
                                        <td>{bill.description}</td>
                                        <td>{formatCurrency(Number(bill.amount).toFixed(2))}</td>
                                        <td>{formatDate(bill.dueDate)}</td>
                                        <td>{formatDate(bill.paymentDate)}</td>
                                        <td>{bill.category && bill.category.name}</td>
                                        <td>
                                            {bill.amountPaid > 0 && formatCurrency(Number(bill.amountPaid).toFixed(2))}
                                        </td>
                                        <td>{bill.user && bill.user.name}</td>
                                        <td>{getRecurrency(bill)}</td>
                                        <td>
                                            <div className="actions-container">
                                                {actionsButtons(bill)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {bills.data && (
                <div className="row">
                    <div className="col-12">
                        <div className="content boxshadowless text-right">
                            <span className="font-weight-bold text-danger">{bundle('total.payed')}:</span>
                            <span className="ml-1 font-weight-bold">{formatCurrency(Number(totalMonth.amount).toFixed(2))}</span>
                            <span className="ml-3 font-weight-bold text-danger">{bundle('total.bill')}:</span>
                            <span className="ml-1 font-weight-bold">{formatCurrency(Number(totalMonth.amountPayed).toFixed(2))}</span>
                        </div>
                    </div>
                </div>
            )}
            <div className="row">
                <div className="col-12">
                    <div>
                        <Pagination
                            className="danger"
                            page={filter.page}
                            setPage={page => setFilter({ ...filter, page: page })}
                            totalPages={bills.totalPages}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BillsTable;
