"use client";

import { useEffect } from "react";
import { useUser } from "@/context/UserContext";

interface LogoutModalProps {
  onClose: () => void;
}

export default function LogoutModal({ onClose }: LogoutModalProps) {
  const { setLoggedOut } = useUser();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-sm rounded-xl bg-surface p-5 shadow-modal anim-scale">
        <h3 className="text-base font-semibold text-text">Leaving already?</h3>
        <p className="mt-1.5 text-sm text-text-soft">
          You can log back in anytime to continue your meetings with Hintro.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-border bg-surface px-4 py-1.5 text-sm font-medium text-text hover:bg-surface-2 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => {
              setLoggedOut(true);
              onClose();
            }}
            className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
          >
            Log out
          </button>
        </div>
      </div>
    </div>
  );
}
