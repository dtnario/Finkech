import React from 'react';
import './Toggle.css'; // Импортируем стили

const Toggle = ({ isIncome, setIsIncome }) => {
  return (
    <div className="Toggle">
      <button
        type="button"
        className={!isIncome ? 'active' : ''}
        onClick={() => setIsIncome(false)}
      >
        Расходы
      </button>
      <button
        type="button"
        className={isIncome ? 'active' : ''}
        onClick={() => setIsIncome(true)}
      >
        Доходы
      </button>
    </div>
  );
};

export default Toggle;