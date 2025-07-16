import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { QuranPage } from '@/types';

interface QuranState {
  pages: QuranPage[];
  initializePages: () => void;
  updatePageRead: (pageId: number, isRead: boolean) => void;
  updatePageMemorized: (pageId: number, isMemorized: boolean) => void;
  updatePageRevised: (pageId: number, isRevised: boolean) => void;
  getStats: () => {
    totalRead: number;
    totalMemorized: number;
    totalRevised: number;
    completionPercentage: number;
  };
  getPagesToRevise: (limit?: number) => QuranPage[];
  getReadPages: () => QuranPage[];
  getMemorizedPages: () => QuranPage[];
  getRevisedPages: () => QuranPage[];
}

// Initialize with 604 pages
const createInitialPages = (): QuranPage[] => {
  return Array.from({ length: 604 }, (_, i) => ({
    id: i + 1,
    isRead: false,
    isMemorized: false,
    isRevised: false,
  }));
};

export const useQuranStore = create<QuranState>()(
  persist(
    (set, get) => ({
      pages: [],
      initializePages: () => {
        set({ pages: createInitialPages() });
      },
      updatePageRead: (pageId, isRead) => {
        set((state) => ({
          pages: state.pages.map((page) => {
            if (page.id === pageId) {
              const now = Date.now();
              return {
                ...page,
                isRead,
                ...(isRead && { lastRead: now }),
              };
            }
            return page;
          }),
        }));
      },
      updatePageMemorized: (pageId, isMemorized) => {
        set((state) => ({
          pages: state.pages.map((page) => {
            if (page.id === pageId) {
              const now = Date.now();
              return {
                ...page,
                isMemorized,
                // لا تسجل التلاوة تلقائياً عند الحفظ
                ...(isMemorized && { lastMemorized: now }),
                // إذا تم إلغاء الحفظ، يتم إلغاء المراجعة أيضاً
                ...(!isMemorized && { isRevised: false }),
              };
            }
            return page;
          }),
        }));
      },
      updatePageRevised: (pageId, isRevised) => {
        set((state) => ({
          pages: state.pages.map((page) => {
            if (page.id === pageId) {
              const now = Date.now();
              return {
                ...page,
                isRevised,
                ...(isRevised && { lastRevised: now }),
              };
            }
            return page;
          }),
        }));
      },
      getStats: () => {
        const pages = get().pages;
        const totalRead = pages.filter((p) => p.isRead).length;
        const totalMemorized = pages.filter((p) => p.isMemorized).length;
        const totalRevised = pages.filter((p) => p.isRevised).length;
        const completionPercentage = (totalMemorized / 604) * 100;
        
        return {
          totalRead,
          totalMemorized,
          totalRevised,
          completionPercentage,
        };
      },
      getPagesToRevise: (limit = 10) => {
        const memorizedPages = get().pages.filter(
          (p) => p.isMemorized
        );
        
        // Sort by last revised date (oldest first)
        return [...memorizedPages]
          .sort((a, b) => {
            const aTime = a.lastRevised || a.lastMemorized || 0;
            const bTime = b.lastRevised || b.lastMemorized || 0;
            return aTime - bTime;
          })
          .slice(0, limit);
      },
      getReadPages: () => {
        return get().pages.filter((p) => p.isRead);
      },
      getMemorizedPages: () => {
        return get().pages.filter((p) => p.isMemorized);
      },
      getRevisedPages: () => {
        return get().pages.filter((p) => p.isRevised);
      },
    }),
    {
      name: 'quran-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => {
        return (state) => {
          // If no pages exist, initialize them
          if (!state || !state.pages || state.pages.length === 0) {
            state?.initializePages();
          } else {
            // Migrate old data structure if needed
            const needsMigration = state.pages.some((page: any) => 
              page.status !== undefined
            );
            
            if (needsMigration) {
              const migratedPages = state.pages.map((page: any) => ({
                id: page.id,
                isRead: page.status === 'read' || page.status === 'memorized' || page.status === 'revised',
                isMemorized: page.status === 'memorized' || page.status === 'revised',
                isRevised: page.status === 'revised',
                lastRead: page.lastRead,
                lastMemorized: page.lastMemorized,
                lastRevised: page.lastRevised,
              }));
              
              state.pages = migratedPages;
            }
          }
        };
      },
    }
  )
);