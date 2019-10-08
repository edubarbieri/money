import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import bundle from 'i18n/bundle';
import MemberSelector from './MemberSelector';
import 'sass/calendar';
import 'sass/select';
import Datepicker from './Datepicker';
import SelectSearch  from 'react-select-search';
import { checkSize } from 'service/util';
import { bill as receiptService} from 'mymoney-sdk';
import Errors from 'components/message/Error';

const ReceiptsEditor = ({ receipt, onSave, onCancel}) => {
    let windowSize  = useSelector(state => state.global.width);
    let categories = useSelector(state => state.wallet.categories);
    let [errors, setErrors] = useState([]);

    const emptyReceipt = {
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

    let [editReceipt, setEditReceipt] = useState(emptyReceipt);

    useEffect(()=>{
        if(!receipt.id){
            return;
        }
        setEditReceipt(receipt);
    }, [receipt]);

    const saveReceipt = () => {
        if(editReceipt.id){
            receiptService.update(editReceipt).then(res => {
                if(res.status >= 400){
                    setErrors(res.errors);
                    return;
                }
                onSave();
                setEditReceipt(emptyReceipt);
            });
            return;
        }
        receiptService.add(editReceipt).then(res => {
            if(res.status >= 400){
                setErrors(res.errors);
                return;
            }
            onSave();
            setEditReceipt(emptyReceipt);
        });
    }

    const cancel = () => {
        setEditReceipt(emptyReceipt);
        onCancel(emptyReceipt);
    }

    return (
        <div className="panel panel-primary">
            <div className="panel-heading ">
                {(editReceipt && editReceipt.id) ? bundle('edit.receipt') : bundle('new.receipt')}
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
                                    value={editReceipt.description}
                                    onChange={event => setEditReceipt({ ...editReceipt, description: event.target.value })} />
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
                                        value={editReceipt.amount}
                                        placeholder="0.00"
                                        step="any"
                                        min="0"
                                        onChange={event => setEditReceipt({ ...editReceipt, amount: event.target.value})} />
                                </div>
                            </div>
                            <div className="col-md-6 col-xs-6">
                                <MemberSelector
                                    member={editReceipt.user}
                                    setMember={member => setEditReceipt({ ...editReceipt, user: member })} />
                            </div>
                        </div>
                        <div className="row">
                            <div className="col-md-12 m-t-20">
                                <label>{bundle("category")}</label>
                                <SelectSearch 
                                    value={(editReceipt.category) ? editReceipt.category.id : ''}
                                    options={categories} 
                                    className="select-search-box"
                                    search={true}
                                    onChange={value => setEditReceipt({ ...editReceipt, category: {...editReceipt.category, id: value.value}})}
                                />
                            </div>
                        </div>
                        <div>
                            <div className="col-md-4 col-xs-6 m-t-20">
                                <input className="styled-checkbox primary" id="repeatInpt" type="checkbox"
                                    checked={(editReceipt.recurrent) ? true : false}
                                    onChange={event => setEditReceipt({ ...editReceipt, recurrent: event.target.checked })} />
                                <label htmlFor="repeatInpt">
                                    <span>{bundle('recurrent')}</span>
                                </label>
                            </div>
                            <div className="col-md-5  col-xs-12">
                                <label className="center">{bundle("installment.qtd")}</label>
                                <div className="input-group">
                                    <input type="number"
                                        className="form-control right"
                                        value={editReceipt.recurrentTotal}
                                        onChange={event => setEditReceipt({ ...editReceipt, recurrentTotal: event.target.value })} />
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
                            date={editReceipt.dueDate}
                            setDate={(value, formattedDueDate) => setEditReceipt({ ...editReceipt, dueDate: value, formattedDueDate: formattedDueDate })}
                        />
                    </div>
                </div>
            </div>
            <div className="panel-footer">
                <div className="row">
                    <div className="col-md-3  col-xs-6 pull-right">
                        <button className="btn btn-primary w-100" onClick={saveReceipt} type="button">
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

export default ReceiptsEditor;