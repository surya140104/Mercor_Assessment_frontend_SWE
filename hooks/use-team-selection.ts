"use client"

import { useState, useEffect } from "react"
import type { Candidate } from "@/types/candidate"

const STORAGE_KEY = "hiresmart-selected-team"
const MAX_TEAM_SIZE = 5

export function useTeamSelection() {
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        if (Array.isArray(parsed) && parsed.length <= MAX_TEAM_SIZE) {
          setSelectedCandidates(parsed)
        }
      }
    } catch (error) {
      console.error("Failed to load team selection from storage:", error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Save to localStorage whenever selection changes
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(selectedCandidates))
      } catch (error) {
        console.error("Failed to save team selection to storage:", error)
      }
    }
  }, [selectedCandidates, isLoading])

  const addCandidate = (candidate: Candidate): { success: boolean; message: string } => {
    if (selectedCandidates.length >= MAX_TEAM_SIZE) {
      return {
        success: false,
        message: "Team is full. You can only select up to 5 candidates.",
      }
    }

    if (selectedCandidates.some((c) => c.id === candidate.id)) {
      return {
        success: false,
        message: "This candidate is already selected.",
      }
    }

    setSelectedCandidates((prev) => [...prev, candidate])
    return {
      success: true,
      message: `${candidate.name} has been added to your team.`,
    }
  }

  const removeCandidate = (candidateId: string): { success: boolean; message: string } => {
    const candidate = selectedCandidates.find((c) => c.id === candidateId)

    if (!candidate) {
      return {
        success: false,
        message: "Candidate not found in selection.",
      }
    }

    setSelectedCandidates((prev) => prev.filter((c) => c.id !== candidateId))
    return {
      success: true,
      message: `${candidate.name} has been removed from your team.`,
    }
  }

  const clearSelection = (): { success: boolean; message: string } => {
    setSelectedCandidates([])
    return {
      success: true,
      message: "Team selection has been cleared.",
    }
  }

  const isSelected = (candidateId: string): boolean => {
    return selectedCandidates.some((c) => c.id === candidateId)
  }

  const isDisabled = (candidateId: string): boolean => {
    return selectedCandidates.length >= MAX_TEAM_SIZE && !isSelected(candidateId)
  }

  const canFinalize = (): boolean => {
    return selectedCandidates.length === MAX_TEAM_SIZE
  }

  const getSelectionStats = () => {
    const genderCounts = selectedCandidates.reduce(
      (acc, candidate) => {
        acc[candidate.gender] = (acc[candidate.gender] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const skillCounts = selectedCandidates.reduce(
      (acc, candidate) => {
        candidate.skills.forEach((skill) => {
          acc[skill] = (acc[skill] || 0) + 1
        })
        return acc
      },
      {} as Record<string, number>,
    )

    const locationCounts = selectedCandidates.reduce(
      (acc, candidate) => {
        acc[candidate.location] = (acc[candidate.location] || 0) + 1
        return acc
      },
      {} as Record<string, number>,
    )

    const experienceRange =
      selectedCandidates.length > 0
        ? {
            min: Math.min(...selectedCandidates.map((c) => c.experience)),
            max: Math.max(...selectedCandidates.map((c) => c.experience)),
            avg: Math.round(selectedCandidates.reduce((sum, c) => sum + c.experience, 0) / selectedCandidates.length),
          }
        : { min: 0, max: 0, avg: 0 }

    return {
      genderCounts,
      skillCounts,
      locationCounts,
      experienceRange,
      totalSelected: selectedCandidates.length,
      maxSize: MAX_TEAM_SIZE,
    }
  }

  return {
    selectedCandidates,
    isLoading,
    addCandidate,
    removeCandidate,
    clearSelection,
    isSelected,
    isDisabled,
    canFinalize,
    getSelectionStats,
  }
}
