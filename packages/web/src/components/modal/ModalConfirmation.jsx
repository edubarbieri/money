import React from 'react';
import bundle from 'i18n/bundle'

const ModalConfirmation = ({size = '', title, message, onConfirm, onClose}) => {
    return (
        <div className="modal show fixed">
            <span className="overlay"></span>
            <div className={"modal-dialog " + size}>
                <div className="modal-content">
                    <div className="modal-header">
                        <i className="fas fa-times close-modal" onClick={onClose} />
                        <h4 className="modal-title text-primary">{title}</h4>
                    </div>
                    <div className="modal-body">
                        <p>{message}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-primary btn-sm" onClick={onConfirm}>{bundle('continue')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ModalConfirmation;