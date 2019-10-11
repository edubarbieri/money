import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { SET_ACTIVE_PAGE, SET_LOADING } from 'store/globalActions';
import { SHOW_BILL_ACTIONS } from 'store/uxActions';
import bundle, { bundleFormat } from 'i18n/bundle';
import route from 'i18n/route'
import BillsEditor from 'components/editors/BillsEditor';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import { LANG } from 'i18n/service';
import 'moment/locale/pt-br';
import moment from 'moment';
import DataGrid from 'components/grid/DataGrid';
import SimpleGraph from 'components/graph/SimpleGraph';
import { isMobile, formatMoneyWithCurrency } from 'service/util';
import SelectWalletMessage from 'components/global/SelectWalletMessage';
import { bill as billService } from 'mymoney-sdk';
import Modal from 'components/modal/Modal';
import Errors from 'components/message/Error';
import PaymentDateEditor from 'components/editors/PaymentDateEditor';
import { setTimeout } from 'timers';
import BillsRecurrency from './fragments/BillsRecurrency';

const Bills = () => {
  moment.locale(LANG.toLowerCase());

  const dispatch = useDispatch();
  let started = useSelector(state => state.global.started);
  let width = useSelector(state => state.global.width);
  let wallet = useSelector(state => state.user.activeWallet);
  const pages = [{ label: bundle('opened.bills') }]
  const showBillActions = useSelector(state => state.ux.showBillActions);
  const [userBills, setUserBills] = useState([]);
  const [editBill, setEditBill] = useState({});
  const [refresh, setRefresh] = useState(null);
  const [errors, setErrors] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [editFocus, setEditFocus] = useState(false);

  const filterDate = moment();
  const month = filterDate.month();
  const [filter, setFilter] = useState({
    month: month + 1,
    year: filterDate.get('year'),
    order: '',
    page: 1,
    pageSize: 20
  });

  const [graphData, setgraphData] = useState([]);

  const [removeBillConfirmationData, setRemoveBillConfirmationData] = useState({
    show: false,
    title: '',
    text: '',
    id: '',
    onConfirm: null,
    onCancel: null,
    category: null
  });

  dispatch({ type: SET_ACTIVE_PAGE, payload: route('opened.bills') })

  useEffect(() => {
    if (!started || !wallet.id) {
      return;
    }
    dispatch({ type: SET_LOADING, payload: true })
    billService.get(filter).then(result => {
      dispatch({ type: SET_LOADING, payload: false })
      if (result.status >= 400) {
        console.log('Error on fetch bills data');
        return;
      }
      setUserBills(parseBillsData(result.data));
      setTotalPages(result.totalPages);
    }).catch(err => {
      console.log(err)
    })
    billService.amountMonthResume().then(result => {
      if (result.status >= 400) {
        console.log('Error on fetch bills data');
        return;
      }
      let graph = [];
      for (let index = 0; index < result.length; index++) {
        const data = result[index];
        graph.push({
          "x": moment.months(data.month - 1),
          "y": Number(data.amount)
        })
      }
      setgraphData([
        { "id": bundle('bills'), data: graph }
      ]);
    }).catch(err => {
      console.log(err)
    })
  }, [started, filter, refresh, dispatch, wallet]);

  const parseBillsData = (resultData) => {
    for (let index = 0; index < resultData.length; index++) {
      const bill = resultData[index];
      bill.formatedDueDate = moment(bill.dueDate).format(bundle('moment.date.format'));
      bill.formatedPaymentDate = (bill.paymentDate) ? moment(bill.paymentDate).format(bundle('moment.date.format')) : null;
      bill.formattedAmount = formatMoneyWithCurrency(Number(bill.amount).toFixed(2))
      bill.formattedAmountPayed = (bill.amountPaid > 0) && formatMoneyWithCurrency(Number(bill.amountPaid).toFixed(2))
      bill.dueDate = moment(bill.dueDate).toDate();
      bill.recurrency = (bill.recurrentTotal) ? `${bill.recurrentCount}${bundle('of')}${bill.recurrentTotal || 0}` : (bill.recurrent) ? bundle('yes') : bundle('no');
    }
    return resultData;
  }



  const columns = [
    { id: 'description', title: bundle('description') },
    { id: 'formattedAmount', title: bundle('value') },
    { id: 'formatedDueDate', title: bundle('due.date') },
    { id: 'formatedPaymentDate', title: bundle('payment.date') },
    { id: 'category.name', title: bundle('category') },
    { id: 'formattedAmountPayed', title: bundle('value.payed') },
    { id: 'user.name', title: bundle('member') },
    { id: 'recurrency', title: bundle('recurrency') },
  ];
  
  const headerInfo = [
    {id:'description', className: ''},
    {id:'formattedAmount', className: 'amount'}
  ];

  const sorters = [
    { id: "formattedAmount", filter: 'amount', reverse: false },
    { id: "formatedDueDate", filter: 'dueDate', reverse: false },
    { id: "description", filter: 'description', reverse: false }
  ]

  const conf = {
    disabledProperty: 'paymentDate'
  }

  const actions = (bill) => {
    return (
      <div className="actions-container">
        {actionsButtons(bill)}
      </div>
    )
  }

  const onSaveBill = () => {
    setRefresh(new Date().getTime());
  }

  const onCancel = (emptyBill) => {
    setEditBill(emptyBill);
  }

  const buildEditFocus = () => {
    const content = document.querySelector('.breadcrumb');
    let top = 0;
    if (content && isMobile()) {
      // @ts-ignore
      top = content.offsetTop;
    }
    window.scrollTo(0, top);
    setEditFocus(true);
    let focus = document.getElementById('inpt-description');
    if (focus) {
      focus.focus();
    }
    setTimeout(() => {
      setEditFocus(false);
    }, 1500);
  }

  const openEditBill = (bill) => {
    if (bill.paymentDate) {
      return;
    }
    buildEditFocus();
    bill.recurrentTotal = bill.recurrentTotal || '';
    dispatch({ type: SHOW_BILL_ACTIONS, payload: true });
    setEditBill(bill);
  }

  const removeBill = (bill) => {
    setRemoveBillConfirmationData({
      ...removeBillConfirmationData,
      show: true,
      title: bundle('remove.bill'),
      text: bundleFormat('remove.bill.confirmation', bill.description),
      onConfirm: removeBillConfirmationCallBack,
      onCancel: () => setRemoveBillConfirmationData({ ...removeBillConfirmationData, show: false }),
      id: bill.id
    });
  }

  const removeBillConfirmationCallBack = (id) => {
    setRemoveBillConfirmationData({ ...removeBillConfirmationData, show: false });
    dispatch({ type: SET_LOADING, payload: true })
    billService.remove(id).then(res => {
      dispatch({ type: SET_LOADING, payload: false })
      if (res.status >= 400) {
        setErrors(res.errors);
        return;
      }
      setRefresh(new Date().getTime());
    }).catch(err => {
      console.log(err);
    })
  }

  const setPaymentDate = (bill, editedData) => {
    const payedData = {
      amountPaid: editedData.amount,
      paymentDate: editedData.date
    }
    dispatch({ type: SET_LOADING, payload: true })
    billService.setAsPayed(bill.id, payedData).then(res => {
      dispatch({ type: SET_LOADING, payload: false })
      if (res.status >= 400) {
        setErrors(res.errors);
        return;
      }
      setRefresh(new Date().getTime());
    }).catch(err => {
      console.log(err);
    })
  }


  const [paymentDateModal, setPaymentDateModal] = useState({
    show: false,
    setShow: (value) => setPaymentDateModal({ ...paymentDateModal, show: value }),
    data: {},
    onSet: setPaymentDate
  });

  const payBill = (bill) => {
    if (bill.amountPaid) {
      return;
    }
    setPaymentDateModal({ ...paymentDateModal, show: true, data: bill })
  }

  const checkShowActions = () => {
    if (showBillActions) {
      return (
        <div>
          <div className="row">
            <div className="col-md-12">
              <button className="btn btn-danger btn-text btn-icon pull-right m-b-10 w-100"
                onClick={() => dispatch({ type: SHOW_BILL_ACTIONS, payload: false })}
                type="button">
                <i className="fas fa-minus" />
                {isMobile(width) ? bundle('cancel.edit') : bundle('hide.info')}
              </button>
            </div>
          </div>
          <div className="row">
            {!isMobile() && <BillsRecurrency setErrors={setErrors} setRefresh={setRefresh} />}
            <div className={(editFocus) ? "col-md-12 col-lg-8 col-xl-6 col-xxl-5 focus" : "col-md-12 col-lg-8 col-xl-6 col-xxl-5"}>
              <BillsEditor
                bill={editBill}
                onSave={onSaveBill}
                onCancel={onCancel} />
            </div>
            {isMobile() && <BillsRecurrency setErrors={setErrors} setRefresh={setRefresh} />}
            {!isMobile(width) &&
              <div className="col-md-12 col-lg-4 col-xl-6 col-xxl-7">
                <SimpleGraph
                  data={graphData}
                  panel="panel-danger"
                  colorScheme="set1"
                />
              </div>
            }
          </div>
        </div>
      )
    }

    return (
      <div className="row">
        <div className="col-md-12">
          {isMobile(width) &&
            <button className="btn btn-danger btn-icon pull-right w-100"
              onClick={() => dispatch({ type: SHOW_BILL_ACTIONS, payload: true })}
              type="button">
              <i className="fas fa-plus" />
              {bundle('add.bill')}
            </button>
          }
          {!isMobile(width) &&
            <button className="btn btn-danger btn-icon w-100"
              onClick={() => dispatch({ type: SHOW_BILL_ACTIONS, payload: true })}
              type="button">
              <i className="fas fa-plus" />
              {bundle('expand.info')}
            </button>
          }
        </div>
      </div>
    )
  }

  const getMonthSelector = () => {
    return (
      <div className="horizontal-form-group">
        <label className="control-label">{bundle('month')}:</label>
        <select className="form-control"
          value={filter.month}
          onChange={event => setFilter({ ...filter, month: Number(event.target.value) })}>
          {
            moment.months().map((month, idx) => (
              <option key={idx} value={idx + 1}>{month}</option>
            ))
          }
        </select>
      </div>
    )
  }

  const getYearsSelector = () => {
    const year = filterDate.get('year');
    return (
      <div className="horizontal-form-group">
        <label className="control-label">{bundle('year')}:</label>
        <select className="form-control"
          value={filter.year}
          onChange={event => setFilter({ ...filter, year: Number(event.target.value) })}>
          <option value={year - 2}>{year - 2}</option>
          <option value={year - 1}>{year - 1}</option>
          <option value={year}>{year}</option>
          <option value={year + 1}>{year + 1}</option>
          <option value={year + 2}>{year + 2}</option>
        </select>
      </div>
    )
  }

  const renderRemoveConfirmation = () => {
    return removeBillConfirmationData.show &&
      <Modal
        text={removeBillConfirmationData.text}
        title={removeBillConfirmationData.title}
        fixed={true}
        onConfirm={() => removeBillConfirmationData.onConfirm(removeBillConfirmationData.id)}
        onClose={() => removeBillConfirmationData.onCancel(removeBillConfirmationData.id)}
        onCancel={() => removeBillConfirmationData.onCancel(removeBillConfirmationData.id)}
      />
  }

  const actionsButtons = (bill) => {
    return ([
      <div key="edit" onClick={() => openEditBill(bill)}
        className={(bill.paymentDate) ? 'disabled row-options edit' : 'row-options edit'}>
        <i className="far fa-edit" />
        <label>{bundle('edit')}</label>
      </div>,
      <div key="remove" onClick={() => removeBill(bill)}
        className="row-options remove">
        <i className="fa fa-trash-alt" />
        <label>{bundle('remove')}</label>
      </div>,
      <div key="pay"
        className={(bill.paymentDate) ? 'disabled row-options plus' : 'row-options plus'}
        onClick={() => payBill(bill)}>
        <i className="fas fa-file-invoice-dollar" />
        <label>{bundle('payed')}</label>
      </div>
    ])
  };


  return (
    <div className="bills-page"> 
      <h1 className="page-title">
        {bundle('opened.bills')}
      </h1>
      <SelectWalletMessage />
      <Breadcrumb pages={pages} />
      {checkShowActions()}
      {renderRemoveConfirmation()}
      <PaymentDateEditor
        data={paymentDateModal.data}
        onSet={paymentDateModal.onSet}
        show={paymentDateModal.show}
        setShow={paymentDateModal.setShow}
      />
      <div className="row m-t-20">
        <div className="col-md-12">
          <div className="panel panel-danger panel-bills">
            <div className="panel-heading reset-color">
              <div className="filter row">
                <div className="form-group">
                  <div className="col-sm-12">
                    {getYearsSelector()}
                    {getMonthSelector()}
                  </div>
                </div>
              </div>
            </div>
            <div className="panel-body">
              <Errors errors={errors} setErrors={setErrors} />
              <div className="row">
                <DataGrid
                  columns={columns}
                  headerInfo={headerInfo}
                  rows={userBills}
                  actions={actions}
                  conf={conf}
                  sorters={sorters}
                  page={filter.page}
                  setSort={value => setFilter({ ...filter, order: value })}
                  setPage={page => setFilter({ ...filter, page: page })}
                  totalPages={totalPages}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Bills;