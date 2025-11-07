import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: 'Home' },
    { path: '/skills', label: 'Cooking Skills' },
    { path: '/recipes', label: 'Recipes' },
    { path: '/meal-generator', label: 'Fuel Generator' },
    { path: '/saved-recipes', label: 'Saved Recipes' },
    { path: '/tracker', label: 'Macro Tracker' },
    { path: '/profile', label: 'My Goals' },
    { path: '/settings', label: 'Settings' },
  ];

  return (
    <nav style={{ backgroundColor: 'var(--dark-gray)', borderBottom: '2px solid var(--border)' }} className="shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <span className="vlv-heading text-xl sm:text-2xl font-bold">⚡ Veldheer Fuel Lab</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-2 lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-bold transition-all duration-300 ${
                  isActive(link.path)
                    ? 'border-2 border-yellow-400 shadow-lg'
                    : 'border-2 border-transparent hover:border-yellow-400'
                }`}
                style={{
                  color: isActive(link.path) ? 'var(--yellow)' : 'var(--gray)',
                  fontFamily: 'Bebas Neue, sans-serif',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  boxShadow: isActive(link.path) ? '0 0 20px var(--glow)' : 'none'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md transition-all duration-300"
              style={{ color: 'var(--yellow)' }}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden" style={{ borderTop: '2px solid var(--border)', backgroundColor: 'var(--black)' }}>
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-3 rounded-md text-base font-bold transition-all duration-300 ${
                  isActive(link.path)
                    ? 'border-2 border-yellow-400'
                    : 'border-2 border-transparent hover:border-yellow-400'
                }`}
                style={{
                  color: isActive(link.path) ? 'var(--yellow)' : 'var(--gray)',
                  fontFamily: 'Bebas Neue, sans-serif',
                  letterSpacing: '1px',
                  textTransform: 'uppercase',
                  boxShadow: isActive(link.path) ? '0 0 20px var(--glow)' : 'none'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
