import type { Timestamp } from 'firebase/firestore'

export type Genre = 'cooking' | 'bread' | 'sweets' | 'handmade'
export type SubGenre = 'japanese' | 'western' | 'chinese' | 'other'

export const GENRE_LABELS: Record<Genre, string> = {
  cooking: '料理',
  bread: 'パン',
  sweets: 'お菓子',
  handmade: 'ハンドメイド',
}

export const SUB_GENRE_LABELS: Record<SubGenre, string> = {
  japanese: '和食',
  western: '洋食',
  chinese: '中華',
  other: 'その他',
}

export interface Household {
  id: string
  name: string
  members: string[]
}

export interface User {
  id: string
  name: string
  photoURL: string | null
  householdId: string | null
}

export interface Recipe {
  id: string
  householdId: string
  title: string
  genre: Genre
  subGenre: SubGenre | null
  url: string
  memo: string
  tags: string[]
  photos: string[]
  createdBy: string
  lastCookedAt: Timestamp | null
  cookCount: number
  createdAt: Timestamp
  updatedAt: Timestamp
}

export interface CookLog {
  id: string
  recipeId: string
  householdId: string
  cookedBy: string
  cookedAt: Timestamp
  photos: string[]
  memo: string
}

export interface WantToEat {
  id: string
  recipeId: string
  householdId: string
  userId: string
  createdAt: Timestamp
}
