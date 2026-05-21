'use client'

import { Toaster as Sonner } from 'sonner'

export function Toaster() {
  return (
    <Sonner
      theme="dark"
      position="bottom-right"
      toastOptions={{
        style: {
          background: 'rgba(17, 25, 40, 0.95)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          color: '#fff',
        },
      }}
    />
  )
}