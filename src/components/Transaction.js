import React from 'react';
import StarIcon from '../img/star.png'; // Импорт картинки
import AngleIcon from '../img/u_angle-right-b.png'

const Transaction = ({ transaction, currencySymbol }) => {
  const type = transaction.value < 0 ? 'Расход' : 'Доход';

  return (
    <li className={transaction.value < 0 ? 'minus' : 'plus'}>
      <div>
        <button
      key={transaction.id}
      /*onClick={() => handleClick(item)}*/
      className='CategoriesButton'
        >
        <div className='ListButtonGrid'>

        <div className='ImgBox'>
        <img
          src={StarIcon} 
          alt="icon"
          width={36} 
          height={36} 
        />  
        </div>

        <div className='MainListVerticalGrid'>
        <div className='MainListLabel'>
              {transaction.category}
        </div>
        <div className='MainListSubLabel'>
              {localStorage.getItem('accountName')}
        </div>
        </div>

        <div style={{width:'1000px'}}></div>

        <div className='MainListVerticalGrid'>
        <div className='MainListLabel'>
              {transaction.value + currencySymbol}
        </div>
        <div className='MainListSubLabel'>
              {transaction.created_by_email}
        </div>
        </div>

        </div> 
      </button>
      </div>  
    </li>
  
  );
};

export default Transaction;