import React from 'react';
import 'style/charts.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const CircleProgressBar = ({ progress = '0', icon = null, text = '' }) => {
    return (
        <div className={"pie-wrapper style-2 progress-" + progress}>
            <span className="label">
                {text ? text : <FontAwesomeIcon icon={icon} />}
            </span>
            <div className="pie">
                <div className="left-side half-circle"></div>
                <div className="right-side half-circle"></div>
            </div>
            <div className="graph-shadow"></div>
        </div>
    );
};

export default CircleProgressBar;
