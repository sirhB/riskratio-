import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      trades: {
        Row: {
          id: string
          user_id: string
          symbol: string
          side: 'Long' | 'Short'
          quantity: number
          entry_price: number
          exit_price: number | null
          trade_date: string
          strategy: string | null
          notes: string | null
          status: 'Open' | 'Closed'
          pnl: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          symbol: string
          side: 'Long' | 'Short'
          quantity: number
          entry_price: number
          exit_price?: number | null
          trade_date: string
          strategy?: string | null
          notes?: string | null
          status?: 'Open' | 'Closed'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          symbol?: string
          side?: 'Long' | 'Short'
          quantity?: number
          entry_price?: number
          exit_price?: number | null
          trade_date?: string
          strategy?: string | null
          notes?: string | null
          status?: 'Open' | 'Closed'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
