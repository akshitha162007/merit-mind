import { useState, useEffect } from 'react';
import { getAllResumes, getResumeDetail } from '../api/resumeApi';

export default function ResumesPanel() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedResume, setSelectedResume] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    fetchResumes();
  }, []);

  const fetchResumes = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getAllResumes();
      setResumes(Array.isArray(data) ? data : []);
    } catch (err) {
      if (err.response?.status === 403) {
        setError('Access denied');
      } else {
        setError('Failed to load resumes');
      }
      setResumes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (resume_id) => {
    try {
      setDetailLoading(true);
      const data = await getResumeDetail(resume_id);
      setSelectedResume(data);
    } catch (err) {
      setError('Failed to load resume details');
    } finally {
      setDetailLoading(false);
    }
  };

  if (selectedResume) {
    return (
      <div className="glass-card" style={{ padding: '32px' }}>
        <button
          onClick={() => setSelectedResume(null)}
          style={{
            marginBottom: '24px',
            padding: '8px 16px',
            borderRadius: '8px',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            background: 'transparent',
            color: 'white',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}
        >
          Back to Resumes
        </button>

        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {selectedResume.candidate_name}
          </h3>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            Blind ID: {selectedResume.candidate_blind_id}
          </p>
          <p className="text-secondary" style={{ fontSize: '0.875rem' }}>
            Submitted: {new Date(selectedResume.submitted_at).toLocaleDateString()}
          </p>
        </div>

        {/* Skills */}
        {selectedResume.parsed_json?.skills && selectedResume.parsed_json.skills.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '12px' }}>Skills</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {selectedResume.parsed_json.skills.map((skill) => (
                <span
                  key={skill}
                  style={{
                    padding: '6px 12px',
                    background: 'rgba(123, 47, 255, 0.2)',
                    border: '1px solid rgba(123, 47, 255, 0.4)',
                    borderRadius: '20px',
                    color: '#c4b5fd',
                    fontSize: '0.875rem'
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Education */}
        {selectedResume.parsed_json?.education && selectedResume.parsed_json.education.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '12px' }}>Education</h4>
            <ul style={{ color: '#B8A9D9', fontSize: '0.875rem', paddingLeft: '20px' }}>
              {selectedResume.parsed_json.education.map((edu, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>{edu}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Experience */}
        {selectedResume.parsed_json?.experience && selectedResume.parsed_json.experience.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '12px' }}>Experience</h4>
            <ul style={{ color: '#B8A9D9', fontSize: '0.875rem', paddingLeft: '20px' }}>
              {selectedResume.parsed_json.experience.map((exp, idx) => (
                <li key={idx} style={{ marginBottom: '8px' }}>{exp.company}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Raw Text Preview */}
        {selectedResume.raw_text && (
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{ color: 'white', fontWeight: 600, marginBottom: '12px' }}>Resume Text</h4>
            <div
              style={{
                padding: '16px',
                background: 'rgba(255, 255, 255, 0.02)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                color: '#B8A9D9',
                fontSize: '0.875rem',
                maxHeight: '300px',
                overflowY: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word'
              }}
            >
              {selectedResume.raw_text}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card" style={{ padding: '32px' }}>
      <div style={{ marginBottom: '32px' }}>
        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'white', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Submitted Resumes
        </h3>
        <p className="text-secondary">
          View and manage all candidate resumes
        </p>
      </div>

      {error && (
        <div style={{ padding: '12px 16px', background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: '8px', color: '#fca5a5', marginBottom: '24px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#B8A9D9' }}>
          Loading resumes...
        </div>
      ) : resumes.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '48px', color: '#B8A9D9' }}>
          <p style={{ marginBottom: '8px' }}>No resumes submitted yet.</p>
          <p style={{ fontSize: '0.875rem' }}>Candidates will appear here after uploading.</p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
                <th style={{ padding: '12px', textAlign: 'left', color: '#B8A9D9', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Candidate</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#B8A9D9', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Skills</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#B8A9D9', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Education</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#B8A9D9', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Experience</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#B8A9D9', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Submitted</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#B8A9D9', fontWeight: 600, fontSize: '0.875rem', textTransform: 'uppercase' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {resumes.map((resume) => (
                <tr key={resume.resume_id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)' }}>
                  <td style={{ padding: '12px', color: 'white', fontSize: '0.875rem' }}>
                    <div>{resume.candidate_name}</div>
                    <div style={{ color: '#B8A9D9', fontSize: '0.75rem' }}>{resume.candidate_blind_id}</div>
                  </td>
                  <td style={{ padding: '12px', color: '#B8A9D9', fontSize: '0.875rem' }}>
                    {resume.skills?.length || 0}
                  </td>
                  <td style={{ padding: '12px', color: '#B8A9D9', fontSize: '0.875rem' }}>
                    {resume.education?.length || 0}
                  </td>
                  <td style={{ padding: '12px', color: '#B8A9D9', fontSize: '0.875rem' }}>
                    {resume.experience?.length || 0}
                  </td>
                  <td style={{ padding: '12px', color: '#B8A9D9', fontSize: '0.875rem' }}>
                    {new Date(resume.submitted_at).toLocaleDateString()}
                  </td>
                  <td style={{ padding: '12px' }}>
                    <button
                      onClick={() => handleViewDetails(resume.resume_id)}
                      disabled={detailLoading}
                      style={{
                        padding: '6px 12px',
                        borderRadius: '6px',
                        border: 'none',
                        background: 'rgba(123, 47, 255, 0.2)',
                        color: '#c4b5fd',
                        fontWeight: 600,
                        fontSize: '0.75rem',
                        cursor: detailLoading ? 'not-allowed' : 'pointer',
                        transition: 'all 0.3s ease'
                      }}
                    >
                      {detailLoading ? 'Loading...' : 'View'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
