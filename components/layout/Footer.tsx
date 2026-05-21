'use client'

import Link from 'next/link'
import { Github, Linkedin, Mail, Instagram, Youtube, MapPin } from 'lucide-react'

const footerLinks = {
  portfolio: [
    { href: '/tech-profile', label: 'Profile' },
    { href: '/projects', label: 'Projects' },
    { href: '/certifications', label: 'Certifications' },
    { href: '/internship', label: 'Internship' },
  ],
  tourism: [
    { href: '/tourism', label: 'Destinations' },
    { href: '/skills', label: 'Skills' },
  ],
  connect: [
    { href: 'https://github.com', label: 'GitHub' },
    { href: 'https://linkedin.com', label: 'LinkedIn' },
    { href: 'https://instagram.com', label: 'Instagram' },
    { href: 'https://youtube.com', label: 'YouTube' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-black">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          <div className="space-y-5">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-black text-sm font-bold">
                KP
              </div>
              <span className="font-semibold text-base text-white">Kaushal Pandey</span>
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed">
              Full Stack Developer crafting digital experiences with modern technologies.
            </p>
            <div className="flex gap-3">
              {[
                { icon: Github, href: 'https://github.com' },
                { icon: Linkedin, href: 'https://linkedin.com' },
                { icon: Instagram, href: 'https://instagram.com' },
                { icon: Youtube, href: 'https://youtube.com' },
              ].map(({ icon: Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-white/10 flex items-center justify-center text-gray-400 hover:bg-white/20 hover:text-white transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Portfolio</h3>
            <ul className="space-y-3">
              {footerLinks.portfolio.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Explore</h3>
            <ul className="space-y-3">
              {footerLinks.tourism.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-5">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <MapPin size={14} className="text-gray-500" />
                India
              </li>
              <li className="flex items-center gap-2 text-sm text-gray-400">
                <Mail size={14} className="text-gray-500" />
                kaushal@kaushalpandey.co.in
              </li>
            </ul>
            <Link
              href="/tech-profile#contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-black text-sm font-medium rounded-lg hover:bg-gray-100 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Kaushal Pandey. All rights reserved.</p>
          <p>Built with Next.js</p>
        </div>
      </div>
    </footer>
  )
}
