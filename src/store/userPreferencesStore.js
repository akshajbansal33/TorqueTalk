import { create } from './zustand';

/* 
  userPreferencesStore (Syllabus Module 2: Introduction to Zustand & State Architecture)
  - Centralized store for user telemetry, browsing history, and saved calculations
  - Demonstrates Zustand action dispatching, selective subscriptions, and localStorage hydration
*/

const STORAGE_KEY = 'torque_user_preferences_v1';

const getInitialState = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (e) {
    console.error('Failed to load user preferences from localStorage', e);
  }
  return {
    recentlyViewedCars: [],
    savedCalculations: [],
    preferredHubCity: 'Mumbai',
    activeCurrency: 'INR',
    notificationsEnabled: true
  };
};

const initial = getInitialState();

export const useUserPreferencesStore = create((set) => ({
  recentlyViewedCars: initial.recentlyViewedCars || [],
  savedCalculations: initial.savedCalculations || [],
  preferredHubCity: initial.preferredHubCity || 'Mumbai',
  activeCurrency: initial.activeCurrency || 'INR',
  notificationsEnabled: initial.notificationsEnabled ?? true,

  // Action: Add car to browsing history (deduplicated, latest first)
  addRecentlyViewed: (car) => {
    if (!car) return;
    set((state) => {
      const filtered = state.recentlyViewedCars.filter((item) => item.id !== car.id);
      const updated = [
        {
          ...car,
          viewedAt: new Date().toISOString()
        },
        ...filtered
      ].slice(0, 8); // Keep last 8 viewed vehicles

      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...state, recentlyViewedCars: updated })
        );
      } catch (err) {
        console.error('Failed to save to localStorage', err);
      }

      return { recentlyViewedCars: updated };
    });
  },

  // Action: Clear browsing history
  clearRecentlyViewed: () => {
    set((state) => {
      const next = { ...state, recentlyViewedCars: [] };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return { recentlyViewedCars: [] };
    });
  },

  // Action: Save an EMI calculation to personal portfolio
  saveCalculation: (calculation) => {
    set((state) => {
      const newCalc = {
        ...calculation,
        id: `calc-${Date.now()}`,
        savedAt: new Date().toLocaleDateString('en-IN')
      };
      const updated = [newCalc, ...state.savedCalculations];
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...state, savedCalculations: updated })
        );
      } catch (e) {
        console.error(e);
      }
      return { savedCalculations: updated };
    });
  },

  // Action: Delete saved calculation
  deleteCalculation: (calcId) => {
    set((state) => {
      const updated = state.savedCalculations.filter((c) => c.id !== calcId);
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ ...state, savedCalculations: updated })
        );
      } catch (e) {
        console.error(e);
      }
      return { savedCalculations: updated };
    });
  },

  // Action: Update preferred regional hub
  setPreferredHubCity: (city) => {
    set((state) => {
      const next = { ...state, preferredHubCity: city };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return { preferredHubCity: city };
    });
  },

  // Action: Toggle push notifications
  toggleNotifications: () => {
    set((state) => {
      const next = { ...state, notificationsEnabled: !state.notificationsEnabled };
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      } catch (e) {
        console.error(e);
      }
      return { notificationsEnabled: !state.notificationsEnabled };
    });
  }
}));
