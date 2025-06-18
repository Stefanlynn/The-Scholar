import multer from 'multer';

// Serverless-safe multer configuration
export function createMulterConfig() {
  // Always use memory storage to avoid filesystem operations
  return {
    storage: multer.memoryStorage(),
    limits: {
      fileSize: 5 * 1024 * 1024, // 5MB limit
    },
    fileFilter: (req: any, file: any, cb: any) => {
      if (file.mimetype.startsWith('image/')) {
        cb(null, true);
      } else {
        cb(new Error('Only image files are allowed!'));
      }
    }
  };
}