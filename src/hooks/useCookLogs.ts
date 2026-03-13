import { useState, useEffect, useCallback } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  addDoc,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { CookLog } from '@/types'

export function useCookLogs(householdId: string | null) {
  const [cookLogs, setCookLogs] = useState<CookLog[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!householdId) {
      setCookLogs([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, 'cookLogs'),
      where('householdId', '==', householdId),
      orderBy('cookedAt', 'desc'),
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as CookLog[]
      setCookLogs(data)
      setLoading(false)
    })

    return unsubscribe
  }, [householdId])

  const addCookLog = useCallback(
    async (data: {
      recipeId: string
      householdId: string
      cookedBy: string
      photos: string[]
      memo: string
    }): Promise<{ id: string; cookedAt: Timestamp }> => {
      const cookedAt = Timestamp.now()
      const docRef = await addDoc(collection(db, 'cookLogs'), {
        ...data,
        cookedAt,
      })
      return { id: docRef.id, cookedAt }
    },
    [],
  )

  return { cookLogs, loading, addCookLog }
}
