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
 * The Supabase storage-js client builds a multipart/form-data request
 * whenever the upload body is a File/Blob instance, appending the file as a
 * form part. Diagnosed directly against this project's storage backend:
 * even with the form part's own Blob.type correctly set to 'text/html' and
 * the resulting storage.objects metadata row correctly recording
 * mimetype: 'text/html', the object is still served with
 * Content-Type: text/plain — reproducibly, across multiple never-before-used
 * object keys, ruling out both a client-side type bug and stale/cached
 * state. The Postgres bookkeeping record and the actual served bytes are
 * simply fed from different signals on this backend, and only the outer
 * HTTP request's real Content-Type header — not anything carried inside a
 * multipart body — reaches the one that matters.
 *
 * Passing a raw Uint8Array (neither a Blob nor FormData) instead of the File
 * avoids the multipart branch entirely: storage-js then sets
 * `headers['content-type']` directly as a genuine header on the request.
 */
async function readAsBytes(file: File): Promise<Uint8Array> {
  return new Uint8Array(await file.arrayBuffer())
}

/** Uploads a project image to Supabase Storage and returns its public URL. */
export async function uploadProjectAsset(file: File, slug: string, kind: AssetKind): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured.')

  const safeSlug = slug.trim() || 'untitled'
  const ext = (file.name.split('.').pop() || 'png').toLowerCase()
  const mimeType = IMAGE_MIME_BY_EXT[ext] ?? file.type ?? 'application/octet-stream'
  const path = `projects/${safeSlug}/${kind}/${Date.now()}.${ext}`
  const body = await readAsBytes(file)

  const { error } = await supabase.storage.from(ASSETS_BUCKET).upload(path, body, {
    cacheControl: '3600',
    upsert: false,
    contentType: mimeType,
  })
  if (error) throw error

  const { data } = supabase.storage.from(ASSETS_BUCKET).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Uploads a standalone HTML demo file to its own dedicated bucket and
 * returns its public URL.
 *
 * Each upload gets a fresh, never-reused path rather than upserting a fixed
 * `demo.html` filename. This isn't just to avoid orphaned files — an
 * observed, reproducible issue on this backend is that a given object key,
 * once served with a wrong Content-Type, can keep serving that same wrong
 * header on subsequent uploads to the identical key even when the write is
 * verifiably fresh (new ETag/Last-Modified) and the object's own metadata
 * record is correct. Writing to a brand-new key every time sidesteps that
 * entirely — there is no stale state to inherit.
 */
export async function uploadProjectDemo(file: File, slug: string): Promise<string> {
  if (!supabase) throw new Error('Supabase is not configured.')

  const isHtml = file.type === 'text/html' || file.name.toLowerCase().endsWith('.html') || file.name.toLowerCase().endsWith('.htm')
  if (!isHtml) throw new Error('Only .html files are supported for demo uploads.')

  const safeSlug = slug.trim() || 'untitled'
  const path = `projects/${safeSlug}/demo-${Date.now()}.html`
  const body = await readAsBytes(file)

  const { error } = await supabase.storage.from(DEMOS_BUCKET).upload(path, body, {
    cacheControl: '3600',
    upsert: false,
    contentType: 'text/html',
  })
  if (error) throw error

  const { data } = supabase.storage.from(DEMOS_BUCKET).getPublicUrl(path)
  return data.publicUrl
}
