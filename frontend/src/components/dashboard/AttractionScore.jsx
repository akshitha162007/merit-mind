export default function AttractionScore({ score, label }) {
  // Clamp score between 0 and 100
  const normalizedScore = Math.max(0, Math.min(100, score || 0));
  
  // Calculate the arc length (percentage of the circle)
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const arcLength = (normalizedScore / 100) * circumference;
  const gapLength = circumference - arcLength;
  
  // Color based on score
  const getScoreColor = (score) => {
    if (score >= 60) return '#16A34A'; // green
    if (score >= 30) return '#F59E0B'; // amber  
    return '#DC2626'; // red
  };

  const scoreColor = getScoreColor(normalizedScore);

  return (
    <div style={{
      backgroundColor: 'white',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      textAlign: 'center'
    }}>
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <svg width="100" height="100" viewBox="0 0 100 100" style={{ transform: 'rotate(-90deg)' }}>
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke="#E5E7EB"
            strokeWidth="8"
            strokeLinecap="round"
          />
          
          {/* Progress arc */}
          <circle
            cx="50"
            cy="50"
            r={radius}
            fill="none"
            stroke={scoreColor}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${arcLength} ${gapLength}`}
            strokeDashoffset="0"
            style={{
              transition: 'stroke-dasharray 1s ease-out'
            }}
          />
        </svg>
        
        {/* Score text in center */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span 
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: scoreColor,
              fontFamily: "'Poppins', sans-serif"
            }}
          >
            {Math.round(normalizedScore)}
          </span>
        </div>
      </div>
      
      {/* Label */}
      <p style={{
        fontSize: '12px',
        color: '#6B7280',
        marginTop: '8px',
        fontWeight: '500',
        fontFamily: "'Poppins', sans-serif"
      }}>
        {label || 'Attraction Score'}
      </p>
    </div>
  );
}
