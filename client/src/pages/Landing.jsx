import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#131313] text-white flex flex-col"
      style={{ fontFamily: 'Manrope, sans-serif' }}>

      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Background glows */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[900px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'rgba(124,58,237,0.07)' }} />
        <div className="absolute bottom-0 -left-1/4 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: 'rgba(41,161,149,0.05)' }} />
        <div className="absolute bottom-0 -right-1/4 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: 'rgba(124,58,237,0.05)' }} />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 w-full z-50 border-b border-white/10"
        style={{ background: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
          <div className="text-xl font-bold tracking-tighter text-white uppercase">
            InterviewPro
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#features" className="text-zinc-400 hover:text-white transition-colors">Features</a>
            <a href="#subjects" className="text-zinc-400 hover:text-white transition-colors">Subjects</a>
            <a href="#stats" className="text-zinc-400 hover:text-white transition-colors">Stats</a>
          </nav>
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/candidate/login')}
              className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 transition-all">
              Sign In
            </button>
            <button
              onClick={() => navigate('/candidate/login')}
              className="px-5 py-2 rounded-lg text-sm text-white font-semibold transition-all active:scale-95"
              style={{ background: '#7c3aed', boxShadow: '0 4px 15px rgba(124,58,237,0.3)' }}>
              Get Started
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-24 pb-20">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider mb-8 border border-white/10"
          style={{ background: 'rgba(124,58,237,0.1)', color: '#a78bfa' }}>
          <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
          Powered by Groq AI — Real-time Evaluation
        </div>

        <h1 className="text-6xl md:text-7xl font-bold tracking-tight mb-6 max-w-4xl leading-tight">
          Ace Your Next{' '}
          <span style={{
            background: 'linear-gradient(135deg, #a78bfa, #7c3aed)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Interview
          </span>
        </h1>

        <p className="text-zinc-400 text-lg max-w-xl mb-10 leading-relaxed">
          AI-powered mock interviews with real-time voice evaluation.
          Practice, improve, and get noticed by top recruiters.
        </p>

        {/* Role Cards */}
        <div className="flex flex-col sm:flex-row gap-4 mb-16 w-full max-w-2xl">
          <div
            onClick={() => navigate('/candidate/login')}
            className="flex-1 cursor-pointer rounded-xl p-6 text-left transition-all hover:scale-105 group"
            style={{
              background: 'rgba(26,26,26,0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(124,58,237,0.3)'
            }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
              style={{ background: 'rgba(124,58,237,0.15)' }}>
              🎓
            </div>
            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-violet-300 transition-colors">
              I'm a Candidate
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Practice mock interviews, get AI feedback, track your progress across 12 subjects
            </p>
            <div className="flex items-center gap-1 mt-4 text-violet-400 text-sm font-semibold">
              Start Practicing
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform"
                style={{ fontFamily: 'Material Symbols Outlined' }}>
                arrow_forward
              </span>
            </div>
          </div>

          <div
            onClick={() => navigate('/hr/login')}
            className="flex-1 cursor-pointer rounded-xl p-6 text-left transition-all hover:scale-105 group"
            style={{
              background: 'rgba(26,26,26,0.6)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(41,161,149,0.3)'
            }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl"
              style={{ background: 'rgba(41,161,149,0.15)' }}>
              🔍
            </div>
            <h3 className="text-white font-bold text-lg mb-2 group-hover:text-teal-300 transition-colors">
              I'm an HR / Recruiter
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Discover pre-screened candidates, view interview scores, and connect with top talent
            </p>
            <div className="flex items-center gap-1 mt-4 text-teal-400 text-sm font-semibold">
              Discover Talent
              <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform"
                style={{ fontFamily: 'Material Symbols Outlined' }}>
                arrow_forward
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div id="stats" className="flex items-center gap-12 border-t border-white/10 pt-10 w-full max-w-2xl justify-center">
          <div className="text-center">
            <p className="text-3xl font-bold text-violet-400">12</p>
            <p className="text-zinc-500 text-xs uppercase tracking-wider mt-1">Subjects</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-3xl font-bold text-teal-400">Real AI</p>
            <p className="text-zinc-500 text-xs uppercase tracking-wider mt-1">Evaluation</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-center">
            <p className="text-3xl font-bold text-green-400">Live</p>
            <p className="text-zinc-500 text-xs uppercase tracking-wider mt-1">Feedback</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-violet-400 mb-3">Why InterviewPro</p>
          <h2 className="text-4xl font-bold text-white">Everything you need to succeed</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              icon: 'mic',
              title: 'Voice-Powered Answers',
              desc: 'Speak naturally — our AI transcribes and evaluates your answers in real time just like a real interview.',
              color: '#7c3aed'
            },
            {
              icon: 'psychology',
              title: 'Instant AI Feedback',
              desc: 'Get scored 0-100 with detailed feedback on every answer from our Llama 3.3 powered evaluation engine.',
              color: '#0d9488'
            },
            {
              icon: 'leaderboard',
              title: 'HR Discovery Portal',
              desc: 'Top performers get discovered by real recruiters. Build your profile and get noticed by top companies.',
              color: '#f59e0b'
            }
          ].map((f, i) => (
            <div key={i} className="rounded-xl p-8 transition-all hover:border-white/20"
              style={{
                background: 'rgba(26,26,26,0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                style={{ background: `${f.color}20` }}>
                <span className="material-symbols-outlined"
                  style={{ fontFamily: 'Material Symbols Outlined', color: f.color }}>
                  {f.icon}
                </span>
              </div>
              <h3 className="text-white font-bold text-lg mb-3">{f.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Subjects Section */}
      <section id="subjects" className="relative z-10 max-w-7xl mx-auto px-8 py-20">
        <div className="text-center mb-12">
          <p className="text-xs uppercase tracking-widest text-violet-400 mb-3">12 Subjects</p>
          <h2 className="text-4xl font-bold text-white">Practice any CS topic</h2>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { name: 'DSA', icon: '🌲' },
            { name: 'Operating Systems', icon: '⚙️' },
            { name: 'DBMS', icon: '🗄️' },
            { name: 'Computer Networks', icon: '🌐' },
            { name: 'OOP Concepts', icon: '📦' },
            { name: 'System Design', icon: '🏗️' },
            { name: 'Machine Learning', icon: '🤖' },
            { name: 'SQL', icon: '📊' },
            { name: 'Java', icon: '☕' },
            { name: 'Python', icon: '🐍' },
            { name: 'HR & Behavioral', icon: '🤝' },
            { name: 'Web Dev', icon: '🌍' },
          ].map((s, i) => (
            <div key={i}
              className="flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium text-zinc-300 border border-white/10 hover:border-violet-500/50 hover:text-white transition-all cursor-pointer"
              style={{ background: 'rgba(26,26,26,0.6)' }}
              onClick={() => navigate('/candidate/login')}>
              <span>{s.icon}</span>
              {s.name}
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 max-w-4xl mx-auto px-8 py-20 text-center">
        <div className="rounded-2xl p-12"
          style={{
            background: 'rgba(124,58,237,0.1)',
            border: '1px solid rgba(124,58,237,0.3)',
            backdropFilter: 'blur(20px)'
          }}>
          <h2 className="text-4xl font-bold text-white mb-4">Ready to ace your interview?</h2>
          <p className="text-zinc-400 mb-8">Join thousands of candidates practicing with AI-powered mock interviews.</p>
          <button
            onClick={() => navigate('/candidate/login')}
            className="px-8 py-4 rounded-xl text-white font-bold text-lg transition-all active:scale-95"
            style={{ background: '#7c3aed', boxShadow: '0 4px 30px rgba(124,58,237,0.4)' }}>
            Start for Free →
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full py-10 border-t border-white/5 relative z-10"
        style={{ background: '#09090b' }}>
        <div className="flex flex-col md:flex-row justify-between items-center max-w-7xl mx-auto px-8 gap-4">
          <div className="text-sm font-bold text-white uppercase tracking-tighter">InterviewPro</div>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Support', 'Careers'].map(item => (
              <a key={item} href="#"
                className="text-xs uppercase font-semibold text-zinc-500 hover:text-violet-400 transition-colors tracking-wide">
                {item}
              </a>
            ))}
          </div>
          <div className="text-xs text-zinc-500 uppercase tracking-wide">
            © 2026 InterviewPro
          </div>
        </div>
      </footer>
    </div>
  )
}