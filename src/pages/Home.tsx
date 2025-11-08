import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12 px-4 bg-gradient-to-b from-primary-50 to-white rounded-xl">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 tracking-tight">
          WELCOME TO THE VELDHEER FUEL LAB
        </h1>
        <p className="text-xl sm:text-2xl font-semibold text-primary-700 mb-2">
          Fuel Your Performance. Master Cooking Skills.
        </p>
        <p className="text-base sm:text-lg text-gray-800 max-w-3xl mx-auto mb-6 sm:mb-8 font-medium">
          A comprehensive nutrition and cooking platform designed for athletes
          who want to take control of their nutrition and maximize their athletic potential.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link to="/tracker" className="btn-primary min-h-[44px] inline-flex items-center justify-center touch-manipulation">
            Track Your Macros
          </Link>
          <Link to="/meal-generator" className="btn-primary min-h-[44px] inline-flex items-center justify-center touch-manipulation">
            Generate Meal Plans
          </Link>
        </div>
      </section>

      {/* Tools & Features Section */}
      <section className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
          Performance Tools & Features
        </h2>
        <p className="text-center text-gray-700 mb-6 sm:mb-8 font-medium">
          Everything you need to optimize your nutrition and performance
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <Link to="/tracker" className="card p-4 sm:p-6 hover:scale-[1.02] md:hover:scale-105 transition-transform border-2 border-primary-200 hover:border-primary-400">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl mb-3">📊</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Macro Tracker</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-3 font-medium">
                Calculate your personalized macro targets based on your body stats, activity level, and goals.
              </p>
              <span className="text-sm sm:text-base text-primary-600 font-semibold">
                Calculate Your Macros →
              </span>
            </div>
          </Link>

          <Link to="/meal-generator" className="card p-4 sm:p-6 hover:scale-[1.02] md:hover:scale-105 transition-transform border-2 border-primary-200 hover:border-primary-400">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl mb-3">🍽️</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Meal Generator</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-3 font-medium">
                Generate personalized meal plans that hit your macro targets and match your dietary preferences.
              </p>
              <span className="text-sm sm:text-base text-primary-600 font-semibold">
                Generate Meal Plans →
              </span>
            </div>
          </Link>

          <Link to="/supplements" className="card p-4 sm:p-6 hover:scale-[1.02] md:hover:scale-105 transition-transform border-2 border-primary-200 hover:border-primary-400">
            <div className="text-center">
              <div className="text-4xl sm:text-5xl mb-3">💊</div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Supplements Guide</h3>
              <p className="text-sm sm:text-base text-gray-700 mb-3 font-medium">
                Evidence-based supplement recommendations with personalized dosage calculators for athletes.
              </p>
              <span className="text-sm sm:text-base text-primary-600 font-semibold">
                Explore Supplements →
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Why Veldheer Fuel Lab Section */}
      <section className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
          Why Veldheer Fuel Lab?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Built for Athletes</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Every recipe is optimized for athletic performance with detailed nutrition info
              focusing on protein, carbs, and timing for workouts.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Thorough Education</h3>
            <p className="text-sm sm:text-base text-gray-600">
              We don't assume you know anything. Each skill and recipe includes detailed
              explanations, tips, and common mistakes to avoid.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-lg sm:text-xl font-semibold mb-2">Meal Prep Focused</h3>
            <p className="text-sm sm:text-base text-gray-600">
              Learn to efficiently prepare meals in advance so you always have proper fuel
              for training and recovery.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section className="bg-gradient-to-r from-primary-50 to-athletic-50 rounded-xl p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 text-center">
          Getting Started
        </h2>
        <p className="text-center text-gray-800 mb-6 sm:mb-8 font-medium">
          Build your foundation with essential cooking skills and athlete-optimized recipes
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Link to="/skills" className="bg-white rounded-lg p-4 sm:p-6 hover:scale-[1.02] md:hover:scale-105 transition-transform shadow-md">
            <div className="flex items-start">
              <div className="text-3xl sm:text-4xl mr-3 sm:mr-4">🔪</div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Learn Cooking Skills</h3>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 font-medium">
                  Start with fundamental techniques like knife skills, cooking methods,
                  food safety, and equipment basics. Each skill includes step-by-step
                  instructions and video demonstrations.
                </p>
                <span className="text-sm sm:text-base text-primary-600 font-semibold">
                  Browse 12+ Essential Skills →
                </span>
              </div>
            </div>
          </Link>

          <Link to="/recipes" className="bg-white rounded-lg p-4 sm:p-6 hover:scale-[1.02] md:hover:scale-105 transition-transform shadow-md">
            <div className="flex items-start">
              <div className="text-3xl sm:text-4xl mr-3 sm:mr-4">🍳</div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Explore Recipes</h3>
                <p className="text-sm sm:text-base text-gray-700 mb-3 sm:mb-4 font-medium">
                  Discover athlete-focused recipes with detailed nutritional breakdowns.
                  Each recipe explains WHY it's good for your performance and includes
                  meal prep and storage instructions.
                </p>
                <span className="text-sm sm:text-base text-primary-600 font-semibold">
                  View Recipe Collection →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="bg-gradient-to-r from-primary-50 to-athletic-50 rounded-xl p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
          What You'll Master
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="text-sm sm:text-base font-semibold mb-2">Knife Skills</h4>
            <p className="text-xs sm:text-sm text-gray-600">Chopping, dicing, and safe cutting techniques</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="text-sm sm:text-base font-semibold mb-2">Cooking Methods</h4>
            <p className="text-xs sm:text-sm text-gray-600">Sautéing, roasting, grilling, and more</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="text-sm sm:text-base font-semibold mb-2">Food Safety</h4>
            <p className="text-xs sm:text-sm text-gray-600">Prevent illness and handle food properly</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="text-sm sm:text-base font-semibold mb-2">Meal Prep</h4>
            <p className="text-xs sm:text-sm text-gray-600">Efficient batch cooking and storage</p>
          </div>
        </div>
      </section>

      {/* Nutrition Focus */}
      <section className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
          NUTRITION FOR PEAK PERFORMANCE
        </h2>
        <p className="text-base sm:text-lg text-gray-800 max-w-3xl mx-auto mb-6 sm:mb-8 text-center font-medium">
          Understanding what to eat and when is just as important as your training.
          Every recipe includes:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-3 sm:p-4 shadow-md border border-primary-200">
            <p className="text-xl sm:text-2xl font-bold text-primary-700 mb-1">Protein</p>
            <p className="text-xs sm:text-sm text-gray-800 font-medium">For muscle repair</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-3 sm:p-4 shadow-md border border-primary-200">
            <p className="text-xl sm:text-2xl font-bold text-primary-700 mb-1">Carbs</p>
            <p className="text-xs sm:text-sm text-gray-800 font-medium">For energy fuel</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-3 sm:p-4 shadow-md border border-primary-200">
            <p className="text-xl sm:text-2xl font-bold text-primary-700 mb-1">Timing</p>
            <p className="text-xs sm:text-sm text-gray-800 font-medium">Pre/post workout</p>
          </div>
          <div className="bg-gradient-to-br from-primary-50 to-primary-100 rounded-lg p-3 sm:p-4 shadow-md border border-primary-200">
            <p className="text-xl sm:text-2xl font-bold text-primary-700 mb-1">Portions</p>
            <p className="text-xs sm:text-sm text-gray-800 font-medium">Proper serving sizes</p>
          </div>
        </div>
      </section>
    </div>
  );
}
