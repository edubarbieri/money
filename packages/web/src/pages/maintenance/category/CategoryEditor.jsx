import React, {useState} from 'react';
import bundle from 'i18n/bundle';
import KeywordEditor from 'components/editors/KeywordEditor';
import TwoButtons from 'components/buttons/TwoButtons';

const CategoryEditor = ({ onCancel, onConfirm, category }) => {
    const [categoryName, setCategoryName] = useState(category.title || '');
    const [categoryKeywords, setCategoryKeywords] = useState(category.keywords || []);

    const sendSave = () => {
        if(!categoryName){
            return;
        }
        category.title = categoryName;
        category.keywords = categoryKeywords;
        onConfirm(category)
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
        <div className="modal show fixed">
            <span className="overlay"></span>
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <i className="fas fa-times close-modal" onClick={onCancel} />
                        <h4 className="modal-title text-primary">
                            {(category.title) ? bundle('category.editor') : bundle('category.creation')}
                            <span className="weak">{category.title} </span>
                        </h4>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className={(!categoryName) ? 'form-group has-error': 'form-group'}>
                                <label>{bundle("category.name")}</label>
                                <input type="text"
                                    className="form-control"
                                    value={categoryName}
                                    onKeyDown={event => checkAddCategory(event)}
                                    onChange={event => setCategoryName(event.target.value)} />
                            </div>
                            <KeywordEditor keywords={category.keywords || []} onChange={setCategoryKeywords}/>
                        </form>
                    </div>
                    <div className="modal-footer">
                        <TwoButtons 
                            onSave={sendSave}
                            onCancel={onCancel}
                            compactContainer={true}/>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryEditor;