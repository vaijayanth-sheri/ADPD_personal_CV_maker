export default function HistoryPage() {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          History
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          View your past personalization activity.
        </p>
      </div>

      <div className="mt-8 space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="h-16 rounded-xl border border-slate-200 dark:border-zinc-800 bg-surface flex items-center px-6 text-slate-400 dark:text-zinc-600">
            History Item Skeleton {i}
          </div>
        ))}
      </div>
    </div>
  );
}
