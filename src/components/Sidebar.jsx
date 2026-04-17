import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Clock3,
  Filter,
  Search,
  Satellite,
  SlidersHorizontal,
} from "lucide-react";
import UploadDropzone from "./UploadDropzone";
import { INTEL_TYPES, TYPE_META } from "../utils/constants";

function Sidebar({
  collapsed,
  onToggle,
  searchTerm,
  onSearchChange,
  activeTypes,
  onToggleType,
  timelineValue,
  onTimelineChange,
  visibleEntries,
  selectedEntry,
  onSelectEntry,
  isDragging,
  onDragState,
  onFilesSelected,
  isLoading,
  stats,
}) {
  return (
    <motion.aside
      animate={{ width: collapsed ? 92 : 420 }}
      transition={{ type: "spring", stiffness: 220, damping: 24 }}
      className="relative flex h-[calc(100vh-3rem)] shrink-0 overflow-hidden rounded-[28px] border border-white/10 bg-panel/80 bg-grid bg-[size:28px_28px] shadow-panel backdrop-blur"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] to-transparent" />

      <div className="relative flex h-full w-full">
        <div className="flex h-full w-[92px] flex-col items-center justify-between border-r border-white/10 px-4 py-5">
          <div className="space-y-4">
            <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 p-3 text-amber-50">
              <Satellite size={22} />
            </div>
            <button
              type="button"
              onClick={onToggle}
              className="rounded-2xl border border-white/10 bg-white/5 p-3 text-slate-200 transition hover:bg-white/10"
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
            </button>
          </div>

          <div className="space-y-3 text-center">
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Nodes</p>
              <p className="mt-1 text-lg font-semibold text-white">{stats.total}</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 px-3 py-2">
              <p className="text-[10px] uppercase tracking-[0.24em] text-slate-500">Visible</p>
              <p className="mt-1 text-lg font-semibold text-amber-100">{stats.visible}</p>
            </div>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.div
              key="sidebar-content"
              initial={{ opacity: 0, x: -18 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -18 }}
              transition={{ duration: 0.22 }}
              className="flex min-w-0 flex-1 flex-col p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.36em] text-amber-200/70">
                    Intelligence Fusion
                  </p>
                  <h1 className="mt-2 text-2xl font-semibold text-white">
                    Dashboard
                  </h1>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-400">
                    Blend OSINT, HUMINT, and IMINT into a single operational view with
                    upload-ready workflows and rapid location triage.
                  </p>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <UploadDropzone
                  isDragging={isDragging}
                  onDragState={onDragState}
                  onFilesSelected={onFilesSelected}
                  isLoading={isLoading}
                />

                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Filter size={15} />
                      <p className="text-xs uppercase tracking-[0.22em]">Source Mix</p>
                    </div>
                    <div className="mt-4 space-y-2">
                      {INTEL_TYPES.map((type) => (
                        <div key={type} className="flex items-center justify-between text-sm">
                          <span className="text-slate-300">{type}</span>
                          <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-200">
                            {stats.byType[type]}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <Clock3 size={15} />
                      <p className="text-xs uppercase tracking-[0.22em]">Timeline Gate</p>
                    </div>
                    <p className="mt-4 text-3xl font-semibold text-white">{timelineValue}%</p>
                    <p className="mt-2 text-sm text-slate-400">
                      Reveal entries up to the selected temporal confidence window.
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-[24px] border border-white/10 bg-slate-950/40 p-4">
                <div className="relative">
                  <Search
                    size={16}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                  />
                  <input
                    value={searchTerm}
                    onChange={(event) => onSearchChange(event.target.value)}
                    placeholder="Search titles or locations"
                    className="w-full rounded-2xl border border-white/10 bg-white/[0.04] py-3 pl-11 pr-4 text-sm text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-amber-300/30 focus:bg-white/[0.06]"
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {INTEL_TYPES.map((type) => {
                    const active = activeTypes.includes(type);
                    return (
                      <button
                        key={type}
                        type="button"
                        onClick={() => onToggleType(type)}
                        className={`rounded-full px-3 py-2 text-xs font-medium ring-1 transition ${
                          active
                            ? TYPE_META[type].accent
                            : "bg-white/[0.04] text-slate-400 ring-white/10 hover:text-slate-200"
                        }`}
                      >
                        {type}
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between text-xs uppercase tracking-[0.22em] text-slate-500">
                    <span className="inline-flex items-center gap-2">
                      <SlidersHorizontal size={14} />
                      Timeline
                    </span>
                    <span>{timelineValue}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={timelineValue}
                    onChange={(event) => onTimelineChange(Number(event.target.value))}
                    className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-amber-300"
                  />
                </div>
              </div>

              <div className="mt-6 min-h-0 flex-1 overflow-hidden rounded-[24px] border border-white/10 bg-slate-950/50">
                <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
                  <div>
                    <h2 className="text-sm font-semibold text-white">Intelligence Entries</h2>
                    <p className="mt-1 text-xs text-slate-500">
                      Select a node to jump and inspect details
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-xs text-slate-300">
                    {visibleEntries.length}
                  </span>
                </div>

                <div className="scrollbar-thin h-full space-y-2 overflow-y-auto p-3">
                  {visibleEntries.length ? (
                    visibleEntries.map((entry) => {
                      const isActive = selectedEntry?.id === entry.id;
                      return (
                        <button
                          type="button"
                          key={entry.id}
                          onClick={() => onSelectEntry(entry)}
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            isActive
                              ? "border-amber-300/30 bg-amber-400/10 shadow-glow"
                              : "border-white/10 bg-white/[0.03] hover:border-white/15 hover:bg-white/[0.05]"
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-medium text-white">{entry.title}</p>
                              <p className="mt-1 text-xs uppercase tracking-[0.24em] text-slate-500">
                                {entry.location}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-2.5 py-1 text-[10px] font-medium ring-1 ${TYPE_META[entry.type].accent}`}
                            >
                              {entry.type}
                            </span>
                          </div>
                          <p className="mt-3 text-sm leading-6 text-slate-400">
                            {entry.description}
                          </p>
                          <div className="mt-3 text-xs text-slate-500">
                            {new Date(entry.timestamp).toLocaleString()}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="flex h-52 items-center justify-center px-6 text-center">
                      <div>
                        <p className="text-sm font-medium text-white">No intelligence matches</p>
                        <p className="mt-2 text-sm leading-6 text-slate-400">
                          Adjust search, filters, or timeline thresholds to bring entries back into view.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.aside>
  );
}

export default Sidebar;
