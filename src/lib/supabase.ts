import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigured = Boolean(url && anonKey)

/**
 * Used by both the admin area and the public site — the public site reads
 * published projects and the profile photo from here, but always through a
 * hook that falls back to the bundled `src/data/projects.ts` snapshot (see
 * usePublishedProjects.ts / useProfilePhoto.ts), so a missing/misconfigured
 * Supabase project can never leave a visitor looking at a broken page, only
 * a stale one.
 */
export const supabase: SupabaseClient | null = supabaseConfigured ? createClient(url!, anonKey!) : null
