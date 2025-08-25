"use client"

import { MapPin, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import type { Candidate } from "@/types/candidate"

interface CandidateCardProps {
  candidate: Candidate
  isSelected: boolean
  isDisabled: boolean
  onSelect: (candidate: Candidate) => void
  onRemove: (candidateId: string) => void
}

export function CandidateCard({ candidate, isSelected, isDisabled, onSelect, onRemove }: CandidateCardProps) {
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

  return (
    <Card
      className={`transition-all duration-200 hover:shadow-md ${
        isSelected ? "ring-2 ring-primary bg-primary/5" : ""
      } ${isDisabled && !isSelected ? "opacity-50" : ""}`}
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
            </div>
          </div>
          <div className="text-lg" title={candidate.gender}>
            {getGenderIcon(candidate.gender)}
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

        <Button
          onClick={() => (isSelected ? onRemove(candidate.id) : onSelect(candidate))}
          disabled={isDisabled && !isSelected}
          variant={isSelected ? "destructive" : "default"}
          className="w-full"
        >
          {isSelected ? "Remove" : "Select"}
        </Button>
      </CardContent>
    </Card>
  )
}
