import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let cachedClient: SupabaseClient | null = null

export const getSupabaseClient = (): SupabaseClient => {
  if (cachedClient) return cachedClient

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL/anon key is not set. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.')
  }

  cachedClient = createClient(supabaseUrl, supabaseAnonKey)
  return cachedClient
}
