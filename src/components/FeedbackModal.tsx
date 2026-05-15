"use client";

import { useEffect, useState } from "react";
import { useFeedback } from "@/context/FeedbackContext";
import { IconClose, IconStar } from "./icons";

interface FeedbackModalProps {
  onClose: () => void;
}

const CATEGORIES = ["General", "Bug Report", "Feature Request", "Call Quality", "UI/UX"];

export default function FeedbackModal({ onClose }: FeedbackModalProps) {
  const { addFeedback } = useFeedback();
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  const canSubmit = rating > 0 && message.trim().length > 0;

  const submit = () => {
    if (!canSubmit) return;
    addFeedback({ rating, category, message: message.trim() });
    setSubmitted(true);
    setTimeout(onClose, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-md rounded-xl bg-surface shadow-modal anim-scale">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="text-base font-semibold text-text">Share feedback</h3>
          <button onClick={onClose} aria-label="Close" className="text-text-soft hover:text-text">
            <IconClose width={18} height={18} />
          </button>
        </div>

        {submitted ? (
          <div className="px-5 py-10 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-stat-green">
              <span className="text-success text-xl">✓</span>
            </div>
            <p className="text-sm font-medium text-text">Thanks for the feedback!</p>
            <p className="text-xs text-text-soft mt-1">Saved to your history.</p>
          </div>
        ) : (
          <div className="px-5 py-4 space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-soft mb-1.5">
                Rate your experience
              </label>
              <div className="flex gap-1 text-accent">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onMouseEnter={() => setHover(n)}
                    onMouseLeave={() => setHover(0)}
                    onClick={() => setRating(n)}
                    className="p-1 transition-transform hover:scale-110"
                  >
                    <IconStar width={22} height={22} filled={(hover || rating) >= n} />
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-soft mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary-soft"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-soft mb-1.5">
                Your feedback
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                placeholder="What's on your mind?"
                className="w-full resize-none rounded-md border border-border bg-surface px-3 py-2 text-sm text-text placeholder:text-text-soft focus:outline-none focus:ring-2 focus:ring-primary-soft"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={onClose}
                className="rounded-md border border-border bg-surface px-4 py-1.5 text-sm font-medium text-text hover:bg-surface-2 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={!canSubmit}
                className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-40 disabled:hover:bg-primary"
              >
                Submit
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
