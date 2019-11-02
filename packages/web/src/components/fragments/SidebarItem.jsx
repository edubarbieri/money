import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { route, bundle } from 'i18n/bundle';
import {faChevronDown} from '@fortawesome/free-solid-svg-icons';
import RegisterLink from 'components/global/RegisterLink';

const SidebarItem = ({ label, icon, children = null }) => {
    const currentPage = useSelector(state => state.global.currentPage);
    const [to] = useState(route(label) || '/');
    const [expand, setExpand] = useState(true);
    return children ? (
        <div>
            <li className="list-group-item" onClick={() => setExpand(!expand)}>
                <FontAwesomeIcon icon={icon} />
                <span className="title">{bundle(label)}</span>
                <FontAwesomeIcon className={expand ? 'chevron rotate' : 'chevron'} icon={faChevronDown} />
            </li>
            <div className={expand ? 'collapse-container show' : 'collapse-container'}>{children}</div>
        </div>
    ) : (
        <li className={currentPage === to ? 'list-group-item active' : 'list-group-item'}>
            <RegisterLink to={to}>
                <FontAwesomeIcon icon={icon} />
                <span className="title">{bundle(label)}</span>
            </RegisterLink>
        </li>
    );
};

export default SidebarItem;
