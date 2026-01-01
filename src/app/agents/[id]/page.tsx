import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { AgentDetailContent } from '@/components/agents/AgentDetailContent';
import prisma from '@/lib/db';

// Force dynamic rendering - no static prerendering
export const dynamic = 'force-dynamic';

interface AgentDetailPageProps {
  params: Promise<{ id: string }>;
}

async function getAgent(id: number) {
  const agent = await prisma.agents.findUnique({
    where: { id },
  });
  return agent;
}

async function getAgentEvents(agentName: string) {
  const events = await prisma.realtime_events.findMany({
    where: { agent_name: agentName },
    orderBy: { created_at: 'desc' },
    take: 20,
  });
  return events;
}

async function getAgentPerformance(agentName: string) {
  const performance = await prisma.agent_performance.findMany({
    where: { agent_name: agentName },
    orderBy: { started_at: 'desc' },
    take: 30,
  });
  return performance;
}

export default async function AgentDetailPage({ params }: AgentDetailPageProps) {
  const { id } = await params;
  const agentId = Number.parseInt(id, 10);

  if (Number.isNaN(agentId)) {
    notFound();
  }

  const agent = await getAgent(agentId);

  if (!agent) {
    notFound();
  }

  const [events, performance] = await Promise.all([
    getAgentEvents(agent.name),
    getAgentPerformance(agent.name),
  ]);

  return (
    <div className="flex flex-col h-full">
      <Header title={agent.name} showBack backHref="/agents" />
      <AgentDetailContent agent={agent} events={events} performance={performance} />
    </div>
  );
}
