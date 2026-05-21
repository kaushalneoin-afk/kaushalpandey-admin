'use client'

import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { Code2, Database, Server, Smartphone, Cloud } from 'lucide-react'
import { skillService } from '@/services/api'

interface Skill {
  _id: string
  name: string
  proficiency: number
  category: string
}

const defaultSkills: Skill[] = [
  { _id: '1', name: 'Java', proficiency: 90, category: 'backend' },
  { _id: '2', name: 'Spring Boot', proficiency: 85, category: 'backend' },
  { _id: '3', name: 'React', proficiency: 80, category: 'frontend' },
  { _id: '4', name: 'Node.js', proficiency: 75, category: 'backend' },
  { _id: '5', name: 'MongoDB', proficiency: 75, category: 'database' },
  { _id: '6', name: 'Android', proficiency: 80, category: 'mobile' },
  { _id: '7', name: 'REST APIs', proficiency: 85, category: 'backend' },
  { _id: '8', name: 'AWS', proficiency: 70, category: 'devops' },
  { _id: '9', name: 'Git/GitHub', proficiency: 90, category: 'devops' },
  { _id: '10', name: 'JavaScript', proficiency: 80, category: 'frontend' },
  { _id: '11', name: 'TypeScript', proficiency: 75, category: 'frontend' },
  { _id: '12', name: 'MySQL', proficiency: 70, category: 'database' },
]

const categories = [
  { id: 'all', label: 'All', icon: Code2 },
  { id: 'frontend', label: 'Frontend', icon: Code2 },
  { id: 'backend', label: 'Backend', icon: Server },
  { id: 'database', label: 'Database', icon: Database },
  { id: 'devops', label: 'DevOps', icon: Cloud },
  { id: 'mobile', label: 'Mobile', icon: Smartphone },
]

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>(defaultSkills)
  const [activeCategory, setActiveCategory] = useState('all')

  useEffect(() => {
    fetchSkills()
  }, [])

  const fetchSkills = async () => {
    try {
      const response = await skillService.getAll()
      if (response.data && response.data.length > 0) {
        setSkills(response.data)
      }
    } catch (error) {
      console.log('Using default skills')
    }
  }

  const filteredSkills = activeCategory === 'all'
    ? skills
    : skills.filter(s => s.category === activeCategory)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mb-12"
        >
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-widest mb-3">Expertise</p>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            My Skills
          </h1>
          <p className="text-gray-500 leading-relaxed">
            A comprehensive overview of my technical expertise across various technologies and frameworks.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap gap-2 mb-10"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeCategory === cat.id
                  ? 'bg-black text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              <cat.icon size={14} />
              {cat.label}
            </button>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSkills.map((skill, i) => (
            <motion.div
              key={skill._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
              className="bg-white rounded-xl border border-gray-200 p-5 hover:border-gray-400 transition-all"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold">{skill.name}</h3>
                <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs font-medium rounded-md">
                  {skill.category}
                </span>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400">Proficiency</span>
                  <span className="font-medium">{skill.proficiency}%</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.proficiency}%` }}
                    transition={{ duration: 0.5, delay: i * 0.03 }}
                    className="h-full bg-black rounded-full"
                  />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`text-xs ${star <= Math.round(skill.proficiency / 20) ? 'text-black' : 'text-gray-200'}`}
                  >
                    ★
                  </span>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 bg-gray-50 rounded-xl p-8"
        >
          <h2 className="text-xl font-bold mb-6 text-center">Tools & Technologies</h2>
          <div className="flex flex-wrap justify-center gap-3">
            {['VS Code', 'IntelliJ IDEA', 'Postman', 'MongoDB Compass', 'Git', 'Docker', 'AWS Console', 'Android Studio', 'Figma', 'Notion', 'Slack', 'Jira'].map((tool, i) => (
              <motion.span
                key={tool}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.03 }}
                className="px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium rounded-lg"
              >
                {tool}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
