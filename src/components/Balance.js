import React from "react";

const Balance = ({ balance, currencySymbol, userList }) => {
  return (
    <div className="Balance">
      <h2>{userList}</h2>
      <h4>Ваш баланс</h4>
      <h1>
        {currencySymbol}
        {balance}
      </h1>
    </div>
  );
};

export default Balance;
