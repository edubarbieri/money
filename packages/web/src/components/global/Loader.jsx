import React from 'react';
import {useSelector} from 'react-redux';
import 'style/loader.scss';

const Loader = () => {
    const loading = useSelector(state => state.global.loading);

    return (
        <div className={(loading) ? 'loader-overlay show' : 'loader-overlay'}>
            <div className="loader-container">
                <div></div>
                <div></div>
            </div>
        </div>
    );
}

export default Loader;