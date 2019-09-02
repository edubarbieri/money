import React from 'react';
import 'sass/buttons';

const OneButton = ({ onClick = ()=>{}, light = false, label = '', fixed = false, position = '', small = false, compactContainer = false, icon = ''}) => {
  
  const getButtonContainerClass = () => {
    let btnClass = 'btn-container ';
    btnClass += (fixed) ? 'btn-fixed-container ': '';
    btnClass += (compactContainer) ? 'p-0 ': '';
    return btnClass;
  }
  
  const getButtonClass = () => {
    let btnClass = 'btn ';
    btnClass += (position) ? `pull-${position} `: 'pull-right ';
    btnClass += (small) ? 'btn-sm ': '';
    btnClass += (light) ? 'btn-light ': 'btn-primary ';
    btnClass += (compactContainer) ? 'm-0 ': '';
    btnClass += (icon) ? 'btn-icon ': '';
    return btnClass;
  }

  const renderIcon = () =>{
    if(icon){
      return (<i className={icon} />)
    }
  }

  return (
    <div className={getButtonContainerClass()}>
      <button className={getButtonClass()} onClick={onClick} type="button">
        {renderIcon()}
        {label}
      </button>
    </div>
  );
}

export default OneButton;