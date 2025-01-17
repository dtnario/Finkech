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
  // Ref для хранения ссылок на прогресс-бары
  const progressBarsRef = useRef([]);

  // Обновляем periodTransactions при изменении isDaily
  useEffect(() => {
    console.log("IS DAILY CHANGED EXPENSE");
    console.log(isDaily);
  }, [isDaily, data]);

  // Фильтрация транзакций по дате (дневной/месячный)
  const filterTransactions = (transactions, isDaily) => {
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

  // Группировка транзакций по категориям и расчет суммы для каждой категории
  const groupTransactionsByCategory = (transactions) => {
    return transactions.reduce((acc, transaction) => {
      const { category, value } = transaction;
      if (!acc[category]) {
        acc[category] = {
          amount: 0,
          transactions: [], // Сохраняем все транзакции для этой категории
        };
      }
      acc[category].amount += Math.abs(value); // Суммируем amount (используем Math.abs для расходов)
      acc[category].transactions.push(transaction); // Добавляем транзакцию
      return acc;
    }, {});
  };

  // Преобразуем объект groupedData в массив и рассчитываем процент для каждой категории
  const getChartData = (transactions, isDaily) => {
    const filteredData = filterTransactions(transactions, isDaily); // Фильтруем по дате
    const groupedData = groupTransactionsByCategory(filteredData); // Группируем по категориям

    // Вычисляем общую сумму всех трат для отфильтрованных данных
    const totalAmount = Object.values(groupedData).reduce(
      (sum, category) => sum + category.amount,
      0
    );

    // Преобразуем в массив и рассчитываем процент для каждой категории
    return Object.keys(groupedData)
      .map((category) => ({
        category,
        amount: groupedData[category].amount,
        percentage: ((groupedData[category].amount / totalAmount) * 100).toFixed(2), // Рассчитываем процент
      }))
      .sort((a, b) => b.percentage - a.percentage); // Сортируем по убыванию процента
  };

  // Анимация прогресс-баров
  useEffect(() => {
    const chartData = getChartData(data, isDaily);
    progressBarsRef.current.forEach((bar, index) => {
      if (chartData.length > 0 && chartData[index]) {
        const percentage = chartData[index].percentage;
        bar.style.width = "0%"; // Начальная ширина
        setTimeout(() => {
          bar.style.width = `${percentage}%`; // Конечная ширина
        }, 100); // Задержка для плавного старта анимации
      }
    });
  }, [data, isDaily]);

  function CurrentData() {
    const chartData = getChartData(data, isDaily);

    if (chartData.length > 0) {
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
            {chartData.map((item, index) => {
              // Выбираем цвет: для топовых категорий используем заданные цвета, для остальных — случайные
              const color =
                index < topColors.length ? topColors[index] : getRandomColor();

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
            })}
          </ul>
        </div>
      );
    } else {
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