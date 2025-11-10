import { useState } from 'react';
import { Link } from 'react-router-dom';
import { recipes } from '../data/recipes';
import type { Recipe } from '../types';

export default function Recipes() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');
  const [selectedEconomics, setSelectedEconomics] = useState<string>('all');
  const [showTikTokOnly, setShowTikTokOnly] = useState<boolean>(false);

  const categories = [
    { id: 'all', label: 'All Recipes' },
    { id: 'breakfast', label: 'Breakfast' },
    { id: 'lunch', label: 'Lunch' },
    { id: 'dinner', label: 'Dinner' },
    { id: 'snacks', label: 'Snacks' },
    { id: 'pre-workout', label: 'Pre-Workout' },
    { id: 'post-workout', label: 'Post-Workout' },
  ];

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const economicsOptions = [
    { id: 'all', label: 'All Budgets' },
    { id: '$', label: '$ Budget' },
    { id: '$$', label: '$$ Moderate' },
    { id: '$$$', label: '$$$ Premium' },
  ];

  const filteredRecipes = recipes.filter((recipe) => {
    const categoryMatch = selectedCategory === 'all' || recipe.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || recipe.difficulty === selectedDifficulty;
    const economicsMatch = selectedEconomics === 'all' || recipe.economics === selectedEconomics;
    const tiktokMatch = !showTikTokOnly || recipe.tags.includes('viral-tiktok');
    return categoryMatch && difficultyMatch && economicsMatch && tiktokMatch;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '🥗';
      case 'dinner':
        return '🍽️';
      case 'snacks':
        return '🍎';
      case 'pre-workout':
        return '⚡';
      case 'post-workout':
        return '💪';
      default:
        return '🍳';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4">
        <h1 style={{
          fontFamily: 'Bebas Neue, sans-serif',
          letterSpacing: '2px',
          color: 'var(--yellow)',
          textTransform: 'uppercase'
        }} className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
          Athlete-Focused Recipes
        </h1>
        <p className="text-base sm:text-lg max-w-3xl mx-auto" style={{ color: 'var(--light-text)' }}>
          Every recipe is designed with athletic performance in mind. Detailed nutritional information,
          thorough instructions for beginners, and meal prep guidance included.
        </p>
      </div>

      {/* Filters */}
      <div style={{
        backgroundColor: '#2A2A2A',
        border: '3px solid var(--border)',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
        {/* TikTok Filter - Special Section */}
        <div className="mb-6 pb-6" style={{ borderBottom: '2px solid var(--border)' }}>
          <label style={{
            color: 'var(--white)',
            fontWeight: '700',
            fontSize: '1.1rem',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '0.75rem'
          }}>
            Special Collections
          </label>
          <button
            onClick={() => setShowTikTokOnly(!showTikTokOnly)}
            style={{
              backgroundColor: showTikTokOnly ? 'var(--yellow)' : '#1A1A1A',
              color: showTikTokOnly ? '#000000' : 'var(--white)',
              border: `3px solid ${showTikTokOnly ? 'var(--yellow)' : 'var(--border)'}`,
              fontWeight: '700',
              boxShadow: showTikTokOnly ? '0 0 20px var(--glow)' : 'none',
              fontSize: '1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            className="px-4 sm:px-6 py-3 min-h-[52px] rounded-lg transition-all touch-manipulation hover:scale-105 flex items-center gap-2"
          >
            <span className="text-xl">🎬</span>
            <span>Viral TikTok Dishes ({recipes.filter(r => r.tags.includes('viral-tiktok')).length})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div>
            <label style={{
              color: 'var(--white)',
              fontWeight: '700',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.75rem'
            }}>
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  style={{
                    backgroundColor: selectedCategory === category.id ? 'var(--yellow)' : '#1A1A1A',
                    color: selectedCategory === category.id ? '#000000' : 'var(--white)',
                    border: `3px solid ${selectedCategory === category.id ? 'var(--yellow)' : 'var(--border)'}`,
                    fontWeight: '600',
                    boxShadow: selectedCategory === category.id ? '0 0 20px var(--glow)' : 'none'
                  }}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-lg text-sm transition-all touch-manipulation hover:scale-105"
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{
              color: 'var(--white)',
              fontWeight: '700',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.75rem'
            }}>
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  style={{
                    backgroundColor: selectedDifficulty === difficulty.id ? 'var(--yellow)' : '#1A1A1A',
                    color: selectedDifficulty === difficulty.id ? '#000000' : 'var(--white)',
                    border: `3px solid ${selectedDifficulty === difficulty.id ? 'var(--yellow)' : 'var(--border)'}`,
                    fontWeight: '600',
                    boxShadow: selectedDifficulty === difficulty.id ? '0 0 20px var(--glow)' : 'none'
                  }}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-lg text-sm transition-all touch-manipulation hover:scale-105"
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{
              color: 'var(--white)',
              fontWeight: '700',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '0.75rem'
            }}>
              Cost
            </label>
            <div className="flex flex-wrap gap-2">
              {economicsOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setSelectedEconomics(option.id)}
                  style={{
                    backgroundColor: selectedEconomics === option.id ? 'var(--yellow)' : '#1A1A1A',
                    color: selectedEconomics === option.id ? '#000000' : 'var(--white)',
                    border: `3px solid ${selectedEconomics === option.id ? 'var(--yellow)' : 'var(--border)'}`,
                    fontWeight: '600',
                    boxShadow: selectedEconomics === option.id ? '0 0 20px var(--glow)' : 'none'
                  }}
                  className="px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-lg text-sm transition-all touch-manipulation hover:scale-105"
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm" style={{ color: 'var(--yellow)', fontWeight: '600' }}>
          Showing {filteredRecipes.length} recipe{filteredRecipes.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Recipes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredRecipes.map((recipe: Recipe) => (
          <Link
            key={recipe.id}
            to={`/recipes/${recipe.id}`}
            className="card hover:scale-[1.02] md:hover:scale-105 transition-transform overflow-hidden"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-start justify-between mb-3">
                <div className="text-3xl sm:text-4xl">{getCategoryIcon(recipe.category)}</div>
                <div className="flex gap-1.5 sm:gap-2 flex-wrap justify-end">
                  <span style={{
                    backgroundColor: 'var(--yellow)',
                    color: '#000000',
                    fontWeight: '700',
                    border: '2px solid var(--yellow)'
                  }} className="px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm">
                    {recipe.economics}
                  </span>
                  <span style={{
                    backgroundColor: '#1A1A1A',
                    color: 'var(--white)',
                    fontWeight: '600',
                    border: '2px solid var(--border)',
                    textTransform: 'uppercase'
                  }} className="px-2 sm:px-3 py-1 rounded-full text-xs">
                    {recipe.difficulty}
                  </span>
                </div>
              </div>

              <h3 className="text-lg sm:text-xl font-semibold mb-2 flex items-center gap-2 flex-wrap" style={{
                color: 'var(--white)',
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '1px'
              }}>
                {recipe.title}
                {recipe.videoUrl && (
                  <span className="text-lg" style={{ color: 'var(--yellow)' }} title="Video tutorial available">
                    🎥
                  </span>
                )}
              </h3>

              <p className="text-sm mb-4 line-clamp-2" style={{ color: 'var(--light-text)' }}>
                {recipe.description}
              </p>

              {/* Time Info */}
              <div className="flex items-center gap-4 text-sm mb-4" style={{ color: '#CCCCCC' }}>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {recipe.prepTime + recipe.cookTime} min
                </span>
                <span className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  {recipe.servings} servings
                </span>
              </div>

              {/* Nutrition Highlights */}
              <div className="grid grid-cols-3 gap-2 pt-4" style={{ borderTop: '2px solid var(--border)' }}>
                <div className="text-center">
                  <p className="text-xs" style={{ color: '#CCCCCC', textTransform: 'uppercase', fontWeight: '600' }}>Protein</p>
                  <p className="font-semibold" style={{ color: 'var(--yellow)', fontSize: '1.1rem' }}>{recipe.nutritionInfo.protein}g</p>
                </div>
                <div className="text-center">
                  <p className="text-xs" style={{ color: '#CCCCCC', textTransform: 'uppercase', fontWeight: '600' }}>Carbs</p>
                  <p className="font-semibold" style={{ color: 'var(--yellow)', fontSize: '1.1rem' }}>{recipe.nutritionInfo.carbs}g</p>
                </div>
                <div className="text-center">
                  <p className="text-xs" style={{ color: '#CCCCCC', textTransform: 'uppercase', fontWeight: '600' }}>Calories</p>
                  <p className="font-semibold" style={{ color: 'var(--yellow)', fontSize: '1.1rem' }}>{recipe.nutritionInfo.calories}</p>
                </div>
              </div>
            </div>

            <div className="px-6 pb-4">
              {recipe.tags.slice(0, 3).map((tag) => (
                <span key={tag} style={{
                  backgroundColor: '#1A1A1A',
                  color: 'var(--yellow)',
                  border: '2px solid var(--border)',
                  fontWeight: '600'
                }} className="inline-block mr-2 mb-2 px-2 py-1 text-xs rounded">
                  {tag}
                </span>
              ))}
            </div>
          </Link>
        ))}
      </div>

      {filteredRecipes.length === 0 && (
        <div className="text-center py-12">
          <p className="text-lg" style={{ color: 'var(--light-text)', fontSize: '1.25rem' }}>
            No recipes found with the selected filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
              setSelectedEconomics('all');
              setShowTikTokOnly(false);
            }}
            style={{
              backgroundColor: 'var(--yellow)',
              color: '#000000',
              fontWeight: '700',
              border: '3px solid var(--yellow)',
              padding: '0.75rem 2rem',
              borderRadius: '8px',
              marginTop: '1.5rem',
              fontSize: '1.1rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            className="hover:scale-105"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
