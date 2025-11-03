import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-12 px-4">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Welcome to PlatePerfect
        </h1>
        <p className="text-xl text-gray-600 mb-2">
          Master Cooking Skills. Fuel Your Performance.
        </p>
        <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-8">
          A comprehensive cooking education platform designed for young athletes (ages 13-25)
          who want to take control of their nutrition and maximize their athletic potential.
        </p>
        <div className="flex justify-center gap-4">
          <Link to="/skills" className="btn-primary">
            Learn Cooking Skills
          </Link>
          <Link to="/recipes" className="btn-secondary">
            Browse Recipes
          </Link>
        </div>
      </section>

      {/* Why PlatePerfect Section */}
      <section className="bg-white rounded-xl shadow-lg p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Why PlatePerfect?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="text-4xl mb-3">🎯</div>
            <h3 className="text-xl font-semibold mb-2">Built for Athletes</h3>
            <p className="text-gray-600">
              Every recipe is optimized for athletic performance with detailed nutrition info
              focusing on protein, carbs, and timing for workouts.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">📚</div>
            <h3 className="text-xl font-semibold mb-2">Thorough Education</h3>
            <p className="text-gray-600">
              We don't assume you know anything. Each skill and recipe includes detailed
              explanations, tips, and common mistakes to avoid.
            </p>
          </div>
          <div className="text-center">
            <div className="text-4xl mb-3">⚡</div>
            <h3 className="text-xl font-semibold mb-2">Meal Prep Focused</h3>
            <p className="text-gray-600">
              Learn to efficiently prepare meals in advance so you always have proper fuel
              for training and recovery.
            </p>
          </div>
        </div>
      </section>

      {/* Getting Started Section */}
      <section>
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          Getting Started
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          <Link to="/skills" className="card p-6 hover:scale-105 transition-transform">
            <div className="flex items-start">
              <div className="text-4xl mr-4">🔪</div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Learn Cooking Skills</h3>
                <p className="text-gray-600 mb-4">
                  Start with fundamental techniques like knife skills, cooking methods,
                  food safety, and equipment basics. Each skill includes step-by-step
                  instructions and video demonstrations.
                </p>
                <span className="text-primary-600 font-semibold">
                  Browse 12+ Essential Skills →
                </span>
              </div>
            </div>
          </Link>

          <Link to="/recipes" className="card p-6 hover:scale-105 transition-transform">
            <div className="flex items-start">
              <div className="text-4xl mr-4">🍳</div>
              <div>
                <h3 className="text-2xl font-semibold mb-2">Explore Recipes</h3>
                <p className="text-gray-600 mb-4">
                  Discover athlete-focused recipes with detailed nutritional breakdowns.
                  Each recipe explains WHY it's good for your performance and includes
                  meal prep and storage instructions.
                </p>
                <span className="text-primary-600 font-semibold">
                  View Recipe Collection →
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="bg-gradient-to-r from-primary-50 to-athletic-50 rounded-xl p-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">
          What You'll Master
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="font-semibold mb-2">Knife Skills</h4>
            <p className="text-sm text-gray-600">Chopping, dicing, and safe cutting techniques</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="font-semibold mb-2">Cooking Methods</h4>
            <p className="text-sm text-gray-600">Sautéing, roasting, grilling, and more</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="font-semibold mb-2">Food Safety</h4>
            <p className="text-sm text-gray-600">Prevent illness and handle food properly</p>
          </div>
          <div className="bg-white rounded-lg p-4 text-center">
            <h4 className="font-semibold mb-2">Meal Prep</h4>
            <p className="text-sm text-gray-600">Efficient batch cooking and storage</p>
          </div>
        </div>
      </section>

      {/* Nutrition Focus */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Nutrition for Peak Performance
        </h2>
        <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-6">
          Understanding what to eat and when is just as important as your training.
          Every recipe includes:
        </p>
        <div className="grid md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-2xl font-bold text-primary-600 mb-1">Protein</p>
            <p className="text-sm text-gray-600">For muscle repair</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-2xl font-bold text-primary-600 mb-1">Carbs</p>
            <p className="text-sm text-gray-600">For energy fuel</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-2xl font-bold text-primary-600 mb-1">Timing</p>
            <p className="text-sm text-gray-600">Pre/post workout</p>
          </div>
          <div className="bg-white rounded-lg p-4 shadow">
            <p className="text-2xl font-bold text-primary-600 mb-1">Portions</p>
            <p className="text-sm text-gray-600">Proper serving sizes</p>
          </div>
        </div>
      </section>
    </div>
  );
}
