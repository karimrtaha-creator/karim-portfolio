import { supabase } from '@/lib/supabase'

const TABLE = 'site_settings'
const ROW_ID = 'main'

export async function fetchProfilePhotoUrl(): Promise<string | null> {
  if (!supabase) return null
  const { data, error } = await supabase.from(TABLE).select('profile_photo_url').eq('id', ROW_ID).maybeSingle()
  if (error || !data) return null
  return data.profile_photo_url
}

export async function updateProfilePhotoUrl(url: string): Promise<void> {
  if (!supabase) throw new Error('Supabase is not configured.')
  const { error } = await supabase
    .from(TABLE)
    .update({ profile_photo_url: url, updated_at: new Date().toISOString() })
    .eq('id', ROW_ID)
  if (error) throw error
}
