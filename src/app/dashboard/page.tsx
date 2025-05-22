'use client';

import { useState } from 'react';
import Link from 'next/link';
import DashboardLayout from '../components/DashboardLayout';
import ProfitabilityChart from '../components/ProfitabilityChart';
import PropertyCard from '../components/PropertyCard';

export default function DashboardPage() {
  // Mock data - in a real app, this would come from the backend
  const [properties] = useState([
    {
      id: 1,
      name: 'Apartamento en Madrid',
      address: 'Calle Serrano, 123, Madrid',
      profitability: 8.5,
      income: 12500,
      expenses: 3500,
      occupancy: 85,
    },
    {
      id: 2,
      name: 'Chalet en Barcelona',
      address: 'Avenida Diagonal, 456, Barcelona',
      profitability: 7.2,
      income: 18000,
      expenses: 6500,
      occupancy: 78,
    },
    {
      id: 3,
      name: 'Piso en Valencia',
      address: 'Calle Colón, 789, Valencia',
      profitability: 6.8,
      income: 9000,
      expenses: 3200,
      occupancy: 72,
    },
  ]);

  const totalIncome = properties.reduce((sum, property) => sum + property.income, 0);
  const totalExpenses = properties.reduce((sum, property) => sum + property.expenses, 0);
  const totalProfit = totalIncome - totalExpenses;
  const averageProfitability = properties.reduce((sum, property) => sum + property.profitability, 0) / properties.length;

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <div className="card bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm mb-1">Ingresos totales</h3>
            <p className="text-2xl font-bold text-green-600">{totalIncome.toLocaleString('es-ES')} €</p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm mb-1">Gastos totales</h3>
            <p className="text-2xl font-bold text-red-600">{totalExpenses.toLocaleString('es-ES')} €</p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm mb-1">Beneficio</h3>
            <p className="text-2xl font-bold text-blue-600">{totalProfit.toLocaleString('es-ES')} €</p>
          </div>
          <div className="card bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-500 text-sm mb-1">Rentabilidad media</h3>
            <p className="text-2xl font-bold text-purple-600">{averageProfitability.toFixed(2)}%</p>
          </div>
        </div>
        
        {/* Profitability Chart */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold mb-4">Rentabilidad</h2>
          <ProfitabilityChart properties={properties} />
        </div>
        
        {/* Properties */}
        <h2 className="text-xl font-semibold mb-4">Mis Propiedades</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map((property) => (
            <PropertyCard key={property.id} property={property} />
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
} 