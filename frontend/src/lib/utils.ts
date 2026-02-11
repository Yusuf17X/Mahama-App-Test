import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Determines if a URL is absolute (starts with http:// or https://)
 * @param url - The URL to check
 * @returns true if the URL is absolute, false otherwise
 */
export function isAbsoluteUrl(url: string | undefined | null): boolean {
  if (!url) return false;
  return url.startsWith("http://") || url.startsWith("https://");
}

/**
 * Resolves an image URL to the correct format
 * - If the URL is absolute (http/https), returns it as-is
 * - If the URL is relative, prepends the API base URL
 * @param photoUrl - The photo URL from the backend
 * @returns The resolved URL to use for the img src
 */
export function resolveImageUrl(photoUrl: string | undefined | null): string | null {
  if (!photoUrl) return null;
  
  // If it's already an absolute URL, use it as-is
  if (isAbsoluteUrl(photoUrl)) {
    return photoUrl;
  }
  
  // For relative URLs, if they already start with http(s) in the path
  // (e.g., "/user-challenges/img/https://example.com/..."), 
  // this is likely an error - extract and return the embedded URL
  const httpMatch = photoUrl.match(/https?:\/\/.+/);
  if (httpMatch) {
    return httpMatch[0];
  }
  
  // Otherwise, it's a valid relative path - return as-is
  // The backend should already be providing absolute URLs for uploaded images
  return photoUrl;
}
