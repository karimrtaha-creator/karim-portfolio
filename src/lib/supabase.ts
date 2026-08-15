import { createClient, type SupabaseClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabaseConfigured = Boolean(url && anonKey)

/**
 * Only imported from admin routes — the public site never touches this, so
 * a missing/misconfigured Supabase project can never break a visitor's page
 * load, only the admin area.
 */
export const supabase: SupabaseClient | null = supabaseConfigured ? createClient(url!, anonKey!) : null
