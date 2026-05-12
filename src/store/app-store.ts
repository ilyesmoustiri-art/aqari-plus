import { create } from "zustand";

export type PageView =
  | "home"
  | "properties"
  | "property-detail"
  | "my-properties"
  | "add-property"
  | "taxes"
  | "dashboard"
  | "contact-requests"
  | "messages"
  | "login"
  | "register"
  | "profile";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: string;
  avatar: string | null;
  active: boolean;
  createdAt: string;
}

interface AppState {
  currentPage: PageView;
  selectedPropertyId: string | null;
  searchQuery: string;
  filterCity: string;
  filterType: string;
  filterMinPrice: string;
  filterMaxPrice: string;
  filterRooms: string;
  sidebarOpen: boolean;

  // Auth state
  user: User | null;
  loadingAuth: boolean;
  isAuthenticated: boolean;

  // Unread counts
  unreadMessages: number;
  unreadContactRequests: number;

  setCurrentPage: (page: PageView) => void;
  setSelectedPropertyId: (id: string | null) => void;
  setSearchQuery: (query: string) => void;
  setFilterCity: (city: string) => void;
  setFilterType: (type: string) => void;
  setFilterMinPrice: (price: string) => void;
  setFilterMaxPrice: (price: string) => void;
  setFilterRooms: (rooms: string) => void;
  setSidebarOpen: (open: boolean) => void;
  resetFilters: () => void;

  // Auth actions
  setUser: (user: User | null) => void;
  setLoadingAuth: (loading: boolean) => void;
  login: (user: User) => void;
  logout: () => void;

  // Notification actions
  setUnreadMessages: (count: number) => void;
  setUnreadContactRequests: (count: number) => void;
}

export const useAppStore = create<AppState>((set) => ({
  currentPage: "home",
  selectedPropertyId: null,
  searchQuery: "",
  filterCity: "الكل",
  filterType: "الكل",
  filterMinPrice: "",
  filterMaxPrice: "",
  filterRooms: "",
  sidebarOpen: false,

  // Auth initial state
  user: null,
  loadingAuth: true,
  isAuthenticated: false,

  // Notification initial state
  unreadMessages: 0,
  unreadContactRequests: 0,

  setCurrentPage: (page) => set({ currentPage: page }),
  setSelectedPropertyId: (id) => set({ selectedPropertyId: id }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setFilterCity: (city) => set({ filterCity: city }),
  setFilterType: (type) => set({ filterType: type }),
  setFilterMinPrice: (price) => set({ filterMinPrice: price }),
  setFilterMaxPrice: (price) => set({ filterMaxPrice: price }),
  setFilterRooms: (rooms) => set({ filterRooms: rooms }),
  setSidebarOpen: (open) => set({ sidebarOpen: open }),
  resetFilters: () =>
    set({
      searchQuery: "",
      filterCity: "الكل",
      filterType: "الكل",
      filterMinPrice: "",
      filterMaxPrice: "",
      filterRooms: "",
    }),

  // Auth actions
  setUser: (user) => set({ user, isAuthenticated: !!user, loadingAuth: false }),
  setLoadingAuth: (loading) => set({ loadingAuth: loading }),
  login: (user) => set({ user, isAuthenticated: true, loadingAuth: false }),
  logout: () => set({ user: null, isAuthenticated: false, currentPage: "home" }),

  // Notification actions
  setUnreadMessages: (count) => set({ unreadMessages: count }),
  setUnreadContactRequests: (count) => set({ unreadContactRequests: count }),
}));
