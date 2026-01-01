import { NextResponse } from 'next/server';
import prisma from '@/lib/db';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = Number.parseInt(searchParams.get('limit') || '50');

    const events = await prisma.realtime_events.findMany({
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Failed to fetch events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { event_type, agent_name, project_name, message, metadata } = body;

    const event = await prisma.realtime_events.create({
      data: {
        event_type,
        agent_name,
        project_name,
        message,
        metadata,
      },
    });

    // Broadcast to connected WebSocket clients if io is available
    const io = (globalThis as unknown as { io?: { emit: (event: string, data: unknown) => void } }).io;
    if (io) {
      io.emit('new_event', event);
    }

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Failed to create event:', error);
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    );
  }
}
