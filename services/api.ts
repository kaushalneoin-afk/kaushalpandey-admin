import axios from 'axios'

const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api'

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
})

const uploadApi = axios.create({
  baseURL: API_URL,
  timeout: 60000
})

uploadApi.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const authService = {
  login: (username: string, password: string) => api.post('/auth/login', { username, password }),
  verify: (token: string) => api.post('/auth/verify', { token }),
}

export const projectService = {
  getAll: (params?: any) => api.get('/projects', { params }),
  getBySlug: (slug: string) => api.get(`/projects/${slug}`),
  create: (data: any) => api.post('/projects', data),
  update: (id: string, data: any) => api.put(`/projects/${id}`, data),
  delete: (id: string) => api.delete(`/projects/${id}`),
}

export const blogService = {
  getAll: (params?: any) => api.get('/blogs', { params }),
  getBySlug: (slug: string) => api.get(`/blogs/${slug}`),
  create: (data: any) => api.post('/blogs', data),
  update: (id: string, data: any) => api.put(`/blogs/${id}`, data),
  delete: (id: string) => api.delete(`/blogs/${id}`),
}

export const destinationService = {
  getAll: (params?: any) => api.get('/destinations', { params }),
  getBySlug: (slug: string) => api.get(`/destinations/${slug}`),
  create: (data: any) => api.post('/destinations', data),
  update: (id: string, data: any) => api.put(`/destinations/${id}`, data),
  delete: (id: string) => api.delete(`/destinations/${id}`),
}

export const certificationService = {
  getAll: () => api.get('/certifications'),
  getById: (id: string) => api.get(`/certifications/${id}`),
  create: (data: any) => api.post('/certifications', data),
  update: (id: string, data: any) => api.put(`/certifications/${id}`, data),
  delete: (id: string) => api.delete(`/certifications/${id}`),
}

export const commentService = {
  getByBlog: (blogId: string) => api.get(`/comments/${blogId}`),
  create: (data: any) => api.post('/comments', data),
  reply: (id: string, data: any) => api.post(`/comments/${id}/reply`, data),
  delete: (id: string) => api.delete(`/comments/${id}`),
}

export const profileService = {
  get: () => api.get('/profile'),
  update: (data: any) => api.put('/profile', data),
}

export const skillService = {
  getAll: () => api.get('/skills'),
  create: (data: any) => api.post('/skills', data),
  update: (id: string, data: any) => api.put(`/skills/${id}`, data),
  delete: (id: string) => api.delete(`/skills/${id}`),
}

export const experienceService = {
  getAll: () => api.get('/experiences'),
  create: (data: any) => api.post('/experiences', data),
  update: (id: string, data: any) => api.put(`/experiences/${id}`, data),
  delete: (id: string) => api.delete(`/experiences/${id}`),
}

export const educationService = {
  getAll: () => api.get('/education'),
  create: (data: any) => api.post('/education', data),
  update: (id: string, data: any) => api.put(`/education/${id}`, data),
  delete: (id: string) => api.delete(`/education/${id}`),
}

export const betaAppService = {
  getAll: () => api.get('/beta-apps'),
}

export const toolService = {
  getAll: () => api.get('/tools'),
}

export const reviewService = {
  getByBlog: (blogId: string) => api.get(`/reviews/${blogId}`),
  getCounts: (blogId: string) => api.get(`/reviews/${blogId}/counts`),
  create: (data: { blogId: string; type: 'like' | 'comment'; name: string; content?: string }) => api.post('/reviews', data),
  delete: (id: string) => api.delete(`/reviews/${id}`),
}

export const uploadService = {
  uploadImage: async (file: File) => {
    const formData = new FormData()
    formData.append('image', file)
    return uploadApi.post('/upload/image', formData)
  },
  uploadVideo: async (file: File) => {
    const formData = new FormData()
    formData.append('video', file)
    return uploadApi.post('/upload/video', formData)
  },
  uploadDocumentDirect: async (file: File): Promise<string> => {
    const sigRes = await uploadApi.post('/upload/generate-signature', { folder: 'kaushalpandey/documents' })
    const { signature, timestamp, api_key, cloud_name, folder } = sigRes.data
    const fd = new FormData()
    fd.append('file', file)
    fd.append('timestamp', timestamp)
    fd.append('api_key', api_key)
    fd.append('signature', signature)
    fd.append('folder', folder)
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onload = () => {
        if (xhr.status === 200) {
          try { resolve(JSON.parse(xhr.responseText).secure_url) }
          catch { reject(new Error('Invalid Cloudinary response')) }
        } else {
          try { reject(new Error(JSON.parse(xhr.responseText).error?.message || `Upload failed (${xhr.status})`)) }
          catch { reject(new Error(`Upload failed (${xhr.status})`)) }
        }
      }
      xhr.onerror = () => reject(new Error('Network error'))
      xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloud_name}/auto/upload`)
      xhr.send(fd)
    })
  },
  delete: (publicId: string) => api.delete(`/upload/${publicId}`),
}

export default api