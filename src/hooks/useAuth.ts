import { useState, useEffect } from 'react'
import { onAuthStateChanged, signInWithPopup, signOut, type User as FirebaseUser } from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, googleProvider, db } from '@/lib/firebase'
import type { User } from '@/types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser)
      if (fbUser) {
        const userRef = doc(db, 'users', fbUser.uid)
        const userSnap = await getDoc(userRef)

        if (userSnap.exists()) {
          setUser({ id: fbUser.uid, ...userSnap.data() } as User)
        } else {
          const newUser: Omit<User, 'id'> = {
            name: fbUser.displayName ?? '名無し',
            photoURL: fbUser.photoURL,
            householdId: null,
          }
          await setDoc(userRef, newUser)
          setUser({ id: fbUser.uid, ...newUser })
        }
      } else {
        setUser(null)
      }
      setLoading(false)
    })
    return unsubscribe
  }, [])

  const login = () => signInWithPopup(auth, googleProvider)
  const logout = () => signOut(auth)

  return { user, firebaseUser, loading, login, logout }
}
