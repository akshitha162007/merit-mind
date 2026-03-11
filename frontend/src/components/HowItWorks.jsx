export default function HowItWorks() {
  const steps = [
    { number: '1', title: 'Upload JD' },
    { number: '2', title: 'Blind Resume Scan' },
    { number: '3', title: 'AI Matching' },
    { number: '4', title: 'Fair Ranking' }
  ];

  return (
    <section id="how-it-works" style={{ padding: '80px 0' }}>
      <div className="container">
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '60px' }}>
          The Process
        </h2>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
          {steps.map((step, idx) => (
            <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '20px', flex: 1, minWidth: '150px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #7B2FFF, #E91E8C)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: 'white', flexShrink: 0 }}>
                {step.number}
              </div>
              <div style={{ display: 'none' }}>
                <p className="text-secondary" style={{ fontSize: '0.875rem' }}>{step.title}</p>
              </div>
              {idx < steps.length - 1 && (
                <div style={{ display: 'none', flex: 1, height: '2px', background: 'linear-gradient(90deg, #7B2FFF, #E91E8C)' }}></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
