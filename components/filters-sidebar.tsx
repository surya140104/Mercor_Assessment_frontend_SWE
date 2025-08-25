"use client"

import { useState } from "react"
import { Search, Filter, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { FilterState, Candidate } from "@/types/candidate"
import { getAllSkills, getAllLocations, getExperienceRange } from "@/data/candidates"

interface FiltersSidebarProps {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  selectedCandidates: Candidate[]
  onRemoveCandidate: (candidateId: string) => void
}

export function FiltersSidebar({
  filters,
  onFiltersChange,
  selectedCandidates,
  onRemoveCandidate,
}: FiltersSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const allSkills = getAllSkills()
  const allLocations = getAllLocations()
  const [minExp, maxExp] = getExperienceRange()

  const updateFilters = (updates: Partial<FilterState>) => {
    onFiltersChange({ ...filters, ...updates })
  }

  const toggleSkill = (skill: string) => {
    const newSkills = filters.skills.includes(skill)
      ? filters.skills.filter((s) => s !== skill)
      : [...filters.skills, skill]
    updateFilters({ skills: newSkills })
  }

  const toggleGender = (gender: string) => {
    const newGenders = filters.gender.includes(gender)
      ? filters.gender.filter((g) => g !== gender)
      : [...filters.gender, gender]
    updateFilters({ gender: newGenders })
  }

  const clearAllFilters = () => {
    updateFilters({
      skills: [],
      gender: [],
      location: "All locations",
      experienceRange: [minExp, maxExp],
      searchQuery: "",
    })
  }

  return (
    <>
      {/* Mobile filter toggle */}
      <div className="lg:hidden mb-4">
        <Button variant="outline" onClick={() => setIsOpen(!isOpen)} className="w-full justify-start">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`${isOpen ? "block" : "hidden"} lg:block space-y-6`}>
        {/* Search */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Search Candidates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name..."
                value={filters.searchQuery}
                onChange={(e) => updateFilters({ searchQuery: e.target.value })}
                className="pl-9"
              />
            </div>
          </CardContent>
        </Card>

        {/* Skills Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Skills</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 max-h-48 overflow-y-auto">
            {allSkills.map((skill) => (
              <div key={skill} className="flex items-center space-x-2">
                <Checkbox
                  id={skill}
                  checked={filters.skills.includes(skill)}
                  onCheckedChange={() => toggleSkill(skill)}
                />
                <Label htmlFor={skill} className="text-sm font-normal">
                  {skill}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Gender Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Gender</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {["Male", "Female", "Other"].map((gender) => (
              <div key={gender} className="flex items-center space-x-2">
                <Checkbox
                  id={gender}
                  checked={filters.gender.includes(gender)}
                  onCheckedChange={() => toggleGender(gender)}
                />
                <Label htmlFor={gender} className="text-sm font-normal">
                  {gender}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Location Filter */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Location</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={filters.location} onValueChange={(value) => updateFilters({ location: value })}>
              <SelectTrigger>
                <SelectValue placeholder="All locations" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All locations">All locations</SelectItem>
                {allLocations.map((location) => (
                  <SelectItem key={location} value={location}>
                    {location}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Experience Range */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Experience (Years)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <Slider
                value={filters.experienceRange}
                onValueChange={(value) => updateFilters({ experienceRange: value as [number, number] })}
                max={maxExp}
                min={minExp}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>{filters.experienceRange[0]} years</span>
                <span>{filters.experienceRange[1]} years</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Clear Filters */}
        <Button variant="outline" onClick={clearAllFilters} className="w-full bg-transparent">
          Clear All Filters
        </Button>

        {/* Selected Candidates Preview */}
        {selectedCandidates.length > 0 && (
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Selected Team ({selectedCandidates.length}/5)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {selectedCandidates.map((candidate) => (
                <div key={candidate.id} className="flex items-center justify-between p-2 bg-muted rounded-md">
                  <div>
                    <p className="text-sm font-medium">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground">{candidate.role}</p>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => onRemoveCandidate(candidate.id)}>
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
