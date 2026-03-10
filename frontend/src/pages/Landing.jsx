import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useState, useEffect } from 'react';

export const Landing = () => {
  const navigate = useNavigate();
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

  const features = [
    {
      icon: '🔍',
      title: 'JD Bias Analyzer',
      description: 'Flags exclusionary language in job descriptions'
    },
    {
      icon: '🎭',
      title: 'Resume Blind Screening',
      description: 'Strips identity signals, focuses on skills only'
    },
    {
      icon: '🕸️',
      title: 'Skill Graph Intelligence',
      description: 'Maps transferable skills across domains'
    },
    {
      icon: '⚠️',
      title: 'Intersectional Bias Detection',
      description: 'Finds compounded hidden bias'
    },
    {
      icon: '🔄',
      title: 'Counterfactual Simulator',
      description: 'Tests what-if fairness comparisons'
    },
    {
      icon: '📊',
      title: 'Explainability Agent',
      description: 'Generates transparent hiring reasoning'
    }
  ];

  const steps = [
    { number: '1', title: 'Upload JD' },
    { number: '2', title: 'Blind Resume Scan' },
    { number: '3', title: 'AI Matching' },
    { number: '4', title: 'Fair Ranking' }
  ];

  return (
    <div className="min-h-screen bg-bg-primary overflow-hidden">
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>

      <div className="relative z-10">
        {/* Hero Section */}
        <section className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
          <div className="absolute top-8 left-8 px-4 py-2 glass-card text-sm font-semibold">
            🏆 Hack'her'thon 3.0 — SW-02
          </div>

          <h1 className="text-6xl md:text-7xl font-syne font-bold text-center mb-6 max-w-4xl">
            Hire on <span className="gradient-text">Merit</span>. Not on Bias.
          </h1>

          <p className="text-lg text-text-secondary text-center max-w-2xl mb-12">
            Merit Mind uses agentic AI to eliminate bias from job descriptions, blind-screen resumes, and rank candidates purely on skill — transparently and fairly.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-20">
            <Button onClick={() => navigate('/register')} className="px-8 py-4 text-lg">
              Get Started Free
            </Button>
            <Button variant="outline" onClick={() => navigate('/login')} className="px-8 py-4 text-lg">
              Sign In
            </Button>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="py-16 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="glass-card p-8 border-l-4 border-accent-pink">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <p className="text-4xl font-bold text-accent-pink mb-2">↑{counters.diversity}%</p>
                  <p className="text-text-secondary">Diversity Index</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-accent-cyan mb-2">↓{counters.bias}%</p>
                  <p className="text-text-secondary">Bias Cases</p>
                </div>
                <div className="text-center">
                  <p className="text-4xl font-bold text-accent-purple mb-2">↑{counters.trust}%</p>
                  <p className="text-text-secondary">Candidate Trust</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-syne font-bold text-center mb-16">How Merit Mind Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, idx) => (
                <Card key={idx} className="p-6 hover:shadow-lg hover:shadow-accent-pink/30">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-syne font-bold mb-3 text-text-primary">{feature.title}</h3>
                  <p className="text-text-secondary">{feature.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-5xl font-syne font-bold text-center mb-16">The Process</h2>
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-0">
              {steps.map((step, idx) => (
                <div key={idx} className="flex items-center gap-4 w-full md:w-auto">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-2xl font-bold flex-shrink-0">
                    {step.number}
                  </div>
                  <div className="md:hidden text-text-secondary">{step.title}</div>
                  <div className="hidden md:block text-center">
                    <p className="text-text-secondary text-sm">{step.title}</p>
                  </div>
                  {idx < steps.length - 1 && (
                    <div className="hidden md:block flex-1 h-1 bg-gradient-to-r from-accent-purple to-accent-pink mx-4"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="py-20 px-4">
          <div className="max-w-4xl mx-auto">
            <div className="glass-card p-12 text-center" style={{ background: 'linear-gradient(135deg, rgba(123, 47, 255, 0.2) 0%, rgba(233, 30, 140, 0.2) 100%)' }}>
              <h2 className="text-4xl font-syne font-bold mb-6">Ready to build a bias-free team?</h2>
              <Button onClick={() => navigate('/register')} className="px-8 py-4 text-lg">
                Start for Free
              </Button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/10 py-8 px-4 text-center text-text-secondary">
          <p>© 2025 Merit Mind. Built for Hack'her'thon 3.0</p>
        </footer>
      </div>
    </div>
  );
};
