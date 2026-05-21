'use client'

import { motion } from 'framer-motion'
import { Building2, ArrowRight, Loader2 } from 'lucide-react'

const roadmap = [
  { period: 'Q1 2024', title: 'Skill Building', status: 'completed', description: 'Mastering core technologies' },
  { period: 'Q2 2024', title: 'Portfolio Development', status: 'completed', description: 'Building personal projects' },
  { period: 'Q3 2024', title: 'Certification Phase', status: 'completed', description: 'AWS & Google Cloud certs' },
  { period: 'Q4 2024', title: 'Internship Search', status: 'active', description: 'Seeking opportunities' },
  { period: 'Q1 2025', title: 'Professional Role', status: 'upcoming', description: 'Full-time position' },
]

const targetCompanies = [
  { name: 'Google', logo: 'G' },
  { name: 'Microsoft', logo: 'M' },
  { name: 'Amazon', logo: 'A' },
  { name: 'Meta', logo: 'M' },
  { name: 'Adobe', logo: 'A' },
  { name: 'Netflix', logo: 'N' },
]

export default function Internship() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-600 text-xs font-medium rounded-full mb-6">
            <Loader2 className="w-3 h-3 animate-spin" />
            Coming Soon
          </div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Career Roadmap
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto leading-relaxed">
            Exciting internship and career opportunities are on the horizon. Stay tuned for updates!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-xl border border-gray-200 p-8 mb-10"
        >
          <h2 className="text-xl font-bold mb-8">Journey Timeline</h2>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200" />
            <div className="space-y-8">
              {roadmap.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.15 + i * 0.08 }}
                  className="relative flex gap-4"
                >
                  <div className={`
                    relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0
                    ${item.status === 'completed' ? 'bg-black' : ''}
                    ${item.status === 'active' ? 'bg-black animate-pulse' : ''}
                    ${item.status === 'upcoming' ? 'bg-gray-200' : ''}
                  `}>
                    {item.status === 'completed' && (
                      <span className="text-white text-xs">&#10003;</span>
                    )}
                    {item.status === 'active' && (
                      <span className="w-2 h-2 bg-white rounded-full" />
                    )}
                    {item.status === 'upcoming' && (
                      <span className="w-2 h-2 bg-gray-400 rounded-full" />
                    )}
                  </div>
                  <div className="flex-1 pb-8">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-gray-500 font-medium">{item.period}</span>
                      <span className={`
                        px-2 py-0.5 rounded text-xs font-medium
                        ${item.status === 'completed' ? 'bg-gray-100 text-gray-600' : ''}
                        ${item.status === 'active' ? 'bg-black text-white' : ''}
                        ${item.status === 'upcoming' ? 'bg-gray-100 text-gray-400' : ''}
                      `}>
                        {item.status}
                      </span>
                    </div>
                    <h3 className="font-semibold">{item.title}</h3>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl border border-gray-200 p-8 mb-10"
        >
          <h2 className="text-xl font-bold mb-6">Target Companies</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {targetCompanies.map((company, i) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.25 + i * 0.05 }}
                className="p-4 rounded-lg border border-gray-200 hover:border-gray-400 hover:bg-gray-50 transition-all cursor-pointer flex items-center gap-3"
              >
                <div className="w-9 h-9 rounded-lg bg-black flex items-center justify-center font-bold text-white text-sm">
                  {company.logo}
                </div>
                <span className="font-medium text-sm">{company.name}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-50 rounded-xl p-8 text-center"
        >
          <Building2 className="w-12 h-12 mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-bold mb-2">Looking for Opportunities</h2>
          <p className="text-gray-500 mb-6 text-sm leading-relaxed max-w-md mx-auto">
            Actively seeking internship and entry-level positions in software development. Let's connect!
          </p>
          <a
            href="mailto:kaushal@kaushalpandey.co.in"
            className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors"
          >
            Get in Touch <ArrowRight size={16} />
          </a>
        </motion.div>
      </div>
    </div>
  )
}
