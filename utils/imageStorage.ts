import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';

const COVERS_DIR = `${FileSystem.documentDirectory}book-covers/`;

// Ensure covers directory exists
const ensureCoversDirectory = async () => {
  const dirInfo = await FileSystem.getInfoAsync(COVERS_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(COVERS_DIR, { intermediates: true });
  }
};

// Download and save image locally
export const downloadAndSaveImage = async (url: string, bookId: string): Promise<string | null> => {
  try {
    if (Platform.OS === 'web') {
      // On web, we can't save files locally, so return the original URL
      return url;
    }

    await ensureCoversDirectory();
    
    const fileExtension = url.split('.').pop()?.toLowerCase() || 'jpg';
    const fileName = `${bookId}.${fileExtension}`;
    const localPath = `${COVERS_DIR}${fileName}`;
    
    // Download the image
    const downloadResult = await FileSystem.downloadAsync(url, localPath);
    
    if (downloadResult.status === 200) {
      return localPath;
    } else {
      console.error('Failed to download image:', downloadResult.status);
      return null;
    }
  } catch (error) {
    console.error('Error downloading image:', error);
    return null;
  }
};

// Delete local image
export const deleteLocalImage = async (localPath: string): Promise<void> => {
  try {
    if (Platform.OS === 'web') {
      // On web, no local files to delete
      return;
    }

    const fileInfo = await FileSystem.getInfoAsync(localPath);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(localPath);
    }
  } catch (error) {
    console.error('Error deleting local image:', error);
  }
};

// Get image source (local path or URL)
export const getImageSource = (book: { coverUrl?: string; localCoverPath?: string }): string | undefined => {
  if (Platform.OS === 'web') {
    return book.coverUrl;
  }
  
  return book.localCoverPath || book.coverUrl;
};

// Check if local image exists
export const checkLocalImageExists = async (localPath: string): Promise<boolean> => {
  try {
    if (Platform.OS === 'web') {
      return false;
    }

    const fileInfo = await FileSystem.getInfoAsync(localPath);
    return fileInfo.exists;
  } catch (error) {
    return false;
  }
};