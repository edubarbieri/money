import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import { SET_ACTIVE_PAGE } from 'store/globalActions';
import bundle, { bundleFormat } from 'i18n/bundle';
import SelectWalletMessage from 'components/global/SelectWalletMessage';
import route from 'i18n/route';
import Breadcrumb from 'components/breadcrumb/Breadcrumb';
import { useDropzone } from 'react-dropzone'
import 'sass/dropzone';
import moment from 'moment';
import {formatMoney, isMobile} from 'service/util';
import Errors from 'components/message/Error';
import SelectSearch  from 'react-select-search';
import _ from 'lodash';

const ItauExtract = () => {
    const dispatch = useDispatch();
    dispatch({ type: SET_ACTIVE_PAGE, payload: route('import.itau.extract') })
    const [readedFileJSON, setReadedFileJSON] = useState([]);
    const [errors, setErrors] = useState([]);
    let categories = useSelector(state => state.wallet.categories);

    const pages = [{
        label: bundle('import.itau.extract')
    }]

    const onDrop = useCallback(acceptedFiles => {
        setReadedFileJSON([]);
        if (!acceptedFiles || acceptedFiles.lentgh < 1) {
            return;
        }
        let firstFile = acceptedFiles[0];

        if ('text/plain' !== firstFile.type) {
            setErrors([bundleFormat('invalid.file', '.txt')])
            return;
        }
        setErrors([])

        let reader = new FileReader();
        reader.onload = function () {
            let readedFile = reader.result;
            mountExtractData(readedFile);
        };
        reader.readAsText(firstFile);
    }, [])

    const mountExtractData = (readedFile) => {
        let lines = readedFile.split('\n');
        if (lines.lentgh < 1) {
            return;
        }

        let auxJson = [];
        for (let index = 0; index < lines.length; index++) {
            const line = lines[index];
            let lineParts = line.split(';');

            if (!lineParts || lineParts.length < 3) {
                continue;
            }
            const amount = Number(lineParts[2].replace(',', '.'));
            auxJson.push({
                date: moment(lineParts[0], 'DD/MM/YYYY').toDate(),
                description: lineParts[1],
                amount: amount,
                type: (amount > 0) ? 'credit' : 'debit',
                categoryId: ''
            })
        }
        setReadedFileJSON(auxJson);
    }

    const setCategory = (idx, value) => {
        readedFileJSON[idx].categoryId = value.value;
        setReadedFileJSON(readedFileJSON);
    }

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    const showImportedData = () => {
        return !!readedFileJSON.length && readedFileJSON.map((line, idx) => (
            <tr key={idx}>
                <td>{moment(line.date).format('DD/MM/YYYY')}</td>
                <td>{line.description}</td>
                <td>{bundle('currency')}&nbsp;{formatMoney(line.amount)}</td>
                <td className={line.type}>{bundle(line.type)}</td>
                <td className="t-a-l">
                    <SelectSearch
                        value={line.category}
                        options={categories} 
                        className="select-search-box"
                        search={true}
                        onChange={value => setCategory(idx, value)}
                    />
                </td>
            </tr>
        ));
    }

    const showMobileImportedData = () => {
        return !!readedFileJSON.length && readedFileJSON.map((line, idx) => (
            <div key={idx} className="simple-card">
                <span className="line"><strong>{bundle('date')}:&nbsp;</strong>{moment(line.date).format('DD/MM/YYYY')}</span>
                <span className="line"><strong>{bundle('description')}:&nbsp;</strong>{line.description}</span>
                <span className="line"><strong>{bundle('amount')}:&nbsp;</strong>{bundle('currency')}&nbsp;{formatMoney(line.amount)}</span>
                <span className="line"><strong>{bundle('type')}:&nbsp;</strong><span className={line.type}>{bundle(line.type)}</span></span>
                <span className="line"><strong>{bundle('category')}:&nbsp;</strong>
                    <SelectSearch
                        value={line.category}
                        options={categories} 
                        className="select-search-box"
                        search={true}
                        onChange={value => setCategory(idx, value)}
                    />
                </span>
            </div>
        ));
    }

    const handleImport = () => {
        console.log('Import: ', readedFileJSON);
    }

    return (
        <div>
            <h1 className="page-title">{bundle('import.itau.extract')}</h1>
            <Breadcrumb pages={pages} />
            <SelectWalletMessage />
            <div className="row">
                <div className="col-md-6 col-sm-12">
                    <div className="panel panel-minimal">
                        <div className="panel-body">
                            <Errors errors={errors} setErrors={setErrors} />
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                <p>{bundle('drag.drop')}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {!!readedFileJSON.length && 
                <div className="row">
                    <div className="col-md-6 col-sm-12">
                        <div className="panel panel-primary">
                            <div className="panel-heading ">
                                <div className="panel-title">{bundle('collected.data')}</div>
                            </div>
                            <div className="panel-body">
                                {isMobile() && showMobileImportedData()}
                                {!isMobile() && 
                                    <div className="table-responsive  data-grid" style={{overflow: 'inherit'}}>
                                        <table className="table table-striped">
                                            <thead> 
                                                <tr>
                                                    <th>{bundle('date')}</th> 
                                                    <th>{bundle('description')}</th> 
                                                    <th>{bundle('amount')}</th> 
                                                    <th>{bundle('type')}</th> 
                                                    <th>{bundle('category')}</th> 
                                                </tr> 
                                            </thead> 
                                            <tbody> 
                                                {showImportedData()}
                                            </tbody> 
                                        </table>
                                    </div>
                                }
                            </div>
                            <div className="panel-footer t-a-r">
                                <button type="button" className="btn btn-primary" onClick={handleImport}>{bundle('do.import')}</button>
                            </div>
                        </div>
                    </div>
                </div>
            }
        </div>
    );
}

export default ItauExtract;