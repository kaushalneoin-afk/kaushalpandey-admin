export function Loading() {
  return (
    <div className="min-h-screen pt-24 flex items-start justify-center">
      <div className="flex flex-col items-center gap-4 mt-32">
        <img
          src="/loading-icon.jpeg"
          alt="Loading"
          className="w-16 h-16 object-contain animate-pulse"
        />
      </div>
    </div>
  )
}

export function LoadingInline() {
  return (
    <div className="flex justify-center p-12">
      <img
        src="/loading-icon.jpeg"
        alt="Loading"
        className="w-10 h-10 object-contain animate-pulse"
      />
    </div>
  )
}
