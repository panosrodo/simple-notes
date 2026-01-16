import type { RegisterFields } from "@/schemas/register";

const API_URL = import.meta.env.VITE_API_URL;

export async function register({ name, email, password }: RegisterFields): Promise<void> {
  const res = await fetch(`${API_URL}/Auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: name, // mapping: Name -> username
      email,
      password,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Registration failed");
  }
}