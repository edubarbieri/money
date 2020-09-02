import React from 'react';

const Modal = ({ title, setShow, children }) => {
    return (
        <div className="modal show">
            <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-title">
                            {title}
                        </h5>
                        <button type="button" className="close" onClick={setShow}>
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div className="modal-body">
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
