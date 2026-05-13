/**
 * Toaster Component
 *
 * @description Toast notification container using Sonner library.
 * Displays toast messages for user feedback and system notifications.
 *
 * @features
 * - Top-right positioning
 * - Custom styling (white background, black text)
 * - Rich colors support for different notification types
 * - Border styling for visual separation
 * - Auto-dismiss functionality
 *
 * @usage
 * Add to root layout, then use toast() function anywhere:
 * import { toast } from 'sonner';
 * toast.success('Operation successful!');
 */
"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="top-right"
      toastOptions={{
        style: {
          background: "white",
          color: "black",
          border: "1px solid #e5e7eb",
        },
        className: "sonner-toast",
      }}
      richColors
    />
  );
}
