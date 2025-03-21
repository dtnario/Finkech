import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AddTransaction from "./AddTransaction";
import { motion, AnimatePresence } from "framer-motion";
import Tabs from "./Tabs";
import TransactionList from "./TransactionList";
import TransactionFullList from "./TransactionFullList";
import Balance from "./Balance";
import AddTransactionButton from "./GlowButton";
import ExpenseChart from "./ExpenseChart";
import { QRCodeSVG } from 'qrcode.react';
import {
  API_GET_ACCOUNT,
  API_GEN_LINK,
  API_ADD_TRANSACTION,
  API_TRANSACTION_LIST,
  API_ADD_ACCOUNT,
  API_ACCOUNT_LIST,
  API_ADD_USER,
  API_ACCOUNT_USERS,
  API_GET_ACCOUNT_CATEGORIES,
} from "./constants";
import AccountIcon from "../img/u_coins.png"; // Импорт картинки
import StarIcon from "../img/star.png"; // Импорт картинки
import "./MainScreen.css";
import "./Toggle.css";
import BackButtonIcon from "../img/BackButton.png"; // Импорт картинки
import AngleIcon from "../img/u_angle-right-b.png";
import TransactionsPieChart from "./PieDiagram";
import AccountList from "./AccountList";
import ListButton from "./ListButton";
import PeriodToggle from "./PeriodToggle";
import Toggle from "./Toggle";
import InviteComponent from "./InvitePage";

