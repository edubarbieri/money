import React from 'react';
import 'sass/breadcrumbs';
import { Link } from 'react-router-dom';
import bundle from 'i18n/bundle';


const Breadcrumb = ({ pages }) => {
  
  const readPages = () => {
    if (!pages || !pages.length) {
      return;
    }
    return pages.map((item, idx) => {
      if (idx < pages.length - 1) {
        return (
          <li key={idx}>
            <Link to={item.link}>
              {item.label}
            </Link>
          </li>
        );
      }
      return (
        <li key={idx} className="active">
          {item.label}
        </li>
      )
    })
  }

  return (
    <ol className="breadcrumb">
      <li><Link to="/">{bundle('home')}</Link></li>
      {readPages()}
    </ol>
  );
}

export default Breadcrumb;
