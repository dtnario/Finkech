import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSearchParams } from 'react-router-dom';


const InviteComponent = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    if (!localStorage.getItem("token")) {

      navigate("/login");
    }
  }, [navigate]);

  // Получаем текущее значение параметра "value"
  const value = searchParams.get('token');
  const accountName = searchParams.get('account');

  const onSubmit = async (e) => {
    e.preventDefault();

    navigate("/");
  };

  return (
    <body>
      <div class="outer" className="LoginBubble">
        <div class="inner" className="Container">
          <div className="VerticalGridCentered">
            <h1 style={{paddingBottom:'48px'}} className="mainHeader">Accept invite to account:</h1>
            <h1 style={{paddingBottom:'48px'}} className="currencyHeader">{accountName}</h1>
            <form onSubmit={onSubmit}>
              <div>
              </div>
              <button
                className={
                  "LoginBubbleButton"  
                }          
              >
                Accept
              </button>
            </form>
          </div>
        </div>
      </div>
    </body>
  );
};

export default InviteComponent;