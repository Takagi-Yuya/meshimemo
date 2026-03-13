import { useCallback } from 'react'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'
import { compressImage } from '@/lib/utils'

export function usePhotos() {
  const uploadPhoto = useCallback(
    async (file: File, path: string): Promise<string> => {
      const compressed = await compressImage(file)
      const storageRef = ref(storage, path)
      await uploadBytes(storageRef, compressed)
      return getDownloadURL(storageRef)
    },
    [],
  )

  const uploadPhotos = useCallback(
    async (files: File[], basePath: string): Promise<string[]> => {
      const promises = files.map((file, i) =>
        uploadPhoto(file, `${basePath}/${Date.now()}_${i}.jpg`),
      )
      return Promise.all(promises)
    },
    [uploadPhoto],
  )

  return { uploadPhoto, uploadPhotos }
}
