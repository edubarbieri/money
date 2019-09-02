import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { SET_ACTIVE_PAGE } from 'store/globalActions';
import { SHOW_EXTRACT_ACTIONS } from 'store/uxActions';
import bundle from 'i18n/bundle';
import route from 'i18n/route'
import ExtractEditor from 'components/editors/ExtractEditor';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import { LANG } from 'i18n/service';
import 'moment/locale/pt-br';
import moment from 'moment';
import _ from 'lodash';
import DataGrid from 'components/grid/DataGrid';
import SimpleGraph from 'components/graph/SimpleGraph';
import { getHumanDate } from 'service/dateUtil';
import { Mobile, Desktop } from 'components/wrapper';
import { isMobile } from 'service/util';
import Filter from 'components/editors/Filter';
import SelectWalletMessage from 'components/global/SelectWalletMessage';

const Extracts = () => {
  const dispatch = useDispatch();
  dispatch({ type: SET_ACTIVE_PAGE, payload: route('extract') })
  const pages = [{ label: bundle('extract') }]
  const showExtractActions = useSelector(state => state.ux.showExtractActions);

  const emptyExtract = { description: '', value: '', repeat: false, member: {}, date: new Date(), formattedDate: getHumanDate(), category: '' }
  
  moment.locale(LANG.toLowerCase());
  var filterDate = moment();
  const month = filterDate.month();
  const [filter, setFilter] = useState({
    month: month + 1,
    year: filterDate.get('year'),
    category: '',
    dateStart: new Date(),
    dateEnd: new Date(),
    isRange: false,
    isCredit: false
  });

  const onFilter = () => {
    console.log(filter);
  }

  const categories = [
    { value: 'chocolate', name: 'Chocolate' },
    { value: 'strawberry', name: 'Strawberry' },
    { value: 'vanilla', name: 'Vanilla' }
  ]

  const [graphData, setgraphData] = useState([
    {
      "id": bundle('debit'),
      "data": [
        { "x": moment.months(month - 4), "y": 1220 },
        { "x": moment.months(month - 3), "y": 952 },
        { "x": moment.months(month - 2), "y": 1352 },
        { "x": moment.months(month - 1), "y": 790 },
        { "x": moment.months(month), "y": 748 }
      ]
    },
    {
      "id": bundle('credit'),
      "data": [
        { "x": moment.months(month - 4), "y": 790 },
        { "x": moment.months(month - 3), "y": 1352 },
        { "x": moment.months(month - 2), "y": 1220 },
        { "x": moment.months(month - 1), "y": 748 },
        { "x": moment.months(month), "y": 952 }
      ]
    },
  ]);

  const mockExtracts = [
    {
      "id": "123",
      "description": "teste",
      "value": "123,12",
      "repeat": false,
      "isCredit": false,
      "member": {
        "avatar": "https://media.licdn.com/dms/image/C4E03AQEFqbs3VysSmA/profile-displayphoto-shrink_200_200/0?e=1570665600&v=beta&t=us26AsComdfJSMCx2ja8B3ue_ZoNgm1BmPOPb2M0X5Q",
        "name": "Matheus dos Santos",
        "id": "124",
        "active": true,
        "owner": false
      },
      "memberName": "Matheus dos Santos",
      "formattedDate": moment("2019-08-14T03:00:00.000Z").format('DD/MM/YYYY'),
      "formattedValue": bundle('currency') + " 123,12",
      "dueDate": "2019-08-14T03:00:00.000Z",
      "type": bundle('debit')
    },
    {
      "id": "124",
      "description": "asdasda",
      "value": "54,02",
      "repeat": false,
      "isCredit": true,
      "member": {
        "avatar": "https://gravatar.com/avatar/b733b54fa7871a4f97cd5968c3c26833",
        "name": "Matheus Barbieri",
        "id": "123",
        "active": true,
        "owner": true
      },
      "memberName": "Matheus Barbieri",
      "dueDate": "2019-08-22T03:00:00.000Z",
      "formattedDate": moment("2019-08-22T03:00:00.000Z").format('DD/MM/YYYY'),
      "formattedValue": bundle('currency') + " 54,02",
      "type": bundle('credit')
    }
  ]

  const [userExtracts, setUserExtracts] = useState(mockExtracts);

  const [columns, setColumns] = useState([
    { id: 'description', title: bundle('description') },
    { id: 'formattedValue', title: bundle('value') },
    { id: 'memberName', title: bundle('member') },
    { id: 'formattedDate', title: bundle('due.date') },
    { id: 'type', title: bundle('type') },
  ]);

  const [editExtract, setEditExtract] = useState({});

  var sorters = [
    "formattedValue",
    "formattedDate",
    "description",
    "type"
  ]

  var conf = {
    disabledProperty: 'isCredit'
  }

  const actions = (extract) => {
    return (
      <div className="actions-container">
        {actionsButtons(extract)}
      </div>
    )
  }

  const actionsButtons = (extract) => {
    return ([
      <div key="edit" onClick={() => openEditExtract(extract)}
        className="row-options edit">
        <i className="far fa-edit" />
        <label>{bundle('edit')}</label>
      </div>,
      <div key="remove" onClick={() => removeExtract(extract)}
        className="row-options remove">
        <i className="fa fa-trash-alt" />
        <label>{bundle('remove')}</label>
      </div>
    ])
  };

  const generateRecurrence = (extract) => {
    if (extract.fixed) {
      return bundle('fixed')
    } else if (extract.installment) {
      return extract.installmentQtd + ' ' + bundle('installment.qtd')
    }
    return bundle('unique')
  }

  const onSaveExtract = (data) => {
    let auxExtracts = _.clone(userExtracts);
    data.recurrence = generateRecurrence(data);
    data.memberName = (data.member) ? data.member.name : '';
    data.type = (data.isCredit) ? bundle('credit') : bundle('debit');
    data.formattedValue = bundle('currency') + ' ' + data.value;
    console.log(data);
    if (!data.id) {
      data.id = new Date().getTime();
      auxExtracts.push(data);
    } else {
      _.remove(auxExtracts, { id: data.id });
      auxExtracts.push(data);
    }
    setUserExtracts(auxExtracts);
    setEditExtract(emptyExtract);
    if (isMobile()) {
      dispatch({ type: SHOW_EXTRACT_ACTIONS, payload: false });
    }
  }

  const openEditExtract = (extract) => {
    if (extract.payed) {
      return;
    }
    dispatch({ type: SHOW_EXTRACT_ACTIONS, payload: true });
    extract.dueDate = moment(extract.formattedDate, 'DD/MM/YYYY').toDate();
    setEditExtract(extract);
  }

  const onCancelExtract = () => {
    setEditExtract(emptyExtract);
    if (isMobile()) {
      dispatch({ type: SHOW_EXTRACT_ACTIONS, payload: false });
    }
  }

  const removeExtract = (extract) => {
    if (extract.payed) {
      return;
    }
    let auxExtracts = _.clone(userExtracts);
    _.remove(auxExtracts, { id: extract.id });
    setUserExtracts(auxExtracts);
  }

  const checkShowActions = () => {
    if (showExtractActions) {
      return (
        <div>
          <div className="row">
            <div className="col-md-12">
              <button className="btn btn-primary btn-text btn-icon pull-right m-b-10"
                onClick={() => dispatch({ type: SHOW_EXTRACT_ACTIONS, payload: false })}
                type="button">
                <i className="fas fa-minus" />
                <Mobile>
                  {bundle('cancel.edit')}
                </Mobile>
                <Desktop>
                  {bundle('hide.info')}
                </Desktop>
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col-md-12 col-lg-8 col-xl-6 col-xxl-5">
              <ExtractEditor
                categories={categories}
                extract={editExtract}
                setExtract={setEditExtract}
                onSave={onSaveExtract}
                onCancel={onCancelExtract} />
            </div>
            <Desktop>
              <div className="col-md-12 col-lg-4 col-xl-6 col-xxl-7">
                <SimpleGraph
                  data={graphData}
                  panel="panel-primary"
                  colorScheme="set1"
                />
              </div>
            </Desktop>
          </div>
        </div>
      )
    }

    return (
      <div className="row">
        <div className="col-md-12">
          <Mobile>
            <button className="btn btn-primary btn-icon pull-right"
              onClick={() => dispatch({ type: SHOW_EXTRACT_ACTIONS, payload: true })}
              type="button">
              <i className="fas fa-plus" />
              {bundle('add.extract')}
            </button>
          </Mobile>
          <Desktop>
            <button className="btn btn-primary btn-text btn-icon pull-right"
              onClick={() => dispatch({ type: SHOW_EXTRACT_ACTIONS, payload: true })}
              type="button">
              <i className="fas fa-plus" />
              {bundle('expand.info')}
            </button>
          </Desktop>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h1 className="page-title">{bundle('extract')}</h1>
      <SelectWalletMessage />
      <Breadcrumb pages={pages} />
      {checkShowActions()}
      <div className="row m-t-20">
        <div className="col-md-12">
          <div className="panel panel-primary panel-extract">
            <div className="panel-heading reset-color">
              <div className="filter row">
                <Filter
                  filter={filter}
                  setFilter={setFilter}
                  categories={categories}
                  onFilter={onFilter}
                />
              </div>
            </div>
            <div className="panel-body">
              <div className="row">
                <DataGrid
                  columns={columns}
                  rows={userExtracts}
                  actions={actions}
                  conf={conf}
                  sorters={sorters}
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