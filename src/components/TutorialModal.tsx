"use client";

import { useEffect } from "react";
import { IconClose } from "./icons";

interface Props {
  onClose: () => void;
}

export default function TutorialModal({ onClose }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} aria-hidden />
      <div className="relative w-full max-w-2xl rounded-xl bg-surface shadow-modal anim-scale overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="text-base font-semibold text-text">Welcome to Hintro</h3>
          <button onClick={onClose} aria-label="Close" className="text-text-soft hover:text-text">
            <IconClose width={18} height={18} />
          </button>
        </div>
        <div className="relative aspect-video w-full bg-black">
          <video
            src="/demo_video.mov"
            controls
            autoPlay
            className="h-full w-full object-contain"
          >
            Your browser does not support the video tag.
          </video>
        </div>
        <div className="px-5 py-4 text-sm text-text-soft">
          Make your next call smarter — start a call from the dashboard, review insights,
          and let AI summarize the rest.
        </div>
      </div>
    </div>
  );
}
