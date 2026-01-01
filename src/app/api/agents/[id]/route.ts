import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const agentId = Number.parseInt(id, 10);

    if (Number.isNaN(agentId)) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    const agent = await prisma.agents.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json(
        { error: 'Agent not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Failed to fetch agent:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agent' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const agentId = Number.parseInt(id, 10);

    if (Number.isNaN(agentId)) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { name, description, system_prompt, webhook_path, model, is_active } = body;

    const agent = await prisma.agents.update({
      where: { id: agentId },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(system_prompt !== undefined && { system_prompt }),
        ...(webhook_path !== undefined && { webhook_path }),
        ...(model !== undefined && { model }),
        ...(is_active !== undefined && { is_active }),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(agent);
  } catch (error) {
    console.error('Failed to update agent:', error);
    return NextResponse.json(
      { error: 'Failed to update agent' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const agentId = Number.parseInt(id, 10);

    if (Number.isNaN(agentId)) {
      return NextResponse.json(
        { error: 'Invalid agent ID' },
        { status: 400 }
      );
    }

    await prisma.agents.delete({
      where: { id: agentId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
}
