import type {
  CallSessionsResponse,
  CallStats,
  DashboardResponse,
  UserId,
  UserProfile,
} from "./types";

const BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "https://mock-backend-hintro.vercel.app";

async function request<T>(path: string, userId: UserId): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { "x-user-id": userId },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`API ${path} failed: ${res.status}`);
  return res.json() as Promise<T>;
}

export const api = {
  profile: (uid: UserId) => request<UserProfile>("/api/auth/profile", uid),
  dashboard: (uid: UserId) => request<DashboardResponse>("/api/auth/dashboard", uid),
  stats: (uid: UserId) => request<CallStats>("/api/call-sessions/stats", uid),
  sessions: (uid: UserId, limit = 10) =>
    request<CallSessionsResponse>(`/api/call-sessions?limit=${limit}`, uid),
};
