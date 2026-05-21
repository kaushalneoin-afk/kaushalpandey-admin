'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ArrowRight, User, Award, Folder, Zap, Map, Bug, Code2, ChevronRight } from 'lucide-react'
import { profileService, projectService, skillService, certificationService, destinationService } from '@/services/api'
import { Loading } from '@/components/Loading'

const sections = [
  { id: 'tech-profile', title: 'Tech Profile', description: 'LinkedIn-style profile with skills, experience, achievements, and certifications.', icon: User, count: '—', label: 'Skills' },
  { id: 'projects', title: 'Projects', description: 'Full-stack applications, Android apps, and API integrations with detailed docs.', icon: Folder, count: '—', label: 'Projects' },
  { id: 'certifications', title: 'Certifications', description: 'Verified professional certifications from Google, AWS, Meta, and MongoDB.', icon: Award, count: '—', label: 'Credentials' },
  { id: 'skills', title: 'Skills', description: 'Technical expertise across Java, Spring Boot, React, and cloud technologies.', icon: Zap, count: '—', label: 'Technologies' },
  { id: 'tourism', title: 'Tourism', description: 'Travel blogs, vlogs, and destination guides exploring the beauty of India.', icon: Map, count: '—', label: 'Destinations' },
  { id: 'beta-testing', title: 'Beta Testing', description: 'Join the beta program — test our apps and help shape the future.', icon: Bug, count: '—', label: 'Test Apps' },
]

const ads = [
  { id: 'tourism', icon: '🛣️', tagline: 'Road trip itni dangerous thi ki Google Maps bhi confuse ho gaya \u{1F602}', emoji: '\u{1F30D}' },
  { id: 'projects', icon: '\u{1F4BB}', tagline: 'Explore scalable full-stack applications, mobile apps & API integrations.', emoji: '\u{1F680}' },
  { id: 'skills', icon: '\u{1F9D1}\u200D\u{1F393}', tagline: 'Technical expertise across Java, Spring Boot, React, cloud & more.', emoji: '\u{1F4CA}' },
  { id: 'certifications', icon: '\u{1F4DC}', tagline: 'Verified credentials from Microsoft, AWS, IBM & industry leaders.', emoji: '\u{1F3C6}' },
  { id: 'beta-testing', icon: '\u{1F41B}', tagline: 'Become a beta tester — try our apps before public release & shape the future.', emoji: '\u{1F6E0}\uFE0F' },
]

