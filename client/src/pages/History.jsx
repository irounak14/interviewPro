import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

export default function History() {
  const navigate = useNavigate()
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    axios.get('https://interviewpro-api.onrender.com/api/interview/my-sessions', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setSessions(res.data)
      setLoading(false)
    })
  }, [])

  const getScoreColor = (score) => {
    if (score >= 70) return '#4ade80'
    if (score >= 40) return '#facc15'
    return '#f87171'
  }

  const getGrade = (score) => {
    if (score >= 85) return 'Excellent'
    if (score >= 70) return 'Good'
    if (score >= 50) return 'Average'
    return 'Needs Work'
  }

  const totalAvg = sessions.length
    ? Math.round(sessions.reduce((sum, s) => sum + s.avgScore, 0) / sessions.length)
    : 0

  const bestScore = sessions.length
    ? Math.max(...sessions.map(s => s.avgScore))
    : 0

  return (
    <div className="min-h-screen bg-[#131313] text-white flex flex-col"
      style={{ fontFamily: 'Manrope, sans-serif' }}>

      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[500px] rounded-full blur-[120px]"
          style={{ background: 'rgba(124,58,237,0.05)' }} />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 w-full z-50 border-b border-white/10"
        style={{ background: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
          <div onClick={() => navigate('/candidate/subjects')}
            className="text-xl font-bold tracking-tighter text-white uppercase cursor-pointer">
            InterviewPro
          </div>
          <div className="flex gap-3">
            <button onClick={() => navigate('/candidate/subjects')}
              className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all"
              style={{ background: '#7c3aed' }}>
              Practice
            </button>
            <button
              onClick={() => { localStorage.clear(); navigate('/') }}
              className="px-4 py-2 rounded-lg text-sm border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-all">
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-4xl mx-auto px-6 py-12 w-full relative z-10">

        {/* Header */}
        <div className="mb-8">
          <p className="text-xs uppercase tracking-widest text-violet-400 mb-2">Dashboard</p>
          <h2 className="text-4xl font-bold text-white mb-2">My Results</h2>
          <p className="text-zinc-400">Track your interview performance over time</p>
        </div>

        {/* Stats Row */}
        {sessions.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mb-8">
            {[
              { label: 'Total Sessions', value: sessions.length, color: '#7c3aed', icon: 'history' },
              { label: 'Overall Average', value: `${totalAvg}`, color: getScoreColor(totalAvg), icon: 'analytics' },
              { label: 'Best Score', value: `${bestScore}`, color: '#4ade80', icon: 'emoji_events' },
            ].map((stat, i) => (
              <div key={i} className="rounded-xl p-6"
                style={{
                  background: 'rgba(26,26,26,0.6)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.08)'
                }}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="material-symbols-outlined text-sm"
                    style={{ fontFamily: 'Material Symbols Outlined', color: stat.color }}>
                    {stat.icon}
                  </span>
                  <p className="text-xs uppercase tracking-wider text-zinc-500">{stat.label}</p>
                </div>
                <p className="text-4xl font-bold" style={{ color: stat.color }}>{stat.value}</p>
              </div>
            ))}
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {!loading && sessions.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">🎯</p>
            <p className="text-zinc-400 mb-2 text-lg font-semibold">No sessions yet</p>
            <p className="text-zinc-600 text-sm mb-8">Start your first mock interview to see results here</p>
            <button onClick={() => navigate('/candidate/subjects')}
              className="px-6 py-3 rounded-xl text-white font-semibold transition-all active:scale-95"
              style={{ background: '#7c3aed', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
              Start First Interview
            </button>
          </div>
        )}

        {/* Sessions List */}
        <div className="flex flex-col gap-4">
          {sessions.map((s) => (
            <div key={s._id}
              onClick={() => navigate(`/candidate/results/${s._id}`)}
              className="cursor-pointer rounded-xl p-6 transition-all hover:border-white/20 hover:scale-[1.01] group"
              style={{
                background: 'rgba(26,26,26,0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255,255,255,0.08)'
              }}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl"
                    style={{ background: 'rgba(124,58,237,0.15)' }}>
                    {s.subject === 'dsa' ? '🌲'
                      : s.subject === 'python' ? '🐍'
                      : s.subject === 'java' ? '☕'
                      : s.subject === 'ml' ? '🤖'
                      : s.subject === 'webdev' ? '🌍'
                      : s.subject === 'os' ? '⚙️'
                      : s.subject === 'dbms' ? '🗄️'
                      : s.subject === 'cn' ? '🌐'
                      : s.subject === 'oop' ? '📦'
                      : s.subject === 'systemdesign' ? '🏗️'
                      : s.subject === 'sql' ? '📊'
                      : '🤝'}
                  </div>
                  <div>
                    <p className="font-bold text-white capitalize text-lg">{s.subject}</p>
                    <p className="text-zinc-500 text-sm">
                      {s.answers.length} questions · {new Date(s.completedAt).toLocaleDateString('en-IN', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="text-3xl font-bold" style={{ color: getScoreColor(s.avgScore) }}>
                      {s.avgScore}
                    </p>
                    <p className="text-zinc-600 text-xs">{getGrade(s.avgScore)}</p>
                  </div>
                  <span className="material-symbols-outlined text-zinc-600 group-hover:text-white transition-colors"
                    style={{ fontFamily: 'Material Symbols Outlined' }}>
                    chevron_right
                  </span>
                </div>
              </div>

              {/* Score bar */}
              <div className="w-full bg-white/5 rounded-full h-1">
                <div className="h-1 rounded-full transition-all"
                  style={{
                    width: `${s.avgScore}%`,
                    background: `linear-gradient(90deg, #7c3aed, ${getScoreColor(s.avgScore)})`
                  }} />
              </div>
            </div>
          ))}
        </div>

      </main>

      <footer className="w-full py-6 border-t border-white/5 relative z-10" style={{ background: '#09090b' }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8">
          <div className="text-xs font-bold text-white uppercase tracking-tighter">InterviewPro</div>
          <div className="text-xs text-zinc-600">© 2024 InterviewPro</div>
        </div>
      </footer>
    </div>
  )
}