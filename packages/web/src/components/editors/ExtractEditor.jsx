import React from 'react';
import {useSelector} from 'react-redux';
import bundle from 'i18n/bundle';
import MemberSelector from './MemberSelector';
import 'sass/calendar';
import 'sass/select';
import { formatMoney } from 'service/util';
import Datepicker from './Datepicker';
import SelectSearch  from 'react-select-search';
import { checkSize } from 'service/util';

const ExpensesEditor = ({ extract, setExtract, onSave, onCancel }) => {
    let windowSize  = useSelector(state => state.global.width);
    let categories = useSelector(state => state.wallet.categories);

    return (
        <div className="panel panel-primary">
            <div className="panel-heading ">
                {(extract && extract.id) ? bundle('edit.extract') : bundle('new.extract')}
            </div>
            <div className="panel-body m-h-282">
                <div className="row">
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-12">
                                <label>{bundle("description")}</label>
                                <input type="text"
                                    className="form-control"
                                    value={extract.description}
                                    onChange={event => setExtract({ ...extract, description: event.target.value })} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-6">
                                <label>{bundle("value")}</label>
                                <div className="input-group">
                                    <span className="input-group-addon p-0">
                                        {bundle('currency')}
                                    </span>
                                    <input type="text"
                                        className="form-control"
                                        value={extract.value}
                                        placeholder="0.00"
                                        onChange={event => setExtract({ ...extract, value: formatMoney(event.target.value) })} />
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-6">
                                <MemberSelector
                                    member={extract.member}
                                    setMember={member => setExtract({ ...extract, member: member })}/>
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 m-t-20">
                                <label>{bundle("category")}</label>
                                <SelectSearch 
                                    value={extract.category}
                                    options={categories} 
                                    className="select-search-box"
                                    search={true}
                                    onChange={value => setExtract({ ...extract, category: value.value })}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-6 m-t-20">
                                <input className="styled-checkbox"
                                    id="isCredit"
                                    type="radio"
                                    name="editType"
                                    checked={(extract.isCredit) ? true : false}
                                    value={extract.isCredit}
                                    onChange={event => setExtract({ ...extract, isCredit: event.target.checked })} />
                                <label htmlFor="isCredit">{bundle('credit')}</label>
                            </div>
                            <div className="col-md-6 col-xs-6 m-t-20">
                                <input className="styled-checkbox danger"
                                    id="isDebit"
                                    type="radio"
                                    name="editType"
                                    checked={(extract.isCredit) ? false : true}
                                    value={extract.isCredit}
                                    onChange={event => setExtract({ ...extract, isCredit: !event.target.checked })} />
                                <label htmlFor="isDebit">{bundle('debit')}</label>
                            </div>
                        </div>
                    </div>
                    <div className={(checkSize(991, windowSize)) ?  'col-md-4 m-t-20' : 'col-md-4'}>
                        <Datepicker
                            title={bundle("date")}
                            date={extract.date}
                            setDate={(value, formattedValue) => setExtract({ ...extract, dueDate: value, formattedDate: formattedValue })}
                        />
                    </div>
                </div>
            </div>
            <div className="panel-footer">
                <div className="row">
                    <div className="col-md-3  col-xs-6 pull-right">
                        <button className="btn btn-primary w-100" onClick={() => onSave(extract)} type="button">
                            {bundle('save')}
                        </button>
                    </div>
                    <div className="col-md-3  col-xs-6 pull-right">
                        <button className="btn btn-light w-100" onClick={() => onCancel(extract)} type="button">
                            {bundle('cancel')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpensesEditor;