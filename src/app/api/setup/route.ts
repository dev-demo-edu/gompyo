import { db } from '@/db/db';
import { users } from '@/db/schema';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
	await db.$client.exec(`
        CREATE TABLE IF NOT EXISTS users (
          id TEXT PRIMARY KEY,
          email TEXT,
          password TEXT
        );
    `);
	  
    return NextResponse.json({ message: 'Users table created successfully!' });
  } catch (error) {
    console.error('Error creating users table:', error);
    return new NextResponse(JSON.stringify({ message: 'Failed to create users table.' }), { status: 500 });
  }
}