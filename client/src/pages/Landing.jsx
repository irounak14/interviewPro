import { useNavigate } from 'react-router-dom'

export default function Landing() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex flex-col items-center justify-center px-4">
      
      {/* Navbar */}
      <div className="absolute top-0 left-0 w-full px-8 py-4 flex items-center border-b border-gray-800">
        <h1 className="text-xl font-bold">
          <span className="text-white">Interview</span>
          <span className="text-purple-500">Pro</span>
        </h1>
      </div>

      {/* Hero */}
      <div className="text-center mb-12">
        <h2 className="text-5xl font-bold mb-4">
          Ace Your Next <span className="text-purple-400">Interview</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-md mx-auto">
          AI-powered mock interviews with real-time feedback. Practice, improve,
          and get noticed by top recruiters.
        </p>
      </div>

      {/* Role Cards */}
      <div className="flex gap-6 mb-10">
        <div
          onClick={() => navigate('/candidate/login')}
          className="cursor-pointer bg-[#1a1a1a] border border-gray-700 hover:border-purple-500 rounded-xl p-6 w-56 transition-all"
        >
          <div className="text-3xl mb-3">🎓</div>
          <h3 className="text-white font-semibold text-lg mb-2">I'm a Candidate</h3>
          <p className="text-gray-400 text-sm">
            Practice mock interviews, get AI feedback, track your progress across 12 subjects
          </p>
        </div>

        <div
          onClick={() => navigate('/hr/login')}
          className="cursor-pointer bg-[#1a1a1a] border border-gray-700 hover:border-teal-500 rounded-xl p-6 w-56 transition-all"
        >
          <div className="text-3xl mb-3">🔍</div>
          <h3 className="text-white font-semibold text-lg mb-2">I'm an HR / Recruiter</h3>
          <p className="text-gray-400 text-sm">
            Discover pre-screened candidates, view interview scores, and connect with top talent
          </p>
        </div>
      </div>

      <p className="text-gray-600 text-sm"></p>

      {/* Stats */}
      <div className="absolute bottom-0 w-full flex justify-around border-t border-gray-800 py-6 px-8">
        <div className="text-center">
          <p className="text-purple-400 text-2xl font-bold">12</p>
          <p className="text-gray-500 text-sm">Interview Subjects</p>
        </div>
        <div className="text-center">
          <p className="text-teal-400 text-2xl font-bold">Real AI</p>
          <p className="text-gray-500 text-sm">Adaptive Questions</p>
        </div>
        <div className="text-center">
          <p className="text-green-400 text-2xl font-bold">Live</p>
          <p className="text-gray-500 text-sm">Instant Feedback</p>
        </div>
      </div>

    </div>
  )
}