import 'react-native-url-polyfill/auto'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = "https://hfzglkgfxrazcllmozpq.supabase.co"
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhmemdsa2dmeHJhemNsbG1venBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDMxNjg5OTcsImV4cCI6MjAxODc0NDk5N30.uk85lioGtiZL60szhfyJOc1qTgq3L4WhClIPlXR1hRA"

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})