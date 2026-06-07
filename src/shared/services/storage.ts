import AsyncStorage from '@react-native-async-storage/async-storage';
import { logger } from './logger';

const STORAGE_KEY = '@byokos:v1:appstate';
const SETTINGS_KEY = '@byokos:v1:settings';

export async function loadState<T>(): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    logger.error('Failed to load state from storage', { err: String(err) });
    return null;
  }
}

export async function saveState<T>(state: T): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (err) {
    logger.error('Failed to save state to storage', { err: String(err) });
  }
}

export async function loadSettings<T>(): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(SETTINGS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as T;
  } catch (err) {
    logger.error('Failed to load settings from storage', { err: String(err) });
    return null;
  }
}

export async function saveSettings<T>(settings: T): Promise<void> {
  try {
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    logger.error('Failed to save settings to storage', { err: String(err) });
  }
}

export async function clearAllStorage(): Promise<void> {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEY, SETTINGS_KEY]);
    logger.info('All storage cleared');
  } catch (err) {
    logger.error('Failed to clear storage', { err: String(err) });
  }
}

export async function exportData(): Promise<string | null> {
  try {
    const state = await AsyncStorage.getItem(STORAGE_KEY);
    return state;
  } catch (err) {
    logger.error('Failed to export data', { err: String(err) });
    return null;
  }
}

export async function importData(data: string): Promise<boolean> {
  try {
    const parsed = JSON.parse(data);
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
    logger.info('Data imported successfully');
    return true;
  } catch (err) {
    logger.error('Failed to import data', { err: String(err) });
    return false;
  }
}
