import { useEffect, useMemo, useState } from "react"
import { useSearchParams } from "react-router"
import { toast } from "sonner"

import {
  getNotes,
  createNote,
  updateNote,
  deleteNote,
  type Note,
} from "@/services/api.note"

import EmptyState from "@/components/EmptyState"
import NotesGrid from "@/components/NotesGrid"
import FloatingAddButton from "@/components/FloatingAddButton"
import NoteDialog from "@/components/NoteDialog"
import DeleteNoteDialog from "@/components/DeleteNoteDialog"

type Mode = "create" | "edit"

export default function HomePage() {
  const [notes, setNotes] = useState<Note[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchParams] = useSearchParams()
  const q = (searchParams.get("q") ?? "").trim().toLowerCase()

  const [open, setOpen] = useState(false)
  const [mode, setMode] = useState<Mode>("create")
  const [editingId, setEditingId] = useState<number | null>(null)

  const [deleteOpen, setDeleteOpen] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)

  // form state (μένει εδώ για να είναι “controlled” από το container)
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tagInput, setTagInput] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadNotes()
  }, [])

  async function loadNotes() {
    try {
      setLoading(true)
      setError(null)
      const data = await getNotes()
      setNotes(data)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load notes")
    } finally {
      setLoading(false)
    }
  }

  const filteredNotes = useMemo(() => {
    const base = (() => {
      if (!q) return notes
      return notes.filter((n) => {
        const haystack = [n.title, n.content, n.tags ?? ""]
          .join(" ")
          .toLowerCase()
        return haystack.includes(q)
      })
    })()

    return [...base].sort((a, b) => Number(b.isPinned) - Number(a.isPinned))
  }, [notes, q])

  const hasNotes = filteredNotes.length > 0

  function resetForm() {
    setTitle("")
    setContent("")
    setTagInput("")
    setTags([])
    setEditingId(null)
    setMode("create")
  }

  function setFormFromNote(n: Note) {
    setTitle(n.title ?? "")
    setContent(n.content ?? "")
    const parsed = n.tags
      ? n.tags.split(",").map((t) => t.trim()).filter(Boolean)
      : []
    setTags(parsed)
    setTagInput("")
  }

  function addTag() {
    const t = tagInput.trim()
    if (!t) return
    if (tags.some((x) => x.toLowerCase() === t.toLowerCase())) {
      setTagInput("")
      return
    }
    setTags((prev) => [...prev, t])
    setTagInput("")
  }

  function removeTag(tag: string) {
    setTags((prev) => prev.filter((t) => t !== tag))
  }

  function openCreate() {
    setMode("create")
    resetForm()
    setOpen(true)
  }

  function openEdit(n: Note) {
    setMode("edit")
    setEditingId(n.id)
    setFormFromNote(n)
    setOpen(true)
  }

  async function onSubmit() {
    if (!title.trim()) {
      toast.error("Title is required")
      return
    }
    if (!content.trim()) {
      toast.error("Content is required")
      return
    }

    setSubmitting(true)
    try {
      const payload = {
        title: title.trim(),
        content: content.trim(),
        tags: tags.length ? tags.join(",") : null,
      }

      if (mode === "create") {
        const created = await createNote({ ...payload, isPinned: false })
        if (created) setNotes((prev) => [created, ...prev])
        else await loadNotes()
        toast.success("Note added")
      } else {
        if (editingId == null) throw new Error("Missing note id for edit")
        const updated = await updateNote(editingId, payload)
        if (updated) {
          setNotes((prev) => prev.map((x) => (x.id === updated.id ? updated : x)))
        } else {
          await loadNotes()
        }
        toast.success("Note updated")
      }

      setOpen(false)
      resetForm()
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Request failed")
    } finally {
      setSubmitting(false)
    }
  }

  async function togglePin(n: Note) {
    const nextPinned = !n.isPinned

    setNotes((prev) =>
      prev.map((x) => (x.id === n.id ? { ...x, isPinned: nextPinned } : x))
    )

    try {
      await updateNote(n.id, {
        title: n.title,
        content: n.content,
        tags: n.tags ?? null,
        isPinned: nextPinned,
      })
      toast.success("Note updated")
    } catch (e) {
      setNotes((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, isPinned: n.isPinned } : x))
      )
      toast.error(e instanceof Error ? e.message : "Failed to pin note")
    }
  }

  function askDelete(id: number) {
    setDeletingId(id)
    setDeleteOpen(true)
  }

  async function confirmDelete() {
    if (deletingId == null) return
    const id = deletingId

    const before = notes
    setNotes((prev) => prev.filter((n) => n.id !== id))

    try {
      await deleteNote(id)
      toast.success("Note deleted")
    } catch (e) {
      setNotes(before)
      toast.error(e instanceof Error ? e.message : "Failed to delete note")
    } finally {
      setDeleteOpen(false)
      setDeletingId(null)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="rounded-lg border p-6 text-red-600 max-w-md text-center">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white relative">
      <main
        className={
          hasNotes
            ? "mx-auto max-w-6xl px-6 py-8"
            : "mx-auto max-w-6xl px-6 min-h-[70vh] flex items-center justify-center"
        }
      >
        {!hasNotes ? (
          <EmptyState q={q} />
        ) : (
          <NotesGrid
            notes={filteredNotes}
            onTogglePin={togglePin}
            onEdit={openEdit}
            onDelete={askDelete}
          />
        )}
      </main>

      <FloatingAddButton onClick={openCreate} />

      <NoteDialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v)
          if (!v) resetForm()
        }}
        mode={mode}
        title={title}
        content={content}
        tagInput={tagInput}
        tags={tags}
        submitting={submitting}
        onTitleChange={setTitle}
        onContentChange={setContent}
        onTagInputChange={setTagInput}
        onAddTag={addTag}
        onRemoveTag={removeTag}
        onSubmit={onSubmit}
      />

      <DeleteNoteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        onConfirm={confirmDelete}
      />
    </div>
  )
}