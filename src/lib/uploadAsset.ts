import { supabase } from '@/lib/supabase'

const ASSETS_BUCKET = 'portfolio-assets'
const DEMOS_BUCKET = 'portfolio-demos'

export type AssetKind = 'thumbnail' | 'screenshots' | 'architecture'

/** Uploads a project image to Supabase Storage and returns its public URL. */
export async function uploadProjectAsset(file: File, slug: string, kind: AssetKind): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured.')

  const safeSlug = slug.trim() || 'untitled'
  const ext = file.name.split('.').pop() || 'png'
  const path = `projects/${safeSlug}/${kind}/${Date.now()}.${ext}`

  const { error } = await supabase.storage.from(ASSETS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  })
  if (error) throw error

  const { data } = supabase.storage.from(ASSETS_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/** Uploads a standalone HTML demo file to its own dedicated bucket and
 *  returns its public URL. Re-uploading for the same project's slug replaces
 *  the previous demo rather than accumulating orphaned files. */
export async function uploadProjectDemo(file: File, slug: string): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured.')

  const isHtml = file.type === 'text/html' || file.name.toLowerCase().endsWith('.html') || file.name.toLowerCase().endsWith('.htm')
  if (!isHtml) throw new Error('Only .html files are supported for demo uploads.')

  const safeSlug = slug.trim() || 'untitled'
  const path = `projects/${safeSlug}/demo.html`

  const { error } = await supabase.storage.from(DEMOS_BUCKET).upload(path, file, {
    cacheControl: '3600',
    upsert: true,
    contentType: 'text/html',
  })
  if (error) throw error

  const { data } = supabase.storage.from(DEMOS_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
