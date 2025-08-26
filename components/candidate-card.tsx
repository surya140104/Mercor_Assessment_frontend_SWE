"use client"

import { useState, useMemo } from "react"
import { MapPin, Calendar, Eye, X, Building, GraduationCap, DollarSign, Clock, Mail, Phone } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import type { Candidate } from "@/types/candidate"
import { useTeamSelection } from "@/hooks/use-team-selection"
import { computeCandidateScore, inferPrimaryRole } from "@/lib/scoring"

interface CandidateCardProps {
  candidate: Candidate
  isSelected: boolean
  isDisabled: boolean
  onSelect: (candidate: Candidate) => void
  onRemove: (candidateId: string) => void
  onToggleCompare?: (candidate: Candidate) => void
  isInCompare?: boolean
}

export function CandidateCard({ candidate, isSelected, isDisabled, onSelect, onRemove, onToggleCompare, isInCompare }: CandidateCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const { selectedCandidates, toggleBookmark, isBookmarked } = useTeamSelection()

  const score = useMemo(() => computeCandidateScore(candidate, selectedCandidates), [candidate, selectedCandidates])
  const primaryRole = useMemo(() => inferPrimaryRole(candidate.skills), [candidate.skills])

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const getGenderIcon = (gender: string) => {
    switch (gender) {
      case "Male":
        return "♂"
      case "Female":
        return "♀"
      default:
        return "⚧"
    }
  }

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Present"
    try {
      return new Date(dateString).toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short' 
      })
    } catch {
      return dateString
    }
  }

  const formatSalary = (salary?: string) => {
    if (!salary) return "Not specified"
    return salary.startsWith('$') ? salary : `$${salary}`
  }

  const hasWorkExperience = candidate.work_experiences && candidate.work_experiences.length > 0
  const hasEducation = candidate.education && candidate.education.degrees && candidate.education.degrees.length > 0
  const hasContactInfo = candidate.phone || candidate.email
  const hasWorkPreferences = candidate.work_availability || candidate.annual_salary_expectation

  return (
    <>
      <Card
        className={`transition-all duration-200 hover:shadow-md cursor-pointer ${
          isSelected ? "ring-2 ring-primary bg-primary/5" : ""
        } ${isDisabled && !isSelected ? "opacity-50" : ""}`}
        onClick={() => setShowDetails(true)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-medium">
                  {getInitials(candidate.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-base">{candidate.name}</h3>
                <p className="text-sm text-muted-foreground">{candidate.role}</p>
                {primaryRole !== "Unknown" && (
                  <Badge variant="outline" className="mt-1 text-[10px]">Primary: {primaryRole}</Badge>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">Score {score}</Badge>
              <div className="text-lg" title={candidate.gender}>
                {getGenderIcon(candidate.gender)}
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1">
            {candidate.skills.slice(0, 4).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-xs">
                {skill}
              </Badge>
            ))}
            {candidate.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{candidate.skills.length - 4} more
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{candidate.experience} years</span>
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{candidate.location}</span>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={(e) => {
                e.stopPropagation()
                if (isSelected) onRemove(candidate.id)
                else onSelect(candidate)
              }}
              disabled={isDisabled && !isSelected}
              variant={isSelected ? "destructive" : "default"}
              className="flex-1"
            >
              {isSelected ? "Remove" : "Select"}
            </Button>
            <Button
              variant={isBookmarked(candidate.id) ? "secondary" : "outline"}
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                toggleBookmark(candidate)
              }}
              className="px-3"
              title={isBookmarked(candidate.id) ? "Bookmarked" : "Bookmark"}
            >
              ★
            </Button>
            {onToggleCompare && (
              <Button
                variant={isInCompare ? "secondary" : "outline"}
                size="sm"
                onClick={(e) => {
                  e.stopPropagation()
                  onToggleCompare(candidate)
                }}
                className="px-3"
                title={isInCompare ? "In Compare" : "Add to Compare"}
              >
                ⇄
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation()
                setShowDetails(true)
              }}
              className="px-3"
            >
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Candidate Modal */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-xl">
                  {getInitials(candidate.name)}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-2xl font-bold">{candidate.name}</h2>
                <p className="text-lg text-muted-foreground">{candidate.role}</p>
                {primaryRole !== "Unknown" && (
                  <Badge variant="outline" className="mt-1">Primary role: {primaryRole}</Badge>
                )}
              </div>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.email}</span>
                </div>
                {candidate.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.location}</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>{candidate.experience} years of experience</span>
                </div>
                {candidate.work_availability && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>{candidate.work_availability.join(", ")}</span>
                  </div>
                )}
                {candidate.annual_salary_expectation && (
                  <div className="flex items-center gap-2 text-sm">
                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {Object.entries(candidate.annual_salary_expectation)
                        .map(([type, salary]) => `${type}: ${formatSalary(salary)}`)
                        .join(", ")}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* Skills */}
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <Badge variant="secondary" className="text-sm">
                  {candidate.skills.length} Skills
                </Badge>
                <Badge variant="outline" className="text-xs">Score {score}</Badge>
              </h3>
              <div className="flex flex-wrap gap-2">
                {candidate.skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Work Experience */}
            {hasWorkExperience ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Work Experience
                  </h3>
                  <div className="space-y-4">
                    {candidate.work_experiences.map((exp, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">{exp.roleName}</h4>
                            <p className="text-sm text-muted-foreground">{exp.company}</p>
                            {exp.description && (
                              <p className="text-sm text-muted-foreground mt-1">{exp.description}</p>
                            )}
                          </div>
                          <div className="text-sm text-muted-foreground text-right">
                            <div>{formatDate(exp.startDate)}</div>
                            <div>{formatDate(exp.endDate)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <Building className="h-5 w-5" />
                    Work Experience
                  </h3>
                  <p className="text-sm text-muted-foreground">No work experience information available</p>
                </div>
                <Separator />
              </>
            )}

            {/* Education */}
            {hasEducation ? (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                    {candidate.education.highest_level && (
                      <Badge variant="secondary" className="text-sm">
                        {candidate.education.highest_level}
                      </Badge>
                    )}
                  </h3>
                  <div className="space-y-4">
                    {candidate.education.degrees.map((degree, index) => (
                      <div key={index} className="border-l-2 border-primary/20 pl-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="font-medium">
                              {degree.degree} {degree.subject && `in ${degree.subject}`}
                            </h4>
                            <p className="text-sm text-muted-foreground">{degree.school}</p>
                            <p className="text-sm text-muted-foreground">{degree.originalSchool}</p>
                            <div className="flex gap-2 mt-1">
                              <Badge variant="outline" className="text-xs">
                                {degree.gpa}
                              </Badge>
                              {degree.isTop50 && (
                                <Badge variant="secondary" className="text-xs">
                                  Top 50
                                </Badge>
                              )}
                              {degree.isTop25 && (
                                <Badge variant="secondary" className="text-xs">
                                  Top 25
                                </Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-sm text-muted-foreground text-right">
                            <div>{degree.startDate || "N/A"}</div>
                            <div>{degree.endDate || "Present"}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            ) : (
              <>
                <div>
                  <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                    <GraduationCap className="h-5 w-5" />
                    Education
                  </h3>
                  <p className="text-sm text-muted-foreground">No education information available</p>
                </div>
                <Separator />
              </>
            )}

            {/* Application Details */}
            {candidate.submitted_at && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Application Details</h3>
                <div className="text-sm text-muted-foreground">
                  <p>Submitted: {new Date(candidate.submitted_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
