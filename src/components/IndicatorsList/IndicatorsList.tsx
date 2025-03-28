"use client";

import { formatAreaLabel } from "@/domain/helpers/formatAreaLabel";
import { useEffect, useState } from "react";

type Indicator = {
  id: string;
  question: string;
  area: string;
};

export default function IndicatorsList() {
  const [indicators, setIndicators] = useState<Indicator[]>([]);
  const [selectedArea, setSelectedArea] = useState<string>("");

  useEffect(() => {
    fetch("/api/indicators")
      .then((res) => res.json())
      .then((data) => setIndicators(data));
  }, []);

  const areas = Array.from(new Set(indicators.map((i) => i.area))).sort();

  const filtered = selectedArea
    ? indicators.filter((i) => i.area === selectedArea)
    : indicators;

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Indicadores</h1>
        <select
          value={selectedArea}
          onChange={(e) => setSelectedArea(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Todas as áreas</option>
          {areas.map((area) => (
            <option key={area} value={area}>
              {formatAreaLabel(area)}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-4">
        {filtered.map((ind) => (
          <div key={ind.id} className="border p-4 rounded-xl shadow">
            <div className="text-sm text-gray-500 font-mono mb-1">
              {formatAreaLabel(ind.area)}
            </div>
            <div className="font-semibold">
              {ind.id} — {ind.question}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <p className="text-gray-500">
            Nenhum indicador encontrado para esta área.
          </p>
        )}
      </div>
    </div>
  );
}
