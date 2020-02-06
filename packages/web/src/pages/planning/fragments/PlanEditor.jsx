import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bundle } from 'i18n/bundle';
import Modal from 'components/global/fragments/Modal';
import { setEditPlan } from 'reducers/planning/planningAction';
import moment from 'moment';
import SelectSearch from 'react-select-search';
import { getIconTypes } from './PlanIcon';

const PlanEditor = () => {
    const dispatch = useDispatch();
    const editPlan = useSelector(state => state.planning.editPlan);
    const [initialized, setInitialized] = useState(false);

    const [plan, setPlan] = useState({
        name: '',
        objective: '',
        amount: '0',
        type: '',
        initDate: '',
        endDate: ''
    });

    useEffect(() => {
        if (!editPlan) {
            setPlan(null);
            return;
        }
        editPlan.initDate = editPlan.initDate || moment().format('YYYY-MM-DD');
        setPlan(editPlan);
        setInitialized(true);
    }, [editPlan]);

    const validateAndSave = () => {
        if (!editPlan.name || !editPlan.amount || Number(editPlan.amount) < 0 || !editPlan.initDate) {
            return;
        }
    };

    return (
        initialized &&
        plan && (
            <Modal title={bundle('plan')} setShow={() => dispatch(setEditPlan(null))}>
                <form className="clear-focus">
                    <div className="form-row">
                        <div className={!plan.name ? 'col-12 form-group has-error' : 'col-12 form-group'}>
                            <label>{bundle('name')}</label>
                            <input
                                type="text"
                                className="form-control"
                                value={plan.name}
                                onChange={event => setPlan({ ...plan, name: event.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className={!plan.objective ? 'col-12 form-group has-error' : 'col-12 form-group'}>
                            <label>{bundle('objective')}</label>
                            <input
                                type="text"
                                className="form-control"
                                value={plan.objective}
                                onChange={event => setPlan({ ...plan, objective: event.target.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className={!plan.amount ? 'col-6 form-group has-error' : 'col-6 form-group'}>
                            <label>{bundle('amount')}</label>
                            <div className="input-group">
                                <div className="input-group-prepend">
                                    <div className="input-group-text">{bundle('currency')}</div>
                                </div>
                                <input
                                    type="number"
                                    className="form-control border-left-0"
                                    value={plan.amount}
                                    onChange={event => setPlan({ ...plan, amount: event.target.value })}
                                />
                            </div>
                        </div>
                        <div className="col-6 form-group">
                            <label>{bundle('type')}</label>
                            <SelectSearch
                                value={plan.type}
                                options={getIconTypes}
                                className="select-search-box"
                                search={true}
                                onChange={value => setPlan({ ...plan, type: value.value })}
                            />
                        </div>
                    </div>
                    <div className="form-row">
                        <div className={!plan.initDate ? 'col-6 form-group has-error' : 'col-6 form-group'}>
                            <label>{bundle('init.date')}</label>
                            <input
                                type="date"
                                className="form-control"
                                value={plan.initDate}
                                onChange={event => setPlan({ ...plan, initDate: event.target.value })}
                            />
                        </div>
                        <div className="col-6 form-group">
                            <label>{bundle('end.date')}</label>
                            <input
                                type="date"
                                className="form-control"
                                value={plan.endDate}
                                onChange={event => setPlan({ ...plan, endDate: event.target.value })}
                            />
                        </div>
                    </div>
                </form>
                <div className="modal-footer p10">
                    <button
                        type="button"
                        className="btn btn btn-outline-secondary btn-sm"
                        onClick={() => dispatch(setEditPlan(null))}>
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

export default PlanEditor;
