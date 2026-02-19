import { NextResponse } from 'next/server';
import { readDB, writeDB } from '@/lib/storage';
import { Contact } from '@/lib/types';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ fairId: string }> }
) {
    const body = await request.json();
    const { fairId } = await params;

    const db = await readDB();

    // Validate fair exists
    const fairExists = db.fairs.some(f => f.id === fairId);
    if (!fairExists) {
        return NextResponse.json({ error: 'Fair not found' }, { status: 404 });
    }

    const { name, surname, email, consent, company, title } = body;

    const newContact: Contact = {
        id: Date.now().toString(),
        fairId,
        name,
        surname,
        email,
        company: company || undefined,
        title: title || undefined,
        consent,
        date: new Date().toISOString(),
        surveyAnswers: body.surveyAnswers || undefined,
    };

    db.contacts.push(newContact);
    await writeDB(db);

    return NextResponse.json(newContact);
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ fairId: string }> }
) {
    const { fairId } = await params;
    const db = await readDB();

    // Validate fair exists (optional, but good practice)
    const fairExists = db.fairs.some(f => f.id === fairId);
    if (!fairExists) {
        return NextResponse.json({ error: 'Fair not found' }, { status: 404 });
    }

    const contacts = db.contacts.filter(c => c.fairId === fairId);
    return NextResponse.json(contacts);
}
