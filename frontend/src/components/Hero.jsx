export default function Hero({ openSignUp }) {
  const scrollToHowItWorks = () => {
    document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#FAF5FF] via-[#F9A8D4]/20 to-[#FAF5FF] px-6">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute w-[500px] h-[500px] bg-[#7C3AED] rounded-full blur-[100px] opacity-40 -top-20 -left-20 animate-blob"></div>
        <div className="absolute w-[600px] h-[600px] bg-[#EC4899] rounded-full blur-[100px] opacity-40 -bottom-32 -right-32 animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-[#EC4899] to-[#7C3AED] bg-clip-text text-transparent leading-tight">
          Hire for Merit. Not Bias.
        </h1>
        <p className="text-lg md:text-2xl text-gray-700 mb-10 max-w-3xl mx-auto leading-relaxed">
          MeritMind uses AI to detect and eliminate unconscious bias at every stage of your recruitment pipeline — so the best person always gets the job.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={openSignUp}
            className="px-8 py-4 bg-gradient-to-r from-[#EC4899] to-[#7C3AED] text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            Get Started Free
          </button>
          <button
            onClick={scrollToHowItWorks}
            className="px-8 py-4 border-2 border-[#7C3AED] text-[#7C3AED] font-semibold rounded-lg hover:bg-[#7C3AED] hover:text-white transition-all duration-300"
          >
            See How It Works
          </button>
        </div>
      </div>
    </section>
  );
}
