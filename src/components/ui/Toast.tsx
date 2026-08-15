import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react'
import { Bell, CheckCircle2, AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/cn'

type ToastTone = 'info' | 'success' | 'warning'

interface ToastItem {
  id: number
  title: string
  description?: string
  tone: ToastTone
}

interface ToastContextValue {
  push: (toast: Omit<ToastItem, 'id'>) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const ICONS: Record<ToastTone, ReactNode> = {
  info: <Bell className="h-4 w-4" />,
  success: <CheckCircle2 className="h-4 w-4" />,
  warning: <AlertTriangle className="h-4 w-4" />,
}

const TONE_CLASSES: Record<ToastTone, string> = {
  info: 'border-blue/30 text-blue-ink [&_svg]:text-blue',
  success: 'border-success/30 text-success [&_svg]:text-success',
  warning: 'border-warning/30 text-amber-ink [&_svg]:text-warning',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const idRef = useRef(0)

  const push = useCallback((toast: Omit<ToastItem, 'id'>) => {
    const id = idRef.current++
    setToasts((current) => [...current, { ...toast, id }])
    setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id))
    }, 4200)
  }, [])

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div
        className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-[min(360px,calc(100vw-2rem))] flex-col gap-2"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              'pointer-events-auto flex items-start gap-2.5 rounded-[var(--radius-md)] border bg-surface px-3.5 py-3 shadow-token-lg animate-fade-up',
              TONE_CLASSES[toast.tone],
            )}
          >
            <span className="mt-0.5 shrink-0">{ICONS[toast.tone]}</span>
            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-ink">{toast.title}</p>
              {toast.description && <p className="mt-0.5 text-[12.5px] text-ink-soft">{toast.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within a ToastProvider')
  return context
}
