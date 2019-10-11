import React, { useState, useRef } from 'react';
import 'sass/dataGrid';
import 'sass/icons.scss';
import _ from 'lodash';
import { isMobile, toogleActiveClass } from 'service/util';
import Pagination from 'components/pagination/Pagination';
import { element } from 'prop-types';

const DataGrid = ({ columns, rows, actions, conf, sorters, setSort, page = 1, totalPages = 1, setPage = () => {}, headerInfo}) => {
    const [localSorters, setLocalSorters] = useState(sorters);

    const doSort = (col) => {
        let srt = _.find(localSorters, {id : col.id});
        if(srt){
            let sorter = srt.filter + '_';
            sorter += (srt.reverse) ? 'DESC' : 'ASC';
            srt.reverse = !srt.reverse;
            setLocalSorters(localSorters);
            setSort(sorter);
        }
    }

    const checkDisabled = (row) => {
        if (!conf || !conf.disabledProperty || !row) {
            return false;
        }
        return row[conf.disabledProperty];
    }

    const renderColumns = () => {
        if (!columns) {
            return;
        }
        return columns.map((col, idx) => {
            if (_.find(localSorters, {id : col.id})) {
                return (
                    <th key={idx} className="sorter" onClick={() => doSort(col)}>
                        {col.title}
                        <i className="fas fa-sort"></i>
                    </th>
                )
            }
            return (<th key={idx}>{col.title}</th>)
        })
    }

    const renderRows = () => {
        if (!rows) {
            return;
        }
        return rows.map((row, idx) => (
            <tr key={idx} className={(checkDisabled(row)) ? 'disabled' : ''}>
                {extractOrdenatedRows(row)}
                <td className="actions">
                    {actions(row)}
                </td>
            </tr>
        ))
    }

    const extractOrdenatedRows = (row) => {
        return columns.map((col, idx) => (
            <td key={idx}>{_.get(row, col.id) || ''}</td>
        ))
    }

    const renderContentInfo = (action) => {
        return columns.map((col, idx) => (
            <div key={idx}>
                <strong>{col.title}:&nbsp;</strong>
                {_.get(action, col.id) || ''}
            </div>
        ))
    }
    
    const renderHeaderInfo = (action) => {
        return headerInfo.map((col, idx) => (
            <span key={idx} className={col.className}>{_.get(action, col.id) || ''}</span>
        ))
    }

    const renderContents = () => {
        if (!columns || !rows) {
            return;
        }
        return rows.map((row, idx) => {
            row.active = false;
            return <div key={row.id} className={(checkDisabled(row)) ? 'item col-sm-12 disabled' : 'item col-sm-12'}>
                <div className="card list-row">
                    <div className="header" onClick={(elem) => toogleActiveClass(elem.target.closest('.card'))}>
                        {renderHeaderInfo(row)}
                        <div className="html-icon-plus"></div>
                    </div>
                    <div className="content">
                        {renderContentInfo(row)}
                        {actions(row)}
                    </div>
                </div>
            </div>
        })
    }

    return (
        <div>
            <div className="col">
                {isMobile() &&
                    <div className="data-list cards-container box-view grid-view">
                        <div className="row">
                            {renderContents()}
                        </div>
                    </div>
                }
                {!isMobile() &&
                    <div className="table-responsive data-grid">
                        <table className="table table-striped">
                            <thead>
                                <tr>
                                    {renderColumns()}
                                </tr>
                            </thead>
                            <tbody>
                                {renderRows()}
                            </tbody>
                        </table>
                    </div>
                }
            </div>
            <div className="col">
                <Pagination 
                    page={page} 
                    setPage={setPage}
                    totalPages={totalPages}
                    />
            </div>
        </div>
    );
}

export default DataGrid;