import React, { createContext, useContext, useEffect, useState } from 'react'
import { Session, User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'
import { Profile } from '../lib/supabase'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string, firstName: string, lastName: string, role: string) => Promise<void>
  signOut: () => Promise<void>
  signInWithDemo: (role: 'admin' | 'pm' | 'team' | 'client') => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Provider component
export function SupabaseAuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setSession(session)
        setUser(session?.user ?? null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
        return
      }

      if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error
      toast.success('Welcome back!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign in')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signUp = async (email: string, password: string, firstName: string, lastName: string, role: string) => {
    try {
      setLoading(true)
      
      // Sign up the user
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        // Create profile
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              id: data.user.id,
              email: email,
              first_name: firstName,
              last_name: lastName,
              role: role as 'admin' | 'project_manager' | 'team_member' | 'client',
            }
          ])

        if (profileError) {
          console.error('Error creating profile:', profileError)
        }
      }

      toast.success('Account created successfully!')
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signOut = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
      
      setUser(null)
      setProfile(null)
      setSession(null)
      toast.success('Signed out successfully')
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out')
      throw error
    } finally {
      setLoading(false)
    }
  }

  const signInWithDemo = async (role: 'admin' | 'pm' | 'team' | 'client') => {
    const demoUsers = {
      admin: { email: 'admin@nexaflow.com', password: 'demo123' },
      pm: { email: 'pm@nexaflow.com', password: 'demo123' },
      team: { email: 'sarah@nexaflow.com', password: 'demo123' },
      client: { email: 'client@nexaflow.com', password: 'demo123' },
    }

    const demoUser = demoUsers[role]
    if (demoUser) {
      await signIn(demoUser.email, demoUser.password)
    }
  }

  const value: AuthContextType = {
    user,
    profile,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    signInWithDemo,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}