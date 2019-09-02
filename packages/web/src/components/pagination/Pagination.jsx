import React from 'react';
import 'sass/pager'

const Pagination = ({ page, setPage, totalPages }) => {

  const renderPages = () => {
    let pages = []
    for (let index = 1; index <= totalPages; index++) {
      pages.push(
        <div key={index}  
          onClick={() => setPage(index)}
          className={(page === index) ? 'active' : ''}
          >{index}
        </div>
      )
    }
    return pages
  }

  return (totalPages > 1) &&
    <div className="pagination">
      <div className={(page > 1) ? '' : 'disabled'} 
        onClick={() => {
          if(page === 1){
            return;
          }
          setPage(page - 1);
        }}>
        <i className="fas fa-angle-left"></i>
      </div>
      {renderPages()}
      <div className={(page < totalPages) ? '' : 'disabled'} 
        onClick={() => {
          if(page === totalPages){
            return;
          }
          setPage(page + 1);
        }}>
        <i className="fas fa-angle-right"></i>
      </div>
    </div>
}

export default Pagination;