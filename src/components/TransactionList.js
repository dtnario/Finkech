import React from "react";
import Transaction from "./Transaction";

const TransactionList = ({ transactions, currencySymbol }) => {
  // 1. Сортируем транзакции от новых к старым
  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  // 2. Группируем транзакции по датам
  const groupedTransactions = sortedTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.created_at).toLocaleDateString(); // Получаем дату без времени
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

  return (
    <div className="VerticalGridCentered">
      <h3
        className="currencyHeaderMain"
        style={{ marginLeft: "0px", fontWeight: "500" }}
      >
        Last Records
      </h3>
      <div className="TransactionsGrid">
        <ul className="list" style={{ height: "400px" }}>
          {Object.entries(groupedTransactions).map(([date, transactions]) => (
            <React.Fragment key={date}>
              {/* Добавляем разделитель с датой в начале списка */}
              <div
                style={{
                  textAlign: "center",
                  margin: "10px 0",
                  fontWeight: "bold",
                  color: "#666",
                  fontSize: '16px'
                }} className="currencyHeader"
              >
                {date}
              </div>
              {transactions.map((transaction) => (
                <Transaction
                  key={transaction.id}
                  transaction={transaction}
                  currencySymbol={currencySymbol}
                />
              ))}
            </React.Fragment>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TransactionList;