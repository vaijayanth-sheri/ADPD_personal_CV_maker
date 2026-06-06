export default function SettingsPage() {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Settings
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Configure your preferences and defaults.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="col-span-1 space-y-2">
          <div className="h-10 rounded-lg bg-surface border border-slate-200 dark:border-zinc-800 flex items-center px-4 text-sm font-medium text-brand-600 dark:text-brand-400">
            General
          </div>
          <div className="h-10 rounded-lg hover:bg-surface flex items-center px-4 text-sm font-medium text-slate-600 dark:text-zinc-400">
            Appearance
          </div>
          <div className="h-10 rounded-lg hover:bg-surface flex items-center px-4 text-sm font-medium text-slate-600 dark:text-zinc-400">
            Advanced
          </div>
        </div>
        
        <div className="col-span-2 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface p-8 min-h-[400px] flex items-center justify-center text-slate-400 dark:text-zinc-600">
          Settings Form Skeleton
        </div>
      </div>
    </div>
  );
}
