'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Download, Bug, Copy, Check, ExternalLink, ArrowLeft, Mail, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { betaAppService } from '@/services/api'
import { Loading } from '@/components/Loading'

const GOOGLE_FORM_URL = 'https://docs.google.com/forms/d/e/1FAIpQLScN9vDoiA2ri9YE0rtuagPCF_zO1u6DPu_qf0_OejAAWtIw-w/viewform?usp=publish-editor'
const FEEDBACK_EMAIL = 'kaushalpandey@outlook.in'
const STORAGE_KEY = 'beta_tester_submitted'

function generateTesterId(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let id = 'TEST-'
  for (let i = 0; i < 10; i++) {
    id += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return id
}

export default function BetaTesting() {
  const [apps, setApps] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [testerId, setTesterId] = useState('')
  const [copied, setCopied] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  useEffect(() => {
    setTesterId(generateTesterId())
    setSubmitted(localStorage.getItem(STORAGE_KEY) === 'true')
    betaAppService.getAll().then(res => {
      setApps(res.data || [])
    }).catch(() => {}).finally(() => setLoading(false))
  }, [])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(testerId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* fallback */ }
  }

  const handleSubmitted = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setSubmitted(true)
  }

  if (loading) return <Loading />

  return (
    <div className="min-h-screen">
      <section className="relative pt-28 pb-20 md:pt-36 md:pb-28 overflow-hidden">
        <div className="max-w-4xl mx-auto px-6">
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black mb-8 transition-colors">
            <ArrowLeft size={16} /> Back to Home
          </Link>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white text-xs font-medium rounded-full mb-6">
              <Bug size={14} /> Beta Program
            </div>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl sm:text-5xl font-bold tracking-tight mb-4">
            Beta Testing
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-500 max-w-xl">
            Help us improve by testing our apps before public release. Your feedback matters.
          </motion.p>
        </div>
      </section>

      {!submitted ? (
        <section className="pb-28">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <div className="bg-gray-50 rounded-2xl border border-gray-200 p-8 mb-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Your Tester ID</h2>
                <p className="text-sm text-gray-500 mb-4">Use this unique ID when filling out the beta registration form below.</p>
                <div className="flex items-center gap-3">
                  <code className="flex-1 px-4 py-3 bg-white border border-gray-300 rounded-lg text-sm font-mono font-bold text-black select-all">
                    {testerId}
                  </code>
                  <button onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-3 border border-gray-300 rounded-lg hover:bg-white text-sm font-medium text-gray-700 transition-colors">
                    {copied ? <Check size={16} className="text-green-600" /> : <Copy size={16} />}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-8">
                <h2 className="text-xl font-bold text-gray-900 mb-2">Step 1: Register as Beta Tester</h2>
                <p className="text-sm text-gray-500 mb-6">
                  Fill out the form below and use <strong className="text-black">{testerId}</strong> as your tester ID.
                </p>

                <div className="bg-gray-50 rounded-xl border border-gray-200 p-4 mb-6">
                  <p className="text-sm text-gray-600">
                    <strong>Instructions:</strong> Open the Google Form, enter <code className="px-2 py-0.5 bg-gray-200 rounded text-xs font-mono">{testerId}</code> in the Tester ID field, fill in your details, and submit.
                  </p>
                </div>

                <div className="w-full overflow-hidden rounded-xl border border-gray-200">
                  <iframe
                    src={GOOGLE_FORM_URL}
                    className="w-full h-[800px] md:h-[1000px]"
                    frameBorder="0"
                    marginHeight={0}
                    marginWidth={0}
                  >
                    Loading form...
                  </iframe>
                </div>

                <div className="mt-6 text-center space-y-4">
                  <a href={GOOGLE_FORM_URL} target="_blank" rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800 transition-colors">
                    Open form in new tab <ExternalLink size={14} />
                  </a>

                  <div className="border-t border-gray-200 pt-6">
                    <p className="text-sm text-gray-500 mb-4">After submitting the form, click the button below to access the apps.</p>
                    <button onClick={handleSubmitted}
                      className="inline-flex items-center gap-2 px-8 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                      <CheckCircle size={18} /> I've Submitted the Form — Show Apps
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      ) : (
        <section className="pb-28">
          <div className="max-w-4xl mx-auto px-6">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}>
              <div className="bg-green-50 border border-green-200 rounded-2xl p-6 mb-8 flex items-center gap-4">
                <CheckCircle size={24} className="text-green-600 shrink-0" />
                <div>
                  <h2 className="font-semibold text-green-800">Registration Complete!</h2>
                  <p className="text-sm text-green-700">Thank you for registering as a beta tester. Your tester ID is <strong>{testerId}</strong>.</p>
                </div>
              </div>

              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 2: Download & Test Our Apps</h2>

              {apps.length === 0 ? (
                <div className="bg-white rounded-2xl border border-gray-200 p-12 text-center">
                  <p className="text-gray-500">No beta apps available yet. Check back soon!</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {apps.map((app, i) => (
                    <motion.div key={app._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                      className="bg-white rounded-2xl border border-gray-200 p-8">
                      <div className="flex items-start gap-5">
                        {app.icon ? (
                          <img src={app.icon} alt={app.appName} className="w-20 h-20 object-contain rounded-2xl shrink-0" />
                        ) : (
                          <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center text-2xl font-bold shrink-0">
                            {app.appName?.charAt(0) || '?'}
                          </div>
                        )}
                        <div className="flex-1">
                          <h3 className="text-2xl font-bold text-gray-900">{app.appName}</h3>
                          <p className="text-sm text-gray-500 mt-1">Version {app.version}</p>
                          <p className="text-gray-600 mt-3 leading-relaxed">{app.description}</p>
                          <div className="flex flex-wrap items-center gap-3 mt-5">
                            <a href={app.apkUrl} target="_blank" rel="noopener noreferrer"
                              className="inline-flex items-center gap-2 px-6 py-3 bg-black text-white font-medium rounded-lg hover:bg-gray-800 transition-colors">
                              <Download size={18} /> Download APK
                            </a>
                            <a href={`mailto:${FEEDBACK_EMAIL}?subject=Feedback on ${app.appName} v${app.version}&body=Tester ID: ${testerId}%0D%0AApp: ${app.appName}%0D%0AVersion: ${app.version}%0D%0A%0D%0AFeedback:%0D%0A`}
                              className="inline-flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors">
                              <Mail size={18} /> Mail us your experience
                            </a>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        </section>
      )}
    </div>
  )
}
