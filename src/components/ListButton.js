import React, { useRef } from "react";
import "./MainScreen.css";
import AngleIcon from "../img/u_angle-right-b.png";
import StarIcon from "../img/star.png"; // Импорт картинки

const ListButton = ({ text, onClick, data }) => {
  const buttonRef = useRef(null);

  return (
    <button
      type="button"
      ref={buttonRef}
      className="ListButton"
      onClick={onClick}
    >
      <div className="ListButtonGrid">
        <div className="ImgBox">
          <img src={StarIcon} alt="icon" width={24} height={24} />
        </div>

        <div className="choosedCategoryLabelMain">{text}</div>

        <div style={{ width: "1000px" }}></div>

        <div className="choosedCategoryHeaderMain">{data}</div>

        <div className="ImgBox">
          <img src={AngleIcon} alt="icon" width={24} height={24} />
        </div>
      </div>
    </button>
  );
};

export default ListButton;
