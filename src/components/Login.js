import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_AUTH_LOGIN , API_ACCOUNT_LIST} from './constants';
import './Login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountValue, setAccountValue] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');
  const navigate = useNavigate();

    useEffect(() => {
      if (localStorage.getItem('token')) {
        navigate('/');
      } 
    }, [navigate]);

  const ToRegister = (token) => {
    navigate('/Register');
  };

  const onSubmit = async (e) => {
    e.preventDefault();   
    try {      
      const response = await fetch(API_AUTH_LOGIN, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: username, password: password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Ошибка авторизации');
      }
      const data = await response.json(); 
      console.log(data); // Вывод объекта в консоль для проверки
      onLogin(data.user_id);

      const response_acc = await fetch(API_ACCOUNT_LIST + '?user_id=' 
              + localStorage.getItem('token'), {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
              },
              body: JSON.stringify(),
            });
      
            if (!response_acc.ok) {
              throw new Error('Ошибка при получении транзакций');
            }
      
            const data_acc = await response_acc.json();
            
            const account = data_acc.accounts[0];
                     
            if(account){
            if(!localStorage.getItem('account')){
            localStorage.setItem('account',account.id)
            }
      
            if(!localStorage.getItem('accountName')) {
            localStorage.setItem('accountName', account.name);
            }
      }


      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <body>
    <div class="outer" className="LoginBubble">
      <div class="inner" className="Container">
      <div>
            <h1 className="mainHeader">Log in</h1>
            <h2 className="hrefHeader">Have no account?
              <a href="/register" className="hrefText"> Create</a>
            </h2>
            <form onSubmit={onSubmit}>
              <div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Email"
                />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                />
              </div>
              <button  
              className={username && password? "LoginBubbleButton" : "DisabledLoginBubbleButton" }
              disabled={!(username&&password)} 
              >
                Continue
              </button>
            </form>
          </div>
    </div>
    </div>
    </body>
  );

}
export default Login;