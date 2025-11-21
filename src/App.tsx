import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MacroProvider } from './contexts/MacroContext';
import Navigation from './components/Navigation';
import ErrorBoundary from './components/ErrorBoundary';
import Dashboard from './pages/Dashboard';
import AddFood from './pages/AddFood';
import Skills from './pages/Skills';
import SkillDetail from './pages/SkillDetail';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import MealGenerator from './pages/MealGenerator';
import SavedRecipes from './pages/SavedRecipes';
import Supplements from './pages/Supplements';
import Settings from './pages/Settings';

function App() {
  return (
    <Router>
      <MacroProvider>
        <ErrorBoundary>
          <div className="min-h-screen" style={{ backgroundColor: 'var(--black)' }}>
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add-food" element={<AddFood />} />
                <Route path="/skills" element={<Skills />} />
                <Route path="/skills/:id" element={<SkillDetail />} />
                <Route path="/recipes" element={<Recipes />} />
                <Route path="/recipes/:id" element={<RecipeDetail />} />
                <Route path="/meal-generator" element={<MealGenerator />} />
                <Route path="/saved-recipes" element={<SavedRecipes />} />
                <Route path="/supplements" element={<Supplements />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </main>
          </div>
        </ErrorBoundary>
      </MacroProvider>
    </Router>
  );
}

export default App;
