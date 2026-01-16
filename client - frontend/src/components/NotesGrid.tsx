import type { Note } from "@/services/api.note"
import NoteCard from "./NoteCard"

type Props = {
  notes: Note[]
  onTogglePin: (note: Note) => void
  onEdit: (note: Note) => void
  onDelete: (id: number) => void
}

export default function NotesGrid({ notes, onTogglePin, onEdit, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {notes.map((n) => (
        <NoteCard
          key={n.id}
          note={n}
          onTogglePin={() => onTogglePin(n)}
          onEdit={() => onEdit(n)}
          onDelete={() => onDelete(n.id)}
        />
      ))}
    </div>
  )
}