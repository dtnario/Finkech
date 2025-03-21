import React, { useEffect, useState, useRef } from "react";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionsPieChart = ({ transactions, isDaily, isExpense }) => {
  const [chartData, setChartData] = useState(null);
  const totalSumRef = useRef(0); // Используем useRef для хранения totalSum
  const chartRef = useRef(null); // Ссылка на диаграмму
  const [periodTransactions, setPeriodTransactions] = useState([]);

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

      // Фильтруем по типу транзакции (расход/доход)
      const isTransactionExpense = transaction.value < 0;
      if (isExpense !== isTransactionExpense) {
        return false;
      }

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

  // Обновляем periodTransactions при изменении isDaily или isExpense
  useEffect(() => {
    console.log("IS DAILY OR TYPE CHANGED");
    const filteredTransactions = filterTransactions(transactions, isDaily);
    setPeriodTransactions(filteredTransactions);
  }, [isDaily, isExpense, transactions]);

  // Обновляем данные диаграммы и totalSum
  useEffect(() => {
    console.log("list changed");
    if (!transactions || transactions.length === 0) return;

    const filteredTransactions = filterTransactions(transactions, isDaily);
    const categories = filteredTransactions.reduce((acc, transaction) => {
      const { category, value } = transaction;
      if (!category || value == null) return acc;
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += value;
      return acc;
    }, {});

    const sortedCategories = Object.entries(categories)
      .sort(([, valueA], [, valueB]) => isExpense ? valueA - valueB : valueB - valueA)
      .filter(([, value]) => isExpense ? value < 0 : value > 0);

    const topCategories = sortedCategories.slice(0, 4);
    const otherCategories = sortedCategories.slice(4);
    const otherSum = otherCategories.reduce((sum, [, value]) => sum + value, 0);

    const totalSum = Object.values(categories)
      .filter((value) => isExpense ? value < 0 : value > 0)
      .reduce((sum, value) => sum + value, 0);

    console.log("TOTAL:", totalSum);
    totalSumRef.current = totalSum;

    if (sortedCategories.length > 4) {
      const data = {
        labels: [...topCategories.map(([label]) => label), "Others"],
        datasets: [
          {
            label: "Сумма по категориям",
            data: [...topCategories.map(([, value]) => Math.abs(value)), Math.abs(otherSum)],
            backgroundColor: [
              "#DFBBFF",
              "#FFD6B0",
              "#FFB2FF",
              "#C0B1FF",
              "#D7D7D7",
            ],
            borderColor: [
              "rgb(255, 255, 255)",
              "rgb(255, 255, 255)",
              "rgb(255, 255, 255)",
              "rgb(255, 255, 255)",
              "rgb(255, 255, 255)",
            ],
            borderWidth: 3,
          },
        ],
      };
      setChartData(data);
    } else {
      const data = {
        labels: [...topCategories.map(([label]) => label)],
        datasets: [
          {
            label: "Сумма по категориям",
            data: [...topCategories.map(([, value]) => value), otherSum],
            backgroundColor: [
              "#DFBBFF",
              "#FFD6B0",
              "#FFB2FF",
              "#C0B1FF",
              "#D7D7D7",
            ],
            borderColor: [
              "rgb(255, 255, 255)",
              "rgb(255, 255, 255)",
              "rgb(255, 255, 255)",
              "rgb(255, 255, 255)",
              "rgb(255, 255, 255)",
            ],
            borderWidth: 3,
          },
        ],
      };

      setChartData(data);
    }

    // Принудительно перерисовываем диаграмму
    if (chartRef.current) {
      chartRef.current.update(); // Обновляем диаграмму
    }
  }, [transactions, periodTransactions, isDaily]);

  // Плагин для отображения круга и суммы
  const centerTextPlugin = {
    id: "centerText",
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      const radius = 100;

      // Рисуем белый круг
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.closePath();
      ctx.restore();

      // Отображаем суммарную сумму
      ctx.save();
      ctx.font = "bold 20px Montserrat";
      ctx.fillStyle = "black";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(`${totalSumRef.current} RUB`, centerX, centerY); // Используем значение из useRef
      ctx.restore();
    },
  };

  // Опции для диаграммы
  const options = {
    responsive: true,
    animation: {
      duration: 0,
      easing: "easeInOutQuad",
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  if (!chartData) {
    return <div>Loading data...</div>;
  }

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <div style={{ width: "300px", height: "300px" }}>
        <Pie
          ref={chartRef}
          data={chartData}
          options={options}
          plugins={[centerTextPlugin]}
        />
      </div>
    </div>
  );
};

export default TransactionsPieChart;
