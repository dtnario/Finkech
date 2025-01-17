import React from "react";
import StarIcon from "../img/star.png"; // Импорт картинки
import AngleIcon from "../img/u_angle-right-b.png";

const AccountList = ({ accounts, handleClick }) => {
  return (
    <div className="VerticalGridCentered">
      <h3
        className="currencyHeaderMain"
        style={{ marginLeft: "0px", fontWeight: "500" }}
      >
        Accounts
      </h3>
      <ul className="list">
        {accounts.map((item) => (
          <div>
            <button
              key={item.id}
              onClick={() => handleClick(item)}
              className="CategoriesButton"
            >
              <div className="HorizontalGridCategories">
                <div className="ImgBox">
                  <img src={StarIcon} alt="icon" width={36} height={36} />
                </div>
                <div className="categoryHeaderMain">{item.name} </div>
                <div className="ImgBox">
                  <img src={AngleIcon} alt="icon" width={24} height={24} />
                </div>
              </div>
            </button>
          </div>
        ))}
      </ul>
    </div>
  );
};

export default AccountList;
