import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const subjects = [
  { id: 'dsa', name: 'DSA', icon: '🌲', questions: 45, color: '#7c3aed' },
  { id: 'os', name: 'Operating Systems', icon: '⚙️', questions: 38, color: '#0d9488' },
  { id: 'dbms', name: 'DBMS', icon: '🗄️', questions: 42, color: '#f59e0b' },
  { id: 'cn', name: 'Computer Networks', icon: '🌐', questions: 35, color: '#3b82f6' },
  { id: 'oop', name: 'OOP Concepts', icon: '📦', questions: 40, color: '#ec4899' },
  { id: 'systemdesign', name: 'System Design', icon: '🏗️', questions: 28, color: '#f97316' },
  { id: 'ml', name: 'Machine Learning', icon: '🤖', questions: 32, color: '#8b5cf6' },
  { id: 'sql', name: 'SQL & Databases', icon: '📊', questions: 36, color: '#06b6d4' },
  { id: 'java', name: 'Java', icon: '☕', questions: 44, color: '#ef4444' },
  { id: 'python', name: 'Python', icon: '🐍', questions: 38, color: '#22c55e' },
  { id: 'hr', name: 'HR & Behavioral', icon: '🤝', questions: 30, color: '#f59e0b' },
  { id: 'webdev', name: 'Web Dev', icon: '🌍', questions: 33, color: '#0d9488' },
]

export default function SubjectSelect() {
  const navigate = useNavigate()
  const [selected, setSelected] = useState(null)
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.clear()
    navigate('/')
  }

  const handleStart = () => {
    if (!selected) return
    navigate(`/candidate/interview/${selected}`)
  }

  const selectedSubject = subjects.find(s => s.id === selected)

  return (
    <div className="min-h-screen bg-[#131313] text-white flex flex-col"
      style={{ fontFamily: 'Manrope, sans-serif' }}>

      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'rgba(124,58,237,0.05)' }} />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 w-full z-50 border-b border-white/10"
        style={{ background: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
          <div className="text-xl font-bold tracking-tighter text-white uppercase">
            InterviewPro
          </div>
          <div className="flex items-center gap-3">
            <span className="text-zinc-500 text-sm hidden md:block">
              Hi, {user?.name?.split(' ')[0]} 👋
            </span>
            <button
              onClick={() => navigate('/candidate/history')}
              className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white border border-white/10 hover:border-white/20 transition-all">
              My Results
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all border border-red-900/50 text-red-400 hover:bg-red-900/20">
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-8 py-12 w-full relative z-10">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs uppercase tracking-widest text-violet-400 mb-2">Step 1 of 2</p>
          <h2 className="text-4xl font-bold text-white mb-2">Choose a Subject</h2>
          <p className="text-zinc-400">Select a topic and start your AI-powered mock interview</p>
        </div>

        {/* Subject Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
          {subjects.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelected(s.id)}
              className="cursor-pointer rounded-xl p-6 flex flex-col transition-all hover:scale-105 group"
              style={{
                background: selected === s.id
                  ? `${s.color}15`
                  : 'rgba(26,26,26,0.6)',
                backdropFilter: 'blur(20px)',
                border: selected === s.id
                  ? `1px solid ${s.color}60`
                  : '1px solid rgba(255,255,255,0.08)',
                boxShadow: selected === s.id
                  ? `0 0 20px ${s.color}20`
                  : 'none'
              }}>

              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-2xl transition-transform group-hover:scale-110"
                style={{ background: `${s.color}15` }}>
                {s.icon}
              </div>

              <p className="text-white font-semibold text-sm mb-1">{s.name}</p>
              <p className="text-zinc-500 text-xs">{s.questions} questions</p>

              {selected === s.id && (
                <div className="flex items-center gap-1 mt-3 text-xs font-semibold"
                  style={{ color: s.color }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse"
                    style={{ background: s.color }} />
                  Selected
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Start Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleStart}
            disabled={!selected}
            className="flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white transition-all active:scale-95"
            style={selected ? {
              background: selectedSubject?.color || '#7c3aed',
              boxShadow: `0 4px 20px ${selectedSubject?.color || '#7c3aed'}40`
            } : {
              background: 'rgba(255,255,255,0.05)',
              color: '#52525b',
              cursor: 'not-allowed'
            }}>
            <span className="material-symbols-outlined text-sm"
              style={{ fontFamily: 'Material Symbols Outlined' }}>
              mic
            </span>
            {selected
              ? `Start ${selectedSubject?.name} Interview`
              : 'Select a Subject First'}
            {selected && (
              <span className="material-symbols-outlined text-sm"
                style={{ fontFamily: 'Material Symbols Outlined' }}>
                arrow_forward
              </span>
            )}
          </button>

          {selected && (
            <p className="text-zinc-500 text-sm">
              {selectedSubject?.questions} questions · ~15 mins
            </p>
          )}
        </div>

      </main>

      {/* Footer */}
      <footer className="w-full py-6 border-t border-white/5 relative z-10"
        style={{ background: '#09090b' }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8">
          <div className="text-xs font-bold text-white uppercase tracking-tighter">InterviewPro</div>
          <div className="text-xs text-zinc-600">© 2024 InterviewPro</div>
        </div>
      </footer>

    </div>
  )
}