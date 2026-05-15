"use client";

import { useEffect } from "react";
import { IconClose } from "./icons";
import type { CallSession } from "@/lib/types";
import { formatDuration, formatRelativeTime } from "@/lib/format";

interface Props {
  session: CallSession;
  onClose: () => void;
}

function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "ended"
      ? "bg-stat-green text-success"
      : status === "force_ended"
        ? "bg-stat-red text-text"
        : "bg-muted text-text-soft";
  return (
    <span className={`inline-flex rounded-full px-2 py-0.5 text-[11px] font-medium ${tone}`}>
      {status.replace("_", " ")}
    </span>
  );
}

export default function CallDetailsModal({ session, onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-xl bg-surface shadow-modal anim-scale">
        <div className="flex items-start justify-between border-b border-border px-5 py-3.5">
          <div className="min-w-0">
            <h3 className="text-base font-semibold text-text truncate">
              {session.description || "Call"}
            </h3>
            <div className="mt-1 flex items-center gap-2">
              <p className="text-xs text-text-soft truncate">{session.client}</p>
              <StatusBadge status={session.status} />
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-text-soft hover:text-text"
          >
            <IconClose width={18} height={18} />
          </button>
        </div>

        <dl className="grid grid-cols-2 gap-x-4 gap-y-3 px-5 py-4 text-sm">
          <div>
            <dt className="text-[11px] text-text-soft">Started</dt>
            <dd className="font-medium text-text">{formatRelativeTime(session.started_at)}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-text-soft">Duration</dt>
            <dd className="font-medium text-text">
              {formatDuration(session.total_duration_seconds)}
            </dd>
          </div>
          <div>
            <dt className="text-[11px] text-text-soft">AI interactions</dt>
            <dd className="font-medium text-text">{session.ai_interactions}</dd>
          </div>
          <div>
            <dt className="text-[11px] text-text-soft">Language</dt>
            <dd className="font-medium text-text">
              {session.language.join(", ").toUpperCase()}
            </dd>
          </div>
          <div className="col-span-2">
            <dt className="text-[11px] text-text-soft">Participants</dt>
            <dd className="mt-1 flex flex-wrap gap-1.5">
              {session.participants.map((p) => (
                <span
                  key={p.name}
                  className={`rounded-full border px-2 py-0.5 text-[11px] ${
                    p.isUser
                      ? "border-accent/40 bg-primary-soft text-text"
                      : "border-border bg-surface-2 text-text-soft"
                  }`}
                >
                  {p.name}
                  {p.isUser ? " (you)" : ""}
                </span>
              ))}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
}
