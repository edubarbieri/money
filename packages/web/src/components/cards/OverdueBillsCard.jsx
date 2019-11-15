import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import 'moment/locale/pt-br';
import { fetchOverdueBills } from 'reducers/bills/billsAction';
import moment from 'moment';
import { bundle, route } from 'i18n/bundle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { formatCurrency, isMobile } from 'services/Util';
import RegisterLink from 'components/global/RegisterLink';
import OverdueBillsListItem from './fragments/OverdueBillsListItem';
import OverdueBillsTable from './fragments/OverdueBillsTable';

const OverdueBillsCard = () => {
    const dispatch = useDispatch();
    const overdueBills = useSelector(state => state.bills.overdueBills);
    const refresh = useSelector(state => state.global.refresh);
    const resize = useSelector(state => state.global.resize);

    useEffect(() => {
        dispatch(fetchOverdueBills());
    }, [dispatch, refresh]);

    return (
        !!overdueBills.length && (
            <div className="col-12 col-lg-4 pl-0">
                <div className="card content">
                    <div className="card-body p-1">
                        <h5 className="card-title">
                            <span className="pl-1 text-danger">{bundle('overdue.bills')}</span>
                        </h5>
                        {isMobile(resize) ? (
                            overdueBills.map(bill => <OverdueBillsListItem bill={bill} />)
                        ) : (
                            <OverdueBillsTable overdueBills={overdueBills} />
                        )}
                        <RegisterLink to={route('opened.bills')} className="float-right w-100">
                            <button type="button" className="btn btn-sm btn-outline-danger w-100">
                                {bundle('pay')}
                            </button>
                        </RegisterLink>
                    </div>
                </div>
            </div>
        )
    );
};

export default OverdueBillsCard;
