import { Pin, Pencil, Trash2 } from "lucide-react"
import type { Note } from "@/services/api.note"

type Props = {
  note: Note
  onTogglePin: () => void
  onEdit: () => void
  onDelete: () => void
}

export default function NoteCard({ note: n, onTogglePin, onEdit, onDelete }: Props) {
  const tagList = n.tags ? n.tags.split(",").map((t) => t.trim()).filter(Boolean) : []

  return (
    <div className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition">
      <div className="flex items-start justify-between gap-3">
        {/* IMPORTANT: min-w-0 + flex-1 so truncate works in flex row */}
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold truncate" title={n.title ?? ""}>
            {n.title}
          </h3>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            aria-label="Pin"
            onClick={onTogglePin}
            className="text-blue-600 hover:text-blue-700"
            title="Pin"
          >
            <Pin className={`h-4 w-4 ${n.isPinned ? "fill-current" : "fill-transparent"}`} />
          </button>

          <button
            aria-label="Edit"
            onClick={onEdit}
            className="text-green-600 hover:text-green-700"
            title="Edit"
          >
            <Pencil className="h-4 w-4" />
          </button>

          <button
            aria-label="Delete"
            onClick={onDelete}
            className="text-red-600 hover:text-red-700"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Content: breaks safely even for long strings/urls without "breaking everything" */}
      <p className="text-sm text-muted-foreground mt-3 [overflow-wrap:anywhere]">
        {n.content}
      </p>

      {tagList.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2 min-w-0">
          {tagList.map((t) => (
            <span
              key={t}
              className="text-xs text-muted-foreground max-w-[140px] truncate"
              title={`#${t}`}
            >
              #{t}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}