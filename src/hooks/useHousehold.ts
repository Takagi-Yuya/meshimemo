import { useState, useEffect, useCallback } from 'react'
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import type { Household } from '@/types'

export function useHousehold(householdId: string | null) {
  const [household, setHousehold] = useState<Household | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!householdId) {
      setHousehold(null)
      setLoading(false)
      return
    }

    const fetchHousehold = async () => {
      const snap = await getDoc(doc(db, 'households', householdId))
      if (snap.exists()) {
        setHousehold({ id: snap.id, ...snap.data() } as Household)
      }
      setLoading(false)
    }

    fetchHousehold()
  }, [householdId])

  const createHousehold = useCallback(
    async (name: string, userId: string): Promise<string> => {
      const householdRef = doc(collection(db, 'households'))
      const household: Omit<Household, 'id'> = {
        name,
        members: [userId],
      }
      await setDoc(householdRef, household)

      // ユーザーに世帯IDを紐づけ
      await updateDoc(doc(db, 'users', userId), { householdId: householdRef.id })

      setHousehold({ id: householdRef.id, ...household })
      return householdRef.id
    },
    [],
  )

  const joinHousehold = useCallback(
    async (inviteCode: string, userId: string): Promise<boolean> => {
      // 招待コード = householdId
      const snap = await getDoc(doc(db, 'households', inviteCode))
      if (!snap.exists()) return false

      await updateDoc(doc(db, 'households', inviteCode), {
        members: arrayUnion(userId),
      })
      await updateDoc(doc(db, 'users', userId), { householdId: inviteCode })

      setHousehold({ id: snap.id, ...snap.data() } as Household)
      return true
    },
    [],
  )

  const getMembers = useCallback(async (memberIds: string[]) => {
    if (memberIds.length === 0) return []
    const q = query(collection(db, 'users'), where('__name__', 'in', memberIds))
    const snap = await getDocs(q)
    return snap.docs.map((d) => ({ id: d.id, ...d.data() }))
  }, [])

  return { household, loading, createHousehold, joinHousehold, getMembers }
}
