import React from 'react';
import 'sass/buttons';
import bundle from 'i18n/bundle';

const TwoButtons = ({ onCancel, onSave, fixed = false, small = false, compactContainer = false }) => {

  const getButtonClass = () => {
    let btnClass = 'btn-container ';
    btnClass += (fixed) ? 'btn-fixed-container ': '';
    btnClass += (compactContainer) ? 'p-0 ': '';
    return btnClass;
  }

  return (
    <div className={getButtonClass()}>
      <button className={(small)? 'btn btn-primary btn-sm pull-right' : 'btn btn-primary pull-right'} onClick={onSave} type="button">
        {bundle('save')}
      </button>
      <button className={(small)? 'btn btn-light btn-sm pull-right' : 'btn btn-light pull-right'} onClick={onCancel} type="button">
        {bundle('cancel')}
      </button>
    </div>
  );
}

export default TwoButtons;