"use client";

import { useEffect } from "react";
import { useFeedback } from "@/context/FeedbackContext";
import { IconClose, IconStar, IconTrash } from "./icons";
import { formatRelativeTime } from "@/lib/format";

interface Props {
  onClose: () => void;
}

export default function FeedbackHistoryModal({ onClose }: Props) {
  const { entries, removeFeedback } = useFeedback();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-lg rounded-xl bg-surface shadow-modal anim-scale">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="text-base font-semibold text-text">Feedback history</h3>
          <button
            onClick={onClose}
            aria-label="Close"
            className="text-text-soft hover:text-text"
          >
            <IconClose width={18} height={18} />
          </button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto scrollbar-thin px-5 py-3">
          {entries.length === 0 ? (
            <div className="py-12 text-center text-sm text-text-soft">
              No feedback yet. Share your thoughts via the Feedback option.
            </div>
          ) : (
            <ul className="space-y-3">
              {entries.map((e) => (
                <li
                  key={e.id}
                  className="rounded-lg border border-border bg-surface-2 p-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <div className="flex text-accent">
                          {[1, 2, 3, 4, 5].map((n) => (
                            <IconStar
                              key={n}
                              width={14}
                              height={14}
                              filled={e.rating >= n}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-text-soft">·</span>
                        <span className="text-xs font-medium text-text">
                          {e.category}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-text break-words">{e.message}</p>
                      <p className="mt-2 text-[11px] text-text-soft">
                        {formatRelativeTime(e.createdAt)}
                      </p>
                    </div>
                    <button
                      onClick={() => removeFeedback(e.id)}
                      aria-label="Delete"
                      className="text-text-soft hover:text-danger p-1"
                    >
                      <IconTrash width={15} height={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
