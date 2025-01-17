import React, { useState } from "react";
import Transaction from "./Transaction";
import { Select, MenuItem, FormControl, InputLabel } from "@mui/material";

const TransactionFullList = ({ transactions, currencySymbol }) => {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const sortedTransactions = [...transactions].sort((a, b) => {
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const groupedTransactions = sortedTransactions.reduce((acc, transaction) => {
    const date = new Date(transaction.created_at).toLocaleDateString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(transaction);
    return acc;
  }, {});

  const categories = [
    "all",
    ...new Set(transactions.map((transaction) => transaction.category)),
  ];

  const filteredGroupedTransactions = Object.entries(groupedTransactions).reduce(
    (acc, [date, transactions]) => {
      const filteredTransactions = transactions.filter((transaction) => {
        if (selectedCategory === "all") {
          return true;
        }
        return transaction.category === selectedCategory;
      });

      if (filteredTransactions.length > 0) {
        acc[date] = filteredTransactions;
      }

      return acc;
    },
    {}
  );

  return (
    <div>
      {/* Фильтр по категориям с Material-UI */}
      <FormControl style={{ width: "200px", marginBottom: "20px" , marginTop:'16px' }}>
        <InputLabel id="category-filter-label">Filter by category</InputLabel>
        <Select
          labelId="category-filter-label"
          id="category-filter"
          value={selectedCategory}
          label="Filter by category"
          onChange={(e) => setSelectedCategory(e.target.value)}
          sx={{ width: "100%" , borderRadius:'16px'}} // Уменьшаем ширину
        >
          {categories.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {/* Список транзакций */}
      <div className="TransactionsFullGrid">
        <ul className="list" style={{ height: "420px" }}>
          {Object.entries(filteredGroupedTransactions).map(
            ([date, transactions]) => (
              <React.Fragment key={date}>
                <div className="date-header">{date}</div>
                {transactions.map((transaction) => (
                  <Transaction
                    key={transaction.id}
                    transaction={transaction}
                    currencySymbol={currencySymbol}
                  />
                ))}
              </React.Fragment>
            )
          )}
        </ul>
      </div>
    </div>
  );
};

export default TransactionFullList;