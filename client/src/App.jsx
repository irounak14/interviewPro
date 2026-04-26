import { Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import CandidateLogin from './pages/CandidateLogin'
import HRLogin from './pages/HRLogin'
import SubjectSelect from './pages/SubjectSelect'
import Interview from './pages/Interview'
import Results from './pages/Results'
import History from './pages/History'
import HRPortal from './pages/HRPortal'
import Profile from './pages/Profile'
function App() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/candidate/login" element={<CandidateLogin />} />
        <Route path="/hr/login" element={<HRLogin />} />
        <Route path="/candidate/subjects" element={<SubjectSelect />} />
        <Route path="/candidate/interview/:subject" element={<Interview />} />
        <Route path="/candidate/results/:sessionId" element={<Results />} />
        <Route path="/candidate/history" element={<History />} />
        <Route path="/hr/portal" element={<HRPortal />} />
        <Route path="/candidate/profile" element={<Profile />} />
      </Routes>
    </div>
  )
}

export default App