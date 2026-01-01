import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET() {
  try {
    const permissions = await prisma.agent_permissions.findMany({
      orderBy: { agent_name: 'asc' },
    });

    return NextResponse.json(permissions);
  } catch (error) {
    console.error('Failed to fetch agent permissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent permissions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { agent_name, ...permissions } = body;

    if (!agent_name) {
      return NextResponse.json(
        { error: 'Agent name is required' },
        { status: 400 }
      );
    }

    const created = await prisma.agent_permissions.create({
      data: {
        agent_name,
        ...permissions,
      },
    });

    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error('Failed to create agent permissions:', error);
    return NextResponse.json(
      { error: 'Failed to create agent permissions' },
      { status: 500 }
    );
  }
}
