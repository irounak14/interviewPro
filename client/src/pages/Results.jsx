import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'

export default function Results() {
  const { sessionId } = useParams()
  const navigate = useNavigate()
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  useEffect(() => {
    axios.get(`https://interviewpro-api.onrender.com/api/interview/session/${sessionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      setSession(res.data)
      setLoading(false)
    }).catch(() => navigate('/candidate/subjects'))
  }, [])

  if (loading) return (
    <div className="min-h-screen bg-[#131313] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-zinc-400 text-sm">Loading your results...</p>
      </div>
    </div>
  )

  const { answers, avgScore, subject } = session

  const getScoreColor = (score) => {
    if (score >= 70) return '#4ade80'
    if (score >= 40) return '#facc15'
    return '#f87171'
  }

  const getGrade = (score) => {
    if (score >= 85) return { label: 'Excellent', color: '#4ade80' }
    if (score >= 70) return { label: 'Good', color: '#4ade80' }
    if (score >= 50) return { label: 'Average', color: '#facc15' }
    return { label: 'Needs Work', color: '#f87171' }
  }

  const grade = getGrade(avgScore)
  const goodAnswers = answers.filter(a => a.score >= 70).length
  const needsWork = answers.filter(a => a.score < 40).length

  return (
    <div className="min-h-screen bg-[#131313] text-white"
      style={{ fontFamily: 'Manrope, sans-serif' }}>

      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      {/* Background glow */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[120px]"
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
            <button onClick={() => navigate('/candidate/history')}
              className="px-4 py-2 rounded-lg text-sm text-zinc-400 hover:text-white transition-all border border-white/10 hover:border-white/20">
              My Results
            </button>
            <button onClick={() => navigate('/candidate/subjects')}
              className="px-4 py-2 rounded-lg text-sm text-white font-semibold transition-all"
              style={{ background: '#7c3aed' }}>
              Practice Again
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-12 relative z-10">

        {/* Hero Score Card */}
        <div className="rounded-xl p-10 mb-8 relative overflow-hidden"
          style={{
            background: 'rgba(26,26,26,0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)'
          }}>

          {/* Glow behind score */}
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-[80px] pointer-events-none"
            style={{ background: `${getScoreColor(avgScore)}15` }} />

          <div className="relative z-10">
            <div className="flex justify-between items-start mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-zinc-500 mb-2">Interview Complete</p>
                <h2 className="text-3xl font-bold text-white capitalize">{subject} Interview</h2>
                <p className="text-zinc-400 text-sm mt-1">{answers.length} questions answered</p>
              </div>
              <div className="text-right">
                <p className="text-7xl font-bold" style={{ color: getScoreColor(avgScore) }}>
                  {avgScore}
                </p>
                <p className="text-zinc-500 text-sm">out of 100</p>
                <p className="text-lg font-semibold mt-1" style={{ color: grade.color }}>
                  {grade.label}
                </p>
              </div>
            </div>

            {/* Progress bar */}
            <div className="mb-8">
              <div className="w-full bg-white/5 rounded-full h-2">
                <div className="h-2 rounded-full transition-all duration-1000"
                  style={{
                    width: `${avgScore}%`,
                    background: `linear-gradient(90deg, #7c3aed, ${getScoreColor(avgScore)})`
                  }} />
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/10">
              <div className="text-center">
                <p className="text-3xl font-bold text-violet-400">{answers.length}</p>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mt-1">Questions</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-green-400">{goodAnswers}</p>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mt-1">Good Answers</p>
              </div>
              <div className="text-center">
                <p className="text-3xl font-bold text-red-400">{needsWork}</p>
                <p className="text-zinc-500 text-xs uppercase tracking-wider mt-1">Need Improvement</p>
              </div>
            </div>
          </div>
        </div>

        {/* Question Breakdown */}
        <h3 className="text-lg font-bold uppercase tracking-wider text-zinc-400 mb-4">
          Question Breakdown
        </h3>

        <div className="flex flex-col gap-4 mb-8">
          {answers.map((a, i) => (
            <div key={i} className="rounded-xl p-6 transition-all hover:border-white/20"
              style={{
                background: 'rgba(26,26,26,0.6)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${getScoreColor(a.score)}30`
              }}>

              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs uppercase tracking-wider text-zinc-500">Q{i + 1}</span>
                    <span className="text-xs px-2 py-0.5 rounded-full"
                      style={{
                        background: `${getScoreColor(a.score)}15`,
                        color: getScoreColor(a.score)
                      }}>
                      {a.score >= 70 ? 'Good' : a.score >= 40 ? 'Average' : 'Needs Work'}
                    </span>
                  </div>
                  <p className="text-white font-semibold">{a.question}</p>
                </div>
                <div className="ml-6 text-right">
                  <p className="text-3xl font-bold" style={{ color: getScoreColor(a.score) }}>
                    {a.score}
                  </p>
                  <p className="text-zinc-600 text-xs">/ 100</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="w-full bg-white/5 rounded-full h-1 mb-4">
                <div className="h-1 rounded-full"
                  style={{
                    width: `${a.score}%`,
                    background: getScoreColor(a.score)
                  }} />
              </div>

              {a.answer && (
                <div className="rounded-lg p-4 mb-3"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-xs uppercase tracking-wider text-zinc-600 mb-2">Your Answer</p>
                  <p className="text-zinc-300 text-sm leading-relaxed">{a.answer}</p>
                </div>
              )}

              <div className="rounded-lg p-4"
                style={{ background: `${getScoreColor(a.score)}08`, border: `1px solid ${getScoreColor(a.score)}20` }}>
                <p className="text-xs uppercase tracking-wider text-zinc-500 mb-2">AI Feedback</p>
                <p className="text-zinc-300 text-sm leading-relaxed">{a.feedback}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => navigate(`/candidate/interview/${subject}`)}
            className="py-4 text-white font-semibold rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2"
            style={{ background: '#7c3aed', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
            <span className="material-symbols-outlined text-sm"
              style={{ fontFamily: 'Material Symbols Outlined' }}>replay</span>
            Retry Same Subject
          </button>
          <button
            onClick={() => navigate('/candidate/subjects')}
            className="py-4 text-white font-semibold rounded-xl transition-all active:scale-95 border border-white/10 hover:border-white/20">
            Choose New Subject
          </button>
        </div>

      </main>
    </div>
  )
}