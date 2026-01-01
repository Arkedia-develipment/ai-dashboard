# AI Team Dashboard - Execution Plan

> **Step-by-step guide for building and deploying the AI Team Control Center**
> **Estimated Time: 6 days**
> **Created: 2026-01-01**

---

## PRE-EXECUTION SETUP

### 1. Files to Read Before Starting
```
REQUIRED READING (in order):
1. CLAUDE_INSTRUCTIONS.md  - Coding standards and rules
2. AI_TEAM_DASHBOARD_PROMPT.md - Full project specification
3. TEAM_KNOWLEDGE_BASE.md - Team patterns and learnings
```

### 2. Database Tables (Already Created)
```sql
-- Environment tables (created on 2026-01-01):
- global_env_vars      (6 rows)
- agent_env_vars       (empty, ready for use)
- agent_permissions    (10 rows, one per agent)
- realtime_events      (empty, ready for logging)

-- Existing tables to use:
- agents, projects, agent_performance, agent_mistakes
- task_progress, agent_handoff_log, conversations
```

### 3. Server Access
```
Server: 65.21.231.36
SSH: root@65.21.231.36
Deploy Path: /data/apps/ai-dashboard
Domain: ai-dashboard.arkedia.dev
Port: 3001
```

---

## PHASE 1: PROJECT SETUP (Day 1, ~2 hours)

### Step 1.1: Create Next.js Project
```bash
# On local machine
cd c:\Users\anas\Desktop\Play\ai-team
npx create-next-app@latest dashboard --typescript --tailwind --eslint --app --src-dir=false --import-alias="@/*"
cd dashboard
```

### Step 1.2: Install Dependencies
```bash
npm install @prisma/client prisma socket.io socket.io-client zustand
npm install -D @types/node
npx shadcn-ui@latest init
```

### Step 1.3: Add Shadcn Components
```bash
npx shadcn-ui@latest add button card input label select
npx shadcn-ui@latest add dialog sheet dropdown-menu
npx shadcn-ui@latest add table tabs badge skeleton toast
npx shadcn-ui@latest add command avatar separator
```

### Step 1.4: Initialize Prisma
```bash
npx prisma init
```

### Step 1.5: Configure Environment
Create `.env.local`:
```env
DATABASE_URL="postgresql://postgres:Anas@8264@postgres.arkedia.dev:5432/ai_team"
N8N_API_URL="https://n8n.arkedia.dev"
N8N_API_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI1MDNlZTE2OS0zZTQyLTQ4NTMtYTZiMS1mY2RmNjJhNDM4MjEiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwiaWF0IjoxNzY2NjQ3NjQ1fQ.NO6ec-6CLgjlpea7VCryuAxiSLK2J_z3o0AVtfx_-Pc"
SSH_HOST="65.21.231.36"
SSH_USER="root"
NEXT_PUBLIC_WS_URL="wss://ai-dashboard.arkedia.dev"
NEXT_PUBLIC_APP_URL="https://ai-dashboard.arkedia.dev"
```

### Step 1.6: Create Prisma Schema
Create `prisma/schema.prisma` that maps to existing tables.

---

## PHASE 2: CORE LAYOUT (Day 1, ~3 hours)

### Step 2.1: Create Layout Structure
```
app/
├── layout.tsx          # Root layout with providers
├── page.tsx            # Dashboard home
├── globals.css         # Tailwind imports
└── loading.tsx         # Global loading state
```

### Step 2.2: Create Sidebar Component
```typescript
// components/layout/Sidebar.tsx
- Logo at top
- Navigation links (Dashboard, Agents, Projects, Chat, Learning, Settings)
- Agent quick-status list at bottom
- Dark mode toggle
```

### Step 2.3: Create Header Component
```typescript
// components/layout/Header.tsx
- Breadcrumbs
- Search command palette (Cmd+K)
- Notifications bell
- User menu
```

### Step 2.4: Verification Checkpoint
```
[ ] npm run dev works
[ ] Sidebar renders
[ ] Navigation works
[ ] Tailwind classes apply
[ ] Dark mode toggles
```

---

## PHASE 3: DASHBOARD HOME (Day 2, ~4 hours)

### Step 3.1: Agent Status List
```typescript
// components/dashboard/AgentList.tsx
Features:
- Show all 10 agents with status indicator
- Color code: green=working, gray=idle, red=error, yellow=blocked
- Click to navigate to agent detail
- Pulse animation for working agents
```

### Step 3.2: Live Activity Feed
```typescript
// components/dashboard/LiveFeed.tsx
Features:
- Real-time scrolling log
- Color-coded by event type
- Timestamp + agent + message
- Click to expand for details
- "New events" indicator when scrolled up
```

