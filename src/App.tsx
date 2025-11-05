import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MacroProvider } from './contexts/MacroContext';
import Navigation from './components/Navigation';
import Home from './pages/Home';
import Skills from './pages/Skills';
import SkillDetail from './pages/SkillDetail';
import Recipes from './pages/Recipes';
import RecipeDetail from './pages/RecipeDetail';
import Profile from './pages/Profile';
import MacroTracker from './pages/MacroTracker';

function App() {
  return (
    <Router basename="/PlatePerfect">
      <MacroProvider>
        <div className="min-h-screen bg-gray-50">
          <Navigation />
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/skills" element={<Skills />} />
              <Route path="/skills/:id" element={<SkillDetail />} />
              <Route path="/recipes" element={<Recipes />} />
              <Route path="/recipes/:id" element={<RecipeDetail />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/tracker" element={<MacroTracker />} />
            </Routes>
          </main>
        </div>
      </MacroProvider>
    </Router>
  );
}

export default App;
