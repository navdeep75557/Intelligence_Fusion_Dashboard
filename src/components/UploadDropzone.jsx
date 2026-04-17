import { useRef } from "react";
import { motion } from "framer-motion";
import { FileJson, FileSpreadsheet, ImagePlus, UploadCloud } from "lucide-react";

function UploadDropzone({
  isDragging,
  onDragState,
  onFilesSelected,
  isLoading,
}) {
  const fileInputRef = useRef(null);

  return (
    <motion.button
      type="button"
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.995 }}
      onClick={() => fileInputRef.current?.click()}
      onDragEnter={(event) => {
        event.preventDefault();
        onDragState(true);
      }}
      onDragOver={(event) => {
        event.preventDefault();
        onDragState(true);
      }}
      onDragLeave={(event) => {
        event.preventDefault();
        onDragState(false);
      }}
      onDrop={(event) => {
        event.preventDefault();
        onDragState(false);
        onFilesSelected(Array.from(event.dataTransfer.files || []));
      }}
      className={`group w-full rounded-[24px] border px-5 py-5 text-left transition ${
        isDragging
          ? "border-amber-300/50 bg-amber-400/12 shadow-glow"
          : "border-white/10 bg-white/5 hover:border-amber-300/20 hover:bg-white/[0.07]"
      }`}
    >
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".json,.csv,.jpg,.jpeg"
        className="hidden"
        onChange={(event) => onFilesSelected(Array.from(event.target.files || []))}
      />

      <div className="flex items-start gap-4">
        <div className="rounded-2xl border border-amber-300/10 bg-amber-400/10 p-3 text-amber-100">
          <UploadCloud size={20} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="text-sm font-semibold text-slate-100">
              Upload Intelligence Payloads
            </h3>
            {isLoading && (
              <span className="rounded-full border border-amber-300/15 bg-amber-400/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.28em] text-amber-100">
                Parsing
              </span>
            )}
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Drag JSON, CSV, and JPG evidence into the dashboard. Images auto-link to uploaded
            entries when filenames match the entry image field or title.
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-300">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5">
              <FileJson size={14} />
              JSON
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5">
              <FileSpreadsheet size={14} />
              CSV
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-1.5">
              <ImagePlus size={14} />
              JPG / JPEG
            </span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}

export default UploadDropzone;
