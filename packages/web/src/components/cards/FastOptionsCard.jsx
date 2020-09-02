import React, {useState, useEffect} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { bundle } from 'i18n/bundle';
import CreditEditor from 'pages/extract/fragments/credit/CreditEditor';
import DebitEditor from 'pages/extract/fragments/debit/DebitEditor';
import BillsEditor from 'pages/bills/fragments/BillsEditor';
import { setEditBill } from 'reducers/bills/billsAction';
import { setEditCredit } from 'reducers/credit/creditAction';
import { setEditDebit } from 'reducers/debit/debitAction';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileInvoiceDollar, faHandHoldingUsd, faDollarSign } from '@fortawesome/free-solid-svg-icons';

const FastOptionsCard = () => {
    const dispatch = useDispatch();
    const wallet = useSelector(state => state.wallet.wallet);
    const [showEditors, setShowEditors] = useState(!!wallet);

    useEffect(() => {
        setShowEditors(!!wallet.id);
    }, [wallet]);

    return (
        showEditors && (
                <div className="col-12 col-lg-4 pl-0">
                    <div className="content fast-add">
                        <div className="p-1">
                            <h5>{bundle('fast.add')}</h5>
                            <div className="mt-3 actions-list">
                                <div className="action" onClick={() => dispatch(setEditBill({ redirect: true }))}>
                                    <span className="plus">
                                        <FontAwesomeIcon icon={faFileInvoiceDollar} />
                                    </span>
                                    {bundle('bill')}
                                </div>
                                <div className="action primary" onClick={() => dispatch(setEditCredit({ redirect: true }))}>
                                    <span className="plus b">
                                        <FontAwesomeIcon icon={faHandHoldingUsd} />
                                    </span>
                                    {bundle('credit')}
                                </div>
                                <div className="action danger" onClick={() => dispatch(setEditDebit({ redirect: true }))}>
                                    <span className="plus">
                                        <FontAwesomeIcon icon={faDollarSign} />
                                    </span>
                                    {bundle('debit')}
                                </div>
                            </div>
                            <BillsEditor />
                            <CreditEditor />
                            <DebitEditor />
                        </div>
                    </div>
                </div>
        )
    );
};

export default FastOptionsCard;
