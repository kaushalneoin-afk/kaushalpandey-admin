'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Upload } from 'lucide-react'
import { projectService, uploadService } from '@/services/api'
import { toast } from 'sonner'

interface Project {
  _id?: string
  title: string
  slug: string
  description: string
  shortDescription: string
  thumbnail: string
  techStack: string[]
  features: string[]
  githubUrl: string
  liveUrl: string
  category: string
  status: string
}

const categories = ['fullstack', 'android', 'api', 'backend']
const statuses = ['completed', 'in-progress', 'planned']

export default function ProjectsManager() {
  const [projects, setProjects] = useState<Project[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState<Project>({
    title: '', slug: '', description: '', shortDescription: '', thumbnail: '',
    techStack: [], features: [], githubUrl: '', liveUrl: '', category: 'fullstack', status: 'completed'
  })
  const [techInput, setTechInput] = useState('')
  const [featureInput, setFeatureInput] = useState('')

  useEffect(() => { fetchProjects() }, [])

  const fetchProjects = async () => {
    try {
      const response = await projectService.getAll()
      setProjects(response.data)
    } catch { toast.error('Failed to fetch projects') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (editingProject?._id) {
        await projectService.update(editingProject._id, formData)
        toast.success('Project updated!')
      } else {
        await projectService.create(formData)
        toast.success('Project created!')
      }
      fetchProjects()
      closeModal()
    } catch { toast.error('Failed to save project') }
    finally { setIsLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return
    try {
      await projectService.delete(id)
      toast.success('Project deleted!')
      fetchProjects()
    } catch { toast.error('Failed to delete') }
  }

  const openEditModal = (project: Project) => {
    setEditingProject(project)
    setFormData(project)
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setEditingProject(null)
    setFormData({ title: '', slug: '', description: '', shortDescription: '', thumbnail: '', techStack: [], features: [], githubUrl: '', liveUrl: '', category: 'fullstack', status: 'completed' })
  }

  const addTech = () => {
    if (techInput.trim() && !formData.techStack.includes(techInput.trim())) {
      setFormData({ ...formData, techStack: [...formData.techStack, techInput.trim()] })
      setTechInput('')
    }
  }

  const removeTech = (tech: string) => setFormData({ ...formData, techStack: formData.techStack.filter(t => t !== tech) })

  const addFeature = () => {
    if (featureInput.trim() && !formData.features.includes(featureInput.trim())) {
      setFormData({ ...formData, features: [...formData.features, featureInput.trim()] })
      setFeatureInput('')
    }
  }

  const removeFeature = (feature: string) => setFormData({ ...formData, features: formData.features.filter(f => f !== feature) })

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Projects</h2>
          <p className="text-sm text-gray-500">Manage your portfolio projects</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
          <Plus size={18} /> Add Project
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((project) => (
          <motion.div key={project._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition">
            <div className="relative h-40 bg-gray-100">
              {project.thumbnail ? (
                <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-300 text-sm">No image</div>
              )}
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => openEditModal(project)} className="p-1.5 bg-black/60 rounded-lg text-white hover:bg-black/80 transition"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(project._id!)} className="p-1.5 bg-black/60 rounded-lg text-red-400 hover:bg-red-500/80 transition"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{project.title}</h3>
              <p className="text-sm text-gray-500 line-clamp-2 mt-1">{project.shortDescription}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {project.techStack.slice(0, 3).map((tech) => (
                  <span key={tech} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">{tech}</span>
                ))}
                {project.techStack.length > 3 && <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">+{project.techStack.length - 3}</span>}
              </div>
              <div className="flex items-center gap-2 mt-3">
                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                  project.status === 'completed' ? 'bg-gray-900 text-white' :
                  project.status === 'in-progress' ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-500'
                }`}>{project.status}</span>
                <span className="px-2 py-0.5 rounded bg-gray-100 text-gray-500 text-xs">{project.category}</span>
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
              <h2 className="text-lg font-bold text-gray-900">{editingProject ? 'Edit Project' : 'Add New Project'}</h2>
              <button onClick={closeModal} className="p-1 hover:bg-gray-100 rounded-lg"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Slug *</label>
                  <input type="text" value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Short Description *</label>
                <input type="text" value={formData.shortDescription} onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Full Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Thumbnail URL</label>
                <input type="text" value={formData.thumbnail} onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
                    {categories.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
                    {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Tech Stack</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={techInput} onChange={(e) => setTechInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTech())}
                    placeholder="Add technology" className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  <button type="button" onClick={addTech} className="px-4 py-2.5 bg-black text-white rounded-lg text-sm">Add</button>
                </div>
                <div className="flex flex-wrap gap-1">{formData.techStack.map((tech) => (
                  <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded flex items-center gap-1">
                    {tech} <button type="button" onClick={() => removeTech(tech)} className="hover:text-red-500">&times;</button>
                  </span>
                ))}</div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Features</label>
                <div className="flex gap-2 mb-2">
                  <input type="text" value={featureInput} onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature())}
                    placeholder="Add feature" className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                  <button type="button" onClick={addFeature} className="px-4 py-2.5 bg-black text-white rounded-lg text-sm">Add</button>
                </div>
                <div className="flex flex-wrap gap-1">{formData.features.map((feat) => (
                  <span key={feat} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded flex items-center gap-1">
                    {feat} <button type="button" onClick={() => removeFeature(feat)} className="hover:text-red-500">&times;</button>
                  </span>
                ))}</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">GitHub URL</label>
                  <input type="url" value={formData.githubUrl} onChange={(e) => setFormData({ ...formData, githubUrl: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Live URL</label>
                  <input type="url" value={formData.liveUrl} onChange={(e) => setFormData({ ...formData, liveUrl: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
                  {isLoading ? 'Saving...' : editingProject ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
