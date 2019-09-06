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
import { formatCurrency, isMobile } from 'service/util';
import Errors from 'components/message/Error';
import SelectSearch from 'react-select-search';
import _ from 'lodash';
import { importItau } from 'mymoney-sdk';
import Success from 'components/message/Success';

const ItauExtract = () => {
    const dispatch = useDispatch();
    dispatch({ type: SET_ACTIVE_PAGE, payload: route('import.itau.extract') })
    const [readedFileJSON, setReadedFileJSON] = useState([]);
    const [errors, setErrors] = useState([]);
    const [success, setSuccess] = useState([]);
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
        const lines = readedFile.split('\n');
        importItau.previewImport(lines)
            .then(resp => setReadedFileJSON(resp || []))
            .catch(e => setErrors(e.errors));
    }

    const setCategory = (idx, value) => {
        readedFileJSON[idx].categoryId = value.value;
        setReadedFileJSON(readedFileJSON);
    }

    const handleImport = () => {
        importItau.save(readedFileJSON)
            .then((resp) => {
                setReadedFileJSON([]);
                setSuccess([
                    <div>
                        <h4 >{bundle('import.resume')}</h4>
                        <strong className="credit">{bundleFormat('import.resume.credit')}</strong>{(resp.credits) ? resp.credits.length : 0}&nbsp;
                        <strong className="debit">{bundleFormat('import.resume.debit')}</strong>{(resp.debits) ? resp.debits.length : 0}&nbsp;
                        <strong>{bundleFormat('import.resume.already')}</strong>{resp.alreadyImporteds}
                    </div>
                ]);
            })
            .catch(e => setErrors(e.errors))
    }

    const { getRootProps, getInputProps } = useDropzone({ onDrop })

    const showImportedData = () => {
        return !!readedFileJSON.length && readedFileJSON.map((line, idx) => (
            <tr key={line.importHash}>
                <td>{moment(line.entryDate).format('DD/MM/YYYY')}</td>
                <td>{line.description}</td>
                <td>{formatCurrency(line.amount)}</td>
                <td className={line.isExpense ? 'debit' : 'credit'}>
                    {line.isExpense ? bundle('debit') : bundle('credit')}
                </td>
                <td className="t-a-l">
                    <SelectSearch
                        value={line.categoryId}
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
                <span className="line"><strong>{bundle('date')}:&nbsp;</strong>{moment(line.entryDate).format('DD/MM/YYYY')}</span>
                <span className="line"><strong>{bundle('description')}:&nbsp;</strong>{line.description}</span>
                <span className="line"><strong>{bundle('amount')}:&nbsp;</strong>{formatCurrency(line.amount)}</span>
                <span className="line"><strong>{bundle('type')}:&nbsp;</strong>
                    <span className={line.isExpense ? 'debit' : 'credit'}>
                        {line.isExpense ? bundle('debit') : bundle('credit')}
                    </span>
                </span>
                <span className="line"><strong>{bundle('category')}:&nbsp;</strong>
                    <SelectSearch
                        value={line.categoryId}
                        options={categories}
                        className="select-search-box"
                        search={true}
                        onChange={value => setCategory(idx, value)}
                    />
                </span>
            </div>
        ));
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
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                <p>{bundle('drag.drop')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="panel panel-minimal">
                        <Errors errors={errors} setErrors={setErrors} />
                        <Success success={success} setSuccess={setSuccess}/>
                    </div>
                </div>
            </div>
            {
                !!readedFileJSON.length &&
                <div className="row">
                    <div className="col-md-6 col-sm-12">
                        <div className="panel panel-primary">
                            <div className="panel-heading ">
                                <div className="panel-title">{bundle('collected.data')}</div>
                            </div>
                            <div className="panel-body">
                                {isMobile() && showMobileImportedData()}
                                {!isMobile() &&
                                    <div className="table-responsive  data-grid" style={{ overflow: 'inherit' }}>
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
        </div >
    );
}

export default ItauExtract;