import React, { useEffect, useRef } from "react";

// Цвета для топовых категорий
const topColors = ["#DFBBFF", "#FFD6B0", "#FFB2FF", "#C0B1FF", "#D7D7D7"];

// Функция для генерации случайного цвета
const getRandomColor = () => {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};

const ExpenseChart = ({ data, lStyle, isDaily }) => {
  // Вычисляем общую сумму всех трат
  const totalAmount = data.reduce((sum, item) => sum + item.amount, 0);

  // Ref для хранения ссылок на прогресс-бары
  const progressBarsRef = useRef([]);

  // Обновляем periodTransactions при изменении isDaily
  useEffect(() => {
    console.log("IS DAILY CHANGED EXPENSE");
    console.log(isDaily);
  }, [isDaily, data]);

  // Рассчитываем процент для каждой категории и сортируем по убыванию
  const sortedData = data
    .map((item) => ({
      ...item,
      percentage: ((item.amount / totalAmount) * 100).toFixed(2), // Рассчитываем процент
    }))
    .sort((a, b) => b.percentage - a.percentage); // Сортируем по убыванию процента

  const filterTransactions = (transactions, isDaily) => {
    console.log(transactions);
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const currentDay = now.getDate();

    return transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.created_at);
      const transactionYear = transactionDate.getFullYear();
      const transactionMonth = transactionDate.getMonth() + 1;
      const transactionDay = transactionDate.getDate();

      if (isDaily) {
        return (
          transactionYear === currentYear &&
          transactionMonth === currentMonth &&
          transactionDay === currentDay 
        );
      } else {
        return (
          transactionYear === currentYear && transactionMonth === currentMonth
        );
      }
    });
  };

  // Анимация прогресс-баров
  useEffect(() => {
    const data = filterTransactions(sortedData, isDaily);
    progressBarsRef.current.forEach((bar, index) => {
      if (data.length > 0) {
        const percentage = data[index].percentage;
        bar.style.width = "0%"; // Начальная ширина
        setTimeout(() => {
          bar.style.width = `${percentage}%`; // Конечная ширина
        }, 100); // Задержка для плавного старта анимации
      }
    });
  }, [sortedData, totalAmount]);

  function CurrentData() {
    if (filterTransactions(sortedData, isDaily).length > 0) {
      console.log("NO TRANS");
      return (
        <div
          style={{
            width: "320px",
            maxWidth: "600px",
            margin: "0 auto",
            paddingLeft: "16px",
            paddingRight: "16px",
          }}
        >
          <ul className={lStyle}>
            {filterTransactions(sortedData, isDaily).map((item, index) => {
              if (sortedData.length > 0) {
                // Выбираем цвет: для топовых категорий используем заданные цвета, для остальных — случайные
                const color =
                  index < topColors.length
                    ? topColors[index]
                    : getRandomColor();

                return (
                  <li key={item.category} style={{ marginBottom: "20px" }}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginBottom: "5px",
                      }}
                    >
                      <span>{item.category}</span>
                      <span>
                        {item.amount} RUB ({item.percentage}%)
                      </span>
                    </div>
                    <div
                      style={{
                        width: "100%",
                        height: "10px",
                        backgroundColor: "#e0e0e0", // Цвет фона шкалы
                        borderRadius: "5px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        ref={(el) => (progressBarsRef.current[index] = el)} // Сохраняем ссылку на прогресс-бар
                        style={{
                          width: "0%", // Начальная ширина (будет изменена анимацией)
                          height: "100%",
                          backgroundColor: color, // Используем выбранный цвет
                          borderRadius: "5px 5px 5px 5px", // Скругление только на левом конце
                          transition: "width 1s ease-out", // Анимация изменения ширины
                        }}
                      />
                    </div>
                  </li>
                );
              }
            })}
          </ul>
        </div>
      );
    } else {
      console.log("NO TRANS");
      return (
        <div
          style={{
            width: "320px",
            height: "320px",
            maxWidth: "600px",
            margin: "0 auto",
            paddingLeft: "16px",
            paddingRight: "16px",
            textAlign: "center",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h1 style={{ paddingTop: "64px" }} className="currencyHeaderMain">
            No Transactions In this Period
          </h1>
        </div>
      );
    }
  }

  return CurrentData();
};

export default ExpenseChart;
