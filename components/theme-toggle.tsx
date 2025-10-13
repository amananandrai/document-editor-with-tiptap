'use client'
import * as React from 'react'
import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme, systemTheme } = useTheme()

  // avoid hydration mismatch: don't render theme-dependent UI until client mounts
  const [mounted, setMounted] = React.useState(false)
  React.useEffect(() => setMounted(true), [])

  const resolved = theme === 'system' ? systemTheme : theme

  const toggle = () => {
    const next = resolved === 'dark' ? 'light' : 'dark'
    setTheme(next)
  }

  return (
    <Button
      size="sm"
      variant="ghost"
      onClick={toggle}
      aria-label="Toggle theme"
      title="Toggle theme"
      className={className}
      disabled={!mounted}
    >
      {mounted ? (resolved === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />) : <span className="h-4 w-4 inline-block" />}
    </Button>
  )
}