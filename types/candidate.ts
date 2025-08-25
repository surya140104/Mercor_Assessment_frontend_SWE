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
