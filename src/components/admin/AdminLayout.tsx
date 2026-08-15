import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { LogOut, Terminal } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth'

export function AdminLayout({ children }: { children: ReactNode }) {
  const { session, signOut } = useSupabaseAuth()

  return (
    <div className="min-h-screen">
      <nav className="sticky top-0 z-50 border-b border-border bg-bg/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
          <Link to="/admin/projects" className="flex items-center gap-2.5 font-mono text-[15px] font-semibold text-ink">
            <Terminal className="h-4 w-4 text-accent" aria-hidden />
            karim<span className="text-accent">.dev</span>
            <Badge tone="demo">Admin</Badge>
          </Link>
          <div className="flex items-center gap-4">
            {session?.user.email && <span className="hidden text-[12.5px] text-ink-dim sm:inline">{session.user.email}</span>}
            <Link to="/" className="text-[13px] text-ink-soft transition-colors hover:text-accent">
              ← View Live Site
            </Link>
            <button
              onClick={() => signOut()}
              className="flex items-center gap-1.5 text-[13px] text-ink-soft transition-colors hover:text-danger"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign Out
            </button>
          </div>
        </div>
      </nav>
      <main className="mx-auto max-w-6xl px-5 py-8 md:px-8">{children}</main>
    </div>
  )
}
