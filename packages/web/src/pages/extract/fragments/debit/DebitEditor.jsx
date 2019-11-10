import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bundle } from 'i18n/bundle';
import Modal from 'components/global/fragments/Modal';
import SelectSearch from 'react-select-search';
import { setSaveDebit, setEditDebit } from 'reducers/debit/debitAction';

const DebitEditor = () => {
    const dispatch = useDispatch();
    const editDebit = useSelector(state => state.debit.editDebit);
    const [initialized, setInitialized] = useState(false);
    const categories = useSelector(state => state.category.all);
    const wallet = useSelector(state => state.wallet.wallet);

    const [debit, setDebit] = useState({
        description: '',
        isDebit: true,
        id: '',
        amount: '0',
        entryDate: '',
        category: { id: '' },
        user: { id: '' },
        categoryId: '',
        userId: '',
        recurrent: false,
        recurrentTotal: '0'
    });


    const validateAndSave = () => {
        if(!debit.description || !debit.amount || Number(debit.amount) < 0 || !debit.entryDate){
            return;
        }
        dispatch(setSaveDebit(debit));
    }

    useEffect(() => {
        setDebit(editDebit);
        setInitialized(true);
    }, [editDebit]);

    return (
        initialized &&
        debit && (
            <Modal
                title={debit.id ? bundle('edit.debit') : bundle('add.debit')}
                setShow={() => dispatch(setEditDebit(null))}>
                <form className="clear-focus">
                    <div className="form-row">
                        <div className={!debit.description ? 'col-12 form-group has-error' : 'col-12 form-group'}>
                            <label>{bundle('description')}</label>
                            <input
                                type="text"
                                className="form-control"
                                value={debit.description}
                                onChange={event => setDebit({ ...debit, description: event.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className={!debit.amount ? 'col-6 form-group has-error' : 'col-6 form-group'}>
                            <label>{bundle('value')}</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">{bundle('currency')}</div>
                                </div>
                                <input
                                    type="number"
                                    className="form-control border-left-0"
                                    value={debit.amount}
                                    onChange={event => setDebit({ ...debit, amount: event.target.value })}
                                />
                            </div>
                        </div>
                        <div className={!debit.entryDate ? 'col-6 form-group has-error' : 'col-6 form-group'}>
                            <label>{bundle('due.date')}</label>
                            <input
                                type="date"
                                className="form-control"
                                value={debit.entryDate}
                                onChange={event => setDebit({ ...debit, entryDate: event.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-6 form-group">
                            <label>{bundle('category')}</label>
                            <SelectSearch
                                value={debit.category || debit.categoryId ? debit.categoryId || debit.category.id : ''}
                                options={categories}
                                className="select-search-box"
                                search={true}
                                onChange={value => setDebit({ ...debit, categoryId: value.value })}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>{bundle('member')}</label>
                            <SelectSearch
                                value={debit.user || debit.userId ? debit.userId || debit.user.id : ''}
                                options={wallet.users}
                                className="select-search-box"
                                search={true}
                                onChange={value => setDebit({ ...debit, userId: value.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-6 form-group text-center">
                            <input
                                className="styled-checkbox danger"
                                id="recurrentInpt"
                                type="checkbox"
                                checked={debit.recurrent}
                                onChange={event => setDebit({ ...debit, recurrent: !debit.recurrent,  recurrentTotal: !debit.recurrent ? debit.recurrentTotal : '0'})}
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
                                        value={debit.recurrentTotal || '0'}
                                        onChange={event => setDebit({ ...debit, recurrentTotal: event.target.value, recurrent: !!event.target.value  })}
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
                        onClick={() => dispatch(setEditDebit(null))}>
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

export default DebitEditor;
