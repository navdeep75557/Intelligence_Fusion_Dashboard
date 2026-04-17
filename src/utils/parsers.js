import Papa from "papaparse";
import { INTEL_TYPES } from "./constants";

const toTitleCase = (value = "") =>
  value
    .toString()
    .trim()
    .toUpperCase();

const normalizeRow = (row, imageRegistry = {}) => {
  const type = toTitleCase(row.type);
  const latitude = Number(row.latitude ?? row.lat);
  const longitude = Number(row.longitude ?? row.lng ?? row.lon);

  if (!row.title || !INTEL_TYPES.includes(type) || Number.isNaN(latitude) || Number.isNaN(longitude)) {
    return null;
  }

  const imageKey = row.imageKey || row.image || row.imageName || "";
  const matchedImage = imageRegistry[imageKey] || imageRegistry[row.title] || row.image || "";

  return {
    id: row.id || `upload-${crypto.randomUUID()}`,
    title: row.title.trim(),
    description: (row.description || "Uploaded intelligence entry.").trim(),
    type,
    latitude,
    longitude,
    location: (row.location || "Uploaded location").trim(),
    timestamp: row.timestamp || new Date().toISOString(),
    source: (row.source || "Uploaded file").trim(),
    image: matchedImage,
  };
};

export const parseJsonFile = async (file, imageRegistry) => {
  const text = await file.text();
  const raw = JSON.parse(text);
  const rows = Array.isArray(raw) ? raw : raw.entries || [];
  return rows.map((row) => normalizeRow(row, imageRegistry)).filter(Boolean);
};

export const parseCsvFile = async (file, imageRegistry) => {
  const text = await file.text();
  const result = Papa.parse(text, {
    header: true,
    skipEmptyLines: true,
  });
  return result.data.map((row) => normalizeRow(row, imageRegistry)).filter(Boolean);
};

export const registerImages = (files) =>
  files.reduce((accumulator, file) => {
    const url = URL.createObjectURL(file);
    accumulator[file.name] = url;
    accumulator[file.name.replace(/\.[^/.]+$/, "")] = url;
    return accumulator;
  }, {});

export const getRelativeDays = (entries) => {
  if (!entries.length) {
    return [0, 100];
  }

  const timestamps = entries
    .map((entry) => new Date(entry.timestamp).getTime())
    .filter((value) => !Number.isNaN(value));

  if (!timestamps.length) {
    return [0, 100];
  }

  const latest = Math.max(...timestamps);
  const oldest = Math.min(...timestamps);
  const totalSpan = Math.max(1, latest - oldest);

  return entries.map((entry) => {
    const time = new Date(entry.timestamp).getTime();
    return Math.round(((time - oldest) / totalSpan) * 100);
  });
};
