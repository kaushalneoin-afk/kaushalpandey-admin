'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Map, ChevronRight } from 'lucide-react'
import { useState, useEffect } from 'react'
import { getDriveImageUrl, apiUrl } from '@/lib/utils'
import { Loading } from '@/components/Loading'

export default function Tourism() {
  const router = useRouter()
  const [destinations, setDestinations] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(apiUrl('/destinations'))
      .then(res => res.json())
      .then(data => {
        const sorted = [...data].sort((a, b) => {
          if (a.slug === 'manali') return -1
          if (b.slug === 'manali') return 1
          return 0
        })
        setDestinations(sorted)
      })
      .catch(() => setDestinations([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Travel</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Explore Destinations
          </h1>
          <p className="text-gray-500 leading-relaxed">
            Discover the beauty of India through travel blogs, vlogs, and experiences.
          </p>
        </motion.div>

        {destinations.length === 0 ? (
          <div className="text-center py-16">
            <Map size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No destinations yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, i) => (
              <motion.div
                key={dest._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                onClick={() => router.push(`/tourism/${dest.slug}`)}
                className="group cursor-pointer bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <div className="relative h-48 overflow-hidden bg-gray-100">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent z-10" />
                    {(dest.bannerImage || dest.thumbnail) && (
                    <img src={getDriveImageUrl(dest.bannerImage || dest.thumbnail)} alt={dest.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="absolute top-3 left-3 z-20">
                    <span className="px-2.5 py-1 bg-white/90 text-gray-700 text-xs font-medium rounded-md">
                      {dest.tags?.[0] || 'Travel'}
                    </span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold mb-1.5">{dest.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{dest.description || dest.about}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-2">
                      {(dest.tags || []).slice(0, 2).map((tag: string) => (
                        <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">{tag}</span>
                      ))}
                    </div>
                    <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
