'use client'

import { motion } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar } from 'lucide-react'
import { getDriveImageUrl } from '@/lib/utils'
import { Loading } from '@/components/Loading'
import VideoPlayer from './VideoPlayer'

export default function BlogPage() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  const slug = params.blog as string
  const destSlug = params.slug as string

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/blogs/${slug}`)
      .then(res => res.json())
      .then(data => setBlog(data))
      .catch(() => setBlog(null))
      .finally(() => setLoading(false))
  }, [slug])

  if (loading) return <Loading />
  if (!blog) return <div className="min-h-screen pt-20 flex items-center justify-center text-gray-500">Blog not found</div>

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => router.push(`/tourism/${destSlug}`)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors mb-6"
        >
          <ArrowLeft size={16} /> Back
        </motion.button>

        <div className="space-y-6">
          {blog.videoUrl && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <VideoPlayer url={blog.videoUrl} type={blog.videoType || 'youtube'} poster={blog.thumbnail} />
            </motion.div>
          )}

          {blog.thumbnail && !blog.videoUrl && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl overflow-hidden">
              <img src={getDriveImageUrl(blog.thumbnail)} alt={blog.title} loading="lazy" className="w-full h-64 md:h-80 object-cover" />
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
            <h1 className="text-2xl md:text-3xl font-bold mb-3">{blog.title}</h1>
            <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
              <span className="flex items-center gap-1">
                <Calendar size={14} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
              </span>
            </div>
            <p className="text-gray-600 leading-relaxed whitespace-pre-line">{blog.content}</p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
