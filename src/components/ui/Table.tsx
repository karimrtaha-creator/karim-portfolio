import type { HTMLAttributes, ReactNode, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '@/lib/cn'

export function Table({ children, className, ...rest }: HTMLAttributes<HTMLTableElement> & { children: ReactNode }) {
  return (
    <div className="overflow-x-auto rounded-[var(--radius-md)] border border-border">
      <table className={cn('w-full border-collapse text-left text-[13px]', className)} {...rest}>
        {children}
      </table>
    </div>
  )
}

export function Th({ children, className, ...rest }: ThHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <th
      className={cn(
        'border-b border-border bg-surface-2 px-3.5 py-2.5 font-mono text-[11px] font-medium uppercase tracking-wide text-ink-dim',
        className,
      )}
      {...rest}
    >
      {children}
    </th>
  )
}

export function Td({ children, className, ...rest }: TdHTMLAttributes<HTMLTableCellElement> & { children?: ReactNode }) {
  return (
    <td className={cn('border-b border-border px-3.5 py-2.5 text-ink', className)} {...rest}>
      {children}
    </td>
  )
}
