import type { Dispatch, SetStateAction } from 'react'

export type RouteId =
  | 'landing' | 'home' | 'journey' | 'subjects' | 'library'
  | 'worksheets' | 'math' | 'coding' | 'handwriting'
  | 'article' | 'parent' | 'brand'

export interface AppUser {
  name: string
  enName: string
  age: number
  avatar: string
  streak: number
  stars: number
  level: number
}

export interface SubjectProgress {
  lessons: number
  total: number
  accuracy: number
  streak: number
}

export interface AppCtx {
  user: AppUser
  setUser: Dispatch<SetStateAction<AppUser>>
  progress: Record<string, SubjectProgress>
  bumpProgress: (subject: string, delta?: number, accuracyHint?: number) => void
  navigate: (id: RouteId) => void
  route: RouteId
}
