import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { SET_ACTIVE_PAGE, SET_LOADING } from 'store/globalActions';
import { SHOW_RECEIPT_ACTIONS } from 'store/uxActions';
import bundle, { bundleFormat } from 'i18n/bundle';
import route from 'i18n/route'
import ReceiptsEditor from 'components/editors/ReceiptsEditor';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import { LANG } from 'i18n/service';
import 'moment/locale/pt-br';
import moment from 'moment';
import DataGrid from 'components/grid/DataGrid';
import SimpleGraph from 'components/graph/SimpleGraph';
import { isMobile, formatMoneyWithCurrency } from 'service/util';
import SelectWalletMessage from 'components/global/SelectWalletMessage';
import { bill as receiptService } from 'mymoney-sdk';
import Modal from 'components/modal/Modal';
import Errors from 'components/message/Error';
import ReceiptDateEditor from 'components/editors/ReceiptDateEditor';
import { setTimeout } from 'timers';

const Receipts = () => {
  moment.locale(LANG.toLowerCase());

  const dispatch = useDispatch();
  let started = useSelector(state => state.global.started);
  let width = useSelector(state => state.global.width);
  let wallet = useSelector(state => state.user.activeWallet);
  const pages = [{ label: bundle('opened.receipts') }]
  const showReceiptActions = useSelector(state => state.ux.showReceiptActions);
  const [userReceipts, setUserReceipts] = useState([]);
  const [editReceipt, setEditReceipt] = useState({});
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

  const [removeReceiptConfirmationData, setRemoveReceiptConfirmationData] = useState({
    show: false,
    title: '',
    text: '',
    id: '',
    onConfirm: null,
    onCancel: null,
    category: null
  });

  dispatch({ type: SET_ACTIVE_PAGE, payload: route('opened.receipts') })
  
  useEffect(() => {
    if (!started || !wallet.id) {
      return;
    }
    dispatch({ type: SET_LOADING, payload: true })
    receiptService.get(filter).then(result => {
      dispatch({ type: SET_LOADING, payload: false })
      if (result.status >= 400) {
        console.log('Error on fetch receipts data');
        return;
      }
      setUserReceipts(parseReceiptsData(result.data));
      setTotalPages(result.totalPages);
    }).catch(err => {
      console.log(err)
    })
    receiptService.amountMonthResume().then(result => {
      if (result.status >= 400) {
        console.log('Error on fetch receipts data');
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
        {"id": bundle('receipts'), data: graph}
      ]);
    }).catch(err => {
      console.log(err)
    })
  }, [started, filter, refresh, dispatch, wallet]);

  const parseReceiptsData = (resultData) => {
    for (let index = 0; index < resultData.length; index++) {
      const receipt = resultData[index];
      receipt.formatedDueDate = moment(receipt.dueDate).format(bundle('moment.date.format'));
      receipt.formatedPaymentDate = (receipt.paymentDate) ? moment(receipt.paymentDate).format(bundle('moment.date.format')) : null;
      receipt.formattedAmount = formatMoneyWithCurrency(Number(receipt.amount).toFixed(2))
      receipt.formattedAmountPayed = formatMoneyWithCurrency(Number(receipt.amountPaid).toFixed(2))
      receipt.dueDate = moment(receipt.dueDate).toDate();
      receipt.recurrency = (receipt.recurrentTotal) ? `${receipt.recurrentCount} / ${receipt.recurrentTotal || 0}` : null
    }
    return resultData;
  }

  

  const [columns, setColumns] = useState([
    { id: 'description', title: bundle('description') },
    { id: 'formattedAmount', title: bundle('value') },
    { id: 'formattedAmountPayed', title: bundle('value.payed') },
    { id: 'user.name', title: bundle('member') },
    { id: 'formatedDueDate', title: bundle('due.date') },
    { id: 'formatedPaymentDate', title: bundle('payment.date') },
    { id: 'category.name', title: bundle('category') },
    { id: 'recurrency', title: bundle('recurrency') },
  ]);

  const sorters = [
    {id:"formattedAmount", filter: 'amount', reverse: false},
    {id:"formatedDueDate", filter: 'dueDate', reverse: false},
    {id:"description", filter: 'description', reverse: false}
  ]

  const conf = {
    disabledProperty: 'paymentDate'
  }

  const actions = (receipt) => {
    return (
      <div className="actions-container">
        {actionsButtons(receipt)}
      </div>
    )
  }

  const onSaveReceipt = () => {
    setRefresh(new Date().getTime());
  }

  const onCancel = (emptyReceipt) => {
    setEditReceipt(emptyReceipt);
  }

  const buildEditFocus = () => {
    const content = document.querySelector('.breadcrumb');
    let top = 0;
    if(content && isMobile()){
      // @ts-ignore
      top = content.offsetTop;
    }
    window.scrollTo(0, top);
    setEditFocus(true);
    setTimeout(() => {
      setEditFocus(false);
    }, 1500);
  }

  const openEditReceipt = (receipt) => {
    if (receipt.paymentDate) {
      return;
    }
    buildEditFocus();
    receipt.recurrentTotal = receipt.recurrentTotal || '';
    dispatch({ type: SHOW_RECEIPT_ACTIONS, payload: true });
    setEditReceipt(receipt);
  }

  const removeReceipt = (receipt) => {
    setRemoveReceiptConfirmationData({
      ...removeReceiptConfirmationData,
      show: true,
      title: bundle('remove.receipt'),
      text: bundleFormat('remove.receipt.confirmation', receipt.description),
      onConfirm: removeReceiptConfirmationCallBack,
      onCancel: () => setRemoveReceiptConfirmationData({ ...removeReceiptConfirmationData, show: false }),
      id: receipt.id
    });
  }

  const removeReceiptConfirmationCallBack = (id) => {
    setRemoveReceiptConfirmationData({ ...removeReceiptConfirmationData, show: false });
    dispatch({ type: SET_LOADING, payload: true })
    receiptService.remove(id).then(res => {
      dispatch({ type: SET_LOADING, payload: false })
      if(res.status >= 400){
        setErrors(res.errors);
        return;
      }
      setRefresh(new Date().getTime());
    }).catch(err => {
      console.log(err);
    })
  }
  
  const setPaymentDate = (receipt, editedData) => {
    const payedData = {
      amountPaid: editedData.amount,
      paymentDate: editedData.date
    }
    dispatch({ type: SET_LOADING, payload: true })
    receiptService.setAsPayed(receipt.id, payedData).then(res => {
      dispatch({ type: SET_LOADING, payload: false })
      if(res.status >= 400){
        setErrors(res.errors);
        return;
      }
      setRefresh(new Date().getTime());
    }).catch(err => {
      console.log(err);
    })
  }
  
  const openReceipt = (receipt) => {
    const payedData = {
      amountPaid: null,
      paymentDate: null
    }
    dispatch({ type: SET_LOADING, payload: true })
    receiptService.setAsPayed(receipt.id, payedData).then(res => {
      dispatch({ type: SET_LOADING, payload: false })
      if(res.status >= 400){
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
    setShow: (value) => setPaymentDateModal({...paymentDateModal, show: value}),
    data: {},
    onSet: setPaymentDate
  });

  const payReceipt = (receipt) => {
    if(receipt.amountPaid){
      return;
    }
    setPaymentDateModal({...paymentDateModal, show: true, data: receipt})
  }

  const checkShowActions = () => {
    if (showReceiptActions) {
      return (
        <div>
          <div className="row">
            <div className="col-md-12">
              <button className="btn btn-primary btn-text btn-icon pull-right m-b-10"
                onClick={() => dispatch({ type: SHOW_RECEIPT_ACTIONS, payload: false })}
                type="button">
                <i className="fas fa-minus" />
                {isMobile(width) ? bundle('cancel.edit') : bundle('hide.info')}
              </button>
            </div>
          </div>
          <div className="row">
            <div className={(editFocus) ? "col-md-12 col-lg-8 col-xl-6 col-xxl-5 focus" : "col-md-12 col-lg-8 col-xl-6 col-xxl-5"}>
              <ReceiptsEditor
                receipt={editReceipt}
                onSave={onSaveReceipt}
                onCancel={onCancel} />
            </div>
            {!isMobile(width) &&
              <div className="col-md-12 col-lg-4 col-xl-6 col-xxl-7">
                <SimpleGraph
                  data={graphData}
                  panel="panel-primary"
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
            <button className="btn btn-primary btn-icon pull-right"
              onClick={() => dispatch({ type: SHOW_RECEIPT_ACTIONS, payload: true })}
              type="button">
              <i className="fas fa-plus" />
              {bundle('add.receipt')}
            </button>
          }
          {!isMobile(width) &&
            <button className="btn btn-primary btn-text btn-icon pull-right"
              onClick={() => dispatch({ type: SHOW_RECEIPT_ACTIONS, payload: true })}
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
    return removeReceiptConfirmationData.show &&
      <Modal
        text={removeReceiptConfirmationData.text}
        title={removeReceiptConfirmationData.title}
        fixed={true}
        onConfirm={() => removeReceiptConfirmationData.onConfirm(removeReceiptConfirmationData.id)}
        onClose={() => removeReceiptConfirmationData.onCancel(removeReceiptConfirmationData.id)}
        onCancel={() => removeReceiptConfirmationData.onCancel(removeReceiptConfirmationData.id)}
      />
  }

  const actionsButtons = (receipt) => {
    return ([
      <div key="edit" onClick={() => openEditReceipt(receipt)}
        className={(receipt.paymentDate) ? 'disabled row-options edit' : 'row-options edit'}>
        <i className="far fa-edit" />
        <label>{bundle('edit')}</label>
      </div>,
      <div key="remove" onClick={() => removeReceipt(receipt)}
        className="row-options remove">
        <i className="fa fa-trash-alt" />
        <label>{bundle('remove')}</label>
      </div>,
      <div key="pay"
        className={(receipt.paymentDate) ? 'disabled row-options plus' : 'row-options plus'}
        onClick={() => payReceipt(receipt)}>
        <i className="fas fa-file-invoice-dollar" />
        <label>{bundle('payed')}</label>
      </div>
    ])
  };

  return (
    <div>
      <h1 className="page-title">{bundle('receipts')}</h1>
      <SelectWalletMessage />
      <Breadcrumb pages={pages} />
      {checkShowActions()}
      {renderRemoveConfirmation()}
      <ReceiptDateEditor 
        data={paymentDateModal.data}
        onSet={paymentDateModal.onSet}
        show={paymentDateModal.show}
        setShow={paymentDateModal.setShow}
      />
      <div className="row m-t-20">
        <div className="col-md-12">
          <div className="panel panel-primary panel-receipts">
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
              <Errors errors={errors} setErrors={setErrors}/>
              <div className="row">
                <DataGrid
                  columns={columns}
                  rows={userReceipts}
                  actions={actions}
                  conf={conf}
                  sorters={sorters}
                  page={filter.page}
                  setSort={value => setFilter({ ...filter, order: value})}
                  setPage={page => setFilter({...filter, page: page})}
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

export default Receipts;