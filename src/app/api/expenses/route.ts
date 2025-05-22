import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../auth/[...nextauth]/route';

const prisma = new PrismaClient();

// GET /api/expenses - Obtener todos los gastos del usuario
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');
    
    const whereClause: any = {
      userId: session.user.id,
    };
    
    if (propertyId) {
      whereClause.propertyId = propertyId;
    }
    
    const expenses = await prisma.expense.findMany({
      where: whereClause,
      include: {
        property: {
          select: {
            name: true,
          },
        },
        transaction: {
          select: {
            id: true,
            description: true,
            date: true,
          },
        },
      },
      orderBy: {
        date: 'desc',
      },
    });
    
    return NextResponse.json(expenses);
  } catch (error) {
    console.error('Error al obtener gastos:', error);
    return NextResponse.json({ error: 'Error al obtener gastos' }, { status: 500 });
  }
}

// POST /api/expenses - Crear un nuevo gasto
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }
    
    const body = await request.json();
    
    // Comprobar que el usuario es propietario de la propiedad
    const property = await prisma.property.findFirst({
      where: {
        id: body.propertyId,
        userId: session.user.id,
      },
    });
    
    if (!property) {
      return NextResponse.json({ error: 'Propiedad no encontrada o no autorizada' }, { status: 404 });
    }
    
    const expense = await prisma.expense.create({
      data: {
        amount: body.amount,
        date: new Date(body.date),
        description: body.description,
        category: body.category,
        provider: body.provider,
        receiptUrl: body.receiptUrl,
        propertyId: body.propertyId,
        userId: session.user.id,
        transactionId: body.transactionId,
      },
    });
    
    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error('Error al crear gasto:', error);
    return NextResponse.json({ error: 'Error al crear gasto' }, { status: 500 });
  }
} 