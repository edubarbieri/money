import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'reducers/global/globalAction';
import { bundle } from 'i18n/bundle';
import ExtractRecurrency from './fragments/ExtractRecurrency';
import { setEditCredit, setRemoveCreditConfirmation, setRemoveCredit, setCreditsFilter } from 'reducers/credit/creditAction';
import { setEditDebit, setRemoveDebitConfirmation, setRemoveDebit, setDebitFilter } from 'reducers/debit/debitAction';
import Modal from 'components/global/fragments/Modal';
import CreditEditor from './fragments/credit/CreditEditor';
import { isMobile } from 'services/Util';
import { fetchCategoriesWithPath } from 'reducers/category/categoryAction';
import ErrorAlert from 'components/global/ErrorAlert';
import CreditList from './fragments/credit/CreditList';
import CreditTable from './fragments/credit/CreditTable';
import ExtractDateSelect from './fragments/ExtractDateSelect';
import moment from 'moment';
import DebitList from './fragments/debit/DebitList';
import DebitTable from './fragments/debit/DebitTable';
import DebitEditor from './fragments/debit/DebitEditor';

const Credit = () => {
    const dispatch = useDispatch();
    const year = moment().get('year');
    const month = moment().month();
    const removeCredit = useSelector(state => state.credit.removeCredit);
    const removeDebit = useSelector(state => state.debit.removeDebit);
    const resize = useSelector(state => state.global.resize);
    const wallet = useSelector(state => state.wallet.wallet);
    const [showEditors, setShowEditors] = useState(!!wallet);

    useEffect(() => {
        setShowEditors(!!wallet.id);
    }, [wallet]);

    const [filter, setFilter] = useState({
        withCategory: true,
        withUser: true,
        pageSize: isMobile(resize) ? 10 : 15,
        page: 1,
        order: 'entryDate_ASC',
        year: year,
        month: month + 1
    });

    useEffect(() => {
        dispatch(setLoading(false));
        dispatch(fetchCategoriesWithPath());
    }, [dispatch]);

    useEffect(() => {
        dispatch(setCreditsFilter(filter));
        dispatch(setDebitFilter(filter));
    }, [filter, dispatch]);

    return (
        <div className="container-fluid">
            <div className="row">
                <h1 className="page-title">{bundle('opened.bills')}</h1>
            </div>
            {showEditors && <div className="row">
                <div className=" mobile-two-buttons">
                    <button
                        type="button"
                        className="btn btn-primary btn-sm mobile-100"
                        onClick={() => dispatch(setEditCredit({}))}>
                        {bundle('add.credit')}
                    </button>
                    <button
                        type="button"
                        className="btn btn-danger ml-2 btn-sm mobile-100"
                        onClick={() => dispatch(setEditDebit({}))}>
                        {bundle('add.debit')}
                    </button>
                </div>
                <ExtractRecurrency />
            </div>}
            <div className="row">
                <div className="col-12 p-0">
                    <div className="row">
                        <div className="col-12 mt-3">
                            <ExtractDateSelect filter={filter} setFilter={setFilter}  className="mobile-dateselector" />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-3">
                            <div className="content">
                                <h5 className="text-primary m-1 font-weight-bold">{bundle('credits')}</h5>
                                {isMobile(resize) ? (
                                    <CreditList filterData={filter} />
                                ) : 
                                    <CreditTable filterData={filter} />
                                }
                            </div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12 mt-3">
                            <div className="content">
                                <h5 className="text-danger m-1 font-weight-bold">{bundle('debits')}</h5>
                                {isMobile(resize) ? (
                                    <DebitList filterData={filter}/>
                                ) : (
                                    <DebitTable filterData={filter}/>
                                )}
                            </div>
                        </div>
                    </div>
                    <ErrorAlert errorKey="credit" />
                    <ErrorAlert errorKey="debit" />
                    
                </div>
            </div>
            <CreditEditor />
            <DebitEditor />
            {removeCredit && (
                <Modal title={bundle('remove.credit')} setShow={() => dispatch(setRemoveCreditConfirmation(null))}>
                    <p>{bundle('remove.credit.confirmation', removeCredit.description)}</p>
                    <div className="modal-footer p10">
                        <button
                            type="button"
                            className="btn btn btn-outline-secondary btn-sm"
                            onClick={() => dispatch(setRemoveCreditConfirmation(null))}>
                            {bundle('cancel')}
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => dispatch(setRemoveCredit(removeCredit))}>
                            {bundle('remove')}
                        </button>
                    </div>
                </Modal>
            )}
            {removeDebit && (
                <Modal title={bundle('remove.debit')} setShow={() => dispatch(setRemoveDebitConfirmation(null))}>
                    <p>{bundle('remove.debit.confirmation', removeDebit.description)}</p>
                    <div className="modal-footer p10">
                        <button
                            type="button"
                            className="btn btn btn-outline-secondary btn-sm"
                            onClick={() => dispatch(setRemoveDebitConfirmation(null))}>
                            {bundle('cancel')}
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger btn-sm"
                            onClick={() => dispatch(setRemoveDebit(removeDebit))}>
                            {bundle('remove')}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Credit;
