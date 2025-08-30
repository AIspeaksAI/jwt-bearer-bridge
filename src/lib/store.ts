import { create } from 'zustand'

interface AppState {
  jwtToken: string | null
  accessToken: string | null
  instanceUrl: string | null
  setJwtToken: (token: string | null) => void
  setAccessToken: (token: string | null) => void
  setInstanceUrl: (url: string | null) => void
  clearAll: () => void
}

export const useAppStore = create<AppState>((set) => ({
  jwtToken: null,
  accessToken: null,
  instanceUrl: null,
  setJwtToken: (token) => set({ jwtToken: token }),
  setAccessToken: (token) => set({ accessToken: token }),
  setInstanceUrl: (url) => set({ instanceUrl: url }),
  clearAll: () => set({ jwtToken: null, accessToken: null, instanceUrl: null }),
}))