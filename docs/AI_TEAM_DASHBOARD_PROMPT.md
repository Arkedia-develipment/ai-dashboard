# AI Team Control Center - Development Prompt

> **This is the master prompt for building the AI Team Control Center dashboard.**
> **Claude MUST read CLAUDE_INSTRUCTIONS.md before executing any task.**

---

## Project Overview

Build a real-time command center dashboard for managing the AI Team - a multi-agent software development system powered by n8n workflows and Claude AI.

### Core Purpose
- **Monitor** all 10+ AI agents in real-time
- **Control** tasks, interrupt workflows, reassign work
- **Chat** directly with any agent
- **Track** project progress and pipeline stages
- **Configure** agent environments and permissions

---

## Tech Stack (Final Decision)

```
Framework:    Next.js 14 (App Router)
UI:           Shadcn/UI + Tailwind CSS
Real-time:    Socket.io (WebSocket)
State:        Zustand
Database:     PostgreSQL (ai_team database)
ORM:          Prisma
Auth:         NextAuth.js (optional, can add later)
Deployment:   Docker on 65.21.231.36
```

---

## Database Connection

```env
DATABASE_URL="postgresql://postgres:Anas@8264@postgres.arkedia.dev:5432/ai_team"
N8N_API_URL="https://n8n.arkedia.dev"
N8N_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDNlZTE2OS0zZTQyLTQ4NTMtYTZiMS1mY2RmNjJhNDM4MjEiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY2NjQ3NjQ1fQ.NO6ec-6CLgjlpea7VCryuAxiSLK2J_z3o0AVtfx_-Pc"
SSH_HOST="65.21.231.36"
SSH_USER="root"
NEXT_PUBLIC_WS_URL="wss://ai-dashboard.arkedia.dev"
```

---

## Existing Database Tables (Use These)

```sql
-- Core tables already exist:
- agents              -- Agent definitions
- projects            -- Project info
- agent_performance   -- Task success/failure tracking
- agent_mistakes      -- Error learning log
- task_progress       -- Multi-step task tracking
- agent_handoff_log   -- Agent-to-agent handoffs
- knowledge_patterns  -- Code templates
- conversations       -- Chat history
```

---

## Pages to Build

### 1. Dashboard (/) - Main Control Center
```
┌─────────────────────────────────────────────────────────────┐
│  AI TEAM CONTROL CENTER                    [Settings] [Env] │
├──────────────┬──────────────────────────────────────────────┤
│ AGENTS       │  LIVE ACTIVITY FEED                          │
│              │                                               │
│ ● Maestro    │  [10:30:15] Developer started task #42       │
│   idle       │  [10:30:18] SSH: Writing 3 files...          │
│              │  [10:30:22] Developer completed task #42      │
│ ● Developer  │  [10:30:25] → Handoff to Code Reviewer       │
│   working    │  [10:30:30] Code Reviewer analyzing PR...     │
│   Task #42   │                                               │
│              │                                               │
│ ● DevOps     │  ─────────────────────────────────────────── │
│   idle       │  QUICK ACTIONS                                │
│              │  [New Task] [Interrupt All] [View Logs]       │
├──────────────┴──────────────────────────────────────────────┤
│ ACTIVE PROJECTS                                              │
│ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│ │ khibra-demo │ │ team-tasks  │ │ + New       │             │
│ │ Progress 45%│ │ Progress 10%│ │             │             │
│ └─────────────┘ └─────────────┘ └─────────────┘             │
└─────────────────────────────────────────────────────────────┘
```

### 2. Agent Detail (/agents/[id])
- Full agent status and history
- Chat interface for direct communication
- Performance metrics (success rate, avg time)
- Recent tasks and errors
- Environment variables for this agent

### 3. Projects (/projects)
- List all projects with status
- Pipeline visualization (which agent has it)
- Progress tracking
- File tree browser (via SSH)

### 4. Project Detail (/projects/[id])
- Full project info
- Task breakdown
- Agent assignments
- Live logs
- Deploy button

### 5. Chat (/chat)
- Multi-agent chat interface
- Select agent to talk to
- Message history from `conversations` table
- Send tasks directly

