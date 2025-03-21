import React from "react";
import StarIcon from "../img/star.png"; // Импорт картинки
import AngleIcon from "../img/u_angle-right-b.png";
import GroceriesIcon from "../img/groceries.jpg";
import TaxiIcon from "../img/taxi.jpg";
import HouseIcon from "../img/house.jpg";
import RestaurantIcon from "../img/restaurant.jpg";

const categoryIcons = {
  'grocery': GroceriesIcon,
  'taxi': TaxiIcon,
  'home': HouseIcon,
  'restaurant': RestaurantIcon
};

const Transaction = ({ transaction, currencySymbol }) => {
  const type = transaction.value < 0 ? "Расход" : "Доход";
  const isIncome = transaction.value > 0;
  
  const getIconForCategory = (category) => {
    return categoryIcons[category] || StarIcon;
  };

  return (
    <li className={transaction.value < 0 ? "minus" : "plus"}>
      <div>
        <button
          key={transaction.id}
          /*onClick={() => handleClick(item)}*/
          className="CategoriesButton"
        >
          <div className="ListButtonGrid">
            <div className="ImgBox">
              <img src={getIconForCategory(transaction.category)} alt="icon" width={36} height={36} />
            </div>

            <div className="MainListVerticalGrid">
              <div className="MainListLabel">{transaction.category}</div>
              <div className="MainListSubLabel">
                {localStorage.getItem("accountName")}
              </div>
            </div>

            <div style={{ width: "1000px" }}></div>

            <div className="MainListVerticalGrid">
              <div className={isIncome ? "TransactionAmountLabelIncome" : "TransactionAmountLabelExpense"}>
                {transaction.value + currencySymbol}
              </div>
              <div className="MainListSubLabel">
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
