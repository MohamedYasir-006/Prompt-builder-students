import { useState } from 'react'
import {
  SHARE_LINK_WARN_LENGTH,
  buildShareHash,
  type ShareData,
} from '../../lib/share'
import { Button } from '../ui/Button'
import { Card } from '../ui/Card'

/** Readonly share link for the current answers, with a long-link warning. */
export function ShareButton({ data }: { data: ShareData }) {
  const [copied, setCopied] = useState(false)
  const hash = buildShareHash(data)
  const url =
    typeof window !== 'undefined'
      ? `${window.location.origin}/result${hash}`
      : `/result${hash}`
  const tooLong = url.length > SHARE_LINK_WARN_LENGTH

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      setCopied(false)
    }
  }

  return (
    <Card>
      <div className="flex flex-col gap-2">
        <h2 className="text-lg font-bold">Share this prompt</h2>
        <label
          htmlFor="share-link-input"
          className="text-sm text-slate-600 dark:text-slate-300"
        >
          Anyone opening this link sees your answers loaded on the result page.
        </label>
        <input
          id="share-link-input"
          type="text"
          readOnly
          value={url}
          onFocus={(e) => e.target.select()}
          className="min-h-[44px] w-full rounded-xl border border-slate-300 bg-slate-50 px-3 py-2 text-sm break-all dark:border-slate-700 dark:bg-slate-800"
        />
        <div className="flex flex-wrap gap-3">
          <Button variant="secondary" onClick={handleCopyLink}>
            {copied ? 'Link copied' : 'Copy link'}
          </Button>
        </div>
        {tooLong && (
          <p role="note" className="text-sm font-medium text-amber-700 dark:text-amber-300">
            This link is very long ({url.length.toLocaleString()} characters).
            It still works, but the Copy prompt button is easier to share.
          </p>
        )}
      </div>
    </Card>
  )
}
