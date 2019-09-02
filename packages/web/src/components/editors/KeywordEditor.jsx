import React, {useState} from 'react';
import 'sass/keywordEditor';
import bundle from 'i18n/bundle';
import _ from 'lodash';

const KeywordEditor = ({ keywords, onChange }) => {
    const [editorKeywords, setEditorsKeywords] = useState(keywords);
    const [keywordEditor, setKeywordEditor] = useState('');

    const removeKeyword = (keyword) => {
        let auxJson = _.clone(editorKeywords);
        _.remove(auxJson, (value) => {
            return value === keyword;
        });
        setEditorsKeywords(auxJson);
        onChange(auxJson);
    }

    const renderKeywords = () => {
        return editorKeywords.map((keyword, idx) => (
            <span className="label label-light-default keyword-editor" key={idx}>
                {keyword}
                <i className="fa fa-times" onClick={() => removeKeyword(keyword)}></i>
            </span>
        ));
    }

    const checkAddKeyWord = (event) => {
        if (event.key === 'Enter') {
            var inputValue = event.target.value;
            if(!inputValue || editorKeywords.indexOf(inputValue) >= 0){
                return;
            }
            let auxJson = _.clone(editorKeywords);
            auxJson.push(inputValue)
            setKeywordEditor('');
            setEditorsKeywords(auxJson);
            onChange(auxJson);
        }
    }

    return (
        <div>
            <div className="form-group">
                <label className="w-100">{bundle("keywords")}</label>
                {renderKeywords()}
                <input type="text"
                    className="form-control"
                    value={keywordEditor}
                    onKeyDown={event => checkAddKeyWord(event)}
                    onChange={event => setKeywordEditor(event.target.value)} />
            </div>
        </div>
    );
}

export default KeywordEditor;