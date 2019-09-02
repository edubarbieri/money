import React from 'react';
import {useSelector} from 'react-redux';
import 'sass/loader';

const Loader = () => {
    const loading = useSelector(state => state.global.loading);

    return (
        <div className={(loading) ? 'loader-overlay show' : 'loader-overlay'}>
            <div className="loader-container">
                <div className="boxes">
                    <div className="box">
                        <div></div><div></div><div></div><div></div>
                    </div>
                    <div className="box">
                        <div></div><div></div><div></div><div></div>
                    </div>
                    <div className="box">
                        <div></div><div></div><div></div><div></div>
                    </div>
                    <div className="box">
                        <div></div><div></div><div></div><div></div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Loader;