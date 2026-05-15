"use client";

import { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import { IconClose } from "./icons";
import { useProfile } from "@/context/ProfileContext";
import { useToast } from "@/context/ToastContext";
import { resizeImageFile } from "@/lib/image";

interface Props {
  onClose: () => void;
  defaultFirstName: string;
  defaultLastName: string;
}

export default function ProfileModal({
  onClose,
  defaultFirstName,
  defaultLastName,
}: Props) {
  const { override, setOverride, clearOverride } = useProfile();
  const { show } = useToast();
  const fileRef = useRef<HTMLInputElement | null>(null);

  const [firstName, setFirstName] = useState(override.firstName ?? defaultFirstName);
  const [lastName, setLastName] = useState(override.lastName ?? defaultLastName);
  const [photo, setPhoto] = useState<string | undefined>(override.photo);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && !busy && onClose();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose, busy]);

  const handleFile = async (file: File | null) => {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      show("Please choose an image file", "error");
      return;
    }
    setBusy(true);
    try {
      const dataUrl = await resizeImageFile(file, 320);
      setPhoto(dataUrl);
    } catch {
      show("Could not load image", "error");
    } finally {
      setBusy(false);
    }
  };

  const save = () => {
    setOverride({
      firstName: firstName.trim() || undefined,
      lastName: lastName.trim() || undefined,
      photo,
    });
    show("Profile saved", "success");
    onClose();
  };

  const reset = () => {
    clearOverride();
    setFirstName(defaultFirstName);
    setLastName(defaultLastName);
    setPhoto(undefined);
    show("Profile reset");
  };

  const fullName = `${firstName || defaultFirstName} ${lastName || defaultLastName}`.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 anim-fade">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={() => !busy && onClose()}
        aria-hidden
      />
      <div className="relative w-full max-w-md rounded-xl bg-surface shadow-modal anim-scale">
        <div className="flex items-center justify-between border-b border-border px-5 py-3.5">
          <h3 className="text-base font-semibold text-text">Edit profile</h3>
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
          <div className="flex items-center gap-4">
            <Avatar name={fullName} size={64} src={photo} />
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => fileRef.current?.click()}
                disabled={busy}
                className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text hover:bg-surface-2 transition-colors disabled:opacity-40"
              >
                {photo ? "Change photo" : "Upload photo"}
              </button>
              {photo && (
                <button
                  onClick={() => setPhoto(undefined)}
                  className="rounded-md border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text hover:bg-surface-2 transition-colors"
                >
                  Remove
                </button>
              )}
              <input
                ref={fileRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-soft mb-1.5">
                First name
              </label>
              <input
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary-soft"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-text-soft mb-1.5">
                Last name
              </label>
              <input
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full rounded-md border border-border bg-surface px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary-soft"
              />
            </div>
          </div>

          <p className="text-[11px] text-text-soft">
            Saved locally to this device. Switching to another user shows their own
            profile.
          </p>

          <div className="flex items-center justify-between pt-1">
            <button
              onClick={reset}
              className="text-xs text-text-soft hover:text-text underline-offset-2 hover:underline"
            >
              Reset to default
            </button>
            <div className="flex gap-2">
              <button
                onClick={onClose}
                disabled={busy}
                className="rounded-md border border-border bg-surface px-4 py-1.5 text-sm font-medium text-text hover:bg-surface-2 transition-colors disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                onClick={save}
                disabled={busy}
                className="rounded-md bg-primary px-4 py-1.5 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
