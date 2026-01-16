import { Input } from "@/components/ui/input"
import { Search, X } from "lucide-react"
import { useEffect, useState } from "react"
import { useLocation, useSearchParams } from "react-router"
import { AuthButton } from "../AuthButton"

const Header = () => {
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()

  const qFromUrl = searchParams.get("q") ?? ""
  const [q, setQ] = useState(qFromUrl)

  useEffect(() => {
    setQ(qFromUrl)
  }, [qFromUrl])

  const showSearch = location.pathname.includes("notes")

  function onChange(value: string) {
    setQ(value)

    const next = new URLSearchParams(searchParams)
    if (value.trim()) next.set("q", value)
    else next.delete("q")

    setSearchParams(next, { replace: true })
  }

  return (
    <header className="bg-white drop-shadow">
      <div className="relative flex items-center px-6 py-3">
        {/* Left */}
        <h2 className="text-xl font-medium text-black whitespace-nowrap">
          Simple Notes
        </h2>

        {/* Center */}
        {showSearch && (
          <div className="absolute left-1/2 -translate-x-1/2 w-[360px]">
            <div className="relative">
              <Input
                value={q}
                onChange={(e) => onChange(e.target.value)}
                placeholder="Search notes..."
                className="h-11 rounded-full bg-muted/40 pl-4 pr-20 shadow-sm"
              />

              {/* Clear (X) */}
              {q.trim().length > 0 && (
                <button
                  type="button"
                  onClick={() => onChange("")}
                  className="absolute right-10 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-black"
                  aria-label="Clear search"
                  title="Clear"
                >
                  <X className="h-4 w-4" />
                </button>
              )}

              {/* Search icon right */}
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                <Search className="h-4 w-4" />
              </div>
            </div>
          </div>
        )}

        {/* Right */}
        <div className="ml-auto">
          <AuthButton />
        </div>
      </div>
    </header>
  )
}

export default Header