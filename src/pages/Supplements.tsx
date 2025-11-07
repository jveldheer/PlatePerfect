import { useState } from 'react';
import { useMacros } from '../contexts/MacroContext';
import { supplementSections, quickStartStacks } from '../data/supplements';

export default function Supplements() {
  const { userProfile } = useMacros();
  const [selectedSection, setSelectedSection] = useState<string>('all');
  const [expandedSupplements, setExpandedSupplements] = useState<Set<string>>(new Set());

  const toggleSupplement = (name: string) => {
    const newExpanded = new Set(expandedSupplements);
    if (newExpanded.has(name)) {
      newExpanded.delete(name);
    } else {
      newExpanded.add(name);
    }
    setExpandedSupplements(newExpanded);
  };

  const calculateWeightBasedDose = (supplement: any): string => {
    if (!supplement.weight_based_dosing || !userProfile) {
      return supplement.dose;
    }

    const weightKg = userProfile.currentWeightLb / 2.205;

    // Specific calculations for each weight-based supplement
    if (supplement.name === 'Whey protein') {
      const low = Math.round(weightKg * 0.25);
      const high = Math.round(weightKg * 0.40);
      return `${low}–${high} g per meal`;
    } else if (supplement.name === 'Casein protein') {
      const dose = Math.round(weightKg * 0.3);
      return `≈${dose} g (30–40 g)`;
    } else if (supplement.name === 'Creatine monohydrate') {
      const loading = (weightKg * 0.3).toFixed(1);
      const maintenance = (weightKg * 0.03).toFixed(1);
      return `Load: ${loading} g/day × 5–7 days → Maintain: ${maintenance} g/day (or 3–5 g/day)`;
    } else if (supplement.name === 'Caffeine') {
      const low = Math.round(weightKg * 3);
      const high = Math.round(weightKg * 6);
      return `${low}–${high} mg`;
    }

    return supplement.dose;
  };

  const sections = selectedSection === 'all'
    ? supplementSections
    : supplementSections.filter(s => s.id === selectedSection);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div className="text-center px-4">
        <h1 style={{
          fontFamily: 'Bebas Neue, sans-serif',
          letterSpacing: '2px',
          color: 'var(--yellow)',
          textTransform: 'uppercase'
        }} className="text-3xl sm:text-4xl font-bold mb-3 sm:mb-4">
          Athlete Supplement Guide
        </h1>
        <p className="text-base sm:text-lg max-w-3xl mx-auto" style={{ color: 'var(--light-text)' }}>
          Evidence-based supplement recommendations with personalized dosing based on your body weight.
          {!userProfile && (
            <span style={{ color: 'var(--yellow)', display: 'block', marginTop: '0.5rem', fontWeight: '600' }}>
              Set your weight in Profile to see personalized dosages.
            </span>
          )}
        </p>
      </div>

      {/* Category Filter */}
      <div style={{
        backgroundColor: '#2A2A2A',
        border: '3px solid var(--border)',
        borderRadius: '12px',
        padding: '1.5rem'
      }}>
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
          <button
            onClick={() => setSelectedSection('all')}
            style={{
              backgroundColor: selectedSection === 'all' ? 'var(--yellow)' : '#1A1A1A',
              color: selectedSection === 'all' ? '#000000' : 'var(--white)',
              border: `3px solid ${selectedSection === 'all' ? 'var(--yellow)' : 'var(--border)'}`,
              fontWeight: '600',
              boxShadow: selectedSection === 'all' ? '0 0 20px var(--glow)' : 'none'
            }}
            className="px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-lg text-sm transition-all touch-manipulation hover:scale-105"
          >
            All Categories
          </button>
          {supplementSections.map((section) => (
            <button
              key={section.id}
              onClick={() => setSelectedSection(section.id)}
              style={{
                backgroundColor: selectedSection === section.id ? 'var(--yellow)' : '#1A1A1A',
                color: selectedSection === section.id ? '#000000' : 'var(--white)',
                border: `3px solid ${selectedSection === section.id ? 'var(--yellow)' : 'var(--border)'}`,
                fontWeight: '600',
                boxShadow: selectedSection === section.id ? '0 0 20px var(--glow)' : 'none'
              }}
              className="px-3 sm:px-4 py-2 sm:py-2.5 min-h-[44px] rounded-lg text-sm transition-all touch-manipulation hover:scale-105"
            >
              {section.title}
            </button>
          ))}
        </div>
      </div>

      {/* Supplements List */}
      {sections.map((section) => (
        <div key={section.id} className="space-y-4">
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            letterSpacing: '1.5px',
            color: 'var(--yellow)',
            fontSize: '1.75rem',
            textTransform: 'uppercase',
            borderBottom: '3px solid var(--border)',
            paddingBottom: '0.5rem'
          }}>
            {section.title}
          </h2>

          <div className="grid grid-cols-1 gap-4">
            {section.items.map((supplement) => {
              const isExpanded = expandedSupplements.has(supplement.name);
              const calculatedDose = calculateWeightBasedDose(supplement);

              return (
                <div
                  key={supplement.name}
                  className="card overflow-hidden"
                  style={{
                    border: isExpanded ? '3px solid var(--yellow)' : '3px solid var(--border)',
                    transition: 'all 0.2s'
                  }}
                >
                  <button
                    onClick={() => toggleSupplement(supplement.name)}
                    className="w-full text-left p-4 sm:p-6 hover:bg-opacity-90 transition-all"
                    style={{ backgroundColor: isExpanded ? '#2A2A2A' : 'transparent' }}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 style={{
                            fontFamily: 'Bebas Neue, sans-serif',
                            letterSpacing: '1px',
                            color: 'var(--white)',
                            fontSize: '1.5rem'
                          }}>
                            {supplement.name}
                          </h3>
                          {supplement.weight_based_dosing && (
                            <span style={{
                              backgroundColor: 'var(--yellow)',
                              color: '#000000',
                              fontWeight: '700',
                              fontSize: '0.75rem',
                              padding: '0.25rem 0.5rem',
                              borderRadius: '4px'
                            }}>
                              WB
                            </span>
                          )}
                        </div>
                        <p style={{ color: '#CCCCCC', fontSize: '0.95rem' }}>
                          {supplement.what_it_is}
                        </p>
                      </div>
                      <div style={{
                        color: 'var(--yellow)',
                        fontSize: '1.5rem',
                        marginLeft: '1rem',
                        transition: 'transform 0.2s',
                        transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                      }}>
                        ▼
                      </div>
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-4" style={{
                      borderTop: '2px solid var(--border)',
                      paddingTop: '1rem'
                    }}>
                      {/* Benefits */}
                      <div>
                        <h4 style={{
                          color: 'var(--yellow)',
                          fontWeight: '700',
                          fontSize: '1rem',
                          textTransform: 'uppercase',
                          marginBottom: '0.5rem'
                        }}>
                          Key Benefits
                        </h4>
                        <ul className="space-y-1">
                          {supplement.key_benefits.map((benefit, idx) => (
                            <li key={idx} style={{ color: 'var(--light-text)' }} className="flex items-start">
                              <span style={{ color: 'var(--yellow)', marginRight: '0.5rem' }}>•</span>
                              {benefit}
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Dosage */}
                      <div>
                        <h4 style={{
                          color: 'var(--yellow)',
                          fontWeight: '700',
                          fontSize: '1rem',
                          textTransform: 'uppercase',
                          marginBottom: '0.5rem'
                        }}>
                          Recommended Dose
                        </h4>
                        <p style={{
                          color: 'var(--white)',
                          fontSize: '1.1rem',
                          fontWeight: '600',
                          backgroundColor: '#1A1A1A',
                          padding: '0.75rem',
                          borderRadius: '8px',
                          border: '2px solid var(--border)'
                        }}>
                          {calculatedDose}
                        </p>
                      </div>

                      {/* Timing */}
                      <div>
                        <h4 style={{
                          color: 'var(--yellow)',
                          fontWeight: '700',
                          fontSize: '1rem',
                          textTransform: 'uppercase',
                          marginBottom: '0.5rem'
                        }}>
                          Timing
                        </h4>
                        <p style={{ color: 'var(--light-text)' }}>
                          {supplement.timing}
                        </p>
                      </div>

                      {/* Notes */}
                      {supplement.notes && (
                        <div style={{
                          backgroundColor: '#2A2A2A',
                          border: '2px solid var(--yellow)',
                          borderRadius: '8px',
                          padding: '1rem'
                        }}>
                          <h4 style={{
                            color: 'var(--yellow)',
                            fontWeight: '700',
                            fontSize: '0.9rem',
                            textTransform: 'uppercase',
                            marginBottom: '0.5rem'
                          }}>
                            Important Note
                          </h4>
                          <p style={{ color: 'var(--white)', fontSize: '0.95rem' }}>
                            {supplement.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      ))}

      {/* Quick Start Stacks */}
      <div style={{
        backgroundColor: '#2A2A2A',
        border: '3px solid var(--yellow)',
        borderRadius: '12px',
        padding: '1.5rem',
        marginTop: '2rem'
      }}>
        <h2 style={{
          fontFamily: 'Bebas Neue, sans-serif',
          letterSpacing: '2px',
          color: 'var(--yellow)',
          fontSize: '2rem',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Quick Start Stacks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {quickStartStacks.map((stack) => (
            <div key={stack.name} style={{
              backgroundColor: '#1A1A1A',
              border: '2px solid var(--border)',
              borderRadius: '8px',
              padding: '1.25rem'
            }}>
              <h3 style={{
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '1px',
                color: 'var(--white)',
                fontSize: '1.25rem',
                marginBottom: '1rem'
              }}>
                {stack.name}
              </h3>
              <ul className="space-y-2">
                {stack.items.map((item, idx) => (
                  <li key={idx} style={{
                    color: 'var(--light-text)',
                    fontSize: '0.95rem',
                    display: 'flex',
                    alignItems: 'start'
                  }}>
                    <span style={{
                      color: 'var(--yellow)',
                      marginRight: '0.5rem',
                      fontWeight: '700'
                    }}>
                      •
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{
        backgroundColor: '#1A1A1A',
        border: '2px solid var(--border)',
        borderRadius: '8px',
        padding: '1rem',
        textAlign: 'center'
      }}>
        <p style={{ color: '#CCCCCC', fontSize: '0.9rem' }}>
          <span style={{
            backgroundColor: 'var(--yellow)',
            color: '#000000',
            fontWeight: '700',
            fontSize: '0.75rem',
            padding: '0.25rem 0.5rem',
            borderRadius: '4px',
            marginRight: '0.5rem'
          }}>
            WB
          </span>
          = Weight-Based dosing (personalized to your body weight)
        </p>
      </div>
    </div>
  );
}
