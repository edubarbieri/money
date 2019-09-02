import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import bundle from 'i18n/bundle';
import MemberSelector from './MemberSelector';
import 'sass/calendar';
import 'sass/select';
import Datepicker from './Datepicker';
import SelectSearch  from 'react-select-search';
import { checkSize } from 'service/util';
import { bill as billService} from 'mymoney-sdk';
import Errors from 'components/message/Error';

const BillsEditor = ({ bill, onSave, onCancel}) => {
    let windowSize  = useSelector(state => state.global.width);
    let categories = useSelector(state => state.wallet.categories);
    let [errors, setErrors] = useState([]);

    const emptyBill = {
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
        dueDate: new Date(),
        formattedDueDate: '',
        recurrent: false,
        recurrentTotal: ''
    }

    let [editBill, setEditBill] = useState(emptyBill);

    useEffect(()=>{
        if(!bill.id){
            return;
        }
        setEditBill(bill);
    }, [bill]);

    const saveBill = () => {
        if(editBill.id){
            billService.update(editBill).then(res => {
                if(res.status >= 400){
                    setErrors(res.errors);
                    return;
                }
                onSave();
                setEditBill(emptyBill);
            });
            return;
        }
        billService.add(editBill).then(res => {
            if(res.status >= 400){
                setErrors(res.errors);
                return;
            }
            onSave();
            setEditBill(emptyBill);
        });
    }

    const cancel = () => {
        setEditBill(emptyBill);
        onCancel(emptyBill);
    }

    return (
        <div className="panel panel-danger">
            <div className="panel-heading ">
                {(editBill && editBill.id) ? bundle('edit.bill') : bundle('new.bill')}
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
                                    value={editBill.description}
                                    onChange={event => setEditBill({ ...editBill, description: event.target.value })} />
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
                                        value={editBill.amount}
                                        placeholder="0.00"
                                        step="any"
                                        min="0"
                                        onChange={event => setEditBill({ ...editBill, amount: event.target.value})} />
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-6">
                                <MemberSelector
                                    member={editBill.user}
                                    setMember={member => setEditBill({ ...editBill, user: member })} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 m-t-20">
                                <label>{bundle("category")}</label>
                                <SelectSearch 
                                    value={(editBill.category) ? editBill.category.id : ''}
                                    options={categories} 
                                    className="select-search-box"
                                    search={true}
                                    onChange={value => setEditBill({ ...editBill, category: {...editBill.category, id: value.value}})}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="col-md-4 col-xs-6 m-t-20">
                                <input className="styled-checkbox danger" id="repeatInpt" type="checkbox"
                                    checked={(editBill.recurrent) ? true : false}
                                    onChange={event => setEditBill({ ...editBill, recurrent: event.target.checked })} />
                                <label htmlFor="repeatInpt">
                                    <span>{bundle('recurrent')}</span>
                                </label>
                            </div>
                            <div className="col-md-5  col-xs-12">
                                <label className="center">{bundle("installment.qtd")}</label>
                                <div className="input-group">
                                    <input type="number"
                                        className="form-control right"
                                        value={editBill.recurrentTotal}
                                        onChange={event => setEditBill({ ...editBill, recurrentTotal: event.target.value })} />
                                    <span className="input-group-addon p-0">
                                        <i className="fas fa-times" style={{'fontSize': '10px', 'lineHeight': '25px'}}/>
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className={(checkSize(991, windowSize)) ?  'col-md-4 m-t-20' : 'col-md-4'}>
                        <Datepicker
                            title={bundle("due.date")}
                            date={editBill.dueDate}
                            setDate={(value, formattedDueDate) => setEditBill({ ...editBill, dueDate: value, formattedDueDate: formattedDueDate })}
                        />
                    </div>
                </div>
            </div>
            <div className="panel-footer">
                <div className="row">
                    <div className="col-md-3  col-xs-6 pull-right">
                        <button className="btn btn-danger w-100" onClick={saveBill} type="button">
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

export default BillsEditor;