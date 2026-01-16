import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FloatingAddButton({ onClick }: { onClick: () => void }) {
  return (
    <Button
      onClick={onClick}
      className="
        fixed bottom-8 right-8
        h-14 w-14 rounded-2xl p-0
        bg-blue-600 text-white
        shadow-lg hover:bg-blue-700 hover:shadow-xl
      "
      aria-label="Add note"
    >
      <Plus className="h-6 w-6" />
    </Button>
  )
}