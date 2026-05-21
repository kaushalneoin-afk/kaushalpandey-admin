export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')
  if (!id) return new Response('Missing id', { status: 400 })

  const range = req.headers.get('range')
  const fetchHeaders: Record<string, string> = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Referer': 'https://drive.google.com/',
  }
  if (range) fetchHeaders['Range'] = range

  const driveUrls = [
    `https://drive.usercontent.google.com/download?id=${id}&export=download&confirm=t`,
    `https://drive.google.com/uc?export=download&id=${id}&confirm=t`,
  ]

  for (const driveUrl of driveUrls) {
    try {
      const driveRes = await fetch(driveUrl, { headers: fetchHeaders, redirect: 'follow' })

      if (!driveRes.ok || !driveRes.body) continue

      const contentType = driveRes.headers.get('content-type') || ''
      if (contentType.includes('text/html')) continue

      const resHeaders: Record<string, string> = {
        'Accept-Ranges': 'bytes',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
        'Access-Control-Allow-Headers': 'Range',
        'Content-Type': contentType || 'video/mp4',
      }

      const contentLength = driveRes.headers.get('content-length')
      if (contentLength && driveRes.status === 200) {
        resHeaders['Content-Length'] = contentLength
      }

      if (driveRes.status === 206 && range) {
        const cr = driveRes.headers.get('content-range')
        if (cr) resHeaders['Content-Range'] = cr
        const cl = driveRes.headers.get('content-length')
        if (cl) resHeaders['Content-Length'] = cl
        return new Response(driveRes.body, { status: 206, headers: resHeaders })
      }

      return new Response(driveRes.body, { status: 200, headers: resHeaders })
    } catch {
      continue
    }
  }

  return new Response('Video unavailable', { status: 502 })
}

export async function OPTIONS() {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
      'Access-Control-Allow-Headers': 'Range',
    },
  })
}
