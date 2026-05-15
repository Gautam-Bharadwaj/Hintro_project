"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useUser } from "./UserContext";

export interface FeedbackEntry {
  id: string;
  rating: number;
  category: string;
  message: string;
  createdAt: string;
  userId: string;
}

interface FeedbackContextValue {
  entries: FeedbackEntry[];
  addFeedback: (data: Omit<FeedbackEntry, "id" | "createdAt" | "userId">) => void;
  removeFeedback: (id: string) => void;
}

const FeedbackContext = createContext<FeedbackContextValue | null>(null);

const storageKey = (userId: string) => `hintro.feedback.${userId}`;

export function FeedbackProvider({ children }: { children: React.ReactNode }) {
  const { userId } = useUser();
  const [entries, setEntries] = useState<FeedbackEntry[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const raw = localStorage.getItem(storageKey(userId));
    setEntries(raw ? (JSON.parse(raw) as FeedbackEntry[]) : []);
  }, [userId]);

  const persist = useCallback(
    (next: FeedbackEntry[]) => {
      setEntries(next);
      if (typeof window !== "undefined") {
        localStorage.setItem(storageKey(userId), JSON.stringify(next));
      }
    },
    [userId],
  );

  const addFeedback: FeedbackContextValue["addFeedback"] = (data) => {
    const entry: FeedbackEntry = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      userId,
    };
    persist([entry, ...entries]);
  };

  const removeFeedback = (id: string) => persist(entries.filter((e) => e.id !== id));

  return (
    <FeedbackContext.Provider value={{ entries, addFeedback, removeFeedback }}>
      {children}
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const ctx = useContext(FeedbackContext);
  if (!ctx) throw new Error("useFeedback must be used within FeedbackProvider");
  return ctx;
}
