'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Search } from 'lucide-react'
import { certificationService } from '@/services/api'
import { toast } from 'sonner'

interface Certification {
  _id?: string
  title: string
  organization: string
  credentialId: string
  issueDate: string
  expiryDate?: string
  credentialUrl: string
  image: string
  verified: boolean
}

export default function CertificationsManager() {
  const [certifications, setCertifications] = useState<Certification[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingCert, setEditingCert] = useState<Certification | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [formData, setFormData] = useState<Certification>({
    title: '', organization: '', credentialId: '', issueDate: '', expiryDate: '',
    credentialUrl: '', image: '', verified: false
  })

  useEffect(() => { fetchCertifications() }, [])

  const fetchCertifications = async () => {
    try { const res = await certificationService.getAll(); setCertifications(res.data) }
    catch { toast.error('Failed to fetch certifications') }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (editingCert?._id) { await certificationService.update(editingCert._id, formData); toast.success('Updated!') }
      else { await certificationService.create(formData); toast.success('Created!') }
      fetchCertifications(); closeModal()
    } catch { toast.error('Failed to save') }
    finally { setIsLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this certification?')) return
    try { await certificationService.delete(id); toast.success('Deleted!'); fetchCertifications() }
    catch { toast.error('Failed to delete') }
  }

  const openEditModal = (cert: Certification) => { setEditingCert(cert); setFormData(cert); setIsModalOpen(true) }

  const closeModal = () => {
    setIsModalOpen(false); setEditingCert(null)
    setFormData({ title: '', organization: '', credentialId: '', issueDate: '', expiryDate: '', credentialUrl: '', image: '', verified: false })
  }

  const filteredCerts = certifications.filter(cert =>
    cert.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.organization.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Certifications</h2>
          <p className="text-sm text-gray-500">Manage certifications and credentials</p>
        </div>
        <button onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition text-sm font-medium">
          <Plus size={18} /> Add Certification
        </button>
      </div>

      <div className="relative mb-4 max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
        <input type="text" placeholder="Search certifications..." value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredCerts.map((cert) => (
          <motion.div key={cert._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:border-gray-300 transition">
            <div className="relative h-36 bg-gray-100">
              {cert.image ? <img src={cert.image} alt={cert.title} className="w-full h-full object-cover" />
              : <div className="w-full h-full flex items-center justify-center text-gray-300 text-3xl font-bold">{cert.organization?.charAt(0)}</div>}
              {cert.verified && <div className="absolute top-2 left-2 px-2 py-0.5 bg-gray-900 text-white text-xs font-medium rounded">Verified</div>}
              <div className="absolute top-2 right-2 flex gap-1">
                <button onClick={() => openEditModal(cert)} className="p-1.5 bg-black/60 rounded-lg text-white hover:bg-black/80"><Edit2 size={14} /></button>
                <button onClick={() => handleDelete(cert._id!)} className="p-1.5 bg-black/60 rounded-lg text-red-400 hover:bg-red-500/80"><Trash2 size={14} /></button>
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-gray-900">{cert.title}</h3>
              <p className="text-sm text-gray-500">{cert.organization}</p>
              <p className="text-xs text-gray-400 mt-2">ID: {cert.credentialId}</p>
              <p className="text-xs text-gray-400">Issued: {new Date(cert.issueDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">{editingCert ? 'Edit Certification' : 'Add Certification'}</h2>
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
                  <label className="block text-xs font-medium text-gray-600 mb-1">Organization *</label>
                  <input type="text" value={formData.organization} onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Credential ID</label>
                  <input type="text" value={formData.credentialId} onChange={(e) => setFormData({ ...formData, credentialId: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Credential URL</label>
                  <input type="url" value={formData.credentialUrl} onChange={(e) => setFormData({ ...formData, credentialUrl: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Issue Date *</label>
                  <input type="date" value={formData.issueDate} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Expiry Date</label>
                  <input type="date" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Certificate Image URL</label>
                <input type="text" value={formData.image} onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={formData.verified} onChange={(e) => setFormData({ ...formData, verified: e.target.checked })} />
                <span>Verified Certificate</span>
              </label>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={closeModal} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50 transition">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
                  {isLoading ? 'Saving...' : editingCert ? 'Update' : 'Create'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
