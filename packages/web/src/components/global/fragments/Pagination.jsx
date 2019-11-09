import React from 'react';
import 'style/pager.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faAngleLeft, faAngleRight} from '@fortawesome/free-solid-svg-icons';


const Pagination = ({ page, setPage, totalPages, className = '' }) => {

    const renderPages = () => {
        let pages = [];
        for (let index = 1; index <= totalPages; index++) {
            pages.push(
                <div key={index} onClick={() => setPage(index)} className={page === index ? 'active' : ''}>
                    {index}
                </div>
            );
        }
        return pages;
    };

    return (
        totalPages > 1 && (
            <div className={className + ' pager'}>
                <div
                    className={page > 1 ? '' : 'disabled'}
                    onClick={() => {
                        if (page === 1) {
                            return;
                        }
                        setPage(page - 1);
                    }}>
                    <FontAwesomeIcon icon={faAngleLeft} />
                </div>
                {renderPages()}
                <div
                    className={page < totalPages ? '' : 'disabled'}
                    onClick={() => {
                        if (page === totalPages) {
                            return;
                        }
                        setPage(page + 1);
                    }}>
                    <FontAwesomeIcon icon={faAngleRight} />
                </div>
            </div>
        )
    );
};

export default Pagination;
