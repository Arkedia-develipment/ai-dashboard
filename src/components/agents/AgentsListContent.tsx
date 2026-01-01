'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Agent } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Bot,
  Plus,
  Search,
  Filter,
  Users,
  CheckCircle,
  XCircle,
  ExternalLink,
  Settings,
} from 'lucide-react';

interface AgentsListContentProps {
  initialAgents: Agent[];
  stats: {
    total: number;
    active: number;
    inactive: number;
  };
}

export function AgentsListContent({ initialAgents, stats }: AgentsListContentProps) {
  const [agents] = useState<Agent[]>(initialAgents);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const filteredAgents = agents.filter((agent) => {
    const matchesSearch =
      agent.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (agent.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);

    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && agent.is_active === true) ||
      (statusFilter === 'inactive' && agent.is_active === false);

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="flex-1 overflow-auto p-6 space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Agents</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.active}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inactive</CardTitle>
            <XCircle className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-500">{stats.inactive}</div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search agents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant={statusFilter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('all')}
          >
            <Filter className="h-4 w-4 mr-1" />
            All
          </Button>
          <Button
            variant={statusFilter === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('active')}
          >
            <CheckCircle className="h-4 w-4 mr-1" />
            Active
          </Button>
          <Button
            variant={statusFilter === 'inactive' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setStatusFilter('inactive')}
          >
            <XCircle className="h-4 w-4 mr-1" />
            Inactive
          </Button>
        </div>
        <Link href="/agents/new">
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Agent
          </Button>
        </Link>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredAgents.map((agent) => (
          <AgentListCard key={agent.id} agent={agent} />
        ))}
      </div>

      {filteredAgents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-medium">No agents found</h3>
          <p className="text-muted-foreground">
            {searchQuery || statusFilter !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Create your first agent to get started'}
          </p>
        </div>
      )}
    </div>
  );
}

function AgentListCard({ agent }: { agent: Agent }) {
  const isActive = agent.is_active ?? true;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg ${
                isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'
              }`}
            >
              <Bot className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-base">{agent.name}</CardTitle>
              <Badge variant={isActive ? 'default' : 'secondary'} className="mt-1">
                {isActive ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
          <Link href={`/agents/${agent.id}`}>
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {agent.description && (
          <p className="text-sm text-muted-foreground line-clamp-2">{agent.description}</p>
        )}

        <div className="space-y-2 text-sm">
          {agent.model && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Model</span>
              <span className="font-medium">{agent.model}</span>
            </div>
          )}
          {agent.webhook_path && (
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Webhook</span>
              <div className="flex items-center gap-1">
                <code className="text-xs bg-muted px-1 py-0.5 rounded">
                  {agent.webhook_path}
                </code>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-2">
          <Link href={`/agents/${agent.id}`} className="flex-1">
            <Button variant="outline" size="sm" className="w-full">
              View Details
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
