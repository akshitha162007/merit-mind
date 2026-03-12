export default function WhyDifferent() {
  const cards = [
    {
      title: 'Built for Indian Hiring',
      body: 'Every existing bias detection tool was built for Western hiring contexts. Merit Mind is the only system designed specifically for Indian hiring — detecting caste signals, college tier bias, and regional language discrimination that no Western tool understands.',
      icon: '🇮🇳',
      gradient: 'linear-gradient(135deg, #7C3AED 0%, #6366F1 100%)'
    },
    {
      title: 'Proactive, Not Reactive',
      body: 'Most tools detect bias after real candidates have been harmed. Our Reverse Bias Simulator stress-tests your entire hiring pipeline on synthetic profiles before a single real candidate applies — computing a Bias Risk Score so you fix problems before they happen.',
      icon: '⚡',
      gradient: 'linear-gradient(135deg, #EC4899 0%, #F43F5E 100%)'
    },
    {
      title: 'Agentic, Not Advisory',
      body: 'Every other bias tool suggests changes and waits for a human to act. Merit Mind\'s agents act autonomously — rewriting JDs, correcting scores, generating audit certificates, and learning from corrections — without waiting for human intervention.',
      icon: '🤖',
      gradient: 'linear-gradient(135deg, #8B5CF6 0%, #A855F7 100%)'
    }
  ];

  return (
    <section style={{ padding: '100px 0', position: 'relative' }}>
      <div className="container">
        <h2 style={{ fontSize: '36px', fontWeight: 700, color: 'white', textAlign: 'center', marginBottom: '16px' }}>
          Why Merit Mind is Different
        </h2>
        <p style={{ fontSize: '16px', color: '#9CA3AF', textAlign: 'center', maxWidth: '600px', margin: '0 auto 60px' }}>
          The only bias detection system built from the ground up for Indian hiring contexts.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '32px', maxWidth: '1200px', margin: '0 auto' }}>
          {cards.map((card, idx) => (
            <div 
              key={idx} 
              style={{ 
                background: '#111827', 
                border: '1px solid #1F2937', 
                borderRadius: '16px', 
                padding: '32px',
                transition: 'all 0.3s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#7C3AED';
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = '0 12px 40px rgba(124, 58, 237, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#1F2937';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ 
                width: '48px', 
                height: '48px', 
                borderRadius: '12px', 
                background: card.gradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '24px',
                marginBottom: '20px',
                boxShadow: '0 8px 16px rgba(124, 58, 237, 0.3)'
              }}>
                {card.icon}
              </div>
              <h3 style={{ fontSize: '18px', fontWeight: 600, color: 'white', marginBottom: '12px' }}>
                {card.title}
              </h3>
              <p style={{ fontSize: '14px', color: '#9CA3AF', lineHeight: 1.7, margin: 0 }}>
                {card.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
