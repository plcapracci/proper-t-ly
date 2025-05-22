import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/options';
import ical from 'node-ical';

// Define BookingSource enum to match the schema
enum BookingSource {
  AIRBNB = 'AIRBNB',
  BOOKING = 'BOOKING',
  DIRECT = 'DIRECT',
  OTHER = 'OTHER'
}

const prisma = new PrismaClient();

// POST /api/calendar/sync - Sincronizar reservas desde Airbnb y Booking
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const body = await request.json();
    const { propertyId } = body;
    
    if (!propertyId) {
      return NextResponse.json({ error: 'Se requiere propertyId' }, { status: 400 });
    }
    
    // Verificar que el usuario es propietario de la propiedad
    const property = await prisma.property.findFirst({
      where: {
        id: propertyId,
        userId: session.user.id,
      },
    });
    
    if (!property) {
      return NextResponse.json({ error: 'Propiedad no encontrada o no autorizada' }, { status: 404 });
    }
    
    const results = {
      airbnb: { success: false, bookings: 0, message: 'No hay URL de iCal para Airbnb' },
      booking: { success: false, bookings: 0, message: 'No hay URL de iCal para Booking' },
    };
    
    // Sincronizar desde Airbnb
    if (property.airbnbIcalUrl) {
      try {
        const airbnbEvents = await ical.async.fromURL(property.airbnbIcalUrl);
        let airbnbBookings = 0;
        
        // Eliminar reservas antiguas de Airbnb para esta propiedad
        await prisma.booking.deleteMany({
          where: {
            propertyId,
            source: BookingSource.AIRBNB,
          },
        });
        
        // Crear nuevas reservas
        for (const key in airbnbEvents) {
          const event = airbnbEvents[key];
          if (event.type === 'VEVENT' && event.start && event.end) {
            await prisma.booking.create({
              data: {
                startDate: event.start,
                endDate: event.end,
                guestName: event.summary || 'Huésped de Airbnb',
                source: BookingSource.AIRBNB,
                externalId: event.uid,
                propertyId,
              },
            });
            airbnbBookings++;
          }
        }
        
        results.airbnb = {
          success: true,
          bookings: airbnbBookings,
          message: `${airbnbBookings} reservas importadas correctamente`,
        };
      } catch (error: any) {
        results.airbnb = {
          success: false,
          bookings: 0,
          message: `Error al sincronizar con Airbnb: ${error?.message || 'Error desconocido'}`,
        };
      }
    }
    
    // Sincronizar desde Booking
    if (property.bookingIcalUrl) {
      try {
        const bookingEvents = await ical.async.fromURL(property.bookingIcalUrl);
        let bookingBookings = 0;
        
        // Eliminar reservas antiguas de Booking para esta propiedad
        await prisma.booking.deleteMany({
          where: {
            propertyId,
            source: BookingSource.BOOKING,
          },
        });
        
        // Crear nuevas reservas
        for (const key in bookingEvents) {
          const event = bookingEvents[key];
          if (event.type === 'VEVENT' && event.start && event.end) {
            await prisma.booking.create({
              data: {
                startDate: event.start,
                endDate: event.end,
                guestName: event.summary || 'Huésped de Booking',
                source: BookingSource.BOOKING,
                externalId: event.uid,
                propertyId,
              },
            });
            bookingBookings++;
          }
        }
        
        results.booking = {
          success: true,
          bookings: bookingBookings,
          message: `${bookingBookings} reservas importadas correctamente`,
        };
      } catch (error: any) {
        results.booking = {
          success: false,
          bookings: 0,
          message: `Error al sincronizar con Booking: ${error?.message || 'Error desconocido'}`,
        };
      }
    }
    
    return NextResponse.json(results);
  } catch (error: any) {
    console.error('Error al sincronizar calendarios:', error);
    return NextResponse.json({ error: 'Error al sincronizar calendarios' }, { status: 500 });
  }
} 