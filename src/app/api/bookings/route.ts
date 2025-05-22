import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/options';

const prisma = new PrismaClient();

// Define types
interface Property {
  id: string;
  name?: string;
}

// GET /api/bookings - Obtener todas las reservas del usuario
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    
    // Build the where clause based on query params
    const whereClause: any = {};
    
    // If propertyId is provided, add it to the where clause
    if (propertyId) {
      whereClause.propertyId = propertyId;
    }
    
    // Only fetch bookings for properties owned by the current user
    const properties = await prisma.property.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });
    
    const propertyIds = properties.map((property: Property) => property.id);
    
    whereClause.propertyId = {
      in: propertyIds,
    };
    
    const bookings = await prisma.booking.findMany({
      where: whereClause,
      include: {
        property: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        startDate: 'asc',
      },
    });
    
    // Transform bookings to match the CalendarEvent format expected by the frontend
    const calendarEvents = bookings.map((booking: any) => ({
      id: booking.id,
      title: `${booking.guestName || 'Reserva'} - ${booking.property.name}`,
      start: booking.startDate,
      end: booking.endDate,
      propertyId: booking.propertyId,
      // Map the database enum values to lowercase strings expected by the frontend
      source: booking.source === 'AIRBNB' ? 'airbnb' : 
              booking.source === 'BOOKING' ? 'booking' : 
              'other' // handle other sources like DIRECT or OTHER
    }));
    
    return NextResponse.json(calendarEvents);
  } catch (error: any) {
    console.error('Error al obtener reservas:', error);
    return NextResponse.json({ error: 'Error al obtener reservas' }, { status: 500 });
  }
} 