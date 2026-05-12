import { create } from 'zustand'

interface AppState {
  activeTab: 'home' | 'properties' | 'property-detail' | 'tax' | 'dashboard'
  selectedPropertyId: string | null
  setActiveTab: (tab: AppState['activeTab']) => void
  setSelectedPropertyId: (id: string | null) => void
}

export const useAppStore = create<AppState>((set) => ({
  activeTab: 'home',
  selectedPropertyId: null,
  setActiveTab: (tab) => set({ activeTab: tab }),
  setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),
}))
