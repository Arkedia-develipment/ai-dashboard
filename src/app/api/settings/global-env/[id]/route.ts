import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const varId = Number.parseInt(id, 10);

    if (Number.isNaN(varId)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const envVar = await prisma.global_env_vars.findUnique({
      where: { id: varId },
    });

    if (!envVar) {
      return NextResponse.json(
        { error: 'Variable not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(envVar);
  } catch (error) {
    console.error('Failed to fetch env var:', error);
    return NextResponse.json(
      { error: 'Failed to fetch environment variable' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const varId = Number.parseInt(id, 10);

    if (Number.isNaN(varId)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { key, value, is_secret, description, category } = body;

    const updated = await prisma.global_env_vars.update({
      where: { id: varId },
      data: {
        ...(key !== undefined && { key }),
        ...(value !== undefined && { value }),
        ...(is_secret !== undefined && { is_secret }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update env var:', error);
    return NextResponse.json(
      { error: 'Failed to update environment variable' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const varId = Number.parseInt(id, 10);

    if (Number.isNaN(varId)) {
      return NextResponse.json(
        { error: 'Invalid ID' },
        { status: 400 }
      );
    }

    await prisma.global_env_vars.delete({
      where: { id: varId },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete env var:', error);
    return NextResponse.json(
      { error: 'Failed to delete environment variable' },
      { status: 500 }
    );
  }
}
