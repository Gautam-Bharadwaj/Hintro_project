"use client";

import { useEffect, useState } from "react";
import { IconClose, IconPhone } from "./icons";
import { useToast } from "@/context/ToastContext";

interface Props {
  onClose: () => void;
  onStarted?: () => void;
}

const PRESETS = ["Discovery call", "Sales call", "Design call", "Onboarding", "Follow-up"];

export default function StartCallModal({ onClose, onStarted }: Props) {
  const [client, setClient] = useState("");
  const [description, setDescription] = useState(PRESETS[0]);
  const [busy, setBusy] = useState(false);
  const { show } = useToast();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, busy]);

  const canStart = client.trim().length > 0 && !busy;

  const start = () => {
    if (!canStart) return;
    setBusy(true);
    setTimeout(() => {
      show(`Connecting to ${client.trim()}…`, "success");
      setBusy(false);
      onStarted?.();
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !busy && onClose()}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-xl bg-surface shadow-modal anim-scale">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-soft text-accent">
              <IconPhone width={16} height={16} />
            </div>
            <h3 className="text-base font-semibold text-text">Start a new call</h3>
          </div>
          <button
            onClick={onClose}
            disabled={busy}
            aria-label="Close"
            className="text-text-soft hover:text-text disabled:opacity-40"
          >
            <IconClose width={18} height={18} />
          </button>
        </div>

        <div className="px-5 py-4 space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-soft mb-1.5">
              Client / participant
            </label>
            <input
              autoFocus
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="e.g. Acme Corp"
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-soft focus:outline-none focus:ring-2 focus:ring-primary-soft"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-soft mb-1.5">
              Type
            </label>
            <select
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary-soft"
            >
              {PRESETS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 pt-1">
            <button
              onClick={onClose}
              disabled={busy}
              className="rounded-md border border-border bg-surface px-4 py-1.5 text-sm font-medium text-text hover:bg-surface-2 transition-colors disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              onClick={start}
              disabled={!canStart}
              className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
            >
              {busy ? "Starting…" : "Start Call"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
