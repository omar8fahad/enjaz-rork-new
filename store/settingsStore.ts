import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppSettings } from '@/types';
import { colors } from '@/constants/colors';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

interface SettingsState {
  settings: AppSettings;
  setTheme: (theme: AppSettings['theme']) => void;
  setAccentColor: (color: string) => void;
  setFontSize: (size: number) => void;
  toggleNotifications: (enabled: boolean) => void;
  setDailyReminderTime: (time: string) => void;
  requestNotificationPermissions: () => Promise<boolean>;
  scheduleDailyReminder: () => Promise<void>;
  cancelDailyReminder: () => Promise<void>;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      settings: {
        theme: 'andalusianMosaic',
        accentColor: colors.andalusianMosaic.primary,
        fontSize: 16,
        notifications: {
          enabled: true,
          dailyReminderTime: '08:00',
        },
      },
      setTheme: (theme) => 
        set((state) => ({
          settings: { ...state.settings, theme }
        })),
      setAccentColor: (accentColor) => 
        set((state) => ({
          settings: { ...state.settings, accentColor }
        })),
      setFontSize: (fontSize) => 
        set((state) => ({
          settings: { ...state.settings, fontSize }
        })),
      toggleNotifications: (enabled) => 
        set((state) => {
          const newState = {
            settings: { 
              ...state.settings, 
              notifications: { 
                ...state.settings.notifications, 
                enabled 
              } 
            }
          };
          
          // Handle notification scheduling
          if (enabled) {
            // Schedule notifications when enabled
            setTimeout(() => {
              const store = useSettingsStore.getState();
              store.scheduleDailyReminder();
            }, 100);
          } else {
            // Cancel notifications when disabled
            setTimeout(() => {
              const store = useSettingsStore.getState();
              store.cancelDailyReminder();
            }, 100);
          }
          
          return newState;
        }),
      setDailyReminderTime: (dailyReminderTime) => 
        set((state) => {
          const newState = {
            settings: { 
              ...state.settings, 
              notifications: { 
                ...state.settings.notifications, 
                dailyReminderTime 
              } 
            }
          };
          
          // Reschedule notification with new time
          if (state.settings.notifications.enabled) {
            setTimeout(() => {
              const store = useSettingsStore.getState();
              store.scheduleDailyReminder();
            }, 100);
          }
          
          return newState;
        }),
      
      requestNotificationPermissions: async () => {
        if (Platform.OS === 'web') {
          return true; // Web doesn't need explicit permission request for our use case
        }
        
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        
        if (existingStatus !== 'granted') {
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
        
        return finalStatus === 'granted';
      },
      
      scheduleDailyReminder: async () => {
        if (Platform.OS === 'web') {
          return; // Skip notification scheduling on web
        }
        
        try {
          // Cancel existing notifications first
          await Notifications.cancelAllScheduledNotificationsAsync();
          
          const state = useSettingsStore.getState();
          if (!state.settings.notifications.enabled) {
            return;
          }
          
          const [hours, minutes] = state.settings.notifications.dailyReminderTime.split(':').map(Number);
          
          // Schedule daily notification
          await Notifications.scheduleNotificationAsync({
            content: {
              title: 'تذكير يومي',
              body: 'حان وقت مراجعة روتينك اليومي ومتابعة تقدمك',
              sound: 'default',
            },
            trigger: {
              type: 'calendar',
              hour: hours,
              minute: minutes,
              repeats: true,
            } as Notifications.CalendarTriggerInput,
          });
          
          console.log('Daily reminder scheduled for', `${hours}:${minutes}`);
        } catch (error) {
          console.error('Error scheduling notification:', error);
        }
      },
      
      cancelDailyReminder: async () => {
        if (Platform.OS === 'web') {
          return;
        }
        
        try {
          await Notifications.cancelAllScheduledNotificationsAsync();
          console.log('Daily reminders cancelled');
        } catch (error) {
          console.error('Error cancelling notifications:', error);
        }
      },
    }),
    {
      name: 'settings-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);