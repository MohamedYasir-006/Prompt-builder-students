export function Toast({ message }: { message: string }) {
  if (message === '') return null
  return (
    <div
      role="status"
      className="fixed bottom-4 left-1/2 -translate-x-1/2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white shadow-lg dark:bg-slate-100 dark:text-slate-900"
    >
      {message}
    </div>
  )
}