### Step 3.3: Project Cards
```typescript
// components/dashboard/ProjectCards.tsx
Features:
- Grid of active projects
- Progress percentage
- Current agent working on it
- Quick actions (view, deploy)
```

### Step 3.4: Quick Actions Bar
```typescript
// components/dashboard/QuickActions.tsx
Buttons:
- New Task (opens modal)
- Interrupt All (stops all agents)
- View Logs (links to n8n)
- Refresh Status
```

### Step 3.5: Verification Checkpoint
```
[ ] Dashboard shows all 10 agents
[ ] Status colors are correct
[ ] Projects display from database
[ ] Quick actions work
[ ] Layout is responsive
```

---

## PHASE 4: REAL-TIME WEBSOCKET (Day 2, ~3 hours)

### Step 4.1: Socket.io Server Setup
```typescript
// app/api/socket/route.ts
- Initialize Socket.io server
- Handle connections
- Broadcast events to all clients
```

### Step 4.2: Socket.io Client Hook
```typescript
// lib/socket.ts
export function useSocket() {
  // Connect to WebSocket
  // Handle reconnection
  // Expose emit and on methods
}
```

### Step 4.3: Connect Dashboard Components
```typescript
// Update LiveFeed to listen for 'activity:new'
// Update AgentList to listen for 'agent:status'
// Update ProjectCards to listen for 'task:progress'
```

### Step 4.4: n8n Webhook Receiver
```typescript
// app/api/n8n/webhooks/route.ts
- Receive events from n8n workflows
- Store in realtime_events table
- Broadcast via Socket.io
```

### Step 4.5: Verification Checkpoint
```
[ ] WebSocket connects
[ ] Events appear in live feed
[ ] Agent status updates in real-time
[ ] No connection drops
```

---

## PHASE 5: AGENT MANAGEMENT (Day 3, ~4 hours)

### Step 5.1: Agents List Page
```typescript
// app/agents/page.tsx
- Table of all agents
- Status, last active, success rate
- Click row to view detail
```

### Step 5.2: Agent Detail Page
```typescript
// app/agents/[id]/page.tsx
Sections:
- Header with status and actions
- Performance metrics (success rate, avg time)
- Recent tasks list
- Recent errors from agent_mistakes
- Environment variables editor
- Permissions toggles
```

### Step 5.3: Agent Chat Page
```typescript
// app/agents/[id]/chat/page.tsx
Features:
- Message history from conversations table
- Input to send new message
- Real-time responses
- "Interrupt" button
```

### Step 5.4: Verification Checkpoint
```
[ ] Agents list shows all 10 agents
[ ] Detail page loads with real data
[ ] Chat sends messages to webhook
[ ] Environment edits save to database
```

---

## PHASE 6: ENVIRONMENT CONFIGURATION (Day 3, ~3 hours)

### Step 6.1: Settings Layout
```typescript
// app/settings/layout.tsx
- Settings sidebar with sections
- General, Environment, Permissions, Appearance
```

### Step 6.2: Global Environment Page
```typescript
// app/settings/env/page.tsx
Features:
- List all global_env_vars
- Add/Edit/Delete variables
- Toggle is_secret (masked display)
- Category grouping (database, api, ssh, paths)
- Export as .env file
```

### Step 6.3: Agent Environment Editor
```typescript
// components/settings/AgentEnvEditor.tsx
Features:
- Dropdown to select agent
- List agent-specific variables
- Inherit from global toggle
- Override values
```

### Step 6.4: Agent Permissions Page
```typescript
// app/settings/permissions/page.tsx
Features:
- Table of all agents
- Toggle columns: can_write, can_ssh, can_deploy, etc.
- Edit allowed_paths array
- Set limits (max_files, max_time)
```

### Step 6.5: Verification Checkpoint
```
[ ] Global vars display correctly
[ ] Secrets are masked
[ ] Agent-specific vars save
[ ] Permissions toggles work
[ ] Changes persist after refresh
```

---

## PHASE 7: PROJECTS & WORKFLOWS (Day 4, ~4 hours)

### Step 7.1: Projects List Page
```typescript
// app/projects/page.tsx
- Grid of project cards
- Status, tech stack, progress
- Create new project button
```

### Step 7.2: Project Detail Page
```typescript
// app/projects/[id]/page.tsx
Sections:
- Project header with name, description
- Pipeline visualization (which agents, current stage)
- Task breakdown with checkboxes
- File tree browser (via SSH)
- Logs from task_progress
- Deploy button
```

