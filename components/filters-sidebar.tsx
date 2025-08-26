"use client"

import { useState } from "react"
import { Search, Filter, X, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
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
  const [skillsSearchQuery, setSkillsSearchQuery] = useState("")
  const [locationSearchQuery, setLocationSearchQuery] = useState("")
  const allSkills = getAllSkills()
  const allLocations = getAllLocations()
  const [minExp, maxExp] = getExperienceRange()

  // Filter skills based on search query
  const filteredSkills = allSkills.filter((skill) => skill.toLowerCase().includes(skillsSearchQuery.toLowerCase()))

  // Filter locations based on search query
  const filteredLocations = allLocations.filter((location) =>
    location.toLowerCase().includes(locationSearchQuery.toLowerCase()),
  )

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
    setSkillsSearchQuery("")
    setLocationSearchQuery("")
    updateFilters({
      skills: [],
      gender: [],
      location: "",
      experienceRange: [minExp, maxExp],
      searchQuery: "",
    })
  }

  const isAllLocations = !filters.location

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
          <CardContent className="space-y-3">
            {/* Skills Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search skills..."
                value={skillsSearchQuery}
                onChange={(e) => setSkillsSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
              {skillsSearchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSkillsSearchQuery("")}
                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Skills List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No skills found matching "{skillsSearchQuery}"
                </p>
              ) : (
                filteredSkills.map((skill) => (
                  <div key={skill} className="flex items-center space-x-2">
                    <Checkbox id={skill} checked={filters.skills.includes(skill)} onCheckedChange={() => toggleSkill(skill)} />
                    <Label htmlFor={skill} className="text-sm font-normal">
                      {skill}
                    </Label>
                  </div>
                ))
              )}
            </div>

            {/* Skills Count */}
            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              {filteredSkills.length} of {allSkills.length} skills
            </div>
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
                <Checkbox id={gender} checked={filters.gender.includes(gender)} onCheckedChange={() => toggleGender(gender)} />
                <Label htmlFor={gender} className="text-sm font-normal">
                  {gender}
                </Label>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Location Filter (searchable list) */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Location</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {/* Location Search */}
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search locations..."
                value={locationSearchQuery}
                onChange={(e) => setLocationSearchQuery(e.target.value)}
                className="pl-9 text-sm"
              />
              {locationSearchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setLocationSearchQuery("")}
                  className="absolute right-1 top-1 h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Location List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              <button
                className={`w-full text-left text-sm px-2 py-1 rounded-md flex items-center gap-2 ${
                  isAllLocations ? "bg-primary/10 text-primary" : "hover:bg-muted"
                }`}
                onClick={() => updateFilters({ location: "" })}
              >
                <MapPin className="h-3 w-3" /> All locations
              </button>
              {filteredLocations.map((location) => (
                <button
                  key={location}
                  className={`w-full text-left text-sm px-2 py-1 rounded-md flex items-center gap-2 ${
                    filters.location === location ? "bg-primary/10 text-primary" : "hover:bg-muted"
                  }`}
                  onClick={() => updateFilters({ location })}
                >
                  <MapPin className="h-3 w-3" /> {location}
                </button>
              ))}
              {filteredLocations.length === 0 && locationSearchQuery && (
                <p className="text-sm text-muted-foreground text-center py-2">
                  No locations found matching "{locationSearchQuery}"
                </p>
              )}
            </div>

            {/* Location Count */}
            <div className="text-xs text-muted-foreground text-center pt-2 border-t">
              {filteredLocations.length} of {allLocations.length} locations
            </div>
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
