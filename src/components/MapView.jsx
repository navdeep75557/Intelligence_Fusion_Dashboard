import { memo, useEffect } from "react";
import { motion } from "framer-motion";
import L from "leaflet";
import {
  CircleMarker,
  MapContainer,
  Popup,
  TileLayer,
  Tooltip,
  useMap,
} from "react-leaflet";
import { CalendarDays, Image as ImageIcon, MapPinned } from "lucide-react";
import { DEFAULT_ZOOM, INDIA_CENTER, TYPE_META } from "../utils/constants";

function FlyToSelection({ selectedEntry }) {
  const map = useMap();

  useEffect(() => {
    if (!selectedEntry) {
      return;
    }

    map.flyTo([selectedEntry.latitude, selectedEntry.longitude], 8, {
      animate: true,
      duration: 1.2,
    });
  }, [map, selectedEntry]);

  return null;
}

function FitToEntries({ entries }) {
  const map = useMap();

  useEffect(() => {
    if (!entries.length) {
      map.setView(INDIA_CENTER, DEFAULT_ZOOM);
      return;
    }

    if (entries.length === 1) {
      map.flyTo([entries[0].latitude, entries[0].longitude], 7, {
        animate: true,
        duration: 0.9,
      });
      return;
    }

    const bounds = L.latLngBounds(entries.map((entry) => [entry.latitude, entry.longitude]));
    map.fitBounds(bounds, { padding: [80, 80], maxZoom: 8 });
  }, [entries, map]);

  return null;
}

function SyncMapSize({ layoutKey }) {
  const map = useMap();

  useEffect(() => {
    const refresh = () => map.invalidateSize({ animate: false });
    const container = map.getContainer();
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => refresh())
        : null;

    refresh();
    const frame = window.requestAnimationFrame(refresh);
    const timeout = window.setTimeout(refresh, 350);
    const lateTimeout = window.setTimeout(refresh, 900);

    if (observer) {
      observer.observe(container);
    }

    window.addEventListener("resize", refresh);

    return () => {
      window.cancelAnimationFrame(frame);
      window.clearTimeout(timeout);
      window.clearTimeout(lateTimeout);
      observer?.disconnect();
      window.removeEventListener("resize", refresh);
    };
  }, [layoutKey, map]);

  return null;
}

function PopupCard({ entry }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
      className="w-[280px] overflow-hidden rounded-2xl"
    >
      {entry.image ? (
        <div className="relative h-36 overflow-hidden">
          <img
            src={entry.image}
            alt={entry.title}
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/15 to-transparent" />
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center bg-slate-900/70 text-slate-400">
          <ImageIcon size={18} />
        </div>
      )}
      <div className="space-y-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-slate-400">
              {entry.type}
            </p>
            <h3 className="mt-1 text-base font-semibold text-white">{entry.title}</h3>
          </div>
          <span
            className="mt-0.5 rounded-full px-2.5 py-1 text-[10px] font-medium text-slate-100"
            style={{ backgroundColor: `${TYPE_META[entry.type].color}26` }}
          >
            Node
          </span>
        </div>
        <p className="text-sm leading-6 text-slate-300">{entry.description}</p>
        <div className="grid gap-2 text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <MapPinned size={14} />
            <span>{entry.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <CalendarDays size={14} />
            <span>{new Date(entry.timestamp).toLocaleString()}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MapView({
  entries,
  selectedEntry,
  onSelectEntry,
  fitToResultsKey,
  layoutKey,
}) {
  return (
    <div className="relative h-[56vh] min-h-[480px] overflow-hidden rounded-[28px] border border-white/10 bg-[#16110b] shadow-panel lg:h-[calc(100vh-3rem)]">
      <div className="absolute inset-x-0 top-0 z-[500] flex justify-between gap-3 p-4">
        <div className="rounded-2xl border border-white/10 bg-slate-950/70 px-4 py-2 backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.32em] text-slate-400">
            Operational View
          </p>
          <p className="mt-1 text-sm text-slate-200">
            Multi-source fusion across India
          </p>
        </div>
        <div className="rounded-2xl border border-amber-400/15 bg-amber-400/10 px-4 py-2 text-right backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.28em] text-amber-200/75">
            Active Nodes
          </p>
          <p className="mt-1 text-lg font-semibold text-amber-50">{entries.length}</p>
        </div>
      </div>

      <MapContainer
        center={INDIA_CENTER}
        zoom={DEFAULT_ZOOM}
        zoomControl={false}
        className="h-full w-full"
        whenReady={(event) => {
          event.target.invalidateSize({ animate: false });
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        <SyncMapSize layoutKey={layoutKey} />
        <FlyToSelection selectedEntry={selectedEntry} />
        <FitToEntries key={fitToResultsKey} entries={entries} />

        {entries.map((entry) => {
          const meta = TYPE_META[entry.type];
          const isSelected = selectedEntry?.id === entry.id;

          return (
            <CircleMarker
              key={entry.id}
              center={[entry.latitude, entry.longitude]}
              radius={isSelected ? 12 : 8}
              pathOptions={{
                color: "#dbeafe",
                fillColor: meta.color,
                fillOpacity: 0.92,
                opacity: 0.95,
                weight: isSelected ? 2.5 : 1.5,
              }}
              eventHandlers={{
                click: () => onSelectEntry(entry),
              }}
            >
              <Tooltip direction="top" offset={[0, -16]} opacity={0.9}>
                <span className="text-xs font-medium">{entry.title}</span>
              </Tooltip>
              <Popup closeButton={false} offset={[0, -12]} autoPanPadding={[24, 24]}>
                <PopupCard entry={entry} />
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}

export default memo(MapView);
