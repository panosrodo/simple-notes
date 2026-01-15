const API_URL = import.meta.env.VITE_API_URL;

export type LoginFields = {
  email: string;
  password: string;
};

export type RegisterFields = {
  email: string;
  password: string;
};

export type AuthResponse = {
  token: string;
};

export async function login(data: LoginFields): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/Auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let detail = "Login failed";
    try {
      const err = await res.json();
      if (typeof err?.message === "string") detail = err.message;
    } catch {}
    throw new Error(detail);
  }

  const json = (await res.json()) as AuthResponse;

  // αποθήκευση token
  localStorage.setItem("token", json.token);

  return json;
}

export async function register(data: RegisterFields): Promise<AuthResponse> {
  const res = await fetch(`${API_URL}/api/Auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let detail = "Register failed";
    try {
      const err = await res.json();
      if (typeof err?.message === "string") detail = err.message;
    } catch {}
    throw new Error(detail);
  }

  const json = (await res.json()) as AuthResponse;
  localStorage.setItem("token", json.token);
  return json;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}
