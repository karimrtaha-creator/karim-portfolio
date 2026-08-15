import { useState, type ReactNode } from 'react'
import { AlertTriangle, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'

export function AdminGate({ children }: { children: ReactNode }) {
  const { session, loading, signIn, configured } = useSupabaseAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (!configured) {
    return (
      <div className="mx-auto flex max-w-sm flex-col items-center px-5 py-32 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] border border-warning/40 bg-warning-soft text-amber-ink">
          <AlertTriangle className="h-5 w-5" />
        </div>
        <h1 className="font-display text-xl font-bold text-ink">Supabase Not Configured</h1>
        <p className="mt-2 text-[13.5px] text-ink-soft">
          Set <code className="font-mono text-[12.5px]">VITE_SUPABASE_URL</code> and{' '}
          <code className="font-mono text-[12.5px]">VITE_SUPABASE_ANON_KEY</code> in a local{' '}
          <code className="font-mono text-[12.5px]">.env</code> file, then restart the dev server.
        </p>
      </div>
    )
  }

  if (loading) {
    return <div className="flex min-h-[50vh] items-center justify-center text-[13px] text-ink-dim">Loading…</div>
  }

  if (session) return <>{children}</>

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error: signInError } = await signIn(email, password)
    setSubmitting(false)
    if (signInError) setError(signInError)
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center px-5 py-32 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] border border-border bg-surface-2 text-accent">
        <Lock className="h-5 w-5" />
      </div>
      <h1 className="font-display text-xl font-bold text-ink">Admin Sign In</h1>
      <p className="mt-2 text-[13.5px] text-ink-soft">This screen isn't linked from the public site. No public registration exists.</p>

      <form onSubmit={submit} className="mt-6 flex w-full flex-col gap-3">
        <input
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Email"
          autoFocus
          autoComplete="username"
          className="w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        <input
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Password"
          autoComplete="current-password"
          className="w-full rounded-[var(--radius-sm)] border border-border bg-surface px-3.5 py-2.5 text-[14px] text-ink placeholder:text-ink-faint focus:border-accent focus:outline-none"
        />
        {error && <p className="text-[12.5px] text-danger">{error}</p>}
        <Button type="submit" disabled={submitting} className="w-full">
          {submitting ? 'Signing in…' : 'Sign In'}
        </Button>
      </form>
    </div>
  )
}
