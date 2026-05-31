'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ExternalLink, Github } from 'lucide-react'
import { toolService } from '@/services/api'
import { Loading } from '@/components/Loading'

export default function Tools() {
  const [tools, setTools] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    toolService.getAll()
      .then(res => setTools(res.data || []))
      .catch(() => setTools([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-12">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Utilities</p>
          <h1 className="text-4xl font-bold tracking-tight">Our Tools</h1>
          <p className="text-gray-500 mt-3 max-w-xl leading-relaxed">
            Open-source tools and utilities I've built for the community. All available on GitHub.
          </p>
        </motion.div>

        {tools.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <Github size={48} className="mx-auto mb-4 opacity-30" />
            <p>No tools available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {tools.map((tool, i) => (
              <motion.a key={tool._id} href={tool.githubUrl} target="_blank" rel="noopener noreferrer"
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="group bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-400 hover:shadow-sm transition-all block">
                <div className="flex items-start gap-3">
                  {tool.icon ? (
                    <img src={tool.icon} alt="" className="w-10 h-10 object-contain shrink-0 mt-1" />
                  ) : (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                      <Github size={20} className="text-gray-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 group-hover:text-gray-600 transition-colors">{tool.name}</h3>
                    <p className="text-sm text-gray-500 mt-1 line-clamp-2 leading-relaxed">{tool.description}</p>
                    <span className="inline-flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 mt-3 group-hover:underline">
                      <ExternalLink size={12} /> View on GitHub
                    </span>
                  </div>
                </div>
              </motion.a>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
