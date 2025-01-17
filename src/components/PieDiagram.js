import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const TransactionsPieChart = ({ transactions }) => {
  const [chartData, setChartData] = useState(null);
  const [totalSum, setTotalSum] = useState(0);

  useEffect(() => {
    if (!transactions || transactions.length === 0) return;

    // Группируем транзакции по категориям
    const categories = transactions.reduce((acc, transaction) => {
      const { category, value } = transaction;
      if (!category || value == null) return acc; // Пропускаем некорректные данные
      if (!acc[category]) {
        acc[category] = 0;
      }
      acc[category] += value;
      return acc;
    }, {});

    // Преобразуем объект в массив и сортируем по убыванию значения
    const sortedCategories = Object.entries(categories)
      .sort(([, valueA], [, valueB]) => valueA - valueB);

    // Выбираем 4 самых больших категории
    const topCategories = sortedCategories.slice(0, 4);

    // Объединяем оставшиеся категории в "Остальные"
    const otherCategories = sortedCategories.slice(4);
    const otherSum = otherCategories.reduce((sum, [, value]) => sum + value, 0);
 
    // Суммарная сумма всех транзакций
    const totalSum = Object.values(categories).reduce((sum, value) => sum + value, 0);
    setTotalSum(totalSum);

    // Формируем данные для диаграммы
    if(sortedCategories.length > 4){
    const data = {
      labels: [...topCategories.map(([label]) => label), 'Остальные'],
      datasets: [
        {
          label: 'Сумма по категориям',
          data: [...topCategories.map(([, value]) => value), otherSum],
          backgroundColor: [
            '#DFBBFF',
            '#FFD6B0',
            '#FFB2FF',
            '#C0B1FF',
            '#D7D7D7',
          ],
          borderColor: [
            'rgb(255, 255, 255)',
            'rgb(255, 255, 255)',
            'rgb(255, 255, 255)',
            'rgb(255, 255, 255)',
            'rgb(255, 255, 255)',
          ],
          borderWidth: 3,
        },
      ],
    };
      setChartData(data);
    }
    else{
      const data = {
        labels: [...topCategories.map(([label]) => label)],
        datasets: [
          {
            label: 'Сумма по категориям',
            data: [...topCategories.map(([, value]) => value), otherSum],
            backgroundColor: [
              '#DFBBFF',
              '#FFD6B0',
              '#FFB2FF',
              '#C0B1FF',
              '#D7D7D7',
            ],
            borderColor: [
              'rgb(255, 255, 255)',
              'rgb(255, 255, 255)',
              'rgb(255, 255, 255)',
              'rgb(255, 255, 255)',
              'rgb(255, 255, 255)',
            ],
            borderWidth: 3,
          },
        ],
      };
      setChartData(data);
    }
  }, [transactions]);

  // Плагин для отображения круга и суммы
  const centerTextPlugin = {
    id: 'centerText',
    afterDraw: (chart) => {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      const centerX = (chartArea.left + chartArea.right) / 2;
      const centerY = (chartArea.top + chartArea.bottom) / 2;
      const radius = 100; // Увеличиваем радиус круга

      // Рисуем белый круг
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = 'white';
      ctx.fill();
      ctx.closePath();
      ctx.restore();

      // Отображаем суммарную сумму
      ctx.save();
      ctx.font = 'bold 20px Montserrat'; // Уменьшаем размер шрифта
      ctx.fillStyle = 'black';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${totalSum} RUB`, centerX, centerY);
      ctx.restore();
    },
  };

  // Опции для диаграммы
  const options = {
    responsive: true,
    animation: {
      duration: 0, // Анимация завершается мгновенно
      easing: 'easeInOutQuad', // Тип анимации
    },
    maintainAspectRatio: false, // Отключаем сохранение пропорций
    plugins: {
      legend: {
        display: true,
        position: 'top',
      },
      tooltip: {
        enabled: false, // Отключаем всплывающие подсказки
      },
    },
  };

  if (!chartData) {
    return <div>Загрузка данных...</div>; // Отображаем заглушку, пока данные загружаются
  }

  return (
    <div style={{ 
      width: '100%', 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
    }}>
      <div style={{ width: '300px', height: '300px' }}>
        <Pie data={chartData} options={options} plugins={[centerTextPlugin]} />
      </div>
    </div>
  );
};

export default TransactionsPieChart;