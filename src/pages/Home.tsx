import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Hero Section */}
      <section className="text-center py-8 sm:py-12 px-4">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4" style={{
          fontFamily: 'Bebas Neue, sans-serif',
          color: 'var(--yellow)',
          letterSpacing: '2px',
          textTransform: 'uppercase',
          textShadow: '0 2px 15px rgba(255, 215, 0, 0.5)'
        }}>
          Welcome to Veldheer Fuel Lab
        </h1>
        <p className="text-lg sm:text-xl mb-2 font-bold" style={{ color: 'var(--yellow)' }}>
          Master Cooking Skills. Fuel Your Performance.
        </p>
        <p className="text-base sm:text-lg max-w-3xl mx-auto mb-6 sm:mb-8 font-semibold" style={{ color: 'var(--light-text)' }}>
          A comprehensive cooking education platform designed for young athletes (ages 13-25)
          who want to take control of their nutrition and maximize their athletic potential.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
          <Link to="/skills" className="btn-primary min-h-[44px] inline-flex items-center justify-center touch-manipulation">
            Learn Cooking Skills
          </Link>
          <Link to="/recipes" className="btn-secondary min-h-[44px] inline-flex items-center justify-center touch-manipulation">
            Browse Recipes
          </Link>
        </div>
      </section>

      {/* Why Veldheer Fuel Lab Section */}
      <section className="bg-white rounded-xl shadow-lg p-4 sm:p-6 md:p-8 border-2 border-gray-200">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center" style={{
          fontFamily: 'Bebas Neue, sans-serif',
          color: '#000000',
          letterSpacing: '2px'
        }}>
          Why Veldheer Fuel Lab?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">Built for Athletes</h3>
            <p className="text-sm sm:text-base font-semibold text-gray-700">
              Every recipe is optimized for athletic performance with detailed nutrition info
              focusing on protein, carbs, and timing for workouts.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">Thorough Education</h3>
            <p className="text-sm sm:text-base font-semibold text-gray-700">
              We don't assume you know anything. Each skill and recipe includes detailed
              explanations, tips, and common mistakes to avoid.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-lg sm:text-xl font-bold mb-2 text-gray-900">Meal Prep Focused</h3>
            <p className="text-sm sm:text-base font-semibold text-gray-700">
              Learn to efficiently prepare meals in advance so you always have proper fuel
              for training and recovery.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section>
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center px-4" style={{
          fontFamily: 'Bebas Neue, sans-serif',
          color: 'var(--yellow)',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          Getting Started
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <Link to="/skills" className="card p-4 sm:p-6 hover:scale-[1.02] md:hover:scale-105 transition-transform">
            <div className="flex items-start">
              <div className="text-3xl sm:text-4xl mr-3 sm:mr-4">🔪</div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--yellow)' }}>Learn Cooking Skills</h3>
                <p className="text-sm sm:text-base mb-3 sm:mb-4 font-semibold" style={{ color: 'var(--light-text)' }}>
                  Start with fundamental techniques like knife skills, cooking methods,
                  food safety, and equipment basics. Each skill includes step-by-step
                  instructions and video demonstrations.
                </p>
                <span className="text-sm sm:text-base font-bold" style={{ color: 'var(--yellow)' }}>
                  Browse 12+ Essential Skills →
                </span>
              </div>
            </div>
          </Link>

          <Link to="/recipes" className="card p-4 sm:p-6 hover:scale-[1.02] md:hover:scale-105 transition-transform">
            <div className="flex items-start">
              <div className="text-3xl sm:text-4xl mr-3 sm:mr-4">🍳</div>
              <div>
                <h3 className="text-xl sm:text-2xl font-bold mb-2" style={{ color: 'var(--yellow)' }}>Explore Recipes</h3>
                <p className="text-sm sm:text-base mb-3 sm:mb-4 font-semibold" style={{ color: 'var(--light-text)' }}>
                  Discover athlete-focused recipes with detailed nutritional breakdowns.
                  Each recipe explains WHY it's good for your performance and includes
                  meal prep and storage instructions.
                </p>
                <span className="text-sm sm:text-base font-bold" style={{ color: 'var(--yellow)' }}>
                  View Recipe Collection →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="bg-gradient-to-r from-primary-50 to-athletic-50 rounded-xl p-4 sm:p-6 md:p-8 border-2 border-primary-200">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center" style={{
          fontFamily: 'Bebas Neue, sans-serif',
          color: '#000000',
          letterSpacing: '2px'
        }}>
          What You'll Master
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg p-4 text-center shadow-md border-2 border-gray-200">
            <h4 className="text-sm sm:text-base font-bold mb-2 text-gray-900">Knife Skills</h4>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Chopping, dicing, and safe cutting techniques</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md border-2 border-gray-200">
            <h4 className="text-sm sm:text-base font-bold mb-2 text-gray-900">Cooking Methods</h4>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Sautéing, roasting, grilling, and more</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md border-2 border-gray-200">
            <h4 className="text-sm sm:text-base font-bold mb-2 text-gray-900">Food Safety</h4>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Prevent illness and handle food properly</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center shadow-md border-2 border-gray-200">
            <h4 className="text-sm sm:text-base font-bold mb-2 text-gray-900">Meal Prep</h4>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Efficient batch cooking and storage</p>
          </div>
        </div>
      </section>

      {/* Nutrition Focus */}
      <section className="text-center px-4">
        <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4" style={{
          fontFamily: 'Bebas Neue, sans-serif',
          color: 'var(--yellow)',
          letterSpacing: '2px',
          textTransform: 'uppercase'
        }}>
          Nutrition for Peak Performance
        </h2>
        <p className="text-base sm:text-lg max-w-3xl mx-auto mb-4 sm:mb-6 font-semibold" style={{ color: 'var(--light-text)' }}>
          Understanding what to eat and when is just as important as your training.
          Every recipe includes:
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md border-2 border-gray-200">
            <p className="text-xl sm:text-2xl font-bold text-red-600 mb-1">Protein</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">For muscle repair</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md border-2 border-gray-200">
            <p className="text-xl sm:text-2xl font-bold text-yellow-600 mb-1">Carbs</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">For energy fuel</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md border-2 border-gray-200">
            <p className="text-xl sm:text-2xl font-bold text-green-600 mb-1">Timing</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Pre/post workout</p>
          </div>
          <div className="bg-white rounded-lg p-3 sm:p-4 shadow-md border-2 border-gray-200">
            <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-1">Portions</p>
            <p className="text-xs sm:text-sm font-semibold text-gray-700">Proper serving sizes</p>
          </div>
        </div>
      </section>
    </div>
  );
}
