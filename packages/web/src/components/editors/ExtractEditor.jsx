import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import bundle from 'i18n/bundle';
import MemberSelector from './MemberSelector';
import 'sass/calendar';
import 'sass/select';
import Datepicker from './Datepicker';
import SelectSearch  from 'react-select-search';
import { checkSize } from 'service/util';
import { credit as creditService, debit as debitService} from 'mymoney-sdk';
import Errors from 'components/message/Error';

const ExtractsEditor = ({ extract, onSave, onCancel}) => {
    let windowSize  = useSelector(state => state.global.width);
    let categories = useSelector(state => state.wallet.categories);
    let [errors, setErrors] = useState([]);

    const emptyExtract = {
        id: '',
        description: '',
        amount: '',
        user: {
            id: null,
            name: ''
        },
        category: {
            id: null,
            name: ''
        },
        objectEntryDate: new Date(),
        entryDate: new Date(),
        formattedDueDate: '',
        recurrent: false,
        recurrentTotal: '',
        type: ''
    }

    let [editExtract, setEditExtract] = useState(emptyExtract);

    useEffect(()=>{
        if(!extract.id){
            return;
        }
        setEditExtract(extract);
    }, [extract]);

    const saveExtract = () => {
        const service  = editExtract.type === 'credit' ? creditService : debitService;

        if(editExtract.id){
            service.update(editExtract).then(res => {
                if(res.status >= 400){
                    setErrors(res.errors);
                    return;
                }
                onSave();
                setEditExtract(emptyExtract);
            });
            return;
        }
        service.add(editExtract).then(res => {
            if(res.status >= 400){
                setErrors(res.errors);
                return;
            }
            onSave();
            setEditExtract(emptyExtract);
        });
    }

    const cancel = () => {
        setEditExtract(emptyExtract);
        onCancel(emptyExtract);
    }

    return (
        <div className="panel panel-primary">
            <div className="panel-heading ">
                {(extract && extract.id) ? bundle('edit.extract') : bundle('new.extract')}
            </div>
            <div className="panel-body m-h-282">
                <Errors errors={errors}  setErrors={setErrors}/>
                <div className="row">
                    <div className="col-md-8">
                        <div className="row">
                            <div className="col-md-12">
                                <label>{bundle("description")}</label>
                                <input type="text"
                                    className="form-control"
                                    id="inpt-description"
                                    value={editExtract.description}
                                    onChange={event => setEditExtract({ ...editExtract, description: event.target.value })} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-6 col-xs-6">
                                <label>{bundle("value")}</label>
                                <div className="input-group">
                                    <span className="input-group-addon p-0">
                                        {bundle('currency')}
                                    </span>
                                    <input type="number"
                                        className="form-control"
                                        value={editExtract.amount}
                                        placeholder="0.00"
                                        step="any"
                                        min="0"
                                        onChange={event => setEditExtract({ ...editExtract, amount: event.target.value})} />
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-6">
                                <MemberSelector
                                    member={editExtract.user}
                                    setMember={member => setEditExtract({ ...editExtract, user: member })} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 m-t-20">
                                <label>{bundle("category")}</label>
                                <SelectSearch 
                                    value={(editExtract.category) ? editExtract.category.id : ''}
                                    options={categories} 
                                    className="select-search-box"
                                    search={true}
                                    onChange={value => setEditExtract({ ...editExtract, category: {...editExtract.category, id: value.value}})}
                                />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-3 col-xs-3 m-t-20">
                                <input className="styled-checkbox"
                                    id="isCredit"
                                    type="radio"
                                    name="editType"
                                    checked={editExtract.type === 'credit'}
                                    disabled={!!editExtract.id}
                                    onChange={event => setEditExtract({ ...editExtract, type: (event.target.checked) ? 'credit' : 'debit' })} />
                                <label htmlFor="isCredit"><span>{bundle('credit')}</span></label>
                            </div>
                            <div className="col-md-3 col-xs-3 m-t-20">
                                <input className="styled-checkbox danger"
                                    id="isDebit"
                                    type="radio"
                                    name="editType"
                                    disabled={!!editExtract.id}
                                    checked={editExtract.type === 'debit'}
                                    onChange={event => setEditExtract({ ...editExtract, type: (!event.target.checked) ? 'credit' : 'debit'  })} />
                                <label htmlFor="isDebit"><span>{bundle('debit')}</span></label>
                            </div>
                            <div className="col-md-3 col-xs-6 m-t-20">
                                <input className="styled-checkbox danger" id="repeatInpt" type="checkbox"
                                    checked={(editExtract.recurrent) ? true : false}
                                    onChange={event => setEditExtract({ ...editExtract, recurrent: event.target.checked })} />
                                <label htmlFor="repeatInpt">
                                    <span>{bundle('recurrent')}</span>
                                </label>
                            </div>
                            <div className="col-md-3  col-xs-12">
                                <label className="center">{bundle("installment.qtd")}</label>
                                <div className="input-group">
                                    <input type="number"
                                        className="form-control right"
                                        value={editExtract.recurrentTotal}
                                        onChange={event => setEditExtract({ ...editExtract, recurrentTotal: event.target.value })} />
                                    <span className="input-group-addon p-0">
                                        <i className="fas fa-times" style={{'fontSize': '10px', 'lineHeight': '25px'}}/>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={(checkSize(991, windowSize)) ?  'col-md-4 m-t-20' : 'col-md-4'}>
                        <Datepicker
                            title={bundle("date")}
                            date={editExtract.objectEntryDate}
                            setDate={(value, formattedEntryDate) => setEditExtract({ ...editExtract, entryDate: value, formattedEntryDate: formattedEntryDate })}
                        />
                    </div>
                </div>
            </div>
            <div className="panel-footer">
                <div className="row">
                    <div className="col-md-3  col-xs-6 pull-right">
                        <button className="btn btn-danger w-100" onClick={saveExtract} type="button">
                            {bundle('save')}
                        </button>
                    </div>
                    <div className="col-md-3  col-xs-6 pull-right">
                        <button className="btn btn-light w-100" onClick={cancel} type="button">
                            {bundle('cancel')}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExtractsEditor;