import MacroLookup from "@/components/MacroLookup";
import { nutritionAttribution } from "@/lib/nutrition";

export default function MacrosPage() {
  const attribution = nutritionAttribution();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Nutrition Macro Tracker
          </h1>
          <p className="text-gray-700 font-medium">
            Search for foods by barcode or name, or manually enter custom
            macros
          </p>
        </header>

        <main className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <MacroLookup />
        </main>

        <footer className="text-sm text-gray-700 space-y-1">
          <div>
            {attribution.fdc} -{" "}
            <a
              href={attribution.fdcUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              {attribution.fdcUrl}
            </a>
          </div>
          <div>
            {attribution.off} -{" "}
            <a
              href={attribution.offUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 font-medium hover:underline"
            >
              {attribution.offUrl}
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
