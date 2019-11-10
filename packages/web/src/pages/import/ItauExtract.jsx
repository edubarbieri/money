import React, { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useDropzone } from 'react-dropzone';
import 'style/dropzone.scss';
import moment from 'moment';
import SelectSearch from 'react-select-search';
import _ from 'lodash';
import { bundle } from 'i18n/bundle';
import { formatCurrency } from 'services/Util';
import { setError } from 'reducers/global/globalAction';
import { setItauPreview, setChangeItauPreview, setImportItau, setClearItauImport, setClearItauPreview } from 'reducers/import/importAction';
import { fetchCategoriesWithPath } from 'reducers/category/categoryAction';

const ItauExtract = () => {
    const dispatch = useDispatch();
    const categories = useSelector(state => state.category.withPath);
    const itauPreview = useSelector(state => state.importation.itauPreview);
    const importItau = useSelector(state => state.importation.importItau);

    useEffect(() => {
        dispatch(fetchCategoriesWithPath());
    }, [dispatch]);

    const onDrop = useCallback(acceptedFiles => {
        if (!acceptedFiles || acceptedFiles.lentgh < 1) {
            return;
        }
        let firstFile = acceptedFiles[0];

        if ('text/plain' !== firstFile.type) {
            dispatch(setError('importItau', [bundle('invalid.file', '.txt')]));
            return;
        }

        dispatch(setError('importItau', []));

        let reader = new FileReader();
        reader.onload = function() {
            let readedFile = reader.result;
            const lines = readedFile.toString().split('\n');
            dispatch(setClearItauImport());
            dispatch(setItauPreview({ lines }));
        };
        reader.readAsText(firstFile);
    }, [dispatch]);

  
    const setCategory = (idx, value) => {
        itauPreview[idx].categoryId = value.value;
        dispatch(setChangeItauPreview(itauPreview));
    };

    const setAssociation = (idx, value) => {
        itauPreview[idx].association = value.value;
        dispatch(setChangeItauPreview(itauPreview));
    };
    
    const handleImport = () => {
        dispatch(setImportItau({entries:itauPreview}));
    };

    const { getRootProps, getInputProps } = useDropzone({ onDrop });

    const buildAssociations = possibleEntries => {
        let auxArray = [];
        for (let index = 0; index < possibleEntries.length; index++) {
            const element = possibleEntries[index];
            const name =
                element.description +
                ' - ' +
                moment(element.entryDate, 'YYYY-MM-DD').format(bundle('moment.date.format'));
            auxArray.push({ name: name, value: element.id });
        }
        return auxArray;
    };

    const showImportedData = () => {
        return (
            itauPreview.length &&
            itauPreview.map((line, idx) => (
                <tr key={line.importHash}>
                    <td>{moment(line.entryDate).format('DD/MM/YYYY')}</td>
                    <td>{line.description}</td>
                    <td>{formatCurrency(line.amount)}</td>
                    <td className={line.isExpense ? 'text-success font-weight-bold' : 'text-danger font-weight-bold'}>
                        {line.isExpense ? bundle('debit') : bundle('credit')}
                    </td>
                    <td className="t-a-l m-w-150">
                        <SelectSearch
                            value={line.categoryId}
                            options={categories}
                            className="select-search-box"
                            search={true}
                            onChange={value => setCategory(idx, value)}
                        />
                    </td>
                    <td className="t-a-l">
                        {_.isEmpty(line.possibleEntries) ? (
                            bundle('possible.entries')
                        ) : (
                            <SelectSearch
                                value=""
                                options={buildAssociations(line.possibleEntries)}
                                className="select-search-box"
                                search={true}
                                onChange={value => setAssociation(idx, value)}
                            />
                        )}
                    </td>
                </tr>
            ))
        );
    };

    return (
        <div className="container-fluid">
            <h1 className="page-title">{bundle('import.itau.extract')}</h1>
            {(!!!itauPreview.length || importItau) && <div className="row">
                <div className="col-md-12 col-sm-12">
                    <div className="panel panel-minimal">
                        <div className="panel-body">
                            <div {...getRootProps({ className: 'dropzone' })}>
                                <input {...getInputProps()} />
                                <p>{bundle('drag.drop')}</p>
                            </div>
                        </div>
                    </div>
                    <div className="panel panel-minimal"></div>
                </div>
            </div>}
            {importItau && <div>
                <table className="table border border-primary  table-responsive-sm">
                    <thead>
                        <tr className="border-0">
                            <th colSpan={3} className="border-0  text-center text-white bg-primary">{bundle('import.resume')}</th>
                        </tr>
                        <tr>
                            <th className="border-0 text-success text-center">{bundle('import.resume.credit')}</th>
                            <th className="border-0 text-center">{bundle('import.resume.already')}</th>
                            <th className="border-0 text-danger text-center">{bundle('import.resume.debit')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td className="border-0 text-success text-center">{(importItau.credits) ? importItau.credits.length : 0}</td>
                            <td className="border-0 text-center">{importItau.alreadyImporteds}</td>
                            <td className="border-0 text-danger text-center">{(importItau.debits) ? importItau.debits.length : 0}</td>
                        </tr>
                    </tbody>
                </table>
            </div>}
            {(!importItau && !!itauPreview.length) && (
                <div className="row">
                    <div className="col-md-12 col-sm-12">
                        <div className="card">
                            <div className="card-body p-0">
                                <h5 className="card-title text-primary mt-3">{bundle('collected.data')}</h5>
                                <table className="table table-striped custom-table  table-responsive-sm">
                                    <thead>
                                        <tr>
                                            <th>{bundle('date')}</th>
                                            <th>{bundle('description')}</th>
                                            <th>{bundle('amount')}</th>
                                            <th>{bundle('type')}</th>
                                            <th>{bundle('category')}</th>
                                            <th>{bundle('association')}</th>
                                        </tr>
                                    </thead>
                                    <tbody>{showImportedData()}</tbody>
                                </table>
                            </div>
                            <div className="card-footer text-right mobile-two-buttons">
                                <button type="button" className="btn btn-outline-secondary mr-2" onClick={() => dispatch(setClearItauPreview())}>
                                    {bundle('cancel')}
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleImport}>
                                    {bundle('do.import')}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ItauExtract;
