'use client';

import { useState, useEffect } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import CalendarView from '../../components/CalendarView';
import axios from 'axios';

// Define the proper type for calendar events
interface CalendarEvent {
  id: string;  // Changed from number to string for compatibility with Prisma IDs
  title: string;
  start: Date;
  end: Date;
  propertyId: string;  // Changed from number to string for compatibility with Prisma IDs
  source: 'airbnb' | 'booking' | 'other';  // Added 'other' as a fallback
}

// Define property type
interface Property {
  id: string;
  name: string;
}

export default function CalendarPage() {
  // State for properties and events
  const [properties, setProperties] = useState<Property[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Fetch properties and bookings data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch properties
        const propertiesResponse = await axios.get('/api/properties');
        setProperties(propertiesResponse.data);
        
        // Fetch bookings
        const bookingsUrl = selectedProperty 
          ? `/api/bookings?propertyId=${selectedProperty}`
          : '/api/bookings';
        
        const bookingsResponse = await axios.get(bookingsUrl);
        
        // Convert string dates to Date objects
        const formattedEvents = bookingsResponse.data.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }));
        
        setEvents(formattedEvents);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedProperty]);

  // Filter events based on selected property (already handled by API query)
  const filteredEvents = events;

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
            onChange={(e) => setSelectedProperty(e.target.value || null)}
          >
            <option value="">Todas las propiedades</option>
            {properties.map((property) => (
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
            <div className="flex items-center">
              <span className="w-4 h-4 bg-green-500 rounded-full mr-2"></span>
              <span className="text-sm text-gray-600">Otras reservas</span>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-[600px]">
              <p>Cargando calendario...</p>
            </div>
          ) : (
            <CalendarView events={filteredEvents} />
          )}
        </div>
      </div>
    </DashboardLayout>
  );
} 