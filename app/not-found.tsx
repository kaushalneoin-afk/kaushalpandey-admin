'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Home, ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-8xl md:text-[200px] font-bold text-gray-900 leading-none mb-4"
        >
          404
        </motion.div>
        <h1 className="text-2xl font-bold mb-3">Page Not Found</h1>
        <p className="text-gray-500 mb-8 max-w-md mx-auto">
          Oops! The page you're looking for doesn't exist or has been moved.
        </p>
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 px-5 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors text-sm"
          >
            <ArrowLeft size={16} /> Go Back
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 px-5 py-2.5 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition-colors text-sm"
          >
            <Home size={16} /> Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
