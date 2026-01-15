import { getCookie } from "@/utils/cookies";

const API_URL = import.meta.env.VITE_API_URL;

export type Note = {
  id: number;
  title: string;
  content: string;
  tags?: string | null;
  isPinned: boolean;
};

export type CreateNotePayload = {
  title: string;
  content: string;
  tags?: string | null;
  isPinned?: boolean;
};

export type UpdateNotePayload = Partial<CreateNotePayload>;

function authHeaders() {
  const token = getCookie("access_token");

  if (!token) {
    throw new Error("No auth token found. Please login.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

// GET /api/Note
export async function getNotes(): Promise<Note[]> {
  const res = await fetch(`${API_URL}/Note`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch notes");
  }

  return await res.json();
}

// GET /api/Note/{id}
export async function getNote(id: number): Promise<Note> {
  const res = await fetch(`${API_URL}/Note/${id}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to fetch note");
  }

  return await res.json();
}

// POST /api/Note
export async function createNote(
  data: CreateNotePayload
): Promise<Note> {
  const res = await fetch(`${API_URL}/Note`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to create note");
  }

  return await res.json();
}

// PUT /api/Note/{id}
export async function updateNote(
  id: number,
  data: UpdateNotePayload
): Promise<Note> {
  const res = await fetch(`${API_URL}/Note/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to update note");
  }

  return await res.json();
}

// DELETE /api/Note/{id}
export async function deleteNote(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/Note/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Failed to delete note");
  }
}