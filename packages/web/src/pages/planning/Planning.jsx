import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from 'reducers/global/globalAction';
import { bundle } from 'i18n/bundle';
import PlanItem from './fragments/PlanItem';
import { setEditPlan } from 'reducers/planning/planningAction';
import PlanEditor from './fragments/PlanEditor';

const Planning = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(false));
    }, [dispatch]);

    return (
        <div className="container-fluid">
            <div className="row">
                <h1 className="page-title">{bundle('planning')}</h1>
            </div>
            <PlanEditor />
            <div className="row">
                <button
                    type="button"
                    className="btn btn-primary btn-sm mb-3 btn-add-wallet"
                    onClick={() =>  dispatch(setEditPlan({}))}>
                    {bundle('add.plan')}
                </button>
            </div>
            <div className="row">
                <PlanItem />
            </div>
        </div>
    );
};

export default Planning;
