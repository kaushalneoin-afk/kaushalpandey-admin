'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Award, Download, ExternalLink, CheckCircle, Search } from 'lucide-react'
import { certificationService } from '@/services/api'
import { Loading } from '@/components/Loading'

export default function Certifications() {
  const [certifications, setCertifications] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedOrg, setSelectedOrg] = useState('all')

  useEffect(() => {
    certificationService.getAll()
      .then(res => {
        const sorted = (res.data || []).sort((a: any, b: any) => {
          const getOrder = (org: string) => {
            const o = org?.toLowerCase() || ''
            if (o.includes('microsoft')) return 0
            if (o.includes('tata')) return 1
            if (o === 'ibm') return 2
            if (o === 'aws') return 3
            return 99
          }
          const aOrder = getOrder(a.organization)
          const bOrder = getOrder(b.organization)
          if (aOrder !== bOrder) return aOrder - bOrder
          return new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
        })
        setCertifications(sorted)
      })
      .catch(() => setCertifications([]))
      .finally(() => setLoading(false))
  }, [])

  const organizations = ['all', ...new Set(certifications.map((c: any) => c.organization))]

  const filteredCertifications = certifications.filter((cert: any) => {
    const matchesSearch = cert.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cert.organization?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesOrg = selectedOrg === 'all' || cert.organization === selectedOrg
    return matchesSearch && matchesOrg
  })

  if (loading) return <Loading />

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mb-12">
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Credentials</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Certifications</h1>
          <p className="text-gray-500 leading-relaxed">Verified professional certifications from leading technology companies and platforms.</p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="flex flex-col sm:flex-row gap-3 mb-10">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input type="text" placeholder="Search certifications..." value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-gray-400 outline-none transition-colors" />
          </div>
          <select value={selectedOrg} onChange={(e) => setSelectedOrg(e.target.value)}
            className="px-4 py-2.5 bg-white border border-gray-200 rounded-lg text-sm focus:border-gray-400 outline-none transition-colors">
            {organizations.map((org: any) => (
              <option key={org} value={org}>{org === 'all' ? 'All Organizations' : org}</option>
            ))}
          </select>
        </motion.div>

        {certifications.length === 0 ? (
          <div className="text-center py-16">
            <Award size={48} className="mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500">No certifications yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredCertifications.map((cert: any, i: number) => (
              <motion.div key={cert._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-400 hover:shadow-sm transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center overflow-hidden shrink-0">
                    {cert.organizationLogo ? (
                      <img src={cert.organizationLogo} alt={cert.organization} className="w-7 h-7 object-contain" />
                    ) : (
                      <Award size={18} className="text-gray-600" />
                    )}
                  </div>
                  {cert.verified && (
                    <div className="flex items-center gap-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-md">
                      <CheckCircle size={12} /> Verified
                    </div>
                  )}
                </div>
                <h3 className="font-semibold mb-1">{cert.title}</h3>
                <p className="text-sm text-gray-500 mb-3">{cert.organization}</p>
                <div className="space-y-1 text-xs text-gray-400 mb-5">
                  {cert.credentialId && <div>ID: <span className="font-mono">{cert.credentialId}</span></div>}
                  <div>Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                </div>
                <div className="flex gap-2">
                  {cert.credentialUrl && (
                    <a href={cert.credentialUrl} target="_blank" rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                      <ExternalLink size={14} /> Verify
                    </a>
                  )}
                  {cert.image && (
                    <a href={cert.image} target="_blank" rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 px-3 py-2 border border-gray-300 text-gray-600 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      <Download size={14} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
