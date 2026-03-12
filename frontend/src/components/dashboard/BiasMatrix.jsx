export default function BiasMatrix({ biasAxes = [] }) {
  const allAxes = [
    'Gender',
    'College Tier', 
    'Caste Signal',
    'Regional/Language',
    'Socioeconomic',
    'Matrimonial/Age'
  ];

  // Create a lookup map for easier access
  const axisData = {};
  biasAxes.forEach(axis => {
    axisData[axis.axis] = axis;
  });

  const getSeverityColor = (severity) => {
    if (severity >= 7) return '#DC2626'; // red
    if (severity >= 4) return '#F59E0B'; // amber
    return '#16A34A'; // green
  };

  return (
    <div style={{
      backgroundColor: '#1A1A2E',
      border: '1px solid #2D2D44',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
      marginBottom: '16px'
    }}>
      <h3 style={{
        fontSize: '16px',
        fontWeight: '600',
        color: '#FFFFFF',
        fontFamily: "'Poppins', sans-serif",
        marginBottom: '16px'
      }}>
        Indian Bias Matrix
      </h3>
      
      <div style={{ overflowX: 'auto' }}>
        <table style={{
          width: '100%',
          borderCollapse: 'collapse',
          fontSize: '14px',
          fontFamily: "'Poppins', sans-serif"
        }}>
          <thead>
            <tr style={{ backgroundColor: '#2D2D44' }}>
              <th style={{
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#8B8BA3',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textAlign: 'left',
                borderBottom: '1px solid #2D2D44'
              }}>
                Bias Axis
              </th>
              <th style={{
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#8B8BA3',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textAlign: 'left',
                borderBottom: '1px solid #2D2D44'
              }}>
                Detected
              </th>
              <th style={{
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#8B8BA3',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textAlign: 'left',
                borderBottom: '1px solid #2D2D44'
              }}>
                Severity
              </th>
              <th style={{
                padding: '12px 16px',
                fontSize: '12px',
                fontWeight: '600',
                color: '#8B8BA3',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                textAlign: 'left',
                borderBottom: '1px solid #2D2D44'
              }}>
                Trigger Phrase
              </th>
            </tr>
          </thead>
          <tbody>
            {allAxes.map((axis, index) => {
              const data = axisData[axis];
              const isDetected = data?.detected || false;
              const severity = data?.severity || 0;
              const triggerPhrase = data?.trigger_phrase || '';
              
              return (
                <tr key={axis} style={index % 2 === 0 ? { backgroundColor: '#0F0F23' } : { backgroundColor: '#1A1A2E' }}>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#FFFFFF',
                    borderBottom: '1px solid #2D2D44',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    {axis}
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    borderBottom: '1px solid #2D2D44',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    <span style={isDetected 
                      ? { color: '#DC2626', fontWeight: '600', fontSize: '14px' }
                      : { color: '#16A34A', fontWeight: '600', fontSize: '14px' }
                    }>
                      {isDetected ? 'Yes' : 'No'}
                    </span>
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#B4B4C7',
                    borderBottom: '1px solid #2D2D44',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span>{severity}/10</span>
                      <div style={{ flex: 1, maxWidth: '80px' }}>
                        <div style={{ height: '4px', background: '#E5E7EB', borderRadius: '999px', overflow: 'hidden' }}>
                          <div 
                            style={{ 
                              height: '4px',
                              borderRadius: '999px',
                              width: `${(severity / 10) * 100}%`,
                              backgroundColor: getSeverityColor(severity),
                              transition: 'width 0.3s ease'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td style={{
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    borderBottom: '1px solid #F3F4F6',
                    fontFamily: "'Poppins', sans-serif"
                  }}>
                    {triggerPhrase ? (
                      <span style={{
                        backgroundColor: '#F3F4F6',
                        color: '#374151',
                        fontSize: '12px',
                        fontFamily: 'monospace',
                        padding: '3px 8px',
                        borderRadius: '4px',
                        display: 'inline-block'
                      }}>
                        {triggerPhrase}
                      </span>
                    ) : (
                      <span style={{ color: '#D1D5DB' }}>—</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
