"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Users, MapPin, Award, Calendar } from "lucide-react"

interface SelectionStatsProps {
  stats: {
    genderCounts: Record<string, number>
    skillCounts: Record<string, number>
    locationCounts: Record<string, number>
    experienceRange: { min: number; max: number; avg: number }
    totalSelected: number
    maxSize: number
  }
}

export function SelectionStats({ stats }: SelectionStatsProps) {
  const { genderCounts, skillCounts, locationCounts, experienceRange, totalSelected, maxSize } = stats

  if (totalSelected === 0) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-center text-muted-foreground">Select candidates to see team diversity stats</p>
        </CardContent>
      </Card>
    )
  }

  const topSkills = Object.entries(skillCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)

  return (
    <div className="space-y-4">
      {/* Selection Progress */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Users className="h-4 w-4" />
            Team Progress
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Selected</span>
              <span className="font-medium">
                {totalSelected}/{maxSize}
              </span>
            </div>
            <Progress value={(totalSelected / maxSize) * 100} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Gender Diversity */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Gender Diversity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(genderCounts).map(([gender, count]) => (
              <Badge key={gender} variant="secondary">
                {gender}: {count}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Top Skills */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Award className="h-4 w-4" />
            Top Skills
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-1">
            {topSkills.map(([skill, count]) => (
              <Badge key={skill} variant="outline" className="text-xs">
                {skill} ({count})
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Location Spread */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            Locations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {Object.entries(locationCounts).map(([location, count]) => (
              <div key={location} className="flex justify-between text-sm">
                <span>{location}</span>
                <span className="text-muted-foreground">{count}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experience Range */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Experience
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-1 text-sm">
            <div className="flex justify-between">
              <span>Range:</span>
              <span>
                {experienceRange.min}-{experienceRange.max} years
              </span>
            </div>
            <div className="flex justify-between">
              <span>Average:</span>
              <span>{experienceRange.avg} years</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
