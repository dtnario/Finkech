import React from 'react';
import Transaction from './Transaction';

const TransactionList = ({ transactions, currencySymbol }) => {
  return (
    <div className='VerticalGridCentered' >
      <h3 className='currencyHeaderMain' style={{marginLeft:'0px' , fontWeight:'500'}}>Last Records</h3>
      <div className='TransactionsGrid'>
            <ul className="list" style={{height:'400px'}}>
              {transactions.map((transaction) => (
                <Transaction key={transaction.id} transaction={transaction} currencySymbol={currencySymbol} />            
              ))}
            </ul>
          </div>
    </div>
  );
};

export default TransactionList;