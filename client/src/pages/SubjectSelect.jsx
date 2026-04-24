import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const subjects = [
  { id: 'dsa', name: 'DSA', icon: '🌲', questions: 45 },
  { id: 'os', name: 'Operating Systems', icon: '⚙️', questions: 38 },
  { id: 'dbms', name: 'DBMS', icon: '🗄️', questions: 42 },
  { id: 'cn', name: 'Computer Networks', icon: '🌐', questions: 35 },
  { id: 'oop', name: 'OOP Concepts', icon: '📦', questions: 40 },
  { id: 'systemdesign', name: 'System Design', icon: '🏗️', questions: 28 },
  { id: 'ml', name: 'Machine Learning', icon: '🤖', questions: 32 },
  { id: 'sql', name: 'SQL & Databases', icon: '📊', questions: 36 },
  { id: 'java', name: 'Java', icon: '☕', questions: 44 },
  { id: 'python', name: 'Python', icon: '🐍', questions: 38 },
  { id: 'hr', name: 'HR & Behavioral', icon: '🤝', questions: 30 },
  { id: 'webdev', name: 'Web Dev', icon: '🌍', questions: 33 },
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

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">

      {/* Navbar */}
      <div className="w-full px-8 py-4 flex items-center justify-between border-b border-gray-800">
        <h1 className="text-xl font-bold">
          <span className="text-white">Interview</span>
          <span className="text-purple-500">Pro</span>
        </h1>
        <div className="flex gap-3">
          <button
            onClick={() => navigate('/candidate/results')}
            className="px-4 py-2 border border-gray-700 rounded-lg text-sm hover:border-purple-500 transition-all"
          >
            My Results
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-red-800 text-red-400 rounded-lg text-sm hover:bg-red-900/20 transition-all"
          >
            Exit
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-1">Choose a Subject</h2>
        <p className="text-gray-400 text-sm mb-8">
          Select a topic and start your AI-powered mock interview
        </p>

        {/* Subject Grid */}
        <div className="grid grid-cols-4 gap-4 mb-10">
          {subjects.map((s) => (
            <div
              key={s.id}
              onClick={() => setSelected(s.id)}
              className={`cursor-pointer rounded-xl p-5 flex flex-col items-center text-center border transition-all
                ${selected === s.id
                  ? 'border-purple-500 bg-purple-900/20'
                  : 'border-gray-700 bg-[#1a1a1a] hover:border-gray-500'
                }`}
            >
              <span className="text-3xl mb-3">{s.icon}</span>
              <p className="text-white text-sm font-semibold">{s.name}</p>
              <p className="text-gray-500 text-xs mt-1">{s.questions} questions</p>
            </div>
          ))}
        </div>

        {/* Start Button */}
        <button
          onClick={handleStart}
          disabled={!selected}
          className={`px-6 py-3 rounded-lg font-semibold transition-all
            ${selected
              ? 'bg-purple-600 hover:bg-purple-700 text-white'
              : 'bg-gray-800 text-gray-500 cursor-not-allowed'
            }`}
        >
          Start Interview →
        </button>
      </div>

    </div>
  )
}