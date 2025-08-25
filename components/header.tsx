"use client"

import { Moon, Sun, Users } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"

interface HeaderProps {
  selectedCount: number
  onFinalizeTeam: () => void
}

export function Header({ selectedCount, onFinalizeTeam }: HeaderProps) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-semibold">HireSmart</h1>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm">
            <span>Selected:</span>
            <span className="font-medium">{selectedCount}/5</span>
          </div>

          {selectedCount === 5 && (
            <Button onClick={onFinalizeTeam} className="bg-green-600 hover:bg-green-700">
              Finalize Team
            </Button>
          )}

          <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
            <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
            <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            <span className="sr-only">Toggle theme</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
