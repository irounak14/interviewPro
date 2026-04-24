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
  const token = localStorage.getItem('token')
  const user = JSON.parse(localStorage.getItem('user'))

  useEffect(() => {
    if (!user || user.role !== 'hr') {
      navigate('/')
      return
    }
    fetchCandidates()
  }, [filter])

  const fetchCandidates = async () => {
    setLoading(true)
    try {
      const res = await axios.get(`https://interviewpro-api.onrender.com/api/hr/candidates?subject=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      setCandidates(res.data)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  const toggleSave = async (candidateId) => {
    try {
      const res = await axios.post(`https://interviewpro-api.onrender.com/api/hr/save/${candidateId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.data.saved) {
        setSavedIds(prev => [...prev, candidateId])
      } else {
        setSavedIds(prev => prev.filter(id => id !== candidateId))
      }
      setSavedCount(res.data.total)
    } catch (err) {
      console.error(err)
    }
  }

  const getScoreColor = (score) => {
    if (score >= 70) return 'text-green-400'
    if (score >= 40) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getInitials = (name) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const avatarColors = ['bg-purple-700', 'bg-teal-700', 'bg-red-700', 'bg-yellow-700', 'bg-blue-700']

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* Navbar */}
      <div className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-xl font-bold">
          <span className="text-white">Interview</span>
          <span className="text-teal-500">Pro</span>
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => setShowSaved(false)}
            className={`px-4 py-2 rounded-lg text-sm border transition-all ${!showSaved ? 'border-teal-500 text-teal-400' : 'border-gray-700 text-gray-400'}`}
          >
            Discover Talent
          </button>
          <button
            onClick={() => setShowSaved(true)}
            className={`px-4 py-2 rounded-lg text-sm border transition-all ${showSaved ? 'border-teal-500 text-teal-400' : 'border-gray-700 text-gray-400'}`}
          >
            Saved {savedCount > 0 && <span className="ml-1 bg-teal-600 text-white text-xs px-1.5 py-0.5 rounded-full">{savedCount}</span>}
          </button>
          <button
            onClick={() => { localStorage.clear(); navigate('/') }}
            className="px-4 py-2 border border-red-800 text-red-400 rounded-lg text-sm"
          >
            Exit
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {!showSaved ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-1">Talent Discovery Portal</h2>
              <p className="text-gray-400 text-sm">Pre-screened candidates ranked by AI interview performance</p>
            </div>

            {/* Filter Pills */}
            <div className="flex gap-2 flex-wrap mb-8">
              {subjects.map(s => (
                <button
                  key={s}
                  onClick={() => setFilter(s)}
                  className={`px-4 py-1.5 rounded-full text-sm border transition-all capitalize ${
                    filter === s
                      ? 'border-teal-500 bg-teal-900/20 text-teal-400'
                      : 'border-gray-700 text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {s === 'all' ? 'All Candidates' : s.toUpperCase()}
                </button>
              ))}
            </div>

            {/* Candidates List */}
            {loading ? (
              <p className="text-gray-400 text-center py-10">Loading candidates...</p>
            ) : candidates.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔍</p>
                <p className="text-gray-400">No candidates found for this subject yet.</p>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {candidates.map((c, i) => (
                  <div key={c._id} className="bg-[#1a1a1a] border border-gray-700 rounded-xl p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${avatarColors[i % avatarColors.length]}`}>
                          {getInitials(c.name)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-lg">{c.name}</p>
                            {c.avgScore >= 75 && (
                              <span className="text-xs bg-yellow-900/30 border border-yellow-700 text-yellow-400 px-2 py-0.5 rounded-full">
                                ⭐ Top Performer
                              </span>
                            )}
                          </div>

                          {/* Skills */}
                          <div className="flex gap-2 mt-1 flex-wrap">
                            {c.skills.map(skill => (
                              <span key={skill} className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded capitalize">
                                {skill}
                              </span>
                            ))}
                            {c.location && (
                              <span className="text-xs text-gray-500">📍 {c.location}</span>
                            )}
                            <span className="text-xs text-gray-500">· {c.totalSessions} sessions</span>
                          </div>

                          {c.openToWork && (
                            <span className="inline-block mt-2 text-xs bg-green-900/20 border border-green-800 text-green-400 px-2 py-0.5 rounded-full">
                              ● Open to work
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Score */}
                      <div className="text-right">
                        <p className={`text-3xl font-bold ${getScoreColor(c.avgScore)}`}>
                          {c.avgScore}%
                        </p>
                        <p className="text-gray-500 text-xs">avg score</p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-4 pt-4 border-t border-gray-700">
                      <button
                        onClick={() => toggleSave(c._id)}
                        className={`px-4 py-2 rounded-lg text-sm border transition-all ${
                          savedIds.includes(c._id)
                            ? 'border-teal-500 text-teal-400 bg-teal-900/20'
                            : 'border-gray-700 text-gray-400 hover:border-teal-500'
                        }`}
                      >
                        {savedIds.includes(c._id) ? '✓ Saved' : 'Save Candidate'}
                      </button>
                      <button className="flex-1 border border-gray-700 hover:border-teal-500 text-white py-2 rounded-lg text-sm transition-all">
                        Send Interview Invite
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
              <h2 className="text-2xl font-bold mb-1">Saved Candidates</h2>
              <p className="text-gray-400 text-sm">Candidates you've bookmarked</p>
            </div>
            {savedIds.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-4xl mb-4">🔖</p>
                <p className="text-gray-400">No saved candidates yet.</p>
              </div>
            ) : (
              <p className="text-gray-400">Your saved candidates will appear here.</p>
            )}
          </>
        )}
      </div>
    </div>
  )
}