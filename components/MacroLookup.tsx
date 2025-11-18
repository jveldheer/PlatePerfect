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
  const [mode, setMode] = useState<"upc" | "text" | "name" | "manual">("upc");
  const [query, setQuery] = useState("");
  const [amount, setAmount] = useState("");
  const [unit, setUnit] = useState("g");
  const [res, setRes] = useState<MacroResult | null>(null);
  const [loading, setLoading] = useState(false);

  // Manual entry fields
  const [manualKcal, setManualKcal] = useState("");
  const [manualProtein, setManualProtein] = useState("");
  const [manualCarbs, setManualCarbs] = useState("");
  const [manualFat, setManualFat] = useState("");
  const [manualFiber, setManualFiber] = useState("");
  const [manualSugar, setManualSugar] = useState("");
  const [manualSodium, setManualSodium] = useState("");

  async function run() {
    // Handle manual entry mode
    if (mode === "manual") {
      if (!manualKcal || !manualProtein || !manualCarbs || !manualFat) {
        setRes({
          ok: false,
          error: "Please enter at least calories, protein, carbs, and fat",
        });
        return;
      }

      // Create manual result
      setRes({
        ok: true,
        data: {
          kcal: Number(manualKcal),
          protein_g: Number(manualProtein),
          carb_g: Number(manualCarbs),
          fat_g: Number(manualFat),
          fiber_g: manualFiber ? Number(manualFiber) : undefined,
          sugar_g: manualSugar ? Number(manualSugar) : undefined,
          sodium_mg: manualSodium ? Number(manualSodium) : undefined,
          source: "manual",
          confidence: 1.0,
        },
      });
      return;
    }

    // Handle API lookup modes
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
    <div className="p-4 space-y-4 max-w-2xl">
      <div className="space-y-2">
        <label className="text-sm font-semibold text-gray-900">
          Entry Mode
        </label>
        <select
          value={mode}
          onChange={(e) => setMode(e.target.value as any)}
          className="w-full border border-gray-400 bg-white text-gray-900 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="upc">UPC/Barcode Lookup</option>
          <option value="text">Text Search</option>
          <option value="name">Food Name Search</option>
          <option value="manual">Manual Entry</option>
        </select>
      </div>

      {mode === "manual" ? (
        // Manual entry form
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Calories *
              </label>
              <input
                value={manualKcal}
                onChange={(e) => setManualKcal(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 165"
                type="number"
                step="any"
                className="w-full border border-gray-400 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Protein (g) *
              </label>
              <input
                value={manualProtein}
                onChange={(e) => setManualProtein(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 31"
                type="number"
                step="any"
                className="w-full border border-gray-400 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Carbs (g) *
              </label>
              <input
                value={manualCarbs}
                onChange={(e) => setManualCarbs(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 0"
                type="number"
                step="any"
                className="w-full border border-gray-400 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-1">
                Fat (g) *
              </label>
              <input
                value={manualFat}
                onChange={(e) => setManualFat(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g., 3.6"
                type="number"
                step="any"
                className="w-full border border-gray-400 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <details className="border border-gray-300 rounded-md p-3 bg-gray-50">
            <summary className="cursor-pointer text-sm font-semibold text-gray-900">
              Optional Nutrients
            </summary>
            <div className="grid grid-cols-3 gap-3 mt-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Fiber (g)
                </label>
                <input
                  value={manualFiber}
                  onChange={(e) => setManualFiber(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="0"
                  type="number"
                  step="any"
                  className="w-full border border-gray-400 bg-white text-gray-900 placeholder-gray-500 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Sugar (g)
                </label>
                <input
                  value={manualSugar}
                  onChange={(e) => setManualSugar(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="0"
                  type="number"
                  step="any"
                  className="w-full border border-gray-400 bg-white text-gray-900 placeholder-gray-500 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Sodium (mg)
                </label>
                <input
                  value={manualSodium}
                  onChange={(e) => setManualSodium(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="0"
                  type="number"
                  step="any"
                  className="w-full border border-gray-400 bg-white text-gray-900 placeholder-gray-500 px-2 py-1 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </details>
        </div>
      ) : (
        // Lookup form
        <>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              Search Query
            </label>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={
                mode === "upc"
                  ? "e.g., 737628064502"
                  : "e.g., chicken breast raw"
              }
              className="w-full border border-gray-400 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-900">
              Portion (optional)
            </label>
            <div className="flex gap-2">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Amount"
                type="number"
                step="any"
                className="border border-gray-400 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 rounded-md w-32 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="g, oz, cup"
                className="border border-gray-400 bg-white text-gray-900 placeholder-gray-500 px-3 py-2 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </>
      )}

      <button
        onClick={run}
        disabled={loading}
        className="w-full bg-blue-600 text-white font-semibold px-4 py-3 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors shadow-sm"
      >
        {loading ? "Loading..." : mode === "manual" ? "Add Macros" : "Get Macros"}
      </button>

      {res && (
        <div className="mt-4">
          {res.ok && res.data ? (
            <div className="space-y-3">
              <div className="bg-white border-2 border-gray-300 rounded-lg p-4 shadow-sm">
                <div className="flex items-center justify-between mb-3 pb-2 border-b-2 border-gray-200">
                  <h3 className="font-bold text-lg text-gray-900">
                    Nutrition Facts
                    {res.data.scaled && (
                      <span className="text-base font-normal text-gray-700">
                        {" "}
                        ({res.data.scaled.grams}g)
                      </span>
                    )}
                  </h3>
                  <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                    {res.data.source === "manual"
                      ? "MANUAL"
                      : `${res.data.source.toUpperCase()} | ${(
                          res.data.confidence * 100
                        ).toFixed(0)}%`}
                  </span>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-200">
                    <span className="font-bold text-gray-900">Calories</span>
                    <span className="font-semibold text-gray-900">
                      {res.data.scaled?.kcal ?? res.data.kcal} kcal
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="font-medium text-gray-800">Protein</span>
                    <span className="font-semibold text-gray-900">
                      {res.data.scaled?.protein_g ?? res.data.protein_g}g
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="font-medium text-gray-800">
                      Carbohydrates
                    </span>
                    <span className="font-semibold text-gray-900">
                      {res.data.scaled?.carb_g ?? res.data.carb_g}g
                    </span>
                  </div>
                  <div className="flex justify-between py-1.5">
                    <span className="font-medium text-gray-800">Fat</span>
                    <span className="font-semibold text-gray-900">
                      {res.data.scaled?.fat_g ?? res.data.fat_g}g
                    </span>
                  </div>

                  {res.data.fiber_g !== undefined && (
                    <div className="flex justify-between py-1.5 text-sm border-t border-gray-100 mt-2 pt-2">
                      <span className="text-gray-700">Fiber</span>
                      <span className="font-medium text-gray-900">
                        {res.data.fiber_g}g
                      </span>
                    </div>
                  )}
                  {res.data.sugar_g !== undefined && (
                    <div className="flex justify-between py-1.5 text-sm">
                      <span className="text-gray-700">Sugar</span>
                      <span className="font-medium text-gray-900">
                        {res.data.sugar_g}g
                      </span>
                    </div>
                  )}
                  {res.data.sodium_mg !== undefined && (
                    <div className="flex justify-between py-1.5 text-sm">
                      <span className="text-gray-700">Sodium</span>
                      <span className="font-medium text-gray-900">
                        {res.data.sodium_mg}mg
                      </span>
                    </div>
                  )}
                </div>

                {res.data.notes && res.data.notes.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-amber-200 text-xs bg-amber-50 p-2 rounded">
                    {res.data.notes.map((note, i) => (
                      <div key={i} className="text-amber-800 font-medium">
                        ⚠️ {note}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <details className="text-xs">
                <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                  View raw data
                </summary>
                <pre className="mt-2 bg-gray-800 text-gray-100 p-3 rounded overflow-x-auto text-xs">
                  {JSON.stringify(res.data, null, 2)}
                </pre>
              </details>
            </div>
          ) : (
            <div className="bg-red-50 border-2 border-red-300 text-red-900 font-medium px-4 py-3 rounded-md">
              <span className="font-bold">Error:</span> {res.error}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
