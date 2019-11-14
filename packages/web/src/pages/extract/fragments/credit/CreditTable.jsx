import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bundle } from 'i18n/bundle';
import moment from 'moment';
import { formatCurrency } from 'services/Util';
import Pagination from 'components/global/fragments/Pagination';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSort } from '@fortawesome/free-solid-svg-icons';
import { faEdit, faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { fetchCredits, setEditCredit, setRemoveCreditConfirmation, setCreditsFilter, fetchTotalCredits } from 'reducers/credit/creditAction';

const CreditTable = ({filterData}) => {
    const dispatch = useDispatch();
    const credits = useSelector(state => state.credit.all);
    const refresh = useSelector(state => state.credit.refresh);
    const filter = useSelector(state => state.credit.filter);
    const wallet = useSelector(state => state.wallet.wallet);
    const totalMonth = useSelector(state => state.credit.totalMonth);
    const [sorter, setSorter] = useState({});

    useEffect(() => {
        if(!filter || !filter.month){
            return;
        }
        dispatch(fetchCredits(filter));
        dispatch(fetchTotalCredits(filter));
    }, [dispatch, filter, refresh, wallet]);

    const formatDate = date => {
        if (!date) {
            return;
        }
        return moment(date, 'YYYY-MM-DD').format('DD/MM/YYYY');
    };

    const sum = key => {
        let total = 0;
        for (let index = 0; index < credits.data.length; index++) {
            const element = credits.data[index];
            total = total + element[key];
        }
        return formatCurrency(Number(total).toFixed(2));
    };

    const toogleSorter = property => {
        const currentSorter = sorter[property];
        const auxJson = {};
        if (currentSorter === 'ASC') {
            auxJson[property] = 'DESC';
            setSorter(auxJson);
            dispatch(setCreditsFilter({ ...filter, order: property + '_DESC' }));
            return;
        }
        auxJson[property] = 'ASC';
        setSorter(auxJson);
        dispatch(setCreditsFilter({ ...filter, order: property + '_ASC' }));
    };

    const getRecurrency = (credit) => {
        return (credit.recurrentTotal) ? `${credit.recurrentCount}${bundle('of')}${credit.recurrentTotal || 0}` : (credit.recurrent) ? bundle('yes') : bundle('no');
    }

    const actionsButtons = credit => {
        return [
            <div
                key="edit"
                onClick={() => dispatch(setEditCredit(credit))}
                className={credit.paymentDate ? 'disabled row-options edit' : 'row-options edit'}>
                <FontAwesomeIcon icon={faEdit} />
                <label>{bundle('edit')}</label>
            </div>,
            <div key="remove" onClick={() => dispatch(setRemoveCreditConfirmation(credit))} className="row-options remove">
                <FontAwesomeIcon icon={faTrashAlt} />
                <label>{bundle('remove')}</label>
            </div>
        ];
    };
    return (
        <div className="mt-3">
            <div className="row">
                <div className="col-12">
                    <table className="table table-striped table-responsive-sm custom-table primary">
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
                            {credits.data &&
                                credits.data.map(credit => (
                                    <tr key={credit.id}>
                                        <td>{credit.description}</td>
                                        <td>{formatCurrency(Number(credit.amount).toFixed(2))}</td>
                                        <td>{formatDate(credit.entryDate)}</td>
                                        <td>{credit.category && credit.category.name}</td>
                                        <td>{credit.user && credit.user.name}</td>
                                        <td>{getRecurrency(credit)}</td>
                                        <td>
                                            <div className="actions-container">
                                                {actionsButtons(credit)}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {credits.data && (
                <div className="row">
                    <div className="col-12">
                        <div className="content mb-0 boxshadowless text-right">
                            <span className="ml-3 font-weight-bold text-primary">{bundle('total.received')}:</span>
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
                            page={filter.page}
                            setPage={page => dispatch(setCreditsFilter({ ...filter, page: page }))}
                            totalPages={credits.totalPages}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreditTable;
