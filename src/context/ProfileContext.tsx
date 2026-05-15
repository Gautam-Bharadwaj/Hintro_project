"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

export interface ProfileOverride {
  firstName?: string;
  lastName?: string;
  photo?: string;
}

interface ProfileContextValue {
  override: ProfileOverride;
  setOverride: (next: ProfileOverride) => void;
  clearOverride: () => void;
}

const ProfileContext = createContext<ProfileContextValue | null>(null);
const storageKey = (uid: string) => `hintro.profile.${uid}`;

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useUser();
  const [override, setOverrideState] = useState<ProfileOverride>({});

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(storageKey(userId));
    setOverrideState(raw ? (JSON.parse(raw) as ProfileOverride) : {});
  }, [userId]);

  const setOverride = useCallback(
    (next: ProfileOverride) => {
      setOverrideState(next);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey(userId), JSON.stringify(next));
      }
    },
    [userId],
  );

  const clearOverride = useCallback(() => {
    setOverrideState({});
    if (typeof window !== "undefined") localStorage.removeItem(storageKey(userId));
  }, [userId]);

  return (
    <ProfileContext.Provider value={{ override, setOverride, clearOverride }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used within ProfileProvider");
  return ctx;
}
