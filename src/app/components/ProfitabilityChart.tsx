'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface Property {
  id: number;
  name: string;
  income: number;
  expenses: number;
  profitability: number;
}

interface ProfitabilityChartProps {
  properties: Property[];
}

export default function ProfitabilityChart({ properties }: ProfitabilityChartProps) {
  const chartData = {
    labels: properties.map(property => property.name),
    datasets: [
      {
        label: 'Ingresos',
        data: properties.map(property => property.income),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderColor: 'rgba(34, 197, 94, 1)',
        borderWidth: 1,
      },
      {
        label: 'Gastos',
        data: properties.map(property => property.expenses),
        backgroundColor: 'rgba(239, 68, 68, 0.6)',
        borderColor: 'rgba(239, 68, 68, 1)',
        borderWidth: 1,
      },
      {
        label: 'Beneficio',
        data: properties.map(property => property.income - property.expenses),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Rentabilidad por propiedad',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Euros (€)',
        },
      },
    },
  };

  return (
    <div className="w-full h-80">
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
} 