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
      cookedDate?: string
    }): Promise<{ id: string; cookedAt: Timestamp }> => {
      const { cookedDate, ...rest } = data
      const cookedAt = cookedDate
        ? Timestamp.fromDate(new Date(cookedDate + 'T12:00:00'))
        : Timestamp.now()
      const docRef = await addDoc(collection(db, 'cookLogs'), {
        ...rest,
        cookedAt,
      })
      return { id: docRef.id, cookedAt }
    },
    [],
  )

  return { cookLogs, loading, addCookLog }
}
