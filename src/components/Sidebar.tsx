"use client";

import { useState } from "react";
import {
  IconBook,
  IconClose,
  IconDashboard,
  IconGear,
  IconGift,
  IconInbox,
  IconInfo,
  IconPhone,
  IconSparkles,
} from "./icons";
import FeedbackModal from "./FeedbackModal";
import FeedbackHistoryModal from "./FeedbackHistoryModal";
import UpgradeModal from "./UpgradeModal";
import type { DashboardResponse } from "@/lib/types";

export type NavKey =
  | "dashboard"
  | "call-insights"
  | "knowledge-base"
  | "prompts"
  | "boxy-controls";

const NAV_PRIMARY: { key: NavKey; label: string; icon: typeof IconDashboard; info?: boolean }[] = [
  { key: "dashboard", label: "Dashboard", icon: IconDashboard },
  { key: "call-insights", label: "Call Insights", icon: IconPhone },
  { key: "knowledge-base", label: "Knowledge Base", icon: IconBook, info: true },
  { key: "prompts", label: "Prompts", icon: IconSparkles, info: true },
  { key: "boxy-controls", label: "Boxy Controls", icon: IconGear, info: true },
];

interface SidebarProps {
  mobileOpen: boolean;
  onCloseMobile: () => void;
  active: NavKey;
  onNavigate: (key: NavKey) => void;
  dashboard?: DashboardResponse | null;
}

export default function Sidebar({
  mobileOpen,
  onCloseMobile,
  active,
  onNavigate,
  dashboard,
}: SidebarProps) {
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const usageUsed = dashboard?.usage.kb_files.used;
  const usageLimit = dashboard?.usage.kb_files.limit;

  const handleNavClick = (key: NavKey) => {
    onNavigate(key);
    onCloseMobile();
  };

  const content = (
    <div className="flex h-full flex-col">
      <div className="hidden lg:flex h-16 items-center px-6 border-b border-border">
        <span className="text-xl font-semibold tracking-tight">Hintro</span>
      </div>
      <div className="flex lg:hidden h-14 items-center justify-between px-4 border-b border-border">
        <button
          onClick={onCloseMobile}
          aria-label="Close menu"
          className="p-1 -ml-1 text-text"
        >
          <IconClose width={22} height={22} />
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 py-4 scrollbar-thin">
        <ul className="space-y-1">
          {NAV_PRIMARY.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.key;
            return (
              <li key={item.key}>
                <button
                  onClick={() => handleNavClick(item.key)}
                  className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors ${
                    isActive
                      ? "bg-primary-soft text-text font-medium"
                      : "text-text-soft hover:bg-surface-2 hover:text-text"
                  }`}
                >
                  <Icon width={18} height={18} />
                  <span className="flex-1 text-left">{item.label}</span>
                  {item.info && <IconInfo className="text-text-soft/60" />}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="px-3 pb-4 space-y-1">
        {active === "dashboard" && (
          <>
            <button
              onClick={() => setHistoryOpen(true)}
              className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-text-soft hover:bg-surface-2 hover:text-text transition-colors"
            >
              <IconInbox width={18} height={18} />
              <span>Feedback History</span>
            </button>
            <button
              onClick={() => setFeedbackOpen(true)}
              className="w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm text-text-soft hover:bg-surface-2 hover:text-text transition-colors"
            >
              <IconGift width={18} height={18} />
              <span>Feedback</span>
            </button>
          </>
        )}
        {typeof usageUsed === "number" && typeof usageLimit === "number" && (
          <div className="hidden lg:block px-3 pt-2 pb-1 text-[11px] text-text-soft">
            {usageUsed} of {usageLimit} KB files used
          </div>
        )}
        <button
          onClick={() => setUpgradeOpen(true)}
          className="w-full rounded-md bg-muted py-2 text-sm font-medium text-text-soft hover:bg-border transition-colors"
        >
          Upgrade
        </button>
        <p className="hidden lg:block text-center text-[11px] text-text-soft pt-3">
          © 2025 Hintro. Made in India
        </p>
      </div>

      {feedbackOpen && <FeedbackModal onClose={() => setFeedbackOpen(false)} />}
      {historyOpen && <FeedbackHistoryModal onClose={() => setHistoryOpen(false)} />}
      {upgradeOpen && (
        <UpgradeModal dashboard={dashboard} onClose={() => setUpgradeOpen(false)} />
      )}
    </div>
  );

  return (
    <>
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-border bg-surface sticky top-0 h-screen">
        {content}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40 anim-fade">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={onCloseMobile}
            aria-hidden
          />
          <div className="relative h-full w-72 max-w-[85vw] bg-surface shadow-modal anim-slide-left">
            {content}
          </div>
        </div>
      )}
    </>
  );
}
