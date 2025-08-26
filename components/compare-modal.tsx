"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import type { Candidate } from "@/types/candidate"
import { computeCandidateScore, inferPrimaryRole } from "@/lib/scoring"

interface CompareModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  candidates: Candidate[]
}

export function CompareModal({ open, onOpenChange, candidates }: CompareModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle>Compare Candidates ({candidates.length}/3)</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {candidates.map((c) => {
            const score = computeCandidateScore(c, candidates.filter((x) => x.id !== c.id))
            const role = inferPrimaryRole(c.skills)
            return (
              <div key={c.id} className="rounded-md border p-3 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="text-xs text-muted-foreground">{c.role}</p>
                  </div>
                  <Badge variant="secondary">Score {score}</Badge>
                </div>
                <div className="text-xs text-muted-foreground">{c.experience} yrs • {c.gender} • {c.location}</div>
                {role !== "Unknown" && <Badge variant="outline" className="text-[10px]">{role}</Badge>}
                <div className="flex flex-wrap gap-1 mt-2">
                  {c.skills.slice(0, 12).map((s) => (
                    <Badge key={s} variant="outline" className="text-[10px]">{s}</Badge>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      </DialogContent>
    </Dialog>
  )
}
