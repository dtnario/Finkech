import React, { useEffect, useState } from 'react';
import './Toggle.css'; // Импортируем стили

const PeriodToggle = ({isDailyStats , setIsDailyStats}) => {
  return (
    <div className="Toggle">
      <button
        type="button"
        className={isDailyStats ? 'active' : ''}
        onClick={() => setIsDailyStats(true)}
      >
        День
      </button>
      <button
        type="button"
        className={!isDailyStats ? 'active' : ''}
        onClick={() => setIsDailyStats(false)}
      >
        Месяц
      </button>
    </div>
  );
};

export default PeriodToggle;