import { Header } from '@/components/layout/Header';
import { DashboardContent } from '@/components/dashboard/DashboardContent';
import prisma from '@/lib/db';

async function getAgents() {
  const agents = await prisma.agents.findMany({
    orderBy: { name: 'asc' },
  });
  return agents;
}

async function getProjects() {
  const projects = await prisma.projects.findMany({
    orderBy: { updated_at: 'desc' },
  });
  return projects;
}

async function getRecentEvents() {
  const events = await prisma.realtime_events.findMany({
    orderBy: { created_at: 'desc' },
    take: 50,
  });
  return events;
}

export default async function DashboardPage() {
  const [agents, projects, events] = await Promise.all([
    getAgents(),
    getProjects(),
    getRecentEvents(),
  ]);

  return (
    <div className="flex flex-col h-full">
      <Header title="Dashboard" />
      <DashboardContent
        initialAgents={agents}
        initialProjects={projects}
        initialEvents={events}
      />
    </div>
  );
}