export default function Home() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [counts, setCounts] = useState({ projects: 0, skills: 0, certifications: 0, destinations: 0 })
  const [techs, setTechs] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [adIndex, setAdIndex] = useState(0)

  useEffect(() => {
    Promise.all([
      profileService.get().catch(() => null),
      projectService.getAll().catch(() => ({ data: [] })),
      skillService.getAll().catch(() => ({ data: [] })),
      certificationService.getAll().catch(() => ({ data: [] })),
      destinationService.getAll().catch(() => ({ data: [] })),
    ]).then(([prof, projRes, skillRes, certRes, destRes]) => {
      const proj = projRes?.data || []
      const skills = skillRes?.data || []
      const certs = certRes?.data || []
      const dests = destRes?.data || []
      setProfile(prof?.data || null)
      setCounts({ projects: proj.length, skills: skills.length, certifications: certs.length, destinations: dests.length })
      const names: string[] = skills.map((s: any) => s.name)
      setTechs([...new Set(names)])
      sections[0] = { ...sections[0], count: `${skills.length}+` }
      sections[1] = { ...sections[1], count: `${proj.length}+` }
      sections[2] = { ...sections[2], count: `${certs.length}+` }
      sections[3] = { ...sections[3], count: `${skills.length}+` }
      sections[4] = { ...sections[4], count: `${dests.length}+` }
      sections[5] = { ...sections[5], count: '1+ Test Apps' }
    }).finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    const t = setInterval(() => setAdIndex(i => (i + 1) % ads.length), 4000)
    return () => clearInterval(t)
  }, [])

  if (loading) return <Loading />

  return (
    <div className="min-h-screen">
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-full mb-6">
                <span className="w-1.5 h-1.5 bg-white rounded-full" />
                Available for opportunities
              </div>
            </motion.div>

            <motion.div key={adIndex} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}
              onClick={() => router.push(`/${ads[adIndex].id}`)}
              className="flex items-center gap-3 cursor-pointer group mb-6 p-3 rounded-xl bg-gradient-to-r from-yellow-50 via-orange-50 to-red-50 border border-yellow-200">
              <span className="text-2xl shrink-0">{ads[adIndex].emoji}</span>
              <p className="text-sm md:text-base text-gray-800 leading-relaxed group-hover:text-black transition-colors">
                <span className="font-semibold">{ads[adIndex].icon}</span>{' '}
                {ads[adIndex].tagline}
              </p>
              <div className="flex gap-1.5 ml-auto shrink-0">
                {ads.map((_, i) => (
                  <span key={i} className={`w-2 h-2 rounded-full transition-all ${i === adIndex ? 'bg-black w-5' : 'bg-gray-300'}`} />
                ))}
              </div>
            </motion.div>

            <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-balance leading-[1.1]">
              Hi, I'm <span className="text-black">{profile?.name || 'Kaushal Pandey'}</span>
            </motion.h1>

            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-gray-500 max-w-xl leading-relaxed">
              {profile?.title || 'Full Stack Developer'}. {profile?.bio?.split('.')[0] || 'Building scalable solutions that make an impact.'}
            </motion.p>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-wrap gap-3 mt-8">
              <button onClick={() => router.push('/tech-profile')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                View Profile <ArrowRight size={16} />
              </button>
              <button onClick={() => router.push('/projects')}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors">
                See Projects
              </button>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-8 mt-12 pt-8 border-t border-gray-100">
              {[
                { label: 'Experience', value: profile?.experience ? `${profile.experience}+ Years` : '1+ Years' },
                { label: 'Projects', value: `${counts.projects}+` },
                { label: 'Technologies', value: `${counts.skills}+` },
                { label: 'Certifications', value: `${counts.certifications}+` },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-gray-500">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-12">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Explore</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything about me</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {sections.map((section, index) => (
              <motion.div key={section.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                transition={{ delay: index * 0.05 }} onClick={() => router.push(`/${section.id}`)}
                className="group cursor-pointer bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-400 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center mb-4">
                  <section.icon className="w-5 h-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold mb-2 group-hover:text-gray-600 transition-colors">{section.title}</h3>
                <p className="text-sm text-gray-500 mb-4 leading-relaxed">{section.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400 font-medium">{section.count} {section.label}</span>
                  <ChevronRight size={16} className="text-gray-300 group-hover:text-gray-600 group-hover:translate-x-1 transition-all" />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Tech Stack</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Technologies I work with</h2>
            <p className="text-gray-500 leading-relaxed mb-10">Building solutions with modern technologies and best practices</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {(techs.length > 0 ? techs : ['Java', 'Spring Boot', 'React', 'Node.js', 'TypeScript', 'MongoDB', 'AWS', 'Android', 'REST APIs', 'Git', 'Docker', 'PostgreSQL']).map((tech, i) => (
              <motion.span key={tech} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.03 }}
                className="px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors">
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-white mb-6">Let's work together</h2>
            <p className="text-gray-400 leading-relaxed mb-10">
              {profile?.bio || "I'm currently available for freelance work and full-time opportunities. Let's build something great."}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button onClick={() => router.push('/tech-profile')}
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black font-medium rounded-lg hover:bg-gray-100 transition-colors">
                Get in Touch <ArrowRight size={16} />
              </button>
              <button onClick={() => router.push('/projects')}
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 font-medium rounded-lg hover:border-gray-500 hover:text-white transition-colors">
                View Projects
              </button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
