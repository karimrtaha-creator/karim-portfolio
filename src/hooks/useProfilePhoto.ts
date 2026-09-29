import { useEffect, useState } from 'react'
import { fetchProfilePhotoUrl } from '@/lib/siteSettingsApi'

let cachedUrl: string | null | undefined
let inflight: Promise<string | null> | null = null

/** Public site's profile photo — absent (undefined/null) renders nothing, never a broken image. */
export function useProfilePhoto() {
  const [photoUrl, setPhotoUrl] = useState<string | null>(cachedUrl ?? null)

  useEffect(() => {
    if (cachedUrl !== undefined) return
    inflight ??= fetchProfilePhotoUrl()
    let cancelled = false
    inflight.then((result) => {
      if (cancelled) return
      cachedUrl = result
      setPhotoUrl(result)
    })
    return () => {
      cancelled = true
    }
  }, [])

  return { photoUrl }
}
