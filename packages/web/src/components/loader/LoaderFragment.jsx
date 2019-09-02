import React from 'react';
import 'sass/loader';

const LoaderFragment = () => {
    return (
        <div className="loader-overlay show">
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

export default LoaderFragment;