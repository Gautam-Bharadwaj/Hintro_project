"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/context/UserContext";
import { useProfile } from "@/context/ProfileContext";
import { api } from "@/lib/api";
import type {
  CallSession,
  CallStats,
  DashboardResponse,
  UserProfile,
} from "@/lib/types";
import { formatDuration, formatRelativeTime } from "@/lib/format";
import Sidebar, { type NavKey } from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import StatCard from "@/components/StatCard";
import RecentCalls from "@/components/RecentCalls";
import LoggedOutScreen from "@/components/LoggedOutScreen";
import ComingSoonPanel from "@/components/ComingSoonPanel";
import StartCallModal from "@/components/StartCallModal";
import {
  IconCalendar,
  IconChart,
  IconClock,
  IconSparkles,
} from "@/components/icons";

const NAV_TITLES: Record<NavKey, string> = {
  dashboard: "Dashboard",
  "call-insights": "Call Insights",
  "knowledge-base": "Knowledge Base",
  prompts: "Prompts",
  "boxy-controls": "Boxy Controls",
};

export default function DashboardPage() {
  const { userId, loggedOut } = useUser();
  const { override } = useProfile();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [dashboard, setDashboard] = useState<DashboardResponse | null>(null);
  const [stats, setStats] = useState<CallStats | null>(null);
  const [sessions, setSessions] = useState<CallSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [active, setActive] = useState<NavKey>("dashboard");
  const [startCallOpen, setStartCallOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    (async () => {
      try {
        const [p, d, s, c] = await Promise.all([
          api.profile(userId),
          api.dashboard(userId),
          api.stats(userId),
          api.sessions(userId, 10),
        ]);
        if (cancelled) return;
        setProfile(p);
        setDashboard(d);
        setStats(s);
        setSessions(c.callSessions);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (loggedOut) return <LoggedOutScreen />;

  const apiFirstName = userId === "u1" ? "Jane" : profile?.firstName ?? "";
  const apiLastName = userId === "u1" ? "Smith" : profile?.lastName ?? "";
  const defaultFirstName = apiFirstName;
  const defaultLastName = apiLastName;
  const firstName = override.firstName || apiFirstName || "Name";
  const lastName = override.lastName || apiLastName || "";
  const userName = `${firstName} ${lastName}`.trim() || "User";
  const lastSessionIso = stats?.lastSession?.[0] ?? null;

  return (
    <div className="min-h-screen flex bg-surface-2">
      <Sidebar
        mobileOpen={mobileNavOpen}
        onCloseMobile={() => setMobileNavOpen(false)}
        active={active}
        onNavigate={setActive}
        dashboard={dashboard}
      />

      <div className="flex-1 min-w-0 flex flex-col bg-surface">
        <Topbar
          title={NAV_TITLES[active]}
          userName={userName}
          photo={override.photo}
          defaultFirstName={defaultFirstName}
          defaultLastName={defaultLastName}
          onOpenMobileSidebar={() => setMobileNavOpen(true)}
        />

        {active !== "dashboard" ? (
          <ComingSoonPanel title={NAV_TITLES[active]} />
        ) : (
          <main className="flex-1 px-4 lg:px-8 py-5 lg:py-7">
            {error && (
              <div className="mb-4 rounded-md border border-border bg-stat-red/40 px-3 py-2 text-sm text-text">
                {error}
              </div>
            )}

            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="text-lg lg:text-xl font-semibold text-text">
                  Hi, {firstName} <span aria-hidden>👋</span> Welcome to Hintro
                </h2>
                <p className="mt-0.5 text-xs lg:text-sm text-text-soft">
                  Ready to make your next call smarter ?
                </p>
              </div>
              <button
                onClick={() => setStartCallOpen(true)}
                className="rounded-md bg-primary px-3.5 py-2 text-xs lg:text-sm font-medium text-white hover:bg-primary-hover transition-colors"
              >
                Start New Call
              </button>
            </div>

            <section className="mt-6 overflow-hidden rounded-xl border border-border bg-surface shadow-sm">
              <div className="flex flex-col lg:flex-row">
                <div className="flex-1 p-5 lg:p-6">
                  <h3 className="text-base font-semibold text-text">Watch Tutorial</h3>
                  <p className="mt-1 text-sm text-text-soft">
                    New to Hintro? Watch this quick guide to learn how to make the most
                    of your call insights and AI summaries.
                  </p>
                  <div className="mt-4 flex items-center gap-4 text-xs text-text-soft">
                    <span className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Setup profile
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Start first call
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-accent" />
                      Review AI insights
                    </span>
                  </div>
                </div>
                <div className="lg:w-[400px] shrink-0 bg-black aspect-video lg:aspect-auto">
                  <video
                    src="/Tutorial_video.mov"
                    controls
                    className="h-full w-full object-contain"
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              </div>
            </section>

            <div className="mt-5 grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-3">
              <StatCard
                label="Total Sessions"
                value={loading ? "…" : String(stats?.totalSessions ?? 0)}
                iconBg="var(--color-stat-red)"
                icon={<IconChart width={18} height={18} className="text-[#e26a55]" />}
              />
              <StatCard
                label="Average Duration"
                value={
                  loading
                    ? "…"
                    : (stats?.averageDuration ?? 0) > 0
                      ? formatDuration(stats!.averageDuration)
                      : "0sec"
                }
                iconBg="var(--color-stat-teal)"
                icon={<IconClock width={18} height={18} className="text-[#1f9c8c]" />}
              />
              <StatCard
                label="AI Used"
                value={
                  loading
                    ? "…"
                    : (stats?.totalAIInteractions ?? 0) > 0
                      ? `${stats!.totalAIInteractions} times`
                      : "0"
                }
                iconBg="var(--color-stat-green)"
                icon={
                  <IconSparkles width={18} height={18} className="text-[#2e9b4d]" />
                }
              />
              <StatCard
                label="Last Session"
                value={
                  loading ? "…" : lastSessionIso ? formatRelativeTime(lastSessionIso) : "-"
                }
                iconBg="var(--color-stat-purple)"
                icon={<IconCalendar width={18} height={18} className="text-[#6b59c9]" />}
              />
            </div>

            <section className="mt-7 lg:mt-8">
              <h3 className="text-center text-sm font-medium text-text">Recent calls</h3>
              {loading ? (
                <div className="mt-6 text-center text-sm text-text-soft">Loading…</div>
              ) : (
                <RecentCalls
                  sessions={sessions}
                  onStartCall={() => setStartCallOpen(true)}
                />
              )}
            </section>
          </main>
        )}
      </div>

      {startCallOpen && <StartCallModal onClose={() => setStartCallOpen(false)} />}
    </div>
  );
}
