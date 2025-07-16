import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Routine, Task } from '@/types';

interface RoutineState {
  routines: Routine[];
  tasks: Task[];
  addRoutine: (routine: Omit<Routine, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateRoutine: (id: string, updates: Partial<Routine>) => void;
  deleteRoutine: (id: string) => void;
  addTask: (task: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  getTasksForDate: (date: string) => Task[];
  getTasksForRoutine: (routineId: string) => Task[];
}

export const useRoutineStore = create<RoutineState>()(
  persist(
    (set, get) => ({
      routines: [],
      tasks: [],
      addRoutine: (routineData) => {
        const routine: Routine = {
          ...routineData,
          id: Date.now().toString(),
          createdAt: Date.now(),
          updatedAt: Date.now(),
        };
        set((state) => ({
          routines: [...state.routines, routine],
        }));
      },
      updateRoutine: (id, updates) => {
        set((state) => ({
          routines: state.routines.map((routine) =>
            routine.id === id
              ? { ...routine, ...updates, updatedAt: Date.now() }
              : routine
          ),
        }));
      },
      deleteRoutine: (id) => {
        set((state) => ({
          routines: state.routines.filter((routine) => routine.id !== id),
          tasks: state.tasks.filter((task) => task.routineId !== id),
        }));
      },
      addTask: (taskData) => {
        const task: Task = {
          ...taskData,
          id: Date.now().toString(),
        };
        set((state) => ({
          tasks: [...state.tasks, task],
        }));
      },
      updateTask: (id, updates) => {
        set((state) => ({
          tasks: state.tasks.map((task) =>
            task.id === id ? { ...task, ...updates } : task
          ),
        }));
      },
      deleteTask: (id) => {
        set((state) => ({
          tasks: state.tasks.filter((task) => task.id !== id),
        }));
      },
      getTasksForDate: (date) => {
        return get().tasks.filter((task) => task.date === date);
      },
      getTasksForRoutine: (routineId) => {
        return get().tasks.filter((task) => task.routineId === routineId);
      },
    }),
    {
      name: 'routines-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);