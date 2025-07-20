// This is now a deprecated file. Please use the new publitio.js instead.
// This file is kept temporarily for backward compatibility.

import { 
  uploadFile as uploadToPublit,
  deleteFile as deleteFromPublit,
  getFileInfo as getPublitFileInfo,
  getOptimizedUrl as getOptimizedImageUrl,
  PublitioError
} from './publitio';

export { 
  uploadToPublit,
  deleteFromPublit,
  getPublitFileInfo,
  getOptimizedImageUrl,
  PublitioError
};

// Warning message in console during development
if (import.meta.env.DEV) {
  console.warn(
    'Warning: The publit.js module is deprecated. Please use publitio.js instead. ' +
    'This file will be removed in a future update.'
  );
}
