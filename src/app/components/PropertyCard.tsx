'use client';

import Link from 'next/link';

interface Property {
  id: number;
  name: string;
  address: string;
  profitability: number;
  income: number;
  expenses: number;
  occupancy: number;
}

interface PropertyCardProps {
  property: Property;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const profit = property.income - property.expenses;
  const profitClass = 
    property.profitability > 8 ? 'text-green-600' : 
    property.profitability > 5 ? 'text-blue-600' : 'text-orange-600';

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-5">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{property.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{property.address}</p>
          </div>
          <div className={`text-lg font-bold ${profitClass}`}>
            {property.profitability.toFixed(1)}%
          </div>
        </div>
        
        <div className="mt-4 grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-sm text-gray-500">Ingresos</p>
            <p className="text-lg font-semibold text-green-600">{property.income.toLocaleString('es-ES')} €</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Gastos</p>
            <p className="text-lg font-semibold text-red-600">{property.expenses.toLocaleString('es-ES')} €</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Beneficio</p>
            <p className="text-lg font-semibold text-blue-600">{profit.toLocaleString('es-ES')} €</p>
          </div>
        </div>
        
        <div className="mt-4">
          <p className="text-sm text-gray-500 mb-1">Ocupación</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${property.occupancy}%` }}>
            </div>
          </div>
          <p className="text-xs text-right mt-1 text-gray-500">{property.occupancy}%</p>
        </div>
      </div>
      
      <div className="px-5 py-3 bg-gray-50 border-t border-gray-200">
        <Link 
          href={`/dashboard/property/${property.id}`}
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          Ver detalles →
        </Link>
      </div>
    </div>
  );
} 