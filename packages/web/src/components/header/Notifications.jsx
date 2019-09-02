import React, { useState } from 'react';

const Notifications = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div>
            <div className={(expanded) ? 'user-info pull-right notifications open' : 'user-info pull-right notifications'}>
                <div className="dropdown" onClick={() => setExpanded(!expanded)}>
                    <i className="far fa-envelope"></i>
                    <span className="badge badge-info">6</span>
                </div>
                <ul className="dropdown-menu pull-right">
                    <li className="first">
                        <div className="small">
                            <a className="pull-right danger" href="/">Mark all Read</a>
                            You have <strong>3</strong> new notifications.
                        </div>
                    </li>
                    <li>
                        <ul className="dropdown-list">
                            <li className="unread notification-success">
                                <i className="fas fa-angle-right"></i>
                                <span className="block-line strong">New user registered</span>
                                <span className="block-line small">30 seconds ago</span>
                            </li>
                        </ul>
                    </li>
                </ul>
            </div>
            <div onClick={() => setExpanded(false)} className="bg-fixed"></div>
        </div>
    );
}

export default Notifications;