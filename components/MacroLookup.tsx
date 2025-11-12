"use client";

import { useState } from "react";

type MacroResult = {
  ok: boolean;
  data?: {
    kcal: number;
    protein_g: number;
    carb_g: number;
    fat_g: number;
    fiber_g?: number;
    sugar_g?: number;
    sodium_mg?: number;
    source: string;
    confidence: number;
    scaled?: {
      grams: number;
      kcal: number;
      protein_g: number;
      carb_g: number;
      fat_g: number;
    };
    notes?: string[];
  };
  error?: string;
};

export default function MacroLookup() {
  const [mode, setMode] = useState<"upc" | "text" | "name">("upc");
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("g");
  const [res, setRes] = useState<MacroResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function run() {
    if (!query.trim()) {
      setRes({ ok: false, error: "Please enter a query" });
      return;
    }

    setLoading(true);
    setRes(null);

    try {
      const payload: any = {
        amount: amount ? Number(amount) : undefined,
        unit: unit || undefined,
      };
      payload[mode] = query;

      const r = await fetch("/api/macros", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const j = await r.json();
      setRes(j);
    } catch (error) {
      setRes({ ok: false, error: "Network error" });
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      run();
    }
  }

  return (
    <div className="p-4 space-y-3 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-medium">Search Mode</label>
        <div className="flex gap-2">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value as any)}
            className="border border-gray-300 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="upc">UPC/Barcode</option>
            <option value="text">Text Search</option>
            <option value="name">Food Name</option>
          </select>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              mode === "upc"
                ? "e.g., 737628064502"
                : "e.g., chicken breast raw"
            }
            className="border border-gray-300 flex-1 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Portion (optional)</label>
        <div className="flex gap-2">
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Amount"
            type="number"
            step="any"
            className="border border-gray-300 px-3 py-2 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="g, oz, cup"
            className="border border-gray-300 px-3 py-2 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <button
        onClick={run}
        disabled={loading}
        className="border border-gray-300 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "Loading..." : "Get Macros"}
      </button>

      {res && (
        <div className="mt-4">
          {res.ok && res.data ? (
            <div className="space-y-3">
              <div className="bg-gray-50 border border-gray-200 rounded-md p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-lg">
                    Nutrition Facts
                    {res.data.scaled && ` (${res.data.scaled.grams}g)`}
                  </h3>
                  <span className="text-xs text-gray-500">
                    Source: {res.data.source.toUpperCase()} | Confidence:{" "}
                    {(res.data.confidence * 100).toFixed(0)}%
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-1 border-b">
                    <span className="font-medium">Calories</span>
                    <span>
                      {res.data.scaled?.kcal ?? res.data.kcal} kcal
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Protein</span>
                    <span>
                      {res.data.scaled?.protein_g ?? res.data.protein_g}g
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Carbohydrates</span>
                    <span>
                      {res.data.scaled?.carb_g ?? res.data.carb_g}g
                    </span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span>Fat</span>
                    <span>{res.data.scaled?.fat_g ?? res.data.fat_g}g</span>
                  </div>

                  {res.data.fiber_g !== undefined && (
                    <div className="flex justify-between py-1 text-sm text-gray-600">
                      <span>Fiber</span>
                      <span>{res.data.fiber_g}g</span>
                    </div>
                  )}
                  {res.data.sugar_g !== undefined && (
                    <div className="flex justify-between py-1 text-sm text-gray-600">
                      <span>Sugar</span>
                      <span>{res.data.sugar_g}g</span>
                    </div>
                  )}
                  {res.data.sodium_mg !== undefined && (
                    <div className="flex justify-between py-1 text-sm text-gray-600">
                      <span>Sodium</span>
                      <span>{res.data.sodium_mg}mg</span>
                    </div>
                  )}
                </div>

                {res.data.notes && res.data.notes.length > 0 && (
                  <div className="mt-3 pt-3 border-t text-xs text-amber-600">
                    {res.data.notes.map((note, i) => (
                      <div key={i}>⚠️ {note}</div>
                    ))}
                  </div>
                )}
              </div>

              <details className="text-xs">
                <summary className="cursor-pointer text-gray-500 hover:text-gray-700">
                  View raw data
                </summary>
                <pre className="mt-2 bg-gray-50 p-2 rounded overflow-x-auto">
                  {JSON.stringify(res.data, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md">
              Error: {res.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
