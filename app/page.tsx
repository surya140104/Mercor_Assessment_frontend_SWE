"use client"

import { useState, useMemo, useDeferredValue } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { FiltersSidebar } from "@/components/filters-sidebar"
import { CandidateCard } from "@/components/candidate-card"
import { SelectionStats } from "@/components/selection-stats"
import { useToast } from "@/hooks/use-toast"
import { useTeamSelection } from "@/hooks/use-team-selection"
import { Toaster } from "@/components/ui/toaster"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import type { FilterState } from "@/types/candidate"
import { mockCandidates, getExperienceRange } from "@/data/candidates"

export default function HomePage() {
  const router = useRouter()
  const { toast } = useToast()
  const {
    selectedCandidates,
    isLoading,
    addCandidate,
    removeCandidate,
    clearSelection,
    isSelected,
    isDisabled,
    canFinalize,
    getSelectionStats,
  } = useTeamSelection()

  const [filters, setFilters] = useState<FilterState>({
    skills: [],
    gender: [],
    location: "",
    experienceRange: getExperienceRange(),
    searchQuery: "",
  })

  // Use deferred value for smoother updates with large lists
  const deferredFilters = useDeferredValue(filters)

  const filteredCandidates = useMemo(() => {
    const f = deferredFilters
    return mockCandidates.filter((candidate) => {
      // Search query filter
      if (f.searchQuery && !candidate.name.toLowerCase().includes(f.searchQuery.toLowerCase())) {
        return false
      }

      // Skills filter
      if (f.skills.length > 0 && !f.skills.some((skill) => candidate.skills.includes(skill))) {
        return false
      }

      // Gender filter
      if (f.gender.length > 0 && !f.gender.includes(candidate.gender)) {
        return false
      }

      // Location filter (empty means all)
      if (f.location && candidate.location !== f.location) {
        return false
      }

      // Experience range filter
      if (candidate.experience < f.experienceRange[0] || candidate.experience > f.experienceRange[1]) {
        return false
      }

      return true
    })
  }, [deferredFilters])

  const handleSelectCandidate = (candidate: any) => {
    const result = addCandidate(candidate)
    toast({
      title: result.success ? "Candidate Added" : "Selection Failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    })
  }

  const handleRemoveCandidate = (candidateId: string) => {
    const result = removeCandidate(candidateId)
    toast({
      title: result.success ? "Candidate Removed" : "Removal Failed",
      description: result.message,
      variant: result.success ? "default" : "destructive",
    })
  }

  const handleClearSelection = () => {
    const result = clearSelection()
    toast({
      title: "Selection Cleared",
      description: result.message,
    })
  }

  const handleFinalizeTeam = () => {
    if (!canFinalize()) {
      toast({
        title: "Cannot Finalize",
        description: "You must select exactly 5 candidates to finalize your team.",
        variant: "destructive",
      })
      return
    }

    router.push("/finalize")
  }

  const stats = getSelectionStats()

  return (
    <div className="min-h-screen bg-background">
      <Header selectedCount={selectedCandidates.length} onFinalizeTeam={handleFinalizeTeam} />
      <main className="container mx-auto px-4 py-6 grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-6">
        <div>
          <FiltersSidebar
            filters={filters}
            onFiltersChange={setFilters}
            selectedCandidates={selectedCandidates}
            onRemoveCandidate={handleRemoveCandidate}
          />
        </div>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Candidates</h1>
            <div className="flex items-center gap-2">
              <Button variant="outline" className="bg-transparent" onClick={handleClearSelection}>
                <Trash2 className="h-4 w-4 mr-2" /> Clear Selection
              </Button>
              <Button onClick={handleFinalizeTeam} disabled={!canFinalize()}>
                Finalize Team
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {filteredCandidates.map((candidate) => (
              <CandidateCard
                key={candidate.id}
                candidate={candidate}
                isSelected={isSelected(candidate.id)}
                isDisabled={isDisabled(candidate.id)}
                onSelect={handleSelectCandidate}
                onRemove={handleRemoveCandidate}
              />)
            )}
          </div>

          <SelectionStats stats={stats} />
        </div>
      </main>
      <Toaster />
    </div>
  )
}
