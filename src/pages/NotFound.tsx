import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-5 py-32 text-center">
      <p className="font-mono text-sm text-amber">404</p>
      <h1 className="mt-3 font-display text-2xl font-bold text-ink">Page not found</h1>
      <p className="mt-2 text-ink-soft">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6">
        <Button>Back to home</Button>
      </Link>
    </div>
  )
}
