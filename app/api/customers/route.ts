import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/storage';
import { Customer } from '@/lib/types';

export async function GET() {
    const db = await readDB();
    return NextResponse.json(db.customers);
}

export async function POST(request: Request) {
    const body = await request.json();
    const { name } = body;

    if (!name) {
        return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    const db = await readDB();
    const newCustomer: Customer = {
        id: Date.now().toString(),
        name,
        createdAt: new Date().toISOString(),
    };

    db.customers.push(newCustomer);
    await writeDB(db);

    return NextResponse.json(newCustomer);
}
