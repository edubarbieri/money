import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bundle } from 'i18n/bundle';
import { setEditBill, setSaveBill } from 'reducers/bills/billsAction';
import Modal from 'components/global/fragments/Modal';
import SelectSearch from 'react-select-search';

const BillsEditor = () => {
    const dispatch = useDispatch();
    const editBill = useSelector(state => state.bills.editBill);
    const [initialized, setInitialized] = useState(false);
    const categories = useSelector(state => state.category.withPath);
    const wallet = useSelector(state => state.wallet.wallet);

    const [bill, setBill] = useState({
        description: '',
        id: '',
        amount: '0',
        dueDate: '',
        category: { id: '' },
        user: { id: '' },
        categoryId: '',
        userId: '',
        recurrent: false,
        recurrentTotal: '0'
    });

    const validateAndSave = () => {
        if(!bill.description || !bill.amount || Number(bill.amount) < 0 || !bill.dueDate){
            return;
        }
        dispatch(setSaveBill(bill));
    }

    useEffect(() => {
        setBill(editBill);
        setInitialized(true);
    }, [editBill]);

    return (
        initialized &&
        bill && (
            <Modal
                title={bill.id ? bundle('edit.bill') : bundle('add.bill')}
                setShow={() => dispatch(setEditBill(null))}>
                <form className="clear-focus">
                    <div className="form-row">
                        <div className={!bill.description ? 'col-12 form-group has-error' : 'col-12 form-group'}>
                            <label>{bundle('description')}</label>
                            <input
                                type="text"
                                className="form-control"
                                value={bill.description}
                                onChange={event => setBill({ ...bill, description: event.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className={!bill.amount ? 'col-6 form-group has-error' : 'col-6 form-group'}>
                            <label>{bundle('value')}</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">{bundle('currency')}</div>
                                </div>
                                <input
                                    type="number"
                                    className="form-control border-left-0"
                                    value={bill.amount}
                                    onChange={event => setBill({ ...bill, amount: event.target.value })}
                                />
                            </div>
                        </div>
                        <div className={!bill.dueDate ? 'col-6 form-group has-error' : 'col-6 form-group'}>
                            <label>{bundle('due.date')}</label>
                            <input
                                type="date"
                                className="form-control"
                                value={bill.dueDate}
                                onChange={event => setBill({ ...bill, dueDate: event.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-6 form-group">
                            <label>{bundle('category')}</label>
                            <SelectSearch
                                value={bill.category || bill.categoryId ? bill.categoryId || bill.category.id : ''}
                                options={categories}
                                className="select-search-box"
                                search={true}
                                onChange={value => setBill({ ...bill, categoryId: value.value })}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>{bundle('member')}</label>
                            <SelectSearch
                                value={bill.user || bill.userId ? bill.userId || bill.user.id : ''}
                                options={wallet.users}
                                className="select-search-box"
                                search={true}
                                onChange={value => setBill({ ...bill, userId: value.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-6 form-group text-center">
                            <input
                                className="styled-checkbox danger"
                                id="recurrentInpt"
                                type="checkbox"
                                checked={bill.recurrent}
                                onChange={event => setBill({ ...bill, recurrent: !bill.recurrent,  recurrentTotal: !bill.recurrent ? bill.recurrentTotal : '0'})}
                            />
                            <label htmlFor="recurrentInpt">{bundle('recurrent')}</label>
                        </div>
                        <div className="col-6 form-group">
                            <div className="row">
                                <label className="col-4 col-form-label">{bundle('installment.qtd')}:</label>
                                <div className="col-8">
                                    <input
                                        type="number"
                                        className="form-control"
                                        value={bill.recurrentTotal || '0'}
                                        onChange={event => setBill({ ...bill, recurrentTotal: event.target.value, recurrent: !!event.target.value  })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
                <div className="modal-footer p10">
                    <button
                        type="button"
                        className="btn btn btn-outline-secondary btn-sm"
                        onClick={() => dispatch(setEditBill(null))}>
                        {bundle('cancel')}
                    </button>
                    <button type="button" className="btn btn-danger btn-sm" onClick={validateAndSave}>
                        {bundle('save')}
                    </button>
                </div>
            </Modal>
        )
    );
};

export default BillsEditor;
