import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/properties - Obtener todas las propiedades del usuario
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const properties = await prisma.property.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        expenses: {
          select: {
            amount: true,
            date: true,
            category: true,
          },
        },
        bookings: {
          select: {
            startDate: true,
            endDate: true,
            source: true,
            amount: true,
          },
        },
      },
    });
    
    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error al obtener propiedades:', error);
    return NextResponse.json({ error: 'Error al obtener propiedades' }, { status: 500 });
  }
}

// POST /api/properties - Crear una nueva propiedad
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const body = await request.json();
    
    const property = await prisma.property.create({
      data: {
        name: body.name,
        address: body.address,
        description: body.description,
        airbnbUrl: body.airbnbUrl,
        bookingUrl: body.bookingUrl,
        airbnbIcalUrl: body.airbnbIcalUrl,
        bookingIcalUrl: body.bookingIcalUrl,
        userId: session.user.id,
      },
    });
    
    return NextResponse.json(property, { status: 201 });
  } catch (error) {
    console.error('Error al crear propiedad:', error);
    return NextResponse.json({ error: 'Error al crear propiedad' }, { status: 500 });
  }
} 