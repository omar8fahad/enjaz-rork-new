import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Book } from '@/types';
import { downloadAndSaveImage, deleteLocalImage } from '@/utils/imageStorage';

interface BookState {
  books: Book[];
  addBook: (book: Omit<Book, 'id' | 'startDate' | 'readingSessions' | 'localCoverPath'>) => Promise<void>;
  updateBook: (id: string, updates: Partial<Book>) => Promise<void>;
  deleteBook: (id: string) => Promise<void>;
  updateReadingProgress: (id: string, currentPage: number) => void;
  getActiveBooks: () => Book[];
  getCompletedBooks: () => Book[];
}

export const useBookStore = create<BookState>()(
  persist(
    (set, get) => ({
      books: [],
      addBook: async (bookData) => {
        const bookId = Date.now().toString();
        let localCoverPath: string | undefined;
        
        // Download and save cover image locally if URL is provided
        if (bookData.coverUrl) {
          const savedPath = await downloadAndSaveImage(bookData.coverUrl, bookId);
          if (savedPath) {
            localCoverPath = savedPath;
          }
        }
        
        const book: Book = {
          ...bookData,
          id: bookId,
          startDate: Date.now(),
          currentPage: 0,
          readingSessions: [],
          ...(localCoverPath && { localCoverPath }),
        };
        
        set((state) => ({
          books: [...state.books, book],
        }));
      },
      updateBook: async (id, updates) => {
        const currentBook = get().books.find(b => b.id === id);
        if (!currentBook) return;
        
        let localCoverPath = currentBook.localCoverPath;
        
        // If cover URL is being updated, download new image
        if (updates.coverUrl && updates.coverUrl !== currentBook.coverUrl) {
          // Delete old local image if it exists
          if (currentBook.localCoverPath) {
            await deleteLocalImage(currentBook.localCoverPath);
          }
          
          // Download new image
          const savedPath = await downloadAndSaveImage(updates.coverUrl, id);
          if (savedPath) {
            localCoverPath = savedPath;
          }
        }
        
        set((state) => ({
          books: state.books.map((book) =>
            book.id === id 
              ? { 
                  ...book, 
                  ...updates, 
                  ...(localCoverPath && { localCoverPath })
                } 
              : book
          ),
        }));
      },
      deleteBook: async (id) => {
        const book = get().books.find(b => b.id === id);
        
        // Delete local cover image if it exists
        if (book?.localCoverPath) {
          await deleteLocalImage(book.localCoverPath);
        }
        
        set((state) => ({
          books: state.books.filter((book) => book.id !== id),
        }));
      },
      updateReadingProgress: (id, currentPage) => {
        set((state) => {
          const book = state.books.find((b) => b.id === id);
          if (!book) return state;
          
          const now = Date.now();
          const pagesRead = currentPage - book.currentPage;
          
          // Only record if pages were actually read
          if (pagesRead <= 0) {
            return {
              books: state.books.map((b) =>
                b.id === id ? { ...b, currentPage } : b
              ),
            };
          }
          
          const newSession = {
            date: now,
            pagesRead,
          };
          
          const isCompleted = currentPage >= book.totalPages;
          
          return {
            books: state.books.map((b) =>
              b.id === id
                ? {
                    ...b,
                    currentPage,
                    lastReadDate: now,
                    ...(isCompleted && { completedDate: now }),
                    readingSessions: [...b.readingSessions, newSession],
                  }
                : b
            ),
          };
        });
      },
      getActiveBooks: () => {
        return get().books.filter((book) => !book.completedDate);
      },
      getCompletedBooks: () => {
        return get().books.filter((book) => book.completedDate);
      },
    }),
    {
      name: 'books-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);