import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const vars = await prisma.agent_env_vars.findMany({
      orderBy: [{ agent_name: 'asc' }, { key: 'asc' }],
    });

    return NextResponse.json(vars);
  } catch (error) {
    console.error('Failed to fetch agent env vars:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent environment variables' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agent_name, key, value, is_secret, description } = body;

    if (!agent_name || !key) {
      return NextResponse.json(
        { error: 'Agent name and key are required' },
        { status: 400 }
      );
    }

    const created = await prisma.agent_env_vars.create({
      data: {
        agent_name,
        key,
        value,
        is_secret: is_secret ?? false,
        description,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Failed to create agent env var:', error);
    return NextResponse.json(
      { error: 'Failed to create agent environment variable' },
      { status: 500 }
    );
  }
}
