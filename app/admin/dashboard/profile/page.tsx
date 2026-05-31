'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plus, Edit2, Trash2, X, Upload, User, Briefcase, GraduationCap, Award } from 'lucide-react'
import { profileService, skillService, experienceService, educationService, uploadService } from '@/services/api'
import { toast } from 'sonner'

export default function ProfileManager() {
  const [activeTab, setActiveTab] = useState('profile')
  const [profile, setProfile] = useState<any>({ name: '', title: '', bio: '', avatar: '', banner: '', email: '', phone: '', location: '', resumeUrl: '', socialLinks: {} })
  const [skills, setSkills] = useState<any[]>([])
  const [experiences, setExperiences] = useState<any[]>([])
  const [educations, setEducations] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [skillModal, setSkillModal] = useState(false)
  const [expModal, setExpModal] = useState(false)
  const [eduModal, setEduModal] = useState(false)
  const [editingSkill, setEditingSkill] = useState<any>(null)
  const [editingExp, setEditingExp] = useState<any>(null)
  const [editingEdu, setEditingEdu] = useState<any>(null)
  const [skillForm, setSkillForm] = useState({ name: '', proficiency: 80, category: 'frontend' })
  const [expForm, setExpForm] = useState({ company: '', role: '', startDate: '', endDate: '', description: '', current: false })
  const [eduForm, setEduForm] = useState({ institution: '', degree: '', field: '', startDate: '', endDate: '' })

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      const [profileRes, skillsRes, expRes, eduRes] = await Promise.all([
        profileService.get(), skillService.getAll(), experienceService.getAll(), educationService.getAll()
      ])
      if (profileRes.data) setProfile(profileRes.data)
      if (skillsRes.data) setSkills(skillsRes.data)
      if (expRes.data) setExperiences(expRes.data)
      if (eduRes.data) setEducations(eduRes.data)
    } catch { toast.error('Failed to fetch data') }
  }

  const saveProfile = async () => {
    setIsLoading(true)
    try { await profileService.update(profile); toast.success('Profile updated!') }
    catch { toast.error('Failed to update profile') }
    finally { setIsLoading(false) }
  }

  const saveSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (editingSkill?._id) { await skillService.update(editingSkill._id, skillForm); toast.success('Updated!') }
      else { await skillService.create(skillForm); toast.success('Added!') }
      const res = await skillService.getAll(); setSkills(res.data); closeSkillModal()
    } catch { toast.error('Failed to save') }
    finally { setIsLoading(false) }
  }

  const deleteSkill = async (id: string) => {
    if (!confirm('Delete this skill?')) return
    try { await skillService.delete(id); toast.success('Deleted!'); const res = await skillService.getAll(); setSkills(res.data) }
    catch { toast.error('Failed to delete') }
  }

  const closeSkillModal = () => { setSkillModal(false); setEditingSkill(null); setSkillForm({ name: '', proficiency: 80, category: 'frontend' }) }

  const saveExperience = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (editingExp?._id) { await experienceService.update(editingExp._id, expForm); toast.success('Updated!') }
      else { await experienceService.create(expForm); toast.success('Added!') }
      const res = await experienceService.getAll(); setExperiences(res.data); closeExpModal()
    } catch { toast.error('Failed to save') }
    finally { setIsLoading(false) }
  }

  const deleteExperience = async (id: string) => {
    if (!confirm('Delete this experience?')) return
    try { await experienceService.delete(id); toast.success('Deleted!'); const res = await experienceService.getAll(); setExperiences(res.data) }
    catch { toast.error('Failed to delete') }
  }

  const closeExpModal = () => { setExpModal(false); setEditingExp(null); setExpForm({ company: '', role: '', startDate: '', endDate: '', description: '', current: false }) }

  const saveEducation = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      if (editingEdu?._id) { await educationService.update(editingEdu._id, eduForm); toast.success('Updated!') }
      else { await educationService.create(eduForm); toast.success('Added!') }
      const res = await educationService.getAll(); setEducations(res.data); closeEduModal()
    } catch { toast.error('Failed to save') }
    finally { setIsLoading(false) }
  }

  const deleteEducation = async (id: string) => {
    if (!confirm('Delete this education?')) return
    try { await educationService.delete(id); toast.success('Deleted!'); const res = await educationService.getAll(); setEducations(res.data) }
    catch { toast.error('Failed to delete') }
  }

  const closeEduModal = () => { setEduModal(false); setEditingEdu(null); setEduForm({ institution: '', degree: '', field: '', startDate: '', endDate: '' }) }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'skills', label: 'Skills', icon: Award },
    { id: 'experience', label: 'Experience', icon: Briefcase },
    { id: 'education', label: 'Education', icon: GraduationCap },
  ]

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 border-b border-gray-200 pb-4">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === tab.id ? 'bg-black text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}>
            <tab.icon size={16} /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'profile' && (
        <div className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold mb-4 text-sm">Basic Information</h3>
            <div className="grid grid-cols-2 gap-4">
              {['name', 'title', 'email', 'phone', 'location', 'resumeUrl'].map(field => (
                <div key={field}>
                  <label className="block text-xs font-medium text-gray-600 capitalize mb-1">{field.replace(/([A-Z])/g, ' $1')}</label>
                  <input type={field === 'email' ? 'email' : field === 'resumeUrl' ? 'url' : 'text'}
                    value={(profile as any)[field] || ''}
                    onChange={(e) => setProfile({ ...profile, [field]: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              ))}
            </div>
            <div className="mt-4">
              <label className="block text-xs font-medium text-gray-600 mb-1">Bio</label>
              <textarea value={profile.bio || ''} onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold mb-4 text-sm">Images</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Profile Photo (512×512)</label>
                <div className="flex items-center gap-2">
                  <input type="text" value={profile.avatar || ''} onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" placeholder="URL" />
                  <input type="file" accept="image/*" className="hidden" id="avatarUpload" onChange={async (e) => {
                    const file = e.target.files?.[0]; if (!file) return
                    try { const url = await uploadService.uploadDocumentDirect(file); setProfile({ ...profile, avatar: url }); toast.success('Photo uploaded!') }
                    catch { toast.error('Upload failed') }
                  }} />
                  <label htmlFor="avatarUpload" className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600 whitespace-nowrap">
                    <Upload size={16} /> Upload
                  </label>
                </div>
                {profile.avatar && <span className="text-xs text-green-600 mt-1 inline-block">Photo uploaded</span>}
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Banner</label>
                <div className="flex items-center gap-2">
                  <input type="text" value={profile.banner || ''} onChange={(e) => setProfile({ ...profile, banner: e.target.value })}
                    className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" placeholder="URL" />
                  <input type="file" accept="image/*" className="hidden" id="bannerUpload" onChange={async (e) => {
                    const file = e.target.files?.[0]; if (!file) return
                    try { const url = await uploadService.uploadDocumentDirect(file); setProfile({ ...profile, banner: url }); toast.success('Banner uploaded!') }
                    catch { toast.error('Upload failed') }
                  }} />
                  <label htmlFor="bannerUpload" className="flex items-center gap-2 px-4 py-2.5 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 text-sm text-gray-600 whitespace-nowrap">
                    <Upload size={16} /> Upload
                  </label>
                </div>
                {profile.banner && <span className="text-xs text-green-600 mt-1 inline-block">Banner uploaded</span>}
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h3 className="font-semibold mb-4 text-sm">Social Links</h3>
            <div className="grid grid-cols-2 gap-4">
              {['github', 'linkedin', 'facebook'].map(s => (
                <div key={s}>
                  <label className="block text-xs font-medium text-gray-600 capitalize mb-1">{s}</label>
                  <input type="url" value={profile.socialLinks?.[s] || ''}
                    onChange={(e) => setProfile({ ...profile, socialLinks: { ...profile.socialLinks, [s]: e.target.value } })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              ))}
            </div>
          </div>

          <button onClick={saveProfile} disabled={isLoading}
            className="w-full py-2.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50">
            {isLoading ? 'Saving...' : 'Save Profile'}
          </button>
        </div>
      )}

      {activeTab === 'skills' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-900">Skills</h3>
            <button onClick={() => setSkillModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition">
              <Plus size={14} /> Add Skill
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {skills.map((skill) => (
              <div key={skill._id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{skill.name}</span>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingSkill(skill); setSkillForm(skill); setSkillModal(true) }} className="p-1 hover:text-gray-600"><Edit2 size={13} /></button>
                    <button onClick={() => deleteSkill(skill._id)} className="p-1 hover:text-red-500"><Trash2 size={13} /></button>
                  </div>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-black rounded-full" style={{ width: `${skill.proficiency}%` }} />
                </div>
                <span className="text-xs text-gray-400">{skill.proficiency}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'experience' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-900">Experience</h3>
            <button onClick={() => setExpModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition">
              <Plus size={14} /> Add Experience
            </button>
          </div>
          <div className="space-y-3">
            {experiences.map((exp) => (
              <div key={exp._id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{exp.role}</h4>
                    <p className="text-sm text-gray-500">{exp.company}</p>
                    <p className="text-xs text-gray-400 mt-1">{exp.startDate} - {exp.current ? 'Present' : exp.endDate}</p>
                    {exp.description && <p className="text-sm text-gray-600 mt-2">{exp.description}</p>}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingExp(exp); setExpForm(exp); setExpModal(true) }} className="p-1 hover:text-gray-600"><Edit2 size={14} /></button>
                    <button onClick={() => deleteExperience(exp._id)} className="p-1 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'education' && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm text-gray-900">Education</h3>
            <button onClick={() => setEduModal(true)}
              className="flex items-center gap-1 px-3 py-1.5 bg-black text-white rounded-lg text-xs font-medium hover:bg-gray-800 transition">
              <Plus size={14} /> Add Education
            </button>
          </div>
          <div className="space-y-3">
            {educations.map((edu) => (
              <div key={edu._id} className="bg-white rounded-xl border border-gray-200 p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h4 className="font-semibold text-sm">{edu.degree}</h4>
                    <p className="text-sm text-gray-500">{edu.institution}</p>
                    <p className="text-xs text-gray-400">{edu.field} | {edu.startDate} - {edu.endDate}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingEdu(edu); setEduForm(edu); setEduModal(true) }} className="p-1 hover:text-gray-600"><Edit2 size={14} /></button>
                    <button onClick={() => deleteEducation(edu._id)} className="p-1 hover:text-red-500"><Trash2 size={14} /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {skillModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-md bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{editingSkill ? 'Edit Skill' : 'Add Skill'}</h2>
              <button onClick={closeSkillModal}><X size={20} /></button>
            </div>
            <form onSubmit={saveSkill} className="space-y-4">
              <input type="text" placeholder="Skill name" value={skillForm.name} onChange={(e) => setSkillForm({ ...skillForm, name: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Proficiency</label>
                  <input type="number" min="1" max="100" value={skillForm.proficiency} onChange={(e) => setSkillForm({ ...skillForm, proficiency: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Category</label>
                  <select value={skillForm.category} onChange={(e) => setSkillForm({ ...skillForm, category: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black">
                    {['frontend', 'backend', 'database', 'devops', 'tools'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={closeSkillModal} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {expModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{editingExp ? 'Edit Experience' : 'Add Experience'}</h2>
              <button onClick={closeExpModal}><X size={20} /></button>
            </div>
            <form onSubmit={saveExperience} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Company" value={expForm.company} onChange={(e) => setExpForm({ ...expForm, company: e.target.value })}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
                <input type="text" placeholder="Role" value={expForm.role} onChange={(e) => setExpForm({ ...expForm, role: e.target.value })}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Start Date</label>
                  <input type="month" value={expForm.startDate} onChange={(e) => setExpForm({ ...expForm, startDate: e.target.value })}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">End Date</label>
                  <input type="month" value={expForm.endDate} onChange={(e) => setExpForm({ ...expForm, endDate: e.target.value })}
                    disabled={expForm.current}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
                </div>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={expForm.current} onChange={(e) => setExpForm({ ...expForm, current: e.target.checked })} />
                <span>Currently working here</span>
              </label>
              <textarea placeholder="Description" value={expForm.description} onChange={(e) => setExpForm({ ...expForm, description: e.target.value })}
                rows={3} className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={closeExpModal} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">Save</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {eduModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40">
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="w-full max-w-lg bg-white rounded-xl p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-gray-900">{editingEdu ? 'Edit Education' : 'Add Education'}</h2>
              <button onClick={closeEduModal}><X size={20} /></button>
            </div>
            <form onSubmit={saveEducation} className="space-y-4">
              <input type="text" placeholder="Institution" value={eduForm.institution} onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
              <div className="grid grid-cols-2 gap-4">
                <input type="text" placeholder="Degree" value={eduForm.degree} onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
                <input type="text" placeholder="Field of study" value={eduForm.field} onChange={(e) => setEduForm({ ...eduForm, field: e.target.value })}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <input type="number" placeholder="Start Year" value={eduForm.startDate} onChange={(e) => setEduForm({ ...eduForm, startDate: e.target.value })}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
                <input type="number" placeholder="End Year" value={eduForm.endDate} onChange={(e) => setEduForm({ ...eduForm, endDate: e.target.value })}
                  className="px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-black" required />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={closeEduModal} className="flex-1 border border-gray-300 text-gray-700 py-2.5 rounded-lg text-sm font-medium hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={isLoading} className="flex-1 bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 disabled:opacity-50">Save</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
