import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const Collapsable = ({ title, children = null }) => {
    const [expand, setExpand] = useState(false);

    return (
        <div className="card collapse">
            <h5 className="card-title collapse-toogle" onClick={() => setExpand(!expand)}>
                {title}
                <FontAwesomeIcon className="chevron" icon={expand ? faChevronUp :faChevronDown} />
            </h5>
            <div className={expand ? 'collapse-container show' : 'collapse-container'}>{children}</div>
        </div>
    );
};

export default Collapsable;
