import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const vars = await prisma.global_env_vars.findMany({
      orderBy: [{ category: 'asc' }, { key: 'asc' }],
    });

    return NextResponse.json(vars);
  } catch (error) {
    console.error('Failed to fetch global env vars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch environment variables' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { key, value, is_secret, description, category } = body;

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }

    const existing = await prisma.global_env_vars.findUnique({
      where: { key },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Variable with this key already exists' },
        { status: 409 }
      );
    }

    const created = await prisma.global_env_vars.create({
      data: {
        key,
        value,
        is_secret: is_secret ?? false,
        description,
        category: category || 'general',
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Failed to create global env var:', error);
    return NextResponse.json(
      { error: 'Failed to create environment variable' },
      { status: 500 }
    );
  }
}
