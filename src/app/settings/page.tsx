'use client';

import { Header } from '@/components/layout/Header';
import { SettingsContent } from '@/components/settings/SettingsContent';

export default function SettingsPage() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Settings" />
      <SettingsContent />
    </div>
  );
}
