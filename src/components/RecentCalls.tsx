"use client";

import { useEffect, useRef, useState } from "react";
import type { CallSession } from "@/lib/types";
import { dayKey, formatClockTime, formatDayHeader } from "@/lib/format";
import Avatar from "./Avatar";
import { IconCalendar, IconDots, IconUsers } from "./icons";
import CallDetailsModal from "./CallDetailsModal";
import { useToast } from "@/context/ToastContext";

interface Props {
  sessions: CallSession[];
  onStartCall: () => void;
}

function groupByDay(sessions: CallSession[]) {
  const groups = new Map<string, { header: string; ts: number; items: CallSession[] }>();
  for (const s of sessions) {
    const key = dayKey(s.started_at);
    const ts = new Date(s.started_at).setHours(0, 0, 0, 0);
    if (!groups.has(key)) {
      groups.set(key, { header: formatDayHeader(s.started_at), ts, items: [] });
    }
    groups.get(key)!.items.push(s);
  }
  return Array.from(groups.values()).sort((a, b) => b.ts - a.ts);
}

function callTitle(s: CallSession) {
  return s.description || s.client || "Call";
}

function CallMenu({
  session,
  onView,
}: {
  session: CallSession;
  onView: (s: CallSession) => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);
  const { show } = useToast();

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    if (open) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [open]);

  const copyLink = async () => {
    const link = `${typeof window !== "undefined" ? window.location.origin : ""}/calls/${session._id}`;
    try {
      await navigator.clipboard.writeText(link);
      show("Link copied to clipboard", "success");
    } catch {
      show("Could not copy link", "error");
    }
    setOpen(false);
  };

  return (
    <div ref={ref} className="relative">
      <button
        aria-label="More"
        onClick={(e) => {
          e.stopPropagation();
          setOpen((v) => !v);
        }}
        className="p-1 text-text-soft hover:text-text rounded-md hover:bg-surface-2"
      >
        <IconDots width={16} height={16} />
      </button>
      {open && (
        <div className="absolute right-0 mt-1 w-44 rounded-lg border border-border bg-surface shadow-modal anim-scale z-20 overflow-hidden">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView(session);
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-text hover:bg-surface-2"
          >
            View details
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyLink();
            }}
            className="w-full text-left px-3 py-2 text-sm text-text hover:bg-surface-2"
          >
            Copy link
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              show("Transcript download coming soon");
              setOpen(false);
            }}
            className="w-full text-left px-3 py-2 text-sm text-text hover:bg-surface-2"
          >
            Download transcript
          </button>
        </div>
      )}
    </div>
  );
}

export default function RecentCalls({ sessions, onStartCall }: Props) {
  const [detail, setDetail] = useState<CallSession | null>(null);

  if (sessions.length === 0) {
    return (
      <div className="mt-2 rounded-card border border-border bg-surface px-6 py-10 lg:py-12 text-center">
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-md bg-primary-soft text-accent">
          <IconCalendar width={20} height={20} />
        </div>
        <p className="text-sm font-semibold text-text">No Recent Calls</p>
        <p className="mx-auto mt-1.5 max-w-xs text-xs text-text-soft leading-relaxed">
          Connect your Google Calendar to see upcoming meetings, get reminders, and join
          calls directly from Hintro.
        </p>
        <button
          onClick={onStartCall}
          className="mt-4 inline-flex rounded-md border border-border bg-surface px-3.5 py-1.5 text-xs font-medium text-text hover:bg-surface-2 transition-colors"
        >
          Start a Call
        </button>
      </div>
    );
  }

  const groups = groupByDay(sessions);
  return (
    <>
      <div className="mt-2 space-y-5">
        {groups.map((g) => (
          <div key={g.header}>
            <p className="text-[11px] lg:text-xs text-text-soft mb-2">{g.header}</p>
            <ul className="divide-y divide-border">
              {g.items.map((s) => (
                <li
                  key={s._id}
                  onClick={() => setDetail(s)}
                  className="flex items-center gap-3 py-2.5 transition-colors hover:bg-surface-2 -mx-2 px-2 rounded-md cursor-pointer"
                >
                  <Avatar name={s.client} size={32} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-text truncate">
                      {callTitle(s)}
                    </p>
                    <div className="mt-0.5 flex items-center gap-1 text-text-soft">
                      <IconUsers width={11} height={11} />
                      <IconUsers width={11} height={11} className="-ml-2" />
                      <IconUsers width={11} height={11} className="-ml-2" />
                    </div>
                  </div>
                  <span className="text-xs text-text-soft whitespace-nowrap">
                    {formatClockTime(s.started_at)}
                  </span>
                  <CallMenu session={s} onView={setDetail} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      {detail && (
        <CallDetailsModal session={detail} onClose={() => setDetail(null)} />
      )}
    </>
  );
}
