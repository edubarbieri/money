import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setLoading } from 'reducers/global/globalAction';
import { bundle } from 'i18n/bundle';
import BillsRecurrency from './fragments/BillsRecurrency';
import BillsTable from './fragments/BillsTable';
import { setEditBill, setRemoveBillConfirmation, setRemoveBill } from 'reducers/bills/billsAction';
import Modal from 'components/global/fragments/Modal';
import BillsEditor from './fragments/BillsEditor';
import { isMobile } from 'services/Util';
import { fetchCategoriesWithPath } from 'reducers/category/categoryAction';
import BillsPayEditor from './fragments/BillsPayEditor';
import ErrorAlert from 'components/global/ErrorAlert';
import BillsList from './fragments/BillsList';

const Bills = () => {
    const dispatch = useDispatch();
    const removeBill = useSelector(state => state.bills.removeBill);
    const resize = useSelector(state => state.global.resize);
    const wallet = useSelector(state => state.wallet.wallet);
    const [showEditors, setShowEditors] = useState(!!wallet);

    useEffect(() => {
        setShowEditors(!!wallet.id);
    }, [wallet]);
    
    useEffect(() => {
        dispatch(setLoading(false));
        dispatch(fetchCategoriesWithPath());
    }, [dispatch]);

    return (
        <div className="container-fluid">
            <div className="row">
                <h1 className="page-title">{bundle('opened.bills')}</h1>
            </div>
            {showEditors && <div className="row">
                <button
                    type="button"
                    className="btn btn-danger btn-sm mobile-100"
                    onClick={() => dispatch(setEditBill({}))}>
                    {bundle('add.bill')}
                </button>
                <BillsRecurrency />
            </div>}
            <div className="row">
                <div className="col-12 p-0">
                    <ErrorAlert errorKey="bill" />
                    {isMobile(resize) ? <BillsList /> :<BillsTable />}
                </div>
            </div>
            <BillsEditor />
            <BillsPayEditor />
            {removeBill && (
                <Modal title={bundle('remove.bill')} setShow={() => dispatch(setRemoveBillConfirmation(null))}>
                    <p>{bundle('remove.bill.confirmation', removeBill.description)}</p>
                    <div className="modal-footer p10">
                        <button type="button" className="btn btn btn-outline-secondary btn-sm"
                            onClick={() => dispatch(setRemoveBillConfirmation(null))}>
                            {bundle('cancel')}
                        </button>
                        <button type="button" className="btn btn-danger btn-sm" onClick={() => dispatch(setRemoveBill(removeBill))}>
                            {bundle('remove')}
                        </button>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default Bills;
