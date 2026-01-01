import { Header } from '@/components/layout/Header';
import { NewAgentForm } from '@/components/agents/NewAgentForm';

export default function NewAgentPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Create Agent" showBack backHref="/agents" />
      <NewAgentForm />
    </div>
  );
}
