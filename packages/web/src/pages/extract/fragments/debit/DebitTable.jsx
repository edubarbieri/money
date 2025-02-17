import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bundle } from 'i18n/bundle';
import moment from 'moment';
import { formatCurrency } from 'services/Util';
import Pagination from 'components/global/fragments/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { fetchDebits, setEditDebit, setRemoveDebitConfirmation, setDebitFilter, fetchTotalDebits } from 'reducers/debit/debitAction';

const DebitTable = ({filterData}) => {
    const dispatch = useDispatch();
    const debits = useSelector(state => state.debit.all);
    const refresh = useSelector(state => state.debit.refresh);
    const wallet = useSelector(state => state.wallet.wallet);
    const filter = useSelector(state => state.debit.filter);
    const totalMonth = useSelector(state => state.debit.totalMonth);
    const [sorter, setSorter] = useState({});

    useEffect(() => {
        if(!filter || !filter.month){
            return;
        }
        dispatch(fetchDebits(filter));
        dispatch(fetchTotalDebits(filter));
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
            dispatch(setDebitFilter({ ...filterData , order: property + '_DESC' }));
            return;
        }
        auxJson[property] = 'ASC';
        setSorter(auxJson);
        dispatch(setDebitFilter({ ...filterData , order: property + '_ASC' }));
    };

    const getRecurrency = (debit) => {
        return (debit.recurrentTotal) ? `${debit.recurrentCount}${bundle('of')}${debit.recurrentTotal || 0}` : (debit.recurrent) ? bundle('yes') : bundle('no');
    }

    const actionsButtons = debit => {
        return [
            <div
                key="edit"
                onClick={() => dispatch(setEditDebit(debit))}
                className={debit.paymentDate ? 'disabled row-options edit' : 'row-options edit'}>
                <FontAwesomeIcon icon={faEdit} />
                <label>{bundle('edit')}</label>
            </div>,
            <div key="remove" onClick={() => dispatch(setRemoveDebitConfirmation(debit))} className="row-options remove">
                <FontAwesomeIcon icon={faTrashAlt} />
                <label>{bundle('remove')}</label>
            </div>
        ];
    };
    return (
        <div className="mt-3">
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
                                <th className="sorter" onClick={() => toogleSorter('entryDate')}>
                                    {bundle('date')}
                                    <FontAwesomeIcon icon={faSort} />
                                </th>
                                <th className="sorter" onClick={() => toogleSorter('category.name')}>
                                    {bundle('category')}
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
                            {debits.data &&
                                debits.data.map(debit => (
                                    <tr key={debit.id}>
                                        <td>{debit.description}</td>
                                        <td>{formatCurrency(Number(debit.amount).toFixed(2))}</td>
                                        <td>{formatDate(debit.entryDate)}</td>
                                        <td>{debit.category && debit.category.name}</td>
                                        <td>{debit.user && debit.user.name}</td>
                                        <td>{getRecurrency(debit)}</td>
                                        <td>
                                            <div className="actions-container">
                                                {actionsButtons(debit)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {debits.data && (
                <div className="row">
                    <div className="col-12">
                        <div className="content mb-0 boxshadowless text-right">
                            <span className="ml-3 font-weight-bold text-danger">{bundle('total.speding')}:</span>
                            <span className="ml-1 font-weight-bold">{formatCurrency(Number(totalMonth.amount).toFixed(2))}</span>
                        </div>
                    </div>
                </div>
            )}
            <div className="row">
                <div className="col-12">
                    <div>
                        <Pagination
                            className="danger"
                            page={filterData.page}
                            setPage={page => dispatch(setDebitFilter({ ...filter, page: page }))}
                            totalPages={debits.totalPages}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DebitTable;
