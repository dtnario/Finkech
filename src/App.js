import React, { useState, useEffect } from 'react';
import AppRouter from './AppRouter';
import { API_ADD_TRANSACTION, API_TRANSACTION_LIST } from './components/constants';
import { API_ADD_ACCOUNT ,  API_ACCOUNT_LIST , API_ADD_USER} from './components/constants';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [transactions, setTransactions] = useState([]);
  const [currency, setCurrency] = useState('RUB'); // Добавляем состояние для валюты
  const [account, setAccount] = useState(localStorage.getItem('account') || null);
  const [accountName, setAccountName] = useState(localStorage.getItem('accountName') || null);

  const calculateBalance = () => {
    return transactions.reduce((acc, transaction) => acc + transaction.value, 0);
  };

  const handleLogin = (token) => {
    localStorage.setItem('token', token);
    setToken(token);
  };

  const handleRegister = (token , accountName) => {
    localStorage.setItem('token', token);
    setToken(token);
    AddFirstAccount(token , accountName)
  };

  const setActiveAccount = (accountId , accountName) => {
    localStorage.setItem('account', accountId);
    localStorage.setItem('accountName', accountName);
    setAccount(accountId)
  };

  const addAccount = async (account) => {
      try {
        const response = await fetch(API_ADD_ACCOUNT, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify(account),
        });
        
        if (!response.ok) {
          throw new Error('Ошибка при добавлении аккаунта');
        }
  
        const data = await response.json();
        
        setActiveAccount(data.accountId , data.accountName)

      } catch (err) {
        console.error(err);
      }
  };

  const AddFirstAccount = async (token , accountName) => {

    const newAccount = {
      user_id: token,
      name : accountName
    };
    
    addAccount(newAccount)
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setTransactions([]);
  };

  const handleCurrencyChange = (e) => {
    setCurrency(e.target.value);
  };

  const getCurrencySymbol = () => {
    switch (currency) {
      case 'USD':
        return '$';
      case 'EUR':
        return '€';
      case 'RUB':
      default:
        return '₽';
    }
  };

  return (
    <div className="App">
      <AppRouter onLogin={handleLogin} onRegister={handleRegister} />
    </div>
  );

}

export default App;