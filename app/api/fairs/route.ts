import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    try {
        if (customerId) {
            const fairs = await db.fair.findMany({
                where: { customerId },
                orderBy: { date: 'desc' }
            });
            return NextResponse.json(fairs);
        }

        const fairs = await db.fair.findMany({
            orderBy: { date: 'desc' }
        });
        return NextResponse.json(fairs);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { customerId, name, date } = body;

        if (!customerId || !name || !date) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Simple slug generation
        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)+/g, '') + '-' + Date.now(); // Ensure uniqueness

        const newFair = await db.fair.create({
            data: {
                customerId,
                name,
                slug,
                date,
            }
        });

        return NextResponse.json(newFair);
    } catch (error) {
        console.error('Error creating fair:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
