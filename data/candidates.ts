import type { Candidate } from "@/types/candidate"
import rawSubmissions from "@/form-submissions.json"

type Submission = {
  name?: string
  email?: string
  phone?: string
  location?: string
  submitted_at?: string
  work_availability?: string[]
  annual_salary_expectation?: Record<string, string>
  skills?: unknown
  work_experiences?: Array<{ 
    company?: string
    roleName?: string
    startDate?: string
    endDate?: string
    description?: string
  }>
  education?: {
    highest_level?: string
    degrees?: Array<{
      degree?: string
      subject?: string
      school?: string
      gpa?: string
      startDate?: string
      endDate?: string
      originalSchool?: string
      isTop50?: boolean
      isTop25?: boolean
    }>
  }
}

const mapSubmissionToCandidate = (submission: Submission, index: number): Candidate => {
  const skillsArray = Array.isArray(submission.skills)
    ? (submission.skills as unknown[]).filter(Boolean).map((s) => String(s))
    : []
  const role = submission.work_experiences?.[0]?.roleName || "Candidate"
  const experienceYears = submission.work_experiences?.length ?? 0

  return {
    id: String(index + 1),
    name: submission.name || "Unknown",
    role,
    skills: skillsArray,
    experience: experienceYears,
    gender: "Other",
    location: submission.location || "Unknown",
    email: submission.email || `user${index + 1}@example.com`,
    phone: submission.phone,
    submitted_at: submission.submitted_at,
    work_availability: submission.work_availability,
    annual_salary_expectation: submission.annual_salary_expectation,
    work_experiences: submission.work_experiences?.map(exp => ({
      company: exp.company || "Unknown Company",
      roleName: exp.roleName || "Unknown Role",
      startDate: exp.startDate,
      endDate: exp.endDate,
      description: exp.description
    })) || [],
    education: submission.education
  }
}

const submissions = (rawSubmissions as unknown as Submission[]) || []

export const mockCandidates: Candidate[] = submissions.map(mapSubmissionToCandidate)

// Helper functions for filtering
export const getAllSkills = (): string[] => {
  const skillsSet = new Set<string>()
  mockCandidates.forEach((candidate) => {
    candidate.skills.forEach((skill) => skillsSet.add(skill))
  })
  return Array.from(skillsSet).sort()
}

export const getAllLocations = (): string[] => {
  const locationsSet = new Set<string>()
  mockCandidates.forEach((candidate) => {
    locationsSet.add(candidate.location)
  })
  return Array.from(locationsSet).sort()
}

export const getExperienceRange = (): [number, number] => {
  const experiences = mockCandidates.map((c) => c.experience)
  return [Math.min(...experiences), Math.max(...experiences)]
}
