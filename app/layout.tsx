import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { Toaster } from '@/components/ui/Toaster'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Kaushal Pandey | Full Stack Developer',
  description: 'Full Stack Developer specializing in Java, Spring Boot, Android Development, MERN Stack, REST APIs, MongoDB, and Cloud Computing.',
  keywords: ['Kaushal Pandey', 'Full Stack Developer', 'Java Developer', 'Spring Boot', 'MERN Stack', 'Portfolio'],
  authors: [{ name: 'Kaushal Pandey' }],
  openGraph: {
    title: 'Kaushal Pandey | Full Stack Developer',
    description: 'Full Stack Developer specializing in Java, Spring Boot, Android Development, MERN Stack, REST APIs, MongoDB, and Cloud Computing.',
    url: 'https://kaushalpandey.co.in',
    siteName: 'Kaushal Pandey Portfolio',
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Kaushal Pandey | Full Stack Developer',
    description: 'Full Stack Developer portfolio',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
        <Toaster />
      </body>
    </html>
  )
}