### 6. Environment Config (/settings/env)
```
┌─────────────────────────────────────────────────────────────┐
│  AGENT ENVIRONMENT CONFIGURATION                             │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  Select Agent: [Dropdown: All Agents ▼]                      │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ GLOBAL ENVIRONMENT VARIABLES                           │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ DATABASE_URL      │ postgresql://...        │ [Edit]   │  │
│  │ N8N_API_KEY       │ ••••••••••••••••••••    │ [Edit]   │  │
│  │ SSH_HOST          │ 65.21.231.36            │ [Edit]   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌───────────────────────────────────────────────────────┐  │
│  │ DEVELOPER AGENT SPECIFIC                               │  │
│  ├───────────────────────────────────────────────────────┤  │
│  │ CAN_WRITE_FILES   │ true                    │ [Toggle] │  │
│  │ CAN_SSH           │ true                    │ [Toggle] │  │
│  │ CAN_DEPLOY        │ false                   │ [Toggle] │  │
│  │ MAX_FILES_PER_TASK│ 10                      │ [Edit]   │  │
│  │ ALLOWED_PATHS     │ /data/dev/projects/*    │ [Edit]   │  │
│  └───────────────────────────────────────────────────────┘  │
│                                                              │
│  [Save All] [Reset to Defaults] [Export Config]              │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### 7. Mistakes & Learning (/learning)
- View all logged mistakes
- Add new learnings
- Mark as "incorporated into prompt"
- Export to TEAM_KNOWLEDGE_BASE.md

### 8. Workflows (/workflows)
- List all n8n workflows
- Enable/disable workflows
- View recent executions
- Quick links to n8n editor

---

## File Structure

```
ai-team-dashboard/
├── app/
│   ├── layout.tsx                 # Root layout with sidebar
│   ├── page.tsx                   # Dashboard home
│   ├── agents/
│   │   ├── page.tsx               # Agents list
│   │   └── [id]/
│   │       ├── page.tsx           # Agent detail
│   │       └── chat/page.tsx      # Agent chat
│   ├── projects/
│   │   ├── page.tsx               # Projects list
│   │   └── [id]/page.tsx          # Project detail
│   ├── chat/page.tsx              # Multi-agent chat
│   ├── learning/page.tsx          # Mistakes & learning
│   ├── workflows/page.tsx         # n8n workflows
│   ├── settings/
│   │   ├── page.tsx               # General settings
│   │   └── env/page.tsx           # Environment config
│   └── api/
│       ├── socket/route.ts        # WebSocket endpoint
│       ├── agents/
│       │   ├── route.ts           # GET/POST agents
│       │   └── [id]/route.ts      # Agent CRUD
│       ├── projects/route.ts      # Projects API
│       ├── chat/route.ts          # Send message to agent
│       ├── env/route.ts           # Environment CRUD
│       └── n8n/
│           ├── webhooks/route.ts  # Receive n8n events
│           └── workflows/route.ts # Manage workflows
├── components/
│   ├── ui/                        # Shadcn components
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   ├── Header.tsx
│   │   └── Footer.tsx
│   ├── dashboard/
│   │   ├── AgentList.tsx
│   │   ├── LiveFeed.tsx
│   │   ├── ProjectCards.tsx
│   │   └── QuickActions.tsx
│   ├── agents/
│   │   ├── AgentCard.tsx
│   │   ├── AgentStatus.tsx
│   │   └── AgentMetrics.tsx
│   ├── chat/
│   │   ├── ChatPanel.tsx
│   │   ├── MessageBubble.tsx
│   │   └── AgentSelector.tsx
│   ├── projects/
│   │   ├── ProjectCard.tsx
│   │   ├── PipelineView.tsx
│   │   └── FileTree.tsx
│   └── settings/
│       ├── EnvEditor.tsx
│       └── AgentPermissions.tsx
├── lib/
│   ├── db.ts                      # Prisma client
│   ├── socket.ts                  # Socket.io setup
│   ├── n8n.ts                     # n8n API client
│   ├── ssh.ts                     # SSH utilities
│   └── stores/
│       ├── agentStore.ts          # Zustand store
│       ├── projectStore.ts
│       └── chatStore.ts
├── prisma/
│   └── schema.prisma              # Use existing tables
├── public/
│   └── icons/                     # Agent icons
├── .env.local                     # Environment variables
├── docker-compose.yml             # Deployment
├── Dockerfile
└── package.json
```

---

## Database Schema for New Tables

```sql
-- Agent environment variables
CREATE TABLE agent_env_vars (
    id SERIAL PRIMARY KEY,
    agent_name VARCHAR(50) NOT NULL,
    key VARCHAR(100) NOT NULL,
    value TEXT,
    is_secret BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(agent_name, key)
);

