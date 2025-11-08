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

    if (supplement.name === 'Whey protein') {
      const low = Math.round(weightKg * 0.25);
      const high = Math.round(weightKg * 0.40);
      return `${low}–${high} g per meal`;
    } else if (supplement.name === 'Casein protein') {
      const dose = Math.round(weightKg * 0.3);
      return `≈${dose} g (30–40 g)`;
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
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 style={{
          fontFamily: 'Bebas Neue, sans-serif',
          letterSpacing: '3px',
          color: 'var(--yellow)',
          textTransform: 'uppercase',
          fontSize: '2.5rem',
          marginBottom: '1rem'
        }}>
          Supplements
        </h1>
        <p style={{ color: 'var(--light-text)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto' }}>
          Evidence-based supplement guide with personalized dosing
        </p>
        {!userProfile && (
          <p style={{
            color: 'var(--yellow)',
            marginTop: '0.75rem',
            fontWeight: '600'
          }}>
            Set your weight in Profile for personalized dosages
          </p>
        )}
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={() => setSelectedSection('all')}
          style={{
            backgroundColor: selectedSection === 'all' ? 'var(--yellow)' : 'transparent',
            color: selectedSection === 'all' ? '#000000' : 'var(--yellow)',
            border: '2px solid var(--yellow)',
            padding: '0.5rem 1.5rem',
            borderRadius: '25px',
            fontWeight: '700',
            fontSize: '0.9rem',
            textTransform: 'uppercase',
            letterSpacing: '1px',
            transition: 'all 0.2s'
          }}
          className="hover:scale-105"
        >
          All
        </button>
        {supplementSections.map((section) => (
          <button
            key={section.id}
            onClick={() => setSelectedSection(section.id)}
            style={{
              backgroundColor: selectedSection === section.id ? 'var(--yellow)' : 'transparent',
              color: selectedSection === section.id ? '#000000' : 'var(--yellow)',
              border: '2px solid var(--yellow)',
              padding: '0.5rem 1.5rem',
              borderRadius: '25px',
              fontWeight: '700',
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '1px',
              transition: 'all 0.2s'
            }}
            className="hover:scale-105"
          >
            {section.title}
          </button>
        ))}
      </div>

      {/* Supplements Grid */}
      {sections.map((section) => (
        <div key={section.id} className="space-y-4">
          <h2 style={{
            fontFamily: 'Bebas Neue, sans-serif',
            letterSpacing: '2px',
            color: 'var(--white)',
            fontSize: '1.5rem',
            textTransform: 'uppercase',
            paddingBottom: '0.5rem',
            borderBottom: '2px solid var(--yellow)'
          }}>
            {section.title}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {section.items.map((supplement) => {
              const isExpanded = expandedSupplements.has(supplement.name);
              const calculatedDose = calculateWeightBasedDose(supplement);

              return (
                <div
                  key={supplement.name}
                  onClick={() => toggleSupplement(supplement.name)}
                  style={{
                    backgroundColor: isExpanded ? '#2A2A2A' : '#1A1A1A',
                    border: `2px solid ${isExpanded ? 'var(--yellow)' : 'var(--border)'}`,
                    borderRadius: '12px',
                    padding: '1.25rem',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  className="hover:border-yellow-500"
                >
                  {/* Header */}
                  <div className="flex items-start justify-between mb-3">
                    <h3 style={{
                      fontFamily: 'Bebas Neue, sans-serif',
                      letterSpacing: '1px',
                      color: 'var(--white)',
                      fontSize: '1.25rem',
                      flex: 1
                    }}>
                      {supplement.name}
                    </h3>
                    {supplement.weight_based_dosing && (
                      <span style={{
                        backgroundColor: 'var(--yellow)',
                        color: '#000000',
                        fontWeight: '700',
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.4rem',
                        borderRadius: '4px',
                        marginLeft: '0.5rem'
                      }}>
                        WB
                      </span>
                    )}
                  </div>

                  {/* Description */}
                  <p style={{
                    color: '#AAAAAA',
                    fontSize: '0.85rem',
                    marginBottom: isExpanded ? '1rem' : '0'
                  }}>
                    {supplement.what_it_is}
                  </p>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="space-y-3 mt-4" style={{
                      borderTop: '1px solid var(--border)',
                      paddingTop: '1rem'
                    }}>
                      {/* Benefits */}
                      <div>
                        <h4 style={{
                          color: 'var(--yellow)',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          textTransform: 'uppercase',
                          marginBottom: '0.5rem'
                        }}>
                          Benefits
                        </h4>
                        <ul className="space-y-1">
                          {supplement.key_benefits.map((benefit, idx) => (
                            <li key={idx} style={{ color: 'var(--light-text)', fontSize: '0.85rem' }} className="flex items-start">
                              <span style={{ color: 'var(--yellow)', marginRight: '0.5rem', fontSize: '0.7rem' }}>●</span>
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
                          fontSize: '0.85rem',
                          textTransform: 'uppercase',
                          marginBottom: '0.5rem'
                        }}>
                          Dose
                        </h4>
                        <p style={{
                          color: 'var(--white)',
                          fontSize: '0.95rem',
                          fontWeight: '600'
                        }}>
                          {calculatedDose}
                        </p>
                      </div>

                      {/* Timing */}
                      <div>
                        <h4 style={{
                          color: 'var(--yellow)',
                          fontWeight: '700',
                          fontSize: '0.85rem',
                          textTransform: 'uppercase',
                          marginBottom: '0.5rem'
                        }}>
                          Timing
                        </h4>
                        <p style={{ color: 'var(--light-text)', fontSize: '0.85rem' }}>
                          {supplement.timing}
                        </p>
                      </div>

                      {/* Notes */}
                      {supplement.notes && (
                        <div style={{
                          backgroundColor: '#1A1A1A',
                          border: '1px solid var(--yellow)',
                          borderRadius: '6px',
                          padding: '0.75rem',
                          marginTop: '0.75rem'
                        }}>
                          <p style={{ color: '#FFCC00', fontSize: '0.8rem', fontWeight: '600' }}>
                            ⚠️ {supplement.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Expand indicator */}
                  {!isExpanded && (
                    <div style={{
                      color: 'var(--yellow)',
                      fontSize: '0.75rem',
                      marginTop: '0.75rem',
                      textAlign: 'center',
                      fontWeight: '600'
                    }}>
                      Click for details ▼
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
        backgroundColor: '#1A1A1A',
        border: '2px solid var(--yellow)',
        borderRadius: '12px',
        padding: '2rem',
        marginTop: '3rem'
      }}>
        <h2 style={{
          fontFamily: 'Bebas Neue, sans-serif',
          letterSpacing: '2px',
          color: 'var(--yellow)',
          fontSize: '1.75rem',
          textTransform: 'uppercase',
          marginBottom: '1.5rem',
          textAlign: 'center'
        }}>
          Quick Start Stacks
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {quickStartStacks.map((stack) => (
            <div key={stack.name} style={{
              backgroundColor: '#2A2A2A',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              padding: '1.25rem'
            }}>
              <h3 style={{
                fontFamily: 'Bebas Neue, sans-serif',
                letterSpacing: '1px',
                color: 'var(--white)',
                fontSize: '1.1rem',
                marginBottom: '1rem'
              }}>
                {stack.name}
              </h3>
              <ul className="space-y-2">
                {stack.items.map((item, idx) => (
                  <li key={idx} style={{
                    color: 'var(--light-text)',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'start'
                  }}>
                    <span style={{
                      color: 'var(--yellow)',
                      marginRight: '0.5rem',
                      fontSize: '0.7rem'
                    }}>
                      ●
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
        textAlign: 'center',
        padding: '1rem'
      }}>
        <p style={{ color: '#888888', fontSize: '0.85rem' }}>
          <span style={{
            backgroundColor: 'var(--yellow)',
            color: '#000000',
            fontWeight: '700',
            fontSize: '0.7rem',
            padding: '0.15rem 0.4rem',
            borderRadius: '4px',
            marginRight: '0.5rem'
          }}>
            WB
          </span>
          Weight-Based dosing
        </p>
      </div>
    </div>
  );
}
