import { create } from 'zustand'

interface JwtFormData {
  algorithm: string
  issuer: string
  subject: string
  audience: string
  expiration: string
  privateKey: string
}

interface AppState {
  // JWT Generation
  jwtFormData: JwtFormData
  jwtToken: string | null
  
  // Salesforce Authentication
  accessToken: string | null
  instanceUrl: string | null
  
  // JWT Form Actions
  setJwtFormData: (formData: Partial<JwtFormData>) => void
  resetJwtForm: () => void
  
  // Token Actions
  setJwtToken: (token: string | null) => void
  setAccessToken: (token: string | null) => void
  setInstanceUrl: (url: string | null) => void
  clearAll: () => void
}

const defaultJwtFormData: JwtFormData = {
  algorithm: "RS256",
  issuer: "",
  subject: "",
  audience: "https://login.salesforce.com",
  expiration: "3600",
  privateKey: ""
}

export const useAppStore = create<AppState>((set, get) => ({
  // Initial state
  jwtFormData: defaultJwtFormData,
  jwtToken: null,
  accessToken: null,
  instanceUrl: null,
  
  // JWT Form Actions
  setJwtFormData: (formData) => set((state) => ({
    jwtFormData: { ...state.jwtFormData, ...formData }
  })),
  resetJwtForm: () => set({ jwtFormData: defaultJwtFormData }),
  
  // Token Actions
  setJwtToken: (token) => set({ jwtToken: token }),
  setAccessToken: (token) => set({ accessToken: token }),
  setInstanceUrl: (url) => set({ instanceUrl: url }),
  clearAll: () => set({ 
    jwtFormData: defaultJwtFormData,
    jwtToken: null, 
    accessToken: null, 
    instanceUrl: null 
  }),
}))