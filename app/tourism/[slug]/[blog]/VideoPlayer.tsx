import { useRef, useState } from 'react'
import { Play, AlertTriangle } from 'lucide-react'
import { getDriveImageUrl, getDriveVideoUrl } from '@/lib/utils'

interface VideoPlayerProps {
  url: string
  type: 'youtube' | 'drive'
  poster?: string
}

export default function VideoPlayer({ url, type, poster }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [started, setStarted] = useState(false)
  const [error, setError] = useState(false)
  const [youtubeInit, setYoutubeInit] = useState(false)

  const posterImg = poster ? getDriveImageUrl(poster) : null

  if (type === 'youtube') {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|watch\?v=|v\/))([^&\s]+)/)
    const embedUrl = match ? `https://www.youtube.com/embed/${match[1]}?autoplay=1` : url
    return (
      <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
        {!youtubeInit ? (
          <div className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer" onClick={() => setYoutubeInit(true)}>
            {posterImg && <img src={posterImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
            <div className="absolute inset-0 bg-black/30" />
            <div className="relative w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition hover:scale-110">
              <Play className="w-10 h-10 text-white ml-2" />
            </div>
          </div>
        ) : (
          <iframe src={embedUrl} className="absolute inset-0 w-full h-full" allow="autoplay; fullscreen" allowFullScreen />
        )}
      </div>
    )
  }

  const videoSrc = getDriveVideoUrl(url)

  const handlePlay = () => {
    setStarted(true)
    setError(false)
    setTimeout(() => videoRef.current?.play().catch(() => setError(true)), 100)
  }

  return (
    <div className="relative w-full bg-black rounded-xl overflow-hidden" style={{ aspectRatio: '16/9' }}>
      {!started && (
        <div className="absolute inset-0 z-10 flex items-center justify-center cursor-pointer" onClick={handlePlay}>
          {posterImg && <img src={posterImg} alt="" className="absolute inset-0 w-full h-full object-cover" />}
          <div className="absolute inset-0 bg-black/30" />
          <div className="relative w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition hover:scale-110">
            <Play className="w-10 h-10 text-white ml-2" />
          </div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 text-white p-4">
          <AlertTriangle className="w-8 h-8 text-red-400" />
          <p className="text-sm text-gray-300 text-center">Video failed to load. Try again later.</p>
          <button onClick={() => { setError(false); setStarted(false) }} className="px-4 py-2 bg-white/20 rounded-lg text-sm hover:bg-white/30 transition">
            Retry
          </button>
        </div>
      )}
      <video
        ref={videoRef}
        src={started ? videoSrc : undefined}
        className="w-full h-full object-contain"
        controls={started && !error}
        controlsList="nodownload"
        disablePictureInPicture
        playsInline
        preload="none"
        onError={() => setError(true)}
      />
    </div>
  )
}
