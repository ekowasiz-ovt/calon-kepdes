import { createContext, useContext, useState, type ReactNode } from 'react'
import { X } from '@phosphor-icons/react'
import { Button } from './Button'

type ToastTone = 'success' | 'error'
type ToastItem = { id: number; message: string; tone: ToastTone }
type ToastContextValue = { showToast: (message: string, tone?: ToastTone) => void }

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const showToast = (message: string, tone: ToastTone = 'success') => {
    const id = Date.now() + Math.random()
    setToasts((current) => [...current, { id, message, tone }])
    window.setTimeout(() => {
      setToasts((current) => current.filter((toast) => toast.id !== id))
    }, 3500)
  }

  const dismissToast = (id: number) => {
    setToasts((current) => current.filter((toast) => toast.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="ui-toast-region" aria-live="polite" aria-atomic="false">
        {toasts.map((toast) => (
          <div key={toast.id} className={`ui-toast ui-toast--${toast.tone}`} role="status">
            <span>{toast.message}</span>
            <Button
              type="button"
              variant="soft"
              aria-label="Tutup notifikasi"
              icon={<X size={16} />}
              onClick={() => dismissToast(toast.id)}
            />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)

  if (!context) {
    throw new Error('useToast harus digunakan di dalam ToastProvider.')
  }

  return context
}