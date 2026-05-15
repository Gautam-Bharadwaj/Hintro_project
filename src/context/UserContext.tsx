"use client";

import { createContext, useContext, useEffect, useState } from "react";
import type { UserId } from "@/lib/types";

interface UserContextValue {
  userId: UserId;
  setUserId: (id: UserId) => void;
  loggedOut: boolean;
  setLoggedOut: (v: boolean) => void;
}

const STORAGE_KEY = "hintro.userId";

const UserContext = createContext<UserContextValue | null>(null);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [userId, setUserIdState] = useState<UserId>("u1");
  const [loggedOut, setLoggedOut] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (stored === "u1" || stored === "u2") setUserIdState(stored);
    setHydrated(true);
  }, []);

  const setUserId = (id: UserId) => {
    setUserIdState(id);
    if (typeof window !== "undefined") localStorage.setItem(STORAGE_KEY, id);
    setLoggedOut(false);
  };

  return (
    <UserContext.Provider value={{ userId, setUserId, loggedOut, setLoggedOut }}>
      {hydrated ? children : null}
    </UserContext.Provider>
  );
}

export function useUser() {
  const ctx = useContext(UserContext);
  if (!ctx) throw new Error("useUser must be used within UserProvider");
  return ctx;
}
