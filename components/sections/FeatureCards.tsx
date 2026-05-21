'use client'

import { motion } from 'framer-motion'
import { useRouter } from 'next/navigation'
import { Code2, Briefcase, Award, Map, ChevronRight } from 'lucide-react'

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
}

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
}

interface CardProps {
  icon: React.ElementType
  title: string
  description: string
  href: string
  index: number
}

function Card({ icon: Icon, title, description, href, index }: CardProps) {
  const router = useRouter()

  return (
    <motion.div
      variants={item}
      onClick={() => router.push(href)}
      className="group cursor-pointer bg-white rounded-xl border border-gray-200 p-6 hover:border-gray-400 hover:shadow-sm transition-all"
    >
      <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center mb-4">
        <Icon className="w-5 h-5 text-white" />
      </div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-gray-600 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-500 mb-4 leading-relaxed">
        {description}
      </p>
      <div className="flex items-center gap-1 text-sm font-medium text-gray-400 group-hover:text-gray-700 transition-colors">
        Explore <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
      </div>
    </motion.div>
  )
}

const features = [
  {
    icon: Code2,
    title: 'Tech Profile',
    description: 'Professional portfolio with skills, experience, education, and achievements.',
    href: '/tech-profile',
  },
  {
    icon: Briefcase,
    title: 'Projects',
    description: 'Explore my full-stack projects, Android applications, and API integrations.',
    href: '/projects',
  },
  {
    icon: Award,
    title: 'Certifications',
    description: 'Verified professional certifications with credential IDs.',
    href: '/certifications',
  },
  {
    icon: Map,
    title: 'Tourism',
    description: 'Travel blogs, vlogs, and destination guides for places across India.',
    href: '/tourism',
  },
]

export default function FeatureCards() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true }}
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
    >
      {features.map((feature, index) => (
        <Card key={feature.title} {...feature} index={index} />
      ))}
    </motion.div>
  )
}
