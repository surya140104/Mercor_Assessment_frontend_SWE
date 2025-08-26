import type { Candidate } from "@/types/candidate"

type Role = "Frontend" | "Backend" | "Designer" | "DevOps" | "Product Manager" | "Unknown"

export const REQUIRED_SKILLS: string[] = [
  "React",
  "Node.js",
  "TypeScript",
  "Python",
  "AWS",
  "Docker",
  "Figma",
  "Kubernetes",
]

const ROLE_SKILL_MAP: Record<Role, string[]> = {
  Frontend: ["React", "Vue.js", "Angular", "TypeScript", "JavaScript", "CSS", "HTML"],
  Backend: ["Node.js", "Python", "Java", "Spring Boot", "Go", "Ruby", "PHP"],
  Designer: ["Figma", "Adobe XD", "Prototyping", "User Research", "UI", "UX"],
  DevOps: ["Docker", "Kubernetes", "AWS", "Azure", "Terraform", "Jenkins"],
  "Product Manager": ["Product", "Scrum", "Agile", "Product Strategy", "Roadmap"],
  Unknown: [],
}

export function inferPrimaryRole(skills: string[]): Role {
  const scores: Record<Role, number> = {
    Frontend: 0,
    Backend: 0,
    Designer: 0,
    DevOps: 0,
    "Product Manager": 0,
    Unknown: 0,
  }
  for (const role of Object.keys(ROLE_SKILL_MAP) as Role[]) {
    scores[role] = skills.filter((s) => ROLE_SKILL_MAP[role].includes(s)).length
  }
  const best = (Object.entries(scores) as Array<[Role, number]>).sort((a, b) => b[1] - a[1])[0]
  return best && best[1] > 0 ? best[0] : "Unknown"
}

export function computeCandidateScore(
  candidate: Candidate,
  selectedTeam: Candidate[],
  requiredSkills: string[] = REQUIRED_SKILLS,
): number {
  // Skills relevance (0-40)
  const requiredSet = new Set(requiredSkills.map((s) => s.toLowerCase()))
  const matches = candidate.skills.filter((s) => requiredSet.has(s.toLowerCase())).length
  const skillsScore = Math.min(40, Math.round((matches / Math.max(requiredSkills.length, 1)) * 40))

  // Experience (0-30) — normalize 0-10 years
  const expNorm = Math.max(0, Math.min(10, candidate.experience)) / 10
  const experienceScore = Math.round(expNorm * 30)

  // Diversity (0-20): +10 if introduces new gender, +10 if introduces new location
  const genders = new Set(selectedTeam.map((c) => c.gender))
  const locations = new Set(selectedTeam.map((c) => c.location.toLowerCase()))
  const genderPoints = genders.has(candidate.gender) ? 0 : 10
  const locationPoints = locations.has(candidate.location.toLowerCase()) ? 0 : 10
  const diversityScore = genderPoints + locationPoints

  // Bonus (0-10): unique skill not present in team
  const teamSkills = new Set<string>()
  selectedTeam.forEach((c) => c.skills.forEach((s) => teamSkills.add(s.toLowerCase())))
  const hasUniqueSkill = candidate.skills.some((s) => !teamSkills.has(s.toLowerCase()))
  const bonus = hasUniqueSkill ? 10 : 0

  const total = skillsScore + experienceScore + diversityScore + bonus
  return Math.max(0, Math.min(100, total))
}

export function summarizeSkills(candidates: Candidate[]): string[] {
  const set = new Set<string>()
  candidates.forEach((c) => c.skills.forEach((s) => set.add(s)))
  return Array.from(set).sort()
}

export function summarizeRoles(candidates: Candidate[]): { coverage: Record<Role, number>; missing: Role[] } {
  const needed: Role[] = ["Frontend", "Backend", "Designer", "DevOps", "Product Manager"]
  const coverage: Record<Role, number> = {
    Frontend: 0,
    Backend: 0,
    Designer: 0,
    DevOps: 0,
    "Product Manager": 0,
    Unknown: 0,
  }
  candidates.forEach((c) => {
    const role = inferPrimaryRole(c.skills)
    coverage[role] = (coverage[role] || 0) + 1
  })
  const missing = needed.filter((r) => (coverage[r] || 0) === 0)
  return { coverage, missing }
}
