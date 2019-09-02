import React from 'react';
import bundle from 'i18n/bundle'

const Modal = ({size = '',  title, text, fixed = false,  onConfirm, onCancel, onClose = onCancel}) => {
    return (
        <div className={(fixed) ? 'modal show fixed' : 'modal show'}>
            <span className="overlay"></span>
            <div className={"modal-dialog " + size}>
                <div className="modal-content">
                    <div className="modal-header">
                        <i className="fas fa-times close-modal" onClick={onClose || onCancel} />
                        <h4 className="modal-title text-primary">{title}</h4>
                    </div>
                    <div className="modal-body">
                        <p>{text}</p>
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-light btn-sm" onClick={onCancel}>{bundle('cancel')}</button>
                        <button type="button" className="btn btn-primary btn-sm" onClick={onConfirm}>{bundle('continue')}</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Modal;