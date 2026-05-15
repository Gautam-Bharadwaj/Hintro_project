"use client";

import { useUser } from "@/context/UserContext";

export default function LoggedOutScreen() {
  const { setLoggedOut, userId, setUserId } = useUser();
  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-2 p-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-surface p-6 shadow-card text-center">
        <h2 className="text-lg font-semibold text-text">You&apos;ve logged out</h2>
        <p className="mt-1.5 text-sm text-text-soft">
          Log back in to continue your meetings with Hintro.
        </p>
        <button
          onClick={() => {
            setUserId(userId);
            setLoggedOut(false);
          }}
          className="mt-5 w-full rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors"
        >
          Log back in
        </button>
      </div>
    </div>
  );
}
