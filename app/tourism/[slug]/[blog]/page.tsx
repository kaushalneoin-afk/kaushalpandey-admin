'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { ArrowLeft, Calendar, Play, Film, Heart, MessageCircle, Send, X } from 'lucide-react'
import { getDriveImageUrl, apiUrl } from '@/lib/utils'
import { Loading } from '@/components/Loading'
import VideoPlayer from './VideoPlayer'

export default function BlogPage() {
  const params = useParams()
  const router = useRouter()
  const [blog, setBlog] = useState<any>(null)
  const [recommended, setRecommended] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [likeCount, setLikeCount] = useState(0)
  const [commentCount, setCommentCount] = useState(0)
  const [commentName, setCommentName] = useState('')
  const [commentText, setCommentText] = useState('')
  const [showNameModal, setShowNameModal] = useState(false)
  const [pendingAction, setPendingAction] = useState<'like' | 'comment' | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')

  const slug = params.blog as string
  const destSlug = params.slug as string

  useEffect(() => {
    Promise.all([
      fetch(apiUrl(`/blogs/${slug}`)).then(res => res.json()),
      fetch(apiUrl('/blogs?published=true')).then(res => res.json()),
    ]).then(([blogData, allBlogs]) => {
      setBlog(blogData)
      const others = (Array.isArray(allBlogs) ? allBlogs : [])
        .filter((b: any) => b._id !== blogData._id)
        .slice(0, 12)
      setRecommended(others)
      fetch(apiUrl(`/reviews/${blogData._id}/counts`))
        .then(r => r.json())
        .then(c => { setLikeCount(c.likes); setCommentCount(c.comments) })
        .catch(() => {})
    }).catch(() => setBlog(null))
      .finally(() => setLoading(false))
  }, [slug])

  const handleLike = () => {
    if (!commentName.trim()) {
      setPendingAction('like')
      setShowNameModal(true)
      return
    }
    if (!blog?._id) return
    fetch(apiUrl('/reviews'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId: blog._id, type: 'like', name: commentName }),
    }).then(r => r.json()).then(() => {
      setLikeCount(prev => prev + 1)
      setSuccessMessage('Thank you for your like! Your response has been sent to the admin team.')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 4000)
    }).catch(() => {})
  }

  const handleSubmitComment = () => {
    if (!commentName.trim()) {
      setPendingAction('comment')
      setShowNameModal(true)
      return
    }
    if (!commentText.trim() || !blog?._id) return
    fetch(apiUrl('/reviews'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ blogId: blog._id, type: 'comment', name: commentName, content: commentText }),
    }).then(r => r.json()).then(() => {
      setCommentCount(prev => prev + 1)
      setCommentText('')
      setSuccessMessage('Thank you for your comment! Your response has been sent to the admin team.')
      setShowSuccess(true)
      setTimeout(() => setShowSuccess(false), 4000)
    }).catch(() => {})
  }

  const handleNameSubmit = () => {
    if (!commentName.trim()) return
    setShowNameModal(false)
    if (pendingAction === 'like') handleLike()
    else if (pendingAction === 'comment') handleSubmitComment()
    setPendingAction(null)
  }

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

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
            <div className="flex items-center gap-6 py-4 border-y border-gray-200">
              <button onClick={handleLike} className="flex items-center gap-2 text-sm text-gray-600 hover:text-red-500 transition-colors">
                <Heart size={20} className="hover:fill-red-500 transition-colors" />
                <span className="font-medium">{likeCount}</span>
              </button>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <MessageCircle size={20} />
                <span className="font-medium">{commentCount}</span>
              </div>
              <div className="flex-1" />
              {!commentName.trim() ? (
                <button onClick={() => setShowNameModal(true)} className="text-xs text-gray-400 hover:text-black transition-colors">Add name to interact</button>
              ) : (
                <span className="text-xs text-gray-400">Interacting as <span className="font-medium text-gray-600">{commentName}</span></span>
              )}
            </div>

            <div className="flex gap-3 mt-4">
              <input
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && commentText.trim()) handleSubmitComment() }}
                placeholder="Write a comment..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-300 transition-all"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim()}
                className="px-5 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed transition flex items-center gap-2"
              >
                <Send size={15} /> Send
              </button>
            </div>
          </motion.div>

          <AnimatePresence>
            {showNameModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
              >
                <motion.div
                  initial={{ scale: 0.95, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  className="bg-white rounded-2xl p-6 w-full max-w-sm mx-4 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-lg">What's your good name?</h3>
                    <button onClick={() => { setShowNameModal(false); setPendingAction(null) }} className="text-gray-400 hover:text-black transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                  <input
                    value={commentName}
                    onChange={e => setCommentName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter' && commentName.trim()) handleNameSubmit() }}
                    placeholder="Enter your name..."
                    className="w-full px-4 py-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-300 transition-all mb-4"
                    autoFocus
                  />
                  <div className="flex gap-3">
                    <button
                      onClick={() => { setShowNameModal(false); setPendingAction(null) }}
                      className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleNameSubmit}
                      disabled={!commentName.trim()}
                      className="flex-1 px-4 py-2.5 bg-black text-white rounded-xl text-sm font-medium hover:bg-gray-800 disabled:opacity-40 transition"
                    >
                      Submit
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showSuccess && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-6 py-3.5 rounded-xl shadow-lg text-sm font-medium"
              >
                {successMessage}
              </motion.div>
            )}
          </AnimatePresence>

          {recommended.length > 0 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Film size={18} /> Recommended
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
                {recommended.map((rec) => (
                  <div
                    key={rec._id}
                    onClick={() => router.push(`/tourism/${rec.destinationSlug || blog.destinationSlug}/${rec.slug || rec._id}`)}
                    className="group cursor-pointer"
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100 mb-1.5">
                      {rec.thumbnail ? (
                        <img
                          src={getDriveImageUrl(rec.thumbnail)}
                          alt={rec.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-300">
                          <Play size={24} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
                    </div>
                    <h3 className="text-xs md:text-sm font-medium text-gray-900 line-clamp-2 leading-snug">{rec.title}</h3>
                    {rec.destinationSlug && (
                      <p className="text-[11px] text-gray-400 mt-0.5 capitalize truncate">{rec.destinationSlug}</p>
                    )}
                    {rec.createdAt && (
                      <p className="text-[11px] text-gray-400">{new Date(rec.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                    )}
                  </div>
                ))}
              </div>
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
