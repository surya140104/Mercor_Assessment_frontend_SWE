export interface Candidate {
  id: string
  name: string
  role: string
  skills: string[]
  experience: number
  gender: "Male" | "Female" | "Other"
  location: string
  email: string
  avatar?: string
  // Additional rich data from JSON
  phone?: string
  submitted_at?: string
  work_availability?: string[]
  annual_salary_expectation?: Record<string, string>
  work_experiences?: Array<{
    company: string
    roleName: string
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

export interface TeamSelection {
  candidates: Candidate[]
  maxSize: number
}

export interface FilterState {
  skills: string[]
  gender: string[]
  location: string
  experienceRange: [number, number]
  searchQuery: string
}
