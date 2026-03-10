export default function HowItWorks() {
  const steps = [
    { icon: '📝', title: 'Post Your Job Description', description: 'AI rewrites it to be inclusive' },
    { icon: '📁', title: 'Upload Resumes', description: 'Candidates blind-scored on pure merit' },
    { icon: '✅', title: 'Review Fair Rankings', description: 'Full explainability with SHAP/LIME scores' }
  ];

  return (
    <section id="how-it-works" className="py-20 px-6 bg-gradient-to-br from-[#FAF5FF] to-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-center mb-16 bg-gradient-to-r from-[#EC4899] to-[#7C3AED] bg-clip-text text-transparent">
          How It Works
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center">
              <div className="flex flex-col items-center text-center max-w-xs">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#EC4899] to-[#7C3AED] flex items-center justify-center text-4xl mb-4 shadow-lg">
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-[#6B21A8] mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
              {index < steps.length - 1 && (
                <div className="hidden md:block mx-4 text-4xl text-[#7C3AED]">→</div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
