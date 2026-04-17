import {
  Suspense,
  lazy,
  useDeferredValue,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { AlertTriangle, Radar, Sparkles } from "lucide-react";
import Sidebar from "./components/Sidebar";
import { mockIntelligence } from "./data/mockIntel";
import { INTEL_TYPES } from "./utils/constants";
import { getRelativeDays, parseCsvFile, parseJsonFile, registerImages } from "./utils/parsers";

const MapView = lazy(() => import("./components/MapView"));

const byNewest = (left, right) =>
  new Date(right.timestamp).getTime() - new Date(left.timestamp).getTime();

function App() {
  const [entries, setEntries] = useState(() => [...mockIntelligence].sort(byNewest));
  const [selectedEntry, setSelectedEntry] = useState(mockIntelligence[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTypes, setActiveTypes] = useState(INTEL_TYPES);
  const [timelineValue, setTimelineValue] = useState(100);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [imageRegistry, setImageRegistry] = useState({});
  const [fitToResultsKey, setFitToResultsKey] = useState(0);
  const [notice, setNotice] = useState("");
  const [isPending, startTransition] = useTransition();

  const deferredSearchTerm = useDeferredValue(searchTerm);
  const timeBuckets = useMemo(() => getRelativeDays(entries), [entries]);

  const visibleEntries = useMemo(() => {
    const normalizedQuery = deferredSearchTerm.trim().toLowerCase();

    return entries.filter((entry, index) => {
      const matchesType = activeTypes.includes(entry.type);
      const matchesSearch =
        !normalizedQuery ||
        entry.title.toLowerCase().includes(normalizedQuery) ||
        entry.location.toLowerCase().includes(normalizedQuery);
      const withinTimeline = timeBuckets[index] <= timelineValue;
      return matchesType && matchesSearch && withinTimeline;
    });
  }, [activeTypes, deferredSearchTerm, entries, timeBuckets, timelineValue]);

  const stats = useMemo(
    () => ({
      total: entries.length,
      visible: visibleEntries.length,
      byType: INTEL_TYPES.reduce(
        (accumulator, type) => ({
          ...accumulator,
          [type]: entries.filter((entry) => entry.type === type).length,
        }),
        {},
      ),
    }),
    [entries, visibleEntries.length],
  );

  useEffect(() => {
    if (!visibleEntries.length) {
      setSelectedEntry(null);
      return;
    }

    if (!selectedEntry || !visibleEntries.some((entry) => entry.id === selectedEntry.id)) {
      setSelectedEntry(visibleEntries[0]);
    }
  }, [selectedEntry, visibleEntries]);

  useEffect(
    () => () => {
      const uniqueUrls = new Set(Object.values(imageRegistry));
      uniqueUrls.forEach((url) => {
        if (typeof url === "string" && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    },
    [imageRegistry],
  );

  const toggleType = (type) => {
    setActiveTypes((currentTypes) => {
      if (currentTypes.includes(type)) {
        return currentTypes.length === 1 ? currentTypes : currentTypes.filter((item) => item !== type);
      }

      return [...currentTypes, type];
    });
  };

  const handleFilesSelected = async (files) => {
    if (!files.length) {
      return;
    }

    const imageFiles = files.filter((file) => /image\/jpeg/.test(file.type) || /\.jpe?g$/i.test(file.name));
    const dataFiles = files.filter((file) => /\.(json|csv)$/i.test(file.name));

    if (!imageFiles.length && !dataFiles.length) {
      setNotice("Unsupported files skipped. Use JSON, CSV, JPG, or JPEG.");
      return;
    }

    try {
      const newImageRegistry = imageFiles.length ? registerImages(imageFiles) : {};
      const mergedRegistry = { ...imageRegistry, ...newImageRegistry };

      let uploadedEntries = [];
      for (const file of dataFiles) {
        if (/\.json$/i.test(file.name)) {
          const parsedJson = await parseJsonFile(file, mergedRegistry);
          uploadedEntries = [...uploadedEntries, ...parsedJson];
        }

        if (/\.csv$/i.test(file.name)) {
          const parsedCsv = await parseCsvFile(file, mergedRegistry);
          uploadedEntries = [...uploadedEntries, ...parsedCsv];
        }
      }

      startTransition(() => {
        if (Object.keys(newImageRegistry).length) {
          setImageRegistry((current) => ({ ...current, ...newImageRegistry }));
        }

        if (uploadedEntries.length) {
          setEntries((current) => [...uploadedEntries, ...current].sort(byNewest));
          setSelectedEntry(uploadedEntries[0]);
          setFitToResultsKey((value) => value + 1);
          setNotice(`Uploaded ${uploadedEntries.length} new intelligence entr${uploadedEntries.length === 1 ? "y" : "ies"}.`);
        } else if (imageFiles.length) {
          setNotice(`Registered ${imageFiles.length} image asset${imageFiles.length === 1 ? "" : "s"} for popup previews.`);
        }
      });
    } catch (error) {
      setNotice(error instanceof Error ? error.message : "Failed to parse uploaded files.");
    }
  };

  const handleResetView = () => {
    setFitToResultsKey((value) => value + 1);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,rgba(245,158,11,0.16),transparent_24%),radial-gradient(circle_at_right,rgba(180,83,9,0.10),transparent_28%),linear-gradient(135deg,#121212_0%,#1e1b16_46%,#312418_100%)] px-3 py-3 text-slate-100 lg:px-6 lg:py-6">
      <div className="absolute inset-0 bg-grid bg-[size:26px_26px] opacity-30 pointer-events-none" />

      <div className="relative flex flex-col gap-4 lg:flex-row">
        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((value) => !value)}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          activeTypes={activeTypes}
          onToggleType={toggleType}
          timelineValue={timelineValue}
          onTimelineChange={setTimelineValue}
          visibleEntries={visibleEntries}
          selectedEntry={selectedEntry}
          onSelectEntry={setSelectedEntry}
          isDragging={isDragging}
          onDragState={setIsDragging}
          onFilesSelected={handleFilesSelected}
          isLoading={isPending}
          stats={stats}
        />

        <main className="flex min-w-0 flex-1 flex-col gap-4">
          <section className="grid gap-4 xl:grid-cols-[1.2fr,0.8fr]">
            <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-panel backdrop-blur">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[11px] uppercase tracking-[0.36em] text-amber-200/70">
                    Command Overview
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold text-white">
                    Intelligence Fusion Dashboard
                  </h2>
                  <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                    A real-time geospatial workspace for triaging multi-source intelligence,
                    correlating uploads, and navigating analyst-ready map evidence with speed.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleResetView}
                  className="rounded-2xl border border-amber-300/15 bg-amber-400/10 px-4 py-3 text-sm font-medium text-amber-100 transition hover:bg-amber-400/15"
                >
                  Reframe Map
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-3">
              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-panel backdrop-blur">
                <div className="flex items-center gap-3 text-amber-200">
                  <Radar size={18} />
                  <span className="text-xs uppercase tracking-[0.28em]">Coverage</span>
                </div>
                <p className="mt-5 text-3xl font-semibold text-white">{stats.visible}</p>
                <p className="mt-2 text-sm text-slate-400">Active geolocated nodes in scope</p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-panel backdrop-blur">
                <div className="flex items-center gap-3 text-emerald-200">
                  <Sparkles size={18} />
                  <span className="text-xs uppercase tracking-[0.28em]">Uploads</span>
                </div>
                <p className="mt-5 text-3xl font-semibold text-white">
                  {Math.max(0, entries.length - mockIntelligence.length)}
                </p>
                <p className="mt-2 text-sm text-slate-400">User-supplied intelligence entries</p>
              </div>

              <div className="rounded-[28px] border border-white/10 bg-white/[0.04] p-5 shadow-panel backdrop-blur">
                <div className="flex items-center gap-3 text-amber-200">
                  <AlertTriangle size={18} />
                  <span className="text-xs uppercase tracking-[0.28em]">Status</span>
                </div>
                <p className="mt-5 text-lg font-semibold text-white">Operational</p>
                <p className="mt-2 text-sm text-slate-400">Interactive mapping and upload parsing ready</p>
              </div>
            </div>
          </section>

          <AnimatePresence mode="wait">
            {notice ? (
              <motion.div
                key={notice}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="rounded-2xl border border-amber-300/10 bg-amber-400/10 px-4 py-3 text-sm text-amber-50"
              >
                {notice}
              </motion.div>
            ) : null}
          </AnimatePresence>

          <Suspense
            fallback={
              <div className="flex h-[56vh] min-h-[480px] items-center justify-center rounded-[28px] border border-white/10 bg-slate-950/70 shadow-panel lg:h-[calc(100vh-3rem)]">
                <div className="text-center">
                  <p className="text-sm font-medium text-white">Loading map workspace</p>
                  <p className="mt-2 text-sm text-slate-400">
                    Preparing geospatial layers and operational overlays.
                  </p>
                </div>
              </div>
            }
          >
            <MapView
              entries={visibleEntries}
              selectedEntry={selectedEntry}
              onSelectEntry={setSelectedEntry}
              fitToResultsKey={fitToResultsKey}
              layoutKey={sidebarCollapsed ? "collapsed" : "expanded"}
            />
          </Suspense>
        </main>
      </div>
    </div>
  );
}

export default App;
