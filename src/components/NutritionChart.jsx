import { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from 'chart.js';
import { Doughnut, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export function MacroChart({ nutrition, size = 200 }) {
  const data = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [
        nutrition.protein * 4,  // calories from protein
        nutrition.carbs * 4,    // calories from carbs
        nutrition.fat * 9,      // calories from fat
      ],
      backgroundColor: [
        'rgba(16, 185, 129, 0.8)',
        'rgba(139, 92, 246, 0.8)',
        'rgba(245, 158, 11, 0.8)',
      ],
      borderColor: [
        'rgba(16, 185, 129, 1)',
        'rgba(139, 92, 246, 1)',
        'rgba(245, 158, 11, 1)',
      ],
      borderWidth: 2,
      hoverOffset: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '65%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          color: 'rgba(255,255,255,0.7)',
          padding: 16,
          usePointStyle: true,
          pointStyleWidth: 10,
          font: { family: 'Inter', size: 12 },
        },
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        titleFont: { family: 'Inter' },
        bodyFont: { family: 'Inter' },
        callbacks: {
          label: (ctx) => {
            const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
            const pct = ((ctx.raw / total) * 100).toFixed(1);
            return ` ${ctx.label}: ${pct}% (${ctx.raw} cal)`;
          },
        },
      },
    },
  };

  return (
    <div style={{ width: size, height: size, margin: '0 auto' }}>
      <Doughnut data={data} options={options} />
    </div>
  );
}

export function MicroChart({ nutrition }) {
  const data = {
    labels: ['Fiber', 'Vit A', 'Vit C', 'Calcium', 'Iron', 'Potassium'],
    datasets: [{
      label: '% Daily Value',
      data: [
        ((nutrition.fiber / 25) * 100).toFixed(0),
        nutrition.vitaminA || 0,
        nutrition.vitaminC || 0,
        nutrition.calcium || 0,
        nutrition.iron || 0,
        ((nutrition.potassium / 4700) * 100).toFixed(0),
      ],
      backgroundColor: 'rgba(16, 185, 129, 0.3)',
      borderColor: 'rgba(16, 185, 129, 0.8)',
      borderWidth: 2,
      borderRadius: 6,
      hoverBackgroundColor: 'rgba(16, 185, 129, 0.5)',
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: 'y',
    scales: {
      x: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.5)', font: { family: 'Inter', size: 11 } },
        max: 100,
      },
      y: {
        grid: { display: false },
        ticks: { color: 'rgba(255,255,255,0.7)', font: { family: 'Inter', size: 12 } },
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => ` ${ctx.raw}% Daily Value`,
        },
      },
    },
  };

  return (
    <div style={{ height: 280 }}>
      <Bar data={data} options={options} />
    </div>
  );
}

export function CalorieBarChart({ data: chartData, labels }) {
  const data = {
    labels: labels || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    datasets: [{
      label: 'Calories',
      data: chartData,
      backgroundColor: chartData.map((val) =>
        val > 2200 ? 'rgba(239, 68, 68, 0.6)' :
        val > 2000 ? 'rgba(245, 158, 11, 0.6)' :
        'rgba(16, 185, 129, 0.6)'
      ),
      borderColor: chartData.map((val) =>
        val > 2200 ? 'rgba(239, 68, 68, 1)' :
        val > 2000 ? 'rgba(245, 158, 11, 1)' :
        'rgba(16, 185, 129, 1)'
      ),
      borderWidth: 2,
      borderRadius: 8,
    }],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: 'rgba(255,255,255,0.5)', font: { family: 'Inter' } },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.05)' },
        ticks: { color: 'rgba(255,255,255,0.5)', font: { family: 'Inter' } },
        beginAtZero: true,
      },
    },
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.9)',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        callbacks: {
          label: (ctx) => ` ${ctx.raw} calories`,
        },
      },
    },
  };

  return (
    <div style={{ height: 250 }}>
      <Bar data={data} options={options} />
    </div>
  );
}
