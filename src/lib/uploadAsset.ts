import { supabase } from '@/lib/supabase'

const ASSETS_BUCKET = 'portfolio-assets'
const DEMOS_BUCKET = 'portfolio-demos'

export type AssetKind = 'thumbnail' | 'screenshots' | 'architecture'

const IMAGE_MIME_BY_EXT: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  gif: 'image/gif',
}

/**
 * The Supabase storage-js client silently ignores the `contentType` upload
 * option whenever the upload body is a File/Blob instance — it builds a
 * FormData and appends the file as-is, so the Content-Type actually sent is
 * the browser/OS's own (unreliable, extension-dependent) detection on the
 * original File object, not the option we pass. Rebuilding the body as a
 * fresh Blob with an explicitly-set `type` sidesteps this: that Blob's own
 * `.type` is what ends up on the wire, regardless of what the source File
 * was detected as.
 */
async function withExplicitType(file: File, mimeType: string): Promise<Blob> {
  const bytes = await file.arrayBuffer()
  return new Blob([bytes], { type: mimeType })
}

/** Uploads a project image to Supabase Storage and returns its public URL. */
export async function uploadProjectAsset(file: File, slug: string, kind: AssetKind): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured.')

  const safeSlug = slug.trim() || 'untitled'
  const ext = (file.name.split('.').pop() || 'png').toLowerCase()
  const mimeType = IMAGE_MIME_BY_EXT[ext] ?? file.type ?? 'application/octet-stream'
  const path = `projects/${safeSlug}/${kind}/${Date.now()}.${ext}`
  const body = await withExplicitType(file, mimeType)

  const { error } = await supabase.storage.from(ASSETS_BUCKET).upload(path, body, {
    cacheControl: '3600',
    upsert: false,
    contentType: mimeType,
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
  const body = await withExplicitType(file, 'text/html')

  const { error } = await supabase.storage.from(DEMOS_BUCKET).upload(path, body, {
    cacheControl: '3600',
    upsert: true,
    contentType: 'text/html',
  })
  if (error) throw error

  const { data } = supabase.storage.from(DEMOS_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
