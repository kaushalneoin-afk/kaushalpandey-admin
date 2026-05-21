'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-full mb-6">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              Available for opportunities
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]"
          >
            Hi, I'm <span className="text-black">Kaushal Pandey</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6 text-lg sm:text-xl text-gray-500 max-w-xl leading-relaxed"
          >
            Full Stack Developer specializing in Java, Spring Boot, React, and cloud technologies.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-3 mt-8"
          >
            <Link
              href="/tech-profile"
              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              View Profile <ArrowRight size={16} />
            </Link>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 transition-colors"
            >
              See Projects
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
