import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { SET_ACTIVE_PAGE, SET_LOADING } from 'store/globalActions';
import { SHOW_EXTRACT_ACTIONS } from 'store/uxActions';
import bundle, { bundleFormat } from 'i18n/bundle';
import route from 'i18n/route'
import ExtractEditor from 'components/editors/ExtractEditor';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import { LANG } from 'i18n/service';
import 'moment/locale/pt-br';
import moment from 'moment';
import DataGrid from 'components/grid/DataGrid';
import SimpleGraph from 'components/graph/SimpleGraph';
import { isMobile, formatMoneyWithCurrency } from 'service/util';
import SelectWalletMessage from 'components/global/SelectWalletMessage';
import { credit as creditService, debit as debitService } from 'mymoney-sdk';
import Modal from 'components/modal/Modal';
import Errors from 'components/message/Error';
import { setTimeout } from 'timers';
import ExtractRecurrency from './fragments/ExtractRecurrency';

const Extracts = () => {
  moment.locale(LANG.toLowerCase());

  const dispatch = useDispatch();
  let started = useSelector(state => state.global.started);
  let width = useSelector(state => state.global.width);
  let wallet = useSelector(state => state.user.activeWallet);
  const pages = [{ label: bundle('extract') }]
  const showExtractActions = useSelector(state => state.ux.showExtractActions);
  const [userCredits, setUserCredits] = useState([]);
  const [userDebits, setUserDebits] = useState([]);
  const [editExtract, setEditEntry] = useState({});
  const [refresh, setRefresh] = useState(null);
  const [errors, setErrors] = useState([]);
  const [creditTotalPages, setCreditTotalPages] = useState(1);
  const [debitTotalPages, setDebitTotalPages] = useState(1);
  const [editFocus, setEditFocus] = useState(false);

  const filterDate = moment();
  const month = filterDate.month();
  const [filterCredit, setFilterCredit] = useState({
    month: month + 1,
    year: filterDate.get('year'),
    order: '',
    page: 1,
    pageSize: 20
  });

  const [filterDebit, setFilterDebit] = useState({
    month: month + 1,
    year: filterDate.get('year'),
    order: '',
    page: 1,
    pageSize: 20
  });

  const [graphData, setgraphData] = useState([]);

  const [removeExtractConfirmationData, setRemoveExtractConfirmationData] = useState({
    show: false,
    title: '',
    text: '',
    id: '',
    type: '',
    onConfirm: null,
    onCancel: null,
    category: null
  });

  dispatch({ type: SET_ACTIVE_PAGE, payload: route('extract') })

  useEffect(() => {
    if (!started || !wallet.id) {
      return;
    }
    dispatch({ type: SET_LOADING, payload: true })
    creditService.amountMonthResume().then(result => {
      if (result.status >= 400) {
        console.log('Error on fetch extracts data');
        return;
      }
      let creditGraph = [];
      for (let index = 0; index < result.length; index++) {
        const data = result[index];
        creditGraph.push({
          "x": moment.months(data.month - 1),
          "y": Number(data.amount)
        })
      }

      debitService.amountMonthResume().then(result => {
        if (result.status >= 400) {
          console.log('Error on fetch extracts data');
          return;
        }
        let debitGraph = [];
        for (let index = 0; index < result.length; index++) {
          const data = result[index];
          debitGraph.push({
            "x": moment.months(data.month - 1),
            "y": Number(data.amount)
          })
        }
        setgraphData([
          { "id": bundle('credit'), data: creditGraph },
          { "id": bundle('debit'), data: debitGraph }
        ]);
      }).catch(err => {
        console.log(err)
      })
    }).catch(err => {
      console.log(err)
    })
    
  }, [started, refresh, dispatch, wallet]);

  useEffect(() => {
    if (!started || !wallet.id) {
      return;
    }
    dispatch({ type: SET_LOADING, payload: true })
    creditService.get(filterCredit).then(result => {
      dispatch({ type: SET_LOADING, payload: false })
      if (result.status >= 400) {
        console.log('Error on fetch extracts data');
        return;
      }
      setUserCredits(parseExtractsData(result.data));
      setCreditTotalPages(result.totalPages);
    }).catch(err => {
      console.log(err)
    })
  }, [started, filterCredit, refresh, dispatch, wallet]);


  useEffect(() => {
    if (!started || !wallet.id) {
      return;
    }
    dispatch({ type: SET_LOADING, payload: true })
    debitService.get(filterDebit).then(result => {
      dispatch({ type: SET_LOADING, payload: false })
      if (result.status >= 400) {
        console.log('Error on fetch extracts data');
        return;
      }
      setUserDebits(parseExtractsData(result.data));
      setDebitTotalPages(result.totalPages);
    }).catch(err => {
      console.log(err)
    })
  }, [started, filterDebit, refresh, dispatch, wallet]);


  const parseExtractsData = (resultData) => {
    for (let index = 0; index < resultData.length; index++) {
      const extract = resultData[index];
      extract.formattedEntryDate = moment(extract.entryDate).format(bundle('moment.date.format'));
      extract.formattedAmount = formatMoneyWithCurrency(Number(extract.amount).toFixed(2))
      extract.objectEntryDate = moment(extract.entryDate).toDate();
      extract.recurrency = (extract.recurrentTotal) ? `${extract.recurrentCount}${bundle('of')}${extract.recurrentTotal || 0}` : (extract.recurrent) ? bundle('yes') : bundle('no');
    }
    return resultData;
  }

  const headerInfo = [
    {id:'description', className: ''},
    {id:'formattedAmount', className: 'amount'}
  ];

  const creditColumns = [
    { id: 'description', title: bundle('description') },
    { id: 'formattedAmount', title: bundle('value') },
    { id: 'formattedEntryDate', title: bundle('date') },
    { id: 'category.name', title: bundle('category') },
    { id: 'user.name', title: bundle('member') },
    { id: 'recurrency', title: bundle('recurrency') },
  ];
  
  const debitColumns = [
    { id: 'description', title: bundle('description') },
    { id: 'formattedAmount', title: bundle('value') },
    { id: 'formattedEntryDate', title: bundle('date') },
    { id: 'category.name', title: bundle('category') },
    { id: 'user.name', title: bundle('member') },
    { id: 'recurrency', title: bundle('recurrency') },
  ];

  const sorters = [
    { id: "formattedAmount", filter: 'amount', reverse: false },
    { id: "formattedEntryDate", filter: 'entryDate', reverse: false },
    { id: "description", filter: 'description', reverse: false }
  ]

  const conf = {
    disabledProperty: 'paymentDate'
  }

  const actions = (extract, type) => {
    return (
      <div className="actions-container">
        {actionsButtons(extract, type)}
      </div>
    )
  }

  const creditAction = (extract) => {
    return actions(extract, 'credit');
  }
  
  const debitAction = (extract) => {
    return actions(extract, 'debit');
  }

  const onSaveExtract = () => {
    setRefresh(new Date().getTime());
  }

  const onCancel = (emptyExtract) => {
    setEditEntry(emptyExtract);
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

  const openEditEntry = (entry, type) => {
    entry.type = type;
    buildEditFocus();
    entry.recurrentTotal = entry.recurrentTotal || '';
    dispatch({ type: SHOW_EXTRACT_ACTIONS, payload: true });
    setEditEntry(entry);
  }

  const removeEntry = (extract, type) => {
    setRemoveExtractConfirmationData({
      ...removeExtractConfirmationData,
      show: true,
      title: type === 'credit' ? bundle('remove.credit') : bundle('remove.debit'),
      text: type === 'credit' ? bundleFormat('remove.credit.confirmation', extract.description): bundleFormat('remove.debit.confirmation', extract.description),
      onConfirm: removeExtractConfirmationCallBack,
      onCancel: () => setRemoveExtractConfirmationData({ ...removeExtractConfirmationData, show: false }),
      id: extract.id
    });
  }

  const removeExtractConfirmationCallBack = (id, type) => {
    setRemoveExtractConfirmationData({ ...removeExtractConfirmationData, show: false });
    dispatch({ type: SET_LOADING, payload: true })
    const service  = type === 'credit' ? creditService : debitService;
    service.remove(id).then(res => {
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

  const checkShowActions = () => {
    if (showExtractActions) {
      return (
        <div>
          <div className="row">
            <div className="col-md-12">
              <button className="btn btn-primary btn-text btn-icon m-b-10 w-100"
                onClick={() => dispatch({ type: SHOW_EXTRACT_ACTIONS, payload: false })}
                type="button">
                <i className="fas fa-minus" />
                {isMobile(width) ? bundle('cancel.edit') : bundle('hide.info')}
              </button>
            </div>
          </div>
          <div className="row">
            {!isMobile() && <ExtractRecurrency setErrors={setErrors} setRefresh={setRefresh} />}
            <div className={(editFocus) ? "col-md-12 col-lg-8 col-xl-6 col-xxl-5 focus" : "col-md-12 col-lg-8 col-xl-6 col-xxl-5"}>
              <ExtractEditor
                extract={editExtract}
                onSave={onSaveExtract}
                onCancel={onCancel} />
            </div>
            {isMobile() && <ExtractRecurrency setErrors={setErrors} setRefresh={setRefresh} />}
            {!isMobile(width) &&
              <div className="col-md-12 col-lg-4 col-xl-6 col-xxl-7">
                <SimpleGraph
                  data={graphData}
                  panel="panel-primary"
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
            <button className="btn btn-primary btn-icon pull-right w-100"
              onClick={() => dispatch({ type: SHOW_EXTRACT_ACTIONS, payload: true })}
              type="button">
              <i className="fas fa-plus" />
              {bundle('add.extract')}
            </button>
          }
          {!isMobile(width) &&
            <button className="btn btn-primary btn-icon pull-right w-100"
              onClick={() => dispatch({ type: SHOW_EXTRACT_ACTIONS, payload: true })}
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
          value={filterCredit.month}
          onChange={event => {
            setFilterCredit({ ...filterCredit, month: Number(event.target.value) });
            setFilterDebit({ ...filterDebit, month: Number(event.target.value) });
          }}>
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
          value={filterCredit.year}
          onChange={event => {
            setFilterCredit({ ...filterCredit, year: Number(event.target.value) })
            setFilterDebit({ ...filterDebit, year: Number(event.target.value) })
          }}>
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
    return removeExtractConfirmationData.show &&
      <Modal
        text={removeExtractConfirmationData.text}
        title={removeExtractConfirmationData.title}
        fixed={true}
        onConfirm={() => removeExtractConfirmationData.onConfirm(removeExtractConfirmationData.id, removeExtractConfirmationData.type)}
        onClose={() => removeExtractConfirmationData.onCancel(removeExtractConfirmationData.id, removeExtractConfirmationData.type)}
        onCancel={() => removeExtractConfirmationData.onCancel(removeExtractConfirmationData.id, removeExtractConfirmationData.type)}
      />
  }

  const actionsButtons = (entry, type) => {
    return ([
      <div key="edit" onClick={() => openEditEntry(entry, type)}
        className={'row-options edit'}>
        <i className="far fa-edit" />
        <label>{bundle('edit')}</label>
      </div>,
      <div key="remove" onClick={() => removeEntry(entry, type)}
        className="row-options remove">
        <i className="fa fa-trash-alt" />
        <label>{bundle('remove')}</label>
      </div>
    ])
  };


  return (
    <div className="extracts-page">
      <h1 className="page-title">
        {bundle('extract')}
      </h1>
      <SelectWalletMessage />
      <Breadcrumb pages={pages} />
      {checkShowActions()}
      {renderRemoveConfirmation()}
      <div className="row m-t-20">
        <div className="col-md-12">
          <div className="panel panel-primary">
            <div className="panel-heading reset-color b-0">
              <div className="filter row">
                <div className="form-group">
                  <div className="col-sm-12">
                    {getYearsSelector()}
                    {getMonthSelector()}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row m-t-20">
        <div className="col-md-12">
          <div className="panel panel-primary">
            <div className="panel-heading">
              <div className="filter row">
                <div className="col-sm-12">
                  <div className="panel-title">{bundle('credits')}</div>
                </div>
              </div>
            </div>
            <div className="panel-body">
              <Errors errors={errors} setErrors={setErrors} />
              <div className="row">
                <DataGrid
                  columns={creditColumns}
                  headerInfo={headerInfo}
                  rows={userCredits}
                  actions={creditAction}
                  conf={conf}
                  sorters={sorters}
                  page={filterCredit.page}
                  setSort={value => setFilterCredit({ ...filterCredit, order: value })}
                  setPage={page => setFilterCredit({ ...filterCredit, page: page })}
                  totalPages={creditTotalPages}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="row m-t-20">
        <div className="col-md-12">
          <div className="panel panel-danger panel-extracts">
            <div className="panel-heading">
              <div className="filter row">
                <div className="col-sm-12">
                  <div className="panel-title">{bundle('debits')}</div>
                </div>
              </div>
            </div>
            <div className="panel-body">
              <Errors errors={errors} setErrors={setErrors} />
              <div className="row">
                <DataGrid
                  columns={debitColumns}
                  headerInfo={headerInfo}
                  rows={userDebits}
                  actions={debitAction}
                  conf={conf}
                  sorters={sorters}
                  page={filterDebit.page}
                  setSort={value => setFilterDebit({ ...filterDebit, order: value })}
                  setPage={page => setFilterDebit({ ...filterDebit, page: page })}
                  totalPages={debitTotalPages}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Extracts;