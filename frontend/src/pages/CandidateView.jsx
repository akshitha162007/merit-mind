import { useState } from 'react';
import FairnessAudit from '../components/FairnessAudit';

export default function CandidateView() {
  const [candidateId, setCandidateId] = useState('');

  return (
    <div style={{ padding: '32px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'white', marginBottom: '32px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Candidate Evaluation Dashboard</h1>
        
        <div className="glass-card" style={{ padding: '24px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'white', marginBottom: '16px' }}>Candidate Information</h2>
          
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 600, color: '#B8A9D9', marginBottom: '8px' }}>
              Candidate ID
            </label>
            <input
              type="text"
              value={candidateId}
              onChange={(e) => setCandidateId(e.target.value)}
              placeholder="Enter candidate UUID"
              style={{ width: '100%', padding: '12px 16px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', borderRadius: '8px', color: 'white', fontSize: '0.875rem' }}
            />
          </div>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Name</p>
              <p style={{ fontWeight: 600, color: 'white' }}>Priya Sharma</p>
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Email</p>
              <p style={{ fontWeight: 600, color: 'white' }}>priya@example.com</p>
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Experience</p>
              <p style={{ fontWeight: 600, color: 'white' }}>3 years</p>
            </div>
            <div>
              <p className="text-secondary" style={{ fontSize: '0.75rem', marginBottom: '4px' }}>Skills</p>
              <p style={{ fontWeight: 600, color: 'white' }}>Python, SQL, FastAPI</p>
            </div>
          </div>
        </div>

        {candidateId && <FairnessAudit candidateId={candidateId} />}
      </div>
    </div>
  );
}
