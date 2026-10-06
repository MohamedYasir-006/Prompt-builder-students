export function ProgressBar({
  current,
  total,
}: {
  current: number
  total: number
}) {
  const percent = total === 0 ? 0 : Math.round((current / total) * 100)
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm font-medium text-slate-600 dark:text-slate-300">
        Question {current} of {total}
      </p>
      <div
        role="progressbar"
        aria-valuenow={current}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Question ${current} of ${total}`}
        className="h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800"
      >
        <div
          className="h-full rounded-full bg-slate-900 transition-all dark:bg-slate-100"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
