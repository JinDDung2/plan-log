import { apiFetch, ApiError } from "./api";

export interface AuthUser {
  id: number;
  email: string;
  name: string;
  picture: string | null;
  startHour: number;
  endHour: number;
}

export async function fetchMe(): Promise<AuthUser | null> {
  try {
    return await apiFetch<AuthUser>("/me");
  } catch (err) {
    if (err instanceof ApiError && err.status === 401) {
      return null;
    }
    throw err;
  }
}

export async function logout(): Promise<void> {
  await apiFetch("/auth/logout", { method: "POST" });
}

export async function updateUserSettings(
  startHour: number,
  endHour: number
): Promise<{ startHour: number; endHour: number }> {
  return apiFetch<{ startHour: number; endHour: number }>("/me/settings", {
    method: "PUT",
    body: JSON.stringify({ startHour, endHour }),
  });
}
