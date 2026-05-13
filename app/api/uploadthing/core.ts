import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { auth } from '@/lib/auth';

const f = createUploadthing();

/**
 * UploadThing File Router
 * Define file upload endpoints
 */
export const ourFileRouter = {
  // Product images uploader (Admin only)
  productImage: f({ image: { maxFileSize: '4MB', maxFileCount: 10 } })
    .middleware(async () => {
      // Check if user is admin
      const session = await auth();

      if (!session || !session.user) {
        throw new Error('Unauthorized');
      }

      if (session.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Upload complete for userId:', metadata.userId);
      console.log('File URL:', file.url);

      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // Category images uploader (Admin only)
  categoryImage: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();

      if (!session || !session.user) {
        throw new Error('Unauthorized');
      }

      if (session.user.role !== 'admin') {
        throw new Error('Admin access required');
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Category image uploaded:', file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),

  // User profile image uploader
  profileImage: f({ image: { maxFileSize: '2MB', maxFileCount: 1 } })
    .middleware(async () => {
      const session = await auth();

      if (!session || !session.user) {
        throw new Error('Unauthorized');
      }

      return { userId: session.user.id };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log('Profile image uploaded:', file.url);
      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
