'use client'

import { useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/lib/store'
import { 
  LayoutDashboard, FileText, Map, Award, Folder, Settings, 
  LogOut, Users, Eye, MessageSquare, FolderOpen 
} from 'lucide-react'

const sidebarLinks = [
  { href: '/admin/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/dashboard/projects', icon: Folder, label: 'Projects' },
  { href: '/admin/dashboard/blogs', icon: FileText, label: 'Blogs' },
  { href: '/admin/dashboard/destinations', icon: Map, label: 'Destinations' },
  { href: '/admin/dashboard/certifications', icon: Award, label: 'Certifications' },
  { href: '/admin/dashboard/profile', icon: Settings, label: 'Profile' },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { isAuthenticated, logout } = useAuth()

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/admin')
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push('/admin')
  }

  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-black text-white flex flex-col shrink-0">
        <div className="p-6 border-b border-white/10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center font-bold text-black text-sm">
              KP
            </div>
            <span className="font-semibold text-sm">Admin Panel</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {sidebarLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
                  isActive
                    ? 'bg-white text-black font-medium'
                    : 'text-gray-400 hover:bg-white/10 hover:text-white'
                }`}
              >
                <link.icon size={18} />
                {link.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-red-400 hover:bg-white/10 transition"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-h-screen">
        <header className="h-16 bg-white border-b border-gray-200 px-6 flex items-center justify-between">
          <h1 className="text-sm font-semibold text-gray-900">Dashboard</h1>
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <span>kaushalpandey.co.in</span>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