const MainScreen = () => {
  /*const categories = [
    { id: 1, name: 'Groceries' },
    { id: 2, name: 'Taxi' },
    { id: 3, name: 'Mobile Phone' },
    { id: 4, name: 'Hobbies' },
    { id: 5, name: 'Kids' },
    { id: 6, name: 'Studying' },
    { id: 7, name: 'Investing' },
    { id: 8, name: 'Car' },
    { id: 9, name: 'House' },
    { id: 9, name: 'Pets' },
  ];*/
  const [inviteName, setInviteName] = useState("");
  const [inviteLink, setInviteLink] = useState("https://InviteLink");
  const [categories, setCategories] = useState([]);
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [transactions, setTransactions] = useState([]);
  const [account, setAccount] = useState(
    localStorage.getItem("account") || null
  );
  const [accountName, setAccountName] = useState(
    localStorage.getItem("accountName") || null
  );
  const [newAccountName, setNewAccountName] = useState("");
  const [accounts, setAccounts] = useState([]);
  const [isExpense, setIsExpense] = useState(true); // Добавляем состояние для типа транзакций
  const [currency, setCurrency] = useState("RUB"); // Добавляем состояние для валюты
  const [balance, setBalance] = useState(0); // Добавляем состояние для валюты
  const navigate = useNavigate();
  const [addedUser, setAddedUser] = useState("");
  const [userList, setUserList] = useState("USERS");
  const [currentStep, setCurrentStep] = useState(1);
  const [isDailyStats, setIsDailyStats] = useState(
    localStorage.getItem("isDailyStats") === "true"
  );
  const [AccountNameIsFocused, setAccountNameIsFocused] = useState(false); // Состояние фокуса

  const handleIsDailyStats = (isDaily) => {
    setIsDailyStats(isDaily);
    localStorage.setItem("isDailyStats", isDaily);

    console.log("IsDailyStats: " + localStorage.getItem("isDailyStats"));
  };

  const InviteMember = async () => {
    const body = {
      account_id: localStorage.getItem("account"),
      user_id: localStorage.getItem("token"),
    };
    const response = await fetch(API_GEN_LINK, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      throw new Error("Ошибка при генерации ссылки");
    }

    const data = await response.json();

    setInviteLink("http://158.160.52.121/invite?token="+data.link.token+"&account="+accountName)
  }

  const moveToSharing = () => {
    InviteMember();
    setCurrentStep(8);
  };
  const moveToAddTransaction = () => {
    setCurrentStep(2);
  };
  const moveToSettings = () => {
    setCurrentStep(7);
  };
  const moveToMainWindow = async () => {
    await updateTransactions();
    setCurrentStep(1);
  };
  const moveToTransactionList = () => {
    setCurrentStep(3);
  };
  const moveToStatisticsList = () => {
    setCurrentStep(4);
  };
  const moveToAddAccountWindow = () => {
    setCurrentStep(5);
  };
  const moveToChooseAccount = () => {
    fetchAccounts();
    setCurrentStep(6);
    console.log(accounts);
  };

  const handleTransactionListItemClick = (item) => {
    console.log("Нажата кнопка:", item.name);
  };

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {

      console.log('START CURR ACC ' + localStorage.getItem("account"))
      console.log('START CURR ACC NAME ' + localStorage.getItem("accountName"))

      if(localStorage.getItem("accountName") && !account) setAccountName(localStorage.getItem("accountName"));  
      if(localStorage.getItem("account") && !accountName) setAccount(localStorage.getItem("account"));   

      fetchAccounts();
    }
  }, [token, navigate]);

  const UpdateScreen = async () => {
    await updateTransactions();
    await getAccountUsers();
  };

  const getAccountUsers = async () => {
    try {
      const body = {
        accountid: localStorage.getItem("account"),
      };
      const response = await fetch(
        API_ACCOUNT_USERS + "?account_id=" + body.accountid,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при получении транзакций");
      }

      const data = await response.json();
      localStorage.setItem("accountUsers", data);

      setUserList(data.join(" • "));
    } catch (err) {
      console.error(err);
    }
  };

  const updateTransactions = async () => {
    const body = {
      userid: localStorage.getItem("token"),
      accountid: localStorage.getItem("account"),
    };
    fetchTransactions(body);

    console.log(account);
  };

  const GetPeriodTransactions = (data) => {
    const fetchData = async () => {
      try {
        // Задержка для имитации загрузки
        await new Promise((resolve) => setTimeout(resolve, 1000));
      } catch (error) {
        console.error("Ошибка при загрузке данных:", error);
      } finally {
      }
    };

    fetchData();

    return data;
  };

  const fetchTransactions = async (user) => {
    try {
      setTransactions([]);

      const response = await fetch(
        API_TRANSACTION_LIST +
          "?account_id=" +
          localStorage.getItem("account") +
          "&user_id=" +
          localStorage.getItem("token"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при получении транзакций");
      }

      const data = await response.json();
      if (data.transactions) setTransactions(data.transactions);

      const bal = await calculateBalance();
      setBalance(bal);

      await updateCategories();
    } catch (err) {
      console.error(err);
    }
  };

  const UpdatePeriodTransactions = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    const filteredTransactions = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.created_at);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionDay = transactionDate.getDate() + 1;

      if (localStorage.getItem("isDailyStats")) {
        // Фильтруем по текущему дню
        return (
          transactionYear === currentYear &&
          transactionMonth === currentMonth &&
          transactionDay === currentDay
        );
      } else {
        // Фильтруем по текущему месяцу
        return (
          transactionYear === currentYear && transactionMonth === currentMonth
        );
      }
    });

    console.log(filteredTransactions);
    return filteredTransactions.sort();
  };

  const addTransaction = async (transaction) => {
    try {
      const response = await fetch(API_ADD_TRANSACTION, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(transaction),
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении транзакции");
      }

      const data = await response.json();
      setTransactions([...transactions, transaction]);
    } catch (err) {
      console.error(err);
    }
  };

  const addUser = async () => {
    try {
      const newUser = {
        userId: addedUser,
        accountId: localStorage.getItem("account"),
      };
      const response = await fetch(API_ADD_USER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newUser),
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении транзакции");
      }

      const data = await response.json();
      setAddedUser("");
    } catch (err) {
      console.error(err);
    }
  };

  const UpdateBalance = () => {
    setBalance(calculateBalance());
  };

  const calculateBalance = async () => {
    try {
      const response = await fetch(
        API_GET_ACCOUNT +
          "?account_id=" +
          localStorage.getItem("account") +
          "&user_id=" +
          localStorage.getItem("token"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(),
        }
      );
      if (!response.ok) {
        throw new Error("Ошибка при добавлении транзакции");
      }
      const data = await response.json();
      console.log(data);
      return data.account.balance;
    } catch (err) {
      console.error(err);
    }
  };

  const updateCategories = async () => {
    try {
      const response = await fetch(
        API_GET_ACCOUNT_CATEGORIES +
          "?account_id=" +
          localStorage.getItem("account") +
          "&user_id=" +
          localStorage.getItem("token"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(),
        }
      );
      if (!response.ok) {
        throw new Error("Ошибка при добавлении транзакции");
      }
      const data = await response.json();
      console.log(data);
      setCategories(data.categories);
    } catch (err) {
      console.error(err);
    }
  };
  const handleCopy = () => {
    if (navigator.clipboard) {
      // Используем современный API, если доступен
      navigator.clipboard
        .writeText(inviteLink)
        .then(() => {
          alert("Текст скопирован в буфер обмена!");
        })
        .catch((err) => {
          console.error("Не удалось скопировать текст: ", err);
        });
    } else {
      // Fallback для старых браузеров
      const textArea = document.createElement("textarea");
      textArea.value = inviteLink;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand("copy"); // Копируем текст
        alert("Текст скопирован в буфер обмена!");
      } catch (err) {
        console.error("Не удалось скопировать текст: ", err);
      }
      document.body.removeChild(textArea); // Удаляем временный элемент
    }
  };
  const handleLogout = () => {
    setToken(null);
    setAccount(null);
    setTransactions([]);

    localStorage.removeItem("token");
    localStorage.removeItem("account");
    localStorage.removeItem("accountName");

    navigate("/login");
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const getUserList = () => {
    return userList;
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case "USD":
        return "$";
      case "EUR":
        return "€";
      case "RUB":
      default:
        return "₽";
    }
  };

  const handleChooseAccount = (item) => {
    console.log("Нажата кнопка:", item.id);
    localStorage.setItem("accountName", item.name);
    localStorage.setItem("account", item.id);
    setAccountName(item.name);
    setAccount(item.id);
    moveToMainWindow();
    updateTransactions();
  };

  const AddAccount = async () => {
    const newAccount = {
      user_id: token,
      name: newAccountName,
    };

    addAccount(newAccount);
    moveToMainWindow();
  };

  const fetchAccounts = async () => {
    try {
      const response = await fetch(
        API_ACCOUNT_LIST + "?user_id=" + localStorage.getItem("token"),
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(),
        }
      );

      if (!response.ok) {
        throw new Error("Ошибка при получении транзакций");
      }

      const data = await response.json();

      setAccounts(data.accounts);

      console.log("ACCS: " + accounts[0]);
      console.log('CURR ACC' + localStorage.getItem("account"))
      console.log('CURR ACC NAME' + localStorage.getItem("accountName"))

      if (accounts[0]) {
        if (!account) {
          console.log("ACCOUNT NOT NULL")
          localStorage.setItem("account", accounts[0].id);
          setActiveAccount(accounts[0].id);
        }

        if (!accountName) {
          localStorage.setItem("accountName", accounts[0].name);
          setAccountName(accounts[0].name);
        }
      }

      await fetchTransactions();
    } catch (err) {
      console.error(err);
    }
  };

  const setActiveAccount = (accountId) => {
    localStorage.setItem("account", accountId);
    setAccount(accountId);
  };

  const addAccount = async (account) => {
    try {
      const response = await fetch(API_ADD_ACCOUNT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(account),
      });

      if (!response.ok) {
        throw new Error("Ошибка при добавлении аккаунта");
      }

      const data = await response.json();

      localStorage.setItem("account", data.account.id);
      setActiveAccount(data.account.id);
      localStorage.setItem("accountName", data.account.name);
      setAccountName(data.account.name);

      await fetchAccounts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentStep}
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -10 }}
        transition={{ duration: 0.15 }}
      >
        <body>
          <div class="outer">
            <div class="inner" className="Container">
              <div>{CurrentStep()}</div>
            </div>
          </div>
        </body>
      </motion.div>
    </AnimatePresence>
  );

  function CurrentStep() {
    switch (currentStep) {
      case 1:
        return (
          <body>
            <div className="MainContainer">
              <div className="NavPanelBubbleContainer">
                <button
                  style={{ textAlign: "left", paddingLeft: "24px" }}
                  className="NavPanelButton-active"
                >
                  Dashboard
                </button>
                <button
                  style={{ textAlign: "center" }}
                  className="NavPanelButton"
                >
                  New Transaction
                </button>
                <button
                  style={{ textAlign: "right", paddingRight: "24px" }}
                  className="NavPanelButton"
                  onClick={moveToSettings}
                >
                  Settings
                </button>
              </div>

              <div className="Separator"></div>

              <div className="AdaptiveGrid">
                <div className="MobileSectionGrid">
                  <div className="HorizontalGrid6535">
                    <button
                      onClick={moveToChooseAccount}
                      className="AccountStatsContainer"
                      style={{ border: "none" }}
                    >
                      <div className="VerticalGrid">
                        <div className="HorizontalGridAccountInfo">
                          <div
                            style={{ textAlign: "left", marginLeft: "16px" }}
                          >
                            <img
                              src={AccountIcon}
                              alt="icon"
                              style={{ marginRight: "10px" }}
                              width={16}
                              height={16}
                            />
                          </div>
                          <h1
                            style={{ fontSize: "12px", color: "#D1D1D6" }}
                            className="currencyHeaderHeavy"
                          >
                            {accountName}
                          </h1>
                          <img
                            src={StarIcon}
                            alt="icon"
                            width={36}
                            height={36}
                          />
                        </div>
                        <h1 className="currencyHeaderHeavy">{balance}</h1>
                        <h1 className="currencyHeaderMain">RUB</h1>
                      </div>
                    </button>

                    <button
                      className="AddAccountButton"
                      onClick={moveToSharing}
                    >
                      <div
                        style={{
                          fontSize: "48px",
                          color: "#9747FF",
                          width: "80px",
                          height: "32px",
                        }}
                      >
                        +
                      </div>
                      <div
                        style={{
                          fontSize: "12px",
                          width: "80px",
                          height: "32px",
                        }}
                      >
                        Share
                      </div>
                    </button>
                  </div>

                  <div className="TransactionsContainer">
                    <TransactionList
                      transactions={transactions}
                      currencySymbol={getCurrencySymbol()}
                    />
                    <div style={{ marginBottom: "12px" }}></div>
                    <button
                      onClick={moveToTransactionList}
                      className="hrefTextMain"
                    >
                      Show more
                    </button>
                  </div>
                </div>

                <div className="MobileSectionGrid">
                  <div className="StatsContainer">
                    <div className="VerticalGridCentered">
                      <h3
                        className="currencyHeaderMain"
                        style={{
                          marginBottom: "16px",
                          marginRight: "16px",
                          fontWeight: "500",
                        }}
                      >
                        Statistics
                      </h3>
                      <PeriodToggle
                        isDailyStats={isDailyStats}
                        setIsDailyStats={handleIsDailyStats}
                      ></PeriodToggle>
                      <Toggle
                        isIncome={!isExpense}
                        setIsIncome={(value) => setIsExpense(!value)}
                      />
                      <TransactionsPieChart
                        transactions={transactions}
                        isDaily={isDailyStats}
                        isExpense={isExpense}
                      />
                      <div className="VerticalGridCentered">
                      <div className="StatisticsCroppedContainer">
                        <ExpenseChart
                          isDaily={isDailyStats}
                          data={transactions}
                          lStyle="listCropped"
                          isExpense={isExpense}
                        />
                      <button
                        onClick={moveToStatisticsList}
                        className="hrefTextMain"
                      >
                        Show more
                      </button>
                      </div>
                      </div>

                    </div>
                  </div>
                </div>
              </div>

              <AddTransactionButton
                text="+"
                onClick={moveToAddTransaction}
              ></AddTransactionButton>

              <div style={{ height: "100px" }}></div>
            </div>
          </body>
        );
      case 2:
        return (
          <AddTransaction
            updateCategories={updateCategories}
            categories={categories}
            addTransaction={addTransaction}
            currencySymbol={getCurrencySymbol()}
            prevStep={moveToMainWindow}
          />
        );
      case 3:
        return (
          <div className="Container">
            <div class="BackButtonContainer">
              <div style={{ display: "flex" }}>
                <button class="back-button" onClick={moveToMainWindow}>
                  <img
                    src={BackButtonIcon} // URL вашей картинки
                    alt="icon"
                    style={{ marginRight: "10px" }}
                    width={10}
                    height={10}
                  />
                </button>

                <div className="TransactionsContainer">
                  <TransactionFullList
                    transactions={transactions}
                    currencySymbol={getCurrencySymbol()}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="Container">
            <div className="BackButtonContainer">
              <div style={{ display: "flex", width: "100%" }}>
                <button class="back-button" onClick={moveToMainWindow}>
                  <img
                    src={BackButtonIcon}
                    alt="icon"
                    style={{ marginRight: "10px" }}
                    width={10}
                    height={10}
                  />
                </button>

                <div className="StatisticsFullContainer" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                  <div style={{ maxWidth: "600px", display: "flex", flexDirection: "column", alignItems: "center", gap: "16px" }}>
                    <PeriodToggle
                      isDailyStats={isDailyStats}
                      setIsDailyStats={handleIsDailyStats}
                    />
                    <Toggle
                      isIncome={!isExpense}
                      setIsIncome={(value) => setIsExpense(!value)}
                    />
                    <ExpenseChart
                      isDaily={isDailyStats}
                      data={transactions}
                      lStyle="list"
                      isExpense={isExpense}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 5:
        return (
          <body>
            <div class="outer" className="LoginBubble">
              <div class="inner" className="Container">
                <div>
                  <div>
                    <div className="container">
                      <button className="back-button" onClick={moveToMainWindow}>
                        <img
                          src={BackButtonIcon} // URL вашей картинки
                          alt="icon"
                          style={{ marginRight: "10px" }}
                          width={10}
                          height={10}
                        />
                      </button>

                      <div>
                        <h1 className="mainHeader">Name your</h1>
                        <h1
                          style={{ marginBottom: "8px" }}
                          className="mainHeader"
                        >
                          account
                        </h1>
                      </div>

                      <div className="empty-back-button">&nbsp;</div>
                    </div>
                    <div style={{ marginBottom: "8px" }}></div>
                    <div>
                      <input
                        type="account-name"
                        value={newAccountName}
                        onChange={(e) => setNewAccountName(e.target.value)}
                        placeholder={
                          AccountNameIsFocused ? "" : "Acccount Name"
                        }
                        onFocus={() => setAccountNameIsFocused(true)}
                        onBlur={() => setAccountNameIsFocused(false)}
                      />
                    </div>
                    <div style={{ marginBottom: "80px" }}></div>
                    <button onClick={AddAccount} className="LoginBubbleButton">
                      Create
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </body>
        );
      case 6:
        return (
          <div className="container">
            <div className="BackButtonContainer">

              <div className="StatisticsFullContainer">
                <button class="back-button" onClick={moveToMainWindow}>
                  <img
                    src={BackButtonIcon} // URL вашей картинки
                    alt="icon"
                    style={{ marginRight: "10px" }}
                    width={10}
                    height={10}
                  />
                </button>            
                  <AccountList
                    accounts={accounts}
                    handleClick={handleChooseAccount}
                  />
                </div>
              
            </div>
          </div>
        );
      case 7:
        return (
          <body>
          <button class="back-button" onClick={moveToMainWindow}>
          <img
            src={BackButtonIcon} // URL вашей картинки
            alt="icon"
            style={{ paddingLeft: "0px" }}
            width={10}
            height={10}
          />
        </button>
          <div class="outer" className="LoginBubble">
            <div class="inner" className="Container">
              <div class="container">
                <div
                  style={{ paddingLeft: "16px" }}
                  className="StatisticsCroppedContainer"
                >
                  <ListButton
                    text="Add Account"
                    onClick={moveToAddAccountWindow}
                    data={[]}
                  ></ListButton>
                  <ListButton
                    text="Exit"
                    onClick={handleLogout}
                    data={[]}
                  ></ListButton>
                </div>
              </div>
            </div>
          </div>
          </body>
        );
        case 8:
          return (
            <body>
             <button class="back-button" onClick={moveToMainWindow}>
                  <img
                    src={BackButtonIcon}
                    alt="icon"
                    style={{ paddingLeft: "0px" }}
                    width={10}
                    height={10}
                  />
            </button>
            <div class="outer" className="LoginBubble">
              <div class="inner" className="Container">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', padding: '16px' }}>
                  <div style={{ textAlign: 'center', width: '100%', maxWidth: '400px' }}>
                    <h1 style={{ paddingBottom: "24px" }} className="mainHeader">
                      Invite to account:
                    </h1>
                    <h1 style={{ paddingBottom: "24px" }} className="dopHeader">
                      {accountName}
                    </h1>
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                      <QRCodeSVG 
                        value={inviteLink}
                        size={200}
                        level="H"
                        includeMargin={true}
                        imageSettings={{
                          src: StarIcon,
                          x: undefined,
                          y: undefined,
                          height: 24,
                          width: 24,
                          excavate: true,
                        }}
                      />
                    </div>
                    <button onClick={handleCopy} className="LoginBubbleButton">
                      Copy Link
                    </button>
                  </div>
                </div>
              </div>
            </div>
            </body>
          )
    }
  }
};

export default MainScreen;

/*
<Tabs UpdateTransactions = {UpdateScreen}/>
<button className='buttonsec' onClick={handleLogout}>Выйти</button>
<button className='buttonsec' onClick={updateTransactions}>Обновить</button>
<h1>Финансовый менеджер</h1>
<Balance balance={calculateBalance()} currencySymbol={getCurrencySymbol()} userList = {getUserList()} />
<AddTransaction addTransaction={addTransaction} currencySymbol={getCurrencySymbol()} />
<TransactionList transactions={transactions} currencySymbol={getCurrencySymbol()} />
<div>
   <input
     type="text"
     value={addedUser}
     onChange={(e) => setAddedUser(e.target.value)}
     placeholder="  Добавить пользователя"
   />
   <button className='buttonsec' onClick={addUser}>Добавить</button>
 </div>
 */
