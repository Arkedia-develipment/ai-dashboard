import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

interface RouteParams {
  params: Promise<{ agentName: string }>;
}

export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { agentName } = await params;
    const decodedName = decodeURIComponent(agentName);

    const permission = await prisma.agent_permissions.findUnique({
      where: { agent_name: decodedName },
    });

    if (!permission) {
      return NextResponse.json(
        { error: 'Permission not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(permission);
  } catch (error) {
    console.error('Failed to fetch permission:', error);
    return NextResponse.json(
      { error: 'Failed to fetch permission' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request, { params }: RouteParams) {
  try {
    const { agentName } = await params;
    const decodedName = decodeURIComponent(agentName);
    const body = await request.json();

    const {
      can_write_files,
      can_ssh,
      can_deploy,
      can_access_db,
      can_call_apis,
      allowed_paths,
      blocked_paths,
      max_files_per_task,
      max_execution_time_ms,
      max_tokens_per_request,
    } = body;

    const updated = await prisma.agent_permissions.update({
      where: { agent_name: decodedName },
      data: {
        ...(can_write_files !== undefined && { can_write_files }),
        ...(can_ssh !== undefined && { can_ssh }),
        ...(can_deploy !== undefined && { can_deploy }),
        ...(can_access_db !== undefined && { can_access_db }),
        ...(can_call_apis !== undefined && { can_call_apis }),
        ...(allowed_paths !== undefined && { allowed_paths }),
        ...(blocked_paths !== undefined && { blocked_paths }),
        ...(max_files_per_task !== undefined && { max_files_per_task }),
        ...(max_execution_time_ms !== undefined && { max_execution_time_ms }),
        ...(max_tokens_per_request !== undefined && { max_tokens_per_request }),
        updated_at: new Date(),
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Failed to update permission:', error);
    return NextResponse.json(
      { error: 'Failed to update permission' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { agentName } = await params;
    const decodedName = decodeURIComponent(agentName);

    await prisma.agent_permissions.delete({
      where: { agent_name: decodedName },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Failed to delete permission:', error);
    return NextResponse.json(
      { error: 'Failed to delete permission' },
      { status: 500 }
    );
  }
}
