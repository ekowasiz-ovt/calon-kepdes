import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/db'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const hasSupabaseConfig = Boolean(supabaseUrl && supabaseAnonKey)

export const supabase = hasSupabaseConfig
  ? createClient<Database>(supabaseUrl as string, supabaseAnonKey as string)
  : null

export { supabaseUrl, supabaseAnonKey }
