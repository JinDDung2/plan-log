const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000";

export class ApiError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...init?.headers },
  });

  if (!res.ok) {
    throw new ApiError(res.status, await res.text());
  }
  if (res.status === 204) {
    return undefined as T;
  }
  return (await res.json()) as T;
}

// access token이 만료(401)되면 /auth/refresh를 한 번 시도한 뒤 원래 요청을 재시도한다.
// refresh도 실패하면 원래의 401을 그대로 던진다(재로그인 필요).
export async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  try {
    return await request<T>(path, init);
  } catch (err) {
    if (err instanceof ApiError && err.status === 401 && path !== "/auth/refresh") {
      try {
        await request("/auth/refresh", { method: "POST" });
      } catch {
        throw err;
      }
      return request<T>(path, init);
    }
    throw err;
  }
}

export function loginUrl(provider: "google" | "kakao"): string {
  return `${API_BASE_URL}/auth/${provider}`;
}
