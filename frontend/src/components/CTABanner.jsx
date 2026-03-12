import { useState, useEffect } from 'react';

export default function CTABanner({ openSignUp }) {
  const [counter1, setCounter1] = useState(0);
  const [counter2, setCounter2] = useState(0);
  const [counter3, setCounter3] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger card entrance animation
    setIsVisible(true);

    // Animate counters
    const animateCounter = (target, setter, duration = 1500) => {
      let start = 0;
      const increment = target / (duration / 16); // 60fps
      const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
          setter(target);
          clearInterval(timer);
        } else {
          setter(Math.floor(start));
        }
      }, 16);
    };

    const timeouts = [
      setTimeout(() => animateCounter(2847, setCounter1), 200),
      setTimeout(() => animateCounter(1293, setCounter2), 400),
      setTimeout(() => animateCounter(94, setCounter3), 600)
    ];

    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, []);

  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <style>{`
        @keyframes gradientPulse {
          0% { background: #0D0221; }
          100% { background: #1a0533; }
        }
        .counter-banner {
          animation: gradientPulse 6s ease infinite alternate;
        }
        .cta-card {
          opacity: ${isVisible ? '1' : '0'};
          transform: translateY(${isVisible ? '0' : '20px'});
          transition: all 0.6s ease-out;
        }
      `}</style>
      
      <section>
        {/* PART 1 - Live Bias Counter Banner */}
        <div className="counter-banner" style={{ 
          width: '100%',
          padding: '48px 0',
          borderBottom: '1px solid #1F2937'
        }}>
          <div style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: window.innerWidth < 768 ? '1fr' : 'repeat(3, 1fr)',
              gap: window.innerWidth < 768 ? '24px' : '48px',
              textAlign: 'center'
            }}>
              {/* Counter 1 */}
              <div>
                <div style={{
                  fontSize: window.innerWidth < 768 ? '36px' : '48px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Poppins'
                }}>
                  {counter1.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#9CA3AF',
                  marginTop: '8px',
                  fontWeight: '500'
                }}>
                  Bias Signals Detected This Month
                </div>
              </div>

              {/* Counter 2 */}
              <div>
                <div style={{
                  fontSize: window.innerWidth < 768 ? '36px' : '48px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Poppins'
                }}>
                  {counter2.toLocaleString()}
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#9CA3AF',
                  marginTop: '8px',
                  fontWeight: '500'
                }}>
                  Job Descriptions Rewritten
                </div>
              </div>

              {/* Counter 3 */}
              <div>
                <div style={{
                  fontSize: window.innerWidth < 768 ? '36px' : '48px',
                  fontWeight: '800',
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: 'Poppins'
                }}>
                  {counter3}%
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#9CA3AF',
                  marginTop: '8px',
                  fontWeight: '500'
                }}>
                  Reduction in Biased Language
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* PART 2 - Main CTA Card */}
        <div style={{
          padding: '80px 24px',
          background: '#0D0B1E'
        }}>
          <div className="cta-card" style={{
            background: 'linear-gradient(135deg, #1a0533 0%, #0f172a 50%, #1a0533 100%)',
            border: '1px solid rgba(124, 58, 237, 0.3)',
            borderRadius: '24px',
            padding: window.innerWidth < 768 ? '48px 32px' : '64px 48px',
            maxWidth: '860px',
            margin: '0 auto',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Decorative glows */}
            <div style={{
              position: 'absolute',
              top: '-100px',
              right: '-100px',
              width: '300px',
              height: '300px',
              background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />
            <div style={{
              position: 'absolute',
              bottom: '-80px',
              left: '-80px',
              width: '250px',
              height: '250px',
              background: 'radial-gradient(circle, rgba(124,58,237,0.12) 0%, transparent 70%)',
              pointerEvents: 'none'
            }} />

            {/* Card content */}
            <div style={{
              position: 'relative',
              zIndex: 1,
              textAlign: 'center'
            }}>
              {/* Top badge */}
              <div style={{
                background: 'rgba(124,58,237,0.15)',
                border: '1px solid rgba(124,58,237,0.3)',
                borderRadius: '999px',
                padding: '6px 16px',
                display: 'inline-block',
                marginBottom: '24px'
              }}>
                <span style={{
                  fontSize: '12px',
                  color: '#A78BFA',
                  fontWeight: '500',
                  letterSpacing: '0.05em'
                }}>
                  Trusted by Recruiters Across India
                </span>
              </div>

              {/* Main headline */}
              <h2 style={{
                fontSize: window.innerWidth < 768 ? '28px' : '42px',
                fontWeight: '800',
                color: 'white',
                textAlign: 'center',
                lineHeight: '1.2',
                marginBottom: '16px'
              }}>
                Stop Guessing. Start Hiring on <span style={{
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Merit</span>.
              </h2>

              {/* Subheadline */}
              <p style={{
                fontSize: '16px',
                color: '#9CA3AF',
                textAlign: 'center',
                maxWidth: '560px',
                margin: '16px auto 0 auto',
                lineHeight: '1.7'
              }}>
                Merit Mind is the only agentic AI hiring system built specifically for India — detecting caste signals, college tier bias, and regional discrimination that no Western tool understands.
              </p>

              {/* Feature proof points */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '32px',
                flexWrap: 'wrap',
                marginTop: '32px',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row',
                alignItems: window.innerWidth < 768 ? 'center' : 'flex-start'
              }}>
                {[
                  'Indian Bias Taxonomy — built-in',
                  'Audit Certificate on every analysis',
                  'No API key needed for demo'
                ].map((text, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '13px',
                    color: '#D1D5DB',
                    fontWeight: '500'
                  }}>
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="8" cy="8" r="8" fill="rgba(236,72,153,0.15)"/>
                      <path d="M5 8L7 10L11 6" stroke="#EC4899" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    {text}
                  </div>
                ))}
              </div>

              {/* CTA Buttons */}
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                gap: '16px',
                flexWrap: 'wrap',
                marginTop: '40px',
                flexDirection: window.innerWidth < 768 ? 'column' : 'row'
              }}>
                {/* Primary Button */}
                <button
                  onClick={openSignUp}
                  style={{
                    background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '16px 32px',
                    fontSize: '15px',
                    fontWeight: '700',
                    cursor: 'pointer',
                    fontFamily: 'Poppins',
                    transition: 'all 0.2s ease',
                    width: window.innerWidth < 768 ? '100%' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'scale(1.03)';
                    e.target.style.boxShadow = '0 8px 30px rgba(124,58,237,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Analyze Your First JD — Free
                </button>

                {/* Secondary Button */}
                <button
                  onClick={scrollToHowItWorks}
                  style={{
                    background: 'transparent',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '16px 32px',
                    fontSize: '15px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    fontFamily: 'Poppins',
                    transition: 'all 0.2s ease',
                    width: window.innerWidth < 768 ? '100%' : 'auto'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(255,255,255,0.05)';
                    e.target.style.borderColor = 'rgba(255,255,255,0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.borderColor = 'rgba(255,255,255,0.2)';
                  }}
                >
                  See How It Works
                </button>
              </div>

              {/* Social proof line */}
              <p style={{
                fontSize: '12px',
                color: '#6B7280',
                textAlign: 'center',
                marginTop: '24px'
              }}>
                No credit card required  ·  Works instantly  ·  Indian hiring context built-in
              </p>
            </div>
          </div>
        </div>

        {/* PART 3 - Bottom Urgency Strip */}
        <div style={{
          background: '#0D0221',
          padding: '24px 0',
          borderTop: '1px solid #1F2937'
        }}>
          <p style={{
            fontSize: '13px',
            color: '#6B7280',
            textAlign: 'center',
            fontStyle: 'italic',
            margin: '0'
          }}>
            Merit Mind was built for Hack'her'thon 3.0 at SVCE — solving the bias problem Indian recruiters face every day.
          </p>
        </div>
      </section>
    </>
  );
}
