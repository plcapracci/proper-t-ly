'use client';

import { useState } from 'react';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'moment/locale/es';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Set locale to Spanish
moment.locale('es');
const localizer = momentLocalizer(moment);

interface CalendarEvent {
  id: number | string;
  title: string;
  start: Date;
  end: Date;
  propertyId: number | string;
  source: 'airbnb' | 'booking' | 'other';
}

interface CalendarViewProps {
  events: CalendarEvent[];
}

export default function CalendarView({ events }: CalendarViewProps) {
  const [view, setView] = useState('month');

  // Custom event styling based on source (Airbnb or Booking)
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor;
    
    switch (event.source) {
      case 'airbnb':
        backgroundColor = '#3b82f6'; // blue
        break;
      case 'booking':
        backgroundColor = '#eab308'; // yellow
        break;
      case 'other':
      default:
        backgroundColor = '#10b981'; // green
        break;
    }
    
    const style = {
      backgroundColor,
      borderRadius: '5px',
      color: '#fff',
      border: 'none',
      display: 'block',
    };
    return {
      style,
    };
  };

  // Custom toolbar component to translate to Spanish
  const CustomToolbar = (toolbar: any) => {
    const goToBack = () => {
      toolbar.onNavigate('PREV');
    };
    
    const goToNext = () => {
      toolbar.onNavigate('NEXT');
    };
    
    const goToCurrent = () => {
      toolbar.onNavigate('TODAY');
    };
    
    const viewNames = {
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      agenda: 'Agenda',
    };
    
    const label = () => {
      const date = moment(toolbar.date);
      return (
        <span className="text-lg font-semibold">
          {date.format('MMMM')} {date.format('YYYY')}
        </span>
      );
    };
    
    return (
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-2">
          <button
            type="button"
            onClick={goToBack}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
          >
            &lt;
          </button>
          <button
            type="button"
            onClick={goToCurrent}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
          >
            Hoy
          </button>
          <button
            type="button"
            onClick={goToNext}
            className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 text-gray-700"
          >
            &gt;
          </button>
        </div>
        <div>{label()}</div>
        <div className="flex space-x-2">
          {Object.entries(viewNames).map(([key, value]) => (
            <button
              key={key}
              type="button"
              onClick={() => toolbar.onView(key)}
              className={`px-3 py-1 rounded ${
                toolbar.view === key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              {value}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No hay reservas en este rango de fechas.',
  };

  return (
    <div className="h-[600px]">
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: '100%' }}
        eventPropGetter={eventStyleGetter}
        view={view as any}
        onView={(newView) => setView(newView)}
        components={{
          toolbar: CustomToolbar,
        }}
        messages={messages}
      />
    </div>
  );
} 