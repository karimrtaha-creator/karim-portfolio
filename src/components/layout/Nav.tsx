import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { Menu, X, Moon, Sun, Terminal } from 'lucide-react'
import { useTheme } from '@/hooks/useTheme'
import { cn } from '@/lib/cn'

const LINKS = [
  { label: 'Home', hash: '#home' },
  { label: 'Work', hash: '#work' },
  { label: 'Systems', hash: '#systems' },
  { label: 'Skills', hash: '#skills' },
  { label: 'About', hash: '#about' },
  { label: 'Contact', hash: '#contact' },
]

export function Nav() {
  const [open, setOpen] = useState(false)
  const { theme, toggle } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const goToSection = (hash: string) => {
    setOpen(false)
    if (location.pathname !== '/') {
      navigate(`/${hash}`)
      return
    }
    const id = hash.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className="sticky top-0 z-50 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5 md:px-8">
        <Link to="/" className="flex items-center gap-1.5 font-mono text-[15px] font-semibold text-ink">
          <Terminal className="h-4 w-4 text-accent" aria-hidden />
          karim<span className="text-accent">.dev</span>
        </Link>

        <ul className="hidden items-center gap-7 md:flex">
          {LINKS.map((link) => (
            <li key={link.hash}>
              <button
                onClick={() => goToSection(link.hash)}
                className="text-[13.5px] text-ink-soft transition-colors hover:text-accent"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            className="rounded-full border border-border p-2 text-ink-soft transition-colors hover:border-ink-dim hover:text-ink"
          >
            {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setOpen((current) => !current)}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            className="rounded-full border border-border p-2 text-ink-soft transition-colors hover:border-ink-dim hover:text-ink md:hidden"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <div
        className={cn(
          'overflow-hidden border-t border-border transition-[max-height] duration-300 ease-in-out md:hidden',
          open ? 'max-h-80' : 'max-h-0 border-t-0',
        )}
      >
        <ul className="flex flex-col gap-1 px-5 py-3">
          {LINKS.map((link) => (
            <li key={link.hash}>
              <button
                onClick={() => goToSection(link.hash)}
                className="w-full rounded-md px-2 py-2.5 text-left text-sm text-ink-soft hover:bg-surface-2 hover:text-ink"
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
