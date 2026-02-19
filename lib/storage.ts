import fs from 'fs/promises';
import path from 'path';
import { DB } from './types';

const DB_PATH = path.join(process.cwd(), 'data', 'db.json');

export async function readDB(): Promise<DB> {
    try {
        const data = await fs.readFile(DB_PATH, 'utf-8');
        return JSON.parse(data);
    } catch (error) {
        // If file doesn't exist or is invalid, return empty DB
        return { customers: [], fairs: [], contacts: [] };
    }
}

export async function writeDB(data: DB): Promise<void> {
    await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2), 'utf-8');
}
