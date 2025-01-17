import React from 'react';
import Transaction from './Transaction';

const TransactionFullList = ({ transactions, currencySymbol }) => {
  return (
    <div>
      <div className='TransactionsFullGrid'>
            <ul className="list">
              {transactions.map((transaction) => (
                <Transaction key={transaction.id} transaction={transaction} currencySymbol={currencySymbol} />            
              ))}
            </ul>
          </div>
    </div>
  );
};

export default TransactionFullList;