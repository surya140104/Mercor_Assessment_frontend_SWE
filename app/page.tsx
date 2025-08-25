"use client"

import { useState, useMemo } from "react"
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

  const filteredCandidates = useMemo(() => {
    return mockCandidates.filter((candidate) => {
      // Search query filter
      if (filters.searchQuery && !candidate.name.toLowerCase().includes(filters.searchQuery.toLowerCase())) {
        return false
      }

      // Skills filter
      if (filters.skills.length > 0 && !filters.skills.some((skill) => candidate.skills.includes(skill))) {
        return false
      }

      // Gender filter
      if (filters.gender.length > 0 && !filters.gender.includes(candidate.gender)) {
        return false
      }

      // Location filter
      if (filters.location && candidate.location !== filters.location) {
        return false
      }

      // Experience range filter
      if (candidate.experience < filters.experienceRange[0] || candidate.experience > filters.experienceRange[1]) {
        return false
      }

      return true
    })
  }, [filters])

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
        description: "Please select exactly 5 candidates to finalize your team.",
        variant: "destructive",
      })
      return
    }

    router.push("/finalize")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your team selection...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header selectedCount={selectedCandidates.length} onFinalizeTeam={handleFinalizeTeam} />

      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Filters Sidebar */}
          <aside className="lg:w-80 flex-shrink-0 space-y-6">
            <FiltersSidebar
              filters={filters}
              onFiltersChange={setFilters}
              selectedCandidates={selectedCandidates}
              onRemoveCandidate={handleRemoveCandidate}
            />

            <SelectionStats stats={getSelectionStats()} />

            {selectedCandidates.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearSelection}
                className="w-full text-destructive hover:text-destructive bg-transparent"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All Selections
              </Button>
            )}
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold mb-2">Available Candidates</h2>
              <p className="text-muted-foreground">
                Showing {filteredCandidates.length} of {mockCandidates.length} candidates
              </p>
            </div>

            {filteredCandidates.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground text-lg">No candidates match your current filters.</p>
                <p className="text-sm text-muted-foreground mt-2">Try adjusting your search criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredCandidates.map((candidate) => (
                  <CandidateCard
                    key={candidate.id}
                    candidate={candidate}
                    isSelected={isSelected(candidate.id)}
                    isDisabled={isDisabled(candidate.id)}
                    onSelect={handleSelectCandidate}
                    onRemove={handleRemoveCandidate}
                  />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      <Toaster />
    </div>
  )
}
