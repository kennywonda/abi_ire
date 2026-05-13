/**
 * UploadThing React Helpers
 * 
 * @description React hooks and utilities for UploadThing file uploads.
 * Provides type-safe upload functionality based on the file router.
 * 
 * @exports
 * - useUploadThing: React hook for file uploads with progress tracking
 * - uploadFiles: Function for programmatic file uploads
 * 
 * @features
 * - Type-safe file uploads based on OurFileRouter
 * - Upload progress tracking
 * - File validation based on router config
 * - Error handling
 * 
 * @usage
 * const { startUpload, isUploading } = useUploadThing('imageUploader')
 * await startUpload(files)
 */
import { generateReactHelpers } from '@uploadthing/react';
import type { OurFileRouter } from '@/app/api/uploadthing/core';

export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();
