'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import { Bot, Save } from 'lucide-react';

export function NewAgentForm() {
  const router = useRouter();
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    system_prompt: '',
    webhook_path: '',
    model: 'claude-sonnet-4-20250514',
    is_active: true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      toast.error('Agent name is required');
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create agent');
      }

      const agent = await response.json();
      toast.success('Agent created successfully');
      router.push(`/agents/${agent.id}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to create agent');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-auto p-6">
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              Agent Details
            </CardTitle>
            <CardDescription>
              Configure the basic information for your new agent
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Developer, Code Reviewer, DevOps"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of what this agent does"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model</Label>
              <Input
                id="model"
                value={formData.model}
                onChange={(e) => setFormData({ ...formData, model: e.target.value })}
                placeholder="e.g., claude-sonnet-4-20250514"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="webhook_path">Webhook Path</Label>
              <Input
                id="webhook_path"
                value={formData.webhook_path}
                onChange={(e) => setFormData({ ...formData, webhook_path: e.target.value })}
                placeholder="/webhook/agent-name"
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="is_active">Active</Label>
                <p className="text-sm text-muted-foreground">
                  Enable or disable this agent
                </p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>System Prompt</CardTitle>
            <CardDescription>
              Define the instructions and behavior for this agent
            </CardDescription>
          </CardHeader>
          <CardContent>
            <textarea
              value={formData.system_prompt}
              onChange={(e) => setFormData({ ...formData, system_prompt: e.target.value })}
              className="w-full h-64 p-3 text-sm font-mono bg-muted rounded-lg border resize-none focus:outline-none focus:ring-2 focus:ring-ring"
              placeholder="You are an AI assistant that..."
            />
          </CardContent>
        </Card>

        <div className="flex gap-4 justify-end">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSaving}>
            <Save className="h-4 w-4 mr-2" />
            {isSaving ? 'Creating...' : 'Create Agent'}
          </Button>
        </div>
      </form>
    </div>
  );
}
