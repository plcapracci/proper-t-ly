'use client';

import { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import CalendarView from '../../components/CalendarView';

export default function CalendarPage() {
  // Mock data - in a real app, this would come from the backend
  const [properties] = useState([
    { id: 1, name: 'Apartamento en Madrid' },
    { id: 2, name: 'Chalet en Barcelona' },
    { id: 3, name: 'Piso en Valencia' },
  ]);

  // Mock events - in a real app, these would be loaded from iCal feeds
  const [events] = useState([
    {
      id: 1,
      title: 'Reserva Airbnb',
      start: new Date(2023, 10, 10),
      end: new Date(2023, 10, 15),
      propertyId: 1,
      source: 'airbnb',
    },
    {
      id: 2,
      title: 'Reserva Booking',
      start: new Date(2023, 10, 18),
      end: new Date(2023, 10, 22),
      propertyId: 1,
      source: 'booking',
    },
    {
      id: 3,
      title: 'Reserva Airbnb',
      start: new Date(2023, 10, 5),
      end: new Date(2023, 10, 12),
      propertyId: 2,
      source: 'airbnb',
    },
    {
      id: 4,
      title: 'Reserva Booking',
      start: new Date(2023, 10, 25),
      end: new Date(2023, 10, 30),
      propertyId: 3,
      source: 'booking',
    },
  ]);

  const [selectedProperty, setSelectedProperty] = useState<number | null>(null);

  const filteredEvents = selectedProperty
    ? events.filter(event => event.propertyId === selectedProperty)
    : events;

  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Calendario de Ocupación</h1>
        
        <div className="mb-6">
          <label htmlFor="property-select" className="block text-sm font-medium text-gray-700 mb-2">
            Filtrar por propiedad
          </label>
          <select
            id="property-select"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            value={selectedProperty || ''}
            onChange={(e) => setSelectedProperty(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Todas las propiedades</option>
            {properties.map(property => (
              <option key={property.id} value={property.id}>
                {property.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="mb-4 flex justify-end space-x-4">
            <div className="flex items-center">
              <span className="w-4 h-4 bg-blue-500 rounded-full mr-2"></span>
              <span className="text-sm text-gray-600">Airbnb</span>
            </div>
            <div className="flex items-center">
              <span className="w-4 h-4 bg-yellow-500 rounded-full mr-2"></span>
              <span className="text-sm text-gray-600">Booking</span>
            </div>
          </div>
          
          <CalendarView events={filteredEvents} />
        </div>
      </div>
    </DashboardLayout>
  );
} 