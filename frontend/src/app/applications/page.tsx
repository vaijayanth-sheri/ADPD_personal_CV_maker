export default function ApplicationsPage() {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Applications
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Track and manage your generated job applications.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface p-8 flex items-center justify-center text-slate-400 dark:text-zinc-600 min-h-[400px]">
        Applications List Skeleton
      </div>
    </div>
  );
}