### Step 7.3: Workflows Page
```typescript
// app/workflows/page.tsx
Features:
- List n8n workflows via API
- Active/Inactive toggle
- Recent executions
- Link to n8n editor
```

### Step 7.4: Verification Checkpoint
```
[ ] Projects load from database
[ ] Pipeline shows current agent
[ ] File browser works via SSH
[ ] Workflows list from n8n API
```

---

## PHASE 8: LEARNING & MISTAKES (Day 5, ~2 hours)

### Step 8.1: Learning Dashboard
```typescript
// app/learning/page.tsx
Features:
- Recent mistakes table
- Grouped by agent
- Severity badges
- "Mark as learned" button
```

### Step 8.2: Add Mistake Form
```typescript
// components/learning/AddMistakeForm.tsx
Fields:
- Agent (dropdown)
- What happened (textarea)
- Root cause (textarea)
- Solution (textarea)
- Prevention (textarea)
- Severity (select)
```

### Step 8.3: Knowledge Patterns
```typescript
// app/learning/patterns/page.tsx
- List code patterns
- Add new pattern form
- Usage count tracking
```

### Step 8.4: Verification Checkpoint
```
[ ] Mistakes display from database
[ ] Can add new mistakes
[ ] Can mark as learned
[ ] Patterns are searchable
```

---

## PHASE 9: TESTING & POLISH (Day 5, ~3 hours)

### Step 9.1: Add Loading States
```typescript
// Add loading.tsx to each route segment
// Use Skeleton components
```

### Step 9.2: Add Error Boundaries
```typescript
// Add error.tsx to each route segment
// Show retry button
```

### Step 9.3: Mobile Responsiveness
```
[ ] Sidebar collapses to hamburger
[ ] Tables become cards on mobile
[ ] Touch-friendly buttons
```

### Step 9.4: Performance Check
```
[ ] No unnecessary re-renders
[ ] Images optimized
[ ] Bundle size acceptable
[ ] Lighthouse score > 80
```

---

## PHASE 10: DEPLOYMENT (Day 6, ~2 hours)

### Step 10.1: Create Docker Files
```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```yaml
# docker-compose.yml
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
```

### Step 10.2: Upload to Server
```bash
# From local
scp -r dashboard/* root@65.21.231.36:/data/apps/ai-dashboard/

# On server
cd /data/apps/ai-dashboard
docker-compose up -d --build
```

### Step 10.3: Configure Nginx
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

### Step 10.4: SSL Certificate
```bash
certbot --nginx -d ai-dashboard.arkedia.dev
```

### Step 10.5: Update n8n Workflows
Add "Notify Dashboard" node to each workflow:
```javascript
// HTTP Request to POST /api/n8n/webhooks
{
  type: 'task_started',
  agent: 'developer',
  project: $json.project_name,
  message: 'Task description here'
}
```

### Step 10.6: Final Verification
```
[ ] Dashboard loads at https://ai-dashboard.arkedia.dev
[ ] WebSocket connects
[ ] Real-time events appear
[ ] All pages work
[ ] Mobile responsive
[ ] No console errors
```

---

## POST-DEPLOYMENT

### Daily Checks
- [ ] Check dashboard is accessible
- [ ] Verify WebSocket connection
- [ ] Review error logs
- [ ] Check database connections

### Weekly Maintenance
- [ ] Review agent_mistakes for patterns
- [ ] Update TEAM_KNOWLEDGE_BASE.md
- [ ] Check for npm updates
- [ ] Review performance metrics

---

## QUICK COMMANDS REFERENCE

```bash
# Development
npm run dev              # Start dev server
npx prisma studio        # Open database GUI
npx prisma db pull       # Pull schema from database

# Production
docker-compose up -d     # Start production
docker-compose logs -f   # View logs
docker-compose down      # Stop production

# Database
psql postgresql://postgres:Anas@8264@postgres.arkedia.dev:5432/ai_team

# Server
ssh root@65.21.231.36
```

---

## TROUBLESHOOTING

### WebSocket Not Connecting
1. Check NEXT_PUBLIC_WS_URL in .env
2. Verify nginx WebSocket upgrade headers
3. Check firewall allows port 3001

### Database Connection Failed
1. Verify DATABASE_URL format
2. Check postgres.arkedia.dev is accessible
3. Verify credentials

### n8n Events Not Appearing
1. Check webhook URL in n8n workflows
2. Verify dashboard API is accessible
3. Check realtime_events table for rows

---

**Remember: Always read CLAUDE_INSTRUCTIONS.md before writing any code!**
