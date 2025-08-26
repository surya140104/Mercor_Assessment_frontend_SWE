"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Users, Award, MapPin, Calendar, Download, Share2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { Toaster } from "@/components/ui/toaster"
import type { Candidate } from "@/types/candidate"

export default function FinalizeTeamPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedTeam, setSelectedTeam] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem("hiresmart-selected-team")
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length === 5) {
          setSelectedTeam(parsed)
        } else {
          // Redirect back if no valid team selection
          router.push("/")
          return
        }
      } else {
        router.push("/")
        return
      }
    } catch (error) {
      console.error("Failed to load team selection:", error)
      router.push("/")
      return
    } finally {
      setIsLoading(false)
    }
  }, [router])

  const generateTeamAnalysis = (team: Candidate[]) => {
    // Gender analysis
    const genderCounts = team.reduce(
      (acc, candidate) => {
        acc[candidate.gender] = (acc[candidate.gender] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    // Skills analysis
    const allSkills = team.flatMap((c) => c.skills)
    const uniqueSkills = [...new Set(allSkills)]
    const skillCategories = categorizeSkills(uniqueSkills)

    // Experience analysis
    const experiences = team.map((c) => c.experience)
    const minExp = Math.min(...experiences)
    const maxExp = Math.max(...experiences)
    const avgExp = Math.round(experiences.reduce((sum, exp) => sum + exp, 0) / experiences.length)

    // Location analysis
    const locations = [...new Set(team.map((c) => c.location))]

    // Generate explanation (requested phrasing)
    const genderBreakdownPhrase = generateGenderBreakdownPhrase(genderCounts)
    const uniqueSkillsPhrase = uniqueSkills.slice(0, 6).join(", ")
    const experiencePhrase = `experience from ${minExp} to ${maxExp} years`
    const locationDiversityPhrase =
      locations.length === 1 ? `candidates all from ${locations[0]}` : `candidates from ${locations.length} different locations`

    const finalExplanation =
      "We selected a balanced team covering multiple skills, diverse genders, and experience levels across multiple locations."

    // Validation suggestions
    const allSameGender = Object.keys(genderCounts).length === 1 && team.length === 5
    const skillFrequency = allSkills.reduce((acc, s) => {
      acc[s] = (acc[s] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    const topSkillEntry = Object.entries(skillFrequency).sort((a, b) => b[1] - a[1])[0]
    const skillsOverlapTooMuch = topSkillEntry ? topSkillEntry[1] >= 4 : false

    return {
      summary: `${genderBreakdownPhrase}; skills include ${uniqueSkillsPhrase}; ${experiencePhrase}; ${locationDiversityPhrase}. ${finalExplanation}`,
      details: {
        genderCounts,
        skillCategories,
        experienceRange: { min: minExp, max: maxExp, avg: avgExp },
        locations,
        uniqueSkills: uniqueSkills.length,
        totalSkills: allSkills.length,
        locationDiversityCount: locations.length,
        uniqueSkillsList: uniqueSkills,
        validations: {
          allSameGender,
          skillsOverlapTooMuch,
          topSkill: topSkillEntry ? { name: topSkillEntry[0], count: topSkillEntry[1] } : null,
        },
      },
    }
  }

  const categorizeSkills = (skills: string[]) => {
    const categories = {
      Frontend: ["React", "Vue.js", "Angular", "JavaScript", "TypeScript", "CSS", "SASS", "HTML"],
      Backend: ["Node.js", "Python", "Java", "Spring Boot", "PHP", "Ruby"],
      Database: ["PostgreSQL", "MongoDB", "MySQL", "Redis", "SQL"],
      "Cloud/DevOps": ["AWS", "Azure", "Docker", "Kubernetes", "Jenkins", "Terraform"],
      Mobile: ["React Native", "Swift", "Kotlin", "Flutter"],
      "Data/AI": ["Machine Learning", "TensorFlow", "PyTorch", "Data Science", "NLP", "Computer Vision"],
      "Design/UX": ["Figma", "Adobe XD", "Prototyping", "User Research"],
      Other: [],
    }

    const categorized = { ...categories }

    skills.forEach((skill) => {
      let placed = false
      for (const [category, categorySkills] of Object.entries(categories)) {
        if (categorySkills.includes(skill)) {
          if (!categorized[category].includes(skill)) {
            categorized[category].push(skill)
          }
          placed = true
          break
        }
      }
      if (!placed) {
        categorized["Other"].push(skill)
      }
    })

    // Remove empty categories
    Object.keys(categorized).forEach((key) => {
      if (categorized[key].length === 0) {
        delete categorized[key]
      }
    })

    return categorized
  }

  const generateGenderBreakdownPhrase = (genderCounts: Record<string, number>) => {
    const label = (g: string) => (g === "Male" ? "men" : g === "Female" ? "women" : "non-binary/other")
    const entries = Object.entries(genderCounts)
    if (entries.length === 0) return "no gender data"
    const parts = entries.map(([g, c]) => `${c} ${label(g)}`)
    if (parts.length === 1) return parts[0]
    if (parts.length === 2) return `${parts[0]}, ${parts[1]}`
    return `${parts.slice(0, -1).join(", ")}, ${parts[parts.length - 1]}`
  }

  const generateSkillsText = (skillCategories: Record<string, string[]>) => {
    const categoryNames = Object.keys(skillCategories)
    if (categoryNames.length <= 2) {
      return `expertise in ${categoryNames.join(" and ")}`
    }
    return `expertise spanning ${categoryNames.slice(0, -1).join(", ")}, and ${categoryNames[categoryNames.length - 1]}`
  }

  const handleExportTeam = () => {
    const analysis = generateTeamAnalysis(selectedTeam)
    const exportData = {
      team: selectedTeam,
      analysis: analysis,
      exportDate: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "hiresmart-team-selection.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    toast({
      title: "Team Exported",
      description: "Your team selection has been downloaded as a JSON file.",
    })
  }

  const handleShareTeam = async () => {
    const analysis = generateTeamAnalysis(selectedTeam)
    const shareText = `HireSmart Team Selection:\n\n${selectedTeam.map((c) => `• ${c.name} - ${c.role}`).join("\n")}\n\nTeam Analysis:\n${analysis.summary}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: "HireSmart Team Selection",
          text: shareText,
        })
      } catch (error) {
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText)
        toast({
          title: "Copied to Clipboard",
          description: "Team selection has been copied to your clipboard.",
        })
      }
    } else {
      await navigator.clipboard.writeText(shareText)
      toast({
        title: "Copied to Clipboard",
        description: "Team selection has been copied to your clipboard.",
      })
    }
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
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

  if (selectedTeam.length === 0) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground text-lg mb-4">No team selection found.</p>
          <Button onClick={() => router.push("/")}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Selection
          </Button>
        </div>
      </div>
    )
  }

  const analysis = generateTeamAnalysis(selectedTeam)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push("/")} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Selection
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h1 className="text-lg font-semibold">Your Selected Team</h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={handleShareTeam} className="gap-2 bg-transparent">
              <Share2 className="h-4 w-4" />
              Share
            </Button>
            <Button variant="outline" onClick={handleExportTeam} className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Validation messages */}
        {(() => {
          const v = analysis.details.validations
          const messages: string[] = []
          if (v.allSameGender) messages.push("Try for more gender diversity.")
          if (v.skillsOverlapTooMuch)
            messages.push(
              v.topSkill
                ? `Skills overlap heavily (e.g., ${v.topSkill.name} appears in ${v.topSkill.count}/5). Consider adding different skills.`
                : "Skills overlap heavily. Consider adding different skills.",
            )
          if (messages.length === 0) return null
          return (
            <div className="mb-6">
              <div className="rounded-md border border-yellow-200 bg-yellow-50 p-4 text-sm text-yellow-900">
                <ul className="list-disc pl-5 space-y-1">
                  {messages.map((m, i) => (
                    <li key={i}>{m}</li>
                  ))}
                </ul>
              </div>
            </div>
          )
        })()}

        {/* Team Members */}
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-6">Team Members</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
            {selectedTeam.map((candidate, index) => (
              <Card key={candidate.id}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                        {getInitials(candidate.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-xl font-semibold">{candidate.name}</h3>
                          <p className="text-muted-foreground">{candidate.role}</p>
                        </div>
                        <Badge variant="secondary">#{index + 1}</Badge>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-4 w-4 text-muted-foreground" />
                          <span>{candidate.experience} years experience</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{candidate.location}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <span className="text-lg">
                            {candidate.gender === "Male" ? "♂" : candidate.gender === "Female" ? "♀" : "⚧"}
                          </span>
                          <span>{candidate.gender}</span>
                        </div>
                      </div>

                      <div>
                        <p className="text-sm font-medium mb-2">Skills:</p>
                        <div className="flex flex-wrap gap-1">
                          {candidate.skills.map((skill) => (
                            <Badge key={skill} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Team Analysis */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Team Diversity Analysis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Quick stats badges */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary">{analysis.details.uniqueSkills} unique skills</Badge>
              <Badge variant="secondary">{analysis.details.locationDiversityCount} locations</Badge>
              <Badge variant="secondary">
                {analysis.details.experienceRange.min}-{analysis.details.experienceRange.max} yrs exp
              </Badge>
            </div>

            <div>
              <h4 className="font-medium mb-3">Why This Team Was Selected</h4>
              <p className="text-muted-foreground leading-relaxed">{analysis.summary}</p>
            </div>

            <Separator />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Gender Distribution</h4>
                <div className="space-y-2">
                  {Object.entries(analysis.details.genderCounts).map(([gender, count]) => (
                    <div key={gender} className="flex justify-between">
                      <span className="text-sm">{gender}</span>
                      <Badge variant="secondary">{count}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Experience Range</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Minimum:</span>
                    <span>{analysis.details.experienceRange.min} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Maximum:</span>
                    <span>{analysis.details.experienceRange.max} years</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Average:</span>
                    <span>{analysis.details.experienceRange.avg} years</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Skill Categories</h4>
                <div className="space-y-2">
                  {Object.entries(analysis.details.skillCategories).map(([category, skills]) => (
                    <div key={category}>
                      <p className="text-sm font-medium">{category}</p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {skills.map((skill) => (
                          <Badge key={skill} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-3">Geographic Distribution</h4>
                <div className="space-y-1">
                  {analysis.details.locations.map((location) => (
                    <div key={location} className="flex items-center gap-2">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-sm">{location}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Toaster />
    </div>
  )
}
