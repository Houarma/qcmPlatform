export default function EnseignantLoading() {
  return (
    <div className="p-4 sm:p-6 space-y-5 animate-pulse">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="h-8 w-52 bg-slate-200 rounded-lg" />
          <div className="h-4 w-72 bg-slate-100 rounded" />
        </div>
        <div className="flex gap-3">
          <div className="h-10 w-44 bg-violet-200 rounded-xl" />
          <div className="h-10 w-24 bg-slate-100 rounded-xl border border-slate-200" />
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="col-span-2 sm:col-span-1 h-32 bg-violet-200 rounded-2xl" />
        <div className="h-32 bg-slate-100 rounded-2xl border border-slate-100" />
        <div className="h-32 bg-slate-100 rounded-2xl border border-slate-100" />
        <div className="h-32 bg-slate-100 rounded-2xl border border-slate-100" />
      </div>

      {/* 3-column section */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_220px_204px] gap-4">
        <div className="flex flex-col gap-4">
          <div className="h-72 bg-slate-100 rounded-2xl border border-slate-100" />
          <div className="h-52 bg-slate-100 rounded-2xl border border-slate-100" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-52 bg-violet-200 rounded-2xl" />
          <div className="h-48 bg-slate-100 rounded-2xl border border-slate-100" />
        </div>
        <div className="flex flex-col gap-4">
          <div className="h-52 bg-slate-100 rounded-2xl border border-slate-100" />
          <div className="h-44 bg-slate-700 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
