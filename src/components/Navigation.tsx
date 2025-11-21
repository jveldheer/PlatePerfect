import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';

export default function Navigation() {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navLinks = [
    { path: '/', label: '🏠 Dashboard' },
    { path: '/add-food', label: '➕ Add Food' },
    { path: '/recipes', label: '🍳 Recipes' },
    { path: '/meal-generator', label: '🤖 Generator' },
    { path: '/skills', label: '📚 Skills' },
    { path: '/supplements', label: '💊 Supplements' },
    { path: '/settings', label: '⚙️ Settings' },
  ];

  return (
    <nav style={{ backgroundColor: 'var(--dark-gray)', borderBottom: '3px solid var(--border)' }} className="shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center" onClick={() => setMobileMenuOpen(false)}>
              <span className="vlv-heading text-2xl sm:text-3xl font-bold">⚡ VELDHEER FUEL LAB</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-3 lg:space-x-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-5 py-3 rounded-md text-base font-bold transition-all duration-300 ${
                  isActive(link.path)
                    ? 'border-3'
                    : 'border-3 border-transparent hover:border-yellow-400'
                }`}
                style={{
                  color: isActive(link.path) ? 'var(--yellow)' : 'var(--white)',
                  fontFamily: 'Bebas Neue, sans-serif',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  fontSize: '1.1rem',
                  borderColor: isActive(link.path) ? 'var(--yellow)' : 'transparent',
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  backgroundColor: isActive(link.path) ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                  boxShadow: isActive(link.path) ? '0 0 25px var(--glow)' : 'none'
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
              className="inline-flex items-center justify-center p-3 rounded-md transition-all duration-300"
              style={{
                color: 'var(--yellow)',
                border: '3px solid var(--yellow)',
                backgroundColor: mobileMenuOpen ? 'rgba(255, 215, 0, 0.1)' : 'transparent'
              }}
              aria-expanded={mobileMenuOpen}
            >
              <span className="sr-only">Open main menu</span>
              {!mobileMenuOpen ? (
                <svg className="block h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden" style={{ borderTop: '2px solid var(--border)', backgroundColor: 'var(--black)' }}>
          <div className="px-4 pt-3 pb-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-5 py-5 rounded-md text-lg font-bold transition-all duration-300`}
                style={{
                  color: isActive(link.path) ? 'var(--yellow)' : 'var(--white)',
                  fontFamily: 'Bebas Neue, sans-serif',
                  letterSpacing: '1.5px',
                  textTransform: 'uppercase',
                  fontSize: '1.25rem',
                  borderColor: isActive(link.path) ? 'var(--yellow)' : 'transparent',
                  borderWidth: '3px',
                  borderStyle: 'solid',
                  backgroundColor: isActive(link.path) ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
                  boxShadow: isActive(link.path) ? '0 0 25px var(--glow)' : 'none'
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
