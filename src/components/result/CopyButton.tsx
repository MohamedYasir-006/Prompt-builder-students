import { useEffect, useRef, useState } from 'react'
import { copyText } from '../../lib/clipboard'
import { Button } from '../ui/Button'
import { Toast } from '../ui/Toast'

/** Copies `text` with "Copied" feedback and a legacy fallback. */
export function CopyButton({ text, label = 'Copy prompt' }: { text: string; label?: string }) {
  const [message, setMessage] = useState('')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => {
    return () => {
      if (timer.current !== undefined) window.clearTimeout(timer.current)
    }
  }, [])

  async function handleCopy() {
    const ok = await copyText(text)
    setMessage(ok ? 'Copied to clipboard.' : 'Copy failed — select the text and copy it by hand.')
    if (timer.current !== undefined) window.clearTimeout(timer.current)
    timer.current = window.setTimeout(() => setMessage(''), 2500)
  }

  return (
    <div>
      <Button onClick={handleCopy}>{message === 'Copied to clipboard.' ? 'Copied' : label}</Button>
      <Toast message={message} />
    </div>
  )
}
