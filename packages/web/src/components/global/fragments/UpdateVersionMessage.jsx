import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { bundle } from 'i18n/bundle';

const UpdateVersionMessage = () => {
    const dispatch = useDispatch();
    const updateVersion = useSelector(state => state.global.updateVersion);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(!!updateVersion);
    }, [updateVersion])

    const reload = () => {
        window.location.reload(true);
    }

    return (
        show && (
            <div className="bottom-alert">
                <div className="message">
                    <p onClick={reload}>{bundle('new.version')}</p>
                    <span className="hide" onClick={() => setShow(false)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </span>
                </div>
            </div>
        )
    );
};

export default UpdateVersionMessage;
