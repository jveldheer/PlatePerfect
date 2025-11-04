import { useParams, Link, useNavigate } from 'react-router-dom';
import { cookingSkills } from '../data/cookingSkills';

export default function SkillDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const skill = cookingSkills.find((s) => s.id === id);

  if (!skill) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Skill Not Found</h2>
        <Link to="/skills" className="btn-primary">
          Back to Skills
        </Link>
      </div>
    );
  }

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

  const getCategoryLabel = (category: string) => {
    return category.split('-').map(word =>
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Back Button */}
      <button
        onClick={() => navigate('/skills')}
        className="mb-6 flex items-center text-primary-600 hover:text-primary-700 font-medium"
      >
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Skills
      </button>

      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(skill.difficulty)}`}>
            {skill.difficulty}
          </span>
          <span className="px-3 py-1 rounded-full text-sm font-medium bg-primary-100 text-primary-800">
            {getCategoryLabel(skill.category)}
          </span>
          <span className="text-sm text-gray-500 flex items-center">
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {skill.estimatedTime} minutes
          </span>
        </div>

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {skill.title}
        </h1>

        <p className="text-lg text-gray-600">
          {skill.description}
        </p>
      </div>

      {/* Video Tutorial */}
      {skill.videoUrl && (
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <span className="text-3xl mr-3">🎥</span>
            Video Tutorial
          </h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src={skill.videoUrl.replace('watch?v=', 'embed/')}
              title={skill.title}
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="w-full h-full"
            ></iframe>
          </div>
          <p className="mt-4 text-sm text-gray-600">
            Watch this professional tutorial to see the technique in action. Follow along and practice!
          </p>
        </div>
      )}

      {/* Detailed Steps */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-3xl mr-3">📝</span>
          Step-by-Step Instructions
        </h2>
        <div className="space-y-6">
          {skill.detailedSteps.map((step, index) => (
            <div key={index} className="flex">
              <div className="flex-shrink-0 w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold mr-4">
                {index + 1}
              </div>
              <div className="flex-1">
                <p className="text-gray-800 leading-relaxed">{step}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-green-50 rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-3xl mr-3">💡</span>
          Pro Tips
        </h2>
        <ul className="space-y-3">
          {skill.tips.map((tip, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-6 h-6 text-green-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-800">{tip}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Common Mistakes */}
      <div className="bg-red-50 rounded-xl shadow-lg p-8 mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
          <span className="text-3xl mr-3">⚠️</span>
          Common Mistakes to Avoid
        </h2>
        <ul className="space-y-3">
          {skill.commonMistakes.map((mistake, index) => (
            <li key={index} className="flex items-start">
              <svg className="w-6 h-6 text-red-600 mr-3 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <span className="text-gray-800">{mistake}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Related Recipes */}
      <div className="bg-primary-50 rounded-xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <span className="text-3xl mr-3">🍳</span>
          Ready to Practice?
        </h2>
        <p className="text-gray-700 mb-4">
          Now that you've learned this skill, check out our recipes that use this technique!
        </p>
        <Link to="/recipes" className="btn-primary">
          Browse Recipes
        </Link>
      </div>
    </div>
  );
}
