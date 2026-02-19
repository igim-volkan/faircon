import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(
    request: Request,
    { params }: { params: Promise<{ fairId: string }> }
) {
    try {
        const body = await request.json();
        const { fairId } = await params;
        const { name, surname, email, company, title, consent, surveyAnswers } = body;

        let targetFairId = fairId;

        // Auto-create Fair if it's the homepage and doesn't exist
        if (fairId === 'homepage') {
            let fair = await db.fair.findUnique({
                where: { id: 'homepage' }
            });

            if (!fair) {
                // Ensure a default customer exists
                let customer = await db.customer.findFirst({
                    orderBy: { createdAt: 'asc' }
                });

                if (!customer) {
                    customer = await db.customer.create({
                        data: {
                            name: 'Default Customer',
                        }
                    });
                }

                fair = await db.fair.create({
                    data: {
                        id: 'homepage',
                        name: 'Web Sitesi İletişim Formu',
                        date: new Date().toISOString(),
                        slug: 'homepage-fair',
                        customerId: customer.id
                    }
                });
            }
            targetFairId = fair.id;
        }

        // Validate fair exists for other IDs
        const fairExists = await db.fair.findUnique({
            where: { id: targetFairId }
        });

        if (!fairExists) {
            return NextResponse.json({ error: 'Fair not found' }, { status: 404 });
        }

        const newContact = await db.contact.create({
            data: {
                fairId: targetFairId,
                name,
                surname,
                email,
                company: company || null,
                title: title || null,
                consent,
                surveyAnswers: surveyAnswers ? JSON.stringify(surveyAnswers) : null,
            }
        });

        return NextResponse.json(newContact);
    } catch (error) {
        console.error('Error creating contact:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function GET(
    request: Request,
    { params }: { params: Promise<{ fairId: string }> }
) {
    const { fairId } = await params;

    // Validate fair exists (optional, but good practice)
    const fair = await db.fair.findUnique({
        where: { id: fairId }
    });

    if (!fair) {
        return NextResponse.json({ error: 'Fair not found' }, { status: 404 });
    }

    const contacts = await db.contact.findMany({
        where: { fairId }
    });
    return NextResponse.json(contacts);
}
