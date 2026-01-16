import { getCookie } from "@/utils/cookies"

const API_URL = import.meta.env.VITE_API_URL

export type Note = {
  id: number
  title: string
  content: string
  tags?: string | null
  isPinned: boolean
}

export type CreateNotePayload = {
  title: string
  content: string
  tags?: string | null
  isPinned?: boolean
}

export type UpdateNotePayload = Partial<CreateNotePayload>

function authHeaders() {
  const token = getCookie("access_token")

  if (!token) {
    throw new Error("No auth token found. Please login.")
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  }
}

// ✅ Helper: ασφαλές parsing (αν backend γυρίσει άδειο body / 204 / plain text)
async function parseJsonSafe<T>(res: Response): Promise<T | null> {
  const text = await res.text()
  if (!text) return null
  try {
    return JSON.parse(text) as T
  } catch {
    // αν δεν είναι JSON, γύρνα null για να το χειριστούμε από έξω
    return null
  }
}

// GET /api/Note
export async function getNotes(): Promise<Note[]> {
  const res = await fetch(`${API_URL}/Note`, {
    method: "GET",
    headers: authHeaders(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to fetch notes")
  }

  const data = await parseJsonSafe<Note[]>(res)
  if (!data) return []
  return data
}

// GET /api/Note/{id}
export async function getNote(id: number): Promise<Note> {
  const res = await fetch(`${API_URL}/Note/${id}`, {
    method: "GET",
    headers: authHeaders(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to fetch note")
  }

  const data = await parseJsonSafe<Note>(res)
  if (!data) throw new Error("Server returned empty response for note.")
  return data
}

// POST /api/Note
export async function createNote(data: CreateNotePayload): Promise<Note | null> {
  const res = await fetch(`${API_URL}/Note`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to create note")
  }

  // ✅ Αν backend δεν επιστρέφει JSON, δεν σκάμε
  return await parseJsonSafe<Note>(res)
}

// PUT /api/Note/{id}
export async function updateNote(
  id: number,
  data: UpdateNotePayload
): Promise<Note | null> {
  const res = await fetch(`${API_URL}/Note/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to update note")
  }

  // ✅ Αν backend δεν επιστρέφει JSON, δεν σκάμε
  return await parseJsonSafe<Note>(res)
}

// DELETE /api/Note/{id}
export async function deleteNote(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/Note/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || "Failed to delete note")
  }
}