import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setLoading } from 'reducers/global/globalAction';
import { bundle } from 'i18n/bundle';
import CircleProgressBar from 'components/global/CircleProgressBar';
import { getPlanIcon } from './PlanIcon';
import PlanMonthCheck from './PlanMonthCheck';
import moment from 'moment';
import { formatCurrency } from 'services/Util';
import { setEditPlan } from 'reducers/planning/planningAction';

const initDate = moment().subtract(-8, 'months');
const endDate = moment().add(12, 'months');
const PlanItem = () => {
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(setLoading(false));
    }, [dispatch]);

    return (
        <div className="plan-item content m-0">
            <div className="plan-body">
                <h5 className="plan-title w-100">
                    {bundle('plan')}:&nbsp;
                    <span className="text-primary">Trocar de carro</span>
                </h5>
                <div className="plan-content">
                    <CircleProgressBar progress="25" icon={getPlanIcon('car')} />
                    <div className="plan-detail">
                        <div className="text-muted pl-3">{bundle('objective')}</div>
                        <p className="w-100 pl-3 font-600">
                            Conseguir juntar dinheiro para comprar um carro sem financiamento.
                        </p>
                        <div className="text-muted pl-3">{bundle('overview')}</div>
                        <div className="p-3">
                            <div className="row">
                                <div className="col-12 col-md-4">
                                    <div className="content d-flex flex-column text-center">
                                        {bundle('init.date')}
                                        <h1 className="text-primary">{moment(initDate).format('DD/MM/YYYY')}</h1>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    <div className="content d-flex flex-column text-center">
                                        {bundle('end.date')}
                                        <h1 className="text-primary">{moment(endDate).format('DD/MM/YYYY')}</h1>
                                    </div>
                                </div>
                                <div className="col-12 col-md-4">
                                    <div className="content d-flex flex-column text-center">
                                        {bundle('goal')}
                                        <h1 className="text-primary">{formatCurrency(Number(5000).toFixed(2))}</h1>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="text-muted pl-3">{bundle('progress')}</div>
                        <div className="total-resume">
                            <div className="progress-content">
                                <div className="progress">
                                    <div className="progress-bar" role="progressbar" style={{ width: '25%' }}>
                                        <span>{formatCurrency(Number(1250).toFixed(2))}</span>
                                    </div>
                                </div>
                                <span className="progress-init-label">{formatCurrency(0)}</span>
                                <span className="progress-end-label">{formatCurrency(Number(5000).toFixed(2))}</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="plan-content">
                    <PlanMonthCheck initDate={initDate} endDate={endDate} />
                </div>
                <div className="plan-content p10">
                    <div className="card-footer w-100 mt-2 d-flex justify-content-end border-0">
                        <button
                            type="button"
                            className="btn btn btn-secondary btn-sm">
                            {bundle('archive')}
                        </button>
                        <button
                            type="button"
                            className="btn btn-danger btn-sm ml-2">
                            {bundle('remove')}
                        </button>
                        <button
                            type="button"
                            className="btn btn-primary btn-sm ml-2"
                            onClick={() => dispatch(setEditPlan({}))}>
                            {bundle('edit')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanItem;
