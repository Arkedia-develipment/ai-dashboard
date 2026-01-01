# CLAUDE INSTRUCTIONS - AI Team Dashboard

> **CRITICAL: Read this file COMPLETELY before writing ANY code.**
> **Last Updated: 2026-01-01**
> **Version: 1.0.0**

---

## MANDATORY PRE-EXECUTION CHECKLIST

Before writing any code, Claude MUST:

- [ ] Read the full task description
- [ ] Check existing files in the target directory
- [ ] Verify the correct tech stack (Next.js 14, not React/Angular)
- [ ] Review related components that might need updates
- [ ] Confirm database schema matches expectations
- [ ] Check for TypeScript types that should be reused

---

## PROJECT IDENTITY

```
Project:        AI Team Control Center Dashboard
Type:           Next.js 14 (App Router) Web Application
Purpose:        Real-time monitoring and control of AI agent team
Repository:     ai-team-dashboard/
Deployment:     https://ai-dashboard.arkedia.dev
Server:         65.21.231.36
Database:       PostgreSQL (ai_team)
```

---

## ABSOLUTE RULES (NEVER BREAK)

### 1. File Output Format
When creating files, ALWAYS use this EXACT format:
```
FILE: relative/path/to/file.tsx
```typescript
// File content here
```
```

### 2. Never Hardcode Secrets
```typescript
// WRONG
const apiKey = "eyJhbGci...";

// CORRECT
const apiKey = process.env.N8N_API_KEY;
```

### 3. Always Use TypeScript
```typescript
// WRONG
function getData(id) { ... }

// CORRECT
function getData(id: string): Promise<AgentData> { ... }
```

### 4. Use Server Components by Default
```typescript
// WRONG - Client component when not needed
'use client';
export default function AgentList() { ... }

// CORRECT - Server component (no 'use client')
export default async function AgentList() {
  const agents = await getAgents();
  return <div>...</div>;
}
```

### 5. Handle Loading States
```typescript
// ALWAYS include loading.tsx for route segments
// app/agents/loading.tsx
export default function Loading() {
  return <AgentListSkeleton />;
}
```

### 6. Handle Errors
```typescript
// ALWAYS include error.tsx for route segments
// app/agents/error.tsx
'use client';
export default function Error({ error, reset }) {
  return <ErrorDisplay error={error} onRetry={reset} />;
}
```

---

## TECH STACK DETAILS

### Package Versions (EXACT)
```json
{
  "next": "^14.0.0",
  "react": "^18.2.0",
  "typescript": "^5.0.0",
  "tailwindcss": "^3.3.0",
  "@prisma/client": "^5.0.0",
  "socket.io": "^4.6.0",
  "socket.io-client": "^4.6.0",
  "zustand": "^4.4.0"
}
```

### Shadcn/UI Components to Use
- Button, Card, Input, Label, Select
- Dialog, Sheet, Dropdown
- Table, Tabs, Badge
- Skeleton, Toast
- Command (for search)

### NOT to Use
- Material UI
- Chakra UI
- Bootstrap
- Styled Components
- CSS Modules (use Tailwind instead)

---

## DATABASE SCHEMA REFERENCE

### Existing Tables (DO NOT RECREATE)
```sql
agents              -- Agent definitions (id, name, webhook, status)
projects            -- Project info (id, name, workspace_path, tech_stack)
agent_performance   -- Task tracking (agent_name, success, execution_time_ms)
agent_mistakes      -- Error log (agent_name, what_happened, solution)
task_progress       -- Multi-step tracking (request_id, current_agent, progress)
conversations       -- Chat history
```

### New Tables (CREATE THESE)
```sql
agent_env_vars      -- Per-agent environment variables
global_env_vars     -- Global environment variables
agent_permissions   -- Agent capabilities and limits
realtime_events     -- Live activity feed
```

---

## COMPONENT PATTERNS

### Server Component (Default)
```typescript
// app/agents/page.tsx
import { getAgents } from '@/lib/db';
import { AgentCard } from '@/components/agents/AgentCard';

export default async function AgentsPage() {
  const agents = await getAgents();

  return (
    <div className="grid grid-cols-3 gap-4">
      {agents.map(agent => (
        <AgentCard key={agent.id} agent={agent} />
      ))}
    </div>
  );
}
```

### Client Component (Only When Needed)
```typescript
// components/chat/ChatPanel.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSocket } from '@/lib/socket';

export function ChatPanel({ agentId }: { agentId: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const socket = useSocket();

  useEffect(() => {
    socket.on('chat:message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    return () => socket.off('chat:message');
  }, [socket]);

  return <div>...</div>;
}
```

### API Route
```typescript
// app/api/agents/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const agents = await prisma.agents.findMany();
    return NextResponse.json(agents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Failed to fetch agents' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const agent = await prisma.agents.create({ data: body });
    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Failed to create agent' },
      { status: 500 }
    );
  }
}
```

### Zustand Store
```typescript
// lib/stores/agentStore.ts
import { create } from 'zustand';

interface Agent {
  id: string;
  name: string;
  status: 'idle' | 'working' | 'error';
  currentTask?: string;
}

interface AgentStore {
  agents: Agent[];
  setAgents: (agents: Agent[]) => void;
  updateAgentStatus: (id: string, status: Agent['status']) => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
  agents: [],
  setAgents: (agents) => set({ agents }),
  updateAgentStatus: (id, status) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === id ? { ...a, status } : a
      ),
    })),
}));
```

---

## STYLING GUIDELINES

### Use Tailwind Classes
```tsx
// CORRECT
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm">
  <h2 className="text-lg font-semibold text-gray-900">Title</h2>
</div>

// WRONG - Inline styles
<div style={{ display: 'flex', padding: '16px' }}>
```

