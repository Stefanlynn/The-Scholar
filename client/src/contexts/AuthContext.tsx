import { createContext, useContext, useEffect, useState } from 'react'
import { supabase, type AuthUser } from '@/lib/supabase'
import type { User, Session } from '@supabase/supabase-js'
import { setConsentedCookie, getConsentedCookie } from '@/lib/cookies'

interface AuthContextType {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<{ error?: string }>
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error?: string }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error?: string; message?: string }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check remember me status on app load
    const checkRememberMe = () => {
      const rememberMe = getConsentedCookie('scholar_remember_me', 'necessary');
      const expiry = getConsentedCookie('scholar_remember_expiry', 'necessary');
      
      if (rememberMe && expiry) {
        const isExpired = Date.now() > parseInt(expiry);
        if (isExpired) {
          // Clean up expired remember me
          localStorage.removeItem('scholar_remember_me');
          localStorage.removeItem('scholar_remember_expiry');
          // Sign out expired sessions
          supabase.auth.signOut();
        }
      }
    };

    checkRememberMe();

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        user_metadata: session.user.user_metadata
      } : null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ? {
        id: session.user.id,
        email: session.user.email!,
        user_metadata: session.user.user_metadata
      } : null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string, rememberMe: boolean = false) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    
    if (error) {
      return { error: error.message }
    }
    
    // Set localStorage flag for remember me
    if (rememberMe) {
      localStorage.setItem('scholar_remember_me', 'true')
      localStorage.setItem('scholar_remember_expiry', (Date.now() + 30 * 24 * 60 * 60 * 1000).toString()) // 30 days
    } else {
      localStorage.removeItem('scholar_remember_me')
      localStorage.removeItem('scholar_remember_expiry')
    }
    
    return {}
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    
    if (error) {
      return { error: error.message }
    }
    
    return {}
  }

  const signOut = async () => {
    // Clear remember me data on sign out
    localStorage.removeItem('scholar_remember_me');
    localStorage.removeItem('scholar_remember_expiry');
    await supabase.auth.signOut()
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    
    if (error) {
      return { error: error.message }
    }
    
    return { message: 'Password reset email sent successfully' }
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}