import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function extractDriveId(url: string): string | null {
  if (!url) return null
  const patterns = [
    /\/d\/(.+?)\//,
    /[?&]id=([^&]+)/,
    /\/file\/d\/([^/]+)/,
  ]
  for (const p of patterns) {
    const m = url.match(p)
    if (m) return m[1]
  }
  return null
}

export function getDriveImageUrl(url: string): string {
  if (!url) return url
  const id = extractDriveId(url)
  if (id) return `https://drive.google.com/uc?export=download&id=${id}`
  return url
}

export function getDriveVideoUrl(url: string): string {
  const id = extractDriveId(url)
  if (id) return `/api/video?id=${id}`
  return url
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: string | Date) {
  return new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

export function slugify(text: string) {
  return text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
}