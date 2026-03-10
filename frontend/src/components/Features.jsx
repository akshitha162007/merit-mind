export default function Features() {
  const features = [
    { title: 'JD Bias Analyzer', description: 'Flags exclusionary language in job descriptions' },
    { title: 'Resume Blind Screening', description: 'Strips identity signals, focuses on skills only' },
    { title: 'Skill Graph Intelligence', description: 'Maps transferable skills across domains' },
    { title: 'Intersectional Bias Detection', description: 'Finds compounded hidden bias' },
    { title: 'Counterfactual Simulator', description: 'Tests what-if fairness comparisons' },
    { title: 'Explainability Agent', description: 'Generates transparent hiring reasoning' }
  ];

  return (
    <section style={{ padding: '80px 0' }}>
      <div className="container">
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, textAlign: 'center', marginBottom: '60px' }}>
          How Merit Mind Works
        </h2>
        <div className="grid-3">
          {features.map((feature, idx) => (
            <div key={idx} className="glass-card" style={{ padding: '32px' }}>
              <div style={{ width: '48px', height: '48px', background: 'linear-gradient(135deg, #7B2FFF, #E91E8C)', borderRadius: '12px', marginBottom: '20px' }}></div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '12px' }}>{feature.title}</h3>
              <p className="text-secondary">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
