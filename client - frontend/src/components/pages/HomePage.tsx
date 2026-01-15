import { useEffect, useMemo, useState } from "react";
import { Plus, Pin, Pencil, Trash2 } from "lucide-react";
import { getNotes, type Note } from "@/services/api.note";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setError(null);
        const data = await getNotes();
        setNotes(data);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load notes");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const hasNotes = useMemo(() => notes.length > 0, [notes.length]);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b">
          <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
            <h1 className="text-xl font-semibold">Notes</h1>
          </div>
        </header>

        <main className="mx-auto max-w-6xl px-6 py-8">
          <div className="rounded-lg border p-4 text-red-600">
            {error}
            <div className="text-sm text-muted-foreground mt-2">
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">

      <header className="border-b">
        <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Notes</h1>


          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-gray-200 flex items-center justify-center text-xs font-semibold">
              TU
            </div>
            <div className="leading-tight">
              <p className="text-sm font-medium">Test User</p>
              <button className="text-xs underline text-muted-foreground">
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Cards grid */}
      <main className="mx-auto max-w-6xl px-6 py-8">
        {!hasNotes ? (
          <div className="rounded-lg border p-6 text-muted-foreground">
            No notes yet. Click the + button to add one.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((n) => {
              const tags = n.tags
                ? n.tags
                    .split(",")
                    .map((t) => t.trim())
                    .filter(Boolean)
                : [];

              return (
                <div
                  key={n.id}
                  className="rounded-lg border bg-white p-4 shadow-sm hover:shadow-md transition"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{n.title}</h3>

                      <p className="text-xs text-muted-foreground mt-1">
                        {n.isPinned ? "Pinned" : " "}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-muted-foreground">
                      <button aria-label="Pin" onClick={() => {}}>
                        <Pin className="h-4 w-4" />
                      </button>
                      <button aria-label="Edit" onClick={() => {}}>
                        <Pencil className="h-4 w-4" />
                      </button>
                      <button aria-label="Delete" onClick={() => {}}>
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mt-3">
                    {n.content}
                  </p>

                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((t) => (
                        <span key={t} className="text-xs text-muted-foreground">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* Floating Add Button */}
      <button
        className="fixed bottom-8 right-8 h-14 w-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg hover:shadow-xl transition"
        aria-label="Add note"
        onClick={() => {}}
      >
        <Plus className="h-6 w-6" />
      </button>
    </div>
  );
}
