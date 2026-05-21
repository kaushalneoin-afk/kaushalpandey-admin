'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Upload, Play } from 'lucide-react'
import { blogService, destinationService, uploadService } from '@/services/api'
import { toast } from 'sonner'

interface Blog {
  _id?: string
  title: string
  slug: string
  destinationSlug: string
  thumbnail: string
  content: string
  excerpt: string
  videoUrl: string
  videoType?: 'youtube' | 'drive'
  estimatedCost: number
  travelTags: string[]
  published: boolean
  duration?: string
}

interface Destination { slug: string; name: string }

export default function BlogsManager() {
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [formData, setFormData] = useState<Blog>({
    title: '', slug: '', destinationSlug: '', thumbnail: '', content: '', excerpt: '',
    videoUrl: '', videoType: 'youtube', estimatedCost: 0, travelTags: [], published: false, duration: ''
  })

  const detectVideoType = (url: string) => {
    if (!url || url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube'
    if (url.includes('drive.google.com') || url.includes('drive.usercontent.google.com')) return 'drive'
    return formData.videoType || 'youtube'
  }

  useEffect(() => { fetchBlogs(); fetchDestinations() }, [])

  const fetchBlogs = async () => {
    try { const res = await blogService.getAll(); setBlogs(res.data) }
    catch { toast.error('Failed to fetch blogs') }
  }

  const fetchDestinations = async () => {
    try { const res = await destinationService.getAll(); setDestinations(res.data) }
    catch { console.error('Failed to fetch destinations') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const data = { ...formData, published: formData.published }
      if (editingBlog?._id) { await blogService.update(editingBlog._id, data); toast.success('Blog updated!') }
      else { await blogService.create(data); toast.success('Blog created!') }
      fetchBlogs()
      closeModal()
    } catch { toast.error('Failed to save blog') }
    finally { setIsLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this blog?')) return
    try { await blogService.delete(id); toast.success('Deleted!'); fetchBlogs() }
    catch { toast.error('Failed to delete') }
  }

  const openEditModal = (blog: Blog) => { setEditingBlog(blog); setFormData(blog); setIsModalOpen(true) }

  const closeModal = () => {
    setIsModalOpen(false); setEditingBlog(null)
    setFormData({ title: '', slug: '', destinationSlug: '', thumbnail: '', content: '', excerpt: '', videoUrl: '', videoType: 'youtube', estimatedCost: 0, travelTags: [], published: false, duration: '' })
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.travelTags.includes(tagInput.trim())) {
      setFormData({ ...formData, travelTags: [...formData.travelTags, tagInput.trim()] }); setTagInput('')
    }
  }

  const removeTag = (tag: string) => setFormData({ ...formData, travelTags: formData.travelTags.filter(t => t !== tag) })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Blogs & Vlogs</h2>
          <p className="text-sm text-gray-500">Manage your travel blogs and vlogs</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
          <Plus size={18} /> Add Blog/Vlog
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {blogs.map((blog) => (
          <motion.div key={blog._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition">
            <div className="relative h-44 bg-gray-100">
              {blog.thumbnail ? <img src={blog.thumbnail} alt={blog.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-300"><Play size={32} /></div>}
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => openEditModal(blog)} className="p-1.5 bg-black/60 rounded-lg text-white hover:bg-black/80"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(blog._id!)} className="p-1.5 bg-black/60 rounded-lg text-red-400 hover:bg-red-500/80"><Trash2 size={14} /></button>
              </div>
              <div className="absolute bottom-2 left-2">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${blog.published ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-600'}`}>
                  {blog.published ? 'Published' : 'Draft'}
                </span>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 line-clamp-2">{blog.title}</h3>
              <p className="text-xs text-gray-400 mt-1">{blog.destinationSlug}</p>
              <p className="text-sm text-gray-500 line-clamp-2 mt-2">{blog.excerpt}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {blog.travelTags.slice(0, 3).map((tag) => (
                  <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">{tag}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{editingBlog ? 'Edit Blog/Vlog' : 'Add New Blog/Vlog'}</h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
                  <input type="text" value={formData.slug}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Destination *</label>
                <select value={formData.destinationSlug} onChange={(e) => setFormData({ ...formData, destinationSlug: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required>
                  <option value="">Select Destination</option>
                  {destinations.map((dest) => <option key={dest.slug} value={dest.slug}>{dest.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Excerpt</label>
                <input type="text" value={formData.excerpt} onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Content</label>
                <textarea value={formData.content} onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  rows={4} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Video Type</label>
                  <select value={formData.videoType} onChange={(e) => setFormData({ ...formData, videoType: e.target.value as any })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
                    <option value="youtube">YouTube</option>
                    <option value="drive">Google Drive</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Video URL</label>
                  <input type="text" value={formData.videoUrl} onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value, videoType: detectVideoType(e.target.value) as any })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" placeholder="Paste YouTube or Google Drive link" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Thumbnail URL</label>
                  <input type="text" value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Duration</label>
                  <input type="text" value={formData.duration} onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Travel Tags</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  <button type="button" onClick={addTag} className="px-4 py-2.5 bg-black text-white rounded-lg text-sm">Add</button>
                </div>
                <div className="flex flex-wrap gap-1">{formData.travelTags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded flex items-center gap-1">
                    {tag} <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">&times;</button>
                  </span>
                ))}</div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={formData.published} onChange={(e) => setFormData({ ...formData, published: e.target.checked })} />
                <span>Published</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
                  {isLoading ? 'Saving...' : editingBlog ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
