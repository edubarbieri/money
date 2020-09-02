import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import { bundle } from 'i18n/bundle';
import KeywordEditor from 'components/global/editors/KeywordEditor';
import { saveCategory } from 'reducers/category/categoryAction';

const CategoryEditor = ({ category, onCancel}) => {
    const [editCategory, setEditCategory] = useState({...category, name:category.name, keywords: category.keywords});
    const dispatch = useDispatch();
    
    const sendSave = () => {
        if(!editCategory.name){
            return;
        }
        dispatch(saveCategory(editCategory));
        onCancel();
    }

    const checkAddCategory = (event) => {
        if (event.key === 'Enter') {
            var inputValue = event.target.value;
            if(!inputValue){
                return;
            }
            sendSave();
        }
    }


    return (
        <div>
            <form>
                <div className={(!editCategory.name) ? 'form-group has-error': 'form-group'}>
                    <label>{bundle("category.name")}</label>
                    <input type="text"
                        className="form-control"
                        value={editCategory.name}
                        onKeyDown={event => checkAddCategory(event)}
                        onChange={event => setEditCategory({...editCategory, name: event.target.value})} />
                </div>
                <KeywordEditor keywords={category.keywords || []} onChange={keywords => setEditCategory({...editCategory, keywords: keywords})}/>
            </form>
            <div className="modal-footer">
                <button type="button" className="btn btn btn-outline-secondary btn-sm" onClick={onCancel}>{bundle('cancel')}</button>
                <button type="button" className="btn btn-primary btn-sm" onClick={sendSave}>{bundle('save')}</button>
            </div>
        </div>
    );
}

export default CategoryEditor;