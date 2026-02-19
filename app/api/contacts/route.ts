import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(process.cwd(), "data");
const FILE_PATH = path.join(DATA_DIR, "contacts.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

// Ensure file exists
if (!fs.existsSync(FILE_PATH)) {
    fs.writeFileSync(FILE_PATH, JSON.stringify([]));
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, surname, email, consent } = body;

        if (!name || !surname || !email || !consent) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const fileData = fs.readFileSync(FILE_PATH, "utf-8");
        const contacts = JSON.parse(fileData);

        const newContact = {
            id: Date.now().toString(),
            name,
            surname,
            email,
            consent,
            date: new Date().toISOString(),
            company: body.company || "",
            title: body.title || "",
            surveyAnswers: body.surveyAnswers || null,
        };

        contacts.push(newContact);

        fs.writeFileSync(FILE_PATH, JSON.stringify(contacts, null, 2));

        return NextResponse.json({ success: true, contact: newContact });
    } catch (error) {
        console.error("Error saving contact:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const fileData = fs.readFileSync(FILE_PATH, "utf-8");
        const contacts = JSON.parse(fileData);
        return NextResponse.json(contacts);
    } catch (error) {
        return NextResponse.json([]);
    }
}
