import { Header } from '@/components/layout/Header';
import { AgentsListContent } from '@/components/agents/AgentsListContent';
import prisma from '@/lib/db';

// Force dynamic rendering - no static prerendering
export const dynamic = 'force-dynamic';

async function getAgents() {
  const agents = await prisma.agents.findMany({
    orderBy: { name: 'asc' },
  });
  return agents;
}

async function getAgentStats() {
  const [total, active, inactive] = await Promise.all([
    prisma.agents.count(),
    prisma.agents.count({ where: { is_active: true } }),
    prisma.agents.count({ where: { is_active: false } }),
  ]);
  return { total, active, inactive };
}

export default async function AgentsPage() {
  const [agents, stats] = await Promise.all([
    getAgents(),
    getAgentStats(),
  ]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Agents" />
      <AgentsListContent initialAgents={agents} stats={stats} />
    </div>
  );
}
