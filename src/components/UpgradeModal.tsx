"use client";

import { useEffect } from "react";
import { IconClose } from "./icons";
import { useToast } from "@/context/ToastContext";
import type { DashboardResponse } from "@/lib/types";

interface Props {
  onClose: () => void;
  dashboard?: DashboardResponse | null;
}

const PLANS = [
  {
    id: "free",
    name: "Free",
    price: "$0",
    period: "/mo",
    features: ["10 calls / month", "Basic transcripts", "Email support"],
  },
  {
    id: "professional",
    name: "Professional",
    price: "$19",
    period: "/mo",
    features: ["Unlimited calls", "AI insights", "Priority support"],
    highlight: true,
  },
  {
    id: "team",
    name: "Team",
    price: "$49",
    period: "/mo",
    features: ["Everything in Pro", "Team workspace", "SSO + admin tools"],
  },
];

export default function UpgradeModal({ onClose, dashboard }: Props) {
  const { show } = useToast();
  const currentPlan = dashboard?.subscription?.plan ?? "free";

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-2xl rounded-xl bg-surface shadow-modal anim-scale">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <div>
            <h3 className="text-base font-semibold text-text">Upgrade your plan</h3>
            <p className="text-xs text-text-soft mt-0.5">
              Current plan:{" "}
              <span className="font-medium text-text capitalize">{currentPlan}</span>
            </p>
          </div>
          <button onClick={onClose} aria-label="Close" className="text-text-soft hover:text-text">
            <IconClose width={18} height={18} />
          </button>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-3">
          {PLANS.map((p) => {
            const isCurrent = p.id === currentPlan;
            return (
              <div
                key={p.id}
                className={`rounded-lg border p-4 transition-shadow ${
                  p.highlight
                    ? "border-accent shadow-card"
                    : "border-border"
                }`}
              >
                <p className="text-sm font-semibold text-text">{p.name}</p>
                <p className="mt-1 text-2xl font-bold text-text">
                  {p.price}
                  <span className="text-sm font-normal text-text-soft">{p.period}</span>
                </p>
                <ul className="mt-3 space-y-1.5 text-xs text-text-soft">
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-1.5">
                      <span className="text-success">✓</span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  disabled={isCurrent}
                  onClick={() => {
                    show(`Upgrading to ${p.name}…`, "success");
                    onClose();
                  }}
                  className={`mt-4 w-full rounded-md py-1.5 text-sm font-medium transition-colors ${
                    isCurrent
                      ? "bg-muted text-text-soft cursor-not-allowed"
                      : p.highlight
                        ? "bg-primary text-white hover:bg-primary-hover"
                        : "border border-border text-text hover:bg-surface-2"
                  }`}
                >
                  {isCurrent ? "Current Plan" : "Choose"}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
