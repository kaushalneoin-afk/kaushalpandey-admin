import { create } from 'zustand'
import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api'

interface AuthState {
  user: any
  token: string | null
  isAuthenticated: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => void
  verifyToken: () => Promise<void>
}

export const useAuth = create<AuthState>((set) => ({
  user: null,
  token: typeof window !== 'undefined' ? localStorage.getItem('token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('token') : false,
  
  login: async (username: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, { username, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      set({ token, user, isAuthenticated: true })
    } catch (error) {
      throw error
    }
  },
  
  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, user: null, isAuthenticated: false })
  },
  
  verifyToken: async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      set({ isAuthenticated: false })
      return
    }
    try {
      const response = await axios.post(`${API_URL}/auth/verify`, { token })
      set({ user: response.data.user, isAuthenticated: true })
    } catch {
      localStorage.removeItem('token')
      set({ token: null, user: null, isAuthenticated: false })
    }
  },
}))