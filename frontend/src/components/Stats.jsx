import { useState, useEffect } from 'react';

export default function Stats() {
  const [counters, setCounters] = useState({ diversity: 0, bias: 0, trust: 0 });

  useEffect(() => {
    const interval = setInterval(() => {
      setCounters(prev => ({
        diversity: prev.diversity < 30 ? prev.diversity + 1 : 30,
        bias: prev.bias < 50 ? prev.bias + 2 : 50,
        trust: prev.trust < 25 ? prev.trust + 1 : 25
      }));
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <section style={{ padding: '40px 0' }}>
      <div className="container">
        <div className="glass-card" style={{ padding: '40px', borderLeft: '4px solid #E91E8C' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '40px' }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#E91E8C', marginBottom: '8px' }}>{counters.diversity}%</p>
              <p className="text-secondary">Diversity Index</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#00D4FF', marginBottom: '8px' }}>{counters.bias}%</p>
              <p className="text-secondary">Bias Reduction</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '2.5rem', fontWeight: 800, color: '#7B2FFF', marginBottom: '8px' }}>{counters.trust}%</p>
              <p className="text-secondary">Candidate Trust</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
