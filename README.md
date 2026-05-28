# InterviewPro — AI-Powered Mock Interview Platform

## Project Title and Brief Description
InterviewPro is a full-stack AI-powered mock interview platform where candidates can practice technical interviews using their voice, receive real-time AI evaluation and scoring, and HR recruiters can discover top-performing candidates based on interview performance.

The platform uses voice recognition to capture candidate answers, sends them to Groq AI (Llama 3.3) for evaluation, and returns a score (0-100) with detailed feedback instantly.

Live URL: https://interviewpro.click

---

## Project Structure 
interviewpro/
├── client/                  # React Frontend
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Landing.jsx
│   │   │   ├── CandidateLogin.jsx
│   │   │   ├── HRLogin.jsx
│   │   │   ├── SubjectSelect.jsx
│   │   │   ├── Interview.jsx
│   │   │   ├── Results.jsx
│   │   │   ├── History.jsx
│   │   │   ├── HRPortal.jsx
│   │   │   ├── Profile.jsx
│   │   │   └── AuthCallback.jsx
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
└── server/                  # Node.js Backend
├── models/
│   ├── User.js
│   ├── Session.js
│   └── Question.js
├── routes/
│   ├── auth.js
│   ├── interview.js
│   └── hr.js
├── middleware/
│   └── authMiddleware.js
├── utils/
│   ├── passport.js
│   └── emailService.js
├── seed.js
├── server.js
└── package.json

## Technology Stack and Tools Used

### Frontend
| Technology | Purpose |
|-----------|---------|
| React.js | Frontend framework |
| Tailwind CSS | Styling and dark theme |
| GSAP (GreenSock) | Advanced animations |
| React Router DOM | Client-side routing |
| Axios | HTTP requests |
| React Google reCAPTCHA | Bot protection |
| Vite | Build tool |

### Backend
| Technology | Purpose |
|-----------|---------|
| Node.js | Runtime environment |
| Express.js | REST API framework |
| MongoDB Atlas | Cloud database |
| Mongoose | MongoDB ODM |
| JWT | Authentication tokens |
| bcryptjs | Password hashing |
| Passport.js | Google OAuth |
| Nodemailer | Email notifications |

### AI & External Services
| Service | Purpose |
|---------|---------|
| Groq API (Llama 3.3 70B) | AI answer evaluation |
| Web Speech API | Browser voice recognition |
| Google OAuth 2.0 | Social login |
| Google reCAPTCHA | Security |

### Deployment
| Platform | Purpose |
|---------|---------|
| Vercel | Frontend hosting |
| Render | Backend hosting |
| MongoDB Atlas | Database hosting |
| Spaceship | Custom domain (interviewpro.click) |

---

## Features and Functionalities Implemented

### Candidate Portal
- Register/Login with email & password or Google OAuth
- reCAPTCHA bot protection on login forms
- Select from 12 CS subjects for mock interview
- Voice-based interview — speak answers using microphone
- Real-time speech-to-text transcription via Web Speech API
- AI evaluation — Groq Llama 3.3 scores answers 0-100
- Detailed AI feedback per question
- Results page with overall score, grade, and per-question breakdown
- Session history — view all past interview sessions
- Candidate profile with editable name, location, Open to Work toggle

### HR/Recruiter Portal
- Separate HR login and registration
- Talent Discovery Portal — view all candidates ranked by AI score
- Filter candidates by subject (DSA, ML, Python, etc.)
- Save/bookmark candidates for later
- Send Interview Invite via email directly from platform
- Top Performer badge for candidates scoring 75+

### Subjects Available (12 total)
DSA, Operating Systems, DBMS, Computer Networks, OOP Concepts, System Design, Machine Learning, SQL & Databases, Java, Python, HR & Behavioral, Web Development

### Security Features
- JWT-based authentication
- Password hashing with bcrypt
- Google reCAPTCHA v2
- Google OAuth 2.0
- CORS protection
- Environment variables for all secrets

---

## Installation/Execution Steps to Run the Project

### Prerequisites
- Node.js v18+ installed
- MongoDB Atlas account (free)
- Groq API key (free at console.groq.com)
- Google OAuth credentials

## Installation/Execution Steps to Run the Project

---

## Backend Setup

```bash
cd server
npm install
```

Create `.env` file inside server folder and add required environment variables.

Run backend:

```bash
npm start
```

---

## Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

---

## Project Workflow

1. Candidate logs in
2. Selects interview subject
3. Answers questions using microphone
4. Speech converts to text
5. AI evaluates answer using Groq Llama 3.3
6. Score and feedback generated instantly
7. HR portal ranks candidates based on scores

---

## Future Enhancements

* Webcam-based interview analysis
* AI emotion detection
* Resume parsing
* Company-wise interview rounds
* Live coding interviews
* AI-generated interview questions
