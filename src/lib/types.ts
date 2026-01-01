export type AgentStatus = 'idle' | 'working' | 'error' | 'blocked';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type JsonValue = any;

export interface Agent {
  id: number;
  name: string;
  description: string | null;
  system_prompt: string | null;
  webhook_path: string | null;
  model: string | null;
  is_active: boolean | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface Project {
  id: number;
  name: string;
  description: string | null;
  status: string | null;
  workspace_path: string | null;
  github_repo: string | null;
  tech_stack: JsonValue;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface RealtimeEvent {
  id: number;
  event_type: string;
  agent_name: string | null;
  project_name: string | null;
  message: string;
  metadata: JsonValue;
  created_at: Date | null;
}

export interface AgentPermission {
  id: number;
  agent_name: string;
  can_write_files: boolean | null;
  can_ssh: boolean | null;
  can_deploy: boolean | null;
  can_access_db: boolean | null;
  can_call_apis: boolean | null;
  allowed_paths: string[];
  blocked_paths: string[];
  max_files_per_task: number | null;
  max_execution_time_ms: number | null;
  max_tokens_per_request: number | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface GlobalEnvVar {
  id: number;
  key: string;
  value: string | null;
  is_secret: boolean | null;
  description: string | null;
  category: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface AgentEnvVar {
  id: number;
  agent_name: string;
  key: string;
  value: string | null;
  is_secret: boolean | null;
  description: string | null;
  created_at: Date | null;
  updated_at: Date | null;
}

export interface AgentMistake {
  id: number;
  agent_name: string;
  mistake_date: Date | null;
  project_name: string | null;
  task_description: string | null;
  what_happened: string;
  root_cause: string | null;
  solution: string | null;
  prevention: string | null;
  severity: string | null;
  learned: boolean | null;
  incorporated_into_prompt: boolean | null;
  created_at: Date | null;
}

export interface TaskProgress {
  id: number;
  request_id: string;
  project_name: string | null;
  original_request: string | null;
  current_agent: string | null;
  current_phase: string | null;
  progress_percent: number | null;
  status: string | null;
  started_at: Date | null;
  last_update: Date | null;
  estimated_completion: Date | null;
  blockers: JsonValue;
  completed_steps: JsonValue;
  agent_chain: JsonValue;
  final_result: JsonValue;
  error_log: string[];
}

export interface Conversation {
  id: number;
  agent_id: number | null;
  project_id: number | null;
  session_id: string | null;
  role: string;
  content: string;
  tokens_used: number | null;
  created_at: Date | null;
}

export interface AgentPerformance {
  id: number;
  agent_name: string;
  task_id: string | null;
  project_name: string | null;
  request_id: string | null;
  started_at: Date | null;
  completed_at: Date | null;
  success: boolean | null;
  error_message: string | null;
  files_created: string[];
  execution_time_ms: number | null;
  feedback_score: number | null;
  feedback_from_agent: string | null;
  feedback_notes: string | null;
  created_at: Date | null;
}

export interface AgentHandoff {
  id: number;
  from_agent: string;
  to_agent: string;
  project_id: number | null;
  context: JsonValue;
  completion_signal: string | null;
  status: string | null;
  created_at: Date | null;
  completed_at: Date | null;
}

export interface CostTracking {
  id: number;
  agent_id: number | null;
  project_id: number | null;
  request_id: string | null;
  input_tokens: number | null;
  output_tokens: number | null;
  cost_usd: number | null;
  created_at: Date | null;
}
