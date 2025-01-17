import React, { useState } from "react";
import Toggle from "./Toggle";
import BackButtonIcon from "../img/BackButton.png"; // Импорт картинки
import ReverseBackButtonIcon from "../img/ReverseBackButton.png";
import { div } from "framer-motion/client";
import { motion, AnimatePresence } from "framer-motion";
import ListButton from "./ListButton";
import StarIcon from "../img/star.png"; // Импорт картинки
import AngleIcon from "../img/u_angle-right-b.png";
import { API_GET_ACCOUNT, API_POST_ACCOUNT_CATEGORY } from "./constants";
import "./GlowButton.css";

const AddTransaction = ({
  addTransaction,
  currencySymbol,
  prevStep,
  categories,
  updateCategories,
}) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [description, setDescription] = useState("");
  const [isIncome, setIsIncome] = useState(false); // Добавляем состояние для типа транзакции
  const [transactionValue, setTransactionValue] = useState("");
  const [currentWindow, setCurrentWindow] = useState(1);
  const [newCategory, setNewCategory] = useState("");
  const [AccountNameIsFocused, setAccountNameIsFocused] = useState(false); // Состояние фокуса
  const [category, setCategory] = useState("");
  const [account, setAccount] = useState("");

  const AddCategory = async (e) => {
    e.preventDefault();

    const accountRequestBody = {
      requester_user_id: localStorage.getItem("token"),
      account_id: localStorage.getItem("account"),
      category: newCategory,
    };

    const response = await fetch(API_POST_ACCOUNT_CATEGORY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(accountRequestBody),
    });

    await updateCategories();
    setNewCategory("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const accountRequestBody = {
      userId: localStorage.getItem("token"),
      accountId: localStorage.getItem("account"),
    };

    const response = await fetch(
      API_GET_ACCOUNT +
        "?account_id=" +
        accountRequestBody.accountId +
        "&user_id=" +
        accountRequestBody.userId,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(),
      }
    );

    const data = await response.json();

    if (transactionValue > 0 && response) {
      const newTransaction = {
        description,
        value: isIncome ? +transactionValue : -transactionValue, // Используем состояние для определения знака
        user_id: token,
        category: category,
        revision_id: data.account.revision_id,
        account_id: localStorage.getItem("account"),
      };

      await addTransaction(newTransaction);
      setDescription("");
      setTransactionValue("");

      prevStep();
    }
    //setIsIncome(true); // Сбрасываем состояние после добавления транзакции
  };

  function showAddTransactionWindow() {
    setCurrentWindow(1);
  }

  function showCategories() {
    setCurrentWindow(2);
  }

  function showAccounts() {
    setCurrentWindow(3);
  }

  const handleClick = (item) => {
    console.log("Нажата кнопка:", item.category);
    setCategory(item.category);
    showAddTransactionWindow();
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentWindow}
        initial={{ opacity: 0, x: 0 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 0 }}
        transition={{ duration: 0.15 }}
      >
        <body>
          <div class="outer" className="LoginBubble">
            <div class="inner" className="Container">
              <div>{CurrentWindow()}</div>
            </div>
          </div>
        </body>
      </motion.div>
    </AnimatePresence>
  );

  function CurrentWindow() {
    switch (currentWindow) {
      case 1:
        return (
          <div>
            <div className="BackButtonContainer">
              <button class="back-button" onClick={prevStep}>
                <img
                  src={BackButtonIcon} // URL вашей картинки
                  alt="icon"
                  style={{ marginRight: "10px" }}
                  width={10}
                  height={10}
                />
              </button>

              <div>
                <h1 className="mainHeader" style={{ marginLeft: "16px" }}>
                  Add transaction
                </h1>
              </div>

              <div class="empty-back-button">&nbsp;</div>
            </div>

            <div style={{ marginBottom: "8px" }}></div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                paddingBottom: "16px",
                paddingTop: "16px",
              }}
            >
              <Toggle isIncome={isIncome} setIsIncome={setIsIncome}></Toggle>
            </div>
            <form onSubmit={onSubmit}>
              <div>
                <div className="container2">
                  <input
                    type="currency-val"
                    value={transactionValue}
                    onChange={(e) => setTransactionValue(e.target.value)}
                    placeholder="0"
                  ></input>

                  <h1 className="currencyHeader">{currencySymbol}</h1>
                </div>

                <ListButton
                  text="Category"
                  onClick={showCategories}
                  data={category}
                ></ListButton>
              </div>

              <button
                className={
                  !account && !category
                    ? "DisabledLoginBubbleButton"
                    : "LoginBubbleButton"
                }
                type="submit"
                disabled={!account && !category}
              >
                Save
              </button>
            </form>
          </div>
        );
      case 2:
        return (
          <div className="Container">
            <div className="BackButtonContainer">
              <div style={{ display: "flex" }}>
                <button class="back-button" onClick={showAddTransactionWindow}>
                  <img
                    src={BackButtonIcon} // URL вашей картинки
                    alt="icon"
                    style={{}}
                    width={10}
                    height={10}
                  />
                </button>

                <div className="CategoriesGrid">
                  <ul className="list">
                    {categories.map((item) => (
                      <div>
                        <button
                          key={item.id}
                          onClick={() => handleClick(item)}
                          className="CategoriesButton"
                        >
                          <div className="HorizontalGridCategories">
                            <div className="ImgBox">
                              <img
                                src={StarIcon}
                                alt="icon"
                                width={36}
                                height={36}
                              />
                            </div>
                            <div className="categoryHeaderMain">
                              {item.category}{" "}
                            </div>
                            <div className="ImgBox">
                              <img
                                src={AngleIcon}
                                alt="icon"
                                width={24}
                                height={24}
                              />
                            </div>
                          </div>
                        </button>
                      </div>
                    ))}
                  </ul>
                  <div className="HorizontalGridAddCategory">
                    <input
                      type="account-name"
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value)}
                      placeholder={AccountNameIsFocused ? "" : "New Category"}
                      onFocus={() => setAccountNameIsFocused(true)}
                      onBlur={() => setAccountNameIsFocused(false)}
                    />
                    <button class="back-button" onClick={AddCategory}>
                      <img
                        src={ReverseBackButtonIcon} // URL вашей картинки
                        alt="icon"
                        style={{}}
                        width={10}
                        height={10}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
    }
  }
};

export default AddTransaction;

/*
<ListButton text="Accounts" onClick={showAccounts}
data = {localStorage.getItem('accountName')}></ListButton>
*/
