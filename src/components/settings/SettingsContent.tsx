'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import {
  Settings,
  Key,
  Shield,
  Plus,
  Trash2,
  Save,
  Eye,
  EyeOff,
  RefreshCw,
  AlertTriangle,
} from 'lucide-react';
import { GlobalEnvVar, AgentEnvVar, AgentPermission } from '@/lib/types';

export function SettingsContent() {
  const [globalVars, setGlobalVars] = useState<GlobalEnvVar[]>([]);
  const [agentVars, setAgentVars] = useState<AgentEnvVar[]>([]);
  const [permissions, setPermissions] = useState<AgentPermission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showSecrets, setShowSecrets] = useState<Record<number, boolean>>({});
  const [newGlobalVar, setNewGlobalVar] = useState({ key: '', value: '', description: '', category: 'general', is_secret: false });
  const [editingPermission, setEditingPermission] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [globalRes, agentRes, permRes] = await Promise.all([
        fetch('/api/settings/global-env'),
        fetch('/api/settings/agent-env'),
        fetch('/api/settings/permissions'),
      ]);

      if (globalRes.ok) setGlobalVars(await globalRes.json());
      if (agentRes.ok) setAgentVars(await agentRes.json());
      if (permRes.ok) setPermissions(await permRes.json());
    } catch {
      toast.error('Failed to fetch settings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddGlobalVar = async () => {
    if (!newGlobalVar.key.trim()) {
      toast.error('Key is required');
      return;
    }

    try {
      const response = await fetch('/api/settings/global-env', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newGlobalVar),
      });

      if (!response.ok) throw new Error('Failed to add variable');

      const created = await response.json();
      setGlobalVars([...globalVars, created]);
      setNewGlobalVar({ key: '', value: '', description: '', category: 'general', is_secret: false });
      toast.success('Environment variable added');
    } catch {
      toast.error('Failed to add environment variable');
    }
  };

  const handleDeleteGlobalVar = async (id: number) => {
    if (!confirm('Are you sure you want to delete this variable?')) return;

    try {
      const response = await fetch(`/api/settings/global-env/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete');

      setGlobalVars(globalVars.filter((v) => v.id !== id));
      toast.success('Variable deleted');
    } catch {
      toast.error('Failed to delete variable');
    }
  };

  const handleUpdatePermission = async (agentName: string, updates: Partial<AgentPermission>) => {
    try {
      const response = await fetch(`/api/settings/permissions/${encodeURIComponent(agentName)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
      });

      if (!response.ok) throw new Error('Failed to update');

      const updated = await response.json();
      setPermissions(permissions.map((p) => (p.agent_name === agentName ? updated : p)));
      setEditingPermission(null);
      toast.success('Permissions updated');
    } catch {
      toast.error('Failed to update permissions');
    }
  };

  const toggleSecret = (id: number) => {
    setShowSecrets((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const maskValue = (value: string | null, isSecret: boolean | null, id: number) => {
    if (!value) return '-';
    if (isSecret && !showSecrets[id]) return '••••••••';
    return value;
  };

  const groupedVars = globalVars.reduce((acc, v) => {
    const category = v.category || 'general';
    if (!acc[category]) acc[category] = [];
    acc[category].push(v);
    return acc;
  }, {} as Record<string, GlobalEnvVar[]>);

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <RefreshCw className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-auto p-6">
      <Tabs defaultValue="global-env" className="space-y-6">
        <TabsList>
          <TabsTrigger value="global-env" className="flex items-center gap-2">
            <Key className="h-4 w-4" />
            Global Environment
          </TabsTrigger>
          <TabsTrigger value="agent-env" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Agent Variables
          </TabsTrigger>
          <TabsTrigger value="permissions" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            Permissions
          </TabsTrigger>
        </TabsList>

        <TabsContent value="global-env" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add Environment Variable
              </CardTitle>
              <CardDescription>
                Global environment variables available to all agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="key">Key</Label>
                  <Input
                    id="key"
                    value={newGlobalVar.key}
                    onChange={(e) => setNewGlobalVar({ ...newGlobalVar, key: e.target.value.toUpperCase() })}
                    placeholder="API_KEY"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="value">Value</Label>
                  <Input
                    id="value"
                    type={newGlobalVar.is_secret ? 'password' : 'text'}
                    value={newGlobalVar.value}
                    onChange={(e) => setNewGlobalVar({ ...newGlobalVar, value: e.target.value })}
                    placeholder="Value..."
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={newGlobalVar.category}
                    onChange={(e) => setNewGlobalVar({ ...newGlobalVar, category: e.target.value })}
                    placeholder="general"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    value={newGlobalVar.description}
                    onChange={(e) => setNewGlobalVar({ ...newGlobalVar, description: e.target.value })}
                    placeholder="Optional description"
                  />
                </div>
              </div>
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2">
                  <Switch
                    checked={newGlobalVar.is_secret}
                    onCheckedChange={(checked) => setNewGlobalVar({ ...newGlobalVar, is_secret: checked })}
                  />
                  <Label>Secret value</Label>
                </div>
                <Button onClick={handleAddGlobalVar}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Variable
                </Button>
              </div>
            </CardContent>
          </Card>

          {Object.entries(groupedVars).map(([category, vars]) => (
            <Card key={category}>
              <CardHeader>
                <CardTitle className="capitalize">{category}</CardTitle>
                <CardDescription>{vars.length} variable(s)</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px]">
                  <div className="space-y-3">
                    {vars.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <code className="font-mono text-sm font-medium">{v.key}</code>
                            {v.is_secret && (
                              <Badge variant="secondary" className="text-xs">
                                Secret
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {v.description || 'No description'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="text-sm bg-muted px-2 py-1 rounded max-w-[200px] truncate">
                            {maskValue(v.value, v.is_secret, v.id)}
                          </code>
                          {v.is_secret && (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => toggleSecret(v.id)}
                            >
                              {showSecrets[v.id] ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleDeleteGlobalVar(v.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {vars.length === 0 && (
                      <p className="text-center text-muted-foreground py-8">
                        No variables in this category
                      </p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          ))}

          {globalVars.length === 0 && (
            <Card>
              <CardContent className="py-12">
                <div className="text-center text-muted-foreground">
                  <Key className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No environment variables configured</p>
                  <p className="text-sm">Add your first variable above</p>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="agent-env" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Agent-Specific Variables</CardTitle>
              <CardDescription>
                Environment variables specific to individual agents
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[500px]">
                {agentVars.length > 0 ? (
                  <div className="space-y-3">
                    {agentVars.map((v) => (
                      <div
                        key={v.id}
                        className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{v.agent_name}</Badge>
                            <code className="font-mono text-sm font-medium">{v.key}</code>
                            {v.is_secret && (
                              <Badge variant="secondary" className="text-xs">
                                Secret
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mt-1">
                            {v.description || 'No description'}
                          </p>
                        </div>
                        <code className="text-sm bg-muted px-2 py-1 rounded max-w-[200px] truncate">
                          {maskValue(v.value, v.is_secret, v.id)}
                        </code>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No agent-specific variables configured</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="permissions" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Agent Permissions
              </CardTitle>
              <CardDescription>
                Control what each agent can do in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[600px]">
                {permissions.length > 0 ? (
                  <div className="space-y-4">
                    {permissions.map((perm) => (
                      <Card key={perm.agent_name} className="border-2">
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{perm.agent_name}</CardTitle>
                            {editingPermission === perm.agent_name ? (
                              <Button
                                size="sm"
                                onClick={() => setEditingPermission(null)}
                              >
                                <Save className="h-4 w-4 mr-2" />
                                Done
                              </Button>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setEditingPermission(perm.agent_name)}
                              >
                                Edit
                              </Button>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Write Files</Label>
                              <Switch
                                checked={perm.can_write_files ?? true}
                                disabled={editingPermission !== perm.agent_name}
                                onCheckedChange={(checked) =>
                                  handleUpdatePermission(perm.agent_name, { can_write_files: checked })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">SSH Access</Label>
                              <Switch
                                checked={perm.can_ssh ?? true}
                                disabled={editingPermission !== perm.agent_name}
                                onCheckedChange={(checked) =>
                                  handleUpdatePermission(perm.agent_name, { can_ssh: checked })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm flex items-center gap-1">
                                Deploy
                                <AlertTriangle className="h-3 w-3 text-yellow-500" />
                              </Label>
                              <Switch
                                checked={perm.can_deploy ?? false}
                                disabled={editingPermission !== perm.agent_name}
                                onCheckedChange={(checked) =>
                                  handleUpdatePermission(perm.agent_name, { can_deploy: checked })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Database Access</Label>
                              <Switch
                                checked={perm.can_access_db ?? true}
                                disabled={editingPermission !== perm.agent_name}
                                onCheckedChange={(checked) =>
                                  handleUpdatePermission(perm.agent_name, { can_access_db: checked })
                                }
                              />
                            </div>
                            <div className="flex items-center justify-between">
                              <Label className="text-sm">Call APIs</Label>
                              <Switch
                                checked={perm.can_call_apis ?? true}
                                disabled={editingPermission !== perm.agent_name}
                                onCheckedChange={(checked) =>
                                  handleUpdatePermission(perm.agent_name, { can_call_apis: checked })
                                }
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4 pt-4 border-t">
                            <div>
                              <Label className="text-xs text-muted-foreground">Max Files/Task</Label>
                              <p className="font-mono text-sm">{perm.max_files_per_task ?? 10}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Max Execution Time</Label>
                              <p className="font-mono text-sm">{perm.max_execution_time_ms ? `${perm.max_execution_time_ms / 1000}s` : '300s'}</p>
                            </div>
                            <div>
                              <Label className="text-xs text-muted-foreground">Max Tokens/Request</Label>
                              <p className="font-mono text-sm">{perm.max_tokens_per_request?.toLocaleString() ?? '100,000'}</p>
                            </div>
                          </div>

                          {(perm.allowed_paths?.length > 0 || perm.blocked_paths?.length > 0) && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pt-4 border-t">
                              {perm.allowed_paths?.length > 0 && (
                                <div>
                                  <Label className="text-xs text-muted-foreground">Allowed Paths</Label>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {perm.allowed_paths.map((path, i) => (
                                      <Badge key={i} variant="outline" className="font-mono text-xs">
                                        {path}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                              {perm.blocked_paths?.length > 0 && (
                                <div>
                                  <Label className="text-xs text-muted-foreground">Blocked Paths</Label>
                                  <div className="flex flex-wrap gap-1 mt-1">
                                    {perm.blocked_paths.map((path, i) => (
                                      <Badge key={i} variant="destructive" className="font-mono text-xs">
                                        {path}
                                      </Badge>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-12">
                    <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>No agent permissions configured</p>
                    <p className="text-sm">Permissions will appear here when agents are created</p>
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
