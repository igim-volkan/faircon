import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/storage';
import { Fair } from '@/lib/types';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const customerId = searchParams.get('customerId');

    const db = await readDB();

    if (customerId) {
        const fairs = db.fairs.filter(f => f.customerId === customerId);
        return NextResponse.json(fairs);
    }

    return NextResponse.json(db.fairs);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { customerId, name, date } = body;

    if (!customerId || !name || !date) {
        return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const db = await readDB();

    // Simple slug generation
    const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');

    const newFair: Fair = {
        id: Date.now().toString(),
        customerId,
        name,
        slug,
        date,
        createdAt: new Date().toISOString(),
    };

    db.fairs.push(newFair);
    await writeDB(db);

    return NextResponse.json(newFair);
}
