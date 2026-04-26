import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const subjects = ['all', 'dsa', 'ml', 'python', 'systemdesign', 'java', 'webdev', 'os', 'dbms', 'cn', 'oop', 'sql', 'hr']

export default function HRPortal() {
  const navigate = useNavigate()
  const [candidates, setCandidates] = useState([])
  const [filter, setFilter] = useState('all')
  const [savedIds, setSavedIds] = useState([])
  const [savedCount, setSavedCount] = useState(0)
  const [showSaved, setShowSaved] = useState(false)
  const [loading, setLoading] = useState(true)
  const [inviteSent, setInviteSent] = useState({})
  const [inviteLoading, setInviteLoading] = useState({})
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user || user.role !== 'hr') { navigate('/'); return }
    fetchCandidates()
  }, [filter])

  const fetchCandidates = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`https://interviewpro-api.onrender.com/api/hr/candidates?subject=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCandidates(res.data)
    } catch (err) { console.error(err) }
    setLoading(false)
  }

  const toggleSave = async (candidateId) => {
    try {
      const res = await axios.post(`https://interviewpro-api.onrender.com/api/hr/save/${candidateId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data.saved) setSavedIds(prev => [...prev, candidateId])
      else setSavedIds(prev => prev.filter(id => id !== candidateId))
      setSavedCount(res.data.total)
    } catch (err) { console.error(err) }
  }

  const sendInvite = async (candidateId) => {
    setInviteLoading(prev => ({ ...prev, [candidateId]: true }))
    try {
      await axios.post(`https://interviewpro-api.onrender.com/api/hr/invite/${candidateId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setInviteSent(prev => ({ ...prev, [candidateId]: true }))
    } catch (err) {
      console.error(err)
      alert('Failed to send invite. Please try again.')
    }
    setInviteLoading(prev => ({ ...prev, [candidateId]: false }))
  }

  const getScoreColor = (score) => {
    if (score >= 70) return '#4ade80'
    if (score >= 40) return '#facc15'
    return '#f87171'
  }

  const getInitials = (name) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  const avatarColors = ['#7c3aed', '#0d9488', '#ef4444', '#f59e0b', '#3b82f6', '#ec4899']

  return (
    <div className="min-h-screen bg-[#131313] text-white flex flex-col"
      style={{ fontFamily: 'Manrope, sans-serif' }}>

      <link href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />

      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-1/4 right-0 w-[600px] h-[600px] rounded-full blur-[120px]"
          style={{ background: 'rgba(13,148,136,0.05)' }} />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-[100px]"
          style={{ background: 'rgba(124,58,237,0.04)' }} />
      </div>

      <header className="sticky top-0 w-full z-50 border-b border-white/10"
        style={{ background: 'rgba(9,9,11,0.8)', backdropFilter: 'blur(20px)' }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8 h-20">
          <div className="text-xl font-bold tracking-tighter text-white uppercase">
            InterviewPro
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowSaved(false)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all border"
              style={!showSaved ? {
                background: 'rgba(13,148,136,0.15)',
                borderColor: 'rgba(13,148,136,0.4)',
                color: '#6bd8cb'
              } : {
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#71717a'
              }}>
              Discover Talent
            </button>
            <button onClick={() => setShowSaved(true)}
              className="px-4 py-2 rounded-lg text-sm font-medium transition-all border flex items-center gap-2"
              style={showSaved ? {
                background: 'rgba(13,148,136,0.15)',
                borderColor: 'rgba(13,148,136,0.4)',
                color: '#6bd8cb'
              } : {
                borderColor: 'rgba(255,255,255,0.1)',
                color: '#71717a'
              }}>
              Saved
              {savedCount > 0 && (
                <span className="text-xs px-1.5 py-0.5 rounded-full text-white font-bold"
                  style={{ background: '#0d9488' }}>
                  {savedCount}
                </span>
              )}
            </button>
            <button onClick={() => { localStorage.clear(); navigate('/') }}
              className="px-4 py-2 rounded-lg text-sm border border-red-900/50 text-red-400 hover:bg-red-900/20 transition-all">
              Exit
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-5xl mx-auto px-6 py-12 w-full relative z-10">
        {!showSaved ? (
          <>
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-teal-400 mb-2">HR Portal</p>
              <h2 className="text-4xl font-bold text-white mb-2">Talent Discovery</h2>
              <p className="text-zinc-400">Pre-screened candidates ranked by AI interview performance</p>
            </div>

            <div className="flex gap-2 flex-wrap mb-8">
              {subjects.map(s => (
                <button key={s} onClick={() => setFilter(s)}
                  className="px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider border transition-all"
                  style={filter === s ? {
                    background: 'rgba(13,148,136,0.15)',
                    borderColor: 'rgba(13,148,136,0.5)',
                    color: '#6bd8cb'
                  } : {
                    background: 'rgba(26,26,26,0.6)',
                    borderColor: 'rgba(255,255,255,0.08)',
                    color: '#71717a'
                  }}>
                  {s === 'all' ? 'All Candidates' : s}
                </button>
              ))}
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-teal-500 border-t-transparent rounded-full animate-spin" />
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-400">No candidates found for this subject yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {candidates.map((c, i) => (
                  <div key={c._id} className="rounded-xl p-6 transition-all hover:border-white/15"
                    style={{
                      background: 'rgba(26,26,26,0.6)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(255,255,255,0.08)'
                    }}>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-lg flex-shrink-0"
                          style={{
                            background: `${avatarColors[i % avatarColors.length]}30`,
                            border: `1px solid ${avatarColors[i % avatarColors.length]}40`,
                            color: avatarColors[i % avatarColors.length]
                          }}>
                          {getInitials(c.name)}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-bold text-white text-lg">{c.name}</p>
                            {c.avgScore >= 75 && (
                              <span className="text-xs px-2 py-0.5 rounded-full font-semibold"
                                style={{
                                  background: 'rgba(245,158,11,0.15)',
                                  color: '#fbbf24',
                                  border: '1px solid rgba(245,158,11,0.3)'
                                }}>
                                Top Performer
                              </span>
                            )}
                          </div>

                          <div className="flex items-center gap-2 flex-wrap">
                            {c.skills.map(skill => (
                              <span key={skill}
                                className="text-xs px-2 py-0.5 rounded-full uppercase font-semibold"
                                style={{
                                  background: 'rgba(255,255,255,0.05)',
                                  color: '#71717a',
                                  border: '1px solid rgba(255,255,255,0.08)'
                                }}>
                                {skill}
                              </span>
                            ))}
                            {c.location && (
                              <span className="text-xs text-zinc-500">
                                {c.location}
                              </span>
                            )}
                            <span className="text-xs text-zinc-600">
                              {c.totalSessions} sessions
                            </span>
                          </div>

                          {c.openToWork && (
                            <div className="flex items-center gap-1.5 mt-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                              <span className="text-xs text-green-400 font-semibold">Open to work</span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className="text-4xl font-bold" style={{ color: getScoreColor(c.avgScore) }}>
                          {c.avgScore}
                        </p>
                        <p className="text-zinc-600 text-xs">avg score</p>
                      </div>
                    </div>

                    <div className="mt-4 mb-4">
                      <div className="w-full bg-white/5 rounded-full h-1">
                        <div className="h-1 rounded-full transition-all"
                          style={{ width: `${c.avgScore}%`, background: getScoreColor(c.avgScore) }} />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/5">
                      <button onClick={() => toggleSave(c._id)}
                        className="px-4 py-2 rounded-lg text-sm font-semibold border transition-all flex items-center gap-2"
                        style={savedIds.includes(c._id) ? {
                          background: 'rgba(13,148,136,0.15)',
                          borderColor: 'rgba(13,148,136,0.4)',
                          color: '#6bd8cb'
                        } : {
                          borderColor: 'rgba(255,255,255,0.1)',
                          color: '#71717a'
                        }}>
                        {savedIds.includes(c._id) ? 'Saved' : 'Save'}
                      </button>

                      <button
                        onClick={() => sendInvite(c._id)}
                        disabled={inviteSent[c._id] || inviteLoading[c._id]}
                        className="flex-1 py-2 rounded-lg text-sm font-semibold border transition-all flex items-center justify-center gap-2"
                        style={inviteSent[c._id] ? {
                          borderColor: 'rgba(74,222,128,0.4)',
                          color: '#4ade80',
                          background: 'rgba(74,222,128,0.1)'
                        } : inviteLoading[c._id] ? {
                          borderColor: 'rgba(255,255,255,0.1)',
                          color: '#71717a',
                          cursor: 'not-allowed'
                        } : {
                          borderColor: 'rgba(255,255,255,0.1)',
                          color: '#ffffff',
                          cursor: 'pointer'
                        }}>
                        {inviteLoading[c._id] ? 'Sending...' : inviteSent[c._id] ? 'Invite Sent!' : 'Send Interview Invite'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-teal-400 mb-2">HR Portal</p>
              <h2 className="text-4xl font-bold text-white mb-2">Saved Candidates</h2>
              <p className="text-zinc-400">Candidates you have bookmarked for later</p>
            </div>
            {savedIds.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-zinc-400 mb-6">No saved candidates yet.</p>
                <button onClick={() => setShowSaved(false)}
                  className="px-6 py-3 rounded-xl text-white font-semibold transition-all"
                  style={{ background: '#0d9488' }}>
                  Discover Talent
                </button>
              </div>
            ) : (
              <p className="text-zinc-400">Your saved candidates appear here.</p>
            )}
          </>
        )}
      </main>

      <footer className="w-full py-6 border-t border-white/5 relative z-10" style={{ background: '#09090b' }}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-8">
          <div className="text-xs font-bold text-white uppercase tracking-tighter">InterviewPro</div>
          <div className="text-xs text-zinc-600">2024 InterviewPro</div>
        </div>
      </footer>
    </div>
  )
}