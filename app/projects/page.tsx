'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Github, ExternalLink, Code2, Server, Smartphone, Database, Download, Monitor, X } from 'lucide-react'
import { projectService } from '@/services/api'
import { Loading } from '@/components/Loading'

const categories = [
  { id: 'all', label: 'All', icon: Code2 },
  { id: 'web', label: 'Web Application', icon: Server },
  { id: 'mobile', label: 'Android Application', icon: Smartphone },
  { id: 'desktop', label: 'Desktop Application', icon: Monitor },
  { id: 'api', label: 'API', icon: Database },
]

export default function Projects() {
  const [projects, setProjects] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  useEffect(() => {
    projectService.getAll()
      .then(res => {
        const order = ['sanju', 'movershub', 'mahakal', 'jkson']
        const sorted = (res.data || []).sort((a: any, b: any) => {
          const aIdx = order.findIndex(o => a.title?.toLowerCase().includes(o))
          const bIdx = order.findIndex(o => b.title?.toLowerCase().includes(o))
          if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
          if (aIdx !== -1) return -1
          if (bIdx !== -1) return 1
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        })
        setProjects(sorted)
      })
      .catch(() => setProjects([]))
      .finally(() => setLoading(false))
  }, [])

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p: any) => p.category === activeCategory)

  if (loading) return <Loading />

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Portfolio</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">My Projects</h1>
          <p className="text-gray-500 leading-relaxed">Explore my portfolio of full-stack applications, mobile apps, and API integrations.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button key={cat.id} onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              <cat.icon size={14} /> {cat.label}
            </button>
          ))}
        </motion.div>

        {projects.length === 0 ? (
          <div className="text-center py-16">
            <Code2 size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No projects yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {filteredProjects.map((project: any, i: number) => (
              <motion.div key={project._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-400 hover:shadow-sm transition-all">

                {project.thumbnail && (
                  <div className="relative w-full h-48 bg-gray-100">
                    <img src={project.thumbnail} alt={project.title} className="w-full h-full object-cover cursor-pointer"
                      onClick={() => setSelectedImage(project.thumbnail)} />
                  </div>
                )}

                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold">{project.title}</h3>
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                        {categories.find(c => c.id === project.category)?.label || project.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">{project.description}</p>

                  {project.techStack?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {project.techStack.map((tech: string) => (
                        <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded-md">{tech}</span>
                      ))}
                    </div>
                  )}

                  {project.features?.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {project.features.slice(0, 3).map((feature: string) => (
                        <span key={feature} className="text-xs text-gray-400">&bull; {feature}</span>
                      ))}
                    </div>
                  )}

                  {project.screenshots?.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-medium text-gray-500 mb-2">Screenshots</p>
                      <div className="flex flex-wrap gap-2">
                        {project.screenshots.map((url: string, si: number) => (
                          <img key={si} src={url} alt={`${project.title} screenshot ${si + 1}`}
                            className="w-16 h-16 object-cover rounded-lg border cursor-pointer hover:opacity-80 transition-opacity"
                            onClick={() => setSelectedImage(url)} />
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 pt-3 border-t border-gray-100">
                    {project.githubUrl && (
                      <a href={project.githubUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-black transition-colors">
                        <Github size={14} /> Source
                      </a>
                    )}
                    {project.liveUrl && (
                      <a href={project.liveUrl} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-black transition-colors">
                        <ExternalLink size={14} /> Demo
                      </a>
                    )}
                    {project.apk && (
                      <a href={project.apk} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm text-gray-600 hover:text-black transition-colors">
                        <Download size={14} /> APK
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative max-w-4xl max-h-[90vh]">
            <button onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors">
              <X size={24} />
            </button>
            <img src={selectedImage} alt="" className="max-w-full max-h-[85vh] object-contain rounded-lg" />
          </div>
        </div>
      )}
    </div>
  )
}
