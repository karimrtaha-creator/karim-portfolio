import { Code2, Cpu, Home, Layers, Mail } from 'lucide-react'
import { useLocation, useNavigate } from 'react-router-dom'

const ITEMS = [
  { label: 'Home', hash: '#home', icon: Home },
  { label: 'Work', hash: '#work', icon: Layers },
  { label: 'Systems', hash: '#systems', icon: Cpu },
  { label: 'Skills', hash: '#skills', icon: Code2 },
  { label: 'Contact', hash: '#contact', icon: Mail },
]

/** Mobile-only bottom tab bar, per the Stitch mobile layout. */
export function BottomNav() {
  const navigate = useNavigate()
  const location = useLocation()

  const goToSection = (hash: string) => {
    if (location.pathname !== '/') {
      navigate(`/${hash}`)
      return
    }
    const id = hash.replace('#', '')
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav
      aria-label="Section navigation"
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-bg/95 backdrop-blur-md md:hidden"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <ul className="flex items-stretch justify-between px-2">
        {ITEMS.map((item) => (
          <li key={item.hash} className="flex-1">
            <button
              onClick={() => goToSection(item.hash)}
              className="flex w-full flex-col items-center gap-1 py-2.5 text-ink-dim transition-colors hover:text-accent"
            >
              <item.icon className="h-5 w-5" aria-hidden />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          </li>
        ))}
      </ul>
    </nav>
  )
}
