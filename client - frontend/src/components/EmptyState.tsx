import noResultsImg from "@/assets/no-result-search.png"

export default function EmptyState({ q }: { q: string }) {
  return (
    <div className="rounded-lg border p-6 text-muted-foreground text-center max-w-md">
      {q ? (
        <div className="text-center">
          <img
            src={noResultsImg}
            alt="No notes found"
            className="mx-auto mb-6 w-[240px] select-none"
            draggable={false}
          />
          <p className="font-medium text-black mb-1">
            Oops! No notes found matching your search.
          </p>
          <p className="text-muted-foreground">
            No notes found for &quot;{q}&quot;.
          </p>
        </div>
      ) : (
        <>
          <p className="font-medium text-black mb-1">No notes yet</p>
          <p>Click the + button to add one.</p>
        </>
      )}
    </div>
  )
}