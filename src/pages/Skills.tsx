import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cookingSkills } from '../data/cookingSkills';
import type { CookingSkill } from '../types';

export default function Skills() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Skills' },
    { id: 'knife-skills', label: 'Knife Skills' },
    { id: 'cooking-methods', label: 'Cooking Methods' },
    { id: 'food-safety', label: 'Food Safety' },
    { id: 'prep-techniques', label: 'Prep Techniques' },
    { id: 'equipment', label: 'Equipment' },
  ];

  const difficulties = [
    { id: 'all', label: 'All Levels' },
    { id: 'beginner', label: 'Beginner' },
    { id: 'intermediate', label: 'Intermediate' },
    { id: 'advanced', label: 'Advanced' },
  ];

  const filteredSkills = cookingSkills.filter((skill) => {
    const categoryMatch = selectedCategory === 'all' || skill.category === selectedCategory;
    const difficultyMatch = selectedDifficulty === 'all' || skill.difficulty === selectedDifficulty;
    return categoryMatch && difficultyMatch;
  });

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800';
      case 'advanced':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'knife-skills':
        return '🔪';
      case 'cooking-methods':
        return '🍳';
      case 'food-safety':
        return '🛡️';
      case 'prep-techniques':
        return '📋';
      case 'equipment':
        return '🔧';
      default:
        return '📚';
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="text-center px-4">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Cooking Skills</h1>
        <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto">
          Master fundamental cooking techniques with detailed, step-by-step instructions.
          Each skill includes tips, common mistakes, and thorough explanations for complete beginners.
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                    selectedCategory === category.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              {difficulties.map((difficulty) => (
                <button
                  key={difficulty.id}
                  onClick={() => setSelectedDifficulty(difficulty.id)}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-lg text-sm font-medium transition-colors touch-manipulation ${
                    selectedDifficulty === difficulty.id
                      ? 'bg-primary-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300'
                  }`}
                >
                  {difficulty.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-600">
          Showing {filteredSkills.length} skill{filteredSkills.length !== 1 ? 's' : ''}
        </div>
      </div>

      {/* Skills Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredSkills.map((skill: CookingSkill) => (
          <Link
            key={skill.id}
            to={`/skills/${skill.id}`}
            className="card p-4 sm:p-6 hover:scale-[1.02] md:hover:scale-105 transition-transform"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="text-3xl sm:text-4xl">{getCategoryIcon(skill.category)}</div>
              <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getDifficultyColor(skill.difficulty)}`}>
                {skill.difficulty}
              </span>
            </div>

            <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 flex items-center gap-2 flex-wrap">
              {skill.title}
              {skill.videoUrl && (
                <span className="text-red-600 text-lg" title="Video tutorial available">
                  🎥
                </span>
              )}
            </h3>

            <p className="text-gray-600 text-sm mb-4 line-clamp-3">
              {skill.description}
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {skill.estimatedTime} min
              </span>
              <span className="text-primary-600 font-medium">
                Learn More →
              </span>
            </div>
          </Link>
        ))}
      </div>

      {filteredSkills.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No skills found with the selected filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
            className="mt-4 btn-primary"
          >
            Clear Filters
          </button>
        </div>
      )}
    </div>
  );
}
