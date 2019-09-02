import React, { useState } from 'react';
import bundle from 'i18n/bundle';
import {useSelector} from 'react-redux';
import 'moment/locale/pt-br';
import moment from 'moment';
import SelectSearch from 'react-select-search';
import { LANG } from 'i18n/service';
import Datepicker from './Datepicker';
import 'sass/filter'
import { isMobile } from 'service/util';
import MemberSelector from './MemberSelector';

const Filter = ({ filter, setFilter, onFilter}) => {
    let windowSize  = useSelector(state => state.global.width);
    let categories = useSelector(state => state.wallet.categories);
    moment.locale(LANG.toLowerCase());
    const year = moment().get('year');
    const [showFilter, setShowFilter] = useState(false);

    return (
        <div className="filter-container">
            {isMobile() && 
                <button className="btn btn-primary btn-text btn-icon pull-right"
                    onClick={() => setShowFilter(!showFilter)}
                    type="button">
                    {showFilter && <span>
                            <i className="fas fa-minus" />
                            {bundle('hide.filter')}
                        </span>
                    }
                    {!showFilter && <span>
                            <i className="fas fa-plus" />
                            {bundle('show.filter')}
                        </span>
                    }
                </button>
            }
            {(showFilter || !isMobile(windowSize)) && 
                <div className="filter-wrapper">
                    <div className="item">
                        <label>{bundle('category')}:</label>
                        <SelectSearch
                            value={filter.category}
                            options={categories}
                            className="select-search-box"
                            search={true}
                            onChange={value => setFilter({ ...filter, category: value.value })}
                        />
                    </div>
                    <div className="item type">
                        <input className="styled-checkbox default"
                            id="filterTypeCredit"
                            type="radio"
                            checked={(filter.isCredit) ? true : false}
                            value={filter.isCredit}
                            onChange={event => setFilter({ ...filter, isCredit: event.target.checked })} />
                        <label htmlFor="filterTypeCredit">{bundle('credit')}</label>
                    </div>
                    <div className="item type">
                        <input className="styled-checkbox default"
                            id="filterTypeDebit"
                            type="radio"
                            name="filterType"
                            checked={(filter.isCredit) ? false : true}
                            value={filter.isCredit}
                            onChange={event => setFilter({ ...filter, isCredit: !event.target.checked })} />
                        <label htmlFor="filterTypeDebit">{bundle('debit')}</label>
                    </div>
                    <div className="item range">
                        <input className="styled-checkbox default"
                            id="filterRange"
                            type="checkbox"
                            name="filterType"
                            checked={(filter.isRange) ? true : false}
                            value={filter.isRange}
                            onChange={event => setFilter({ ...filter, isRange: event.target.checked })} />
                        <label htmlFor="filterRange">{bundle('range')}</label>
                    </div>
                    {!filter.isRange && <>
                            <div className="item left">
                                <label className="control-label">{bundle('month')}:</label>
                                <select className="form-control"
                                value={filter.month}
                                onChange={event => setFilter({ ...filter, month: event.target.value })}>
                                    <option value="">{bundle('select')}</option>
                                {
                                    moment.months().map((month, idx) => (
                                        <option key={idx} value={idx + 1}>{month}</option>
                                    ))
                                }
                                </select>
                            </div>
                            <div className="item left">
                                <label>{bundle('year')}:</label>
                                <select className="form-control"
                                    value={filter.year}
                                    onChange={event => setFilter({ ...filter, year: event.target.value })}>
                                    <option value="">{bundle('select')}</option>
                                    <option value={year - 2}>{year - 2}</option>
                                    <option value={year - 1}>{year - 1}</option>
                                    <option value={year}>{year}</option>
                                    <option value={year + 1}>{year + 1}</option>
                                    <option value={year + 2}>{year + 2}</option>
                                </select>
                            </div>
                        </>
                    }
                    {filter.isRange &&
                        <div className="item date-range">
                            <label className="control-label">{bundle('date.range')}:</label>
                            <div>
                                <Datepicker
                                    date={filter.dateStart}
                                    collapsed={true}
                                    setDate={(value) => setFilter({ ...filter, dateStart: value})} />
                                <Datepicker
                                    date={filter.dateEnd}
                                    collapsed={true}
                                    setDate={(value) => setFilter({ ...filter, dateEnd: value})} />
                            </div>
                        </div>
                    }
                    <div className="item">
                        <MemberSelector
                            member={filter.member}
                            setMember={(value) => setFilter({ ...filter, member: value})} 
                        />
                    </div>
                    <div className="item filter-btn">
                        <button className="btn btn-light" onClick={() => onFilter()} type="button">
                            {bundle('doFilter')}
                        </button>
                    </div>
                </div>
            }
        </div>
    )
}

export default Filter;