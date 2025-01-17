import React, { useState , useEffect } from 'react';
import { API_ADD_TRANSACTION, API_TRANSACTION_LIST , API_ADD_ACCOUNT ,  API_ACCOUNT_LIST , API_ADD_USER} from './constants';

const Tabs = ({ UpdateTransactions }) => {
  const [tabs, setTabs] = useState([
  ]);

  const [activeTab, setActiveTab] = useState(0);
  const [dropdownOpen, setDropdownOpen] = useState(null);
  const [account, setAccount] = useState(localStorage.getItem('account') || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);

  useEffect(() => {
    fetchAccounts()
    setActiveAccount(account)
  }, []);

  const AddAccount = async () => {

    const newAccount = {
      userId: token,
    };
    
    addAccount(newAccount)
    /*
    const newTab = {
      id: localStorage.getItem('account'),
      label: `Аккаунт ${localStorage.getItem('account')}`,
      content: `Содержимое аккаунта ${tabs.length + 1}`,
    };
    
    setTabs([...tabs, newTab]);
    
    //setActiveAccount(newTab.id);
    setDropdownOpen(false);
    */
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
      
      setActiveAccount(data.accountId)

      await fetchAccounts()
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAccounts = async () => {
    try {
      const body = {
        userid: localStorage.getItem('token'),
      };
      const response = await fetch(API_ACCOUNT_LIST, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error('Ошибка при получении транзакций');
      }

      const data = await response.json();

      const newTabs = data.map((account, index) => ({
        id: account.accountId,
        label: `Аккаунт ${account.accountId}`,
        content: `Содержимое аккаунта ${index + 1}`,
      }));
      
      setTabs([...newTabs]);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleDropdown = (tabId) => {
    setDropdownOpen(dropdownOpen === tabId ? null : tabId);
  };

  const removeTab = (tabId) => {
    setTabs(tabs.filter((tab) => tab.id !== tabId));
    if (activeTab === tabId) {
      setActiveAccount(tabs[0]?.id || null);
    }
  };

  const setActiveAccount = (accountId) => {
    localStorage.setItem('account', accountId);
    setActiveTab(accountId)
    setAccount(accountId)
    UpdateTransactions()
  };

  return (
    <div>
      <div style={{ display: 'flex', marginBottom: '10px' }}>
        {tabs.map((tab) => (
          <div key={tab.id} style={{ position: 'relative', marginRight: '10px' }}>
            <div
              onClick={() => setActiveAccount(tab.id)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: activeTab === tab.id ? '2px solid blue' : 'none',
              }}
            >
              {tab.label}
            </div>       
          </div>
        ))}
        <button onClick={AddAccount} style={{ marginLeft: '10px' , width : '64px' }}>
          +
        </button>
        <button onClick={fetchAccounts} style={{ marginLeft: '10px' , width : '64px' }}>
          ↺
        </button>
      </div>
    </div>
  );
};

export default Tabs;