### Dark Mode Support
```tsx
// Always include dark mode variants
<div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-white">
```

### Responsive Design
```tsx
// Mobile-first approach
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
```

### Status Colors
```tsx
const statusColors = {
  idle: 'bg-gray-400',
  working: 'bg-green-500 animate-pulse',
  error: 'bg-red-500',
  blocked: 'bg-yellow-500'
};
```

---

## ENVIRONMENT VARIABLES

### Required in .env.local
```env
# Database
DATABASE_URL="postgresql://postgres:Anas@8264@postgres.arkedia.dev:5432/ai_team"

# n8n API
N8N_API_URL="https://n8n.arkedia.dev"
N8N_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# SSH Access
SSH_HOST="65.21.231.36"
SSH_USER="root"
SSH_KEY_PATH="/path/to/key"

# WebSocket
NEXT_PUBLIC_WS_URL="wss://ai-dashboard.arkedia.dev"

# App
NEXT_PUBLIC_APP_URL="https://ai-dashboard.arkedia.dev"
```

### Accessing in Code
```typescript
// Server-side
const dbUrl = process.env.DATABASE_URL;

// Client-side (must have NEXT_PUBLIC_ prefix)
const wsUrl = process.env.NEXT_PUBLIC_WS_URL;
```

---

## FILE NAMING CONVENTIONS

```
Components:     PascalCase.tsx     (AgentCard.tsx)
Pages:          page.tsx           (app/agents/page.tsx)
API Routes:     route.ts           (app/api/agents/route.ts)
Utilities:      camelCase.ts       (formatDate.ts)
Types:          types.ts           (Single file per domain)
Stores:         camelCaseStore.ts  (agentStore.ts)
```

---

## BEFORE CREATING A NEW FILE

1. **Check if similar component exists**
   ```bash
   # Search for existing components
   grep -r "AgentCard" components/
   ```

2. **Check the types file**
   ```typescript
   // Look in lib/types.ts for existing interfaces
   interface Agent { ... }
   ```

3. **Check for utility functions**
   ```typescript
   // Look in lib/utils.ts
   export function formatDate(date: Date): string { ... }
   ```

---

## ERROR HANDLING PATTERNS

### API Calls
```typescript
try {
  const response = await fetch('/api/agents');
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  const data = await response.json();
  return data;
} catch (error) {
  console.error('Failed to fetch agents:', error);
  toast.error('Could not load agents');
  return [];
}
```

### Database Operations
```typescript
try {
  const result = await prisma.agents.create({ data });
  return { success: true, data: result };
} catch (error) {
  if (error.code === 'P2002') {
    return { success: false, error: 'Agent already exists' };
  }
  return { success: false, error: 'Database error' };
}
```

---

## TESTING CHECKLIST

Before considering any task complete:

- [ ] Component renders without errors
- [ ] TypeScript has no errors
- [ ] Loading state is visible during data fetch
- [ ] Error state displays on failure
- [ ] Responsive on mobile
- [ ] Dark mode works
- [ ] Console has no warnings
- [ ] API endpoints return proper status codes

---

## COMMON MISTAKES TO AVOID

1. **Don't use `any` type**
   ```typescript
   // WRONG
   function process(data: any) { }

   // CORRECT
   function process(data: AgentData) { }
   ```

2. **Don't forget keys in lists**
   ```tsx
   // WRONG
   {items.map(item => <div>{item.name}</div>)}

   // CORRECT
   {items.map(item => <div key={item.id}>{item.name}</div>)}
   ```

3. **Don't mix server/client components wrong**
   ```tsx
   // WRONG - Using hooks in server component
   export default function Page() {
     const [state, setState] = useState(); // ERROR!
   }

   // CORRECT - Add 'use client' or move to client component
   'use client';
   export default function Page() {
     const [state, setState] = useState();
   }
   ```

4. **Don't hardcode URLs**
   ```typescript
   // WRONG
   fetch('https://n8n.arkedia.dev/api/...');

   // CORRECT
   fetch(`${process.env.N8N_API_URL}/api/...`);
   ```

---

## REFERENCE FILES

Always check these files before making changes:

1. **AI_TEAM_DASHBOARD_PROMPT.md** - Full project spec
2. **TEAM_KNOWLEDGE_BASE.md** - Team standards and patterns
3. **ACTION_PLAN.md** - Implementation roadmap
4. **lib/types.ts** - Type definitions
5. **lib/db.ts** - Database utilities

---

## QUICK REFERENCE: AGENT LIST

| Agent | Webhook | Purpose |
|-------|---------|---------|
| Maestro | /webhook/maestro | Orchestrator |
| Business Analyst | /webhook/ba | Requirements |
| Consultant | /webhook/consultant | Architecture |
| Scrum Master | /webhook/scrum | Sprint planning |
| Team Lead | /webhook/team_lead | GitHub management |
| Developer | /webhook/developer | Code writing |
| Code Reviewer | /webhook/reviewer | PR review |
| QA Engineer | /webhook/qa | Testing |
| DevOps | /webhook/devops | Deployment |
| SonarQube | /webhook/sonarqube | Code analysis |

---

## FINAL REMINDER

**Every time you're about to write code:**

1. Did I read CLAUDE_INSTRUCTIONS.md? (You're reading it now)
2. Am I using the correct tech stack?
3. Am I following the file output format?
4. Did I check for existing similar code?
5. Am I handling loading/error states?
6. Is my TypeScript properly typed?

**If you're unsure about anything, ASK before implementing.**

---

*This file should be read at the start of every coding session.*
