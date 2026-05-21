'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, X, MapPin } from 'lucide-react'
import { destinationService } from '@/services/api'
import { toast } from 'sonner'

interface Destination {
  _id?: string
  name: string
  slug: string
  bannerImage: string
  thumbnail: string
  about: string
  location: string
  tags: string[]
  featured: boolean
}

export default function DestinationsManager() {
  const [destinations, setDestinations] = useState<Destination[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingDest, setEditingDest] = useState<Destination | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tagInput, setTagInput] = useState('')
  const [formData, setFormData] = useState<Destination>({
    name: '', slug: '', bannerImage: '', thumbnail: '', about: '', location: '', tags: [], featured: false
  })

  useEffect(() => { fetchDestinations() }, [])

  const fetchDestinations = async () => {
    try { const res = await destinationService.getAll(); setDestinations(res.data) }
    catch { toast.error('Failed to fetch destinations') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (editingDest?._id) { await destinationService.update(editingDest._id, formData); toast.success('Updated!') }
      else { await destinationService.create(formData); toast.success('Created!') }
      fetchDestinations(); closeModal()
    } catch { toast.error('Failed to save') }
    finally { setIsLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this destination?')) return
    try { await destinationService.delete(id); toast.success('Deleted!'); fetchDestinations() }
    catch { toast.error('Failed to delete') }
  }

  const openEditModal = (dest: Destination) => { setEditingDest(dest); setFormData(dest); setIsModalOpen(true) }

  const closeModal = () => {
    setIsModalOpen(false); setEditingDest(null)
    setFormData({ name: '', slug: '', bannerImage: '', thumbnail: '', about: '', location: '', tags: [], featured: false })
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({ ...formData, tags: [...formData.tags, tagInput.trim()] }); setTagInput('')
    }
  }

  const removeTag = (tag: string) => setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Destinations</h2>
          <p className="text-sm text-gray-500">Manage travel destinations</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
          <Plus size={18} /> Add Destination
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {destinations.map((dest) => (
          <motion.div key={dest._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition">
            <div className="relative h-44 bg-gray-100">
              {dest.thumbnail ? <img src={dest.thumbnail} alt={dest.name} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-300"><MapPin size={32} /></div>}
              {dest.featured && <div className="absolute top-2 left-2 px-2 py-0.5 bg-black text-white text-xs font-medium rounded">Featured</div>}
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => openEditModal(dest)} className="p-1.5 bg-black/60 rounded-lg text-white hover:bg-black/80"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(dest._id!)} className="p-1.5 bg-black/60 rounded-lg text-red-400 hover:bg-red-500/80"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{dest.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{dest.location}</p>
              <p className="text-sm text-gray-500 line-clamp-2 mt-2">{dest.about}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {dest.tags.slice(0, 3).map((tag) => (
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
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{editingDest ? 'Edit Destination' : 'Add Destination'}</h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Slug</label>
                  <input type="text" value={formData.slug}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Location *</label>
                <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">About</label>
                <textarea value={formData.about} onChange={(e) => setFormData({ ...formData, about: e.target.value })}
                  rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Thumbnail URL</label>
                  <input type="text" value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Banner URL</label>
                  <input type="text" value={formData.bannerImage} onChange={(e) => setFormData({ ...formData, bannerImage: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tags</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  <button type="button" onClick={addTag} className="px-4 py-2.5 bg-black text-white rounded-lg text-sm">Add</button>
                </div>
                <div className="flex flex-wrap gap-1">{formData.tags.map((tag) => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded flex items-center gap-1">
                    {tag} <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">&times;</button>
                  </span>
                ))}</div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData({ ...formData, featured: e.target.checked })} />
                <span>Featured Destination</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
                  {isLoading ? 'Saving...' : editingDest ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
