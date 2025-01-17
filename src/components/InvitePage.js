import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from "react-router-dom";
import {
    API_ADD_ACCOUNT_BY_LINK,
  } from "./constants";
const InviteComponent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    }
  }, [navigate]);

  // Получаем текущее значение параметра "value"
  const value = searchParams.get("token");
  const accountName = searchParams.get("account");

  const onSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(API_ADD_ACCOUNT_BY_LINK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token: value, user_id: localStorage.getItem('token') }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || "Ошибка авторизации");
    }
    const data = await response.json();

    navigate("/");
  };

  return (
    <body>
      <div class="outer" className="LoginBubble">
        <div class="inner" className="Container">
          <div className="VerticalGridCentered">
            <h1 style={{ paddingBottom: "48px" }} className="mainHeader">
              Accept invite to account:
            </h1>
            <h1 style={{ paddingBottom: "48px" }} className="currencyHeader">
              {accountName}
            </h1>
            <form onSubmit={onSubmit}>
              <div></div>
              <button className={"LoginBubbleButton"}>Accept</button>
            </form>
          </div>
        </div>
      </div>
    </body>
  );
};

export default InviteComponent;
