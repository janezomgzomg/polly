import { useEffect, useState } from 'react'
import { healthResponseSchema } from 'schemas'
import { ThemeToggle } from '../../components/ThemeToggle/ThemeToggle'
import './Home.css'

type ApiStatus = 'loading' | 'ok' | 'error'

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000'

export function Home() {
  const [status, setStatus] = useState<ApiStatus>('loading')

  useEffect(() => {
    let cancelled = false

    fetch(`${API_URL}/health`)
      .then((response) => response.json())
      .then((data) => {
        if (cancelled) return
        const result = healthResponseSchema.safeParse(data)
        setStatus(result.success ? 'ok' : 'error')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
    }
  }, [])

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center gap-4 bg-white text-gray-900 dark:bg-gray-900 dark:text-gray-100">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="text-3xl font-semibold">Polly</h1>
      <div className="flex items-center gap-2 text-sm">
        <span className={`api-status-dot api-status-dot--${status}`} />
        <span>
          {status === 'loading' && 'Connecting to API…'}
          {status === 'ok' && 'API connected'}
          {status === 'error' && 'API unreachable'}
        </span>
      </div>
    </main>
  )
}