-- Global environment variables
CREATE TABLE global_env_vars (
    id SERIAL PRIMARY KEY,
    key VARCHAR(100) NOT NULL UNIQUE,
    value TEXT,
    is_secret BOOLEAN DEFAULT FALSE,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Agent permissions
CREATE TABLE agent_permissions (
    id SERIAL PRIMARY KEY,
    agent_name VARCHAR(50) NOT NULL UNIQUE,
    can_write_files BOOLEAN DEFAULT TRUE,
    can_ssh BOOLEAN DEFAULT TRUE,
    can_deploy BOOLEAN DEFAULT FALSE,
    can_access_db BOOLEAN DEFAULT TRUE,
    allowed_paths TEXT[],
    max_files_per_task INTEGER DEFAULT 10,
    max_execution_time_ms INTEGER DEFAULT 300000,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Real-time events log (for live feed)
CREATE TABLE realtime_events (
    id SERIAL PRIMARY KEY,
    event_type VARCHAR(50) NOT NULL,
    agent_name VARCHAR(50),
    project_name VARCHAR(100),
    message TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_realtime_events_time ON realtime_events(created_at DESC);
CREATE INDEX idx_realtime_events_agent ON realtime_events(agent_name);
```

---

## Socket.io Events

### Server → Client
```typescript
// Agent status changed
socket.emit('agent:status', {
  agent: 'developer',
  status: 'working',
  task: 'Creating home page'
});

// New activity
socket.emit('activity:new', {
  timestamp: Date.now(),
  agent: 'developer',
  type: 'file_write',
  message: 'Created src/pages/Home.tsx',
  project: 'khibra-demo'
});

// Task progress
socket.emit('task:progress', {
  taskId: '123',
  progress: 45,
  currentAgent: 'developer',
  phase: 'development'
});

// Chat message from agent
socket.emit('chat:message', {
  from: 'developer',
  to: 'user',
  message: 'I have completed the task. Files created: ...',
  timestamp: Date.now()
});
```

### Client → Server
```typescript
// Send message to agent
socket.emit('chat:send', {
  to: 'developer',
  message: 'Create a login page',
  project: 'khibra-demo'
});

// Interrupt agent
socket.emit('agent:interrupt', {
  agent: 'developer',
  reason: 'User requested stop'
});

// Request agent status
socket.emit('agent:status:request', { agent: 'developer' });
```

---

## n8n Integration

### Webhook Endpoint for n8n → Dashboard
```typescript
// POST /api/n8n/webhooks
// n8n workflows will POST here on events

interface N8nEvent {
  type: 'task_started' | 'task_completed' | 'task_failed' | 'file_written' | 'handoff';
  agent: string;
  project: string;
  message: string;
  data?: any;
}
```

### Add to n8n Workflows
Each workflow should have a "Notify Dashboard" HTTP Request node:
```javascript
// POST to dashboard
{
  url: 'https://ai-dashboard.arkedia.dev/api/n8n/webhooks',
  method: 'POST',
  body: {
    type: 'task_started',
    agent: 'developer',
    project: $json.project_name,
    message: 'Starting development task',
    data: { taskId: $json.request_id }
  }
}
```

---

## Deployment

### Docker Compose
```yaml
version: '3.8'
services:
  dashboard:
    build: .
    ports:
      - "3001:3000"
    environment:
      - DATABASE_URL=${DATABASE_URL}
      - N8N_API_KEY=${N8N_API_KEY}
    restart: unless-stopped
    networks:
      - ai-team-network

networks:
  ai-team-network:
    external: true
```

### Nginx Config
```nginx
server {
    listen 80;
    server_name ai-dashboard.arkedia.dev;

    location / {
        proxy_pass http://localhost:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

---

## Implementation Order

### Phase 1: Core Setup (Day 1)
1. Create Next.js project with Shadcn/UI
2. Set up Prisma with existing database
3. Create basic layout with sidebar
4. Build dashboard page with static data

### Phase 2: Real-time (Day 2)
1. Set up Socket.io server
2. Create LiveFeed component
3. Build AgentList with status
4. Add real-time updates

### Phase 3: Agent Management (Day 3)
1. Agent detail page
2. Chat interface
3. Performance metrics
4. Environment config page

### Phase 4: Projects (Day 4)
1. Projects list
2. Project detail with pipeline
3. File browser via SSH
4. Deploy button

### Phase 5: n8n Integration (Day 5)
1. Add webhook receiver
2. Update n8n workflows to POST events
3. Workflows management page
4. Test end-to-end

### Phase 6: Polish & Deploy (Day 6)
1. Error handling
2. Loading states
3. Mobile responsive
4. Docker deployment
5. Domain setup

---

## Success Criteria

- [ ] Dashboard loads in < 2 seconds
- [ ] Real-time updates appear within 500ms
- [ ] Can chat with any agent
- [ ] Can see all agent statuses
- [ ] Can configure agent environments
- [ ] Can view project progress
- [ ] Can interrupt running tasks
- [ ] Works on mobile
- [ ] Deployed to ai-dashboard.arkedia.dev

---

## Notes for Claude

1. **ALWAYS read CLAUDE_INSTRUCTIONS.md first**
2. Use existing database tables when possible
3. Keep components small and reusable
4. Add proper TypeScript types
5. Handle loading and error states
6. Test WebSocket connections work
7. Use server components where possible
8. Minimize client-side JavaScript
