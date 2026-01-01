'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Agent, RealtimeEvent, AgentPerformance } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Bot,
  Save,
  Trash2,
  Activity,
  Clock,
  MessageSquare,
  ExternalLink,
  Zap,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

interface AgentDetailContentProps {
  agent: Agent;
  events: RealtimeEvent[];
  performance: AgentPerformance[];
}

export function AgentDetailContent({ agent, events, performance }: AgentDetailContentProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: agent.name,
    description: agent.description || '',
    system_prompt: agent.system_prompt || '',
    webhook_path: agent.webhook_path || '',
    model: agent.model || '',
    is_active: agent.is_active ?? true,
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Failed to update agent');

      toast.success('Agent updated successfully');
      setIsEditing(false);
      router.refresh();
    } catch {
      toast.error('Failed to update agent');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this agent?')) return;

    try {
      const response = await fetch(`/api/agents/${agent.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete agent');

      toast.success('Agent deleted successfully');
      router.push('/agents');
    } catch {
      toast.error('Failed to delete agent');
    }
  };

  const formatTime = (date: Date | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString();
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <Tabs defaultValue="overview" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="events">Events ({events.length})</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <div className="flex gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSave} disabled={isSaving}>
                  <Save className="h-4 w-4 mr-2" />
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </Button>
              </>
            ) : (
              <>
                <Button variant="outline" onClick={() => setIsEditing(true)}>
                  Edit Agent
                </Button>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </>
            )}
          </div>
        </div>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Status</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <Badge variant={formData.is_active ? 'default' : 'secondary'}>
                  {formData.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Events</CardTitle>
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{events.length}</div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Execution Time</CardTitle>
                <Zap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performance.length > 0
                    ? `${Math.round(
                        performance.reduce((acc, p) => acc + (p.execution_time_ms || 0), 0) /
                          performance.length
                      )}ms`
                    : 'N/A'}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {performance.length > 0
                    ? `${Math.round(
                        (performance.filter((p) => p.success === true).length /
                          performance.length) * 100
                      )}%`
                    : 'N/A'}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5" />
                  Agent Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Name</Label>
                  {isEditing ? (
                    <Input
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{agent.name}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Description</Label>
                  {isEditing ? (
                    <Input
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {agent.description || 'No description'}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Model</Label>
                  {isEditing ? (
                    <Input
                      value={formData.model}
                      onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">{agent.model || 'Not set'}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Webhook Path</Label>
                  {isEditing ? (
                    <Input
                      value={formData.webhook_path}
                      onChange={(e) =>
                        setFormData({ ...formData, webhook_path: e.target.value })
                      }
                    />
                  ) : (
                    <div className="flex items-center gap-2">
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {agent.webhook_path || 'Not set'}
                      </code>
                      {agent.webhook_path && (
                        <ExternalLink className="h-4 w-4 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Label>Active</Label>
                  <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, is_active: checked })
                    }
                    disabled={!isEditing}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Recent Activity
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  {events.slice(0, 10).map((event) => (
                    <div key={event.id} className="mb-3 pb-3 border-b last:border-0">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-medium">{event.event_type}</p>
                          <p className="text-xs text-muted-foreground">{event.message}</p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {formatTime(event.created_at)}
                        </span>
                      </div>
                    </div>
                  ))}
                  {events.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No recent activity
                    </p>
                  )}
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event History</CardTitle>
              <CardDescription>All events triggered by this agent</CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {events.map((event) => (
                  <div
                    key={event.id}
                    className="flex items-start gap-4 p-4 border-b last:border-0 hover:bg-muted/50"
                  >
                    <div
                      className={`p-2 rounded-lg ${
                        event.event_type === 'error'
                          ? 'bg-red-100 text-red-600'
                          : event.event_type === 'success'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-blue-100 text-blue-600'
                      }`}
                    >
                      {event.event_type === 'error' ? (
                        <AlertCircle className="h-4 w-4" />
                      ) : (
                        <Activity className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{event.event_type}</p>
                        <span className="text-sm text-muted-foreground">
                          {formatTime(event.created_at)}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{event.message}</p>
                      {event.project_name && (
                        <Badge variant="outline" className="mt-2">
                          {event.project_name}
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
                {events.length === 0 && (
                  <p className="text-sm text-muted-foreground text-center py-12">
                    No events found
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Metrics</CardTitle>
              <CardDescription>Agent performance over time</CardDescription>
            </CardHeader>
            <CardContent>
              {performance.length > 0 ? (
                <div className="space-y-4">
                  {performance.slice(0, 10).map((p) => (
                    <div
                      key={p.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div>
                        <p className="font-medium">
                          {p.started_at ? new Date(p.started_at).toLocaleDateString() : 'N/A'}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {p.project_name || 'No project'} - {p.task_id || 'No task ID'}
                        </p>
                      </div>
                      <div className="text-right">
                        <Badge variant={p.success ? 'default' : 'destructive'}>
                          {p.success ? 'Success' : 'Failed'}
                        </Badge>
                        <p className="text-sm text-muted-foreground mt-1">
                          {p.execution_time_ms ? `${p.execution_time_ms}ms` : 'N/A'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-12">
                  No performance data available
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Prompt</CardTitle>
              <CardDescription>The instructions that define this agent&apos;s behavior</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <textarea
                  value={formData.system_prompt}
                  onChange={(e) =>
                    setFormData({ ...formData, system_prompt: e.target.value })
                  }
                  className="w-full h-64 p-3 text-sm font-mono bg-muted rounded-lg border resize-none"
                />
              ) : (
                <pre className="w-full h-64 p-3 text-sm font-mono bg-muted rounded-lg overflow-auto">
                  {agent.system_prompt || 'No system prompt configured'}
                </pre>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Danger Zone</CardTitle>
              <CardDescription>Irreversible actions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between p-4 border border-red-200 rounded-lg bg-red-50">
                <div>
                  <p className="font-medium text-red-900">Delete Agent</p>
                  <p className="text-sm text-red-700">
                    This will permanently delete the agent and all associated data.
                  </p>
                </div>
                <Button variant="destructive" onClick={handleDelete}>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Agent
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
