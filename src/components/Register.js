import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_AUTH_REGISTER, API_AUTH_LOGIN } from "./constants";
import "./Login.css";
import { motion, AnimatePresence } from "framer-motion";
import BackButtonIcon from "../img/BackButton.png"; // Импорт картинки

const Register = ({ onRegister }) => {
  const [email, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [accountName, setAccountName] = useState("");
  const [accountValue, setAccountValue] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [AccountNameIsFocused, setAccountNameIsFocused] = useState(false); // Состояние фокуса
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/");
    }
  }, [navigate]);

  const nextStep = (e) => {
    e.preventDefault();
    setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    localStorage.setItem("accountValue", accountValue);
    localStorage.setItem("accountName", accountName);
    console.log('NEW ACCOUNT' + accountName)
    try {
      const response = await fetch(API_AUTH_REGISTER, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, name: email, password: password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Ошибка регистрации");
      }

      const response_login = await fetch(API_AUTH_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email, password: password }),
      });

      if (!response_login.ok) {
        const data_login = await response_login.json();
        throw new Error(data_login.message || "Ошибка регистрации");
      }

      const data_login = await response_login.json();
      onRegister(data_login.user_id, accountName , accountValue);

      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  const ToLogin = (token) => {
    navigate("/Login");
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
          <div class="outer" className="LoginBubble">
            <div class="inner" className="Container">
              <div>{CurrentStep(currentStep)}</div>
            </div>
          </div>
        </body>
      </motion.div>
    </AnimatePresence>
  );

  function CurrentStep({ step }) {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <h1 className="mainHeader">Create account</h1>
            <h2 className="hrefHeader">
              Already have an account?
              <a href="/login" className="hrefText">
                {" "}
                Sign in
              </a>
            </h2>
            <form onSubmit={nextStep}>
              <div>
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Email"
                />
              </div>
              <button
                className={
                  email ? "LoginBubbleButton" : "DisabledLoginBubbleButton"
                }
                disabled={!email}
              >
                Continue
              </button>
            </form>
          </div>
        );
      case 2:
        return (
          <div>
            <div class="container">
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
                <h1 className="mainHeader">Create</h1>
                <h1 style={{ marginBottom: "8px" }} className="mainHeader">
                  password
                </h1>
              </div>

              <div class="empty-back-button">&nbsp;</div>
            </div>
            <form onSubmit={nextStep}>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm password"
                />
              </div>
              <button
                className={
                  password && confirmPassword && password == confirmPassword
                    ? "LoginBubbleButton"
                    : "DisabledLoginBubbleButton"
                }
                disabled={
                  !(password && confirmPassword && password == confirmPassword)
                }
              >
                Continue
              </button>
            </form>
          </div>
        );
      case 3:
        return (
          <div>
            <div class="container">
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
                <h1 className="mainHeader">Name your first</h1>
                <h1 style={{ marginBottom: "8px" }} className="mainHeader">
                  account
                </h1>
              </div>

              <div class="empty-back-button">&nbsp;</div>
            </div>
            <form onSubmit={nextStep}>
              <div style={{ marginBottom: "8px" }}></div>
              <div>
                <input
                  type="account-name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  placeholder={AccountNameIsFocused ? "" : "Acccount Name"}
                  onFocus={() => setAccountNameIsFocused(true)}
                  onBlur={() => setAccountNameIsFocused(false)}
                />
              </div>
              <div style={{ marginBottom: "80px" }}></div>
              <button className="LoginBubbleButton">Continue</button>
            </form>
          </div>
        );
      case 4:
        return (
          <div>
            <div class="BackButtonContainer">
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
                <h1 className="mainHeader">Set up your</h1>
                <h1 style={{ marginBottom: "8px" }} className="mainHeader">
                  cash balance
                </h1>
              </div>

              <div class="empty-back-button">&nbsp;</div>
            </div>

            <div style={{ marginBottom: "8px" }}></div>

            <form onSubmit={onSubmit}>
              <div>
                <div class="container2">
                  <input
                    type="currency-val"
                    value={accountValue}
                    onChange={(e) => setAccountValue(Number(e.target.value))}
                    placeholder="0"
                  />
                  <h1 className="currencyHeader">RUB</h1>
                </div>

                <div style={{ marginBottom: "80px" }}></div>
              </div>
              <button className="LoginBubbleButton" type="submit">
                Finish
              </button>
            </form>
          </div>
        );
      default:
        return (
          <div className="default-container">
            <h1>Неизвестный статус</h1>
            <p>Пожалуйста, свяжитесь с поддержкой.</p>
          </div>
        );
    }
  }
};

export default Register;
