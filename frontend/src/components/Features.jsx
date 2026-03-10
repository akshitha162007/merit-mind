export default function Features() {
  const features = [
    {
      icon: '🧠',
      title: 'Bias Detection Engine',
      description: 'Scans job descriptions and resumes for gender, caste, regional, and age-based bias in real time'
    },
    {
      icon: '📊',
      title: 'Merit Score & Fairness Metrics',
      description: 'Every candidate ranked on skills and potential, not background or pedigree'
    },
    {
      icon: '🔍',
      title: 'Counterfactual Simulations',
      description: 'AI twins reveal hidden bias coefficients before decisions are made'
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#EC4899] to-[#7C3AED] bg-clip-text text-transparent">
          Powerful Features
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="relative p-8 rounded-2xl bg-gradient-to-br from-[#FAF5FF] to-white border-2 border-transparent hover:border-[#EC4899] hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[#EC4899] to-[#7C3AED] rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              <div className="relative z-10">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-bold mb-3 text-[#6B21A8]">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
