import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  increment,
  type Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Recipe, Genre, SubGenre } from '@/types'

export function useRecipes(householdId: string | null) {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!householdId) {
      setRecipes([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'recipes'),
      where('householdId', '==', householdId),
      orderBy('createdAt', 'desc'),
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Recipe[]
      setRecipes(data)
      setLoading(false)
    })

    return unsubscribe
  }, [householdId])

  const addRecipe = useCallback(
    async (data: {
      householdId: string
      title: string
      genre: Genre
      subGenre: SubGenre | null
      url: string
      memo: string
      tags: string[]
      photos: string[]
      createdBy: string
    }) => {
      const docRef = await addDoc(collection(db, 'recipes'), {
        ...data,
        lastCookedAt: null,
        cookCount: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      })
      return docRef.id
    },
    [],
  )

  const updateRecipe = useCallback(
    async (
      recipeId: string,
      data: Partial<{
        title: string
        genre: Genre
        subGenre: SubGenre | null
        url: string
        memo: string
        tags: string[]
        photos: string[]
      }>,
    ) => {
      await updateDoc(doc(db, 'recipes', recipeId), {
        ...data,
        updatedAt: serverTimestamp(),
      })
    },
    [],
  )

  const deleteRecipe = useCallback(async (recipeId: string) => {
    await deleteDoc(doc(db, 'recipes', recipeId))
  }, [])

  const markCooked = useCallback(async (recipeId: string, cookedAt: Timestamp) => {
    await updateDoc(doc(db, 'recipes', recipeId), {
      lastCookedAt: cookedAt,
      cookCount: increment(1),
      updatedAt: serverTimestamp(),
    })
  }, [])

  return { recipes, loading, addRecipe, updateRecipe, deleteRecipe, markCooked }
}
