// app/api/test-db/route.ts
import { NextRequest, NextResponse } from 'next/server';
import pool from '../../lib/db';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT 1 + 1 AS solution');
    return NextResponse.json({ result: rows });
  } catch (error) {
    console.error('Database connection failed:', error);
    return NextResponse.json({ error: 'Database connection failed' }, { status: 500 });
  }
}
