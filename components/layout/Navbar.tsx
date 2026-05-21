'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'

const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/tech-profile', label: 'Profile' },
  { href: '/projects', label: 'Projects' },
  { href: '/skills', label: 'Skills' },
  { href: '/certifications', label: 'Certifications' },
  { href: '/tourism', label: 'Tourism' },
  { href: '/beta-testing', label: 'Beta' },
]

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <nav className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        isScrolled ? 'bg-white/95 backdrop-blur border-b' : 'bg-transparent'
      )}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 bg-black rounded-lg flex items-center justify-center text-white text-sm font-bold tracking-tight">
              KP
            </div>
            <span className="hidden sm:block font-semibold text-base">Kaushal Pandey</span>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'relative text-sm font-medium transition-colors py-1',
                  pathname === link.href
                    ? 'text-black'
                    : 'text-gray-500 hover:text-black'
                )}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute -bottom-0.5 left-0 right-0 h-0.5 bg-black rounded-full" />
                )}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/tech-profile"
              className="px-5 py-2 bg-black text-white text-sm font-medium rounded-lg hover:bg-gray-800 transition-colors"
            >
              Contact Me
            </Link>
          </div>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-gray-600 hover:text-black"
          >
            {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
      )}
      {isMobileMenuOpen && (
        <div className="fixed inset-y-0 right-0 z-50 w-72 bg-white shadow-xl">
          <div className="flex flex-col h-full">
            <div className="flex items-center justify-between px-6 h-16 border-b">
              <span className="font-semibold">Menu</span>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-1">
                <X size={22} />
              </button>
            </div>
            <div className="flex-1 flex flex-col gap-1 p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    'px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                    pathname === link.href
                      ? 'bg-black text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
            <div className="p-4 border-t">
              <Link
                href="/tech-profile"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block w-full px-5 py-3 bg-black text-white text-sm font-medium rounded-lg text-center hover:bg-gray-800 transition-colors"
              >
                Contact Me
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
