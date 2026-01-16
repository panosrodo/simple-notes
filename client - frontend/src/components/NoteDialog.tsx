import { Plus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
  DialogDescription,
} from "@/components/ui/dialog"

type Mode = "create" | "edit"

type Props = {
  open: boolean
  onOpenChange: (v: boolean) => void
  mode: Mode

  title: string
  content: string
  tagInput: string
  tags: string[]
  submitting: boolean

  onTitleChange: (v: string) => void
  onContentChange: (v: string) => void
  onTagInputChange: (v: string) => void
  onAddTag: () => void
  onRemoveTag: (tag: string) => void
  onSubmit: () => void
}

export default function NoteDialog({
  open,
  onOpenChange,
  mode,
  title,
  content,
  tagInput,
  tags,
  submitting,
  onTitleChange,
  onContentChange,
  onTagInputChange,
  onAddTag,
  onRemoveTag,
  onSubmit,
}: Props) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[720px]">
        <DialogHeader>
          <DialogTitle className="text-xs font-semibold tracking-wide text-muted-foreground">
            {mode === "create" ? "ADD NOTE" : "EDIT NOTE"}
          </DialogTitle>

          <DialogDescription className="sr-only">
            Create or edit a note.
          </DialogDescription>

          <DialogClose className="absolute right-4 top-4 opacity-70 hover:opacity-100">
            <X className="h-4 w-4" />
          </DialogClose>
        </DialogHeader>

        <div className="space-y-5 min-w-0">
          {/* TITLE */}
          <div className="space-y-2 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground">TITLE</p>
            <Input
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Title"
              className="h-11 min-w-0 truncate"
            />
          </div>

          {/* CONTENT */}
          <div className="space-y-2 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground">CONTENT</p>
            <Textarea
              value={content}
              onChange={(e) => onContentChange(e.target.value)}
              placeholder="Content"
              className="min-h-[220px] resize-none min-w-0 [overflow-wrap:anywhere] break-words"
            />
          </div>

          {/* TAGS */}
          <div className="space-y-2 min-w-0">
            <p className="text-xs font-semibold text-muted-foreground">TAGS</p>

            <div className="flex gap-2 min-w-0">
              <Input
                value={tagInput}
                onChange={(e) => onTagInputChange(e.target.value)}
                placeholder="Add tags"
                className="min-w-0"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    onAddTag()
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                className="h-10 w-10 p-0 text-blue-600 hover:text-blue-700 shrink-0"
                onClick={onAddTag}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 pt-1 min-w-0">
                {tags.map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => onRemoveTag(t)}
                    className="text-xs px-2 py-1 rounded-md border text-muted-foreground hover:text-black max-w-[180px] truncate"
                    title={`#${t}`}
                  >
                    #{t}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Button
            className="w-full h-11 text-sm font-semibold bg-blue-600 text-white hover:bg-blue-700"
            onClick={onSubmit}
            disabled={submitting}
          >
            {submitting ? "SAVING..." : mode === "create" ? "ADD" : "SAVE"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}