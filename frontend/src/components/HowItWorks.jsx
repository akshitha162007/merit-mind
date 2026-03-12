export default function HowItWorks() {
  const steps = [
    { 
      number: '1', 
      title: 'Bias Detection and JD Rewriting',
      description: 'Our Intersectional Bias Detection Agent scans your job description across 6 Indian-specific bias axes — gender, caste signals, college tier, regional language, socioeconomic, and matrimonial status. It detects compound intersections no Western tool understands. The Autonomous JD Rewriting Agent then rewrites the JD in three calibrated variants — Conservative, Balanced, and Inclusive-First — targeting the exact underrepresented demographic your company is failing to hire, with a measurable Attraction Score before and after.'
    },
    { 
      number: '2', 
      title: 'Resume Blind Screening and Skill Graph Intelligence',
      description: 'The SilenceRank Agent strips all identity markers — names, universities, company brands, locations — from resumes and converts them into pure anonymous skill graphs. Candidates are ranked purely on skill depth, breadth, and learning velocity. The system then reintroduces language and measures the Language Influence Ratio (LIR) — a quantified score showing exactly how much a candidate\'s name or institution shifted their ranking. Zero is fair. Any other number is logged, explained, and corrected.'
    },
    { 
      number: '3', 
      title: 'Counterfactual Fairness Simulation and Scoring',
      description: 'The Counterfactual Fairness Agent creates digital twin profiles — identical skills, different identity attributes — and runs them through the pipeline to detect phantom bias. If Priya scores 62 and Emily scores 78 on the same resume, the 16-point gap is bias, not merit. The Dynamic Fairness Optimizer then applies mathematical fairness constraints to the final ranking, balancing skill scores and bias corrections without forced diversity quotas — producing a Fairness Justification Report for every hiring decision.'
    },
    { 
      number: '4', 
      title: 'Bias Audit Certificate and Continuous Learning',
      description: 'Every analysis produces a Bias Audit Certificate — showing original bias score, rewritten bias score, intersections resolved, and compliance with the Equal Remuneration Act and Persons with Disabilities Act. The Reverse Bias Simulator then stress-tests the entire hiring pipeline on thousands of synthetic diverse candidate profiles before any real candidate applies — computing a Bias Risk Score from 0 to 100. The system continuously learns from recruiter corrections and improves fairness policy automatically over time.'
    }
  ];

  return (
    <section id="how-it-works" style={{ padding: '100px 0', borderTop: '1px solid #1F2937', position: 'relative', overflow: 'hidden' }}>
      {/* Animated background gradient */}
      <div style={{ position: 'absolute', top: '20%', left: '-10%', width: '500px', height: '500px', background: 'radial-gradient(circle, rgba(124, 58, 237, 0.15) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }}></div>
      <div style={{ position: 'absolute', bottom: '10%', right: '-10%', width: '600px', height: '600px', background: 'radial-gradient(circle, rgba(236, 72, 153, 0.12) 0%, transparent 70%)', filter: 'blur(80px)', pointerEvents: 'none' }}></div>
      
      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <h2 style={{ fontSize: '36px', fontWeight: 700, textAlign: 'center', color: 'white', marginBottom: '12px' }}>
          How Merit Mind Works
        </h2>
        <p style={{ fontSize: '16px', color: '#9CA3AF', textAlign: 'center', maxWidth: '640px', margin: '0 auto 80px' }}>
          A self-correcting multi-agent pipeline that detects, eliminates, and audits bias — from job description to final hire.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px', maxWidth: '1100px', margin: '0 auto' }}>
          {steps.map((step, idx) => (
            <div 
              key={idx} 
              style={{ 
                background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.05) 0%, rgba(236, 72, 153, 0.05) 100%)',
                border: '1px solid rgba(124, 58, 237, 0.2)',
                borderRadius: '20px',
                padding: '32px',
                position: 'relative',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.5)';
                e.currentTarget.style.boxShadow = '0 20px 60px rgba(124, 58, 237, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '20px' }}>
                <div style={{ 
                  width: '56px', 
                  height: '56px', 
                  borderRadius: '50%', 
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center', 
                  fontSize: '20px', 
                  fontWeight: 700, 
                  color: 'white',
                  flexShrink: 0,
                  boxShadow: '0 8px 24px rgba(124, 58, 237, 0.4)'
                }}>
                  {step.number}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '12px', lineHeight: 1.4 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.7, margin: 0 }}>
                    {step.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
