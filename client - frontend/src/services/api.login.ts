import type { LoginFields } from "@/schemas/login";

const API_URL = import.meta.env.VITE_API_URL;

export type LoginResponse = {
  token: string;
};

export async function login({ username, password }: LoginFields): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Login failed");
  }

  const data = (await res.json()) as any;
  const token = data?.token ?? data?.accessToken ?? data?.access_token;

  if (typeof token !== "string") {
    throw new Error("Login succeeded but token was missing in response");
  }

  return { token };
}