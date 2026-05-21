'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Download, ExternalLink, MapPin, Mail, Award, GraduationCap, Briefcase, User } from 'lucide-react'
import { profileService, skillService, experienceService, educationService } from '@/services/api'
import { Loading } from '@/components/Loading'

export default function TechProfile() {
  const [profile, setProfile] = useState<any>(null)
  const [skills, setSkills] = useState<any[]>([])
  const [experiences, setExperiences] = useState<any[]>([])
  const [education, setEducation] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      profileService.get().catch(() => ({ data: null })),
      skillService.getAll().catch(() => ({ data: [] })),
      experienceService.getAll().catch(() => ({ data: [] })),
      educationService.getAll().catch(() => ({ data: [] })),
    ]).then(([profRes, skillRes, expRes, eduRes]) => {
      setProfile(profRes?.data || null)
      setSkills(skillRes?.data || [])
      setExperiences(expRes?.data || [])
      setEducation(eduRes?.data || [])
    }).finally(() => setLoading(false))
  }, [])

  if (loading) return <Loading />

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-xl border border-gray-200 p-6">
              <div className="text-center">
                <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-black flex items-center justify-center text-3xl font-bold text-white">
                  {profile?.name?.split(' ').map((n: string) => n[0]).join('') || 'KP'}
                </div>
                <h2 className="text-xl font-bold mb-1">{profile?.name || 'Kaushal Pandey'}</h2>
                <p className="text-sm text-gray-500 mb-4">{profile?.title || 'Full Stack Developer'}</p>
                <div className="space-y-2 text-sm">
                  {profile?.location && (
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <MapPin size={14} /> {profile.location}
                    </div>
                  )}
                  {profile?.email && (
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Mail size={14} /> {profile.email}
                    </div>
                  )}
                </div>
                <div className="flex gap-3 mt-6 justify-center">
                  {profile?.resumeUrl && (
                    <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors">
                      <Download size={14} /> Resume
                    </a>
                  )}
                  {profile?.socialLinks?.linkedin && (
                    <a href={profile.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                      <ExternalLink size={14} /> LinkedIn
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold mb-5 flex items-center gap-2"><Award size={16} /> Skills</h3>
              {skills.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No skills added yet.</p>
              ) : (
                <div className="space-y-4">
                  {skills.map((skill: any, i: number) => (
                    <div key={skill._id}>
                      <div className="flex justify-between text-sm mb-1.5">
                        <span className="font-medium">{skill.name}</span>
                        <span className="text-gray-400">{skill.proficiency}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${skill.proficiency}%` }}
                          transition={{ delay: 0.2 + i * 0.05, duration: 0.5 }} className="h-full bg-black rounded-full" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          <div className="lg:col-span-2 space-y-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold mb-3 flex items-center gap-2"><User size={16} /> About</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{profile?.bio || 'Full Stack Developer building impactful digital solutions.'}</p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold mb-5 flex items-center gap-2"><Briefcase size={16} /> Experience</h3>
              {experiences.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No experience entries yet.</p>
              ) : (
                <div className="space-y-6">
                  {experiences.map((exp: any) => (
                    <div key={exp._id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <Briefcase size={16} className="text-gray-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{exp.role}</h4>
                        <p className="text-sm text-gray-500">{exp.company}</p>
                        <p className="text-xs text-gray-400 mt-1 mb-2">
                          {exp.startDate && new Date(exp.startDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                          {exp.current ? ' - Present' : exp.endDate ? ` - ${new Date(exp.endDate).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}` : ''}
                        </p>
                        <p className="text-sm text-gray-600">{exp.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white rounded-xl border border-gray-200 p-6">
              <h3 className="font-semibold mb-5 flex items-center gap-2"><GraduationCap size={16} /> Education</h3>
              {education.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-4">No education entries yet.</p>
              ) : (
                <div className="space-y-6">
                  {education.map((edu: any) => (
                    <div key={edu._id} className="flex gap-4">
                      <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0 mt-0.5">
                        <GraduationCap size={16} className="text-gray-700" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm">{edu.degree}</h4>
                        <p className="text-sm text-gray-500">{edu.institution}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {edu.field && `${edu.field} • `}
                          {edu.startDate && new Date(edu.startDate).getFullYear()}
                          {edu.endDate ? ` - ${new Date(edu.endDate).getFullYear()}` : edu.startDate ? ' - Present' : ''}
                        </p>
                        {edu.description && <p className="text-sm text-gray-600 mt-1">{edu.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {profile?.achievements?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                className="bg-white rounded-xl border border-gray-200 p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2"><Award size={16} /> Achievements</h3>
                <div className="grid grid-cols-2 gap-3">
                  {profile.achievements.map((ach: string, i: number) => (
                    <div key={i} className="p-3 rounded-lg bg-gray-50 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-black flex items-center justify-center shrink-0">
                        <Award size={10} className="text-white" />
                      </div>
                      <span className="text-sm font-medium">{ach}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
