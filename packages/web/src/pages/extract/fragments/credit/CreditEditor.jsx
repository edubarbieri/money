import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bundle } from 'i18n/bundle';
import Modal from 'components/global/fragments/Modal';
import SelectSearch from 'react-select-search';
import { setSaveCredit, setEditCredit } from 'reducers/credit/creditAction';

const CreditEditor = () => {
    const dispatch = useDispatch();
    const editCredit = useSelector(state => state.credit.editCredit);
    const [initialized, setInitialized] = useState(false);
    const categories = useSelector(state => state.category.withPath);
    const wallet = useSelector(state => state.wallet.wallet);

    const [credit, setCredit] = useState({
        description: '',
        isCredit: true,
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
        if(!credit.description || !credit.amount || Number(credit.amount) < 0 || !credit.entryDate){
            return;
        }
        dispatch(setSaveCredit(credit));
    }

    useEffect(() => {
        setCredit(editCredit);
        setInitialized(true);
    }, [editCredit]);

    return (
        initialized &&
        credit && (
            <Modal
                title={credit.id ? bundle('edit.credit') : bundle('add.credit')}
                setShow={() => dispatch(setEditCredit(null))}>
                <form className="clear-focus">
                    <div className="form-row">
                        <div className={!credit.description ? 'col-12 form-group has-error' : 'col-12 form-group'}>
                            <label>{bundle('description')}</label>
                            <input
                                type="text"
                                className="form-control"
                                value={credit.description}
                                onChange={event => setCredit({ ...credit, description: event.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className={!credit.amount ? 'col-6 form-group has-error' : 'col-6 form-group'}>
                            <label>{bundle('value')}</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">{bundle('currency')}</div>
                                </div>
                                <input
                                    type="number"
                                    className="form-control border-left-0"
                                    value={credit.amount}
                                    onChange={event => setCredit({ ...credit, amount: event.target.value })}
                                />
                            </div>
                        </div>
                        <div className={!credit.entryDate ? 'col-6 form-group has-error' : 'col-6 form-group'}>
                            <label>{bundle('due.date')}</label>
                            <input
                                type="date"
                                className="form-control"
                                value={credit.entryDate}
                                onChange={event => setCredit({ ...credit, entryDate: event.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-6 form-group">
                            <label>{bundle('category')}</label>
                            <SelectSearch
                                value={credit.category || credit.categoryId ? credit.categoryId || credit.category.id : ''}
                                options={categories}
                                className="select-search-box"
                                search={true}
                                onChange={value => setCredit({ ...credit, categoryId: value.value })}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>{bundle('member')}</label>
                            <SelectSearch
                                value={credit.user || credit.userId ? credit.userId || credit.user.id : ''}
                                options={wallet.users}
                                className="select-search-box"
                                search={true}
                                onChange={value => setCredit({ ...credit, userId: value.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="col-6 form-group text-center">
                            <input
                                className="styled-checkbox danger"
                                id="recurrentInpt"
                                type="checkbox"
                                checked={credit.recurrent}
                                onChange={event => setCredit({ ...credit, recurrent: !credit.recurrent,  recurrentTotal: !credit.recurrent ? credit.recurrentTotal : '0'})}
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
                                        value={credit.recurrentTotal || '0'}
                                        onChange={event => setCredit({ ...credit, recurrentTotal: event.target.value, recurrent: !!event.target.value  })}
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
                        onClick={() => dispatch(setEditCredit(null))}>
                        {bundle('cancel')}
                    </button>
                    <button type="button" className="btn btn-primary btn-sm" onClick={validateAndSave}>
                        {bundle('save')}
                    </button>
                </div>
            </Modal>
        )
    );
};

export default CreditEditor;
