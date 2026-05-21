'use client'

import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, MapPin } from 'lucide-react'
import { getDriveImageUrl } from '@/lib/utils'
import { Loading } from '@/components/Loading'

export default function DestinationPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params.slug as string
  const [destination, setDestination] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/destinations/${slug}`).then(r => r.json()),
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs?destination=${slug}&published=true`).then(r => r.json())
    ])
      .then(([dest, blogs]) => setDestination({ ...dest, blogs }))
      .catch(() => setDestination(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <Loading />
  if (!destination) return (
    <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
      <p className="text-gray-500">Destination not found</p>
      <button onClick={() => router.push('/tourism')} className="text-sm text-black hover:underline font-medium">Back to destinations</button>
    </div>
  )

  return (
    <div className="min-h-screen pt-16">
      <div className="relative h-[45vh] overflow-hidden bg-gray-100">
        <div className="absolute inset-0">
          <img src={getDriveImageUrl(destination.bannerImage)} alt={destination.name} loading="lazy" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        </div>
        <div className="absolute inset-0 flex items-end">
          <div className="max-w-6xl mx-auto px-6 pb-10 w-full">
            <motion.button
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => router.push('/tourism')}
              className="flex items-center gap-2 text-sm text-white/80 hover:text-white transition-colors mb-4"
            >
              <ArrowLeft size={16} /> Back
            </motion.button>
            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-3xl md:text-5xl font-bold text-white mb-2">
              {destination.name}
            </motion.h1>
            {destination.location && (
              <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="text-white/80 text-sm flex items-center gap-1.5">
                <MapPin size={14} /> {destination.location}
              </motion.p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        {(destination.about || destination.description) && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-xl border border-gray-200 p-6 mb-10">
            <h2 className="text-xl font-bold mb-3">About {destination.name}</h2>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm">{destination.about || destination.description}</p>
          </motion.div>
        )}

        <h2 className="text-xl font-bold mb-6">Travel Vlogs & Blogs</h2>

        {destination.blogs?.length === 0 ? (
          <p className="text-gray-400 text-center py-12 text-sm">No blogs yet for this destination. Check back soon!</p>
        ) : (
          <div className="space-y-5">
            {destination.blogs.map((blog: any, i: number) => (
              <motion.div
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0 }}
                onClick={() => router.push(`/tourism/${slug}/${blog.slug || blog._id}`)}
                className="group cursor-pointer bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-400 hover:shadow-sm transition-all"
              >
                <div className="flex flex-col md:flex-row">
                  {blog.thumbnail && (
                    <div className="relative md:w-72 h-48 md:h-auto shrink-0 bg-gray-100">
                      <img src={getDriveImageUrl(blog.thumbnail)} alt={blog.title} loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-5 flex-1">
                    <h3 className="font-semibold mb-2 group-hover:text-gray-600 transition-colors">{blog.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-3">{blog.content}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Calendar size={12} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
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
