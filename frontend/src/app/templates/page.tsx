export default function TemplatesPage() {
  return (
    <div className="space-y-8 pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-zinc-50">
          Templates
        </h1>
        <p className="text-slate-500 dark:text-zinc-400">
          Manage your DOCX templates for CVs and cover letters.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {/* Placeholder cards */}
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-2xl border border-slate-200 dark:border-zinc-800 bg-surface flex items-center justify-center text-slate-400 dark:text-zinc-600">
            Template Skeleton {i}
          </div>
        ))}
      </div>
    </div>
  );
}
